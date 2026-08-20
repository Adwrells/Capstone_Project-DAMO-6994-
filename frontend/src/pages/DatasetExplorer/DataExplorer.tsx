/**
 * Healthcare Analytics Platform — Dataset Explorer
 * Loads Explanatory_and_Predictive_ED_Analytics_Dataset.xlsx dynamically.
 * All worksheets selectable. All analysis panels update on sheet change.
 * No hardcoded data. No page reload.
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Database, ChevronDown, RefreshCw, Download, Search, TrendingUp,
  BarChart2, AlertTriangle, Grid, BookOpen, Filter, ArrowUpDown,
  ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Info, Zap, Activity,
  Eye, FileSpreadsheet, CheckCircle2, XCircle
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
  <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm overflow-hidden">
    <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${accent}18` }}>
        <Icon size={16} style={{ color: accent }} />
      </div>
      <h3 className="text-sm font-semibold text-[#111827]">{title}</h3>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

/** Stat chip */
const StatChip = ({ label, value, color = '#2563EB' }: { label: string; value: string | number; color?: string }) => (
  <div className="flex flex-col gap-0.5 px-4 py-3 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB]">
    <span className="text-[11px] font-medium text-[#6B7280] uppercase tracking-wider">{label}</span>
    <span className="text-lg font-bold" style={{ color }}>{String(value)}</span>
  </div>
);

