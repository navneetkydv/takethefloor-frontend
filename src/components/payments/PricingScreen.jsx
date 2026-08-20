// src/components/payments/PricingScreen.jsx

import { useState } from 'react';
import { usePayment } from '../../features/payments/usePayment.js';

const PLANS = [
  { id: 'trial', label: 'Trial', price: '₹49', period: '7 days' },
  { id: 'monthly', label: 'Monthly', price: '₹299', period: 'per month' },
];

export function PricingScreen() {
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [couponCode, setCouponCode] = useState('');
  const { pay, status, error } = usePayment();

  const handleSubscribe = () => {
    pay({ planType: selectedPlan, couponCode: couponCode.trim() || undefined });
  };

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-neutral-900 p-8 text-center text-white">
      <p className="text-lg font-medium">Subscribe to start practicing</p>
      <p className="mt-2 text-sm text-gray-400">
        Unlock daily speaking practice with AI feedback.
      </p>

      <div className="mt-6 flex flex-col gap-3">
        {PLANS.map((plan) => (
          <button
            key={plan.id}
            onClick={() => setSelectedPlan(plan.id)}
            className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors ${
              selectedPlan === plan.id
                ? 'border-violet-400 bg-violet-500/10'
                : 'border-white/10 hover:bg-white/5'
            }`}
          >
            <span className="font-medium">{plan.label}</span>
            <span className="text-sm text-gray-400">
              {plan.price} <span className="text-gray-500">/ {plan.period}</span>
            </span>
          </button>
        ))}
      </div>

      <input
        type="text"
        placeholder="Coupon code (optional)"
        value={couponCode}
        onChange={(e) => setCouponCode(e.target.value)}
        className="mt-4 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm placeholder:text-gray-500 focus:border-violet-400 focus:outline-none"
      />

      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

      <button
        onClick={handleSubscribe}
        disabled={status === 'processing'}
        className="mt-6 w-full rounded-full bg-violet-500 px-6 py-3 font-medium text-white hover:bg-violet-600 disabled:opacity-50"
      >
        {status === 'processing' ? 'Processing...' : 'Unlock my analysis →'}
      </button>
    </div>
  );
}