// src/components/recorder/RecorderScreen.jsx
//
// Full recording flow: pick a collection (Everyday / Thoughtful) and
// optionally a category -> spin a topic on a scrolling reel, or write
// your own -> record -> preview/re-record -> submit -> processing state
// -> evaluation result. Handles 402 (unpaid) and 429 (daily limit)
// errors from the backend with specific messaging rather than a generic
// failure.

import { useState } from 'react';
import { useRecorder } from '../../features/recordings/useRecorder.js';
import { uploadRecording } from '../../features/recordings/recordings.api.js';
import { CategoryPicker } from './CategoryPicker.jsx';
import { TopicSpinner } from './TopicSpinner.jsx';
import { CircularTimer } from './CircularTimer.jsx';
import { ResultView } from '../result/ResultView.jsx';
import { getCategoriesForCollection } from '../../features/recordings/topics.data.js';

const COLLECTIONS = [
  { value: 'everyday', label: 'Everyday' },
  { value: 'thoughtful', label: 'Thoughtful' },
];

export function RecorderScreen() {
  const [topicMode, setTopicMode] = useState('spin'); // 'spin' | 'custom'
  const [topicCollection, setTopicCollection] = useState('everyday'); // 'everyday' | 'thoughtful'
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [customTopic, setCustomTopic] = useState('');
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

  const categories = getCategoriesForCollection(topicCollection);

  const handleCollectionChange = (value) => {
    if (value === topicCollection) return;
    setTopicCollection(value);
    setSelectedCategories([]); // category list differs per collection — don't carry a stale selection over
    setTopic(null);
  };

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? [] : [category]
    );
  };

  const toggleTopicMode = () => {
    setTopicMode((m) => (m === 'spin' ? 'custom' : 'spin'));
    setTopic(null);
    setCustomTopic('');
  };

  const handleCustomTopicChange = (e) => {
    const value = e.target.value;
    setCustomTopic(value);
    setTopic(value.trim() ? value.trim() : null);
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
    setCustomTopic('');
  };

  if (submitState === 'done' && result) {
    return <ResultView result={result} onPracticeAgain={startOver} />;
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-6 px-4 py-6 sm:px-6 sm:py-8">
      {status === 'idle' && (
        <div className="flex w-full flex-col items-center gap-6">
          {topicMode === 'spin' && (
            <div className="inline-flex rounded-full border border-white/10 bg-white/5 p-1">
              {COLLECTIONS.map(({ value, label }) => {
                const isActive = topicCollection === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleCollectionChange(value)}
                    className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-violet-500 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          )}

          {topicMode === 'spin' ? (
            <>
              <CategoryPicker
                categories={categories}
                selected={selectedCategories}
                onToggle={toggleCategory}
              />
              <TopicSpinner
                collection={topicCollection}
                selectedCategories={selectedCategories}
                onSelect={setTopic}
                disabled={false}
              />
            </>
          ) : (
            <div className="w-full max-w-3xl">
              <textarea
                value={customTopic}
                onChange={handleCustomTopicChange}
                placeholder="Type the topic you want to speak about…"
                rows={3}
                autoFocus
                className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-base text-white placeholder:text-gray-500 focus:border-violet-400 focus:outline-none"
              />
            </div>
          )}

          <button
            type="button"
            onClick={toggleTopicMode}
            className="text-sm text-gray-400 underline-offset-2 hover:text-white hover:underline"
          >
            {topicMode === 'spin' ? 'Or write your own topic' : '← Back to spin a topic'}
          </button>
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