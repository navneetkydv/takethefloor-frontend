// src/lib/supabase.js
//
// Single Supabase client instance for the whole app — Auth (Google sign-in)
// and session management. Talking to your own backend's data (recordings,
// payments, profile) goes through lib/api.js instead, not this client.

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);