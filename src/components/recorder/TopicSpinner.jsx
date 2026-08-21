// src/components/recorder/TopicSpinner.jsx
//
// Vertical "slot reel" topic picker. On mount (and whenever the category
// filter changes, or the user hits "Spin again") it scrolls a strip of
// topics downward past a highlighted center window, decelerates, and
// lands on a randomly chosen topic — which is reported via onSelect.

import { useEffect, useRef, useState } from 'react';
import { TOPICS } from '../../features/recordings/topics.data.js';

const ITEM_HEIGHT = 100; // px — height of a single reel row
const REEL_LENGTH = 26; // total filler rows rendered per spin
const SPIN_DURATION = 2600; // ms
const LANDING_INDEX = 1; // reel[LANDING_INDEX] is what the window centers on at rest

function getPool(selectedCategories) {
  if (!selectedCategories?.length) return TOPICS;
  const filtered = TOPICS.filter((t) => selectedCategories.includes(t.category));
  return filtered.length > 0 ? filtered : TOPICS;
}

function buildReel(pool) {
  const finalTopic = pool[Math.floor(Math.random() * pool.length)];
  const reel = Array.from(
    { length: REEL_LENGTH },
    () => pool[Math.floor(Math.random() * pool.length)]
  );
  reel[LANDING_INDEX] = finalTopic;
  return reel;
}

export function TopicSpinner({ selectedCategories = [], onSelect, disabled = false }) {
  const [reel, setReel] = useState(() => buildReel(getPool(selectedCategories)));
  const [scrollIndex, setScrollIndex] = useState(REEL_LENGTH - 3);
  const [instant, setInstant] = useState(true);
  const [phase, setPhase] = useState('spinning'); // 'spinning' | 'landed'
  const hasMounted = useRef(false);

  const spin = () => {
    if (disabled) return;
    const pool = getPool(selectedCategories);
    setReel(buildReel(pool));
    setPhase('spinning');
    setInstant(true);
    setScrollIndex(REEL_LENGTH - 3);

    // Two rAFs: first lets the instant reset actually paint, second
    // flips the transition back on before moving the target to 0.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setInstant(false);
        setScrollIndex(0);
      });
    });
  };

  useEffect(() => {
    if (disabled) return;
    // Re-spin on mount, and again whenever the category filter changes.
    spin();
    hasMounted.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategories, disabled]);

  const handleTransitionEnd = () => {
    if (scrollIndex === 0) {
      setPhase('landed');
      onSelect(reel[LANDING_INDEX].text);
    }
  };

  return (
    <div className="flex w-full mt-6 flex-col items-center gap-3">
      <div
        className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-white/5"
        style={{ height: ITEM_HEIGHT * 3 }}
      >
        {/* highlighted center band */}
        <div
          className="pointer-events-none absolute inset-x-0 top-1/2 z-10 -translate-y-1/2 border-y border-violet-400/40 bg-violet-500/10"
          style={{ height: ITEM_HEIGHT }}
        />
        {/* edge fades so rows feel like they enter/exit the window */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-6 bg-gradient-to-b from-neutral-950 to-transparent sm:h-8" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-6 bg-gradient-to-t from-neutral-950 to-transparent sm:h-8" />

        <div
          onTransitionEnd={handleTransitionEnd}
          className="ease-[cubic-bezier(0.13,0.85,0.22,1)]"
          style={{
            transform: `translateY(${-scrollIndex * ITEM_HEIGHT}px)`,
            transitionProperty: 'transform',
            transitionDuration: instant ? '0ms' : `${SPIN_DURATION}ms`,
          }}
        >
          {reel.map((t, i) => (
            <div
              key={i}
              className="flex items-center justify-center px-6 text-center"
              style={{ height: ITEM_HEIGHT }}
            >
              <span
                className={`line-clamp-2 text-sm font-medium leading-snug transition-colors sm:text-base ${
                  i === LANDING_INDEX && phase === 'landed'
                    ? 'text-white'
                    : 'text-gray-400'
                }`}
              >
                {t.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={spin}
        disabled={disabled || phase === 'spinning'}
        className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm text-gray-300 transition hover:bg-white/10 disabled:opacity-40"
      >
        {phase === 'spinning' ? 'Spinning…' : 'Spin again'}
      </button>
    </div>
  );
}