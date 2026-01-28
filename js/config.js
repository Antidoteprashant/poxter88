/**
 * POXTER88 - Supabase Configuration
 * Replace the placeholders below with your project credentials
 */

const SUPABASE_URL = 'https://aoyrnygbnkzjdmxxxoiz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFveXJueWdibmt6amRteHh4b2l6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1OTYzMjIsImV4cCI6MjA4NTE3MjMyMn0.ZuwqI9drW_bRoFZ5_7Gels3kMvqjI76OjKUOsrh31h0';

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
