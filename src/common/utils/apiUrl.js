/**
 * API base URL for backend requests.
 * - Dev: empty string → same-origin requests via Vite proxy (vite.config.js).
 * - Production: VITE_BACKEND_URL must be your deployed API (not localhost).
 */
export function getApiBase() {
  if (import.meta.env.DEV) {
    return '';
  }
  const base = import.meta.env.VITE_BACKEND_URL || '';
  return String(base).replace(/\/$/, '');
}

export function buildApiUrl(path) {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const base = getApiBase();
  return base ? `${base}${normalized}` : normalized;
}

export function enrichFetchError(message) {
  const base = getApiBase() || 'http://localhost:5050 (dev proxy)';
  const onLocalhost =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1');
  const backendIsLocalhost =
    !import.meta.env.DEV &&
    String(import.meta.env.VITE_BACKEND_URL || '').includes('localhost');

  if (backendIsLocalhost && !onLocalhost) {
    return `${message} This site is deployed, but VITE_BACKEND_URL still points at localhost. Set it to your production API URL in .env.production, rebuild, and redeploy.`;
  }

  if (message === 'Failed to fetch' || message === 'NetworkError when attempting to fetch resource.') {
    if (import.meta.env.DEV) {
      return `Cannot reach the API at ${base}. Start the backend (fdd-backend: npm run dev on port 5050).`;
    }
    return `Cannot reach the API at ${base}. Check that the server is running and CORS allows this site.`;
  }

  return message;
}
