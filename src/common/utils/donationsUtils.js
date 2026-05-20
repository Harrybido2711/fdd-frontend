const CHART_FILLS = [
  '#6b21a8',
  '#1d4ed8',
  '#9a8348',
  '#4a5568',
  '#15803d',
  '#f4a0a0',
  '#ffa500',
  '#9370db',
  '#2f4f4f',
  '#166534',
];

export function entryDateMs(donatedAt) {
  if (!donatedAt) return null;
  const iso = String(donatedAt).match(/^(\d{4}-\d{2}-\d{2})/);
  if (iso) return new Date(`${iso[1]}T00:00:00`).getTime();
  const t = new Date(donatedAt).getTime();
  return Number.isFinite(t) ? t : null;
}

export function filterByDateRange(rows, dateFrom, dateTo) {
  if (!dateFrom && !dateTo) return rows;

  const fromMs = dateFrom
    ? new Date(`${dateFrom}T00:00:00`).getTime()
    : null;
  const toMs = dateTo ? new Date(`${dateTo}T23:59:59.999`).getTime() : null;

  return rows.filter((row) => {
    const ms = entryDateMs(row.donated_at);
    if (ms == null) return false;
    if (fromMs != null && ms < fromMs) return false;
    if (toMs != null && ms > toMs) return false;
    return true;
  });
}

export function buildDashboardCharts(donations) {
  const total = donations.reduce(
    (sum, row) => sum + (Number(row.amount) || 0),
    0
  );

  const categoryMap = {};
  const stateMap = {};

  for (const row of donations) {
    const amount = Number(row.amount) || 0;
    const category = row.category?.trim() || 'Uncategorized';
    const state = row.state?.trim() || 'Unknown';
    categoryMap[category] = (categoryMap[category] || 0) + amount;
    stateMap[state] = (stateMap[state] || 0) + amount;
  }

  const categoryData = Object.entries(categoryMap)
    .map(([name, value], index) => ({
      name,
      value: Math.round(value * 100) / 100,
      fill: CHART_FILLS[index % CHART_FILLS.length],
    }))
    .sort((a, b) => b.value - a.value);

  const stateData = Object.entries(stateMap)
    .map(([name, value], index) => ({
      name,
      value: Math.round(value * 100) / 100,
      percent:
        total > 0
          ? Math.round((value / total) * 1000) / 10
          : 0,
      fill: CHART_FILLS[index % CHART_FILLS.length],
    }))
    .sort((a, b) => b.value - a.value);

  return { total, categoryData, stateData };
}

function csvEscape(value) {
  const str = value == null ? '' : String(value);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function exportDonationsCsv(rows, filename = 'donations-export.csv') {
  const headers = [
    'donated_at',
    'fund',
    'amount',
    'category',
    'city',
    'state',
  ];
  const lines = [
    headers.join(','),
    ...rows.map((row) => {
      const donatedAt = row.donated_at
        ? String(row.donated_at).slice(0, 10)
        : '';
      return [
        donatedAt,
        row.fund ?? '',
        row.amount ?? '',
        row.category ?? '',
        row.city ?? '',
        row.state ?? '',
      ]
        .map(csvEscape)
        .join(',');
    }),
  ];

  const blob = new Blob([lines.join('\n')], {
    type: 'text/csv;charset=utf-8;',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
