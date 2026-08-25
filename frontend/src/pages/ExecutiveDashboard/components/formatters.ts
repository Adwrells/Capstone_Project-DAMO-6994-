/**
 * Universal Number & Statistical Formatters for Healthcare Analytics Platform
 */

export function fmtK(n: number | null | undefined): string {
  if (n === null || n === undefined || !Number.isFinite(Number(n))) return '—';
  const num = Number(n);
  const abs = Math.abs(num);
  if (abs >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(2)}B`;
  if (abs >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000) return `${(num / 1_000).toFixed(1)}k`;
  return num.toFixed(abs < 10 && !Number.isInteger(num) ? 2 : 0);
}

export function fmtNum(n: number | null | undefined, dp: number = 0): string {
  if (n === null || n === undefined || !Number.isFinite(Number(n))) return '—';
  return Number(n).toLocaleString('en-US', {
    minimumFractionDigits: dp,
    maximumFractionDigits: dp,
  });
}

export function fmtPct(n: number | null | undefined, dp: number = 1): string {
  if (n === null || n === undefined || !Number.isFinite(Number(n))) return '—';
  return `${Number(n).toFixed(dp)}%`;
}

export function fmtHours(hours: number | null | undefined, dp: number = 2): string {
  if (hours === null || hours === undefined || !Number.isFinite(Number(hours))) return '—';
  return `${Number(hours).toFixed(dp)} hrs`;
}

export function fmtMinutes(min: number | null | undefined): string {
  if (min === null || min === undefined || !Number.isFinite(Number(min))) return '—';
  return `${Math.round(Number(min))} min`;
}

export function fmtP(p: number | null | undefined): string {
  if (p === null || p === undefined || !Number.isFinite(Number(p))) return '—';
  const val = Number(p);
  if (val < 0.0001) return '< 0.0001';
  if (val < 0.001) return '< 0.001';
  if (val < 0.01) return '< 0.01';
  return val.toFixed(4);
}
