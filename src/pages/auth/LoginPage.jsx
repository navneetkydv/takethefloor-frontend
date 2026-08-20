// src/pages/auth/LoginPage.jsx

import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store.js';

export function LoginPage() {
  const { user, isInitialized, signInWithGoogle } = useAuthStore();

  if (isInitialized && user) {
    return <Navigate to="/app" replace />;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-neutral-950 text-white">
      <h1 className="text-2xl font-semibold">Sign in to continue</h1>
      <button
        onClick={signInWithGoogle}
        className="rounded-lg border border-white/10 bg-white/5 px-6 py-3 hover:bg-white/10"
      >
        Continue with Google
      </button>
    </main>
  );
}