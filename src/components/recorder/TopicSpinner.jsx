// src/components/recorder/TopicSpinner.jsx
//
// Vertical "slot reel" topic picker. On mount (and whenever the active
// collection, category filter, or "Spin again" changes) it scrolls a
// strip of topics downward past a highlighted center window, decelerates,
// and lands on a randomly chosen topic — which is reported via onSelect.
//
// A synthesized tick plays each time a row crosses the center, scheduled
// against the same ease-out curve as the visual scroll, plus a distinct
// landing tone when it stops. Sounds are generated with the Web Audio
// API — no audio assets needed. Browsers block audio before a user
// gesture, so the very first auto-spin on mount will likely be silent;
// "Spin again", category, and collection changes (all clicks) will have
// sound.

import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { TOPICS, CATEGORY_TO_COLLECTION } from '../../features/recordings/topics.data.js';

const ITEM_HEIGHT = 100; // px — height of a single reel row
const REEL_LENGTH = 26; // total filler rows rendered per spin
const SPIN_DURATION = 2600; // ms
const LANDING_INDEX = 1; // reel[LANDING_INDEX] is what the window centers on at rest
const ROWS_TRAVELED = REEL_LENGTH - 3; // scrollIndex goes from this down to 0

function getPool(collection, selectedCategories) {
  let pool = TOPICS;

  if (collection) {
    const inCollection = pool.filter((t) => CATEGORY_TO_COLLECTION[t.category] === collection);
    if (inCollection.length > 0) pool = inCollection;
  }

  if (selectedCategories?.length) {
    const filtered = pool.filter((t) => selectedCategories.includes(t.category));
    if (filtered.length > 0) pool = filtered;
  }

  return pool.length > 0 ? pool : TOPICS;
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

// --- sound (synthesized, no audio files) ---------------------------------

let sharedAudioCtx = null;
function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!sharedAudioCtx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    sharedAudioCtx = new Ctx();
  }
  if (sharedAudioCtx.state === 'suspended') sharedAudioCtx.resume();
  return sharedAudioCtx;
}

function playTone({ frequency, duration, volume }) {
  const ctx = getAudioContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'square';
  osc.frequency.value = frequency;
  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
}

function playTick(pitchFactor) {
  playTone({ frequency: 950 - pitchFactor * 250, duration: 0.035, volume: 0.12 });
}

function playLanding() {
  playTone({ frequency: 520, duration: 0.18, volume: 0.18 });
}

function tickTimeForRow(i, n, duration) {
  const s = i / n;
  const eased = 1 - Math.pow(1 - s, 1 / 3);
  return duration * eased;
}

// ---------------------------------------------------------------------------

export function TopicSpinner({ collection, selectedCategories = [], onSelect, disabled = false }) {
  const [reel, setReel] = useState(() => buildReel(getPool(collection, selectedCategories)));
  const [scrollIndex, setScrollIndex] = useState(ROWS_TRAVELED);
  const [instant, setInstant] = useState(true);
  const [phase, setPhase] = useState('spinning'); // 'spinning' | 'landed'
  const [muted, setMuted] = useState(false);
  const mutedRef = useRef(muted);
  const tickTimeouts = useRef([]);

  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  const clearScheduledTicks = () => {
    tickTimeouts.current.forEach(clearTimeout);
    tickTimeouts.current = [];
  };

  const scheduleTicks = () => {
    clearScheduledTicks();
    for (let i = 1; i < ROWS_TRAVELED; i++) {
      const t = tickTimeForRow(i, ROWS_TRAVELED, SPIN_DURATION);
      const id = setTimeout(() => {
        if (!mutedRef.current) playTick(i / ROWS_TRAVELED);
      }, t);
      tickTimeouts.current.push(id);
    }
  };

  const spin = () => {
    if (disabled) return;
    const pool = getPool(collection, selectedCategories);
    setReel(buildReel(pool));
    setPhase('spinning');
    setInstant(true);
    setScrollIndex(ROWS_TRAVELED);
    clearScheduledTicks();

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setInstant(false);
        setScrollIndex(0);
        scheduleTicks();
      });
    });
  };

  useEffect(() => {
    if (disabled) return;
    // Re-spin on mount, and again whenever the collection or category
    // filter changes.
    spin();
    return clearScheduledTicks;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collection, selectedCategories, disabled]);

  const handleTransitionEnd = () => {
    if (scrollIndex === 0) {
      setPhase('landed');
      // if (!mutedRef.current) playLanding();
      onSelect(reel[LANDING_INDEX].text);
    }
  };

  return (
    <div className="flex w-full mt-6 flex-col items-center gap-3">
      <div
        className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-white/5"
        style={{ height: ITEM_HEIGHT * 3 }}
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-1/2 z-10 -translate-y-1/2 border-y border-violet-400/40 bg-violet-500/10"
          style={{ height: ITEM_HEIGHT }}
        />
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
          {reel.map((t, i) => {
            const isLanding = i === LANDING_INDEX;
            const dimmed = phase === 'landed' && !isLanding;
            return (
              <div
                key={i}
                className={`flex items-center justify-center px-6 text-center transition-opacity duration-500 ${
                  dimmed ? 'opacity-20' : 'opacity-100'
                }`}
                style={{ height: ITEM_HEIGHT }}
              >
                <span
                  className={`line-clamp-2 text-sm font-medium leading-snug transition-colors duration-500 sm:text-base ${
                    isLanding && phase === 'landed' ? 'text-white' : 'text-gray-400'
                  }`}
                >
                  {t.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={spin}
          disabled={disabled || phase === 'spinning'}
          className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm text-gray-300 transition hover:bg-white/10 disabled:opacity-40"
        >
          {phase === 'spinning' ? 'Spinning…' : 'Spin again'}
        </button>
        <button
          type="button"
          onClick={() => setMuted((m) => !m)}
          aria-label={muted ? 'Unmute spin sound' : 'Mute spin sound'}
          className="rounded-full border border-white/10 bg-white/5 p-2 text-gray-400 transition hover:bg-white/10"
        >
          {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}