import {API_BASE, BASE_URL} from './config';
import {ApiError} from './types';

// Pass a path relative to /api (e.g. "/users/me") for standard endpoints.
// Pass a full URL string for non-/api endpoints like /health.
async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string,
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
    ...(token ? {Authorization: `Bearer ${token}`} : {}),
  };

  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;
  const response = await fetch(url, {...options, headers});

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const body = await response.json();
      if (body?.detail) {
        message =
          typeof body.detail === 'string'
            ? body.detail
            : JSON.stringify(body.detail);
      }
    } catch {}
    throw new ApiError(response.status, message);
  }

  return response.json() as Promise<T>;
}

export default request;