/** Loading skeleton */
const Skeleton = ({ className = '' }: { className?: string }) => (
  <div className={`bg-[#F3F4F6] rounded-lg animate-pulse ${className}`} />
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

  if (bins.length === 0) return <p className="text-sm text-[#6B7280]">Insufficient numeric data.</p>;

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={bins} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
        <XAxis dataKey="range" tick={{ fontSize: 10, fill: '#9CA3AF' }} interval="preserveStartEnd" />
        <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} />
        <Tooltip
          contentStyle={{ fontSize: 12, border: '1px solid #E5E7EB', borderRadius: 8 }}
          cursor={{ fill: '#EFF6FF' }}
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

  if (freq.length === 0) return <p className="text-sm text-[#6B7280]">No data.</p>;

  return (
    <ResponsiveContainer width="100%" height={Math.max(160, freq.length * 28)}>
      <BarChart data={freq} layout="vertical" margin={{ top: 4, right: 40, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 10, fill: '#9CA3AF' }} />
        <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 10, fill: '#374151' }} />
        <Tooltip
          contentStyle={{ fontSize: 12, border: '1px solid #E5E7EB', borderRadius: 8 }}
          formatter={(value: number) => [value.toLocaleString(), 'Count']}
        />
        <Bar dataKey="count" radius={[0, 3, 3, 0]}>
          {freq.map((_, i) => <Cell key={i} fill={CHART_COLOURS[i % CHART_COLOURS.length]} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ─── Main Component ──────────────────────────────────────────────────────── */
interface DataExplorerProps {
  fields?: any[];
  data?: any[];
  onNavigateNext?: () => void;
}

type Tab = 'summary' | 'features' | 'dictionary' | 'table';

export default function DataExplorer({ onNavigateNext }: DataExplorerProps) {
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

  /* ── Load sheet names on mount ── */
  useEffect(() => {
    setLoadingSheets(true);
    apiFetch('/api/dataset/sheets')
      .then((names: string[]) => {
        setSheets(names);
        if (names.length > 0) setActiveSheet(names[0]);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoadingSheets(false));
  }, []);

  /* ── Load sheet data + stats when activeSheet changes ── */
  useEffect(() => {
    if (!activeSheet) return;
    setLoadingData(true);
    setError(null);
    setSheetData(null);
    setSheetStats(null);
    setTablePage(1);
    setTableSearch('');
    setSortCol('');

    Promise.all([
      apiFetch(`/api/dataset/${encodeURIComponent(activeSheet)}`),
      apiFetch(`/api/dataset/statistics/${encodeURIComponent(activeSheet)}`),
    ])
      .then(([dataRes, statsRes]) => {
        setSheetData(dataRes);
        setSheetStats(statsRes);
        const numCols = dataRes.fields.filter((f: Field) => f.type === 'numeric').map((f: Field) => f.name);
        const catCols = dataRes.fields.filter((f: Field) => f.type === 'categorical').map((f: Field) => f.name);
        setSelectedNumCol(numCols[0] || '');
        setSelectedCatCol(catCols[0] || '');
      })
      .catch(e => setError(e.message))
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

  /* ── Export CSV ── */
  const exportCSV = useCallback(() => {
    if (!sheetData) return;
    const headers = sheetData.fields.map(f => f.name).join(',');
    const rows = tableRows.map(r =>
      sheetData.fields.map(f => {
        const v = String(r[f.name] ?? '');
        return v.includes(',') || v.includes('"') || v.includes('\n')
          ? `"${v.replace(/"/g, '""')}"` : v;
      }).join(',')
    );
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${activeSheet}_export.csv`; a.click();
    URL.revokeObjectURL(url);
  }, [sheetData, tableRows, activeSheet]);

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
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[#111827] tracking-tight">Dataset Explorer</h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Capstone Workbook — <span className="font-medium">Explanatory_and_Predictive_ED_Analytics_Dataset.xlsx</span>
          </p>
        </div>
        {onNavigateNext && (
          <button onClick={onNavigateNext} className="btn-primary text-sm shrink-0">
            Next: Statistical Analysis →
          </button>
        )}
      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          <XCircle size={18} className="shrink-0" />
          <div><strong>Failed to load dataset:</strong> {error}</div>
        </div>
      )}

      {/* Workbook Status + Sheet Selector */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-4 flex-wrap">
          {/* File badge */}
          <div className="flex items-center gap-2.5 px-3 py-2 bg-[#EFF6FF] border border-[#DBEAFE] rounded-xl">
            <FileSpreadsheet size={16} className="text-[#2563EB]" />
            <span className="text-xs font-semibold text-[#1D4ED8]">Excel Workbook Loaded</span>
          </div>

          {/* Sheet selector */}
          <div className="relative">
            <button
              onClick={() => setSheetDropOpen(o => !o)}
              disabled={loadingSheets || sheets.length === 0}
              aria-haspopup="listbox"
              aria-expanded={sheetDropOpen}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-sm font-medium text-[#111827] hover:border-[#2563EB] transition-colors min-w-[240px] justify-between disabled:opacity-50"
            >
              <div className="flex items-center gap-2">
                <Database size={15} className="text-[#6B7280]" />
                <span>{loadingSheets ? 'Loading sheets…' : (activeSheet || 'Select worksheet')}</span>
              </div>
              <ChevronDown size={14} className={`text-[#9CA3AF] transition-transform ${sheetDropOpen ? 'rotate-180' : ''}`} />
            </button>

            {sheetDropOpen && sheets.length > 0 && (
              <div
                role="listbox"
                className="absolute top-full mt-1 left-0 w-full bg-white border border-[#E5E7EB] rounded-xl shadow-lg z-30 overflow-hidden"
              >
                {sheets.map(s => (
                  <button
                    key={s}
                    role="option"
                    aria-selected={s === activeSheet}
                    onClick={() => { setActiveSheet(s); setSheetDropOpen(false); setActiveTab('summary'); }}
                    className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left transition-colors
                      ${s === activeSheet ? 'bg-[#EFF6FF] text-[#2563EB] font-semibold' : 'text-[#374151] hover:bg-[#F9FAFB]'}`}
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
              <span className="text-xs text-[#6B7280]">
                <strong className="text-[#111827]">{sheetData.rows_count.toLocaleString()}</strong> rows ×{' '}
                <strong className="text-[#111827]">{sheetData.cols_count}</strong> columns
              </span>
              {sheetStats && (
                <span className="text-xs text-[#6B7280]">
                  · <strong className="text-[#111827]">{sheetStats.missing_values}</strong> missing
                  · {sheetStats.memory_usage}
                </span>
              )}
            </div>
          )}

          {/* Refresh */}
          <button
            onClick={() => { const s = activeSheet; setActiveSheet(''); setTimeout(() => setActiveSheet(s), 50); }}
            className="ml-auto p-2 rounded-lg border border-[#E5E7EB] text-[#6B7280] hover:text-[#2563EB] hover:border-[#2563EB] transition-colors"
            title="Refresh data"
            disabled={loadingData}
          >
            <RefreshCw size={15} className={loadingData ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Loading state */}
      {loadingData && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-[#F3F4F6] rounded-lg animate-pulse h-24" />
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
          <div className="flex gap-1 bg-[#F3F4F6] p-1 rounded-xl overflow-x-auto" role="tablist">
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
                      ? 'bg-white text-[#2563EB] shadow-sm border border-[#E5E7EB]'
                      : 'text-[#6B7280] hover:text-[#374151]'}`}
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
                <p className="text-sm text-[#6B7280]">No numeric columns in this worksheet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm" role="grid">
                    <thead>
                      <tr className="border-b border-[#E5E7EB]">
                        {['Column','Count','Missing','Min','Max','Mean','Median','Std Dev','Q1','Q3'].map(h => (
                          <th key={h} className="text-left px-3 py-2.5 text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sheetStats.numeric_columns.map((col, i) => {
                        const s = sheetStats.summary_statistics[col];
                        if (!s) return null;
                        return (
                          <tr key={col} className={`border-b border-[#F3F4F6] transition-colors hover:bg-[#F9FAFB] ${i % 2 === 0 ? '' : 'bg-[#FAFAFA]'}`}>
                            <td className="px-3 py-2.5 font-medium text-[#111827] max-w-[160px] truncate">{col}</td>
                            <td className="px-3 py-2.5 text-[#374151] font-mono">{formatCompact(s.count, col, 'count')}</td>
                            <td className="px-3 py-2.5">
                              <span className={`font-medium ${s.missing > 0 ? 'text-[#EF4444]' : 'text-[#10B981]'}`}>{s.missing}</span>
                            </td>
                            <td className="px-3 py-2.5 text-[#374151] font-mono">{formatCompact(s.min, col, 'min')}</td>
                            <td className="px-3 py-2.5 text-[#374151] font-mono">{formatCompact(s.max, col, 'max')}</td>
                            <td className="px-3 py-2.5 font-medium text-[#2563EB] font-mono">{formatCompact(s.mean, col, 'mean')}</td>
                            <td className="px-3 py-2.5 text-[#374151] font-mono">{formatCompact(s.median, col, 'median')}</td>
                            <td className="px-3 py-2.5 text-[#374151] font-mono">{formatCompact(s.std_dev, col, 'std_dev')}</td>
                            <td className="px-3 py-2.5 text-[#374151] font-mono">{formatCompact(s.q1, col, 'q1')}</td>
                            <td className="px-3 py-2.5 text-[#374151] font-mono">{formatCompact(s.q3, col, 'q3')}</td>
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
              <p className="text-xs text-[#6B7280] mb-4">
                Automatically generated feature transformation recommendations based on column types and statistical profiles.
              </p>
              {featureIdeas.length === 0 ? (
                <p className="text-sm text-[#9CA3AF]">No feature engineering opportunities identified.</p>
              ) : (
                <div className="space-y-3">
                  {featureIdeas.map((idea, i) => (
                    <div key={i} className="p-4 border border-[#FEF3C7] bg-[#FFFBEB] rounded-xl">
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-lg bg-[#F59E0B] text-white flex items-center justify-center text-xs font-bold shrink-0">
                          {i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <code className="text-xs bg-[#FEF3C7] px-2 py-0.5 rounded font-mono text-[#92400E]">{idea.feature}</code>
                            <span className="text-[10px] font-semibold text-[#B45309] bg-[#FDE68A] px-2 py-0.5 rounded-full">{idea.technique}</span>
                          </div>
                          <p className="text-xs text-[#78350F] mt-1">
                            <strong>Source:</strong> {idea.derivedFrom}
                          </p>
                          <p className="text-xs text-[#6B7280] mt-1">{idea.rationale}</p>
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
                    <tr className="border-b border-[#E5E7EB]">
                      {['Column Name','Data Type','Unique Values','Missing','Range / Sample Values','Business Description'].map(h => (
                        <th key={h} className="text-left px-3 py-2 text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dataDictionary.map((row, i) => (
                      <tr key={row.name} className={`border-b border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors ${i % 2 === 0 ? '' : 'bg-[#FAFAFA]'}`}>
                        <td className="px-3 py-2.5 font-mono text-xs text-[#111827] font-semibold whitespace-nowrap">{row.name}</td>
                        <td className="px-3 py-2.5">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold
                            ${row.type === 'numeric' ? 'bg-[#EFF6FF] text-[#2563EB]' : 'bg-[#F0FDF4] text-[#16A34A]'}`}>
                            {row.type}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-[#374151]">{row.uniqueCount.toLocaleString()}</td>
                        <td className="px-3 py-2.5">
                          <span className={row.missing > 0 ? 'text-[#EF4444] font-medium' : 'text-[#10B981]'}>
                            {row.missing}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-[#6B7280] max-w-[200px] truncate text-xs">{row.range}</td>
                        <td className="px-3 py-2.5 text-[#6B7280] text-xs">{row.description}</td>
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
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                  <input
                    type="search"
                    placeholder="Search all columns…"
                    value={tableSearch}
                    onChange={e => { setTableSearch(e.target.value); setTablePage(1); }}
                    className="pl-8 pr-4 py-2 text-sm w-full"
                    aria-label="Search data table"
                  />
                </div>
                <span className="text-xs text-[#6B7280] shrink-0">
                  {tableRows.length.toLocaleString()} of {sheetData.rows_count.toLocaleString()} rows
                </span>
                <button onClick={exportCSV} className="btn-secondary text-xs gap-1.5 px-3 h-9 shrink-0">
                  <Download size={13} /> Export CSV
                </button>
              </div>

              {/* Table */}
              <div className="overflow-auto max-h-[480px] rounded-xl border border-[#E5E7EB]">
                <table className="w-full text-sm" role="grid">
                  <thead className="sticky top-0 z-10">
                    <tr>
                      {sheetData.fields.map(f => (
                        <th
                          key={f.name}
                          onClick={() => handleSort(f.name)}
                          className="px-3 py-2.5 text-left bg-[#F8FAFC] border-b border-[#E5E7EB] text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider whitespace-nowrap cursor-pointer hover:bg-[#F1F5F9] select-none transition-colors"
                        >
                          <div className="flex items-center gap-1">
                            <span className="truncate max-w-[120px]">{f.name}</span>
                            {sortCol === f.name
                              ? sortDir === 'asc' ? <ArrowUp size={11} className="text-[#2563EB] shrink-0" /> : <ArrowDown size={11} className="text-[#2563EB] shrink-0" />
                              : <ArrowUpDown size={11} className="text-[#D1D5DB] shrink-0" />}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pagedRows.length === 0 ? (
                      <tr>
                        <td colSpan={sheetData.fields.length} className="px-3 py-8 text-center text-sm text-[#9CA3AF]">
                          No rows match your search.
                        </td>
                      </tr>
                    ) : pagedRows.map((row, ri) => (
                      <tr key={ri} className={`border-b border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors ${ri % 2 === 0 ? '' : 'bg-[#FAFAFA]'}`}>
                        {sheetData.fields.map(f => (
                          <td key={f.name} className="px-3 py-2.5 text-[#374151] max-w-[180px]">
                            <span className="block truncate" title={String(row[f.name] ?? '')}>
                              {row[f.name] == null ? <span className="text-[#D1D5DB] italic text-xs">null</span> : String(row[f.name])}
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
                <span className="text-xs text-[#6B7280]">
                  Page {tablePage} of {totalPages} ({tableRows.length.toLocaleString()} rows)
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setTablePage(1)}
                    disabled={tablePage === 1}
                    className="p-1.5 rounded-lg border border-[#E5E7EB] text-[#6B7280] hover:bg-[#F9FAFB] disabled:opacity-40 disabled:cursor-not-allowed text-xs px-2"
                    aria-label="First page"
                  >«</button>
                  <button
                    onClick={() => setTablePage(p => Math.max(1, p - 1))}
                    disabled={tablePage === 1}
                    className="p-1.5 rounded-lg border border-[#E5E7EB] text-[#6B7280] hover:bg-[#F9FAFB] disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Previous page"
                  ><ChevronLeft size={14} /></button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = Math.max(1, Math.min(totalPages - 4, tablePage - 2)) + i;
                    return (
                      <button
                        key={page}
                        onClick={() => setTablePage(page)}
                        className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors
                          ${page === tablePage ? 'bg-[#2563EB] text-white border border-[#2563EB]' : 'border border-[#E5E7EB] text-[#374151] hover:bg-[#F9FAFB]'}`}
                      >{page}</button>
                    );
                  })}

                  <button
                    onClick={() => setTablePage(p => Math.min(totalPages, p + 1))}
                    disabled={tablePage === totalPages}
                    className="p-1.5 rounded-lg border border-[#E5E7EB] text-[#6B7280] hover:bg-[#F9FAFB] disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Next page"
                  ><ChevronRight size={14} /></button>
                  <button
                    onClick={() => setTablePage(totalPages)}
                    disabled={tablePage === totalPages}
                    className="p-1.5 rounded-lg border border-[#E5E7EB] text-[#6B7280] hover:bg-[#F9FAFB] disabled:opacity-40 disabled:cursor-not-allowed text-xs px-2"
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
        <div className="text-center py-16 bg-white border border-[#E5E7EB] rounded-2xl">
          <Database size={40} className="text-[#D1D5DB] mx-auto mb-3" />
          <p className="text-sm text-[#6B7280]">Select a worksheet to begin exploration</p>
        </div>
      )}
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
