// src/main.jsx

import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { useAuthStore } from './store/auth.store.js';

function Root() {
  const initialize = useAuthStore((s) => s.initialize);

  // Runs once, before anything checks auth.user (ProtectedRoute waits on
  // isInitialized so this race is handled correctly).
  useEffect(() => {
    initialize();
  }, [initialize]);

  return <App />;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>
);