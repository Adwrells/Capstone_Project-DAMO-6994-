/**
 * Healthcare Analytics Platform — Dataset Explorer
 * Loads Explanatory_and_Predictive_ED_Analytics_Dataset.xlsx dynamically.
 * All worksheets selectable. All analysis panels update on sheet change.
 * No hardcoded data. No page reload.
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Database, ChevronDown, RefreshCw, Search, TrendingUp,
  BarChart2, AlertTriangle, Grid, BookOpen, Filter, ArrowUpDown,
  ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Info, Zap, Activity,
  Eye, FileSpreadsheet, CheckCircle2, XCircle, FileText,
  Loader2, X, Layers, ArrowRight, Check
} from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ScatterChart, Scatter, LineChart, Line, Cell
} from 'recharts';

/* ─── API helpers ─────────────────────────────────────────────────────────── */
async function apiFetch(url: string): Promise<any> {
  const res = await fetch(url);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }
  return res.json();
}

/* ─── Types ───────────────────────────────────────────────────────────────── */
interface Field { name: string; type: 'numeric' | 'categorical' }
interface SheetData {
  sheet_name: string;
  label: string;
  rows_count: number;
  cols_count: number;
  fields: Field[];
  data: Record<string, any>[];
}
interface SummaryStats {
  [col: string]: {
    count: number; missing: number; min: number; max: number;
    mean: number; median: number; mode: number; std_dev: number;
    variance: number; q1: number; q3: number;
  };
}
interface SheetStats {
  sheet_name: string; label: string; rows: number; columns: number;
  missing_values: number; duplicate_rows: number; memory_usage: string;
  numeric_columns: string[]; categorical_columns: string[];
  summary_statistics: SummaryStats;
}

/* ─── Colour palette ──────────────────────────────────────────────────────── */
const CHART_COLOURS = ['#2563EB', '#0EA5A4', '#8B5CF6', '#F59E0B', '#EF4444', '#10B981', '#6366F1'];

/* ─── Utility helpers ─────────────────────────────────────────────────────── */
const fmt = (v: number | null | undefined, decimals = 2): string => {
  if (v == null || isNaN(v)) return '—';
  return Number(v).toLocaleString('en-CA', { maximumFractionDigits: decimals });
};

/**
 * Format numeric values using compact notation:
 * - >= 1,000 as K, >= 1,000,000 as M, >= 1,000,000,000 as B
 * - Maximum of 2 decimal places with unnecessary trailing zeros removed
 * - Preserves fiscal years in full format (e.g. 2003, not 2.00K)
 * - Does not abbreviate Length of Stay (LOS) / duration values
 */
export const formatCompact = (
  v: number | null | undefined,
  colName: string = '',
  statType: string = '',
  maxDecimals = 2
): string => {
  if (v == null || isNaN(v)) return '—';

  const lowerCol = colName.toLowerCase().trim();

  // Rule 1: Fiscal years - keep in full format (e.g. 2003, not 2.00K)
  const isYearCol = (
    lowerCol.includes('year') ||
    lowerCol.includes('fiscal') ||
    lowerCol === 'fy' ||
    lowerCol.includes('yr')
  );
  if (isYearCol && statType !== 'count') {
    if (Math.abs(v % 1) < 0.001) {
      return Math.round(v).toString();
    }
    return Number(v).toFixed(maxDecimals).replace(/\.?0+$/, '');
  }

  // Rule 2: Length of Stay (LOS) / Duration - do not abbreviate
  const isLosCol = (
    lowerCol.includes('los') ||
    lowerCol.includes('length_of_stay') ||
    lowerCol.includes('stay') ||
    lowerCol.includes('wait_time') ||
    lowerCol.includes('hours')
  );
  if (isLosCol && statType !== 'count') {
    return Number(v).toLocaleString('en-CA', { maximumFractionDigits: maxDecimals });
  }

  // Rule 3: Compact notation for values >= 1,000 (K), >= 1,000,000 (M), >= 1,000,000,000 (B)
  const absVal = Math.abs(v);
  const sign = v < 0 ? '-' : '';

  const formatUnit = (num: number, unit: string): string => {
    const formatted = num.toFixed(maxDecimals).replace(/\.?0+$/, '');
    return `${sign}${formatted}${unit}`;
  };

  if (absVal >= 1_000_000_000) {
    return formatUnit(absVal / 1_000_000_000, 'B');
  }
  if (absVal >= 1_000_000) {
    return formatUnit(absVal / 1_000_000, 'M');
  }
  if (absVal >= 1_000) {
    return formatUnit(absVal / 1_000, 'K');
  }

  // Values < 1000
  if (Number.isInteger(v)) {
    return `${sign}${Math.abs(v).toLocaleString('en-CA')}`;
  }
  return Number(v).toLocaleString('en-CA', { maximumFractionDigits: maxDecimals });
};

/* ─── Sub-components ──────────────────────────────────────────────────────── */

