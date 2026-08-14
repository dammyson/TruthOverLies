import {API_BASE} from './config';
import {ApiError} from './types';

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
  const method = (options.method ?? 'GET').toUpperCase();

  if (['POST', 'PUT', 'PATCH'].includes(method) && options.body) {
    try {
      console.log(`[API] 📤 ${method} ${url}`, JSON.parse(options.body as string));
    } catch {
      console.log(`[API] 📤 ${method} ${url}`, options.body);
    }
  }

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
      console.warn(`[API] ❌ ${method} ${url} → ${response.status}`, body);
    } catch {
      console.warn(`[API] ❌ ${method} ${url} → ${response.status}`);
    }
    throw new ApiError(response.status, message);
  }

  const data = (await response.json()) as T;
  console.log(`[API] ✅ ${method} ${url} → ${response.status}`, data);
  return data;
}

export default request;
