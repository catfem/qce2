import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase environment variables are missing.');
}

const projectRef = supabaseUrl.split('//')[1].split('.')[0];
const storageUrl = `https://${projectRef}.storage.supabase.co/storage/v1/s3`;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {},
    fetch: undefined,
    storageUrl: storageUrl
  }
});
