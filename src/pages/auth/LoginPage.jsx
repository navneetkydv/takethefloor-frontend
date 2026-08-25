// src/pages/auth/LoginPage.jsx

import { Navigate, useSearchParams, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store.js';

export function LoginPage() {
  const { user, isInitialized, signInWithGoogle } = useAuthStore();
  const [searchParams] = useSearchParams();

  const next = searchParams.get('next');
  const plan = searchParams.get('plan');
  const redirectTo = next ? `${next}${plan ? `?plan=${plan}` : ''}` : '/app';

  if (isInitialized && user) {
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-neutral-950 px-6 text-white">
      {/* soft ambient glow, matches the rest of the site's dark aesthetic */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/20 blur-[120px]"
        aria-hidden="true"
      />

      <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm">
        <h1 className="font-serif text-2xl italic">
          Welcome <span className="text-violet-300">back</span>
        </h1>
        <p className="mt-2 text-sm text-gray-400">
          Sign in to keep building your speaking streak.
        </p>

        <button
          onClick={signInWithGoogle}
          className="mt-8 flex w-full items-center justify-center gap-3 rounded-full bg-white px-6 py-3 font-medium text-neutral-900 transition hover:bg-gray-100"
        >
          <GoogleIcon className="h-5 w-5" />
          Continue with Google
        </button>

        <p className="mt-6 text-xs text-gray-500">
          By continuing you agree to our{' '}
          <Link to="/terms" className="underline hover:text-gray-300">
            Terms
          </Link>{' '}
          and{' '}
          <Link to="/privacy" className="underline hover:text-gray-300">
            Privacy Policy
          </Link>
          .
        </p>
      </div>

      <Link to="/" className="relative mt-6 text-sm text-gray-500 hover:text-gray-300">
        ← Back to home
      </Link>
    </main>
  );
}

function GoogleIcon({ className }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.5 0 10.5-2.1 14.3-5.6l-6.6-5.6C29.6 34.7 26.9 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.6 5.6C39.9 37.3 44 31.4 44 24c0-1.3-.1-2.7-.4-3.5z"
      />
    </svg>
  );
}