import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  Cell,
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
  const [viewMode, setViewMode] = useState<'all' | 'top3' | 'top5'>('all');
  const [chartType, setChartType] = useState<'trend' | 'bar'>('trend');

  const latestVal = Number(data[data.length - 1]?.los_hours) || 0;
  const maxVal = Math.max(...data.map(d => Number(d.los_hours) || 0));

  // Sort descending by los_hours to identify Top 3 and Top 5
  const rankedData = useMemo(() => {
    return [...data]
      .map(d => ({
        ...d,
        losNum: Number(d.los_hours) || 0,
      }))
      .sort((a, b) => b.losNum - a.losNum)
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
            System Overview · Visual B
          </span>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Top 3 / Top 5 Button Switcher */}
            <div className="flex items-center gap-1 p-0.5 rounded-lg border border-slate-200 dark:border-[#1e2d4a] bg-slate-50 dark:bg-[#182640]">
              <button
                type="button"
                onClick={() => setViewMode('all')}
                className={`px-2.5 py-1 rounded-md text-[10px] font-bold cursor-pointer transition ${
                  viewMode === 'all'
                    ? 'bg-amber-600 text-white shadow-2xs'
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
                    ? 'bg-amber-600 text-white shadow-2xs'
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
                    ? 'bg-amber-600 text-white shadow-2xs'
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
              Units: Duration (Hours)
            </span>
          </div>
        </div>

        <h3 className={`text-base font-extrabold ${dark ? 'text-white' : 'text-slate-900'}`}>
          Reported Median LOS by Fiscal Year
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-light">
          19-year duration trajectory plotted against the approved CIHI 6.0h aggregate reference threshold
        </p>

        {/* Top 3 / Top 5 Interactive Leaderboard Strip */}
        {viewMode !== 'all' && (
          <div className="flex items-center justify-between flex-wrap gap-2 pt-1 border-t border-slate-100 dark:border-[#1e2d4a]/70">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {viewMode === 'top3' ? 'Top 3 Longest Stays' : 'Top 5 Longest Stays'}:
              </span>
              {topItemsList.map(item => {
                const medal = item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : item.rank === 3 ? '🥉' : `#${item.rank}`;
                return (
                  <div
                    key={item.fiscal_year}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-mono font-semibold ${
                      dark
                        ? 'bg-[#15233c] border-[#1e2d4a] text-slate-200'
                        : 'bg-amber-50/80 border-amber-200 text-slate-800'
                    }`}
                  >
                    <span>{medal}</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">{item.fiscal_year}</span>
                    <span className="text-slate-400">·</span>
                    <span className="font-bold">{item.losNum.toFixed(2)} h</span>
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
                    ? 'bg-amber-600 text-white'
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
                    ? 'bg-amber-600 text-white'
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
                tickFormatter={v => `${v}h`}
                domain={[0, 7]}
                stroke="#94a3b8"
                width={60}
                label={{
                  value: 'Reported Median LOS (Hours)',
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
              <Bar dataKey="los_hours" radius={[6, 6, 0, 0]} maxBarSize={65}>
                {topItemsList.map((_, index) => (
                  <Cell
                    key={`bar-cell-${index}`}
                    fill={index === 0 ? '#F59E0B' : index === 1 ? '#D97706' : index === 2 ? '#B45309' : '#92400E'}
                  />
                ))}
                <LabelList
                  dataKey="los_hours"
                  position="top"
                  formatter={(v: any) => {
                    const num = Number(v);
                    const item = topItemsList.find(d => d.losNum === num);
                    return item ? `#${item.rank} · ${num.toFixed(2)} h` : `${num.toFixed(2)} h`;
                  }}
                  fill={dark ? '#FCD34D' : '#D97706'}
                  fontSize={11}
                  fontWeight={700}
                  fontFamily="monospace"
                />
              </Bar>
            </BarChart>
          ) : (
            <LineChart data={data} margin={{ top: 15, right: 30, bottom: 35, left: 15 }}>
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
                tickFormatter={v => `${v}h`}
                domain={[0, 7]}
                stroke="#94a3b8"
                width={60}
                label={{
                  value: 'Reported Median LOS (Hours)',
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
                  const { cx, cy, index, payload } = props;
                  const rank = topYearsMap.get(payload?.fiscal_year);
                  if (rank) {
                    return (
                      <circle
                        key={`dot-top-${index}`}
                        cx={cx}
                        cy={cy}
                        r={rank === 1 ? 6 : 5}
                        fill={rank === 1 ? '#FDE68A' : '#F59E0B'}
                        stroke="#fff"
                        strokeWidth={2}
                      />
                    );
                  }
                  if (viewMode === 'all' && (index === data.length - 1 || payload?.los_hours === maxVal)) {
                    return (
                      <circle
                        key={`dot-peak-${index}`}
                        cx={cx}
                        cy={cy}
                        r={4.5}
                        fill="#F59E0B"
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
                      fill="#F59E0B"
                      stroke="#fff"
                      strokeWidth={1}
                      opacity={viewMode === 'all' ? 1 : 0.35}
                    />
                  );
                }}
                activeDot={{ r: 6, fill: '#D97706', stroke: '#fff', strokeWidth: 2 }}
              >
                <LabelList
                  dataKey="los_hours"
                  position="top"
                  offset={10}
                  formatter={(v: any, entry: any) => {
                    const fy = entry?.payload?.fiscal_year;
                    if (viewMode === 'all') {
                      const num = Number(v);
                      if (num === latestVal) {
                        return `${num.toFixed(2)} h`;
                      }
                      return '';
                    }
                    const rank = topYearsMap.get(fy);
                    if (rank) {
                      return `#${rank} (${Number(v).toFixed(2)}h)`;
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
          )}
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
