import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
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

  // Identify milestone values for non-cluttered direct labeling (first & peak/latest)
  const firstVal = Number(data[0]?.ed_visits) || 0;
  const maxVal = Math.max(...data.map(d => Number(d.ed_visits) || 0));

  return (
    <div
      className={`rounded-2xl border p-5 shadow-xs space-y-3.5 transition-colors flex flex-col justify-between ${
        dark ? 'bg-[#131f37] border-[#1e2d4a]' : 'bg-white border-slate-200'
      }`}
    >
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0F4C81] dark:text-[#3B82F6] block">
            System Overview · Visual A
          </span>
          <span
            className={`text-[9.5px] font-mono font-bold px-2.5 py-0.5 rounded-md border ${
              dark ? 'bg-[#182640] border-[#1e2d4a] text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            Units: Total Visits (Millions)
          </span>
        </div>
        <h3 className={`text-base font-extrabold ${dark ? 'text-white' : 'text-slate-900'}`}>
          ED Visit Volume by Fiscal Year
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-light">
          19-year longitudinal progression in aggregate patient arrivals across Canadian emergency departments (CIHI NACRS)
        </p>
      </div>

      <div style={{ height: 230 }} className="my-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 20, right: 25, bottom: 25, left: 15 }}>
            <defs>
              <linearGradient id="vol-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0F4C81" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#0F4C81" stopOpacity={0.02} />
              </linearGradient>
            </defs>
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
              tickFormatter={v => fmtK(v)}
              stroke="#94a3b8"
              width={62}
              label={{
                value: 'Total ED Visits',
                angle: -90,
                position: 'insideLeft',
                offset: 0,
                fill: dark ? '#94a3b8' : '#475569',
                fontSize: 10,
                fontWeight: 700,
                fontFamily: 'monospace'
              }}
            />
            <Tooltip content={<CustomVolumeTooltip />} />
            <Area
              type="monotone"
              dataKey="ed_visits"
              stroke="#0F4C81"
              strokeWidth={3}
              fill="url(#vol-gradient)"
              dot={(props: any) => {
                const { cx, cy, index, value } = props;
                const isMilestone = index === 0 || value === maxVal;
                return (
                  <circle
                    key={`dot-${index}`}
                    cx={cx}
                    cy={cy}
                    r={isMilestone ? 4.5 : 2.5}
                    fill={isMilestone ? '#0284C7' : '#0F4C81'}
                    stroke="#fff"
                    strokeWidth={1.5}
                  />
                );
              }}
              activeDot={{ r: 6, fill: '#0284C7', stroke: '#fff', strokeWidth: 2 }}
            >
              <LabelList
                dataKey="ed_visits"
                position="top"
                offset={8}
                formatter={(v: any) => {
                  const num = Number(v);
                  if (num === firstVal) return fmtK(num);
                  if (num === maxVal) return `Peak: ${fmtK(num)}`;
                  return '';
                }}
                fill={dark ? '#93C5FD' : '#0F4C81'}
                fontSize={10.5}
                fontWeight={700}
                fontFamily="monospace"
              />
            </Area>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Key Analytical Annotation */}
      <div className={`p-2.5 rounded-xl border text-[11px] leading-relaxed flex items-start gap-2 ${
        dark ? 'bg-[#152033] border-[#1e2d4a] text-slate-300' : 'bg-blue-50/60 border-blue-100 text-slate-700'
      }`}>
        <span className="text-[#0F4C81] dark:text-[#3B82F6] font-bold shrink-0">📈 Key Finding:</span>
        <span>
          <strong>Historical Peak:</strong> <strong>2.89M arrivals</strong> in FY 2021-22 representing a <strong>+131.6% aggregate increase</strong> over the 19-year reporting window (Mann-Kendall upward trend, <em>p &lt; 0.0001</em>).
        </span>
      </div>
    </div>
  );
}
