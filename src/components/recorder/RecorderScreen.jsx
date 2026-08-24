// src/components/recorder/RecorderScreen.jsx
//
// Full recording flow: pick a category (optional) -> spin a topic on a
// scrolling reel -> record -> preview/re-record -> submit -> processing
// state -> evaluation result. Handles 402 (unpaid) and 429 (daily limit)
// errors from the backend with specific messaging rather than a generic
// failure.

import { useState } from 'react';
import { Clock, PauseCircle, MessageSquareText, Sparkles, CircleCheck } from 'lucide-react';
import { useRecorder } from '../../features/recordings/useRecorder.js';
import { uploadRecording } from '../../features/recordings/recordings.api.js';
import { CategoryPicker } from './CategoryPicker.jsx';
import { TopicSpinner } from './TopicSpinner.jsx';
import { CircularTimer } from './CircularTimer.jsx';

export function RecorderScreen() {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [topic, setTopic] = useState(null);
  const [submitState, setSubmitState] = useState('idle'); // idle | uploading | done | error
  const [result, setResult] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  const {
    status,
    elapsedSeconds,
    maxSeconds,
    extendCount,
    canExtend,
    audioUrl,
    audioBlob,
    error: recorderError,
    start,
    stop,
    extend,
    cancel,
    reset,
  } = useRecorder();

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? [] : [category]
    );
  };

  const handleSubmit = async () => {
    setSubmitState('uploading');
    setSubmitError(null);
    try {
      const recording = await uploadRecording({ topic, audioBlob });
      setResult(recording);
      setSubmitState('done');
    } catch (err) {
      setSubmitState('error');
      if (err.status === 402) {
        setSubmitError('Your plan has expired. Subscribe to keep practicing.');
      } else if (err.status === 429) {
        setSubmitError(err.body?.message || "You've hit today's practice limit.");
      } else {
        setSubmitError('Something went wrong processing your recording. Please try again.');
      }
    }
  };

  const startOver = () => {
    reset();
    setSubmitState('idle');
    setResult(null);
    setSubmitError(null);
    setTopic(null);
  };

  if (submitState === 'done' && result) {
    return <ResultView result={result} onPracticeAgain={startOver} />;
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-6 px-4 py-6 sm:px-6 sm:py-8">
      {status === 'idle' && (
        <div className="flex w-full flex-col items-center gap-6">
          <CategoryPicker selected={selectedCategories} onToggle={toggleCategory} />
          <TopicSpinner selectedCategories={selectedCategories} onSelect={setTopic} disabled={false} />
        </div>
      )}

      {recorderError && <p className="text-sm text-red-400">{recorderError}</p>}

      {status === 'idle' && (
        <button
          onClick={start}
          disabled={!topic}
          className="w-full rounded-full bg-red-600 px-8 py-4 font-medium text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
        >
          <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-white align-middle" />
          Start Recording
        </button>
      )}

      {status === 'recording' && (
        <div className="flex w-full flex-col items-center gap-6">
          <div className="flex w-full items-center justify-between">
            <button onClick={cancel} className="text-sm text-gray-400 hover:text-white">
              ← Back
            </button>
          </div>

          <p className="max-w-md text-center text-lg font-semibold text-white">{topic}</p>

          <CircularTimer elapsedSeconds={elapsedSeconds} maxSeconds={maxSeconds} />

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <button
              onClick={stop}
              className="w-full rounded-full bg-white px-6 py-3 text-neutral-950 transition hover:bg-gray-200 sm:w-auto"
            >
              <span className="mr-1.5 inline-block h-2.5 w-2.5 rounded-sm bg-neutral-950 align-middle" />
              Stop
            </button>
            <button
              onClick={extend}
              disabled={!canExtend}
              className="w-full rounded-full border border-white/10 bg-white/5 px-6 py-3 text-white transition hover:bg-white/10 disabled:opacity-40 sm:w-auto"
            >
              +30s {canExtend ? `(${3 - extendCount} left)` : ''}
            </button>
          </div>
        </div>
      )}

      {status === 'stopped' && (
        <div className="flex w-full flex-col items-center gap-4">
          <audio src={audioUrl} controls className="w-full md:w-md" />
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <button
              onClick={reset}
              className="w-full rounded-full border border-white/10 bg-white/5 px-6 py-3 text-white transition hover:bg-white/10 sm:w-auto"
            >
              Re-record
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitState === 'uploading'}
              className="w-full rounded-full bg-violet-500 px-6 py-3 text-white transition hover:bg-violet-600 disabled:opacity-50 sm:w-auto"
            >
              {submitState === 'uploading' ? 'Processing…' : 'Submit for evaluation'}
            </button>
          </div>
          {submitState === 'uploading' && (
            <p className="text-center text-sm text-gray-400">
              Transcribing and evaluating — this can take up to 30 seconds.
            </p>
          )}
          {submitState === 'error' && (
            <p className="text-center text-sm text-red-400">{submitError}</p>
          )}
        </div>
      )}
    </div>
  );
}

// Replaces the existing ResultView (and the old Stat helper) inside
// src/components/recorder/RecorderScreen.jsx.
//
// Add this import at the top of that file:
//   import { Clock, PauseCircle, MessageSquareText, Sparkles, CircleCheck } from 'lucide-react';

function scoreTier(score) {
  if (score == null) return { bar: 'bg-white/10', text: 'text-gray-500' };
  if (score >= 80) return { bar: 'bg-violet-400', text: 'text-violet-300' };
  if (score >= 60) return { bar: 'bg-amber-400', text: 'text-amber-300' };
  return { bar: 'bg-orange-500', text: 'text-orange-400' };
}

function overallLabel(score) {
  if (score == null) return '';
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 50) return 'Getting there';
  return 'Keep practicing';
}

function ResultView({ result, onPracticeAgain }) {
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
          <h2 className="mt-1 text-lg font-semibold leading-snug text-gray-200">
            {result.topic}
          </h2>
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

      {/* Score breakdown */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {scores.map((s) => (
          <ScoreBar key={s.label} label={s.label} value={s.value} />
        ))}
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

function ScoreBar({ label, value }) {
  const tier = scoreTier(value);
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[11px] uppercase tracking-wide text-gray-500">{label}</span>
        <span className={`text-sm font-semibold ${tier.text}`}>{value ?? '–'}</span>
      </div>
      <div className="mt-2 h-1.5 rounded-full bg-white/10">
        <div className={`h-1.5 rounded-full ${tier.bar}`} style={{ width: `${value ?? 0}%` }} />
      </div>
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
function Stat({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
      <p className="text-2xl font-semibold text-white">{value ?? '–'}</p>
      <p className="text-xs text-gray-400">{label}</p>
    </div>
  );
}