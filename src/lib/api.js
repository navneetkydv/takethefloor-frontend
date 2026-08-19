// src/lib/api.js
//
// Thin fetch wrapper for your own backend (not Supabase directly). Attaches
// the current Supabase session's access token to every request automatically,
// so individual feature code never has to think about auth headers.

import { supabase } from './supabase.js';

const API_BASE = import.meta.env.VITE_API_BASE_URL; // e.g. http://localhost:3000/api

async function request(path, options = {}) {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      // Don't set Content-Type when sending FormData — the browser needs
      // to set it itself (with the multipart boundary included).
      ...(!(options.body instanceof FormData) && { 'Content-Type': 'application/json' }),
      ...options.headers,
    },
  });

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const body = isJson ? await res.json() : null;

  if (!res.ok) {
    const error = new Error(body?.message || body?.error || `Request failed: ${res.status}`);
    error.status = res.status;
    error.body = body;
    throw error;
  }

  return body;
}

export const api = {
  get: (path) => request(path, { method: 'GET' }),
  post: (path, body) => request(path, { method: 'POST', body: body instanceof FormData ? body : JSON.stringify(body) }),
  patch: (path, body) => request(path, { method: 'PATCH', body: JSON.stringify(body) }),
};