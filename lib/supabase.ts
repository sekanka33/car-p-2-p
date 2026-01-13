import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isValidUrl = (url: string) => {
    try { return Boolean(new URL(url)); } catch (e) { return false; }
};

const urlToUse = isValidUrl(supabaseUrl) ? supabaseUrl : 'https://example.supabase.co';
const keyToUse = supabaseKey || 'dummy-key';

if (!isValidUrl(supabaseUrl) || !supabaseKey) {
    console.warn('Supabase credentials missing or invalid. Check .env file.');
}

export const supabase = createClient(urlToUse, keyToUse);
