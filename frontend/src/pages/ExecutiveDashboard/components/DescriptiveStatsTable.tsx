import React from 'react';
import { fmtNum } from './formatters';

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
  const dark = isDarkMode;

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

  return (
    <div
      className={`rounded-2xl border p-6 shadow-xs space-y-4 transition-colors ${
        dark ? 'bg-[#131f37] border-[#1e2d4a]' : 'bg-white border-slate-200'
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#0F4C81] dark:text-[#3B82F6] block">
            Descriptive Parametric &amp; Non-Parametric Metrics
          </span>
          <h3 className={`text-sm font-extrabold ${dark ? 'text-white' : 'text-slate-900'}`}>
            Distributional Statistics for Key Numeric Variables
          </h3>
          <p className="text-[10px] text-slate-400">Mean, Median, Dispersion, Interquartile Range, and Pearson Skewness</p>
        </div>
        <span
          className={`text-[9px] font-bold px-2.5 py-1 rounded-md border font-mono ${
            dark ? 'bg-[#182640] border-[#1e2d4a] text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'
          }`}
        >
          n = {fmtNum(data.length)} records
        </span>
      </div>

      {descStats.length === 0 ? (
        <p className="text-center py-6 text-xs text-slate-400">No numeric columns detected in the active dataset.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-[11px] border-collapse">
            <thead>
              <tr className={dark ? 'bg-[#182640]' : 'bg-slate-50'}>
                {['Variable', 'N', 'Mean', 'Median', 'Std Dev', 'Min', 'Max', 'Q1', 'Q3', 'IQR', 'Skewness'].map(h => (
                  <th
                    key={h}
                    className={`px-3 py-2 text-left text-[9px] font-bold uppercase tracking-wider border-b ${
                      dark ? 'border-[#1e2d4a] text-slate-400' : 'border-slate-200 text-slate-500'
                    }`}
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
                  className={`transition ${
                    i % 2 === 0
                      ? dark
                        ? 'bg-[#0f1d33]'
                        : 'bg-white'
                      : dark
                      ? 'bg-[#131f37]'
                      : 'bg-slate-50/50'
                  }`}
                >
                  <td
                    className={`px-3 py-2 font-semibold border-b max-w-[140px] truncate ${
                      dark ? 'border-[#1e2d4a] text-slate-200' : 'border-slate-100 text-slate-800'
                    }`}
                  >
                    {row.col}
                  </td>
                  <td className={`px-3 py-2 font-mono border-b ${dark ? 'border-[#1e2d4a] text-slate-300' : 'border-slate-100 text-slate-700'}`}>
                    {fmtNum(row.n)}
                  </td>
                  <td className={`px-3 py-2 font-mono border-b ${dark ? 'border-[#1e2d4a] text-slate-300' : 'border-slate-100 text-slate-700'}`}>
                    {fmtNum(row.mean, 2)}
                  </td>
                  <td className={`px-3 py-2 font-mono border-b font-bold ${dark ? 'border-[#1e2d4a] text-cyan-400' : 'border-slate-100 text-cyan-700'}`}>
                    {fmtNum(row.median, 2)}
                  </td>
                  <td className={`px-3 py-2 font-mono border-b ${dark ? 'border-[#1e2d4a] text-slate-300' : 'border-slate-100 text-slate-700'}`}>
                    {fmtNum(row.stddev, 2)}
                  </td>
                  <td className={`px-3 py-2 font-mono border-b ${dark ? 'border-[#1e2d4a] text-slate-300' : 'border-slate-100 text-slate-700'}`}>
                    {fmtNum(row.min, 1)}
                  </td>
                  <td className={`px-3 py-2 font-mono border-b ${dark ? 'border-[#1e2d4a] text-slate-300' : 'border-slate-100 text-slate-700'}`}>
                    {fmtNum(row.max, 1)}
                  </td>
                  <td className={`px-3 py-2 font-mono border-b ${dark ? 'border-[#1e2d4a] text-slate-300' : 'border-slate-100 text-slate-700'}`}>
                    {fmtNum(row.q1, 1)}
                  </td>
                  <td className={`px-3 py-2 font-mono border-b ${dark ? 'border-[#1e2d4a] text-slate-300' : 'border-slate-100 text-slate-700'}`}>
                    {fmtNum(row.q3, 1)}
                  </td>
                  <td className={`px-3 py-2 font-mono border-b ${dark ? 'border-[#1e2d4a] text-slate-300' : 'border-slate-100 text-slate-700'}`}>
                    {fmtNum(row.iqr, 1)}
                  </td>
                  <td
                    className={`px-3 py-2 font-mono border-b font-bold ${
                      dark ? 'border-[#1e2d4a]' : 'border-slate-100'
                    } ${Math.abs(row.skew) > 1 ? 'text-amber-500' : dark ? 'text-slate-300' : 'text-slate-700'}`}
                  >
                    {fmtNum(row.skew, 3)}
                    {Math.abs(row.skew) > 1 && (
                      <span className="ml-1 text-[8px]">{row.skew > 0 ? '▲ Right' : '▼ Left'}</span>
                    )}
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
        <strong>Methodological Justification:</strong> Emergency department stay durations exhibit severe positive skewness (skewness &gt; 0.5), validating the selection of non-parametric ranks (Kruskal-Wallis, Mann-Whitney U) and median-based central tendency metrics across all primary capstone hypotheses.
      </div>
    </div>
  );
}
