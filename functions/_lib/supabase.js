import { createClient } from '@supabase/supabase-js';

export function getServiceSupabase(env) {
  const url = env.SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('Supabase service credentials are missing from environment.');
  }
  
  const projectRef = url.split('//')[1].split('.')[0];
  const storageUrl = `https://${projectRef}.storage.supabase.co/storage/v1/s3`;
  
  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    global: {
      headers: {},
      fetch: undefined,
      storageUrl: storageUrl
    }
  });
}
