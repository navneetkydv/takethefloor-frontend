// src/store/auth.store.js
//
// Wraps Supabase's session/auth state in Zustand so components never call
// supabase.auth directly — they read from this store and call its actions.
// initialize() must run once at app startup (see main.jsx).

import { create } from 'zustand';
import { supabase } from '../lib/supabase.js';

export const useAuthStore = create((set, get) => ({
  user: null,        // { id, email, name, avatarUrl } | null
  session: null,      // raw Supabase session, used for the access token
  isLoading: true,     // true until the initial session check completes
  isInitialized: false,

  initialize: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    set({
      session,
      user: session ? mapSupabaseUser(session.user) : null,
      isLoading: false,
      isInitialized: true,
    });

    // Keep the store in sync with sign-in/sign-out/token-refresh events
    // that happen after the initial load (e.g. completing the OAuth redirect).
    supabase.auth.onAuthStateChange((_event, session) => {
      set({
        session,
        user: session ? mapSupabaseUser(session.user) : null,
      });
    });
  },

  signInWithGoogle: async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' });
    // Browser redirects away here — no further code runs until the
    // redirect back, at which point onAuthStateChange (above) fires.
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null, user: null });
  },
}));

function mapSupabaseUser(supabaseUser) {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email,
    name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || null,
    avatarUrl: supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.picture || null,
  };
}