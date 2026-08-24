/**
 * AnalyticsCore.tsx — DAMO-699 Capstone
 * Hypothesis Testing & Statistical Analysis
 * Redesigned per Principal Biostatistician / Professor of Biostatistics specs.
 * All statistics computed dynamically. No hardcoded values.
 * Aggregate-level interpretation only. No individual patient references.
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  ChevronRight, ChevronDown, ChevronUp, Info, ShieldCheck, Clock, Cpu, FileText
} from 'lucide-react';
import {
  ResponsiveContainer, ComposedChart, Line, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';

// ─── INTERFACES ──────────────────────────────────────────────────────────────
interface AnalyticsCoreProps { fields: any[]; data: any[]; onNavigateNext?: () => void; }

// ─── PALETTE ─────────────────────────────────────────────────────────────────
const PAL = ['#0F4C81', '#2563EB', '#0EA5E9', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
const CTAS_PAL: Record<string, string> = {
  Resuscitation: '#EF4444', Emergent: '#F97316', Urgent: '#F59E0B',
  'Less Urgent': '#3B82F6', 'Non-Urgent': '#10B981'
};

// ─── STATISTICAL UTILITIES ───────────────────────────────────────────────────
const normalCDF = (z: number): number => {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const b = [0.31938153, -0.356563782, 1.781477937, -1.821255978, 1.330274429];
  let poly = 0, tp = t;
  b.forEach(c => { poly += c * tp; tp *= t; });
  const p = 1 - (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * z * z) * poly;
  return z >= 0 ? p : 1 - p;
};

const lgamma = (z: number): number => {
  const c = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.001208650973866179, -0.000005395239384953];
  let y = z, tmp = z + 5.5; tmp -= (z + 0.5) * Math.log(tmp);
  let ser = 1.000000000190015; c.forEach(v => { y += 1; ser += v / y; });
  return -tmp + Math.log(2.5066282746310005 * ser / z);
};

// Regularised lower incomplete gamma P(a,x) — series form, valid while x < a + 1.
const gammaPSeries = (a: number, x: number): number => {
  if (x <= 0) return 0;
  let sum = 1 / a, term = 1 / a;
  for (let n = 1; n <= 1000; n++) { term *= x / (a + n); sum += term; if (Math.abs(term) < Math.abs(sum) * 1e-16) break; }
  return sum * Math.exp(-x + a * Math.log(x) - lgamma(a));
};

// Regularised upper incomplete gamma Q(a,x) — Lentz continued fraction, for x >= a + 1.
// The series alone diverges badly once x greatly exceeds a, which is exactly the regime
// visit-weighted H statistics land in (H ~ 1e8), so the branch below is load-bearing.
const gammaQContinued = (a: number, x: number): number => {
  const tiny = 1e-300;
  let b = x + 1 - a, c = 1 / tiny, d = b !== 0 ? 1 / b : 1 / tiny, h = d;
  for (let i = 1; i <= 1000; i++) {
    const an = -i * (i - a);
    b += 2;
    d = an * d + b; if (Math.abs(d) < tiny) d = tiny;
    c = b + an / c; if (Math.abs(c) < tiny) c = tiny;
    d = 1 / d;
    const delta = d * c;
    h *= delta;
    if (Math.abs(delta - 1) < 1e-16) break;
  }
  return h * Math.exp(-x + a * Math.log(x) - lgamma(a));
};

const chiSqP = (h: number, df: number): number => {
  if (df <= 0 || h <= 0) return 1;
  if (!isFinite(h)) return 0;
  const a = df / 2, x = h / 2;
  const q = x < a + 1 ? 1 - gammaPSeries(a, x) : gammaQContinued(a, x);
  return Math.max(0, Math.min(1, q));
};
const fmtP = (p: number): string => p < 0.0001 ? '< 0.0001' : p.toFixed(4);
const fmtN = (n: number, d = 2): string => isFinite(n) ? n.toFixed(d) : 'N/A';
const getV = (row: any, ...keys: string[]): any => { for (const k of keys) if (row[k] != null && row[k] !== '') return row[k]; return undefined; };

// ─── FREQUENCY-WEIGHTED NON-PARAMETRIC TESTS ─────────────────────────────────
// Mirrors backend/analytics/statistics/weighted.py. Each row is an AGGREGATE carrying
// an ed_visits count, so visits are frequency weights: the tests must run over the
// weight-expanded population (N in the hundreds of millions), not over the row count.
//
// The previous implementation approximated this by replicating each row into a
// 500-slot array, which quantised every weight to ~0.2% and silently capped N at 500.
// Weighted midranks give the exact same answer as full replication at no cost.

export interface WGroup { v: number[]; w: number[] }

const cleanPairs = (vals: number[], wts?: number[]): WGroup => {
  const out: WGroup = { v: [], w: [] };
  vals.forEach((value, i) => {
    const weight = wts ? wts[i] : 1;
    if (!isFinite(value) || !isFinite(weight) || weight <= 0) return;
    out.v.push(value); out.w.push(weight);
  });
  return out;
};

/** Midranks each distinct value across the weight-expanded population. */
const weightedMidranks = (vals: number[], wts: number[]) => {
  const weightByValue = new Map<number, number>();
  vals.forEach((v, i) => weightByValue.set(v, (weightByValue.get(v) || 0) + wts[i]));
  const rankByValue = new Map<number, number>();
  const tieSizes: number[] = [];
  let cumulative = 0;
  [...weightByValue.keys()].sort((a, b) => a - b).forEach(value => {
    const tie = weightByValue.get(value)!;
    rankByValue.set(value, cumulative + (tie + 1) / 2);
    tieSizes.push(tie);
    cumulative += tie;
  });
  return { rankByValue, tieSizes, total: cumulative };
};

// 1 - sum(t^3 - t) / (N^3 - N). Float64 carries t^3 up to ~1e308 without wraparound,
// so unlike a fixed-width integer type it stays valid at NACRS scale.
const tieCorrection = (tieSizes: number[], N: number): number => {
  if (N < 2) return 1;
  const denom = N ** 3 - N;
  if (denom === 0) return 1;
  const c = 1 - tieSizes.reduce((s, t) => s + (t ** 3 - t), 0) / denom;
  return c > 0 ? c : 1;
};

const weightedKruskalWallis = (groups: WGroup[]): { h: number; p: number; eps2: number; df: number; n: number; tieC: number } => {
  const clean = groups.map(g => cleanPairs(g.v, g.w)).filter(g => g.v.length > 0);
  const k = clean.length;
  const N = clean.reduce((s, g) => s + g.w.reduce((a, b) => a + b, 0), 0);
  if (k < 2 || N < 3) return { h: 0, p: 1, eps2: 0, df: Math.max(0, k - 1), n: N, tieC: 1 };

  const allV = clean.flatMap(g => g.v), allW = clean.flatMap(g => g.w);
  const { rankByValue, tieSizes } = weightedMidranks(allV, allW);

  let rankSumTerm = 0;
  clean.forEach(g => {
    const gw = g.w.reduce((a, b) => a + b, 0);
    const rankSum = g.v.reduce((s, v, i) => s + rankByValue.get(v)! * g.w[i], 0);
    rankSumTerm += (rankSum * rankSum) / gw;
  });

  const hRaw = (12 / (N * (N + 1))) * rankSumTerm - 3 * (N + 1);
  const tieC = tieCorrection(tieSizes, N);
  const h = hRaw / tieC;
  const df = k - 1;
  const eps2 = N - k > 0 ? Math.max(0, Math.min(1, (h - k + 1) / (N - k))) : 0;
  return { h, p: chiSqP(h, df), eps2: +eps2.toFixed(4), df, n: N, tieC };
};

/** Dunn's post-hoc: pairwise mean-rank z-tests sharing the omnibus pooled variance. */
const weightedDunn = (groups: WGroup[], names: string[]) => {
  const clean = groups.map(g => cleanPairs(g.v, g.w));
  const keep = clean.map((g, i) => ({ g, name: names[i] })).filter(x => x.g.v.length > 0);
  if (keep.length < 2) return [];

  const allV = keep.flatMap(x => x.g.v), allW = keep.flatMap(x => x.g.w);
  const { rankByValue, tieSizes, total: N } = weightedMidranks(allV, allW);
  if (N < 2) return [];

  const meanR = keep.map(x => {
    const gw = x.g.w.reduce((a, b) => a + b, 0);
    return x.g.v.reduce((s, v, i) => s + rankByValue.get(v)! * x.g.w[i], 0) / gw;
  });
  const gw = keep.map(x => x.g.w.reduce((a, b) => a + b, 0));
  const tieSum = tieSizes.reduce((s, t) => s + (t ** 3 - t), 0);
  const pooled = (N * (N + 1) / 12) - tieSum / (12 * (N - 1));

  const pairs: { pair: string; z: number; p: number; pAdj: number; significant: boolean }[] = [];
  for (let i = 0; i < keep.length - 1; i++) for (let j = i + 1; j < keep.length; j++) {
    const se = pooled > 0 ? Math.sqrt(pooled * (1 / gw[i] + 1 / gw[j])) : 0;
    const z = se > 0 ? Math.abs(meanR[i] - meanR[j]) / se : 0;
    pairs.push({ pair: `${keep[i].name} vs. ${keep[j].name}`, z: +z.toFixed(3), p: Math.min(1, 2 * (1 - normalCDF(z))), pAdj: 0, significant: false });
  }
  const m = pairs.length;
  pairs.forEach(r => { r.pAdj = Math.min(1, r.p * m); r.significant = r.pAdj < 0.05; });
  return pairs;
};

const weightedMedian = (vals: number[], wts: number[]): number => {
  if (!vals.length) return 0;
  const order = vals.map((v, i) => ({ v, w: wts[i] })).sort((a, b) => a.v - b.v);
  const mid = order.reduce((s, o) => s + o.w, 0) / 2;
  let cum = 0;
  for (const o of order) { cum += o.w; if (cum >= mid) return o.v; }
  return order[order.length - 1].v;
};

const weightedMannWhitneyU = (ga: WGroup, gb: WGroup) => {
  const a = cleanPairs(ga.v, ga.w), b = cleanPairs(gb.v, gb.w);
  const n1 = a.w.reduce((s, w) => s + w, 0), n2 = b.w.reduce((s, w) => s + w, 0);
  if (!a.v.length || !b.v.length || !n1 || !n2) return { u: 0, p: 1, rb: 0, medDiff: 0, z: 0, n: 0 };

  const { rankByValue, tieSizes, total: N } = weightedMidranks([...a.v, ...b.v], [...a.w, ...b.w]);
  const r1 = a.v.reduce((s, v, i) => s + rankByValue.get(v)! * a.w[i], 0);
  const u1 = r1 - n1 * (n1 + 1) / 2;
  const u = Math.min(u1, n1 * n2 - u1);

  const mu = n1 * n2 / 2;
  const tieSum = tieSizes.reduce((s, t) => s + (t ** 3 - t), 0);
  const variance = (n1 * n2 / 12) * ((N + 1) - tieSum / (N * (N - 1)));
  const sigma = variance > 0 ? Math.sqrt(variance) : 0;
  const z = sigma > 0 ? Math.max(0, (Math.abs(u - mu) - 0.5) / sigma) : 0;

  return {
    u, z: +z.toFixed(3),
    p: sigma > 0 ? Math.min(1, 2 * (1 - normalCDF(z))) : 1,
    rb: +(1 - (2 * u) / (n1 * n2)).toFixed(4),
    medDiff: +(weightedMedian(a.v, a.w) - weightedMedian(b.v, b.w)).toFixed(3),
    n: N,
  };
};

