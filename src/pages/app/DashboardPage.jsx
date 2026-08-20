// src/pages/app/DashboardPage.jsx

import { useEffect } from 'react';
import { useAuthStore } from '../../store/auth.store.js';
import { useEntitlementStore } from '../../store/entitlement.store.js';
import { RecorderScreen } from '../../components/recorder/RecorderScreen.jsx';
import { PricingScreen } from '../../components/payments/PricingScreen.jsx';

export function DashboardPage() {
  const { user, signOut } = useAuthStore();
  const { isPaid, entitlement, isLoading, fetch: fetchEntitlement } = useEntitlementStore();

  useEffect(() => {
    fetchEntitlement();
  }, [fetchEntitlement]);

  return (
    <main className="min-h-screen bg-neutral-950 p-8 text-white">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Welcome, {user?.name || user?.email}</h1>
        <button onClick={signOut} className="text-sm text-gray-400 hover:text-white hover:underline">
          Sign out
        </button>
      </div>

      <p className="mt-2 text-sm text-gray-500">
        Plan status: {isPaid ? `Paid (${entitlement?.planType})` : 'Not subscribed'}
      </p>

      <div className="mt-8">
        {isLoading ? (
          <p className="text-gray-400">Loading...</p>
        ) : isPaid ? (
          <RecorderScreen />
        ) : (
          <PricingScreen />
        )}
      </div>
    </main>
  );
}