// src/features/recordings/useRecorder.js
//
// Encapsulates MediaRecorder + timer logic. Returns state + actions;
// components just render based on `status` and call the actions.
// status: 'idle' -> 'recording' -> 'stopped' (preview) -> back to 'idle' on reset

import { useRef, useState, useCallback, useEffect } from 'react';

const DEFAULT_MAX_SECONDS = 60; // 60 seconds
const EXTEND_SECONDS = 30;
const MAX_EXTENDS = 3;

function pickMimeType() {
  const candidates = ['audio/webm;codecs=opus', 'audio/mp4', 'audio/webm'];
  return candidates.find((type) => MediaRecorder.isTypeSupported(type)) || '';
}

export function useRecorder() {
  const [status, setStatus] = useState('idle'); // idle | recording | stopped
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [maxSeconds, setMaxSeconds] = useState(DEFAULT_MAX_SECONDS);
  const [extendCount, setExtendCount] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [error, setError] = useState(null);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const streamRef = useRef(null);

  const stop = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    clearInterval(timerRef.current);
  }, []);

  const start = useCallback(async () => {
    setError(null);
    setAudioBlob(null);
    setAudioUrl(null);
    setElapsedSeconds(0);
    setMaxSeconds(DEFAULT_MAX_SECONDS);
    setExtendCount(0);
    chunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = pickMimeType();
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType || 'audio/webm' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        setStatus('stopped');
        streamRef.current?.getTracks().forEach((track) => track.stop());
      };

      recorder.start(1000); // collect a chunk every second — cheap client-side safety margin
      setStatus('recording');

      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => {
          const next = prev + 1;
          // Read maxSeconds fresh each tick via functional update pattern below
          return next;
        });
      }, 1000);
    } catch (err) {
      console.error('Failed to start recording:', err);
      setError('Microphone access is required to record. Please allow it and try again.');
    }
  }, []);

  // Auto-stop when elapsedSeconds hits maxSeconds
  useEffect(() => {
    if (status === 'recording' && elapsedSeconds >= maxSeconds) {
      stop();
    }
  }, [elapsedSeconds, maxSeconds, status, stop]);

  const extend = useCallback(() => {
    setExtendCount((prev) => {
      if (prev >= MAX_EXTENDS) return prev;
      setMaxSeconds((m) => m + EXTEND_SECONDS);
      return prev + 1;
    });
  }, []);

  // Discards the in-progress recording entirely (no preview/save) — used by
  // the "back" button to return straight to topic selection.
  const cancel = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.onstop = null; // prevent the normal onstop -> 'stopped' transition
      if (mediaRecorderRef.current.state !== 'inactive') mediaRecorderRef.current.stop();
    }
    clearInterval(timerRef.current);
    streamRef.current?.getTracks().forEach((track) => track.stop());
    chunksRef.current = [];
    setStatus('idle');
    setElapsedSeconds(0);
    setMaxSeconds(DEFAULT_MAX_SECONDS);
    setExtendCount(0);
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setElapsedSeconds(0);
    setMaxSeconds(DEFAULT_MAX_SECONDS);
    setExtendCount(0);
    setAudioBlob(null);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setError(null);
    chunksRef.current = [];
  }, [audioUrl]);

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      streamRef.current?.getTracks().forEach((track) => track.stop());
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    status,
    elapsedSeconds,
    maxSeconds,
    extendCount,
    canExtend: extendCount < MAX_EXTENDS,
    audioBlob,
    audioUrl,
    error,
    start,
    stop,
    extend,
    cancel,
    reset,
  };
}