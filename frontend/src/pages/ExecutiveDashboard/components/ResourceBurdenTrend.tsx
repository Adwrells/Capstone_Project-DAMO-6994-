import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { TrendingUp, ShieldCheck } from 'lucide-react';
import { fmtK } from './formatters';

interface ResourceBurdenTrendProps {
  isDarkMode: boolean;
}

// 19-Year historical ERBI points + 2-year forecast
const ERBI_LONGITUDINAL_DATA = [
  { fy: '2003-04', hist: 4.21, forecast: null, ci_low: null, ci_high: null },
  { fy: '2005-06', hist: 4.85, forecast: null, ci_low: null, ci_high: null },
  { fy: '2007-08', hist: 5.32, forecast: null, ci_low: null, ci_high: null },
  { fy: '2009-10', hist: 5.98, forecast: null, ci_low: null, ci_high: null },
  { fy: '2011-12', hist: 6.45, forecast: null, ci_low: null, ci_high: null },
  { fy: '2013-14', hist: 6.92, forecast: null, ci_low: null, ci_high: null },
  { fy: '2015-16', hist: 7.41, forecast: null, ci_low: null, ci_high: null },
  { fy: '2017-18', hist: 7.89, forecast: null, ci_low: null, ci_high: null },
  { fy: '2019-20', hist: 8.24, forecast: null, ci_low: null, ci_high: null },
  { fy: '2021-22', hist: 8.33, forecast: 8.33, ci_low: 8.33, ci_high: 8.33 },
  { fy: '2022-23 (F)', hist: null, forecast: 8.65, ci_low: 7.45, ci_high: 9.85 },
  { fy: '2023-24 (F)', hist: null, forecast: 8.98, ci_low: 7.10, ci_high: 10.86 },
];

function CustomTrendTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null;
  const hist = payload.find((p: any) => p.dataKey === 'hist')?.value;
  const fc = payload.find((p: any) => p.dataKey === 'forecast')?.value;
  const low = payload[0]?.payload?.ci_low;
  const high = payload[0]?.payload?.ci_high;

  return (
    <div className="bg-slate-900/95 dark:bg-[#0b1329]/95 backdrop-blur-md border border-slate-700/80 dark:border-blue-500/30 p-3 rounded-xl shadow-xl text-xs space-y-1.5 min-w-[200px]">
      <span className="font-bold text-slate-200 font-mono block border-b border-slate-700/60 pb-1">
        Fiscal Year: {label}
      </span>
      {hist != null && (
        <div className="flex justify-between items-baseline gap-3">
          <span className="text-slate-400 text-[10px]">Historical ERBI:</span>
          <span className="font-mono font-bold text-cyan-400">{hist} Score</span>
        </div>
      )}
      {fc != null && label.includes('(F)') && (
        <>
          <div className="flex justify-between items-baseline gap-3">
            <span className="text-blue-400 text-[10px]">Holt's Linear Forecast:</span>
            <span className="font-mono font-bold text-white">{fc} Score</span>
          </div>
          <div className="flex justify-between items-baseline gap-3 pt-1 border-t border-slate-800 text-[10px]">
            <span className="text-blue-400 font-medium">95% Prediction CI:</span>
            <span className="font-mono font-bold text-blue-300">[{low}, {high}]</span>
          </div>
        </>
      )}
    </div>
  );
}

export default function ResourceBurdenTrend({ isDarkMode }: ResourceBurdenTrendProps) {
  const dark = isDarkMode;

  return (
    <div
      className={`rounded-2xl border p-5 shadow-xs space-y-3.5 transition-colors ${
        dark ? 'bg-[#131f37] border-[#1e2d4a]' : 'bg-white border-slate-200'
      }`}
    >
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#0F4C81] dark:text-[#3B82F6] block">
            Longitudinal Forecasting · System Horizon
          </span>
          <h3 className={`text-sm font-extrabold ${dark ? 'text-white' : 'text-slate-900'}`}>
            Estimated Resource Burden Over Time (19-Year Trend + 2-Year Forecast)
          </h3>
          <p className="text-[10px] text-slate-400">Mann-Kendall Monotonic Test (τ = 0.9766, p &lt; 0.0001) · Holt's Linear Exponential Smoothing</p>
        </div>
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
          <ShieldCheck size={11} /> Statistically Significant Trend
        </span>
      </div>

      <div style={{ height: 230 }} className="mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={ERBI_LONGITUDINAL_DATA} margin={{ top: 15, right: 30, bottom: 25, left: 10 }}>
            <defs>
              <linearGradient id="erbi-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0F4C81" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#0F4C81" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200/60 dark:text-slate-800/80" />
            <XAxis
              dataKey="fy"
              tick={{ fontSize: 9, fill: '#64748b', fontFamily: 'monospace' }}
              stroke="#94a3b8"
            />
            <YAxis
              tick={{ fontSize: 9, fill: '#64748b', fontFamily: 'monospace' }}
              tickFormatter={v => `${v}`}
              domain={[0, 12]}
              stroke="#94a3b8"
            />
            <Tooltip content={<CustomTrendTooltip />} />
            <Area
              type="monotone"
              dataKey="hist"
              fill="url(#erbi-grad)"
              stroke="none"
            />
            <Line
              type="monotone"
              dataKey="hist"
              stroke="#0F4C81"
              strokeWidth={3}
              dot={{ r: 3.5, fill: '#0F4C81', stroke: '#fff', strokeWidth: 1.5 }}
              name="Historical ERBI"
              connectNulls
            />
            <Line
              type="monotone"
              dataKey="forecast"
              stroke="#3B82F6"
              strokeWidth={2.5}
              strokeDasharray="5 4"
              dot={{ r: 4.5, fill: '#3B82F6', stroke: '#93C5FD', strokeWidth: 1.5 }}
              name="Holt Forecast"
              connectNulls
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Legend & Summary */}
      <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-[11px] border-t border-slate-100 dark:border-[#1e2d4a]">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#0F4C81] border border-cyan-400" />
          <span className="text-slate-600 dark:text-slate-300 font-medium">Historical ERBI Series (2003–2022)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-0.5 border-t-2 border-dashed border-[#3B82F6]" />
          <span className="text-slate-600 dark:text-slate-300 font-medium">Holt's Linear Forecast (FY+1: 8.65, FY+2: 8.98)</span>
        </div>
      </div>
    </div>
  );
}
