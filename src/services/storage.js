import { supabase } from './auth.js';
import { STORAGE_BUCKET } from '../utils/constants.js';

export async function uploadToStorage(file, userId) {
  const extension = file.name.split('.').pop();
  const path = `${userId}/${Date.now()}-${crypto.randomUUID?.() || Math.random().toString(36).slice(2)}.${extension}`;
  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false
  });
  if (error) throw error;
  const { data: signedUrlData, error: signedError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .createSignedUrl(path, 60 * 60);
  if (signedError) throw signedError;
  return {
    path,
    signedUrl: signedUrlData.signedUrl
  };
}

export async function getPublicUrl(path) {
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
