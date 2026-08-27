/**
 * Healthcare Analytics Platform - Centralized Formatters
 *
 * Provides standardized numeric, statistical, clinical duration, percentage,
 * and date formatters used across all analytics dashboards, charts, and report exports.
 */

/**
 * Formats large numeric counts into compact SI units (e.g. 1.25M, 34.5k).
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

/**
 * Semantic alias for compact number formatting.
 */
export const formatCompactNumber = fmtK;

/**
 * Formats numeric values with localized thousand separators and specified decimal precision.
 */
export function fmtNum(n: number | null | undefined, dp: number = 0): string {
  if (n === null || n === undefined || !Number.isFinite(Number(n))) return '—';
  return Number(n).toLocaleString('en-US', {
    minimumFractionDigits: dp,
    maximumFractionDigits: dp,
  });
}

/**
 * Semantic alias for locale number formatting.
 */
export const formatNumber = fmtNum;

/**
 * Formats decimal/percentage ratios into standard percentage strings (e.g. 14.2%).
 */
export function fmtPct(n: number | null | undefined, dp: number = 1): string {
  if (n === null || n === undefined || !Number.isFinite(Number(n))) return '—';
  return `${Number(n).toFixed(dp)}%`;
}

/**
 * Semantic alias for percentage formatting.
 */
export const formatPercentage = fmtPct;

/**
 * Formats clinical duration in hours with unit suffix (e.g. 4.50 hrs).
 */
export function fmtHours(hours: number | null | undefined, dp: number = 2): string {
  if (hours === null || hours === undefined || !Number.isFinite(Number(hours))) return '—';
  return `${Number(hours).toFixed(dp)} hrs`;
}

/**
 * Semantic alias for clinical hours duration.
 */
export const formatDuration = fmtHours;

/**
 * Formats clinical duration in minutes (e.g. 90 min).
 */
export function fmtMinutes(min: number | null | undefined): string {
  if (min === null || min === undefined || !Number.isFinite(Number(min))) return '—';
  return `${Math.round(Number(min))} min`;
}

/**
 * Formats statistical p-values with standard scientific significance thresholds.
 * Formats values below 0.0001 as '< 0.0001', below 0.001 as '< 0.001', and exact values to 4 decimal places.
 */
export function fmtP(p: number | null | undefined): string {
  if (p === null || p === undefined || !Number.isFinite(Number(p))) return '—';
  const val = Number(p);
  if (val < 0.0001) return '< 0.0001';
  if (val < 0.001) return '< 0.001';
  if (val < 0.01) return '< 0.01';
  return val.toFixed(4);
}

/**
 * Semantic alias for p-value formatting.
 */
export const formatPValue = fmtP;

/**
 * Formats clinical duration in hours with short 'h' suffix (e.g. 4.60 h).
 */
export function fmtHoursShort(hours: number | null | undefined, dp: number = 2): string {
  if (hours === null || hours === undefined || !Number.isFinite(Number(hours))) return '—';
  return `${Number(hours).toFixed(dp)} h`;
}

/**
 * Formats large test statistics with clean exponential or unit prefixes (e.g. 1.26 × 10⁸ or 2.69 × 10¹²).
 */
export function fmtStat(val: number | null | undefined, dp: number = 2): string {
  if (val === null || val === undefined || !Number.isFinite(Number(val))) return '—';
  const num = Number(val);
  const abs = Math.abs(num);
  if (abs >= 1e12) return `${(num / 1e12).toFixed(dp)} × 10¹²`;
  if (abs >= 1e8) return `${(num / 1e8).toFixed(dp)} × 10⁸`;
  if (abs >= 1e6) return `${(num / 1e6).toFixed(dp)}M`;
  if (abs >= 1e3) return `${(num / 1e3).toFixed(dp)}k`;
  return num.toLocaleString('en-US', { maximumFractionDigits: dp });
}

/**
 * Standardizes fiscal year labels (e.g. "2022-2023" -> "FY 2022-23").
 */
export function formatFiscalYear(fy: string | null | undefined): string {
  if (!fy) return '—';
  const cleaned = fy.trim();
  if (cleaned.startsWith('FY')) return cleaned;
  const match = cleaned.match(/^(\d{4})[-/](\d{4})$/);
  if (match) {
    return `FY ${match[1]}-${match[2].slice(2)}`;
  }
  return `FY ${cleaned}`;
}
