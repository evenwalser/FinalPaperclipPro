import { supabase } from '../supabase';

export async function uploadAsset(file: File, path: string) {
  const { data, error } = await supabase.storage
    .from('assets') // Create a new bucket for static assets
    .upload(path, file, {
      cacheControl: '31536000', // Cache for 1 year since it's static
      upsert: true
    });

  if (error) throw error;
  return data;
} 