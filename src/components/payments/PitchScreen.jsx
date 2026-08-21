// src/components/payments/PitchScreen.jsx
//
// Shown to unpaid users before the pricing screen — makes the case for
// why this matters before asking for money. onContinue moves the parent
// to the actual PricingScreen.

import { useEffect, useState } from "react";
import { Mountain, Bug, Skull } from "lucide-react";

const FEARS = [
  { label: "Heights", icon: Mountain },
  { label: "Spiders", icon: Bug },
  { label: "Death", icon: Skull },
];

export function PitchScreen({ onContinue }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="mx-auto max-w-2xl px-6 text-center text-white">
      <h1 className="font-serif text-4xl font-bold leading-tight sm:text-5xl">
        Public speaking is the{" "}
        <span className="text-violet-400">#1 fear</span> in the world.
      </h1>

      <p className="mt-6 text-gray-400">Ranked above:</p>

      <div className="mt-6 grid grid-cols-3 gap-3 sm:gap-6">
        {FEARS.map(({ label, icon: Icon }, i) => (
          <div
            key={label}
            style={{ transitionDelay: `${i * 90}ms` }}
            className={`flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-8 transition-all duration-500 ease-out hover:border-violet-400/40 hover:bg-violet-500/10 sm:px-6 ${
              visible
                ? "translate-y-0 opacity-100"
                : "translate-y-2 opacity-0"
            }`}
          >
            <Icon className="h-8 w-8 text-gray-400" strokeWidth={1.5} />
            <span className="font-semibold">{label}</span>
          </div>
        ))}
      </div>

      <p className="mt-10 font-serif text-2xl font-bold leading-snug sm:text-3xl">
        Almost no one teaches us how to get past it.
      </p>

      <p className="mt-3 text-sm text-gray-400">
        That's what daily practice, with real feedback, actually fixes.
      </p>

      <button
        onClick={onContinue}
        className="group mx-auto mt-10 flex w-full max-w-xs items-center justify-center gap-2 rounded-full bg-violet-500 px-6 py-3 font-medium text-white transition hover:bg-violet-600"
      >
        Continue
        <span className="transition-transform group-hover:translate-x-1">
          →
        </span>
      </button>
    </div>
  );
}