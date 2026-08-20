// src/pages/app/DashboardPage.jsx

import { useEffect } from 'react';
import { useAuthStore } from '../../store/auth.store.js';
import { useEntitlementStore } from '../../store/entitlement.store.js';
import { RecorderScreen } from '../../components/recorder/RecorderScreen.jsx';

export function DashboardPage() {
  const { user, signOut } = useAuthStore();
  const { isPaid, entitlement, isLoading, fetch: fetchEntitlement } = useEntitlementStore();

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

      <p className="mt-4 text-sm text-gray-500">
        Plan status: {isPaid ? `Paid (${entitlement?.planType})` : 'Not subscribed'}
      </p>

      <div className="mt-8">
        {isLoading ? (
          <p>Loading...</p>
        ) : isPaid ? (
          <RecorderScreen />
        ) : (
          <div className="mx-auto max-w-md rounded-xl border border-gray-200 p-8 text-center">
            <p className="text-lg font-medium">Subscribe to start practicing</p>
            <p className="mt-2 text-sm text-gray-500">
              Unlock daily speaking practice with AI feedback.
            </p>
            {/* Payments flow wires in here next */}
          </div>
        )}
      </div>
      <div className="mt-8 text-sm text-gray-400">
         <RecorderScreen />
      </div>

    </main>
  );
}