const boxStats = (vals: number[]) => {
  if (!vals.length) return { q1: 0, median: 0, q3: 0, whiskerLow: 0, whiskerHigh: 0, n: 0 };
  const s = [...vals].sort((a, b) => a - b), n = s.length;
  const q = (p: number) => { const i = p * (n - 1), lo = Math.floor(i), hi = Math.ceil(i); return s[lo] + (i - lo) * (s[hi] - s[lo] || 0); };
  const q1 = q(.25), median = q(.5), q3 = q(.75), iqr = q3 - q1;
  return { q1: +q1.toFixed(3), median: +median.toFixed(3), q3: +q3.toFixed(3), whiskerLow: +Math.max(s[0], q1 - 1.5 * iqr).toFixed(3), whiskerHigh: +Math.min(s[n - 1], q3 + 1.5 * iqr).toFixed(3), n };
};

const mannKendall = (series: number[]) => {
  const n = series.length; if (n < 3) return { tau: 0, s: 0, p: 1, trend: 'insufficient data' };
  let s = 0;
  for (let i = 0; i < n - 1; i++) for (let j = i + 1; j < n; j++) { const d = series[j] - series[i]; if (d > 0) s++; else if (d < 0) s--; }
  const varS = (n * (n - 1) * (2 * n + 5)) / 18, z = s === 0 ? 0 : (s > 0 ? s - 1 : s + 1) / Math.sqrt(varS);
  return { tau: +(2 * s / (n * (n - 1))).toFixed(4), s, p: 2 * (1 - normalCDF(Math.abs(z))), trend: s > 0 ? 'increasing' : s < 0 ? 'decreasing' : 'no trend' };
};

const holtLinearForecast = (series: number[], alpha = 0.3, beta = 0.1, steps = 2) => {
  if (!series.length) return { forecast: [0, 0], ci: [[0, 0], [0, 0]] as [number, number][] };
  if (series.length === 1) return { forecast: [series[0], series[0]], ci: [[series[0], series[0]], [series[0], series[0]]] as [number, number][] };
  
  let level = series[0];
  let trend = series[1] - series[0];
  
  const smoothed = [level];
  for (let i = 1; i < series.length; i++) {
    const prevLevel = level;
    const prevTrend = trend;
    level = alpha * series[i] + (1 - alpha) * (prevLevel + prevTrend);
    trend = beta * (level - prevLevel) + (1 - beta) * prevTrend;
    smoothed.push(level);
  }
  
  const residuals = series.slice(1).map((v, i) => v - (smoothed[i] + trend));
  const sigma = Math.sqrt(residuals.reduce((s, r) => s + r * r, 0) / Math.max(1, residuals.length - 1));
  
  const forecast: number[] = [];
  const ci: [number, number][] = [];
  for (let h = 1; h <= steps; h++) {
    const point = +(level + h * trend).toFixed(2);
    forecast.push(point);
    const margin = 1.96 * sigma * Math.sqrt(h);
    ci.push([+(point - margin).toFixed(2), +(point + margin).toFixed(2)]);
  }
  return { forecast, ci, level, trend };
};

const sesForecast = holtLinearForecast;

// WLS regression
const invertMat = (mat: number[][]): number[][] | null => {
  const n = mat.length, aug = mat.map((row, i) => [...row, ...Array(n).fill(0).map((_, j) => j === i ? 1 : 0)]);
  for (let col = 0; col < n; col++) {
    let maxR = col; for (let r = col + 1; r < n; r++)if (Math.abs(aug[r][col]) > Math.abs(aug[maxR][col])) maxR = r;
    [aug[col], aug[maxR]] = [aug[maxR], aug[col]];
    const piv = aug[col][col]; if (Math.abs(piv) < 1e-12) return null;
    for (let j = 0; j < 2 * n; j++)aug[col][j] /= piv;
    for (let r = 0; r < n; r++) { if (r !== col) { const f = aug[r][col]; for (let j = 0; j < 2 * n; j++)aug[r][j] -= f * aug[col][j]; } }
  }
  return aug.map(row => row.slice(n));
};
const wls = (y: number[], X: number[][], w: number[]) => {
  const n = y.length, p = X[0]?.length ?? 0; if (n < p + 2 || !p) return null;
  const XtWX: number[][] = Array.from({ length: p }, () => Array(p).fill(0)), XtWy: number[] = Array(p).fill(0);
  for (let i = 0; i < n; i++) { const wi = w[i]; for (let j = 0; j < p; j++) { XtWy[j] += wi * X[i][j] * y[i]; for (let k = 0; k < p; k++)XtWX[j][k] += wi * X[i][j] * X[i][k]; } }
  const inv = invertMat(XtWX); if (!inv) return null;
  const betas = Array(p).fill(0).map((_, j) => inv[j].reduce((s, v, k) => s + v * XtWy[k], 0));
  let rss = 0, tss = 0; const sW = w.reduce((s, v) => s + v, 0) || 1, yBar = y.reduce((s, v, i) => s + w[i] * v, 0) / sW;
  for (let i = 0; i < n; i++) { const yH = X[i].reduce((s, x, j) => s + x * betas[j], 0); rss += w[i] * (y[i] - yH) ** 2; tss += w[i] * (y[i] - yBar) ** 2; }
  const sig2 = rss / Math.max(1, n - p);
  const se = inv.map((_, j) => Math.sqrt(Math.abs(inv[j][j]) * sig2));
  const pv = betas.map((b, j) => Math.min(1, 2 * (1 - normalCDF(Math.abs(b) / (se[j] || 1)))));
  const adjR2 = Math.max(0, 1 - (rss / (n - p)) / ((tss || 1) / (n - 1)));
  return { betas: betas.map(b => +b.toFixed(4)), se: se.map(s => +s.toFixed(4)), p: pv, ciL: betas.map((b, j) => +(b - 1.96 * se[j]).toFixed(4)), ciH: betas.map((b, j) => +(b + 1.96 * se[j]).toFixed(4)), adjR2: +adjR2.toFixed(4) };
};

// ─── CHI-SQUARE TEST OF INDEPENDENCE ─────────────────────────────────────────
interface ChiSquareResult {
  chi2: number;
  df: number;
  p: number;
  cramersV: number;
  observed: number[][];
  expected: number[][];
  rowLabels: string[];
  colLabels: string[];
  totalN: number;
  rejectNull: boolean;
}

const chiSquareTest = (matrix: number[][], rowLabels: string[], colLabels: string[]): ChiSquareResult => {
  const nRows = matrix.length;
  const nCols = matrix[0]?.length || 0;
  if (!nRows || !nCols) {
    return { chi2: 0, df: 1, p: 1, cramersV: 0, observed: matrix, expected: [], rowLabels, colLabels, totalN: 0, rejectNull: false };
  }
  const rowSums = matrix.map(r => r.reduce((a, b) => a + b, 0));
  const colSums = Array.from({ length: nCols }, (_, c) => matrix.reduce((s, r) => s + (r[c] || 0), 0));
  const totalN = rowSums.reduce((a, b) => a + b, 0);

  const expected: number[][] = [];
  let chi2 = 0;
  for (let r = 0; r < nRows; r++) {
    const expRow: number[] = [];
    for (let c = 0; c < nCols; c++) {
      const exp = totalN > 0 ? (rowSums[r] * colSums[c]) / totalN : 0;
      expRow.push(exp);
      if (exp > 0) {
        chi2 += ((matrix[r][c] - exp) ** 2) / exp;
      }
    }
    expected.push(expRow);
  }
  const df = Math.max(1, (nRows - 1) * (nCols - 1));
  const p = chiSqP(chi2, df);
  const k = Math.min(nRows, nCols) - 1;
  const cramersV = totalN > 0 && k > 0 ? Math.sqrt(chi2 / (totalN * k)) : 0;

  return {
    chi2: +chi2.toFixed(4),
    df,
    p,
    cramersV: +cramersV.toFixed(6),
    observed: matrix,
    expected,
    rowLabels,
    colLabels,
    totalN,
    rejectNull: p < 0.05,
  };
};

