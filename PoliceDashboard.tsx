import { createClient } from '@supabase/supabase-js';

const envUrl = (import.meta as any).env.VITE_SUPABASE_URL;
const envKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

// Check if the provided URL is actually a valid HTTP/HTTPS URL
const isValidUrl = (url: string) => {
  if (!url) return false;
  try {
    new URL(url);
    return url.startsWith('http://') || url.startsWith('https://');
  } catch (e) {
    return false;
  }
};

const supabaseUrl = isValidUrl(envUrl) ? envUrl : 'https://mock-project.supabase.co';
const supabaseKey = envKey && envKey !== 'YOUR_SUPABASE_ANON_KEY' && envKey.trim() !== '' ? envKey : 'mock-anon-key';

export const isMockSupabase = supabaseUrl === 'https://mock-project.supabase.co';
export const supabase = createClient(supabaseUrl, supabaseKey);
