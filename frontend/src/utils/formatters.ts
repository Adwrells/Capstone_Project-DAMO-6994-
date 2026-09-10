/**
 * Healthcare Analytics Platform - Centralized Formatters
 *
 * Provides standardized numeric, statistical, clinical duration, percentage,
 * and date formatters used across all analytics dashboards, charts, and report exports.
 */

/**
 * Helper to format compact numbers with suffix, respecting maximum decimal precision
 * and dropping unnecessary trailing zeroes (e.g. 175.8M instead of 175.80M, 10k instead of 10.0k, 6.39M).
 */
function formatCompactWithSuffix(val: number, divisor: number, suffix: string, maxDp: number = 2): string {
  const scaled = val / divisor;
  const fixed = scaled.toFixed(maxDp);
  const trimmed = fixed.replace(/(\.[0-9]*[1-9])0+$/, '$1').replace(/\.0+$/, '');
  return `${trimmed}${suffix}`;
}

/**
 * Formats numeric values into standardized compact SI notation using k, M, and B.
 * - Billions (B): e.g. 1.25B (values >= 1,000,000,000)
 * - Millions (M): e.g. 6.39M, 175.8M (values >= 1,000,000)
 * - Thousands (k): e.g. 61.27k, 371.61k, 7.3k (values >= 1,000)
 * - Under 1,000: preserves decimals or integer format (e.g. 95, 2.50, 163.52, 0.13)
 * - Preserves calendar years (e.g. 2003-2022) when specified or detected.
 */
export function fmtK(
  n: number | null | undefined,
  dp: number = 2,
  options?: {
    isYear?: boolean;
    forceExact?: boolean;
  }
): string {
  if (n === null || n === undefined || !Number.isFinite(Number(n))) return '—';
  const num = Number(n);

  // Protect calendar years (e.g. 2003 to 2022) from SI suffix formatting or unwanted commas
  if (options?.isYear || (num >= 1900 && num <= 2100 && options?.isYear !== false && Number.isInteger(num))) {
    return String(num);
  }

  if (options?.forceExact) {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: Number.isInteger(num) ? 0 : Math.min(dp, 2),
      maximumFractionDigits: dp,
    });
  }

  const abs = Math.abs(num);

  if (abs >= 1_000_000_000) {
    return formatCompactWithSuffix(num, 1_000_000_000, 'B', dp);
  }
  if (abs >= 1_000_000) {
    return formatCompactWithSuffix(num, 1_000_000, 'M', dp);
  }
  if (abs >= 1_000) {
    return formatCompactWithSuffix(num, 1_000, 'k', dp);
  }

  // Under 1,000
  if (Number.isInteger(num)) return num.toString();
  if (abs < 0.01 && num !== 0) return num.toFixed(3);
  return num.toLocaleString('en-US', {
    minimumFractionDigits: abs < 10 ? Math.min(dp, 2) : 0,
    maximumFractionDigits: dp,
  });
}

/**
 * Semantic aliases for standardized compact number formatting.
 */
export const fmtCompact = fmtK;
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
  if (abs >= 1e9) return `${(num / 1e9).toFixed(dp)}B`;
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

/**
 * Formats patient visits cleanly with M/k suffix or comma formatting.
 */
export function fmtVisits(n: number | null | undefined): string {
  if (n === null || n === undefined || !Number.isFinite(Number(n))) return '—';
  const num = Number(n);
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}k`;
  return num.toLocaleString('en-US');
}

/**
 * Formats Length of Stay with standard clinical precision and unit.
 */
export function fmtLOS(hours: number | null | undefined, dp: number = 2): string {
  if (hours === null || hours === undefined || !Number.isFinite(Number(hours))) return '—';
  return `${Number(hours).toFixed(dp)} hrs`;
}

/**
 * Formats Emergency Resource Burden Index (ERBI).
 */
export function fmtERBI(score: number | null | undefined, dp: number = 2): string {
  if (score === null || score === undefined || !Number.isFinite(Number(score))) return '—';
  return Number(score).toFixed(dp);
}

/**
 * Formats R² regression coefficient with symbol.
 */
export function fmtR2(r: number | null | undefined, dp: number = 4): string {
  if (r === null || r === undefined || !Number.isFinite(Number(r))) return '—';
  return `R² = ${Number(r).toFixed(dp)}`;
}

/**
 * Formats Eta-squared effect size with symbol.
 */
export function fmtEta(eta: number | null | undefined, dp: number = 3): string {
  if (eta === null || eta === undefined || !Number.isFinite(Number(eta))) return '—';
  return `η² = ${Number(eta).toFixed(dp)}`;
}

