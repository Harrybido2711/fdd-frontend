const API_BASE = import.meta.env.VITE_BACKEND_URL;

async function handleResponse(res) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Request failed');
  }
  return res.json();
}

export async function fetchTotalFunds() {
  const res = await fetch(`${API_BASE}/api/stats/donations/total`);
  const data = await handleResponse(res);

  return Number(data?.[0]?.totalDonations || 0);
}

export const CATEGORY_COLORS = [
  '#6b21a8', // purple - Education
  '#1d4ed8', // blue - Community Support
  '#9a8348', // gold - Legal
  '#4a5568', // gray - Operations
  '#15803d', // green - Special Projects
  '#b45309', // amber
  '#dc2626', // red
  '#0ea5e9', // sky
  '#9333ea', // violet
  '#16a34a', // emerald
];

function mapCategoryData(data) {
  return data.map((item, index) => ({
    name: item.category,
    value: Number(item.totalDonations || 0),
    fill: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
  }));
}

export async function fetchCategoryCounts() {
  const res = await fetch(`${API_BASE}/api/stats/categories/count`);
  const data = await handleResponse(res);

  return mapCategoryData(data)
}


export const STATE_COLORS = [
  '#4a5568',
  '#f4a0a0',
  '#1e3a5f',
  '#ffa500',
  '#2f4f4f',
  '#166534',
  '#9370db',
  '#0ea5e9',
  '#dc2626',
  '#6b21a8',
];

function mapStateData(data = []) {
  if (!Array.isArray(data)) return [];

  const total = data.reduce(
    (sum, item) => sum + Number(item?.totalDollars || 0),
    0
  );

  return data.map((item, index) => {
    const value = Number(item?.totalDollars || 0);

    return {
      name: item?.state || 'Unknown',
      value,
      percent: total ? Number(((value / total) * 100).toFixed(2)) : 0,
      fill: STATE_COLORS[index % STATE_COLORS.length],
    };
  });
}

export async function fetchStateDollars() {
  const res = await fetch(`${API_BASE}/api/stats/states/amount`);
  const data = await handleResponse(res);

  return mapStateData(data);
}