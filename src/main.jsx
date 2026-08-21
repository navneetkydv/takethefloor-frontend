// src/main.jsx

import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { useAuthStore } from './store/auth.store.js';
import { useEntitlementStore } from './store/entitlement.store.js';


function Root() {
  const initialize = useAuthStore((s) => s.initialize);
 const user = useAuthStore((s) => s.user);
  const fetchEntitlement = useEntitlementStore((s) => s.fetch);

  // Runs once, before anything checks auth.user (ProtectedRoute waits on
  // isInitialized so this race is handled correctly).
  useEffect(() => {
    initialize();
  }, [initialize]);
  useEffect(() => {
    if (user) fetchEntitlement();
  }, [user, fetchEntitlement]);

  return <App />;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>
);