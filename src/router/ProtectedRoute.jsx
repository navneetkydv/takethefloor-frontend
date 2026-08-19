// src/router/ProtectedRoute.jsx
//
// Redirects to /login if there's no signed-in user. Waits for the auth
// store's initial session check to finish before deciding, so a logged-in
// user doesn't get bounced to /login for a split second on page refresh.

import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store.js';

export function ProtectedRoute({ children }) {
  const { user, isLoading, isInitialized } = useAuthStore();

  if (!isInitialized || isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}