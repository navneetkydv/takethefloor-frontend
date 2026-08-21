// src/pages/checkout/CheckoutPage.jsx
//
// Reads ?plan=7day|14day from the URL, lets the user apply a coupon
// (validated live against the backend before payment), then triggers
// Razorpay Checkout via usePayment. On success, redirects to /app.

import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { usePayment } from '../../features/payments/usePayment.js';
import { validateCoupon } from '../../features/payments/payments.api.js';

const PLAN_DETAILS = {
  'trial': { title: '7-day Impromptu Challenge', regular: 249, offer: 49 },
  'monthly': { title: '30-day Impromptu Challenge', regular: 449, offer: 99 },
};

export function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const planKey = searchParams.get('plan');
  const plan = PLAN_DETAILS[planKey];

  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null); // { discountPercent, discountedAmountPaise }
  const [couponError, setCouponError] = useState(null);
  const [couponChecking, setCouponChecking] = useState(false);

  const { pay, status, error: paymentError } = usePayment();

  if (!plan) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-neutral-950 text-white">
        <p>Unknown plan. <button onClick={() => navigate('/')} className="underline">Go back</button></p>
      </main>
    );
  }

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponChecking(true);
    setCouponError(null);
    try {
      const result = await validateCoupon({ code: couponInput.trim(), planType: planKey });
      setAppliedCoupon(result);
    } catch (err) {
      setAppliedCoupon(null);
      setCouponError(err.body?.error || 'Invalid or expired coupon code');
    } finally {
      setCouponChecking(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponError(null);
  };

  const handlePay = async () => {
    const success = await pay({
      planType: planKey,
      couponCode: appliedCoupon ? couponInput.trim() : undefined,
    });
    if (success) navigate('/app');
  };

  const finalPaise = appliedCoupon ? appliedCoupon.discountedAmountPaise : plan.offer * 100;
  const finalRupees = (finalPaise / 100).toFixed(0);

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 p-6 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-neutral-900 p-8">
        <p className="text-sm text-gray-400">Checkout</p>
        <h1 className="mt-1 text-2xl font-semibold">{plan.title}</h1>

        <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-sm text-gray-400">
          <span>Plan price</span>
          <span className="text-gray-300 line-through">₹{plan.regular}</span>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>Offer price</span>
          <span className="text-gray-200">₹{plan.offer}</span>
        </div>

        {appliedCoupon && (
          <div className="flex items-center justify-between text-sm text-emerald-400">
            <span>Coupon ({appliedCoupon.discountPercent}% off)</span>
            <button onClick={removeCoupon} className="text-xs text-gray-500 underline hover:text-gray-300">
              Remove
            </button>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4 text-lg font-semibold">
          <span>Total</span>
          <span>₹{finalRupees}</span>
        </div>

        {!appliedCoupon && (
          <div className="mt-6 flex gap-2">
            <input
              type="text"
              placeholder="Coupon code"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
              className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm placeholder:text-gray-500 focus:border-violet-400 focus:outline-none"
            />
            <button
              onClick={handleApplyCoupon}
              disabled={couponChecking}
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 disabled:opacity-50"
            >
              {couponChecking ? '...' : 'Apply'}
            </button>
          </div>
        )}
        {couponError && <p className="mt-2 text-sm text-red-400">{couponError}</p>}

        {paymentError && <p className="mt-4 text-sm text-red-400">{paymentError}</p>}

        <button
          onClick={handlePay}
          disabled={status === 'processing'}
          className="mt-6 w-full rounded-full bg-violet-500 px-6 py-3 font-medium text-white hover:bg-violet-600 disabled:opacity-50"
        >
          {status === 'processing' ? 'Processing...' : `Pay ₹${finalRupees}`}
        </button>
      </div>
    </main>
  );
}