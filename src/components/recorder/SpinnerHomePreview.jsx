// src/components/recorder/RecorderScreen.jsx
//
// Full recording flow: pick a category (optional) -> spin a topic on a
// scrolling reel -> record -> preview/re-record -> submit -> processing
// state -> evaluation result. Handles 402 (unpaid) and 429 (daily limit)
// errors from the backend with specific messaging rather than a generic
// failure.

import { useState } from 'react';
import { useRecorder } from '../../features/recordings/useRecorder.js';
import { uploadRecording } from '../../features/recordings/recordings.api.js';
import { CategoryPicker } from './CategoryPicker.jsx';
import { TopicSpinner } from './TopicSpinner.jsx';
import { CircularTimer } from './CircularTimer.jsx';

export function SpinnerHomePreview() {
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
       <h2 className="text-center text-2xl font-semibold sm:text-3xl">
        Spin for a {" "}
        <span className="font-serif italic text-violet-300">topic</span>
      </h2>
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
              {submitState === 'uploading' ? 'Processing…' : 'Subscribe to get feedback →'}
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


function Stat({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
      <p className="text-2xl font-semibold text-white">{value ?? '–'}</p>
      <p className="text-xs text-gray-400">{label}</p>
    </div>
  );
}