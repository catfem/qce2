const API_BASE_URL = '/api';

export async function apiRequest(path, { method = 'GET', body, token, headers } = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers
    },
    body: body ? JSON.stringify(body) : undefined
  });

  if (!response.ok) {
    const errorBody = await safeJson(response);
    const message = errorBody?.message || `Request to ${path} failed with status ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.details = errorBody;
    throw error;
  }

  return safeJson(response);
}

async function safeJson(response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch (error) {
    return { raw: text };
  }
}
