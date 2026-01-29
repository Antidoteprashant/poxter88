-- POXTER88 Supabase Setup Script

-- 1. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY DEFAULT 'poster-' || floor(random() * 1000000)::text,
    name TEXT NOT NULL,
    brand TEXT DEFAULT 'POXTER88',
    price NUMERIC NOT NULL,
    original_price NUMERIC,
    category TEXT DEFAULT 'poster',
    is_on_sale BOOLEAN DEFAULT false,
    is_new BOOLEAN DEFAULT false,
    stock INTEGER DEFAULT 50,
    sizes TEXT[] DEFAULT ARRAY['A4'],
    image TEXT NOT NULL,
    image_hover TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY, -- order_id (e.g., poxterXXXX)
    user_id UUID REFERENCES auth.users(id),
    product_id TEXT, -- For simple cases, or we can use JSONB for items
    quantity INTEGER,
    total_price NUMERIC,
    status TEXT DEFAULT 'confirmed',
    customer_name TEXT,
    customer_email TEXT,
    customer_phone TEXT,
    customer_address TEXT,
    customer_city TEXT,
    customer_pincode TEXT,
    payment_method TEXT,
    payment_status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Note: In a production app, you might want an order_items table for multiple items per order.
-- For this setup, we'll store the core fields requested in the orders table.

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 4. Create Policies
-- Read products: Anyone can see
CREATE POLICY "Allow public read-only access to products" ON public.products
    FOR SELECT USING (true);

-- Manage products: Admins only (for demo, we can allow anon if needed, but better to lock)
-- CREATE POLICY "Allow service_role to manage products" ON public.products FOR ALL USING (auth.role() = 'service_role');
-- For simplicity in this demo, let's allow all actions if the user knows what they're doing (NOT FOR PRODUCTION)
CREATE POLICY "Allow authenticated users to insert orders" ON public.orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to see their own orders" ON public.orders
    FOR SELECT USING (auth.uid() = user_id);

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admins
        WHERE id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin policies
CREATE POLICY "Enable all access for admins on products" ON public.products
    FOR ALL USING (public.is_admin());

CREATE POLICY "Enable all access for admins on orders" ON public.orders
    FOR ALL USING (public.is_admin());

-- 5. Storage setup
-- Run these commands to initialize the products bucket and its policies
-- Note: You can also do this manually in the Supabase Dashboard -> Storage

-- Create the bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Allow public to see images
DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'products');

-- Policy: Allow all to upload for this demo (Consider restrictive policies for production)
DROP POLICY IF EXISTS "Public Upload Access" ON storage.objects;
CREATE POLICY "Public Upload Access"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'products');

DROP POLICY IF EXISTS "Public Update Access" ON storage.objects;
CREATE POLICY "Public Update Access"
ON storage.objects FOR UPDATE
USING (bucket_id = 'products');

DROP POLICY IF EXISTS "Public Delete Access" ON storage.objects;
CREATE POLICY "Public Delete Access"
ON storage.objects FOR DELETE
USING (bucket_id = 'products');

-- 6. User and Admin Profiles (Security Model)
-- IMPORTANT: Passwords are NOT stored here. They are handled by Supabase Auth (auth.users).
-- These tables link to auth.users.id to provide metadata and authorization status.

-- Users table for extended profile (Address, Phone, etc.)
CREATE TABLE IF NOT EXISTS public.users (
    -- id references the centralized Auth record
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    city TEXT,
    pincode TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Admins table for administrative authorization
-- If a user's UUID is here, they are granted admin privileges via public.is_admin()
CREATE TABLE IF NOT EXISTS public.admins (
    -- id references the centralized Auth record
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT, -- Stored for convenience and identifying admins in the table editor
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Policies for public.users
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Policies for public.admins
DROP POLICY IF EXISTS "Admins are viewable by authenticated users" ON public.admins;
CREATE POLICY "Admins are viewable by authenticated users" ON public.admins
    FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins can be managed by other admins" ON public.admins;
CREATE POLICY "Admins can be managed by other admins" ON public.admins
    FOR ALL USING (public.is_admin());

-- 7. Triggers for Auth Integration
-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, full_name, email, phone)
    VALUES (
        new.id,
        new.raw_user_meta_data->>'full_name',
        new.email,
        new.raw_user_meta_data->>'phone'
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
