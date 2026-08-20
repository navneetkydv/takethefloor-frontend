// src/features/recordings/recordings.api.js

import { api } from '../../lib/api.js';

export function uploadRecording({ topic, audioBlob }) {
  const formData = new FormData();
  formData.append('topic', topic);
  formData.append('audio', audioBlob, 'recording.webm');
  return api.post('/recordings', formData);
}

export function listRecordings() {
  return api.get('/recordings');
}

export function getRecording(id) {
  return api.get(`/recordings/${id}`);
}