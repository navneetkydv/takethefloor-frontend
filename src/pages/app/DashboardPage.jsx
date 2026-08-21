// src/pages/app/DashboardPage.jsx
//
// Paid users go straight to the recorder. Unpaid users see the pitch
// screen first, then the pricing screen once they click Continue.
//
// Entitlement is usually already fetched in the background from main.jsx
// by the time this mounts, so we only fetch here if nothing's loaded yet
// (e.g. a hard refresh landing directly on /dashboard). No loading state
// is shown — the page just renders off whatever isPaid currently is,
// which flips to true the moment the fetch resolves.

import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/auth.store.js';
import { useEntitlementStore } from '../../store/entitlement.store.js';
import { RecorderScreen } from '../../components/recorder/RecorderScreen.jsx';
import { PitchScreen } from '../../components/payments/PitchScreen.jsx';
import  PricingScreen  from '../../components/payments/PricingComp.jsx';

export function DashboardPage() {
  const { user, signOut } = useAuthStore();
  const { isPaid, entitlement, fetch: fetchEntitlement } = useEntitlementStore();
  const [unpaidStep, setUnpaidStep] = useState('pitch'); // 'pitch' | 'pricing'

  useEffect(() => {
    if (!entitlement) fetchEntitlement();
  }, [entitlement, fetchEntitlement]);

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
        {isPaid ? (
          <RecorderScreen />
        ) : unpaidStep === 'pitch' ? (
          <PitchScreen onContinue={() => setUnpaidStep('pricing')} />
        ) : (
          <PricingScreen />
        )}
      </div>
    </main>
  );
}