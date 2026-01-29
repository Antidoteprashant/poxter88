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

-- Admin policies (can be adjusted based on needs)
CREATE POLICY "Enable all access for admin cleanup" ON public.products FOR ALL USING (true);
CREATE POLICY "Enable all access for admin orders" ON public.orders FOR ALL USING (true);

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
