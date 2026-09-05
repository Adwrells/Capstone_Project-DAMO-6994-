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
      className={`rounded-2xl border p-6 shadow-xs space-y-4 transition-colors flex flex-col justify-between h-full ${
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

      <div className="h-[235px] my-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 15, right: 30, bottom: 35, left: 15 }}>
            <defs>
              <linearGradient id="vol-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0F4C81" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#0F4C81" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200/60 dark:text-slate-800/80" />
            <XAxis
              dataKey="fiscal_year"
              tick={{ fontSize: 10, fill: dark ? '#94a3b8' : '#64748b', fontFamily: 'monospace', dy: 2 }}
              angle={-25}
              textAnchor="end"
              interval={1}
              stroke="#94a3b8"
              height={50}
              label={{
                value: 'Fiscal Year (2003/04 – 2021/22)',
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
              tickFormatter={v => fmtK(v)}
              stroke="#94a3b8"
              width={65}
              label={{
                value: 'Total ED Visits (Count)',
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
          <strong>Longitudinal Trajectory:</strong> Annual ED visits grew from <strong>4.91M</strong> (FY 2003-04) to <strong>13.99M</strong> (FY 2021-22), peaking at <strong>15.08M</strong> in FY 2018-19 (+185.2% overall, Mann-Kendall <em>Z = 5.5977, p &lt; 0.001</em>, Sen's slope = 550.9K visits/year).
        </span>
      </div>
    </div>
  );
}
