export function formatAed(amount: number): string {
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
    maximumFractionDigits: 0,
  }).format(amount).replace('AED', 'AED ');
}

export function formatAedCompact(amount: number): string {
  if (Math.abs(amount) >= 1_000_000_000) {
    return `AED ${(amount / 1_000_000_000).toFixed(1)}B`;
  }
  if (Math.abs(amount) >= 1_000_000) {
    return `AED ${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (Math.abs(amount) >= 1_000) {
    return `AED ${(amount / 1_000).toFixed(0)}K`;
  }
  return `AED ${amount}`;
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

export function formatPercent(percent: number): string {
  return `${Math.round(percent)}%`;
}

export function formatShortDate(dateStr: string): string {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' });
  } catch {
    return dateStr;
  }
}
