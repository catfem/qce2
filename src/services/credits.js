import { apiRequest } from './api.js';

export function allocateCredits(token, payload) {
  return apiRequest('/credits/allocate', {
    method: 'POST',
    token,
    body: payload
  });
}

export function fetchCreditLedger(token, filters) {
  return apiRequest('/credits/ledger', {
    method: 'POST',
    token,
    body: filters
  });
}
