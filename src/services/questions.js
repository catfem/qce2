import { apiRequest } from './api.js';

export function fetchQuestionStats(token) {
  return apiRequest('/questions/read', {
    method: 'POST',
    token,
    body: {
      mode: 'stats'
    }
  });
}

export function fetchQuestionList(token, filters) {
  return apiRequest('/questions/read', {
    method: 'POST',
    token,
    body: {
      mode: 'list',
      filters
    }
  });
}

export function fetchQuestionSets(token) {
  return apiRequest('/questions/read', {
    method: 'POST',
    token,
    body: {
      mode: 'sets'
    }
  });
}

export function createQuestion(token, payload) {
  return apiRequest('/questions/create', {
    method: 'POST',
    token,
    body: payload
  });
}

export function updateQuestion(token, id, payload) {
  return apiRequest('/questions/update', {
    method: 'POST',
    token,
    body: {
      id,
      payload
    }
  });
}

export function deleteQuestion(token, id) {
  return apiRequest('/questions/delete', {
    method: 'POST',
    token,
    body: { id }
  });
}

export function batchUploadQuestions(token, payload) {
  return apiRequest('/questions/batchUpload', {
    method: 'POST',
    token,
    body: payload
  });
}

export function createQuestionSet(token, payload) {
  return apiRequest('/questions/createSet', {
    method: 'POST',
    token,
    body: payload
  });
}

export function mergeQuestionSets(token, payload) {
  return apiRequest('/questions/mergeSets', {
    method: 'POST',
    token,
    body: payload
  });
}

export function duplicateQuestionSet(token, payload) {
  return apiRequest('/questions/duplicateSet', {
    method: 'POST',
    token,
    body: payload
  });
}

export function exportQuestionSet(token, payload) {
  return apiRequest('/questions/export', {
    method: 'POST',
    token,
    body: payload
  });
}

export function shareQuestionSet(token, payload) {
  return apiRequest('/questions/share', {
    method: 'POST',
    token,
    body: payload
  });
}
