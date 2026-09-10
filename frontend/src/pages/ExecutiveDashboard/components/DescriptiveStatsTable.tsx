import React, { useState, useRef } from 'react';
import { fmtK, fmtNum } from './formatters';
import DownloadVisualButton from './DownloadVisualButton';

interface DescriptiveStatsTableProps {
  data: any[];
  fields: any[];
  isDarkMode: boolean;
}

const toNums = (arr: any[], col: string) =>
  arr.map(r => Number(r[col])).filter(v => !isNaN(v));

const calcMean = (v: number[]) => (v.length ? v.reduce((a, b) => a + b, 0) / v.length : 0);

const calcMedian = (v: number[]) => {
  if (!v.length) return 0;
  const s = [...v].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

const calcStddev = (v: number[], m: number) =>
  v.length < 2 ? 0 : Math.sqrt(v.reduce((s, x) => s + (x - m) ** 2, 0) / (v.length - 1));

export default function DescriptiveStatsTable({
  data,
  fields,
  isDarkMode,
}: DescriptiveStatsTableProps) {
  const [overrideTheme, setOverrideTheme] = useState<'light' | 'dark' | null>(null);
  const dark = overrideTheme !== null ? overrideTheme === 'dark' : isDarkMode;
  const cardRef = useRef<HTMLDivElement>(null);
  const [useCompact, setUseCompact] = useState<boolean>(true);

  const numCols = fields.filter(f => f.type === 'numeric').map(f => f.name as string);

  const descStats = numCols.slice(0, 6).map(col => {
    const v = toNums(data, col).sort((a, b) => a - b);
    const m = calcMean(v);
    const med = calcMedian(v);
    const sd = calcStddev(v, m);
    const q1 = v[Math.floor(v.length * 0.25)] ?? 0;
    const q3 = v[Math.floor(v.length * 0.75)] ?? 0;
    return {
      col,
      n: v.length,
      mean: m,
      median: med,
      stddev: sd,
      min: v[0] ?? 0,
      max: v[v.length - 1] ?? 0,
      q1,
      q3,
      iqr: q3 - q1,
      skew: sd > 0 ? ((m - med) / sd) * 3 : 0,
    };
  });

  const isYearCol = (colName: string) => /year|fy/i.test(colName);

  const renderVal = (val: number, dp: number = 2, colName: string = '') => {
    const isYear = isYearCol(colName) && Number.isInteger(val) && val >= 1900 && val <= 2100;
    const formatted = useCompact
      ? fmtK(val, dp, { isYear })
      : isYear
      ? String(val)
      : fmtNum(val, dp);

    return (
      <span
        title={`Exact: ${isYear ? String(val) : fmtNum(val, 2)}`}
        className="cursor-help transition-colors hover:text-blue-500 dark:hover:text-blue-400"
      >
        {formatted}
      </span>
    );
  };

  return (
    <div
      ref={cardRef}
      className={`rounded-2xl border p-6 shadow-xs space-y-4 transition-colors ${
        dark ? 'bg-[#131f37] border-[#1e2d4a]' : 'bg-white border-slate-200'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#0F4C81] dark:text-[#3B82F6] block">
            Descriptive Parametric &amp; Non-Parametric Metrics
          </span>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            Distributional Statistics for Key Numeric Variables
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Mean, Median, Dispersion, Interquartile Range, and Pearson Skewness
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setUseCompact(!useCompact)}
            className={`text-[9.5px] font-bold font-mono px-2.5 py-1 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 select-none ${
              useCompact
                ? 'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20'
                : 'bg-slate-100 dark:bg-[#182640] border-slate-200 dark:border-[#1e2d4a] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Toggle between standardized k, M, B notation and exact numbers"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${useCompact ? 'bg-blue-500 animate-pulse' : 'bg-slate-400'}`} />
            {useCompact ? 'Standard: k, M, B' : 'Format: Exact'}
          </button>
          <span
            className={`text-[9px] font-bold px-2.5 py-1 rounded-md border font-mono ${
              dark ? 'bg-[#182640] border-[#1e2d4a] text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
            title={`${fmtNum(data.length)} records`}
          >
            n = {useCompact ? fmtK(data.length) : fmtNum(data.length)} records
          </span>

          <DownloadVisualButton
            cardRef={cardRef}
            visualTitle="Descriptive_Distributional_Statistics"
            isDarkMode={dark}
            onSetTheme={async (theme) => {
              setOverrideTheme(theme);
              await new Promise((r) => setTimeout(r, 120));
            }}
            onResetTheme={() => setOverrideTheme(null)}
          />
        </div>
      </div>

      {descStats.length === 0 ? (
        <p className="text-center py-6 text-xs text-slate-400">No numeric columns detected in the active dataset.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-300 dark:border-slate-700/80 shadow-xs bg-[var(--surface-card)]">
          <table className="w-full text-[11px] border-collapse" role="grid">
            <thead>
              <tr className={dark ? 'bg-[#0f172a]' : 'bg-slate-100'}>
                {['Variable', 'N', 'Mean', 'Median', 'Std Dev', 'Min', 'Max', 'Q1', 'Q3', 'IQR', 'Skewness'].map((h, hIdx, arr) => (
                  <th
                    key={h}
                    className={`px-3 py-2.5 text-center text-[9.5px] font-bold uppercase tracking-wider border-b-2 ${
                      dark ? 'border-slate-700 text-slate-300' : 'border-slate-300 text-slate-600'
                    } ${hIdx < arr.length - 1 ? (dark ? 'border-r border-slate-700' : 'border-r border-slate-300') : ''}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {descStats.map((row, i) => (
                <tr
                  key={row.col}
                  className={`transition-colors border-b ${
                    dark ? 'border-slate-800' : 'border-slate-200'
                  } ${
                    i % 2 === 0
                      ? dark
                        ? 'bg-[#0f1d33]'
                        : 'bg-white'
                      : dark
                      ? 'bg-[#131f37]'
                      : 'bg-slate-50/60'
                  } hover:bg-blue-50/40 dark:hover:bg-blue-950/30`}
                >
                  <td
                    className={`px-3 py-2 font-semibold text-center max-w-[140px] truncate ${
                      dark ? 'border-r border-slate-800 text-slate-200' : 'border-r border-slate-200 text-slate-800'
                    }`}
                  >
                    {row.col}
                  </td>
                  <td className={`px-3 py-2 font-mono text-center ${dark ? 'border-r border-slate-800 text-slate-300' : 'border-r border-slate-200 text-slate-700'}`}>
                    {renderVal(row.n, 1, 'n')}
                  </td>
                  <td className={`px-3 py-2 font-mono text-center ${dark ? 'border-r border-slate-800 text-slate-300' : 'border-r border-slate-200 text-slate-700'}`}>
                    {renderVal(row.mean, 2, row.col)}
                  </td>
                  <td className={`px-3 py-2 font-mono text-center font-bold ${dark ? 'border-r border-slate-800 text-cyan-400' : 'border-r border-slate-200 text-cyan-700'}`}>
                    {renderVal(row.median, 2, row.col)}
                  </td>
                  <td className={`px-3 py-2 font-mono text-center ${dark ? 'border-r border-slate-800 text-slate-300' : 'border-r border-slate-200 text-slate-700'}`}>
                    {renderVal(row.stddev, 2, row.col)}
                  </td>
                  <td className={`px-3 py-2 font-mono text-center ${dark ? 'border-r border-slate-800 text-slate-300' : 'border-r border-slate-200 text-slate-700'}`}>
                    {renderVal(row.min, 1, row.col)}
                  </td>
                  <td className={`px-3 py-2 font-mono text-center ${dark ? 'border-r border-slate-800 text-slate-300' : 'border-r border-slate-200 text-slate-700'}`}>
                    {renderVal(row.max, 2, row.col)}
                  </td>
                  <td className={`px-3 py-2 font-mono text-center ${dark ? 'border-r border-slate-800 text-slate-300' : 'border-r border-slate-200 text-slate-700'}`}>
                    {renderVal(row.q1, 1, row.col)}
                  </td>
                  <td className={`px-3 py-2 font-mono text-center ${dark ? 'border-r border-slate-800 text-slate-300' : 'border-r border-slate-200 text-slate-700'}`}>
                    {renderVal(row.q3, 2, row.col)}
                  </td>
                  <td className={`px-3 py-2 font-mono text-center ${dark ? 'border-r border-slate-800 text-slate-300' : 'border-r border-slate-200 text-slate-700'}`}>
                    {renderVal(row.iqr, 2, row.col)}
                  </td>
                  <td
                    className={`px-3 py-2 font-mono text-center font-bold ${
                      Math.abs(row.skew) > 1 ? 'text-amber-500' : dark ? 'text-slate-300' : 'text-slate-700'
                    }`}
                  >
                    <span title={`Exact Pearson Skewness: ${fmtNum(row.skew, 4)}`}>
                      {fmtNum(row.skew, 3)}
                      {Math.abs(row.skew) > 1 && (
                        <span className="ml-1 text-[8px]">{row.skew > 0 ? '▲ Right' : '▼ Left'}</span>
                      )}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div
        className={`p-3 rounded-xl border text-[10px] leading-relaxed ${
          dark ? 'bg-[#182640] border-[#1e2d4a] text-slate-300' : 'bg-amber-50 border-amber-100 text-amber-800'
        }`}
      >
        <strong>Methodological Justification:</strong> Emergency department stay durations exhibit severe positive skewness (skewness &gt; 0.5), validating the selection of non-parametric ranks (Kruskal-Wallis, Mann-Whitney U) and median-based central tendency metrics across all primary capstone hypotheses. Numbers are standardized to <strong>k (thousands)</strong>, <strong>M (millions)</strong>, and <strong>B (billions)</strong> with calendar year protection (hover any cell for exact value).
      </div>
    </div>
  );
}
