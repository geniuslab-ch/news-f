import { createClient } from '@supabase/supabase-js';

// Helper to get env vars safely or provide defaults to prevent build errors
const getSupabaseConfig = () => {
    return {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
        key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
    };
};

const config = getSupabaseConfig();

// Create a single supabase client for interacting with your database
export const supabase = createClient(config.url, config.key);

// Helper to create a client (for consistency)
export const createBrowserClient = () => {
    return supabase;
};
