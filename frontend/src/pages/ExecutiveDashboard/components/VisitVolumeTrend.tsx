import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { TrendDataPoint } from './types';
import { fmtK, fmtNum } from './formatters';

interface VisitVolumeTrendProps {
  data: TrendDataPoint[];
  isDarkMode: boolean;
}

function CustomVolumeTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null;
  const visits = payload[0]?.value;

  return (
    <div className="bg-slate-900/95 dark:bg-[#0b1329]/95 backdrop-blur-md border border-slate-700/80 dark:border-blue-500/30 p-3 rounded-xl shadow-xl text-xs space-y-1.5 min-w-[180px]">
      <span className="font-bold text-slate-200 font-mono block border-b border-slate-700/60 pb-1">
        Fiscal Year: {label}
      </span>
      <div className="flex items-center justify-between gap-3">
        <span className="text-slate-400 text-[10px]">ED Visit Volume:</span>
        <span className="font-extrabold font-mono text-sm text-cyan-400">
          {fmtNum(visits)}
        </span>
      </div>
      <span className="text-[9px] text-slate-400 font-mono block text-right">
        ({fmtK(visits)} visits)
      </span>
    </div>
  );
}

export default function VisitVolumeTrend({ data, isDarkMode }: VisitVolumeTrendProps) {
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
            System Overview · Visual A
          </span>
          <h3 className={`text-sm font-extrabold ${dark ? 'text-white' : 'text-slate-900'}`}>
            ED Visit Volume by Fiscal Year
          </h3>
          <p className="text-[10px] text-slate-400">19-year longitudinal trend in aggregate patient arrivals (CIHI NACRS)</p>
        </div>
        <span
          className={`text-[9px] font-mono font-bold px-2.5 py-1 rounded-md border ${
            dark ? 'bg-[#182640] border-[#1e2d4a] text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'
          }`}
        >
          Units: Visit Count
        </span>
      </div>

      <div style={{ height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 15, right: 20, bottom: 35, left: 10 }}>
            <defs>
              <linearGradient id="vol-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0F4C81" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#0F4C81" stopOpacity={0.02} />
              </linearGradient>
            </defs>
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
              tickFormatter={v => fmtK(v)}
              stroke="#94a3b8"
            />
            <Tooltip content={<CustomVolumeTooltip />} />
            <Area
              type="monotone"
              dataKey="ed_visits"
              stroke="#0F4C81"
              strokeWidth={3}
              fill="url(#vol-gradient)"
              dot={{ r: 3.5, fill: '#0F4C81', stroke: '#fff', strokeWidth: 1.5 }}
              activeDot={{ r: 6, fill: '#0284C7', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
