// src/components/recorder/CircularTimer.jsx
//
// Shows time remaining (not elapsed) as a shrinking ring, with the
// remaining seconds as the big central number.

const SIZE = 180;
const STROKE = 10;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function CircularTimer({ elapsedSeconds, maxSeconds }) {
  const remaining = Math.max(maxSeconds - elapsedSeconds, 0);
  const fraction = maxSeconds > 0 ? remaining / maxSeconds : 0;
  const offset = CIRCUMFERENCE * (1 - fraction);

  return (
    <div className="relative" style={{ width: SIZE, height: SIZE }}>
      <svg width={SIZE} height={SIZE} className="-rotate-90">
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={STROKE}
        />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="#8b5cf6"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s linear' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-4xl font-semibold text-white">{remaining}</span>
      </div>
    </div>
  );
}