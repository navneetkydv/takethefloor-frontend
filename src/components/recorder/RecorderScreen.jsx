// src/components/recorder/RecorderScreen.jsx
//
// Full recording flow: spin a topic -> record -> preview/re-record ->
// submit -> shows processing state -> shows the evaluation result.
// Handles 402 (unpaid) and 429 (daily limit) errors from the backend
// with specific messaging rather than a generic failure.

import { useState } from 'react';
import { useRecorder } from '../../features/recordings/useRecorder.js';
import { uploadRecording } from '../../features/recordings/recordings.api.js';
import { spinTopic } from '../../features/recordings/topics.data.js';
import { formatTime } from '../../lib/formatTime.js';
import { TopicSpinner } from './TopicSpinner.jsx';

export function RecorderScreen() {
  const [topic, setTopic] = useState(() => spinTopic([]).text);
  const [submitState, setSubmitState] = useState('idle'); // idle | uploading | done | error
  const [result, setResult] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  const {
    status,
    elapsedSeconds,
    maxSeconds,
    audioUrl,
    audioBlob,
    error: recorderError,
    start,
    stop,
    extend,
    reset,
  } = useRecorder();

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
    setTopic(spinTopic([]).text);
  };

  if (submitState === 'done' && result) {
    return <ResultView result={result} onPracticeAgain={startOver} />;
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-6 p-6">
      <TopicSpinner onSelect={setTopic} disabled={status !== 'idle'} />

      {recorderError && <p className="text-sm text-red-400">{recorderError}</p>}

      {status === 'idle' && (
        <button
          onClick={start}
          className="rounded-full bg-red-600 px-8 py-4 font-medium text-white hover:bg-red-500"
        >
          ● Start Recording
        </button>
      )}

      {status === 'recording' && (
        <div className="flex flex-col items-center gap-3">
          <p className="text-3xl font-mono text-white">
            {formatTime(elapsedSeconds)} / {formatTime(maxSeconds)}
          </p>
          <div className="flex gap-3">
            <button
              onClick={stop}
              className="rounded-full bg-white px-6 py-3 text-neutral-950 hover:bg-gray-200"
            >
              ■ Stop
            </button>
            <button
              onClick={extend}
              className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-white hover:bg-white/10"
            >
              +30s
            </button>
          </div>
        </div>
      )}

      {status === 'stopped' && (
        <div className="flex w-full flex-col items-center gap-4">
          <audio src={audioUrl} controls className="w-full" />
          <div className="flex gap-3">
            <button
              onClick={reset}
              className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-white hover:bg-white/10"
            >
              Re-record
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitState === 'uploading'}
              className="rounded-full bg-violet-500 px-6 py-3 text-white hover:bg-violet-600 disabled:opacity-50"
            >
              {submitState === 'uploading' ? 'Processing...' : 'Submit for evaluation'}
            </button>
          </div>
          {submitState === 'uploading' && (
            <p className="text-sm text-gray-400">
              Transcribing and evaluating — this can take up to 30 seconds.
            </p>
          )}
          {submitState === 'error' && <p className="text-sm text-red-400">{submitError}</p>}
        </div>
      )}
    </div>
  );
}

function ResultView({ result, onPracticeAgain }) {
  const feedback = result.llmFeedback;

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-4 p-6 text-white">
      <h2 className="text-xl font-semibold">Your results</h2>

      <div className="grid grid-cols-2 gap-3 text-center">
        <Stat label="Overall" value={feedback?.overallScore} />
        <Stat label="Clarity" value={feedback?.clarityScore} />
        <Stat label="Structure" value={feedback?.structureScore} />
        <Stat label="Fluency" value={feedback?.fluencyScore} />
      </div>

      <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-gray-300">
        {result.wpm} WPM · {result.pauseCount} long pauses · {result.fillerWordCount} filler words
      </div>

      {feedback?.summary && <p className="text-gray-300">{feedback.summary}</p>}

      {feedback?.improvements?.length > 0 && (
        <div>
          <p className="font-medium">To improve:</p>
          <ul className="list-inside list-disc text-gray-400">
            {feedback.improvements.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={onPracticeAgain}
        className="mt-2 rounded-full bg-violet-500 px-6 py-3 text-white hover:bg-violet-600"
      >
        Practice again
      </button>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-3">
      <p className="text-2xl font-semibold text-white">{value ?? '-'}</p>
      <p className="text-xs text-gray-400">{label}</p>
    </div>
  );
}