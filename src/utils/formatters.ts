export function formatAed(amount?: number | null): string {
  if (amount === undefined || amount === null || isNaN(Number(amount))) {
    return 'AED 0';
  }
  const num = Number(amount);
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
    maximumFractionDigits: 0,
  }).format(num).replace('AED', 'AED ');
}

export function formatAedCompact(amount?: number | null): string {
  if (amount === undefined || amount === null || isNaN(Number(amount))) {
    return 'AED 0';
  }
  const num = Number(amount);
  const abs = Math.abs(num);
  const sign = num < 0 ? '-' : '';

  if (abs >= 1_000_000_000) {
    return `${sign}AED ${(abs / 1_000_000_000).toFixed(1)}B`;
  }
  if (abs >= 1_000_000) {
    return `${sign}AED ${(abs / 1_000_000).toFixed(1)}M`;
  }
  if (abs >= 1_000) {
    return `${sign}AED ${(abs / 1_000).toFixed(0)}K`;
  }
  return `${sign}AED ${abs}`;
}

export function formatNumber(num?: number | null): string {
  if (num === undefined || num === null || isNaN(Number(num))) return '0';
  return new Intl.NumberFormat('en-US').format(Number(num));
}

export function formatPercent(percent?: number | null): string {
  if (percent === undefined || percent === null || isNaN(Number(percent))) return '0%';
  return `${Math.round(Number(percent))}%`;
}

export function formatShortDate(dateStr?: string | null): string {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' });
  } catch {
    return dateStr;
  }
}