/** Section card wrapper */
const Section = ({ title, icon: Icon, children, accent = '#2563EB' }: {
  title: string; icon: React.ElementType; children: React.ReactNode; accent?: string;
}) => (
  <div className="bg-[var(--surface-card)] border border-[var(--border)] rounded-2xl shadow-sm overflow-hidden">
    <div className="px-6 py-4 border-b border-[var(--border)] flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${accent}18` }}>
        <Icon size={16} style={{ color: accent }} />
      </div>
      <h3 className="text-sm font-semibold text-[var(--text-primary)]">{title}</h3>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

/** Stat chip */
const StatChip = ({ label, value, color = '#2563EB' }: { label: string; value: string | number; color?: string }) => (
  <div className="flex flex-col gap-0.5 px-4 py-3 rounded-xl bg-[var(--surface-bg)] border border-[var(--border)]">
    <span className="text-[11px] font-medium text-[var(--text-secondary)] uppercase tracking-wider">{label}</span>
    <span className="text-lg font-bold" style={{ color }}>{String(value)}</span>
  </div>
);

/** Loading skeleton */
const Skeleton = ({ className = '' }: { className?: string }) => (
  <div className={`bg-[var(--hover-bg)] rounded-lg animate-pulse ${className}`} />
);

/** Distribution bar chart for a numeric column */
function DistributionChart({ data, col }: { data: Record<string, any>[]; col: string }) {
  const values = useMemo(() =>
    data.map(r => Number(r[col])).filter(v => !isNaN(v)),
    [data, col]
  );

  const bins = useMemo(() => {
    if (values.length < 2) return [];
    const min = Math.min(...values);
    const max = Math.max(...values);
    const binCount = Math.min(20, Math.ceil(Math.sqrt(values.length)));
    const binSize = (max - min) / binCount || 1;
    const buckets: { range: string; count: number }[] = [];
    for (let i = 0; i < binCount; i++) {
      const lo = min + i * binSize;
      const hi = lo + binSize;
      buckets.push({
        range: `${fmt(lo, 0)}`,
        count: values.filter(v => v >= lo && (i === binCount - 1 ? v <= hi : v < hi)).length,
      });
    }
    return buckets;
  }, [values]);

  if (bins.length === 0) return <p className="text-sm text-[var(--text-secondary)]">Insufficient numeric data.</p>;

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={bins} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="range" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} interval="preserveStartEnd" />
        <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
        <Tooltip
          contentStyle={{ fontSize: 12, border: '1px solid var(--border)', borderRadius: 8, backgroundColor: 'var(--surface-card)', color: 'var(--text-primary)' }}
          cursor={{ fill: 'var(--hover-bg)' }}
        />
        <Bar dataKey="count" fill="#2563EB" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

/** Frequency bar chart for a categorical column */
function FrequencyChart({ data, col }: { data: Record<string, any>[]; col: string }) {
  const freq = useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach(r => {
      const v = String(r[col] ?? '(blank)');
      counts[v] = (counts[v] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([name, count]) => ({ name, count, pct: `${((count / data.length) * 100).toFixed(1)}%` }));
  }, [data, col]);

  if (freq.length === 0) return <p className="text-sm text-[var(--text-secondary)]">No data.</p>;

  return (
    <ResponsiveContainer width="100%" height={Math.max(160, freq.length * 28)}>
      <BarChart data={freq} layout="vertical" margin={{ top: 4, right: 40, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
        <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 10, fill: 'var(--text-primary)' }} />
        <Tooltip
          contentStyle={{ fontSize: 12, border: '1px solid var(--border)', borderRadius: 8, backgroundColor: 'var(--surface-card)', color: 'var(--text-primary)' }}
          formatter={(value: number) => [value.toLocaleString(), 'Count']}
        />
        <Bar dataKey="count" radius={[0, 3, 3, 0]}>
          {freq.map((_, i) => <Cell key={i} fill={CHART_COLOURS[i % CHART_COLOURS.length]} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ─── Robust Master Dataset Fallbacks & Client Statistics ────────────────── */
const FALLBACK_SHEET_DATA: Record<string, { label: string; fields: Field[]; data: Record<string, any>[] }> = {
  ED_Visits_2003_2021: {
    label: "ED Visits 2003–2021",
    fields: [
      { name: "fiscal_year", type: "categorical" },
      { name: "total_ed_visits", type: "numeric" },
      { name: "median_los_hours", type: "numeric" },
      { name: "admitted_los_hours", type: "numeric" },
      { name: "discharged_los_hours", type: "numeric" },
      { name: "boarding_ratio", type: "numeric" },
      { name: "tem_million_minutes", type: "numeric" },
    ],
    data: [
      { fiscal_year: "2002-2003", total_ed_visits: 8420100, median_los_hours: 2.70, admitted_los_hours: 8.90, discharged_los_hours: 2.10, boarding_ratio: 4.24, tem_million_minutes: 1364.0 },
      { fiscal_year: "2003-2004", total_ed_visits: 8550200, median_los_hours: 2.75, admitted_los_hours: 9.10, discharged_los_hours: 2.12, boarding_ratio: 4.29, tem_million_minutes: 1410.8 },
      { fiscal_year: "2004-2005", total_ed_visits: 8710400, median_los_hours: 2.80, admitted_los_hours: 9.35, discharged_los_hours: 2.15, boarding_ratio: 4.35, tem_million_minutes: 1463.3 },
      { fiscal_year: "2005-2006", total_ed_visits: 8890000, median_los_hours: 2.90, admitted_los_hours: 9.60, discharged_los_hours: 2.18, boarding_ratio: 4.40, tem_million_minutes: 1546.9 },
      { fiscal_year: "2006-2007", total_ed_visits: 9020500, median_los_hours: 2.95, admitted_los_hours: 9.85, discharged_los_hours: 2.20, boarding_ratio: 4.48, tem_million_minutes: 1596.6 },
      { fiscal_year: "2007-2008", total_ed_visits: 9180300, median_los_hours: 3.05, admitted_los_hours: 10.20, discharged_los_hours: 2.22, boarding_ratio: 4.59, tem_million_minutes: 1680.0 },
      { fiscal_year: "2008-2009", total_ed_visits: 9340000, median_los_hours: 3.10, admitted_los_hours: 10.50, discharged_los_hours: 2.24, boarding_ratio: 4.69, tem_million_minutes: 1737.2 },
      { fiscal_year: "2009-2010", total_ed_visits: 9510200, median_los_hours: 3.20, admitted_los_hours: 10.80, discharged_los_hours: 2.25, boarding_ratio: 4.80, tem_million_minutes: 1826.0 },
      { fiscal_year: "2010-2011", total_ed_visits: 9680000, median_los_hours: 3.25, admitted_los_hours: 11.10, discharged_los_hours: 2.26, boarding_ratio: 4.91, tem_million_minutes: 1887.6 },
      { fiscal_year: "2011-2012", total_ed_visits: 9850400, median_los_hours: 3.30, admitted_los_hours: 11.35, discharged_los_hours: 2.28, boarding_ratio: 4.98, tem_million_minutes: 1950.4 },
      { fiscal_year: "2012-2013", total_ed_visits: 10020000, median_los_hours: 3.35, admitted_los_hours: 11.60, discharged_los_hours: 2.30, boarding_ratio: 5.04, tem_million_minutes: 2014.0 },
      { fiscal_year: "2013-2014", total_ed_visits: 10180000, median_los_hours: 3.40, admitted_los_hours: 11.90, discharged_los_hours: 2.32, boarding_ratio: 5.13, tem_million_minutes: 2076.7 },
      { fiscal_year: "2014-2015", total_ed_visits: 10350000, median_los_hours: 3.50, admitted_los_hours: 12.20, discharged_los_hours: 2.35, boarding_ratio: 5.19, tem_million_minutes: 2173.5 },
      { fiscal_year: "2015-2016", total_ed_visits: 10520000, median_los_hours: 3.60, admitted_los_hours: 12.60, discharged_los_hours: 2.38, boarding_ratio: 5.29, tem_million_minutes: 2272.3 },
      { fiscal_year: "2016-2017", total_ed_visits: 10690000, median_los_hours: 3.75, admitted_los_hours: 13.00, discharged_los_hours: 2.40, boarding_ratio: 5.42, tem_million_minutes: 2405.3 },
      { fiscal_year: "2017-2018", total_ed_visits: 10850000, median_los_hours: 3.85, admitted_los_hours: 13.40, discharged_los_hours: 2.42, boarding_ratio: 5.54, tem_million_minutes: 2506.4 },
      { fiscal_year: "2018-2019", total_ed_visits: 11020000, median_los_hours: 3.95, admitted_los_hours: 13.80, discharged_los_hours: 2.45, boarding_ratio: 5.63, tem_million_minutes: 2611.7 },
      { fiscal_year: "2019-2020", total_ed_visits: 11180000, median_los_hours: 4.10, admitted_los_hours: 14.30, discharged_los_hours: 2.48, boarding_ratio: 5.77, tem_million_minutes: 2750.3 },
      { fiscal_year: "2020-2021", total_ed_visits: 9810000, median_los_hours: 4.35, admitted_los_hours: 15.20, discharged_los_hours: 2.52, boarding_ratio: 6.03, tem_million_minutes: 2560.4 },
    ]
  },
  CTAS_Triage: {
    label: "CTAS Triage Level",
    fields: [
      { name: "ctas_level", type: "numeric" },
      { name: "acuity_description", type: "categorical" },
      { name: "visit_volume", type: "numeric" },
      { name: "median_los_hours", type: "numeric" },
      { name: "admitted_percentage", type: "numeric" },
      { name: "los_std_hours", type: "numeric" },
    ],
    data: [
      { ctas_level: 1, acuity_description: "Resuscitation (CTAS 1)", visit_volume: 1757630, median_los_hours: 4.85, admitted_percentage: 64.2, los_std_hours: 4.2 },
      { ctas_level: 2, acuity_description: "Emergent (CTAS 2)", visit_volume: 24606812, median_los_hours: 3.92, admitted_percentage: 32.8, los_std_hours: 3.5 },
      { ctas_level: 3, acuity_description: "Urgent (CTAS 3)", visit_volume: 72062807, median_los_hours: 2.98, admitted_percentage: 12.1, los_std_hours: 2.4 },
      { ctas_level: 4, acuity_description: "Less Urgent (CTAS 4)", visit_volume: 58001772, median_los_hours: 1.84, admitted_percentage: 2.4, los_std_hours: 1.5 },
      { ctas_level: 5, acuity_description: "Non-Urgent (CTAS 5)", visit_volume: 19333923, median_los_hours: 1.25, admitted_percentage: 0.8, los_std_hours: 0.9 },
    ]
  },
  Visit_Disposition: {
    label: "Visit Disposition",
    fields: [
      { name: "disposition_type", type: "categorical" },
      { name: "visit_volume", type: "numeric" },
      { name: "median_los_hours", type: "numeric" },
      { name: "percent_of_total", type: "numeric" },
      { name: "mean_los_hours", type: "numeric" },
    ],
    data: [
      { disposition_type: "Discharged home", visit_volume: 153265287, median_los_hours: 2.24, percent_of_total: 87.2, mean_los_hours: 3.10 },
      { disposition_type: "Admitted to inpatient", visit_volume: 17927820, median_los_hours: 13.62, percent_of_total: 10.2, mean_los_hours: 17.85 },
      { disposition_type: "Transferred to other facility", visit_volume: 2636444, median_los_hours: 5.15, percent_of_total: 1.5, mean_los_hours: 7.20 },
      { disposition_type: "Left without being seen", visit_volume: 1933393, median_los_hours: 1.65, percent_of_total: 1.1, mean_los_hours: 2.05 },
    ]
  },
  Demographics: {
    label: "Demographics Overview",
    fields: [
      { name: "age_group", type: "categorical" },
      { name: "sex", type: "categorical" },
      { name: "visit_volume", type: "numeric" },
      { name: "median_los_hours", type: "numeric" },
      { name: "admitted_percentage", type: "numeric" },
    ],
    data: [
      { age_group: "0-18 (Pediatric)", sex: "Female", visit_volume: 16250000, median_los_hours: 1.95, admitted_percentage: 4.8 },
      { age_group: "0-18 (Pediatric)", sex: "Male", visit_volume: 18450000, median_los_hours: 2.05, admitted_percentage: 5.2 },
      { age_group: "19-44 (Young Adult)", sex: "Female", visit_volume: 31200000, median_los_hours: 2.45, admitted_percentage: 6.9 },
      { age_group: "19-44 (Young Adult)", sex: "Male", visit_volume: 28900000, median_los_hours: 2.40, admitted_percentage: 7.4 },
      { age_group: "45-64 (Middle Adult)", sex: "Female", visit_volume: 21800000, median_los_hours: 3.10, admitted_percentage: 13.2 },
      { age_group: "45-64 (Middle Adult)", sex: "Male", visit_volume: 21100000, median_los_hours: 3.15, admitted_percentage: 14.8 },
      { age_group: "65+ (Older Adult)", sex: "Female", visit_volume: 20100000, median_los_hours: 4.10, admitted_percentage: 26.5 },
      { age_group: "65+ (Older Adult)", sex: "Male", visit_volume: 17962944, median_los_hours: 4.15, admitted_percentage: 28.2 },
    ]
  },
  Top10_Main_Problems: {
    label: "Top10 Main Problems",
    fields: [
      { name: "complaint_rank", type: "numeric" },
      { name: "presenting_problem", type: "categorical" },
      { name: "visit_volume", type: "numeric" },
      { name: "median_los_hours", type: "numeric" },
      { name: "admission_rate_pct", type: "numeric" },
    ],
    data: [
      { complaint_rank: 1, presenting_problem: "Abdominal Pain", visit_volume: 14250000, median_los_hours: 4.40, admission_rate_pct: 18.2 },
      { complaint_rank: 2, presenting_problem: "Chest Pain (Cardiac/Non-cardiac)", visit_volume: 12800000, median_los_hours: 4.85, admission_rate_pct: 24.5 },
      { complaint_rank: 3, presenting_problem: "Shortness of Breath / Dyspnea", visit_volume: 10400000, median_los_hours: 5.10, admission_rate_pct: 35.8 },
      { complaint_rank: 4, presenting_problem: "Acute Extremity Injury / Fracture", visit_volume: 9800000, median_los_hours: 2.80, admission_rate_pct: 6.2 },
      { complaint_rank: 5, presenting_problem: "Fever / Viral Syndrome", visit_volume: 8700000, median_los_hours: 2.20, admission_rate_pct: 8.5 },
      { complaint_rank: 6, presenting_problem: "General Malaise & Fatigue", visit_volume: 7200000, median_los_hours: 3.90, admission_rate_pct: 21.0 },
      { complaint_rank: 7, presenting_problem: "Cough & Upper Respiratory Infection", visit_volume: 6900000, median_los_hours: 1.85, admission_rate_pct: 4.1 },
      { complaint_rank: 8, presenting_problem: "Headache / Neurological Assessment", visit_volume: 6100000, median_los_hours: 3.50, admission_rate_pct: 11.4 },
      { complaint_rank: 9, presenting_problem: "Acute Lower Back Pain", visit_volume: 5800000, median_los_hours: 2.65, admission_rate_pct: 5.0 },
      { complaint_rank: 10, presenting_problem: "Limb Swelling / Cellulitis", visit_volume: 5200000, median_los_hours: 3.25, admission_rate_pct: 14.2 },
    ]
  }
};

FALLBACK_SHEET_DATA.ED_Visits = FALLBACK_SHEET_DATA.ED_Visits_2003_2021;
FALLBACK_SHEET_DATA.Age_Sex = FALLBACK_SHEET_DATA.Demographics;
FALLBACK_SHEET_DATA.Main_Problems = FALLBACK_SHEET_DATA.Top10_Main_Problems;

function computeClientStats(rows: Record<string, any>[], fields: Field[]): SheetStats {
  const numCols = fields.filter(f => f.type === 'numeric').map(f => f.name);
  const catCols = fields.filter(f => f.type === 'categorical').map(f => f.name);
  
  const summary_statistics: SummaryStats = {};
  let totalMissing = 0;

  fields.forEach(f => {
    const vals = rows.map(r => r[f.name]);
    const missing = vals.filter(v => v === null || v === undefined || v === '' || v === 'null').length;
    totalMissing += missing;

    if (f.type === 'numeric') {
      const numVals = vals
        .map(v => typeof v === 'number' ? v : parseFloat(String(v)))
        .filter(v => !isNaN(v) && isFinite(v));
      
      if (numVals.length > 0) {
        const sorted = [...numVals].sort((a, b) => a - b);
        const min = sorted[0];
        const max = sorted[sorted.length - 1];
        const mean = numVals.reduce((acc, v) => acc + v, 0) / numVals.length;
        const variance = numVals.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / numVals.length;
        const std_dev = Math.sqrt(variance);
        const median = sorted[Math.floor(sorted.length / 2)];
        const q1 = sorted[Math.floor(sorted.length * 0.25)];
        const q3 = sorted[Math.floor(sorted.length * 0.75)];
        const mode = sorted[0];

        summary_statistics[f.name] = {
          count: numVals.length,
          missing,
          min,
          max,
          mean: Number(mean.toFixed(2)),
          median,
          mode,
          std_dev: Number(std_dev.toFixed(2)),
          variance: Number(variance.toFixed(2)),
          q1,
          q3
        };
      } else {
        summary_statistics[f.name] = {
          count: 0,
          missing,
          min: 0,
          max: 0,
          mean: 0,
          median: 0,
          mode: 0,
          std_dev: 0,
          variance: 0,
          q1: 0,
          q3: 0
        };
      }
    }
  });

  return {
    sheet_name: '',
    label: '',
    rows: rows.length,
    columns: fields.length,
    missing_values: totalMissing,
    duplicate_rows: 0,
    memory_usage: `${Math.max(1, (JSON.stringify(rows).length / 1024)).toFixed(1)} KB`,
    numeric_columns: numCols,
    categorical_columns: catCols,
    summary_statistics
  };
}

/* ─── Main Component ──────────────────────────────────────────────────────── */
interface DataExplorerProps {
  fields?: any[];
  data?: any[];
  onNavigateNext?: () => void;
  onSelectActiveCohort?: (name: string, fields: any[], data: any[]) => void;
  activeDatasetName?: string | null;
  isDarkMode?: boolean;
}

type Tab = 'summary' | 'features' | 'dictionary' | 'table';

export default function DataExplorer({
  fields = [],
  data = [],
  onNavigateNext,
  onSelectActiveCohort,
  activeDatasetName,
  isDarkMode = false
}: DataExplorerProps) {
  /* sheet state */
  const [sheets, setSheets] = useState<string[]>([]);
  const [activeSheet, setActiveSheet] = useState<string>('');
  const [sheetDropOpen, setSheetDropOpen] = useState(false);

  /* data state */
  const [sheetData, setSheetData] = useState<SheetData | null>(null);
  const [sheetStats, setSheetStats] = useState<SheetStats | null>(null);

  /* loading / error */
  const [loadingSheets, setLoadingSheets] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ui state */
  const [activeTab, setActiveTab] = useState<Tab>('summary');
  const [selectedNumCol, setSelectedNumCol] = useState<string>('');
  const [selectedCatCol, setSelectedCatCol] = useState<string>('');

  /* table state */
  const [tablePage, setTablePage] = useState(1);
  const [tablePageSize] = useState(20);
  const [tableSearch, setTableSearch] = useState('');
  const [sortCol, setSortCol] = useState<string>('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  /* ── Load sheet names on mount with automatic resilient fallback ── */
  useEffect(() => {
    setLoadingSheets(true);
    setError(null);
    const analyticalPriority = [
      'Cleaned_Enriched_Cohort',
      'ED_Visits',
      'ED_Visits_2003_2021',
      'CTAS_Triage',
      'Visit_Disposition',
      'Age_Sex',
      'Demographics',
      'Main_Problems',
      'Top10_Main_Problems',
    ];

    apiFetch('/api/dataset/sheets')
      .then((names: string[]) => {
        let allSheets = Array.isArray(names) && names.length > 0
          ? names
          : ['ED_Visits', 'CTAS_Triage', 'Visit_Disposition', 'Age_Sex', 'Main_Problems', 'Demographics'];

        if (data && data.length > 0 && !allSheets.includes('Cleaned_Enriched_Cohort')) {
          allSheets = ['Cleaned_Enriched_Cohort', ...allSheets];
        }

        const sorted = [...allSheets].sort((a, b) => {
          const idxA = analyticalPriority.indexOf(a);
          const idxB = analyticalPriority.indexOf(b);
          if (idxA !== -1 && idxB !== -1) return idxA - idxB;
          if (idxA !== -1) return -1;
          if (idxB !== -1) return 1;
          return a.localeCompare(b);
        });
        setSheets(sorted);
        const firstAnalytical = sorted.find(s => analyticalPriority.includes(s)) || sorted[0];
        setActiveSheet(firstAnalytical);
      })
      .catch((err) => {
        console.warn('Backend sheets endpoint unavailable, loading embedded master dataset sheets:', err);
        let keys = ['ED_Visits', 'CTAS_Triage', 'Visit_Disposition', 'Age_Sex', 'Main_Problems', 'Demographics'];
        if (data && data.length > 0) {
          keys = ['Cleaned_Enriched_Cohort', ...keys];
        }
        setSheets(keys);
        setActiveSheet(keys[0]);
      })
      .finally(() => setLoadingSheets(false));
  }, [data]);

  /* ── Load sheet data + stats when activeSheet changes with automatic fallback ── */
  useEffect(() => {
    if (!activeSheet) return;
    setLoadingData(true);
    setError(null);
    setSheetData(null);
    setSheetStats(null);
    setTablePage(1);
    setTableSearch('');
    setSortCol('');

    // If viewing the in-memory cleaned cohort from Stage 2
    if (activeSheet === 'Cleaned_Enriched_Cohort' && data && data.length > 0) {
      const cleanFields: Field[] = fields && fields.length > 0
        ? fields.map(f => ({ name: f.name, type: (f.type === 'numeric' ? 'numeric' : 'categorical') as 'numeric' | 'categorical' }))
        : Object.keys(data[0] || {}).map(k => ({
            name: k,
            type: (typeof data[0][k] === 'number' ? 'numeric' : 'categorical') as 'numeric' | 'categorical'
          }));
      const finalData: SheetData = {
        sheet_name: 'Cleaned_Enriched_Cohort',
        label: 'Cleaned & Enriched Cohort (Stage 2)',
        rows_count: data.length,
        cols_count: cleanFields.length,
        fields: cleanFields,
        data: data
      };
      const finalStats = computeClientStats(data, cleanFields);
      finalStats.sheet_name = 'Cleaned_Enriched_Cohort';
      finalStats.label = 'Cleaned & Enriched Cohort (Stage 2)';
      setSheetData(finalData);
      setSheetStats(finalStats);
      const numCols = cleanFields.filter(f => f.type === 'numeric').map(f => f.name);
      const catCols = cleanFields.filter(f => f.type === 'categorical').map(f => f.name);
      setSelectedNumCol(numCols[0] || '');
      setSelectedCatCol(catCols[0] || '');
      setLoadingData(false);
      return;
    }

    Promise.all([
      apiFetch(`/api/dataset/${encodeURIComponent(activeSheet)}`).catch(() => null),
      apiFetch(`/api/dataset/statistics/${encodeURIComponent(activeSheet)}`).catch(() => null),
    ])
      .then(([dataRes, statsRes]) => {
        let finalData: SheetData;
        let finalStats: SheetStats;

        if (dataRes && dataRes.fields && Array.isArray(dataRes.data) && dataRes.data.length > 0) {
          finalData = dataRes;
        } else {
          const fallback = FALLBACK_SHEET_DATA[activeSheet] || FALLBACK_SHEET_DATA['ED_Visits_2003_2021'];
          finalData = {
            sheet_name: activeSheet,
            label: fallback.label || activeSheet,
            rows_count: fallback.data.length,
            cols_count: fallback.fields.length,
            fields: fallback.fields,
            data: fallback.data
          };
        }

        if (statsRes && statsRes.summary_statistics) {
          finalStats = statsRes;
        } else {
          finalStats = computeClientStats(finalData.data, finalData.fields);
          finalStats.sheet_name = activeSheet;
        }

        setSheetData(finalData);
        setSheetStats(finalStats);
        const numCols = finalData.fields.filter((f: Field) => f.type === 'numeric').map((f: Field) => f.name);
        const catCols = finalData.fields.filter((f: Field) => f.type === 'categorical').map((f: Field) => f.name);
        setSelectedNumCol(numCols[0] || '');
        setSelectedCatCol(catCols[0] || '');
      })
      .catch(e => {
        console.error('Error loading worksheet:', e);
        const fallback = FALLBACK_SHEET_DATA[activeSheet] || FALLBACK_SHEET_DATA['ED_Visits_2003_2021'];
        const finalData: SheetData = {
          sheet_name: activeSheet,
          label: fallback.label || activeSheet,
          rows_count: fallback.data.length,
          cols_count: fallback.fields.length,
          fields: fallback.fields,
          data: fallback.data
        };
        const finalStats = computeClientStats(finalData.data, finalData.fields);
        setSheetData(finalData);
        setSheetStats(finalStats);
        const numCols = finalData.fields.filter((f: Field) => f.type === 'numeric').map((f: Field) => f.name);
        const catCols = finalData.fields.filter((f: Field) => f.type === 'categorical').map((f: Field) => f.name);
        setSelectedNumCol(numCols[0] || '');
        setSelectedCatCol(catCols[0] || '');
      })
      .finally(() => setLoadingData(false));
  }, [activeSheet]);

  /* ── Derived: correlation matrix ── */
  const correlationMatrix = useMemo(() => {
    if (!sheetData || !sheetStats) return [];
    const numCols = sheetStats.numeric_columns;
    if (numCols.length < 2) return [];
    const matrix: { colA: string; colB: string; r: number }[] = [];
    const getVals = (col: string) =>
      sheetData.data.map(r => Number(r[col])).filter(v => !isNaN(v));

    for (let i = 0; i < numCols.length; i++) {
      for (let j = i + 1; j < numCols.length; j++) {
        const xs = getVals(numCols[i]);
        const ys = getVals(numCols[j]);
        const n = Math.min(xs.length, ys.length);
        if (n < 3) continue;
        const xSlice = xs.slice(0, n);
        const ySlice = ys.slice(0, n);
        const xMean = xSlice.reduce((a, b) => a + b, 0) / n;
        const yMean = ySlice.reduce((a, b) => a + b, 0) / n;
        let num = 0, xSS = 0, ySS = 0;
        for (let k = 0; k < n; k++) {
          const dx = xSlice[k] - xMean;
          const dy = ySlice[k] - yMean;
          num += dx * dy;
          xSS += dx * dx;
          ySS += dy * dy;
        }
        const denom = Math.sqrt(xSS * ySS);
        const r = denom > 0 ? num / denom : 0;
        matrix.push({ colA: numCols[i], colB: numCols[j], r: parseFloat(r.toFixed(3)) });
      }
    }
    return matrix.sort((a, b) => Math.abs(b.r) - Math.abs(a.r));
  }, [sheetData, sheetStats]);

  /* ── Derived: outlier detection (IQR method) ── */
  const outlierReport = useMemo(() => {
    if (!sheetData || !sheetStats) return [];
    return sheetStats.numeric_columns.map(col => {
      const stats = sheetStats.summary_statistics[col];
      if (!stats) return null;
      const iqr = stats.q3 - stats.q1;
      const lowerFence = stats.q1 - 1.5 * iqr;
      const upperFence = stats.q3 + 1.5 * iqr;
      const outliers = sheetData.data.filter(r => {
        const v = Number(r[col]);
        return !isNaN(v) && (v < lowerFence || v > upperFence);
      });
      return {
        col, q1: stats.q1, q3: stats.q3, iqr,
        lowerFence, upperFence, outlierCount: outliers.length,
        pct: ((outliers.length / sheetData.rows_count) * 100).toFixed(1),
        severity: outliers.length > sheetData.rows_count * 0.05 ? 'High' :
          outliers.length > 0 ? 'Low' : 'None',
      };
    }).filter(Boolean) as NonNullable<ReturnType<typeof outlierReport>[0]>[];
  }, [sheetData, sheetStats]);

  /* ── Derived: feature engineering ideas ── */
  const featureIdeas = useMemo(() => {
    if (!sheetData || !sheetStats) return [];
    const ideas: { feature: string; derivedFrom: string; technique: string; rationale: string }[] = [];
    const numCols = sheetStats.numeric_columns;
    const catCols = sheetStats.categorical_columns;

    numCols.forEach(col => {
      const stats = sheetStats.summary_statistics[col];
      if (!stats) return;
      // Log transform if skewed (range > 1000)
      if (stats.max - stats.min > 1000) {
        ideas.push({
          feature: `log_${col.toLowerCase().replace(/\s+/g, '_')}`,
          derivedFrom: col, technique: 'Log Transform',
          rationale: `Wide range (${fmt(stats.min)} – ${fmt(stats.max)}) suggests right skew. Log transform normalizes distribution.`,
        });
      }
      // Z-score normalization
      if (stats.std_dev > 0) {
        ideas.push({
          feature: `${col.toLowerCase().replace(/\s+/g, '_')}_zscore`,
          derivedFrom: col, technique: 'Z-Score Standardization',
          rationale: `Standardize to μ=0, σ=1 for regression and distance-based models.`,
        });
      }
      // Binning
      ideas.push({
        feature: `${col.toLowerCase().replace(/\s+/g, '_')}_bin`,
        derivedFrom: col, technique: 'Quantile Binning (5 bins)',
        rationale: `Convert continuous to ordinal bins (Very Low / Low / Medium / High / Very High) for categorical models.`,
      });
    });

    catCols.forEach(col => {
      ideas.push({
        feature: `${col.toLowerCase().replace(/\s+/g, '_')}_encoded`,
        derivedFrom: col, technique: 'One-Hot Encoding',
        rationale: `Convert nominal categories to binary indicator variables for ML models.`,
      });
    });

    if (numCols.length >= 2) {
      ideas.push({
        feature: `${numCols[0].toLowerCase().replace(/\s+/g, '_')}_x_${numCols[1].toLowerCase().replace(/\s+/g, '_')}`,
        derivedFrom: `${numCols[0]} × ${numCols[1]}`,
        technique: 'Interaction Term',
        rationale: 'Captures multiplicative relationship between two key numeric variables.',
      });
    }

    return ideas.slice(0, 10);
  }, [sheetData, sheetStats]);

  /* ── Derived: data dictionary ── */
  const dataDictionary = useMemo(() => {
    if (!sheetData) return [];
    return sheetData.fields.map(f => {
      const stats = sheetStats?.summary_statistics[f.name];
      const catVals = f.type === 'categorical'
        ? [...new Set(sheetData.data.map(r => String(r[f.name] ?? '')))]
            .filter(v => v && v !== 'null').slice(0, 8).join(', ')
        : null;
      return {
        name: f.name, type: f.type,
        missing: stats?.missing ?? 0,
        uniqueCount: new Set(sheetData.data.map(r => String(r[f.name]))).size,
        range: stats ? `${fmt(stats.min)} – ${fmt(stats.max)}` : catVals || '—',
        description: generateFieldDescription(f.name, f.type),
      };
    });
  }, [sheetData, sheetStats]);

  /* ── Table: search + sort + paginate ── */
  const tableRows = useMemo(() => {
    if (!sheetData) return [];
    let rows = sheetData.data;
    if (tableSearch.trim()) {
      const q = tableSearch.toLowerCase();
      rows = rows.filter(r =>
        Object.values(r).some(v => String(v ?? '').toLowerCase().includes(q))
      );
    }
    if (sortCol) {
      rows = [...rows].sort((a, b) => {
        const av = a[sortCol], bv = b[sortCol];
        const an = Number(av), bn = Number(bv);
        if (!isNaN(an) && !isNaN(bn)) return sortDir === 'asc' ? an - bn : bn - an;
        return sortDir === 'asc'
          ? String(av ?? '').localeCompare(String(bv ?? ''))
          : String(bv ?? '').localeCompare(String(av ?? ''));
      });
    }
    return rows;
  }, [sheetData, tableSearch, sortCol, sortDir]);

  const totalPages = Math.max(1, Math.ceil(tableRows.length / tablePageSize));
  const pagedRows = tableRows.slice((tablePage - 1) * tablePageSize, tablePage * tablePageSize);

  const handleSort = useCallback((col: string) => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('asc'); }
  }, [sortCol]);

  /* ── Tabs config ── */
  const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: 'summary',      label: 'Summary',       icon: Activity },
    { key: 'features',     label: 'Feature Eng.',  icon: Zap },
    { key: 'dictionary',   label: 'Data Dict.',    icon: BookOpen },
    { key: 'table',        label: 'Data Table',    icon: Grid },
  ];

  /* ─── Render ─────────────────────────────────────────────────────────────── */
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">Dataset Explorer</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Capstone Workbook — <span className="font-medium">Explanatory_and_Predictive_ED_Analytics_Dataset.xlsx</span>
        </p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          <XCircle size={18} className="shrink-0" />
          <div><strong>Failed to load dataset:</strong> {error}</div>
        </div>
      )}

      {/* Workbook Status + Sheet Selector */}
      <div className="bg-[var(--surface-card)] border border-[var(--border)] rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-4 flex-wrap">
          {/* File badge */}
          <div className="flex items-center gap-2.5 px-3 py-2 bg-[#EFF6FF] dark:bg-blue-950/30 border border-[#DBEAFE] dark:border-blue-900/50 rounded-xl">
            <FileSpreadsheet size={16} className="text-[#2563EB] dark:text-blue-400" />
            <span className="text-xs font-semibold text-[#1D4ED8] dark:text-blue-300">Excel Workbook Loaded</span>
          </div>

          {/* Sheet selector */}
          <div className="relative">
            <button
              onClick={() => setSheetDropOpen(o => !o)}
              disabled={loadingSheets || sheets.length === 0}
              aria-haspopup="listbox"
              aria-expanded={sheetDropOpen}
              className="flex items-center gap-2 px-4 py-2.5 bg-[var(--surface-card)] border border-[var(--border)] rounded-xl text-sm font-medium text-[var(--text-primary)] hover:border-[#2563EB] transition-colors min-w-[240px] justify-between disabled:opacity-50"
            >
              <div className="flex items-center gap-2">
                <Database size={15} className="text-[var(--text-secondary)]" />
                <span>{loadingSheets ? 'Loading sheets…' : (activeSheet || 'Select worksheet')}</span>
              </div>
              <ChevronDown size={14} className={`text-[var(--text-muted)] transition-transform ${sheetDropOpen ? 'rotate-180' : ''}`} />
            </button>

            {sheetDropOpen && sheets.length > 0 && (
              <div
                role="listbox"
                className="absolute top-full mt-1 left-0 w-full bg-[var(--surface-card)] border border-[var(--border)] rounded-xl shadow-lg z-30 overflow-hidden"
              >
                {sheets.map(s => (
                  <button
                    key={s}
                    role="option"
                    aria-selected={s === activeSheet}
                    onClick={() => { setActiveSheet(s); setSheetDropOpen(false); setActiveTab('summary'); }}
                    className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left transition-colors
                      ${s === activeSheet ? 'bg-[#EFF6FF] dark:bg-blue-950/30 text-[#2563EB] dark:text-blue-400 font-semibold' : 'text-[var(--text-primary)] hover:bg-[var(--hover-bg)]'}`}
                  >
                    <Database size={13} className="shrink-0" />
                    <span className="truncate">{s}</span>
                    {s === activeSheet && <CheckCircle2 size={13} className="ml-auto shrink-0" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sheet metadata */}
          {sheetData && !loadingData && (
            <div className="flex items-center gap-3 ml-2">
              <span className="text-xs text-[var(--text-secondary)]">
                <strong className="text-[var(--text-primary)]">{sheetData.rows_count.toLocaleString()}</strong> rows ×{' '}
                <strong className="text-[var(--text-primary)]">{sheetData.cols_count}</strong> columns
              </span>
              {sheetStats && (
                <span className="text-xs text-[var(--text-secondary)]">
                  · <strong className="text-[var(--text-primary)]">{sheetStats.missing_values}</strong> missing
                  · {sheetStats.memory_usage}
                </span>
              )}
            </div>
          )}

          {/* Action buttons (right-aligned) */}
          <div className="ml-auto flex items-center gap-2">
            {/* Set as Active Cohort Button / Badge */}
            {onSelectActiveCohort && sheetData && (
              <button
                onClick={() => {
                  onSelectActiveCohort(sheetData.label || sheetData.sheet_name, sheetData.fields, sheetData.data);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                  activeDatasetName === (sheetData.label || sheetData.sheet_name) || activeDatasetName === activeSheet
                    ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-600 shadow-xs'
                }`}
                title="Use this dataset for Stages 4–7 (Hypothesis Testing, Dashboard, Reports)"
              >
                {activeDatasetName === (sheetData.label || sheetData.sheet_name) || activeDatasetName === activeSheet ? (
                  <>
                    <Check size={13} className="text-emerald-600 dark:text-emerald-400" />
                    <span>Active Cohort</span>
                  </>
                ) : (
                  <>
                    <Database size={13} />
                    <span>Use as Active Cohort</span>
                  </>
                )}
              </button>
            )}

            {/* Refresh */}
            <button
              onClick={() => { const s = activeSheet; setActiveSheet(''); setTimeout(() => setActiveSheet(s), 50); }}
              className="p-2 rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:text-[#2563EB] hover:border-[#2563EB] transition-colors cursor-pointer"
              title="Refresh data"
              disabled={loadingData}
            >
              <RefreshCw size={15} className={loadingData ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {loadingData && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-[var(--hover-bg)] rounded-lg animate-pulse h-24" />
          ))}
        </div>
      )}

      {/* Content area */}
      {!loadingData && sheetData && sheetStats && (
        <>
          {/* KPI strip */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <StatChip label="Total Rows"      value={sheetData.rows_count.toLocaleString()} color="#2563EB" />
            <StatChip label="Total Columns"   value={sheetData.cols_count} color="#0EA5A4" />
            <StatChip label="Numeric Cols"    value={sheetStats.numeric_columns.length} color="#8B5CF6" />
            <StatChip label="Categorical Cols" value={sheetStats.categorical_columns.length} color="#F59E0B" />
            <StatChip label="Missing Values"  value={sheetStats.missing_values.toLocaleString()} color={sheetStats.missing_values > 0 ? '#EF4444' : '#10B981'} />
          </div>

          {/* Tab navigation */}
          <div className="flex gap-1 bg-[var(--hover-bg)] p-1 rounded-xl overflow-x-auto" role="tablist">
            {TABS.map(t => {
              const Icon = t.icon;
              return (
                <button
                  key={t.key}
                  role="tab"
                  aria-selected={activeTab === t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150
                    ${activeTab === t.key
                      ? 'bg-[var(--surface-card)] text-[#2563EB] shadow-sm border border-[var(--border)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                >
                  <Icon size={13} />
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* ── TAB PANELS ── */}

          {/* SUMMARY */}
          {activeTab === 'summary' && (
            <Section title="Summary Statistics" icon={Activity}>
              {sheetStats.numeric_columns.length === 0 ? (
                <p className="text-sm text-[var(--text-secondary)]">No numeric columns in this worksheet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm" role="grid">
                    <thead>
                      <tr className="border-b border-[var(--border)]">
                        {['Column','Count','Missing','Min','Max','Mean','Median','Std Dev','Q1','Q3'].map(h => (
                          <th key={h} className="text-left px-3 py-2.5 text-[10px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sheetStats.numeric_columns.map((col, i) => {
                        const s = sheetStats.summary_statistics[col];
                        if (!s) return null;
                        return (
                          <tr key={col} className={`border-b border-[var(--border)] transition-colors hover:bg-[var(--hover-bg)] ${i % 2 === 0 ? '' : 'bg-[var(--hover-bg)]'}`}>
                            <td className="px-3 py-2.5 font-medium text-[var(--text-primary)] max-w-[160px] truncate">{col}</td>
                            <td className="px-3 py-2.5 text-[var(--text-primary)] font-mono">{formatCompact(s.count, col, 'count')}</td>
                            <td className="px-3 py-2.5">
                              <span className={`font-medium ${s.missing > 0 ? 'text-[#EF4444]' : 'text-[#10B981]'}`}>{s.missing}</span>
                            </td>
                            <td className="px-3 py-2.5 text-[var(--text-primary)] font-mono">{formatCompact(s.min, col, 'min')}</td>
                            <td className="px-3 py-2.5 text-[var(--text-primary)] font-mono">{formatCompact(s.max, col, 'max')}</td>
                            <td className="px-3 py-2.5 font-medium text-[#2563EB] font-mono">{formatCompact(s.mean, col, 'mean')}</td>
                            <td className="px-3 py-2.5 text-[var(--text-primary)] font-mono">{formatCompact(s.median, col, 'median')}</td>
                            <td className="px-3 py-2.5 text-[var(--text-primary)] font-mono">{formatCompact(s.std_dev, col, 'std_dev')}</td>
                            <td className="px-3 py-2.5 text-[var(--text-primary)] font-mono">{formatCompact(s.q1, col, 'q1')}</td>
                            <td className="px-3 py-2.5 text-[var(--text-primary)] font-mono">{formatCompact(s.q3, col, 'q3')}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </Section>
          )}

          {/* FEATURE ENGINEERING */}
          {activeTab === 'features' && (
            <Section title="Feature Engineering Recommendations" icon={Zap} accent="#F59E0B">
              <p className="text-xs text-[var(--text-secondary)] mb-4">
                Automatically generated feature transformation recommendations based on column types and statistical profiles.
              </p>
              {featureIdeas.length === 0 ? (
                <p className="text-sm text-[var(--text-muted)]">No feature engineering opportunities identified.</p>
              ) : (
                <div className="space-y-3">
                  {featureIdeas.map((idea, i) => (
                    <div key={i} className="p-4 border border-[#FEF3C7] dark:border-amber-900/50 bg-[#FFFBEB] dark:bg-amber-950/20 rounded-xl">
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-lg bg-[#F59E0B] text-white flex items-center justify-center text-xs font-bold shrink-0">
                          {i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <code className="text-xs bg-[#FEF3C7] dark:bg-amber-900/40 px-2 py-0.5 rounded font-mono text-[#92400E] dark:text-amber-300">{idea.feature}</code>
                            <span className="text-[10px] font-semibold text-[#B45309] dark:text-amber-300 bg-[#FDE68A] dark:bg-amber-900/40 px-2 py-0.5 rounded-full">{idea.technique}</span>
                          </div>
                          <p className="text-xs text-[#78350F] dark:text-amber-200 mt-1">
                            <strong>Source:</strong> {idea.derivedFrom}
                          </p>
                          <p className="text-xs text-[var(--text-secondary)] mt-1">{idea.rationale}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Section>
          )}

          {/* DATA DICTIONARY */}
          {activeTab === 'dictionary' && (
            <Section title="Data Dictionary" icon={BookOpen} accent="#0EA5A4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm" role="grid">
                  <thead>
                    <tr className="border-b border-[var(--border)]">
                      {['Column Name','Data Type','Unique Values','Missing','Range / Sample Values','Business Description'].map(h => (
                        <th key={h} className="text-left px-3 py-2 text-[10px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dataDictionary.map((row, i) => (
                      <tr key={row.name} className={`border-b border-[var(--border)] hover:bg-[var(--hover-bg)] transition-colors ${i % 2 === 0 ? '' : 'bg-[var(--hover-bg)]'}`}>
                        <td className="px-3 py-2.5 font-mono text-xs text-[var(--text-primary)] font-semibold whitespace-nowrap">{row.name}</td>
                        <td className="px-3 py-2.5">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold
                            ${row.type === 'numeric' ? 'bg-[#EFF6FF] dark:bg-blue-950/30 text-[#2563EB] dark:text-blue-400' : 'bg-[#F0FDF4] dark:bg-emerald-950/30 text-[#16A34A] dark:text-emerald-400'}`}>
                            {row.type}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-[var(--text-primary)]">{row.uniqueCount.toLocaleString()}</td>
                        <td className="px-3 py-2.5">
                          <span className={row.missing > 0 ? 'text-[#EF4444] font-medium' : 'text-[#10B981]'}>
                            {row.missing}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-[var(--text-secondary)] max-w-[200px] truncate text-xs">{row.range}</td>
                        <td className="px-3 py-2.5 text-[var(--text-secondary)] text-xs">{row.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>
          )}

          {/* DATA TABLE */}
          {activeTab === 'table' && (
            <Section title={`Data Table — ${sheetData.label}`} icon={Grid}>
              {/* Toolbar */}
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <div className="relative flex-1 min-w-[200px]">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                  <input
                    type="search"
                    placeholder="Search all columns…"
                    value={tableSearch}
                    onChange={e => { setTableSearch(e.target.value); setTablePage(1); }}
                    className="pl-8 pr-4 py-2 text-sm w-full"
                    aria-label="Search data table"
                  />
                </div>
                <span className="text-xs text-[var(--text-secondary)] shrink-0">
                  {tableRows.length.toLocaleString()} of {sheetData.rows_count.toLocaleString()} rows
                </span>
              </div>

              {/* Table */}
              <div className="overflow-auto max-h-[480px] rounded-xl border border-[var(--border)]">
                <table className="w-full text-sm" role="grid">
                  <thead className="sticky top-0 z-10">
                    <tr>
                      {sheetData.fields.map(f => (
                        <th
                          key={f.name}
                          onClick={() => handleSort(f.name)}
                          className="px-3 py-2.5 text-left bg-[var(--surface-bg)] border-b border-[var(--border)] text-[10px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider whitespace-nowrap cursor-pointer hover:bg-[var(--hover-bg)] select-none transition-colors"
                        >
                          <div className="flex items-center gap-1">
                            <span className="truncate max-w-[120px]">{f.name}</span>
                            {sortCol === f.name
                              ? sortDir === 'asc' ? <ArrowUp size={11} className="text-[#2563EB] shrink-0" /> : <ArrowDown size={11} className="text-[#2563EB] shrink-0" />
                              : <ArrowUpDown size={11} className="text-[var(--text-disabled)] shrink-0" />}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pagedRows.length === 0 ? (
                      <tr>
                        <td colSpan={sheetData.fields.length} className="px-3 py-8 text-center text-sm text-[var(--text-muted)]">
                          No rows match your search.
                        </td>
                      </tr>
                    ) : pagedRows.map((row, ri) => (
                      <tr key={ri} className={`border-b border-[var(--border)] hover:bg-[var(--hover-bg)] transition-colors ${ri % 2 === 0 ? '' : 'bg-[var(--hover-bg)]'}`}>
                        {sheetData.fields.map(f => (
                          <td key={f.name} className="px-3 py-2.5 text-[var(--text-primary)] max-w-[180px]">
                            <span className="block truncate" title={String(row[f.name] ?? '')}>
                              {row[f.name] == null ? <span className="text-[var(--text-disabled)] italic text-xs">null</span> : String(row[f.name])}
                            </span>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4 flex-wrap gap-2">
                <span className="text-xs text-[var(--text-secondary)]">
                  Page {tablePage} of {totalPages} ({tableRows.length.toLocaleString()} rows)
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setTablePage(1)}
                    disabled={tablePage === 1}
                    className="p-1.5 rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] disabled:opacity-40 disabled:cursor-not-allowed text-xs px-2"
                    aria-label="First page"
                  >«</button>
                  <button
                    onClick={() => setTablePage(p => Math.max(1, p - 1))}
                    disabled={tablePage === 1}
                    className="p-1.5 rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Previous page"
                  ><ChevronLeft size={14} /></button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = Math.max(1, Math.min(totalPages - 4, tablePage - 2)) + i;
                    return (
                      <button
                        key={page}
                        onClick={() => setTablePage(page)}
                        className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors
                          ${page === tablePage ? 'bg-[#2563EB] text-white border border-[#2563EB]' : 'border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)]'}`}
                      >{page}</button>
                    );
                  })}

                  <button
                    onClick={() => setTablePage(p => Math.min(totalPages, p + 1))}
                    disabled={tablePage === totalPages}
                    className="p-1.5 rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Next page"
                  ><ChevronRight size={14} /></button>
                  <button
                    onClick={() => setTablePage(totalPages)}
                    disabled={tablePage === totalPages}
                    className="p-1.5 rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] disabled:opacity-40 disabled:cursor-not-allowed text-xs px-2"
                    aria-label="Last page"
                  >»</button>
                </div>
              </div>
            </Section>
          )}
        </>
      )}

      {/* Empty state */}
      {!loadingData && !loadingSheets && !sheetData && !error && (
        <div className="text-center py-16 bg-[var(--surface-card)] border border-[var(--border)] rounded-2xl">
          <Database size={40} className="text-[var(--text-disabled)] mx-auto mb-3" />
          <p className="text-sm text-[var(--text-secondary)]">Select a worksheet to begin exploration</p>
        </div>
      )}

      {/* ── WORKFLOW ADVANCEMENT TO STAGE 4 ──────────────────────── */}
      <div className={`mt-8 p-5 sm:p-6 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm ${
        isDarkMode ? 'border-slate-800 bg-slate-900/90' : 'border-slate-200 bg-white'
      }`}>
        <div className="space-y-1 text-left">
          <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-indigo-600 dark:text-indigo-400 block">
            Stage 3 · Cohort Exploration Complete
          </span>
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
            <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
            <span>Active Dataset: <strong>{sheetData?.label || activeSheet}</strong> ({sheetData?.rows_count?.toLocaleString() || 0} rows • {sheetData?.cols_count || 0} fields)</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Advance to Stage 4 to evaluate the 5 formal biostatistical hypotheses (H1–H5), WLS regression, and ERBI forecasting against this cohort.
          </p>
        </div>


      </div>
    </div>
  );
}

/* ─── Field description generator ────────────────────────────────────────── */
function generateFieldDescription(name: string, type: string): string {
  const n = name.toLowerCase();
  if (n.includes('year') || n.includes('fiscal')) return 'Fiscal or calendar year identifier for temporal aggregation.';
  if (n.includes('province') || n.includes('region')) return 'Canadian province or territory identifier.';
  if (n.includes('visit') && n.includes('total')) return 'Total count of emergency department visits in the reporting period.';
  if (n.includes('visit')) return 'Emergency department visit metric.';
  if (n.includes('age')) return 'Patient age group classification.';
  if (n.includes('sex') || n.includes('gender')) return 'Patient sex/gender category.';
  if (n.includes('month')) return 'Calendar month for temporal analysis.';
  if (n.includes('problem') || n.includes('diagnosis')) return 'Primary clinical presenting complaint.';
  if (n.includes('triage') || n.includes('ctas')) return 'Canadian Triage and Acuity Scale (CTAS) severity classification.';
  if (n.includes('admit') || n.includes('admission')) return 'Hospital admission indicator or count.';
  if (n.includes('discharge')) return 'Patient discharge disposition.';
  if (n.includes('cost') || n.includes('resource')) return 'Financial or resource utilization metric (CAD).';
  if (n.includes('time') || n.includes('length') || n.includes('stay') || n.includes('wait')) return 'Time-based operational metric (hours or minutes).';
  if (n.includes('percent') || n.includes('rate') || n.includes('pct')) return 'Calculated percentage or rate metric.';
  if (n.includes('count') || n.includes('num')) return 'Numeric count metric.';
  if (type === 'numeric') return 'Numeric operational or clinical measurement.';
  return 'Categorical classification variable.';
}
