import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell,
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
  const [viewMode, setViewMode] = useState<'all' | 'top3' | 'top5'>('all');
  const [chartType, setChartType] = useState<'trend' | 'bar'>('trend');

  // Identify peak milestone value for direct labeling in 'all' mode
  const maxVal = Math.max(...data.map(d => Number(d.ed_visits) || 0));

  // Sort descending by ed_visits to identify Top 3 and Top 5
  const rankedData = useMemo(() => {
    return [...data]
      .map(d => ({
        ...d,
        visitsNum: Number(d.ed_visits) || 0,
      }))
      .sort((a, b) => b.visitsNum - a.visitsNum)
      .map((d, idx) => ({
        ...d,
        rank: idx + 1,
      }));
  }, [data]);

  const topItemsList = useMemo(() => {
    if (viewMode === 'all') return [];
    const limit = viewMode === 'top3' ? 3 : 5;
    return rankedData.slice(0, limit);
  }, [rankedData, viewMode]);

  const topYearsMap = useMemo(() => {
    const map = new Map<string, number>();
    topItemsList.forEach(item => {
      map.set(item.fiscal_year, item.rank);
    });
    return map;
  }, [topItemsList]);

  return (
    <div
      className={`w-full rounded-2xl border p-6 shadow-xs space-y-4 transition-colors flex flex-col justify-between ${
        dark ? 'bg-[#131f37] border-[#1e2d4a]' : 'bg-white border-slate-200'
      }`}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0F4C81] dark:text-[#3B82F6] block">
            System Overview · Visual A
          </span>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Top 3 / Top 5 Button Switcher */}
            <div className="flex items-center gap-1 p-0.5 rounded-lg border border-slate-200 dark:border-[#1e2d4a] bg-slate-50 dark:bg-[#182640]">
              <button
                type="button"
                onClick={() => setViewMode('all')}
                className={`px-2.5 py-1 rounded-md text-[10px] font-bold cursor-pointer transition ${
                  viewMode === 'all'
                    ? 'bg-[#0F4C81] text-white shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                All (19 Yrs)
              </button>
              <button
                type="button"
                onClick={() => setViewMode('top3')}
                className={`px-2.5 py-1 rounded-md text-[10px] font-bold cursor-pointer transition ${
                  viewMode === 'top3'
                    ? 'bg-[#0F4C81] text-white shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                Top 3
              </button>
              <button
                type="button"
                onClick={() => setViewMode('top5')}
                className={`px-2.5 py-1 rounded-md text-[10px] font-bold cursor-pointer transition ${
                  viewMode === 'top5'
                    ? 'bg-[#0F4C81] text-white shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                Top 5
              </button>
            </div>

            <span
              className={`text-[9.5px] font-mono font-bold px-2.5 py-0.5 rounded-md border ${
                dark ? 'bg-[#182640] border-[#1e2d4a] text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              Units: Total Visits (Millions)
            </span>
          </div>
        </div>

        <h3 className={`text-base font-extrabold ${dark ? 'text-white' : 'text-slate-900'}`}>
          ED Visit Volume by Fiscal Year
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-light">
          19-year longitudinal progression in aggregate patient arrivals across Canadian emergency departments (CIHI NACRS)
        </p>

        {/* Top 3 / Top 5 Interactive Leaderboard Strip */}
        {viewMode !== 'all' && (
          <div className="flex items-center justify-between flex-wrap gap-2 pt-1 border-t border-slate-100 dark:border-[#1e2d4a]/70">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {viewMode === 'top3' ? 'Top 3 Volumes' : 'Top 5 Volumes'}:
              </span>
              {topItemsList.map(item => {
                const medal = item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : item.rank === 3 ? '🥉' : `#${item.rank}`;
                return (
                  <div
                    key={item.fiscal_year}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-mono font-semibold ${
                      dark
                        ? 'bg-[#15233c] border-[#1e2d4a] text-slate-200'
                        : 'bg-blue-50/80 border-blue-200 text-slate-800'
                    }`}
                  >
                    <span>{medal}</span>
                    <span className="font-bold text-[#0F4C81] dark:text-[#60A5FA]">{item.fiscal_year}</span>
                    <span className="text-slate-400">·</span>
                    <span className="font-bold">{fmtK(item.visitsNum)}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-1 p-0.5 rounded-md border border-slate-200 dark:border-[#1e2d4a] bg-slate-50/70 dark:bg-[#182640]/70 text-[9.5px]">
              <button
                type="button"
                onClick={() => setChartType('trend')}
                className={`px-2 py-0.5 rounded font-semibold cursor-pointer transition ${
                  chartType === 'trend'
                    ? 'bg-[#0F4C81] text-white'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                📈 Timeline
              </button>
              <button
                type="button"
                onClick={() => setChartType('bar')}
                className={`px-2 py-0.5 rounded font-semibold cursor-pointer transition ${
                  chartType === 'bar'
                    ? 'bg-[#0F4C81] text-white'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                📊 Ranked Bars
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="h-[280px] my-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {viewMode !== 'all' && chartType === 'bar' ? (
            <BarChart data={topItemsList} margin={{ top: 20, right: 30, bottom: 25, left: 15 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200/60 dark:text-slate-800/80" />
              <XAxis
                dataKey="fiscal_year"
                tick={{ fontSize: 11, fill: dark ? '#94a3b8' : '#64748b', fontFamily: 'monospace' }}
                stroke="#94a3b8"
                height={35}
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
                  fontFamily: 'monospace',
                }}
              />
              <Tooltip content={<CustomVolumeTooltip />} />
              <Bar dataKey="ed_visits" radius={[6, 6, 0, 0]} maxBarSize={65}>
                {topItemsList.map((_, index) => (
                  <Cell
                    key={`bar-cell-${index}`}
                    fill={index === 0 ? '#0284C7' : index === 1 ? '#0369A1' : index === 2 ? '#075985' : '#0F4C81'}
                  />
                ))}
                <LabelList
                  dataKey="ed_visits"
                  position="top"
                  formatter={(v: any) => {
                    const num = Number(v);
                    const item = topItemsList.find(d => d.visitsNum === num);
                    return item ? `#${item.rank} · ${fmtK(num)}` : fmtK(num);
                  }}
                  fill={dark ? '#93C5FD' : '#0F4C81'}
                  fontSize={11}
                  fontWeight={700}
                  fontFamily="monospace"
                />
              </Bar>
            </BarChart>
          ) : (
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
                  fontFamily: 'monospace',
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
                  fontFamily: 'monospace',
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
                  const { cx, cy, index, payload } = props;
                  const rank = topYearsMap.get(payload?.fiscal_year);
                  if (rank) {
                    return (
                      <circle
                        key={`dot-top-${index}`}
                        cx={cx}
                        cy={cy}
                        r={rank === 1 ? 6 : 5}
                        fill={rank === 1 ? '#38BDF8' : '#0284C7'}
                        stroke="#fff"
                        strokeWidth={2}
                      />
                    );
                  }
                  if (viewMode === 'all' && payload?.ed_visits === maxVal) {
                    return (
                      <circle
                        key={`dot-peak-${index}`}
                        cx={cx}
                        cy={cy}
                        r={4.5}
                        fill="#0284C7"
                        stroke="#fff"
                        strokeWidth={1.5}
                      />
                    );
                  }
                  return (
                    <circle
                      key={`dot-${index}`}
                      cx={cx}
                      cy={cy}
                      r={2.5}
                      fill="#0F4C81"
                      stroke="#fff"
                      strokeWidth={1}
                      opacity={viewMode === 'all' ? 1 : 0.35}
                    />
                  );
                }}
                activeDot={{ r: 6, fill: '#0284C7', stroke: '#fff', strokeWidth: 2 }}
              >
                <LabelList
                  dataKey="ed_visits"
                  position="top"
                  offset={10}
                  formatter={((v: any, entry: any) => {
                    const fy = entry?.payload?.fiscal_year;
                    if (viewMode === 'all') {
                      const num = Number(v);
                      if (num === maxVal) return `Peak: ${fmtK(num)}`;
                      return '';
                    }
                    const rank = topYearsMap.get(fy);
                    if (rank) {
                      return `#${rank} (${fmtK(Number(v))})`;
                    }
                    return '';
                  }) as any}
                  fill={dark ? '#93C5FD' : '#0F4C81'}
                  fontSize={10.5}
                  fontWeight={700}
                  fontFamily="monospace"
                />
              </Area>
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Key Analytical Annotation */}
      <div className={`p-2.5 rounded-xl border text-[11px] leading-relaxed flex items-start gap-2 ${
        dark ? 'bg-[#152033] border-[#1e2d4a] text-slate-300' : 'bg-blue-50/60 border-blue-100 text-slate-700'
      }`}>
        <span className="text-[#0F4C81] dark:text-[#3B82F6] font-bold shrink-0">📈 Key Finding:</span>
        <span>
          <strong>Longitudinal Trajectory:</strong> Annual ED visits grew from <strong>4.91M</strong> (FY 2003-04) to <strong>13.99M</strong> (FY 2021-22), peaking at <strong>15.08M</strong> in FY 2018-19 (+185.2% overall, Mann-Kendall <em>Z = 5.5977, p &lt; 0.001</em>, Sen&apos;s slope = 550.9K visits/year).
        </span>
      </div>
    </div>
  );
}
