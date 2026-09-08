// Replaces the existing ResultView (and the old Stat helper) inside
// src/components/recorder/RecorderScreen.jsx.
//
// Add this import at the top of that file:
import {
  Clock,
  PauseCircle,
  MessageSquareText,
  Sparkles,
  CircleCheck,
  CircleAlert,
  CircleHelp,
  BookOpen,
  ChevronDown,
} from 'lucide-react';

const RADAR_LABELS = ['On topic', 'Clarity', 'Structure', 'Vocabulary', 'Fluency'];

// Words/phrases flagged as filler in the transcript display — matches the
// amber-underline treatment used on the marketing page's speech-coach demo.
const FILLER_PATTERN = /\b(um+|uh+|like|you know|kind of|sort of)\b/gi;

const FACT_VERDICT_STYLES = {
  accurate: { icon: CircleCheck, text: 'text-emerald-400', label: 'Checks out' },
  inaccurate: { icon: CircleAlert, text: 'text-orange-400', label: 'Likely inaccurate' },
  unverifiable: { icon: CircleHelp, text: 'text-gray-500', label: 'Unverified' },
  opinion: { icon: MessageSquareText, text: 'text-gray-500', label: 'Opinion' },
};

function scoreTier(score) {
  if (score == null) return { bar: 'bg-white/10', text: 'text-gray-500', hex: '#6b7280' };
  if (score >= 80) return { bar: 'bg-violet-400', text: 'text-violet-300', hex: '#a78bfa' };
  if (score >= 60) return { bar: 'bg-amber-400', text: 'text-amber-300', hex: '#fbbf24' };
  return { bar: 'bg-orange-500', text: 'text-orange-400', hex: '#fb923c' };
}

function overallLabel(score) {
  if (score == null) return '';
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 50) return 'Getting there';
  return 'Keep practicing';
}

function polarPoint(index, total, fraction, cx, cy, r) {
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
  return {
    x: cx + fraction * r * Math.cos(angle),
    y: cy + fraction * r * Math.sin(angle),
  };
}

