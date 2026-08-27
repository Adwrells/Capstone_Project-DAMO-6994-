import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  LabelList,
} from 'recharts';
import { TrendDataPoint } from './types';
import { fmtHours, fmtMinutes } from './formatters';

interface LOSTrendProps {
  data: TrendDataPoint[];
  isDarkMode: boolean;
}

function CustomLOSTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null;
  const losHrs = payload[0]?.value;
  const losMin = payload[0]?.payload?.median_los_min ?? Math.round(Number(losHrs) * 60);

  return (
    <div className="bg-slate-900/95 dark:bg-[#0b1329]/95 backdrop-blur-md border border-slate-700/80 dark:border-amber-500/30 p-3 rounded-xl shadow-xl text-xs space-y-1.5 min-w-[190px]">
      <span className="font-bold text-slate-200 font-mono block border-b border-slate-700/60 pb-1">
        Fiscal Year: {label}
      </span>
      <div className="flex items-center justify-between gap-3">
        <span className="text-slate-400 text-[10px]">Reported Median LOS:</span>
        <span className="font-extrabold font-mono text-sm text-amber-400">
          {fmtHours(losHrs)}
        </span>
      </div>
      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800">
        <span>Duration in Minutes:</span>
        <span className="font-mono text-slate-200">{fmtMinutes(losMin)}</span>
      </div>
      {Number(losHrs) > 6.0 && (
        <span className="text-[9px] text-rose-400 font-semibold block pt-0.5">
          ⚠ +{(Number(losHrs) - 6.0).toFixed(1)}h above CIHI 6h Benchmark
        </span>
      )}
    </div>
  );
}

export default function LOSTrend({ data, isDarkMode }: LOSTrendProps) {
  const dark = isDarkMode;

  const firstVal = Number(data[0]?.los_hours) || 0;
  const latestVal = Number(data[data.length - 1]?.los_hours) || 0;
  const maxVal = Math.max(...data.map(d => Number(d.los_hours) || 0));

  return (
    <div
      className={`rounded-2xl border p-5 shadow-xs space-y-3.5 transition-colors flex flex-col justify-between ${
        dark ? 'bg-[#131f37] border-[#1e2d4a]' : 'bg-white border-slate-200'
      }`}
    >
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0F4C81] dark:text-[#3B82F6] block">
            System Overview · Visual B
          </span>
          <span
            className={`text-[9.5px] font-mono font-bold px-2.5 py-0.5 rounded-md border ${
              dark ? 'bg-[#182640] border-[#1e2d4a] text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            Units: Duration (Hours)
          </span>
        </div>
        <h3 className={`text-base font-extrabold ${dark ? 'text-white' : 'text-slate-900'}`}>
          Reported Median LOS by Fiscal Year
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-light">
          19-year duration trajectory plotted against the approved CIHI 6.0h aggregate reference threshold
        </p>
      </div>

      <div style={{ height: 230 }} className="my-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 25, bottom: 25, left: 15 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200/60 dark:text-slate-800/80" />
            <XAxis
              dataKey="fiscal_year"
              tick={{ fontSize: 9.5, fill: '#64748b', fontFamily: 'monospace' }}
              angle={-25}
              textAnchor="end"
              interval={1}
              stroke="#94a3b8"
              height={42}
              label={{
                value: 'Fiscal Year (2003/04 – 2021/22)',
                position: 'insideBottom',
                offset: -10,
                fill: dark ? '#94a3b8' : '#475569',
                fontSize: 10,
                fontWeight: 700,
                fontFamily: 'monospace'
              }}
            />
            <YAxis
              tick={{ fontSize: 9.5, fill: '#64748b', fontFamily: 'monospace' }}
              tickFormatter={v => `${v}h`}
              domain={[0, 7]}
              stroke="#94a3b8"
              width={55}
              label={{
                value: 'Reported Median LOS (Hours)',
                angle: -90,
                position: 'insideLeft',
                offset: 0,
                fill: dark ? '#94a3b8' : '#475569',
                fontSize: 10,
                fontWeight: 700,
                fontFamily: 'monospace'
              }}
            />
            <Tooltip content={<CustomLOSTooltip />} />
            <ReferenceLine
              y={6.0}
              stroke="#EF4444"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value: 'Reference Threshold: 6.0 h (CIHI Indicator)',
                position: 'top',
                fill: '#EF4444',
                fontSize: 9.5,
                fontWeight: 700,
              }}
            />
            <Line
              type="monotone"
              dataKey="los_hours"
              stroke="#F59E0B"
              strokeWidth={3}
              dot={(props: any) => {
                const { cx, cy, index, value } = props;
                const isMilestone = index === 0 || index === data.length - 1 || value === maxVal;
                return (
                  <circle
                    key={`dot-${index}`}
                    cx={cx}
                    cy={cy}
                    r={isMilestone ? 4.5 : 2.5}
                    fill={isMilestone ? '#F59E0B' : '#FBBF24'}
                    stroke="#fff"
                    strokeWidth={1.5}
                  />
                );
              }}
              activeDot={{ r: 6, fill: '#D97706', stroke: '#fff', strokeWidth: 2 }}
            >
              <LabelList
                dataKey="los_hours"
                position="top"
                offset={8}
                formatter={(v: any) => {
                  const num = Number(v);
                  if (num === firstVal || num === latestVal) {
                    return `${num.toFixed(2)} h`;
                  }
                  return '';
                }}
                fill={dark ? '#FCD34D' : '#D97706'}
                fontSize={10.5}
                fontWeight={700}
                fontFamily="monospace"
              />
            </Line>
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Key Analytical Annotation */}
      <div className={`p-2.5 rounded-xl border text-[11px] leading-relaxed flex items-start gap-2 ${
        dark ? 'bg-[#152033] border-[#1e2d4a] text-slate-300' : 'bg-amber-50/60 border-amber-100 text-slate-700'
      }`}>
        <span className="text-amber-600 dark:text-amber-400 font-bold shrink-0">⏱️ Benchmark Status:</span>
        <span>
          <strong>Latest Reported Median LOS:</strong> <strong>4.17 h</strong> in FY 2021-22 (+51.6% growth from 2.75 h in 2003-04; the aggregate departmental cohort remains within the 6.0 h reference threshold).
        </span>
      </div>
    </div>
  );
}
