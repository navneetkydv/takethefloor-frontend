// src/pages/checkout/CheckoutPage.jsx
//
// Reads ?plan=7day|14day from the URL, lets the user apply a coupon
// (validated live against the backend before payment), then triggers
// Razorpay Checkout via usePayment. On success, redirects to /app.
//
// Layout: split screen on laptop+ (brand image on the left, checkout
// form on the right). On mobile the image is dropped entirely so the
// form loads fast and stays the sole focus.

import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { usePayment } from '../../features/payments/usePayment.js';
import { validateCoupon } from '../../features/payments/payments.api.js';
import checkoutImg from '../../assets/checkout-panel.svg';

const PLAN_DETAILS = {
  trial: { title: '7-day Impromptu Challenge', regular: 249, offer: 49 },
  monthly: { title: '30-day Impromptu Challenge', regular: 449, offer: 99 },
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

  useEffect(() => {
    if (!couponError) return;
    const timer = setTimeout(() => setCouponError(null), 5000);
    return () => clearTimeout(timer);
  }, [couponError]);

  if (!plan) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-neutral-950 text-white">
        <p>
          Unknown plan.{' '}
          <button onClick={() => navigate('/')} className="underline">
            Go back
          </button>
        </p>
      </main>
    );
  }

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponChecking(true);
    setCouponError(null);
    try {
      const result = await validateCoupon({ code: couponInput.trim().toUpperCase(), planType: planKey });
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
      couponCode: appliedCoupon ? couponInput.trim().toUpperCase() : undefined,
    });
    if (success) navigate('/app');
  };

  const finalPaise = appliedCoupon ? appliedCoupon.discountedAmountPaise : plan.offer * 100;
  const finalRupees = (finalPaise / 100).toFixed(0);

  return (
    <main className="min-h-screen bg-neutral-950 text-white lg:flex">
      {/* Left: brand panel — desktop/laptop only */}
      <div className="relative hidden overflow-hidden lg:sticky lg:top-0 lg:block lg:h-screen lg:w-1/2">
        <img src={checkoutImg} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-neutral-950/10" />
        <div className="absolute inset-x-0 bottom-0 p-10 xl:p-14">
          <p className="font-serif text-2xl italic leading-tight text-violet-200 xl:text-4xl">
            Become dangerously articulate.
          </p>
          <div className="mt-8 flex gap-10">
            <BrandStat value="10K+" label="Daily reps logged" />
            <BrandStat value="+22%" label="Avg. clarity gain" />
          </div>
        </div>
      </div>

      {/* Right: checkout form */}
      <div className="flex flex-1 items-center justify-center px-6 py-10 sm:py-16 lg:w-1/2">
        <div className="w-full max-w-md">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 text-sm text-gray-500 hover:text-gray-300"
          >
            ← Back
          </button>

          <p className="text-sm text-gray-400">Checkout</p>
          <h1 className="mt-1 text-2xl font-semibold">{plan.title}</h1>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center justify-between text-sm text-gray-400">
              <span>Plan price</span>
              <span className="text-gray-300 line-through">₹{plan.regular}</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-sm text-gray-400">
              <span>Offer price</span>
              <span className="text-gray-200">₹{plan.offer}</span>
            </div>

            {appliedCoupon && (
              <div className="mt-1 flex items-center justify-between text-sm text-emerald-400">
                <span>Coupon ({appliedCoupon.discountPercent}% off)</span>
                <button
                  onClick={removeCoupon}
                  className="text-xs text-gray-500 underline hover:text-gray-300"
                >
                  Remove
                </button>
              </div>
            )}

            <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4 text-lg font-semibold">
              <span>Total</span>
              <span>₹{finalRupees}</span>
            </div>
          </div>

          {!appliedCoupon && (
            <div className="mt-4 flex gap-2">
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
                {couponChecking ? '…' : 'Apply'}
              </button>
            </div>
          )}
          {couponError && <p className="mt-2 text-sm text-red-400">{couponError}</p>}
          {paymentError && <p className="mt-4 text-sm text-red-400">{paymentError}</p>}

          <button
            onClick={handlePay}
            disabled={status === 'processing'}
            className="mt-6 w-full rounded-full bg-violet-500 px-6 py-3 font-medium text-white transition hover:bg-violet-600 disabled:opacity-50"
          >
            {status === 'processing' ? 'Processing…' : `Pay ₹${finalRupees}`}
          </button>

          <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-gray-500">
            <Lock className="h-3.5 w-3.5" strokeWidth={2} />
            Payments secured by Razorpay
          </p>
        </div>
      </div>
    </main>
  );
}

function BrandStat({ value, label }) {
  return (
    <div>
      <p className="text-xl font-semibold text-white">{value}</p>
      <p className="text-xs text-gray-400">{label}</p>
    </div>
  );
}