function renderTranscript(text) {
  const regex = new RegExp(FILLER_PATTERN);
  const nodes = [];
  let lastIndex = 0;
  let match;
  let key = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));
    nodes.push(
      <span key={key++} className="rounded bg-amber-500/10 px-0.5 text-amber-300">
        {match[0]}
      </span>
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

function ScoreRadar({ scores }) {
  const size = 300;
  const cx = size / 2;
  const cy = size / 2;
  const r = 84;
  const total = scores.length;
  const rings = [0.25, 0.5, 0.75, 1];

  const dataPoints = scores.map((s, i) =>
    polarPoint(i, total, Math.max(s.value ?? 0, 0) / 100, cx, cy, r)
  );
  const dataPath = dataPoints.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <div className="flex justify-center rounded-2xl border border-white/10 bg-white/5 p-4">
      <svg viewBox={`0 0 ${size} ${size}`} className="h-72 w-72 sm:h-72 sm:w-72">
        {rings.map((f) => (
          <polygon
            key={f}
            points={scores
              .map((_, i) => polarPoint(i, total, f, cx, cy, r))
              .map((p) => `${p.x},${p.y}`)
              .join(' ')}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
          />
        ))}

        {scores.map((_, i) => {
          const p = polarPoint(i, total, 1, cx, cy, r);
          return (
            <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.08)" />
          );
        })}

        <polygon points={dataPath} fill="rgba(167,139,250,0.25)" stroke="#a78bfa" strokeWidth="2" />
        {dataPoints.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill="#c4b5fd" />
        ))}

        {scores.map((s, i) => {
          const p = polarPoint(i, total, 1.26, cx, cy, r);
          const anchor = p.x > cx + 4 ? 'start' : p.x < cx - 4 ? 'end' : 'middle';
          return (
            <text
              key={i}
              x={p.x}
              y={p.y}
              textAnchor={anchor}
              dominantBaseline="middle"
              className="fill-gray-400 text-[10px]"
            >
              {s.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

export function ResultView({ result, onPracticeAgain }) {
  const feedback = result.llmFeedback;
  const rewrite = feedback?.rewrite || feedback?.improvedVersion;
  const overallTier = scoreTier(feedback?.overallScore);

  const scores = [
    { label: 'On topic', value: feedback?.onTopicScore },
    { label: 'Clarity', value: feedback?.clarityScore },
    { label: 'Structure', value: feedback?.structureScore },
    { label: 'Vocabulary', value: feedback?.vocabularyScore },
    { label: 'Fluency', value: feedback?.fluencyScore },
  ];

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-5 px-4 py-6 text-white sm:px-6 sm:py-8 lg:max-w-2xl">
      <div>
        <p className="text-xs uppercase tracking-wide text-gray-500">Your results</p>
        {result.topic && (
          <h2 className="mt-1 text-lg font-semibold leading-snug text-gray-200">{result.topic}</h2>
        )}
      </div>

      {/* Overall score hero */}
      <div className="flex flex-col items-center gap-1 rounded-2xl border border-white/10 bg-white/5 py-8 text-center">
        <span className="text-xs uppercase tracking-wide text-gray-500">Overall score</span>
        <span className={`text-5xl font-bold ${overallTier.text}`}>
          {feedback?.overallScore ?? '–'}
        </span>
        <span className="text-sm text-gray-400">{overallLabel(feedback?.overallScore)}</span>
      </div>

      {/* Score breakdown: radar + exact numbers underneath */}
      <div className="flex flex-col items-center gap-3">
        <ScoreRadar scores={scores} />
        <div className="grid w-full grid-cols-3 gap-2 text-center sm:grid-cols-5">
          {scores.map((s) => (
            <div key={s.label}>
              <p className={`text-sm font-semibold ${scoreTier(s.value).text}`}>{s.value ?? '–'}</p>
              <p className="text-[10px] uppercase tracking-wide text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Fluency metrics */}
      <div className="flex gap-3">
        <MetricPill icon={Clock} label="WPM" value={result.wpm ?? '–'} />
        <MetricPill icon={PauseCircle} label="Pauses" value={result.pauseCount ?? '–'} />
        <MetricPill icon={MessageSquareText} label="Fillers" value={result.fillerWordCount ?? '–'} />
      </div>

      {feedback?.summary && (
        <p className="text-sm leading-relaxed text-gray-300">{feedback.summary}</p>
      )}

      {/* Original transcript, collapsible, fillers highlighted */}
      {result.transcript && (
        <details className="group rounded-2xl border border-white/10 bg-white/5 p-4 [&::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-white">
            Your transcript
            <ChevronDown className="h-4 w-4 text-gray-500 transition-transform group-open:rotate-180" />
          </summary>
          <p className="mt-3 text-sm leading-relaxed text-gray-300">
            {renderTranscript(result.transcript)}
          </p>
        </details>
      )}

      {/* Vocabulary suggestions */}
      {feedback?.vocabularySuggestions?.length > 0 && (
        <div className="rounded-2xl border border-blue-400/20 bg-blue-500/5 p-4">
          <p className="flex items-center gap-1.5 text-sm font-medium text-blue-300">
            <BookOpen className="h-4 w-4" strokeWidth={2} />
            Level up your vocabulary
          </p>
          <div className="mt-3 space-y-3">
            {feedback.vocabularySuggestions.map((v, i) => (
              <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="flex flex-wrap items-center gap-1.5 text-sm">
                  <span className="text-gray-500 line-through decoration-gray-600">{v.original}</span>
                  <span className="text-gray-600">→</span>
                  <span className="font-medium text-blue-300">{v.suggested}</span>
                </div>
                <p className="mt-1 text-xs text-gray-400">{v.meaning}</p>
                <p className="mt-1.5 text-xs italic text-gray-500">"{v.example}"</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Strengths / improvements */}
      {(feedback?.strengths?.length > 0 || feedback?.improvements?.length > 0) && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {feedback?.strengths?.length > 0 && (
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/5 p-4">
              <p className="text-sm font-medium text-emerald-300">What worked</p>
              <ul className="mt-2 space-y-1.5 text-sm text-gray-300">
                {feedback.strengths.map((s, i) => (
                  <li key={i} className="flex gap-2">
                    <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" strokeWidth={2} />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {feedback?.improvements?.length > 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-medium text-white">To improve</p>
              <ul className="mt-2 space-y-1.5 text-sm text-gray-400">
                {feedback.improvements.map((s, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gray-500" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Fact check — only renders when the speaker made checkable claims */}
      {feedback?.factChecks?.length > 0 && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm font-medium text-white">Fact check</p>
          <p className="mt-0.5 text-[11px] text-gray-500">
            AI-generated, not guaranteed — worth verifying anything important yourself.
          </p>
          <div className="mt-3 space-y-3">
            {feedback.factChecks.map((f, i) => {
              const style = FACT_VERDICT_STYLES[f.verdict] || FACT_VERDICT_STYLES.unverifiable;
              const Icon = style.icon;
              return (
                <div key={i} className="flex gap-2">
                  <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${style.text}`} strokeWidth={2} />
                  <div>
                    <p className="text-sm text-gray-300">{f.claim}</p>
                    <p className={`text-xs ${style.text}`}>
                      {style.label}
                      {f.note ? ` — ${f.note}` : ''}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      

      {/* Suggested rewrite */}
      {rewrite && (
        <div className="rounded-2xl border border-violet-400/20 bg-violet-500/5 p-4">
          <p className="flex items-center gap-1.5 text-sm font-medium text-violet-300">
            <Sparkles className="h-4 w-4" strokeWidth={2} />
            Try saying it like this
          </p>
          <p className="mt-2 text-sm leading-relaxed text-gray-200">{rewrite}</p>
        </div>
      )}

      <button
        onClick={onPracticeAgain}
        className="mt-1 w-full rounded-full bg-violet-500 px-6 py-3 text-white transition hover:bg-violet-600 sm:w-auto"
      >
        Practice again
      </button>
    </div>
  );
}

function MetricPill({ icon: Icon, label, value }) {
  return (
    <div className="flex flex-1 flex-col items-center gap-1 rounded-xl border border-white/10 bg-white/5 py-3">
      <Icon className="h-4 w-4 text-gray-400" strokeWidth={2} />
      <span className="text-lg font-semibold text-white">{value}</span>
      <span className="text-[11px] uppercase tracking-wide text-gray-500">{label}</span>
    </div>
  );
}