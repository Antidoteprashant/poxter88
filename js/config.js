/**
 * POXTER88 - Supabase Configuration
 * Using Vite's environment variables
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

// Initialize Supabase client
function initSupabase() {
    if (window.supabase) {
        window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('Supabase client initialized successfully');
    } else {
        // Retry if the library isn't loaded yet
        setTimeout(initSupabase, 100);
    }
}

initSupabase();
