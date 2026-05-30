import { auth } from '@/firebase-config';
import { buildApiUrl, enrichFetchError } from '@/common/utils/apiUrl';

async function authHeaders(json = true) {
  const headers = {};
  if (json) headers['Content-Type'] = 'application/json';
  const user = auth?.currentUser;
  if (user) {
    headers.Authorization = `Bearer ${await user.getIdToken()}`;
  }
  return headers;
}

async function parseError(response) {
  try {
    const data = await response.json();
    return data.error || data.message || response.statusText;
  } catch {
    return response.statusText || 'Request failed';
  }
}

async function apiFetch(url, options) {
  try {
    return await fetch(url, options);
  } catch (err) {
    throw new Error(enrichFetchError(err.message || 'Failed to fetch'));
  }
}

const UPLOAD_PATH = '/api/donations/upload';

export async function fetchDonations() {
  console.log(buildApiUrl("/api"));
  const response = await apiFetch(buildApiUrl('/api/donations'), {
    headers: await authHeaders(),
  });
  if (!response.ok) throw new Error(await parseError(response));
  const data = await response.json();
  return data.donations ?? [];
}

export async function createDonation(payload) {
  const response = await apiFetch(buildApiUrl('/api/donations/insert'), {
    method: 'POST',
    headers: await authHeaders(),
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(await parseError(response));
  return response.json();
}

export async function updateDonation(id, payload) {
  const response = await apiFetch(buildApiUrl(`/api/donations/update/${id}`), {
    method: 'PUT',
    headers: await authHeaders(),
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(await parseError(response));
  return response.json();
}

export async function deleteDonation(id) {
  const response = await apiFetch(buildApiUrl(`/api/donations/delete/${id}`), {
    method: 'DELETE',
    headers: await authHeaders(false),
  });
  if (!response.ok) throw new Error(await parseError(response));
  return response.json();
}

export async function uploadDonationsCsv(file) {
  const formData = new FormData();
  formData.append('file', file);
  const headers = await authHeaders(false);
  const response = await apiFetch(buildApiUrl(UPLOAD_PATH), {
    method: 'POST',
    headers,
    body: formData,
  });
  if (!response.ok) throw new Error(await parseError(response));
  return response.json();
}

export function toInputDate(donatedAt) {
  if (!donatedAt) return '';
  const iso = String(donatedAt).match(/^(\d{4}-\d{2}-\d{2})/);
  if (iso) return iso[1];
  const d = new Date(donatedAt);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
}

export function formatDonationDate(donatedAt) {
  if (!donatedAt) return '—';
  const d = new Date(donatedAt);
  if (Number.isNaN(d.getTime())) return String(donatedAt);
  return d.toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
  });
}
