// src/main.jsx

import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { useAuthStore } from './store/auth.store.js';

function Root() {
  const initialize = useAuthStore((s) => s.initialize);

  // Runs once. Entitlement fetch now kicks off from inside initialize()
  // itself the moment a session is confirmed, not from a separate effect
  // here — removes one render-cycle of delay before hasFetched flips true.
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