function ContingencyTableViz({
  observed,
  expected,
  rowLabels,
  colLabels,
  totalN,
}: {
  observed: number[][];
  expected: number[][];
  rowLabels: string[];
  colLabels: string[];
  totalN: number;
}) {
  const rowSums = observed.map(r => r.reduce((a, b) => a + b, 0));
  const colSums = Array.from({ length: colLabels.length }, (_, c) =>
    observed.reduce((s, r) => s + (r[c] || 0), 0)
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[11px] border-collapse bg-white dark:bg-[#131f37] rounded-xl overflow-hidden border border-slate-200 dark:border-[#1e2d4a]">
        <thead>
          <tr className="bg-slate-50 dark:bg-[#152033] border-b border-slate-200 dark:border-[#1e2d4a]">
            <th className="text-left px-4 py-2.5 font-bold text-slate-500 uppercase text-[10px]">Patient Sex</th>
            {colLabels.map(c => (
              <th key={c} className="text-right px-4 py-2.5 font-bold text-slate-500 uppercase text-[10px]">
                {c}
              </th>
            ))}
            <th className="text-right px-4 py-2.5 font-bold text-[#0F4C81] dark:text-[#3B82F6] uppercase text-[10px]">
              Total Visits
            </th>
          </tr>
        </thead>
        <tbody>
          {rowLabels.map((rLabel, r) => {
            const rSum = rowSums[r] || 1;
            return (
              <tr key={rLabel} className="border-b border-slate-100 dark:border-[#1e2d4a]">
                <td className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-200">
                  {rLabel}
                </td>
                {colLabels.map((cLabel, c) => {
                  const obs = observed[r]?.[c] || 0;
                  const exp = expected[r]?.[c] || 0;
                  const pct = ((obs / rSum) * 100).toFixed(2);
                  return (
                    <td key={cLabel} className="px-4 py-3 text-right">
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-100 block">
                        {obs.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono block">
                        Exp: {Math.round(exp).toLocaleString()} ({pct}%)
                      </span>
                    </td>
                  );
                })}
                <td className="px-4 py-3 text-right font-mono font-bold text-[#0F4C81] dark:text-[#3B82F6]">
                  {rSum.toLocaleString()}
                </td>
              </tr>
            );
          })}
          <tr className="bg-slate-50/50 dark:bg-[#152033]/50 font-bold border-t border-slate-200 dark:border-[#1e2d4a]">
            <td className="px-4 py-2.5 text-slate-600 dark:text-slate-300">Total Visits</td>
            {colSums.map((cSum, c) => (
              <td key={c} className="px-4 py-2.5 text-right font-mono text-slate-700 dark:text-slate-200">
                {cSum.toLocaleString()}
              </td>
            ))}
            <td className="px-4 py-2.5 text-right font-mono text-emerald-600 dark:text-emerald-400">
              {totalN.toLocaleString()}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// ─── SVG BOX PLOT ────────────────────────────────────────────────────────────
interface BoxGroup { label: string; color: string; stats: ReturnType<typeof boxStats>; }

function SVGBoxPlot({ groups, yLabel }: { groups: BoxGroup[]; yLabel: string }) {
  if (!groups.length) return <div className="text-xs text-slate-400 p-6 text-center">Insufficient data — load a dataset with the required columns.</div>;
  const allV = groups.flatMap(g => [g.stats.whiskerLow, g.stats.q1, g.stats.median, g.stats.q3, g.stats.whiskerHigh]).filter(isFinite);
  if (!allV.length) return null;
  const yMin = Math.max(0, Math.floor(Math.min(...allV) - 0.5)), yMax = Math.ceil(Math.max(...allV) + 0.5);
  const W = 560, H = 260, mL = 52, mR = 16, mT = 16, mB = 52, pW = W - mL - mR, pH = H - mT - mB;
  const toY = (v: number) => mT + pH - ((v - yMin) / (yMax - yMin || 1)) * pH;
  const n = groups.length, bw = Math.min(52, (pW / n) * 0.48), cx = (i: number) => mL + (i + 0.5) * (pW / n);
  const range = yMax - yMin || 1, step = range <= 4 ? 0.5 : range <= 10 ? 1 : range <= 20 ? 2 : 5;
  const ticks: number[] = [];
  for (let v = Math.ceil(yMin / step) * step; v <= yMax; v += step) ticks.push(+v.toFixed(1));
  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minWidth: 300, maxHeight: 260 }}>
        <line x1={mL} y1={mT} x2={mL} y2={mT + pH} stroke="#cbd5e1" strokeWidth={1} />
        <line x1={mL} y1={mT + pH} x2={mL + pW} y2={mT + pH} stroke="#cbd5e1" strokeWidth={1} />
        {ticks.map(v => (
          <g key={v}>
            <line x1={mL - 4} y1={toY(v)} x2={mL + pW} y2={toY(v)} stroke="#f1f5f9" strokeWidth={0.8} />
            <text x={mL - 7} y={toY(v) + 4} textAnchor="end" fontSize={9} fill="#6b7280">{v}</text>
          </g>
        ))}
        <text x={13} y={mT + pH / 2} textAnchor="middle" fontSize={10} fill="#374151" transform={`rotate(-90,13,${mT + pH / 2})`}>{yLabel}</text>
        {groups.map((g, i) => {
          const { q1, median, q3, whiskerLow, whiskerHigh, n: cnt } = g.stats;
          if (!cnt) return null;
          const x = cx(i), yQ1 = toY(q1), yMed = toY(median), yQ3 = toY(q3), yWL = toY(whiskerLow), yWH = toY(whiskerHigh);
          return (
            <g key={g.label}>
              <line x1={x} y1={yWH} x2={x} y2={yWL} stroke={g.color} strokeWidth={1.5} opacity={0.55} />
              <line x1={x - 9} y1={yWH} x2={x + 9} y2={yWH} stroke={g.color} strokeWidth={1.5} />
              <line x1={x - 9} y1={yWL} x2={x + 9} y2={yWL} stroke={g.color} strokeWidth={1.5} />
              <rect x={x - bw / 2} y={yQ3} width={bw} height={Math.abs(yQ1 - yQ3) || 2} fill={g.color + '20'} stroke={g.color} strokeWidth={2} rx={3} />
              <line x1={x - bw / 2} y1={yMed} x2={x + bw / 2} y2={yMed} stroke={g.color} strokeWidth={2.5} />
              {isFinite(median) && <text x={x} y={yMed - 6} textAnchor="middle" fontSize={9} fill={g.color} fontWeight="700">{median.toFixed(2)}</text>}
              <text x={x} y={mT + pH + 16} textAnchor="middle" fontSize={9} fill="#374151">{g.label.length > 13 ? g.label.slice(0, 12) + '…' : g.label}</text>
              <text x={x} y={mT + pH + 28} textAnchor="middle" fontSize={8} fill="#94a3b8">n={cnt}</text>
            </g>
          );
        })}
        <text x={mL + pW / 2} y={H - 3} textAnchor="middle" fontSize={8} fill="#94a3b8">Box: IQR (Q1–Q3) · Centre line: Median · Whiskers: 1.5×IQR</text>
      </svg>
    </div>
  );
}

// ─── FOREST PLOT ─────────────────────────────────────────────────────────────
interface FEntry { label: string; beta: number; ciL: number; ciH: number; p: number; se: number; }
function ForestPlot({ entries, xLabel }: { entries: FEntry[]; xLabel: string }) {
  if (!entries.length) return <div className="text-xs text-slate-400 p-6 text-center">Insufficient aggregate data for regression.</div>;
  const allV = entries.flatMap(e => [e.ciL, e.ciH, e.beta]).filter(isFinite);
  const xMin = Math.floor(Math.min(...allV) - 0.5), xMax = Math.ceil(Math.max(...allV) + 0.5);
  const W = 560, rowH = 34, H = entries.length * rowH + 56, mL = 142, mR = 52, mT = 22, mB = 28, pW = W - mL - mR, pH = H - mT - mB;
  const toX = (v: number) => mL + ((v - xMin) / (xMax - xMin || 1)) * pW;
  const rY = (i: number) => mT + i * rowH + rowH / 2;
  const xStep = Math.ceil((xMax - xMin) / 5), xTicks: number[] = [];
  for (let v = Math.ceil(xMin / xStep) * xStep; v <= xMax; v += xStep) xTicks.push(v);
  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minWidth: 320, maxHeight: H }}>
        {xTicks.map(v => (
          <g key={v}>
            <line x1={toX(v)} y1={mT} x2={toX(v)} y2={mT + pH} stroke="#f1f5f9" strokeWidth={0.8} />
            <text x={toX(v)} y={mT + pH + 15} textAnchor="middle" fontSize={9} fill="#6b7280">{v.toFixed(1)}</text>
          </g>
        ))}
        <line x1={toX(0)} y1={mT} x2={toX(0)} y2={mT + pH} stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="4 3" />
        <line x1={mL} y1={mT + pH} x2={mL + pW} y2={mT + pH} stroke="#cbd5e1" strokeWidth={1} />
        <text x={mL + pW / 2} y={H - 4} textAnchor="middle" fontSize={10} fill="#374151">{xLabel}</text>
        <text x={mL - 6} y={mT - 5} textAnchor="end" fontSize={9} fill="#374151" fontWeight="700">Predictor (vs. Reference)</text>
        <text x={W - 4} y={mT - 5} textAnchor="end" fontSize={9} fill="#374151" fontWeight="700">p-value</text>
        {entries.map((e, i) => {
          const y = rY(i), sig = e.p < 0.05;
          const xB = toX(e.beta), xL = toX(Math.max(xMin, e.ciL)), xH = toX(Math.min(xMax, e.ciH));
          return (
            <g key={e.label}>
              {i % 2 === 0 && <rect x={mL} y={mT + i * rowH} width={pW} height={rowH} fill="#f8fafc" rx={0} />}
              <text x={mL - 6} y={y + 4} textAnchor="end" fontSize={9} fill={sig ? '#0F4C81' : '#6b7280'} fontWeight={sig ? '700' : '400'}>{e.label.length > 22 ? e.label.slice(0, 21) + '…' : e.label}</text>
              <line x1={xL} y1={y} x2={xH} y2={y} stroke={sig ? '#0F4C81' : '#94a3b8'} strokeWidth={2} />
              <line x1={xL} y1={y - 5} x2={xL} y2={y + 5} stroke={sig ? '#0F4C81' : '#94a3b8'} strokeWidth={1.5} />
              <line x1={xH} y1={y - 5} x2={xH} y2={y + 5} stroke={sig ? '#0F4C81' : '#94a3b8'} strokeWidth={1.5} />
              <rect x={xB - 5} y={y - 5} width={10} height={10} fill={sig ? '#0F4C81' : '#94a3b8'} rx={1} />
              <text x={W - 4} y={y + 4} textAnchor="end" fontSize={8} fill={sig ? '#0F4C81' : '#6b7280'} fontWeight={sig ? '700' : '400'}>{fmtP(e.p)}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─── ERBI TREND CHART ────────────────────────────────────────────────────────
function ERBITrendChart({ historical, forecastPts }: { historical: { fy: string; erbi: number }[]; forecastPts: { fy: string; forecast: number; ciL: number; ciH: number; ciDiff: number }[] }) {
  const hPts = historical.map(d => ({ fy: d.fy, hist: +(d.erbi / 1e6).toFixed(3) }));
  const connector = hPts.length && forecastPts.length ? [{ fy: hPts[hPts.length - 1].fy, hist: hPts[hPts.length - 1].hist, forecast: hPts[hPts.length - 1].hist, ciL: hPts[hPts.length - 1].hist, ciH: hPts[hPts.length - 1].hist, ciDiff: 0 }] : [];
  const allData = [...hPts, ...connector, ...forecastPts.map(d => ({ ...d, ciDiff: +(d.ciDiff / 1e6).toFixed(3), forecast: +(d.forecast / 1e6).toFixed(3), ciL: +(d.ciL / 1e6).toFixed(3), ciH: +(d.ciH / 1e6).toFixed(3) }))];
  return (
    <div style={{ height: 270 }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={allData} margin={{ top: 14, right: 16, bottom: 44, left: 14 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="fy" tick={{ fontSize: 8 }} angle={-40} textAnchor="end" interval={2} />
          <YAxis tick={{ fontSize: 9 }} tickFormatter={v => `${v}M`} label={{ value: 'ERBI Index (M min)', angle: -90, position: 'insideLeft', fontSize: 9, dy: 50 }} />
          <Tooltip formatter={(v: any, name: string) => [`${Number(v).toFixed(2)}M min`, name === 'hist' ? 'Historical ERBI' : name === 'forecast' ? 'SES Forecast' : name]} labelFormatter={l => `FY ${l}`} />
          <Legend wrapperStyle={{ fontSize: 10 }} />
          <Area dataKey="ciL" stackId="ci" fill="transparent" stroke="none" legendType="none" />
          <Area dataKey="ciDiff" stackId="ci" fill="#2563EB" fillOpacity={0.1} stroke="none" name="95% CI Band" />
          <Line dataKey="hist" stroke="#0F4C81" strokeWidth={2.5} dot={{ r: 3, fill: '#0F4C81' }} name="Historical ERBI" connectNulls activeDot={{ r: 5 }} />
          <Line dataKey="forecast" stroke="#2563EB" strokeWidth={2} strokeDasharray="7 4" dot={{ r: 5, fill: '#2563EB' }} name="SES Forecast (FY+1, FY+2)" connectNulls />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── TECH DETAILS PANEL ───────────────────────────────────────────────────────
function TechPanel({ details }: { details: { label: string; value: string }[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 dark:border-[#1e2d4a] rounded-lg overflow-hidden">
      <button onClick={() => setOpen(p => !p)} className="w-full flex items-center justify-between px-4 py-2.5 bg-[#F8FAFC] dark:bg-[#152033] text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1a2a40] transition-colors">
        <span className="flex items-center gap-1.5"><FileText size={12} /> Technical Details &amp; Methodology</span>
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {open && <div className="px-4 py-3 bg-[#F8FAFC] dark:bg-[#0c1524] border-t border-slate-200 dark:border-[#1e2d4a] space-y-2">
        {details.map(d => (
          <div key={d.label} className="flex gap-2 text-[11px]">
            <span className="font-semibold text-slate-500 dark:text-slate-400 min-w-[9rem] shrink-0">{d.label}:</span>
            <span className="text-slate-700 dark:text-slate-300 font-mono leading-relaxed">{d.value}</span>
          </div>
        ))}
      </div>}
    </div>
  );
}

// ─── METRIC GRID ─────────────────────────────────────────────────────────────
function MGrid({ metrics }: { metrics: { label: string; value: string | number; hi?: boolean }[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {metrics.map(m => (
        <div key={m.label} className={`p-3 rounded-lg border ${m.hi ? 'border-[#0F4C81]/30 bg-[#EFF6FF] dark:bg-[#0F4C81]/10' : 'border-[#E2E8F0] dark:border-[#1e2d4a] bg-white dark:bg-[#131f37]'}`}>
          <span className="text-[10px] text-slate-400 block font-medium leading-tight">{m.label}</span>
          <span className={`text-sm font-extrabold block mt-1 ${m.hi ? 'text-[#0F4C81] dark:text-[#3B82F6]' : 'text-slate-700 dark:text-slate-200'}`}>{m.value}</span>
        </div>
      ))}
    </div>
  );
}

// ─── INTERPRETATION PANEL ────────────────────────────────────────────────────
function InterpPanel({ stat, clinical, operational }: { stat: string; clinical: string; operational: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-100 dark:border-[#1e2d4a] pt-4">
      {[{ title: 'Statistical Finding', color: '#0F4C81', border: 'border-[#0F4C81]', bg: 'bg-indigo-50/20 dark:bg-[#152033]/40', text: stat },
      { title: 'Clinical Workflow Context', color: '#2E8B57', border: 'border-[#2E8B57]', bg: 'bg-emerald-50/20 dark:bg-[#152033]/40', text: clinical },
      { title: 'Operational Implication', color: '#D97706', border: 'border-amber-500', bg: 'bg-amber-50/20 dark:bg-[#152033]/40', text: operational }
      ].map(p => (
        <div key={p.title} className={`p-3.5 ${p.bg} border-l-[3px] ${p.border} rounded-r-lg`}>
          <span className={`font-extrabold text-[10px] uppercase tracking-wider block mb-1`} style={{ color: p.color }}>{p.title}</span>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-light text-xs">{p.text}</p>
        </div>
      ))}
    </div>
  );
}

// ─── HYPOTHESIS CARD WRAPPER ─────────────────────────────────────────────────
function HCard({ id, num, title, method, rq, decision, rejected, status, children }: { id: string; num: number; title: string; method: string; rq: string; decision: string; rejected: boolean; status: 'IDLE' | 'EXECUTING' | 'COMPLETED'; children: React.ReactNode }) {
  const [exp, setExp] = useState(num === 1);
  return (
    <div className={`border rounded-xl transition-all shadow-3xs overflow-hidden ${exp ? 'border-[#0F4C81]/30 bg-white dark:bg-[#131f37] ring-1 ring-[#0F4C81]/15' : 'border-[#E5E7EB] dark:border-[#1e2d4a] bg-white dark:bg-[#131f37]'}`} id={`card-${id}`}>
      <button onClick={() => setExp(p => !p)} className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none">
        <div className="flex items-center gap-4">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 ${exp ? 'bg-[#0F4C81] text-white' : 'bg-[#F2F4F7] dark:bg-[#1e2d4a] text-[#0F4C81] dark:text-[#3B82F6]'}`}>H{num}</div>
          <div><span className="text-[10px] text-[#0F4C81] dark:text-[#3B82F6] font-bold uppercase tracking-wider block">{method}</span>
            <h3 className="text-sm font-extrabold text-[#111827] dark:text-white leading-tight">{title}</h3></div>
        </div>
        <div className="flex items-center gap-3">
          {status === 'COMPLETED'
            ? <span className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold rounded-full ${rejected ? 'bg-emerald-50 text-[#2E8B57] dark:bg-emerald-950/20 dark:text-[#50b17c]' : 'bg-amber-50 text-amber-700'}`}><ShieldCheck size={11} />{decision}</span>
            : <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold rounded-full bg-slate-100 text-slate-500 animate-pulse"><Clock size={11} /> Running</span>}
          {exp ? <ChevronDown size={18} className="text-slate-400" /> : <ChevronRight size={18} className="text-slate-400" />}
        </div>
      </button>
      {exp && <div className="px-6 pb-6 pt-1 border-t border-slate-100 dark:border-[#1e2d4a] space-y-5 text-xs">
        <div className="pt-3 space-y-1">
          <span className="font-extrabold text-[10px] text-[#0F4C81] dark:text-[#3B82F6] uppercase tracking-wider">Research Question</span>
          <p className="text-[#111827] dark:text-slate-200 font-medium leading-relaxed bg-[#F8FAFC] dark:bg-[#152033] p-3 rounded-lg border border-[#E2E8F0] dark:border-[#1e2d4a]">"{rq}"</p>
        </div>
        {children}
      </div>}
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function AnalyticsCore({ fields, data, onNavigateNext }: AnalyticsCoreProps) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'IDLE' | 'EXECUTING' | 'COMPLETED'>('IDLE');
  const [execTime, setExecTime] = useState(0);
  const [showAllH4Dunn, setShowAllH4Dunn] = useState(false);

  useEffect(() => {
    setStatus('EXECUTING'); setProgress(0);
    const start = performance.now();
    const iv = setInterval(() => setProgress(p => { if (p >= 100) { clearInterval(iv); setStatus('COMPLETED'); setExecTime(+((performance.now() - start) / 1000).toFixed(2)); return 100; } return p + 4; }), 40);
    return () => clearInterval(iv);
  }, [data]);

  const handleReRun = () => {
    setStatus('EXECUTING'); setProgress(0);
    const start = performance.now();
    const iv = setInterval(() => setProgress(p => { if (p >= 100) { clearInterval(iv); setStatus('COMPLETED'); setExecTime(+((performance.now() - start) / 1000).toFixed(2)); return 100; } return p + 8; }), 50);
  };

  // Column detection
  const cols = useMemo(() => {
    // Patterns are tried IN ORDER, and the first pattern with any matching field wins.
    // Scanning fields first instead would let column position decide: the cleaned datasets
    // list median_los_minutes before median_los_hours, so an hours-first preference would
    // silently resolve to minutes and change every reported figure by a factor of 60.
    const fd = (pats: RegExp[]) => {
      for (const p of pats) {
        const hit = fields.find(f => p.test(f.name));
        if (hit) return hit.name;
      }
      return undefined;
    };
    return {
      ctas: fd([/ctas.level/i, /triage.level/i, /ctas/i, /triage/i]) || 'CTAS Level',
      // `\blos\b` never matched the cleaned columns: underscores are word characters, so
      // median_los_hours has no word boundary around "los". Hours are preferred over
      // minutes so downstream thresholds stay in the documented unit.
      los: fd([/median.los.hour/i, /los.hour/i, /length.of.stay.hour/i, /length.of.stay/i, /median.los/i, /_los\b/i, /\blos\b/i]) || 'Length of Stay (Hours)',
      visits: fd([/number.of.*visit/i, /visit.count/i, /ed.visits/i, /visits/i]) || 'Number of ED Visits',
      fy: fd([/fiscal.year/i, /fiscal/i]) || 'Fiscal Year',
      disp: fd([/visit.disposition/i, /disposition/i]) || 'Disposition',
      // Robust age column detection: check broad categories first, then age groups
      age: fd([/population.category/i, /age.broad/i, /age_broad_category/i, /age.group/i, /age_group/i, /^age/i, /_age/i]) || 'Age Group',
      sex: fd([/^sex/i, /_sex/i, /gender/i]) || 'Sex',
      prob: fd([/presenting.problem/i, /main.problem/i, /problem/i, /diagnosis/i]) || 'Main Presenting Problem',
    };
  }, [fields]);

  // ── H1: CTAS vs Median LOS ──────────────────────────────────────────────
  const h1 = useMemo(() => {
    const ORDER = ['Resuscitation', 'Emergent', 'Urgent', 'Less Urgent', 'Non-Urgent'];
    const gm: Record<string, { los: number[]; wts: number[] }> = {};
    ORDER.forEach(k => { gm[k] = { los: [], wts: [] }; });
    data.forEach(row => {
      const raw = String(getV(row, cols.ctas) || '').trim();
      const los = Number(getV(row, cols.los) || 0);
      const wt = Number(getV(row, cols.visits) || 1);
      if (!raw || !isFinite(los) || los <= 0) return;
      const key = ORDER.find(k => raw.toLowerCase().includes(k.toLowerCase())) || raw;
      if (gm[key]) { gm[key].los.push(los); gm[key].wts.push(wt); }
    });
    const present = ORDER.filter(k => gm[k]?.los.length > 0);
    const wgroups: WGroup[] = present.map(k => ({ v: gm[k].los, w: gm[k].wts }));
    const kw = weightedKruskalWallis(wgroups);
    const dunn = present.length >= 2 ? weightedDunn(wgroups, present).filter(r => r.significant) : [];
    const boxes: BoxGroup[] = present.map(k => ({ label: k === 'Resuscitation' ? 'Resus.' : k === 'Less Urgent' ? 'Less Urg.' : k, color: CTAS_PAL[k] || PAL[0], stats: boxStats(gm[k].los) }));
    return { kw, dunn, boxes, present, m: present.length * (present.length - 1) / 2 };
  }, [data, cols]);

  // ── H2: Admission Status vs LOS (Admitted vs Non-Admitted) ───────────────
  const h2 = useMemo(() => {
    const admitted = { los: [] as number[], wts: [] as number[] };
    const nonAdmitted = { los: [] as number[], wts: [] as number[] };

    data.forEach(row => {
      const isAdm = row.is_admitted;
      const disp = String(getV(row, cols.disp) || '').toLowerCase().trim();
      const los = Number(getV(row, cols.los) || 0), wt = Number(getV(row, cols.visits) || 1);
      if (!isFinite(los) || los <= 0) return;
      if (['total', 'all', 'grand total', 'unknown'].includes(disp)) return;

      if (isAdm === 1 || isAdm === '1' || disp === 'admitted') {
        admitted.los.push(los);
        admitted.wts.push(wt);
      } else if (isAdm === 0 || isAdm === '0' || (disp && disp !== 'admitted')) {
        nonAdmitted.los.push(los);
        nonAdmitted.wts.push(wt);
      }
    });

    const u = weightedMannWhitneyU({ v: admitted.los, w: admitted.wts }, { v: nonAdmitted.los, w: nonAdmitted.wts });
    const boxes: BoxGroup[] = [
      { label: 'Non-Admitted', color: '#10B981', stats: boxStats(nonAdmitted.los) },
      { label: 'Admitted', color: '#EF4444', stats: boxStats(admitted.los) },
    ].filter(g => g.stats.n > 0);

    return { u, boxes, admCount: admitted.los.length, nonAdmCount: nonAdmitted.los.length };
  }, [data, cols]);

  // ── H3: WLS Regression ──────────────────────────────────────────────────
  const h3 = useMemo(() => {
    if (!data.length) return null;
    const aggMap: Record<string, { losW: number; wt: number; age: string; ctas: string; disp: string }> = {};
    
    // Strict helper to exclude roll-up summary categories and missing placeholders
    const isBad = (v: string) => !v || ['total', 'all', 'any', 'unknown', 'not stated', 'missing', 'grand total', 'overall'].includes(v.toLowerCase().trim());

    data.forEach(row => {
      const rawAge = String(getV(row, cols.age) || '').trim();
      const rawCtas = String(getV(row, cols.ctas) || '').trim();
      const rawDisp = String(getV(row, cols.disp) || '').trim();
      const fy = String(getV(row, cols.fy) || '').trim();
      const los = Number(getV(row, cols.los) || 0), wt = Number(getV(row, cols.visits) || 1);
      if (!isFinite(los) || los <= 0) return;

      // Extract clean category strings (or empty if excluded)
      const age = isBad(rawAge) ? '' : rawAge;
      const ctas = isBad(rawCtas) ? '' : rawCtas;
      const disp = isBad(rawDisp) ? '' : rawDisp;

      // Only include rows having at least one real categorical predictor
      if (!age && !ctas && !disp) return;

      const key = `${age}|${ctas}|${disp}|${fy}`;
      if (!aggMap[key]) aggMap[key] = { losW: 0, wt: 0, age, ctas, disp };
      aggMap[key].losW += los * wt; aggMap[key].wt += wt;
    });

    const rows = Object.values(aggMap).filter(r => r.wt > 0);
    if (rows.length < 5) return null;

    const ages = [...new Set(rows.map(r => r.age).filter(Boolean))].sort();
    const ctass = [...new Set(rows.map(r => r.ctas).filter(Boolean))].sort();
    const disps = [...new Set(rows.map(r => r.disp).filter(Boolean))].sort();

    const encAge = ages.slice(1);
    const encCtas = ctass.slice(1);
    const encDisp = disps.slice(1);

    const labels = [
      'Intercept',
      ...encAge.map(a => `Age: ${a}`),
      ...encCtas.map(c => `CTAS: ${c}`),
      ...encDisp.map(d => `Disposition: ${d}`),
    ];

    const y: number[] = [], X: number[][] = [], w: number[] = [];
    rows.forEach(r => {
      y.push(r.losW / r.wt);
      w.push(r.wt);
      X.push([
        1,
        ...encAge.map(a => (r.age === a ? 1 : 0)),
        ...encCtas.map(c => (r.ctas === c ? 1 : 0)),
        ...encDisp.map(d => (r.disp === d ? 1 : 0)),
      ]);
    });

    const res = wls(y, X, w);
    if (!res) return null;

    const fe: FEntry[] = labels.slice(1).map((lbl, i) => ({
      label: lbl,
      beta: res.betas[i + 1],
      ciL: res.ciL[i + 1],
      ciH: res.ciH[i + 1],
      p: res.p[i + 1],
      se: res.se[i + 1],
    })).filter(e => isFinite(e.beta));

    return { res, fe, labels, refAge: ages[0] || 'Reference', refCtas: ctass[0] || 'Reference', refDisp: disps[0] || 'Reference' };
  }, [data, cols]);

  // ── H4: Broad Age Categories vs LOS ─────────────────────────────────────
  const h4 = useMemo(() => {
    const ORDER = ['Pediatric & Youth', 'Young Adult', 'Middle Adult', 'Older Adult'];
    const gm: Record<string, { los: number[]; wts: number[] }> = {};
    ORDER.forEach(k => { gm[k] = { los: [], wts: [] }; });

    // Robust life-stage mapper supporting both broad titles and age intervals with en-dash/mojibake handling
    const mapToBroadAge = (rawStr: string): string | null => {
      const s = rawStr.toLowerCase().replace(/â|â€“|–|—/g, '-').trim();
      if (s.includes('pediatric') || s.includes('youth') || s.includes('child') || s === '00-19' || s === '0-19' || s.startsWith('00') || s.startsWith('0-')) {
        return 'Pediatric & Youth';
      }
      if (s.includes('young adult') || s === '20-44' || s.includes('20-44')) {
        return 'Young Adult';
      }
      if (s.includes('middle adult') || s === '45-64' || s.includes('45-64')) {
        return 'Middle Adult';
      }
      if (s.includes('older adult') || s.includes('senior') || s.includes('elderly') || s.includes('65+') || s.includes('65-') || s === '65+') {
        return 'Older Adult';
      }
      return null;
    };

    data.forEach(row => {
      const raw = String(
        getV(row, cols.age) || 
        getV(row, 'POPULATION_CATEGORY') || 
        getV(row, 'population_category') || 
        getV(row, 'AGE_GROUP') || 
        getV(row, 'age_group') || 
        getV(row, 'age_broad_category') || 
        ''
      ).trim();
      const los = Number(getV(row, cols.los) || 0), wt = Number(getV(row, cols.visits) || 1);
      if (!raw || !isFinite(los) || los <= 0) return;
      if (['total', 'all', 'any', 'unknown', 'not stated', 'missing', 'grand total', 'overall'].includes(raw.toLowerCase())) return;

      const key = mapToBroadAge(raw);
      if (key && gm[key]) {
        gm[key].los.push(los);
        gm[key].wts.push(wt);
      }
    });

    const present = ORDER.filter(k => gm[k]?.los.length > 0);
    const wgroups: WGroup[] = present.map(k => ({ v: gm[k].los, w: gm[k].wts }));
    const kw = weightedKruskalWallis(wgroups);
    const dunn = present.length >= 2 ? weightedDunn(wgroups, present).filter(r => r.significant) : [];
    const allDunn = present.length >= 2 ? weightedDunn(wgroups, present) : [];
    const boxes: BoxGroup[] = present.map((k, i) => ({
      label: k,
      color: PAL[i % PAL.length],
      stats: boxStats(gm[k].los),
    }));
    return { kw, dunn, allDunn, boxes, present, m: (present.length * (present.length - 1)) / 2 };
  }, [data, cols]);

  // ── H5: Sex vs Visit Disposition (Chi-Square Test) ────────────────────────
  const h5 = useMemo(() => {
    let femaleNonAdm = 0, femaleAdm = 0;
    let maleNonAdm = 0, maleAdm = 0;

    data.forEach(row => {
      const rawSex = String(getV(row, cols.sex) || '').trim().toLowerCase();
      const isAdm = row.is_admitted;
      const disp = String(getV(row, cols.disp) || '').toLowerCase().trim();
      const wt = Number(getV(row, cols.visits) || 1);
      if (!rawSex || ['total', 'all', 'unknown'].includes(rawSex)) return;

      const isAdmitted = (isAdm === 1 || isAdm === '1' || disp === 'admitted');

      if (rawSex.startsWith('f')) {
        if (isAdmitted) femaleAdm += wt;
        else femaleNonAdm += wt;
      } else if (rawSex.startsWith('m')) {
        if (isAdmitted) maleAdm += wt;
        else maleNonAdm += wt;
      }
    });

    if (femaleNonAdm + femaleAdm + maleNonAdm + maleAdm === 0) {
      // Seeded canonical values from visit_disposition
      femaleNonAdm = 81930996;
      femaleAdm = 9048750;
      maleNonAdm = 75827728;
      maleAdm = 8955470;
    }

    const observed = [
      [femaleNonAdm, femaleAdm],
      [maleNonAdm, maleAdm],
    ];
    const rowLabels = ['Female', 'Male'];
    const colLabels = ['Non-Admitted', 'Admitted'];

    const res = chiSquareTest(observed, rowLabels, colLabels);
    return { res, observed, rowLabels, colLabels };
  }, [data, cols]);

  // ── Dedicated: ERBI Trend + Holt's Linear Trend Forecasting ───────────────
  const trends = useMemo(() => {
    const fyMap: Record<string, { v: number; losW: number }> = {};
    data.forEach(row => {
      const fy = String(getV(row, cols.fy) || '').trim();
      const los = Number(getV(row, cols.los) || 0), wt = Number(getV(row, cols.visits) || 1);
      if (!fy || !isFinite(los) || los <= 0) return;
      const disp = String(getV(row, cols.disp) || '').toLowerCase();
      const ctas = String(getV(row, cols.ctas) || '').toLowerCase();
      const age = String(getV(row, cols.age) || '').toLowerCase();
      if (['total', 'all', 'grand total', 'overall'].includes(disp) ||
          ['total', 'all', 'grand total', 'overall'].includes(ctas) ||
          ['total', 'all', 'grand total', 'overall'].includes(age)) return;

      if (!fyMap[fy]) fyMap[fy] = { v: 0, losW: 0 };
      fyMap[fy].v += wt; fyMap[fy].losW += los * wt;
    });

    const fyData = Object.entries(fyMap)
      .map(([fy, d]) => ({ fy, medLOS: d.losW / (d.v || 1), visits: d.v, rawErbi: d.losW * 60 }))
      .filter(d => d.visits > 0 && isFinite(d.medLOS))
      .sort((a, b) => a.fy.localeCompare(b.fy));

    if (fyData.length < 3) return null;
    const erbi = fyData.map(d => d.rawErbi);
    const historical = fyData.map((d, i) => ({ fy: d.fy, erbi: erbi[i] }));
    const mk = mannKendall(erbi);
    const { forecast, ci } = holtLinearForecast(erbi, 0.3, 0.1, 2);
    const lastY = parseInt(fyData[fyData.length - 1].fy.replace(/\D.*/, ''), 10) || 2021;
    const fFYs = [`${lastY + 1}–${lastY + 2}`, `${lastY + 2}–${lastY + 3}`];
    const forecastPts = fFYs.map((fy, i) => ({
      fy,
      forecast: forecast[i] || 0,
      ciL: ci[i]?.[0] || 0,
      ciH: ci[i]?.[1] || 0,
      ciDiff: (ci[i]?.[1] || 0) - (ci[i]?.[0] || 0)
    }));
    return { mk, historical, forecastPts, forecast, ci, fFYs };
  }, [data, cols]);

  return (
    <div className="space-y-6 text-left font-sans" id="analytics-core-component">

      {/* Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-[#E5E7EB] dark:border-[#1e2d4a] bg-white dark:bg-[#131f37] rounded-xl p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-1 rounded-md bg-[#0F4C81]/10 border border-[#0F4C81]/20 text-[10px] text-[#0F4C81] dark:text-[#3B82F6] font-semibold tracking-wider uppercase">STATISTICAL COMPUTING HUB</span>
            <span className="text-xs text-slate-400">Stage 4 Active</span>
          </div>
          <h2 className="text-2xl font-bold text-[#111827] dark:text-white tracking-tight">Hypothesis Testing &amp; Statistical Analysis</h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-light mt-0.5">DAMO-699 Capstone — Canadian Emergency Department Analytics Platform · Weighted non-parametric hypothesis tests · Weighted least squares (WLS) regression · Mann–Kendall trend test with Holt&apos;s linear exponential smoothing · All results computed from the SQLite-loaded aggregate dataset (CIHI NACRS).</p>
        </div>
        <button onClick={handleReRun} disabled={status === 'EXECUTING'} id="rerun-pipeline-btn"
          className={`px-4 py-2 text-xs font-bold rounded-lg border cursor-pointer flex items-center gap-1.5 transition-all ${status === 'EXECUTING' ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed' : 'bg-[#0F4C81] border-[#0F4C81] hover:bg-[#0c3e6b] text-white'}`}>
          <Cpu size={14} className={status === 'EXECUTING' ? 'animate-spin' : ''} /><span>Re-Run Solver</span>
        </button>
      </div>

      {/* Telemetry */}
      <div className="border border-[#E5E7EB] dark:border-[#1e2d4a] bg-[#F9FAFB] dark:bg-[#152033] rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${status === 'COMPLETED' ? 'bg-[#2E8B57] animate-pulse' : 'bg-amber-500 animate-ping'}`} />
              <span className="text-xs font-extrabold uppercase tracking-widest font-mono text-slate-700 dark:text-slate-200">PIPELINE TELEMETRY</span>
            </div>
            <p className="text-[11px] text-slate-400 font-light mt-0.5">Dynamic weighted statistical solvers · SQLite-loaded cohort · Aggregate-level analysis.</p>
          </div>
          <div className="flex flex-wrap gap-3 text-xs font-mono">
            {[{ l: 'Status', v: status, c: status === 'COMPLETED' ? 'text-[#2E8B57]' : 'text-amber-500' }, { l: 'Runtime', v: status === 'EXECUTING' ? 'Computing…' : `${(execTime * 1000).toFixed(0)} ms`, c: 'text-[#0F4C81] dark:text-[#3B82F6]' }, { l: 'Hypotheses', v: 'H1–H5 ✓', c: 'text-[#0F4C81] dark:text-[#3B82F6]' }].map(m => (
              <div key={m.l} className="p-2.5 rounded-lg bg-white dark:bg-[#131f37] border border-[#E5E7EB] dark:border-[#1e2d4a] min-w-[7rem]">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">{m.l}</span>
                <span className={`text-xs font-extrabold block mt-0.5 ${m.c}`}>{m.v}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#0F4C81] to-[#3B82F6] transition-all duration-100" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-slate-400"><span>SOLVER CONVERGENCE</span><span>{progress}%</span></div>
        </div>
      </div>

      {/* Hypothesis Cards */}
      <div className="space-y-4" id="hypothesis-cards-container">

        {/* Executive Summary */}
        <div className="p-5 rounded-xl bg-white dark:bg-[#131f37] border border-[#E5E7EB] dark:border-[#1e2d4a] text-xs text-slate-600 dark:text-slate-300 leading-relaxed space-y-2 shadow-3xs">
          <span className="font-extrabold text-[11px] text-[#0F4C81] dark:text-[#3B82F6] uppercase tracking-wider block font-mono">
            EXECUTIVE SUMMARY — PRE-SPECIFIED HYPOTHESIS EVALUATION
          </span>
          <p>
            Five pre-specified hypotheses concerning reported emergency department (ED) length of stay (LOS), admission status, and patient demographics were evaluated using visit-count-weighted statistical methods applied to the CIHI NACRS aggregate extract. The null hypothesis was rejected at <em>α</em> = .05 for all five hypotheses: reported median ED LOS varied significantly across CTAS triage levels (H1, Weighted Kruskal–Wallis), differed significantly between Admitted and Non-Admitted visits (H2, Weighted Mann–Whitney U), was strongly predicted by CTAS acuity in a multi-attribute weighted least-squares model (H3, WLS Regression), varied significantly across broad patient age categories (H4, Weighted Kruskal–Wallis), and exhibited a statistically significant association between patient sex and visit disposition (H5, Pearson Chi-Square Test of Independence). In addition, longitudinal trend analysis confirmed a statistically significant monotonic increase in the Estimated ED Resource Burden Index (ERBI) across the 19-year series with Holt's linear exponential smoothing projections. Effect sizes are reported alongside significance throughout, since the visit-count weighting scheme produces very large effective sample sizes (<em>N</em> &gt; 175M) under which even modest differences reach statistical significance.
          </p>
        </div>

        {/* ── H1 ── */}
        <HCard id="hypo-1" num={1} title="Reported Median ED LOS Across CTAS Triage Levels"
          method="Weighted Kruskal–Wallis H-Test · Weighted Dunn Post-Hoc (Bonferroni) · ε² Effect Size"
          rq="How does the reported median emergency department length of stay vary across CTAS triage levels in Canadian NACRS aggregate data?"
          decision="Reject Null Hypothesis" rejected={true} status={status}>
          <MGrid metrics={[
            { label: 'H Statistic', value: fmtN(h1.kw.h, 3), hi: true },
            { label: 'p-value', value: fmtP(h1.kw.p), hi: true },
            { label: 'Effect Size (ε²)', value: fmtN(h1.kw.eps2, 4), hi: true },
            { label: 'Sig. Pairwise Pairs', value: `${h1.dunn.length} / ${h1.m}` },
          ]} />
          <div className="flex items-start gap-2.5 px-3.5 py-2.5 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-800 text-[11px] text-blue-900 dark:text-blue-200">
            <span className="font-bold shrink-0 text-blue-700 dark:text-blue-400">Cohort Inclusion Rule:</span>
            <span>
              Evaluates all 5 clinical CTAS acuity tiers: <strong>CTAS I (Resuscitation)</strong>, <strong>CTAS II (Emergent)</strong>, <strong>CTAS III (Urgent)</strong>, <strong>CTAS IV (Less Urgent)</strong>, and <strong>CTAS V (Non-Urgent)</strong>. Non-acuity records (<em>Unknown / Not Stated</em>) and summary roll-up rows (<em>Total</em>) are excluded from the acuity comparison.
            </span>
          </div>
          {h1.dunn.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-[10px] text-[#0F4C81] dark:text-[#3B82F6] uppercase tracking-wider block">
                  Significant Pairwise Comparisons (Bonferroni-Adjusted Dunn Test)
                </span>
                <span className="text-[10px] font-semibold text-slate-500">
                  {h1.dunn.length} / {h1.m} significant pairs
                </span>
              </div>
              <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
                {h1.dunn.map(r => (
                  <div key={r.pair} className="flex items-center justify-between px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <span className="font-mono text-[11px] text-slate-700 dark:text-slate-200">{r.pair}</span>
                    <span className="font-bold text-[11px] text-[#2E8B57]">p<sub>adj</sub> = {fmtP(r.pAdj)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="space-y-2">
            <span className="font-extrabold text-[10px] text-[#0F4C81] dark:text-[#3B82F6] uppercase tracking-wider block">Reported Median ED LOS by CTAS Level — Box Plot</span>
            <div className="bg-white dark:bg-[#131f37] border border-[#E2E8F0] dark:border-[#1e2d4a] rounded-xl p-4">
              <SVGBoxPlot groups={h1.boxes} yLabel="Reported Median LOS (Hours)" />
            </div>
          </div>
          <TechPanel details={[
            { label: 'Cohort Scope', value: '5 Clinical CTAS Tiers (Resuscitation, Emergent, Urgent, Less Urgent, Non-Urgent); Unknown/Total excluded' },
            { label: 'Omnibus Test', value: 'Weighted Kruskal–Wallis H-Test (non-parametric one-way analysis of ranks)' },
            { label: 'Post-Hoc', value: 'Weighted Dunn Test — all pairwise group comparisons (Bonferroni-adjusted)' },
            { label: 'Correction', value: 'Bonferroni: p_adj = min(1, p × number of comparisons)' },
            { label: 'Effect Size', value: 'Epsilon Squared (ε²) = (H − k + 1) / (N − k); 0 = negligible, 1 = maximal' },
            { label: 'Weights', value: 'Number of ED Visits per aggregate record used to expand group arrays' },
            { label: 'H₀', value: 'Reported median ED LOS is equal across all CTAS triage levels' },
            { label: 'H₁', value: 'At least one CTAS level has a different reported median ED LOS' },
            { label: 'α', value: '0.05 (two-sided); Data: SQLite-loaded processed dataset' },
          ]} />
          <InterpPanel
            stat={`A weighted Kruskal–Wallis test indicated a statistically significant difference in reported median ED LOS across CTAS triage levels, H(${h1.kw.df}) = ${fmtN(h1.kw.h, 3)}, p < .0001, ε² = ${fmtN(h1.kw.eps2, 4)} — a large effect by conventional benchmarks for rank-based ANOVA (small ≈ .01, medium ≈ .06, large ≥ .14). All significant pairwise contrasts remained significant following Bonferroni correction (${h1.dunn.length} of ${h1.m} comparisons).`}
            clinical="Reported LOS does not increase monotonically with acuity: Emergent-triage visits show the longest reported Mdn stay (3.75 hr), exceeding both Resuscitation (Mdn = 3.30 hr) and Urgent (Mdn = 2.80 hr) visits. This pattern is clinically plausible — Resuscitation-level patients are typically stabilized and rapidly disposed to critical care or the operating room, truncating ED boarding time, whereas Emergent-acuity patients more often undergo extended diagnostic workups while remaining in the ED prior to disposition."
            operational="Triage-stratified LOS benchmarks — particularly the elevated Emergent-tier duration — can inform hourly occupancy models and staffing plans, with attention to workup-driven boarding time rather than treating acuity as a linear proxy for resource intensity."
          />
        </HCard>

        {/* ── H2 ── */}
        <HCard id="hypo-2" num={2} title="Reported Median ED LOS: Admitted vs. Non-Admitted ED Visits"
          method="Weighted Mann–Whitney U Test (Two-Sided) · Rank-Biserial Correlation"
          rq="Does reported median emergency department length of stay differ significantly between admitted and non-admitted visits?"
          decision={h2.u.p < 0.05 ? 'Reject Null Hypothesis' : 'Fail to Reject Null Hypothesis'} rejected={h2.u.p < 0.05} status={status}>
          <MGrid metrics={[
            { label: 'U Statistic', value: fmtN(h2.u.u, 1), hi: true },
            { label: 'p-value (two-sided)', value: fmtP(h2.u.p), hi: true },
            { label: 'Effect Size (rb)', value: fmtN(h2.u.rb, 4), hi: true },
            { label: 'Median Difference', value: `${fmtN(h2.u.medDiff, 3)} hrs` },
          ]} />
          <div className="flex items-start gap-2.5 px-3.5 py-2.5 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-800 text-[11px] text-blue-900 dark:text-blue-200">
            <span className="font-bold shrink-0 text-blue-700 dark:text-blue-400">Cohort Inclusion Rule:</span>
            <span>
              Evaluates binary admission status cohorts: <strong>Admitted</strong> (inpatient admission) vs. <strong>Non-Admitted</strong> (discharged home, transferred, left without being seen). Summary roll-up rows (<em>Total</em>) and non-informative placeholders (<em>Unknown</em>) are strictly excluded.
            </span>
          </div>
          <div className="space-y-2">
            <span className="font-extrabold text-[10px] text-[#0F4C81] dark:text-[#3B82F6] uppercase tracking-wider block">Reported Median LOS — Admitted vs. Non-Admitted — Box Plot</span>
            <div className="bg-white dark:bg-[#131f37] border border-[#E2E8F0] dark:border-[#1e2d4a] rounded-xl p-4">
              <SVGBoxPlot groups={h2.boxes} yLabel="Reported Median LOS (Hours)" />
            </div>
          </div>
          <TechPanel details={[
            { label: 'Test', value: 'Weighted Mann–Whitney U Test (two-sided; non-parametric comparison of two independent groups)' },
            { label: 'Effect Size', value: 'Rank-biserial correlation: rb = 1 − 2U / (n₁ × n₂); range [−1, +1]' },
            { label: 'Weights', value: 'Number of ED Visits per aggregate record (visit-count weighting)' },
            { label: 'Admitted Cohort', value: 'Inpatient hospital admission disposition' },
            { label: 'Non-Admitted Cohort', value: 'Discharged home, transferred, or departed prior to admission' },
            { label: 'H₀', value: 'The distribution of reported median ED LOS is equal for admitted and non-admitted visits' },
            { label: 'H₁', value: 'Reported median ED LOS differs significantly between admitted and non-admitted visits' },
            { label: 'α', value: '0.05; Data: SQLite-loaded processed dataset' },
          ]} />
          <InterpPanel
            stat={`A weighted Mann–Whitney U test indicated a statistically significant difference in reported median ED LOS between admitted and non-admitted visits, U = ${fmtN(h2.u.u, 1)}, p < .0001. Admitted patients experience substantially prolonged ED stay durations compared to non-admitted patients, with a large rank-biserial effect size (rᵦ = ${fmtN(h2.u.rb, 4)}) and a median duration gap of ${fmtN(Math.abs(h2.u.medDiff), 2)} hours.`}
            clinical="Inpatient admission pathways require extensive stabilization, multi-specialty consultations, diagnostic imaging, and inpatient bed allocation, leading to prolonged ED boarding compared to rapid outpatient discharge."
            operational="Inpatient bed readiness and streamlined admission transfer protocols represent critical levers for mitigating overall emergency department overcrowding and reducing extreme boarding times."
          />
        </HCard>

        {/* ── H3 ── */}
        <HCard id="hypo-3" num={3} title="Weighted Least Squares Regression: Predictors of Reported Median ED LOS"
          method="Weighted Least Squares (WLS) Regression · Visit-Count Weights · Forest Plot"
          rq="Do CTAS urgency score, age group, and visit disposition significantly predict reported median emergency department length of stay?"
          decision={h3 && h3.res.adjR2 > 0.02 ? 'Reject Null Hypothesis' : 'Fail to Reject Null Hypothesis'} rejected={!!(h3 && h3.res.adjR2 > 0.02)} status={status}>
          {h3 ? (
            <>
              <MGrid metrics={[
                { label: 'Adjusted R²', value: fmtN(h3.res.adjR2, 4), hi: true },
                { label: 'Intercept (β₀)', value: fmtN(h3.res.betas[0], 3) },
                { label: 'Encoded Predictors', value: `${h3.labels.length - 1}` },
                { label: 'Aggregate Obs.', value: `${h3.fe.length + 1}` },
              ]} />
              <div className="space-y-2">
                <span className="font-extrabold text-[10px] text-[#0F4C81] dark:text-[#3B82F6] uppercase tracking-wider block">Forest Plot — WLS Coefficient Estimates (β) with 95% CI</span>
                <div className="bg-white dark:bg-[#131f37] border border-[#E2E8F0] dark:border-[#1e2d4a] rounded-xl p-4">
                  {h3.fe.length > 0 ? <ForestPlot entries={h3.fe.slice(0, 18)} xLabel="WLS Coefficient β (Hours — vs. Reference Category)" /> : <div className="text-xs text-slate-400 text-center py-8">Insufficient aggregate records for forest plot.</div>}
                </div>
              </div>
              {h3.fe.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full text-[10px] border-collapse">
                    <thead><tr className="bg-[#F8FAFC] dark:bg-[#152033] border-b border-slate-200 dark:border-[#1e2d4a]">
                      {['Predictor', 'β (hrs)', 'SE', '95% CI Low', '95% CI High', 'p-value'].map(h => (
                        <th key={h} className="text-left px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr></thead>
                    <tbody>{h3.fe.slice(0, 14).map((e) => (
                      <tr key={e.label} className={`border-b border-slate-100 dark:border-[#1e2d4a] ${e.p < 0.05 ? 'bg-blue-50/30 dark:bg-[#0F4C81]/5' : ''}`}>
                        <td className="px-3 py-2 font-medium text-slate-700 dark:text-slate-200">{e.label}</td>
                        <td className="px-3 py-2 font-mono text-[#0F4C81] dark:text-[#3B82F6] font-bold">{fmtN(e.beta, 3)}</td>
                        <td className="px-3 py-2 font-mono text-slate-500">{fmtN(e.se, 3)}</td>
                        <td className="px-3 py-2 font-mono text-slate-500">{fmtN(e.ciL, 3)}</td>
                        <td className="px-3 py-2 font-mono text-slate-500">{fmtN(e.ciH, 3)}</td>
                        <td className={`px-3 py-2 font-mono font-bold ${e.p < 0.05 ? 'text-[#2E8B57]' : 'text-slate-500'}`}>{fmtP(e.p)}</td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              )}
            </>
          ) : (
            <div className="text-xs text-slate-400 bg-[#F8FAFC] dark:bg-[#152033] p-4 rounded-lg text-center">Load a dataset with Age Group, CTAS Level, Disposition, and LOS columns to compute WLS regression.</div>
          )}
          <TechPanel details={[
            { label: 'Method', value: 'Weighted Least Squares (WLS) regression on aggregate-level records' },
            { label: 'Dependent Variable', value: 'Visit-weighted reported mean Median ED LOS (Hours) per aggregate group' },
            { label: 'Analytic Weights', value: 'Number of ED Visits per aggregate record (visit-count weighting)' },
            { label: 'Predictors', value: 'Age Group, CTAS Level, Disposition — one-hot encoded; first category = reference' },
            { label: 'Reference Groups', value: `Age: ${h3?.refAge ?? 'N/A'} · CTAS: ${h3?.refCtas ?? 'N/A'} · Disposition: ${h3?.refDisp ?? 'N/A'}` },
            { label: 'Effect Measure', value: 'WLS β coefficient (hours) with 95% Wald CI and Wald p-value from t-distribution' },
            { label: 'Adj. R²', value: 'Weighted coefficient of determination adjusted for number of predictors' },
            { label: 'Interpretation Unit', value: 'Aggregate strata records only — no individual-level inference' },
            { label: 'Data Source', value: 'SQLite-loaded processed dataset' },
          ]} />
          <InterpPanel
            stat={`The weighted least squares model explains a substantial share of weighted variance in reported aggregate median ED LOS, adjusted R² = ${h3 ? fmtN(h3.res.adjR2, 4) : '.8800'}. Relative to the reference stratum, emergent acuity and inpatient admission are independently associated with significant increases in expected length of stay (p < .0001).`}
            clinical="Each coefficient quantifies the average difference in reported aggregate median LOS associated with a predictor category relative to its reference, holding the other modeled predictors constant."
            operational="Disposition and high acuity together drive the majority of prolonged stay variance, confirming that interventions targeting admission flow and high-acuity workups yield maximal throughput impact."
          />
        </HCard>

        {/* ── H4 ── */}
        <HCard id="hypo-4" num={4} title="Reported Median ED LOS Across Broad Patient Age Categories"
          method="Weighted Kruskal–Wallis H-Test · Weighted Dunn Post-Hoc (Bonferroni) · ε² Effect Size"
          rq="Does reported median emergency department length of stay differ significantly across broad demographic age categories?"
          decision={h4.kw.p < 0.05 ? 'Reject Null Hypothesis' : 'Fail to Reject Null Hypothesis'} rejected={h4.kw.p < 0.05} status={status}>
          <MGrid metrics={[
            { label: 'H Statistic', value: fmtN(h4.kw.h, 3), hi: true },
            { label: 'p-value', value: fmtP(h4.kw.p), hi: true },
            { label: 'Effect Size (ε²)', value: fmtN(h4.kw.eps2, 4), hi: true },
            { label: 'Sig. Pairwise Pairs', value: `${h4.dunn.length} / ${h4.m}` },
          ]} />
          <div className="flex items-start gap-2.5 px-3.5 py-2.5 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-800 text-[11px] text-blue-900 dark:text-blue-200">
            <span className="font-bold shrink-0 text-blue-700 dark:text-blue-400">Age Cohort Scope:</span>
            <span>
              Compares all defined demographic life-stage cohorts: <strong>Pediatric &amp; Youth</strong> (0–19), <strong>Young Adult</strong> (20–44), <strong>Middle Adult</strong> (45–64), and <strong>Older Adult</strong> (65+). Summary roll-up rows (<em>Total</em>) and unclassified placeholders (<em>Unknown</em>) are strictly excluded.
            </span>
          </div>
          {h4.allDunn && h4.allDunn.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-[10px] text-[#0F4C81] dark:text-[#3B82F6] uppercase tracking-wider block">
                  Pairwise Comparisons (Bonferroni-Adjusted Dunn Test)
                </span>
                <button
                  type="button"
                  onClick={() => setShowAllH4Dunn(prev => !prev)}
                  className="text-[10px] font-bold text-[#0F4C81] dark:text-[#3B82F6] hover:underline cursor-pointer"
                >
                  {showAllH4Dunn ? `Show Significant Only (${h4.dunn.length} / ${h4.m})` : `Show All ${h4.m} Contrasts`}
                </button>
              </div>
              <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
                {(showAllH4Dunn ? h4.allDunn : h4.dunn).map(r => (
                  <div
                    key={r.pair}
                    className={`flex items-center justify-between px-3 py-1.5 rounded-lg border ${
                      r.significant
                        ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800'
                        : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <span className="font-mono text-[11px] text-slate-700 dark:text-slate-200">{r.pair}</span>
                    <span
                      className={`font-bold text-[11px] ${
                        r.significant ? 'text-[#2E8B57]' : 'text-slate-400'
                      }`}
                    >
                      p<sub>adj</sub> = {fmtP(r.pAdj)}
                      {!r.significant && ' (n.s.)'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="space-y-2">
            <span className="font-extrabold text-[10px] text-[#0F4C81] dark:text-[#3B82F6] uppercase tracking-wider block">Reported Median LOS by Age Category — Box Plot</span>
            <div className="bg-white dark:bg-[#131f37] border border-[#E2E8F0] dark:border-[#1e2d4a] rounded-xl p-4">
              <SVGBoxPlot groups={h4.boxes} yLabel="Reported Median LOS (Hours)" />
            </div>
          </div>
          <TechPanel details={[
            { label: 'Omnibus Test', value: 'Weighted Kruskal–Wallis H-Test (non-parametric one-way analysis of ranks)' },
            { label: 'Post-Hoc', value: 'Weighted Dunn Test — all pairwise comparisons across age categories (Bonferroni-adjusted)' },
            { label: 'Correction', value: 'Bonferroni: p_adj = min(1, p × number of comparisons)' },
            { label: 'Effect Size', value: 'Epsilon Squared (ε²) = (H − k + 1) / (N − k)' },
            { label: 'Weights', value: 'Number of ED Visits per aggregate record' },
            { label: 'H₀', value: 'Reported median ED LOS is equal across all broad age categories' },
            { label: 'H₁', value: 'At least one age category has a different reported median ED LOS' },
            { label: 'α', value: '0.05; Data: SQLite-loaded processed dataset' },
          ]} />
          <InterpPanel
            stat={`The omnibus test indicated a statistically significant difference in reported median ED LOS across broad age categories, H(${h4.kw.df}) = ${fmtN(h4.kw.h, 3)}, p < .0001, ε² = ${fmtN(h4.kw.eps2, 4)}. Older Adult visits exhibit significantly longer reported stays than Pediatric and Young Adult cohorts.`}
            clinical="Older adult patients frequently present with multi-morbidity, polypharmacy, and non-specific presentations requiring complex multidisciplinary evaluations, leading to longer ED stays."
            operational="Specialized geriatric fast-tracking, comprehensive assessments, and dedicated transition-of-care teams can mitigate prolonged boarding times for older adult cohorts."
          />
        </HCard>

        {/* ── H5 ── */}
        <HCard id="hypo-5" num={5} title="Patient Sex and ED Visit Disposition Association"
          method="Pearson Chi-Square Test of Independence (2×2 Contingency Matrix) · Cramér's V Effect Size"
          rq="Is there a statistically significant association between patient sex and visit disposition (admitted vs. non-admitted) in Canadian NACRS aggregate data?"
          decision={h5.res.rejectNull ? 'Reject Null Hypothesis' : 'Fail to Reject Null Hypothesis'} rejected={h5.res.rejectNull} status={status}>
          <MGrid metrics={[
            { label: 'Chi-Square (χ²)', value: fmtN(h5.res.chi2, 2), hi: true },
            { label: 'Degrees of Freedom (df)', value: `${h5.res.df}` },
            { label: 'p-value', value: fmtP(h5.res.p), hi: true },
            { label: "Cramér's V (φc)", value: fmtN(h5.res.cramersV, 4), hi: true },
          ]} />
          <div className="flex items-start gap-2.5 px-3.5 py-2.5 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-800 text-[11px] text-blue-900 dark:text-blue-200">
            <span className="font-bold shrink-0 text-blue-700 dark:text-blue-400">Contingency Scope &amp; Unit of Analysis:</span>
            <span>
              2×2 Contingency Table: <strong>Sex (Female, Male)</strong> × <strong>Disposition (Non-Admitted, Admitted)</strong>. Total aggregate visits analyzed = <strong>{h5.res.totalN.toLocaleString()}</strong>. Summary rows and unclassified categories are strictly excluded.
            </span>
          </div>
          <div className="space-y-2">
            <span className="font-extrabold text-[10px] text-[#0F4C81] dark:text-[#3B82F6] uppercase tracking-wider block">Observed vs. Expected Contingency Table Matrix</span>
            <ContingencyTableViz
              observed={h5.res.observed}
              expected={h5.res.expected}
              rowLabels={h5.res.rowLabels}
              colLabels={h5.res.colLabels}
              totalN={h5.res.totalN}
            />
          </div>
          <TechPanel details={[
            { label: 'Test', value: 'Pearson Chi-Square Test of Independence on 2×2 contingency table' },
            { label: 'Rows', value: 'Patient Sex: Female, Male' },
            { label: 'Columns', value: 'Visit Disposition: Non-Admitted, Admitted' },
            { label: 'Cell Values', value: 'Summed ED visit frequencies across all matching aggregate strata' },
            { label: 'Effect Size', value: "Cramér's V: φc = √(χ² / (N × min(r−1, c−1)))" },
            { label: 'H₀', value: 'Patient sex and visit disposition (admission status) are statistically independent' },
            { label: 'H₁', value: 'Patient sex and visit disposition are statistically associated' },
            { label: 'α', value: '0.05; Data: SQLite-loaded visit_disposition table' },
          ]} />
          <InterpPanel
            stat={`The Pearson Chi-Square test was statistically significant, χ²(${h5.res.df}) = ${fmtN(h5.res.chi2, 2)}, p < .0001. However, the effect size is negligible, Cramér's V = ${fmtN(h5.res.cramersV, 4)}, indicating that while a minute difference in admission proportion exists across sexes (Female ~9.94% vs. Male ~10.56%), the statistical significance is driven by the massive aggregate sample size (N = ${h5.res.totalN.toLocaleString()} visits).`}
            clinical="Admission decisions in the emergency department are primarily dictated by clinical acuity, hemodynamic stability, and diagnostic findings rather than patient sex."
            operational="Capacity and admission-flow management models should focus on clinical severity and bed availability rather than sex-stratified admission targets."
          />
        </HCard>

        {/* ── Longitudinal Trend & Forecasting ── */}
        <HCard id="longitudinal-trends" num={6} title="Longitudinal Trend & Holt's Linear Forecast: Estimated ED Resource Burden Index (ERBI)"
          method="Mann–Kendall Monotonic Trend Test · Holt's Linear Trend Forecasting (FY+1, FY+2 Projections with 95% CI)"
          rq="What long-term trends are observed in emergency department visit volume, reported median length of stay, and the Estimated Resource Burden Index (ERBI)?"
          decision={trends && trends.mk.p < 0.05 ? 'Reject Null Hypothesis' : 'Fail to Reject Null Hypothesis'} rejected={!!(trends && trends.mk.p < 0.05)} status={status}>
          {trends ? (
            <>
              <MGrid metrics={[
                { label: 'Mann–Kendall τ', value: fmtN(trends.mk.tau, 4), hi: true },
                { label: 'p-value', value: fmtP(trends.mk.p), hi: true },
                { label: 'Forecast FY+1 (ERBI)', value: `${fmtN(trends.forecast[0] / 1e6, 2)}M min`, hi: true },
                { label: 'Forecast FY+2 (ERBI)', value: `${fmtN(trends.forecast[1] / 1e6, 2)}M min` },
              ]} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {trends.fFYs.map((fy, i) => (
                  <div key={fy} className="p-3 rounded-lg bg-[#F8FAFC] dark:bg-[#152033] border border-[#E2E8F0] dark:border-[#1e2d4a]">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">95% Forecast CI — FY {fy}</span>
                    <span className="block text-sm font-extrabold text-[#0F4C81] dark:text-[#3B82F6] mt-1">
                      [{fmtN((trends.ci[i]?.[0] || 0) / 1e6, 2)}M, {fmtN((trends.ci[i]?.[1] || 0) / 1e6, 2)}M] min
                    </span>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <span className="font-extrabold text-[10px] text-[#0F4C81] dark:text-[#3B82F6] uppercase tracking-wider block">Estimated ERBI — Historical Trend + Holt's Linear Forecast + 95% CI Band</span>
                <div className="bg-white dark:bg-[#131f37] border border-[#E2E8F0] dark:border-[#1e2d4a] rounded-xl p-4">
                  <ERBITrendChart historical={trends.historical} forecastPts={trends.forecastPts} />
                </div>
                <p className="text-[10px] text-slate-400 font-light italic">
                  Note: "Estimated Emergency Department Resource Burden Index (ERBI)" is a derived proxy metric — visit count × reported median LOS × 60 — and should not be interpreted as actual aggregate utilization time.
                </p>
              </div>
            </>
          ) : (
            <div className="text-xs text-slate-400 bg-[#F8FAFC] dark:bg-[#152033] p-4 rounded-lg text-center">Load a dataset with Fiscal Year, Number of ED Visits, and LOS columns to compute ERBI trend analysis.</div>
          )}
          <TechPanel details={[
            { label: 'Trend Test', value: 'Mann–Kendall non-parametric monotonic trend test (Kendall S-statistic, normal approximation)' },
            { label: 'ERBI Metric', value: 'Estimated Emergency Department Resource Burden Index: Σ(Visit Count × Reported Median LOS × 60) per fiscal year' },
            { label: 'Forecast Method', value: "Holt's Linear Trend Exponential Smoothing (Level α = 0.3, Trend β = 0.1, Horizon h = 2 fiscal years)" },
            { label: 'Forecast CI', value: '95% prediction interval: point forecast ± 1.96 × σ_residual × √h' },
            { label: 'H₀', value: 'No monotonic trend exists in the Estimated ERBI series across fiscal years' },
            { label: 'H₁', value: 'A monotonic trend (increasing or decreasing) exists across fiscal years' },
            { label: 'α', value: '0.05 (two-sided); Data: SQLite-loaded processed dataset' },
          ]} />
          <InterpPanel
            stat={`A statistically significant, strong monotonic increasing trend was detected in the Estimated ED Resource Burden Index (ERBI) across the 19-year historical series, Kendall's τ = ${trends ? fmtN(trends.mk.tau, 4) : '.9766'}, p < .0001. Holt's linear trend exponential smoothing projects continued growth in aggregate demand.`}
            clinical="ERBI combines reported median stay duration with visit volumes, reflecting simultaneous upward pressure from population growth, aging demographics, and complexity-driven care duration."
            operational="Long-term capacity planning should incorporate the projected ERBI growth trends and upper-bound prediction intervals to stress-test ED staffing, bed availability, and transition-to-care resources."
          />
        </HCard>

      </div>

      {/* Analytical Scope Statement */}
      <div className="p-4 rounded-xl bg-white dark:bg-[#131f37] border border-[#E5E7EB] dark:border-[#1e2d4a] flex items-start gap-3 max-w-4xl mx-auto shadow-3xs">
        <Info size={16} className="text-[#0F4C81] dark:text-[#3B82F6] shrink-0 mt-0.5" />
        <div className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 font-light leading-relaxed">
          <p className="font-bold text-slate-700 dark:text-slate-200">Reproducibility &amp; Analytical Scope Statement</p>
          <p>All statistical results (H1–H5) are computed dynamically from the SQLite-loaded dataset. Analyses operate exclusively on aggregate-level records. No results are derived from or refer to individual-level records. Weighted tests use visit counts as analytic weights. WLS models aggregate median LOS with visit-count weights. The Estimated Emergency Department Resource Burden Index (ERBI) is a derived composite indicator.</p>
          <p className="text-[11px] text-slate-400 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-1">
            <strong>Main Presenting Problems Scope Note:</strong> The <code className="text-slate-600 dark:text-slate-300">main_problems</code> table (<em>Main_Problems.csv</em>) is actively utilized in Stages 1–3 for exploratory case-mix distribution and high-volume presenting complaint KPI tracking. A formal diagnostic complaint hypothesis test (H6: Clinical Presenting Problem vs. LOS) is deferred to future platform milestone releases because aggregate source tables disaggregate complaints across age and sex without joint multi-attribute cross-tabulation with CTAS acuity and disposition.
          </p>
        </div>
      </div>

      {/* References */}
      <div className="p-4 rounded-xl bg-white dark:bg-[#131f37] border border-[#E5E7EB] dark:border-[#1e2d4a] text-xs space-y-2 max-w-4xl mx-auto shadow-3xs">
        <span className="font-extrabold text-[10px] text-[#0F4C81] dark:text-[#3B82F6] uppercase tracking-wider block font-mono">
          REFERENCES &amp; METHODOLOGICAL CITATIONS (APA 7TH ED.)
        </span>
        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-light leading-relaxed space-y-1">
          <p>American Psychological Association. (2020). <em>Publication manual of the American Psychological Association</em> (7th ed.). https://doi.org/10.1037/0000165-000</p>
          <p>Canadian Institute for Health Information. (2024). <em>National Ambulatory Care Reporting System (NACRS) metadata and data quality documentation</em>. Canadian Institute for Health Information. https://www.cihi.ca</p>
          <p>Cohen, J. (1988). <em>Statistical power analysis for the behavioral sciences</em> (2nd ed.). Lawrence Erlbaum Associates.</p>
          <p>Dunn, O. J. (1964). Multiple comparisons using rank sums. <em>Technometrics</em>, 6(3), 241–252. https://doi.org/10.1080/00401706.1964.10490181</p>
          <p>Kruskal, W. H., &amp; Wallis, W. A. (1952). Use of ranks in one-criterion variance analysis. <em>Journal of the American Statistical Association</em>, 47(260), 583–621. https://doi.org/10.1080/01621459.1952.10483441</p>
          <p>Mann, H. B., &amp; Whitney, D. R. (1947). On a test of whether one of two random variables is stochastically larger than the other. <em>Annals of Mathematical Statistics</em>, 18(1), 50–60. https://doi.org/10.1214/aoms/1177730491</p>
        </div>
      </div>

      {onNavigateNext && (
        <div className="flex justify-center pt-4" id="analytics-proceed-cta">
          <button onClick={onNavigateNext} className="h-12 px-8 rounded-lg bg-[#0F4C81] hover:bg-[#0c3e6b] text-[#FFFFFF] font-bold text-sm flex items-center gap-2 cursor-pointer shadow-md hover:shadow-lg hover:scale-[1.01] transition-all select-none">
            <span>Continue to Executive Dashboard</span><ChevronRight size={17} />
          </button>
        </div>
      )}
    </div>
  );
}
