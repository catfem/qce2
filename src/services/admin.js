import { apiRequest } from './api.js';

export function fetchWorkspaceUsers(token) {
  return apiRequest('/auth/listUsers', {
    method: 'POST',
    token
  });
}

export function updateUserRole(token, payload) {
  return apiRequest('/auth/updateRole', {
    method: 'POST',
    token,
    body: payload
  });
}
