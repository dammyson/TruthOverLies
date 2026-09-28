type AppEnv = 'local' | 'dev';

const APP_ENV: AppEnv = 'dev';

const BASE_URLS: Record<AppEnv, string> = {
  local: 'http://127.0.0.1:8000',
  dev: 'https://test-api.truthoverlies.cloud',
};

export const BASE_URL = BASE_URLS[APP_ENV];
export const API_BASE = `${BASE_URL}/api`;
