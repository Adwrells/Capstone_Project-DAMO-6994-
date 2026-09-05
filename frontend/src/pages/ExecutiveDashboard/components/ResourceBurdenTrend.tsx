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
  ReferenceLine,
  LabelList,
} from 'recharts';
import { TrendingUp, ShieldCheck } from 'lucide-react';
import { fmtK } from './formatters';

interface ResourceBurdenTrendProps {
  isDarkMode: boolean;
}

// 19-Year historical ERBI points + 2-year forecast
const ERBI_LONGITUDINAL_DATA = [
  { fy: '2003-04', hist: 5.21, forecast: null, forecast_label: null, ci_low: null, ci_high: null },
  { fy: '2005-06', hist: 5.85, forecast: null, forecast_label: null, ci_low: null, ci_high: null },
  { fy: '2007-08', hist: 6.32, forecast: null, forecast_label: null, ci_low: null, ci_high: null },
  { fy: '2009-10', hist: 6.98, forecast: null, forecast_label: null, ci_low: null, ci_high: null },
  { fy: '2011-12', hist: 7.45, forecast: null, forecast_label: null, ci_low: null, ci_high: null },
  { fy: '2013-14', hist: 7.92, forecast: null, forecast_label: null, ci_low: null, ci_high: null },
  { fy: '2015-16', hist: 8.41, forecast: null, forecast_label: null, ci_low: null, ci_high: null },
  { fy: '2017-18', hist: 8.89, forecast: null, forecast_label: null, ci_low: null, ci_high: null },
  { fy: '2019-20', hist: 9.15, forecast: null, forecast_label: null, ci_low: null, ci_high: null },
  { fy: '2021-22', hist: 9.32, forecast: 9.32, forecast_label: null, ci_low: 9.32, ci_high: 9.32 },
  { fy: '2022-23 (F)', hist: null, forecast: 9.32, forecast_label: '9.32 (F)', ci_low: 8.12, ci_high: 10.52 },
  { fy: '2023-24 (F)', hist: null, forecast: 9.32, forecast_label: '9.32 (F)', ci_low: 7.85, ci_high: 10.79 },
];

function CustomTrendTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null;
  const hist = payload.find((p: any) => p.dataKey === 'hist')?.value;
  const fc = payload.find((p: any) => p.dataKey === 'forecast')?.value;
  const low = payload[0]?.payload?.ci_low;
  const high = payload[0]?.payload?.ci_high;

  return (
    <div className="bg-slate-900/95 dark:bg-[#0b1329]/95 backdrop-blur-md border border-slate-700/80 dark:border-blue-500/30 p-3 rounded-xl shadow-xl text-xs space-y-1.5 min-w-[210px]">
      <span className="font-bold text-slate-200 font-mono block border-b border-slate-700/60 pb-1">
        Fiscal Year: {label}
      </span>
      {hist != null && (
        <div className="flex justify-between items-baseline gap-3">
          <span className="text-slate-400 text-[10px]">Observed ERBI:</span>
          <span className="font-mono font-bold text-cyan-400">{hist} Score</span>
        </div>
      )}
      {fc != null && label.includes('(F)') && (
        <>
          <div className="flex justify-between items-baseline gap-3">
            <span className="text-blue-400 text-[10px]">SES Point Forecast:</span>
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
      className={`rounded-2xl border p-6 shadow-xs space-y-4 transition-colors flex flex-col justify-between h-full ${
        dark ? 'bg-[#131f37] border-[#1e2d4a]' : 'bg-white border-slate-200'
      }`}
    >
      <div className="space-y-1">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0F4C81] dark:text-[#3B82F6] block">
              Longitudinal Forecasting · System Horizon
            </span>
            <h3 className={`text-base font-extrabold ${dark ? 'text-white' : 'text-slate-900'}`}>
              Estimated Resource Burden Over Time (19-Year Trend + 2-Year Forecast)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-light">
              Mann-Kendall Monotonic Test (Z = 5.5977, p &lt; 0.001) · Simple Exponential Smoothing (SES) with 95% Prediction Intervals
            </p>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9.5px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck size={11} /> Statistically Significant Trend
          </span>
        </div>

        <div className="h-[235px] pt-2 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={ERBI_LONGITUDINAL_DATA} margin={{ top: 15, right: 35, bottom: 35, left: 15 }}>
              <defs>
                <linearGradient id="erbi-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0F4C81" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#0F4C81" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200/60 dark:text-slate-800/80" />
              <XAxis
                dataKey="fy"
                tick={{ fontSize: 10, fill: dark ? '#94a3b8' : '#64748b', fontFamily: 'monospace', dy: 2 }}
                stroke="#94a3b8"
                height={50}
                label={{
                  value: 'Fiscal Year (19-Yr Observed Series + 2-Yr SES Forecast)',
                  position: 'insideBottom',
                  offset: -16,
                  fill: dark ? '#94a3b8' : '#475569',
                  fontSize: 11,
                  fontWeight: 700,
                  fontFamily: 'monospace'
                }}
              />
              <YAxis
                tick={{ fontSize: 10, fill: dark ? '#94a3b8' : '#64748b', fontFamily: 'monospace' }}
                tickFormatter={v => `${v}`}
                domain={[0, 12]}
                stroke="#94a3b8"
                width={60}
                label={{
                  value: 'ERBI Index Score',
                  angle: -90,
                  position: 'insideLeft',
                  offset: 12,
                  style: { textAnchor: 'middle' },
                  fill: dark ? '#94a3b8' : '#475569',
                  fontSize: 11,
                  fontWeight: 700,
                  fontFamily: 'monospace'
                }}
              />
              <Tooltip content={<CustomTrendTooltip />} />
              <ReferenceLine
                x="2021-22"
                stroke="#64748b"
                strokeDasharray="3 3"
                label={{
                  value: 'Forecast Boundary',
                  position: 'insideTopLeft',
                  fill: dark ? '#94a3b8' : '#64748b',
                  fontSize: 9,
                  fontWeight: 700,
                }}
              />
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
                dot={(props: any) => {
                  const { cx, cy, index } = props;
                  const isMilestone = index === 0 || index === 9;
                  return (
                    <circle
                      key={`hist-dot-${index}`}
                      cx={cx}
                      cy={cy}
                      r={isMilestone ? 4.5 : 2.5}
                      fill={isMilestone ? '#0284C7' : '#0F4C81'}
                      stroke="#fff"
                      strokeWidth={1.5}
                    />
                  );
                }}
                name="Observed ERBI"
                connectNulls
              >
                <LabelList
                  dataKey="hist"
                  position="top"
                  offset={8}
                  formatter={(v: any) => {
                    const num = Number(v);
                    if (num === 5.21 || num === 9.32) {
                      return num.toFixed(2);
                    }
                    return '';
                  }}
                  fill={dark ? '#93C5FD' : '#0F4C81'}
                  fontSize={10.5}
                  fontWeight={700}
                  fontFamily="monospace"
                />
              </Line>
              <Line
                type="monotone"
                dataKey="forecast"
                stroke="#3B82F6"
                strokeWidth={2.5}
                strokeDasharray="5 4"
                dot={{ r: 4.5, fill: '#3B82F6', stroke: '#93C5FD', strokeWidth: 1.5 }}
                name="SES Forecast"
                connectNulls
              >
                <LabelList
                  dataKey="forecast_label"
                  position="top"
                  offset={8}
                  fill={dark ? '#60A5FA' : '#2563EB'}
                  fontSize={10.5}
                  fontWeight={700}
                  fontFamily="monospace"
                />
              </Line>
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Legend & Summary */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-1 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#0F4C81] border border-cyan-400" />
            <span className="text-slate-600 dark:text-slate-300 font-medium">Observed ERBI Series (2003–2022)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-0.5 border-t-2 border-dashed border-[#3B82F6]" />
            <span className="text-slate-600 dark:text-slate-300 font-medium">Simple Exponential Smoothing (SES) Forecast</span>
          </div>
        </div>
      </div>

      {/* Analytical & Methodological Callout */}
      <div className={`p-2.5 rounded-xl border text-[11px] leading-relaxed flex items-start gap-2 ${
        dark ? 'bg-[#152033] border-[#1e2d4a] text-slate-300' : 'bg-blue-50/60 border-blue-100 text-slate-700'
      }`}>
        <TrendingUp size={13} className="text-[#0F4C81] dark:text-[#3B82F6] shrink-0 mt-0.5" />
        <span>
          <strong>Methodological Insight:</strong> Historical series exhibits monotonic longitudinal expansion (Mann-Kendall <em>τ = 0.9766, p &lt; 0.0001</em>). <em>Note: Forecasts are model-based planning estimates and should be refreshed when new CIHI aggregate data is released.</em>
        </span>
      </div>
    </div>
  );
}
