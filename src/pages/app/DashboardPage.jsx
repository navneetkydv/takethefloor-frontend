// src/pages/app/DashboardPage.jsx

import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/auth.store.js';
import { useEntitlementStore } from '../../store/entitlement.store.js';
import { RecorderScreen } from '../../components/recorder/RecorderScreen.jsx';
import { PitchScreen } from '../../components/payments/PitchScreen.jsx';
import  PricingScreen  from '../../components/payments/PricingComp.jsx';

export function DashboardPage() {
  const { user, signOut } = useAuthStore();
  const { isPaid, entitlement, hasFetched, fetch: fetchEntitlement } = useEntitlementStore();
  const [unpaidStep, setUnpaidStep] = useState('pitch'); // 'pitch' | 'pricing'

  useEffect(() => {
    if (!hasFetched) fetchEntitlement();
  }, [hasFetched, fetchEntitlement]);

  const handlePitchContinue = async () => {
    // Re-check fresh entitlement right at the click — don't trust whatever
    // isPaid was when PitchScreen last rendered (e.g. fetch was still in
    // flight, or they paid in another tab). If they're actually paid,
    // isPaid flips via the store subscription and this component
    // re-renders straight to RecorderScreen — no need to touch unpaidStep.
    await fetchEntitlement();
    if (!useEntitlementStore.getState().isPaid) {
      setUnpaidStep('pricing');
    }
  };

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

      <div className="mt-8 flex justify-center">
        {!hasFetched ? (
          <p className="text-gray-400">Loading...</p>
        ) : isPaid ? (
          <RecorderScreen />
        ) : unpaidStep === 'pitch' ? (
          <PitchScreen onContinue={handlePitchContinue} />
        ) : (
          <PricingScreen />
        )}
      </div>
    </main>
  );
}