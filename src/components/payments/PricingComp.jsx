// src/pages/landing/Pricing.jsx

import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store.js';

const BASE_FEATURES = [
  "Daily impromptu topic",
  "Analysis on filler words & pauses",
  "Coaching on clarity, confidence & word choice",
  "10 bonus recordings + analysis per day",
];

const PLANS = [
  {
    key: 'trial',
    title: "7-day Impromptu Challenge",
    tag: "Starter pack",
    regular: 249,
    offer: 49,
    features: BASE_FEATURES,
    cta: "Start 7-day challenge",
  },
  {
    key: 'monthly',
    title: "30-day Impromptu Challenge",
    tag: "For the committed",
    regular: 449,
    offer: 99,
    features: [...BASE_FEATURES, "Deeper, longer practice for more growth"],
    cta: "Start 30-day challenge",
    popular: true,
  },
];

function PricingRow({ label, value, variant = "feature" }) {
  const valueClasses = {
    feature: "text-xs uppercase tracking-wide text-neutral-400",
  }[variant];
  return (
    <div className="flex items-center justify-between gap-4 border-b border-neutral-900/10 py-3 text-sm">
      <span>{label}</span>
      <span className={valueClasses}>{value}</span>
    </div>
  );
}

function PricingCard({ planKey, title, tag, regular, offer, features = [], cta, popular }) {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const discount = Math.round(((regular - offer) / regular) * 100);

  const handleClick = () => {
    const checkoutPath = `/checkout?plan=${planKey}`;
    if (!user) {
      // Not signed in — send to login first, remembering where to land after.
      navigate(`/login?redirect=${encodeURIComponent(checkoutPath)}`);
    } else {
      navigate(checkoutPath);
    }
  };

  return (
    <div className="relative">
      {popular && (
        <span className="absolute -top-3 right-6 z-10 -rotate-3 rounded-sm bg-rose-400 px-3 py-1.5 text-center text-[10px] font-semibold uppercase leading-tight text-rose-950 shadow-sm">
          Most
          <br />
          popular
        </span>
      )}
      <div className="rounded-t-2xl bg-[#F4F1EA] px-6 pt-10 text-neutral-900 sm:px-8">
        <h3 className="text-center font-serif text-2xl italic leading-snug">
          {title}
        </h3>
        <p className="mt-2 text-center text-xs uppercase tracking-widest text-neutral-500">
          {tag}
        </p>

        <div className="mt-6 flex items-center justify-center gap-2 border-t border-neutral-900/10 pt-6">
          <span className="text-neutral-400 line-through">₹{regular}</span>
          <span className="font-serif text-3xl italic font-semibold">
            ₹{offer}
          </span>
        </div>
        <p className="text-center text-xs text-emerald-700">
          {discount}% off
        </p>

        <div className="mt-6 border-t border-neutral-900/10">
          {features.map((f) => (
            <PricingRow key={f} label={f} value="Incl." variant="feature" />
          ))}
        </div>

        <button
          type="button"
          onClick={handleClick}
          className={`mt-6 flex w-full items-center justify-between rounded-full px-6 py-3 text-sm font-medium ${
            popular
              ? "bg-amber-400 text-amber-950 hover:bg-amber-300"
              : "bg-neutral-900 text-white hover:bg-neutral-800"
          }`}
        >
          <span>
            {cta} — ₹{offer}
          </span>
          <span aria-hidden="true">→</span>
        </button>
      </div>
      <div
        aria-hidden="true"
        className="h-4"
        style={{
          backgroundImage:
            "linear-gradient(135deg, #F4F1EA 50%, transparent 50.5%), linear-gradient(225deg, #F4F1EA 50%, transparent 50.5%)",
          backgroundSize: "16px 16px",
          backgroundPosition: "top",
          backgroundRepeat: "repeat-x",
        }}
      />
    </div>
  );
}

export default function Pricing() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <h2 className="text-center text-2xl font-semibold sm:text-3xl">
        Join the{" "}
        <span className="font-serif italic text-violet-300">challenge</span>
      </h2>
      <p className="mx-auto mt-3 max-w-md text-center text-gray-400">
        Record for 60 seconds. Get AI-powered feedback on exactly what to improve.
      </p>
      <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 sm:items-start">
        {PLANS.map((p) => (
          <PricingCard key={p.key} planKey={p.key} {...p} />
        ))}
      </div>
    </section>
  );
}