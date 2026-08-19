// src/pages/app/DashboardPage.jsx

import { useEffect } from 'react';
import { useAuthStore } from '../../store/auth.store.js';
import { useEntitlementStore } from '../../store/entitlement.store.js';

export function DashboardPage() {
  const { user, signOut } = useAuthStore();
  const { isPaid, entitlement, fetch: fetchEntitlement } = useEntitlementStore();

  useEffect(() => {
    fetchEntitlement();
  }, [fetchEntitlement]);

  return (
    <main className="min-h-screen p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Welcome, {user?.name || user?.email}</h1>
        <button onClick={signOut} className="text-sm text-gray-500 hover:underline">
          Sign out
        </button>
      </div>

      <p className="mt-4">
        Plan status: {isPaid ? `Paid (${entitlement?.planType})` : 'Not subscribed'}
      </p>

      {/* Recorder component goes here next */}
    </main>
  );
}