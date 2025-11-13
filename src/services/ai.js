import { apiRequest } from './api.js';

export function extractQuestionsFromAI(token, payload) {
  return apiRequest('/ai/extractQuestions', {
    method: 'POST',
    token,
    body: payload
  });
}

export function pollAiJob(token, jobId) {
  return apiRequest(`/ai/status?jobId=${encodeURIComponent(jobId)}`, {
    method: 'GET',
    token
  });
}
