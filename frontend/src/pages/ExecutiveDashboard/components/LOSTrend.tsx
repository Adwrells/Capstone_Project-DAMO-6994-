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

  return (
    <div
      className={`rounded-2xl border p-5 shadow-xs space-y-3 transition-colors ${
        dark ? 'bg-[#131f37] border-[#1e2d4a]' : 'bg-white border-slate-200'
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#0F4C81] dark:text-[#3B82F6] block">
            System Overview · Visual B
          </span>
          <h3 className={`text-sm font-extrabold ${dark ? 'text-white' : 'text-slate-900'}`}>
            Reported Median LOS by Fiscal Year
          </h3>
          <p className="text-[10px] text-slate-400">Longitudinal duration trend with CIHI 6.0h benchmark threshold</p>
        </div>
        <span
          className={`text-[9px] font-mono font-bold px-2.5 py-1 rounded-md border ${
            dark ? 'bg-[#182640] border-[#1e2d4a] text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'
          }`}
        >
          Units: Hours
        </span>
      </div>

      <div style={{ height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 22, right: 20, bottom: 35, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200/60 dark:text-slate-800/80" />
            <XAxis
              dataKey="fiscal_year"
              tick={{ fontSize: 9, fill: '#64748b', fontFamily: 'monospace' }}
              angle={-35}
              textAnchor="end"
              interval={1}
              stroke="#94a3b8"
            />
            <YAxis
              tick={{ fontSize: 9, fill: '#64748b', fontFamily: 'monospace' }}
              tickFormatter={v => `${v}h`}
              domain={[0, 'auto']}
              stroke="#94a3b8"
            />
            <Tooltip content={<CustomLOSTooltip />} />
            <ReferenceLine
              y={6.0}
              stroke="#EF4444"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value: 'CIHI Benchmark (6.0h)',
                position: 'top',
                fill: '#EF4444',
                fontSize: 9,
                fontWeight: 700,
              }}
            />
            <Line
              type="monotone"
              dataKey="los_hours"
              stroke="#F59E0B"
              strokeWidth={3}
              dot={{ r: 3.5, fill: '#F59E0B', stroke: '#fff', strokeWidth: 1.5 }}
              activeDot={{ r: 6, fill: '#D97706', stroke: '#fff', strokeWidth: 2 }}
            >
              <LabelList
                dataKey="los_hours"
                position="top"
                offset={6}
                formatter={(v: any) => `${Number(v).toFixed(2)}h`}
                fill={dark ? '#FCD34D' : '#D97706'}
                fontSize={8}
                fontWeight={700}
                fontFamily="monospace"
              />
            </Line>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
