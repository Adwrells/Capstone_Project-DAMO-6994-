import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  LabelList,
} from 'recharts';
import { Activity, Stethoscope } from 'lucide-react';
import { fmtK, fmtHours } from './formatters';

interface TopMainProblemsProps {
  isDarkMode: boolean;
}

const MAIN_PROBLEMS_DATA = [
  { problem: 'Trauma', visits: 31504096, visits_m: 31.50, los_hours: 2.30, los_min: 138, color: '#0F4C81' },
  { problem: 'Unintentional Falls', visits: 10032213, visits_m: 10.03, los_hours: 2.64, los_min: 159, color: '#0284C7' },
  { problem: 'Motor Vehicle Collisions', visits: 2731819, visits_m: 2.73, los_hours: 2.62, los_min: 157, color: '#38BDF8' },
  { problem: 'Pneumonia', visits: 1818520, visits_m: 1.82, los_hours: 3.98, los_min: 239, color: '#F59E0B' },
  { problem: 'Asthma', visits: 1215647, visits_m: 1.22, los_hours: 2.91, los_min: 174, color: '#10B981' },
  { problem: 'Acute Myocardial Infarction', visits: 402452, visits_m: 0.40, los_hours: 4.98, los_min: 299, color: '#EF4444' },
  { problem: 'Influenzal Pneumonia', visits: 16135, visits_m: 0.02, los_hours: 4.31, los_min: 259, color: '#8B5CF6' },
];

export default function TopMainProblems({ isDarkMode }: TopMainProblemsProps) {
  const [metric, setMetric] = useState<'visits' | 'los'>('visits');
  const dark = isDarkMode;

  const sortedData = [...MAIN_PROBLEMS_DATA].sort((a, b) =>
    metric === 'visits' ? b.visits - a.visits : b.los_hours - a.los_hours
  );

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
              Clinical Profiling · Primary Visual
            </span>
            <h3 className={`text-base font-extrabold ${dark ? 'text-white' : 'text-slate-900'}`}>
              Top Main Presenting Problems
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-light">
              Ranked by aggregate ED visit volume with reported median stay duration context
            </p>
          </div>

          {/* Metric Switcher */}
          <div className="flex items-center gap-1 p-0.5 rounded-lg border border-slate-200 dark:border-[#1e2d4a] bg-slate-50 dark:bg-[#182640]">
            <button
              type="button"
              onClick={() => setMetric('visits')}
              className={`px-2.5 py-1 rounded-md text-[10px] font-bold cursor-pointer transition ${
                metric === 'visits'
                  ? 'bg-[#0F4C81] text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              ED Visits
            </button>
            <button
              type="button"
              onClick={() => setMetric('los')}
              className={`px-2.5 py-1 rounded-md text-[10px] font-bold cursor-pointer transition ${
                metric === 'los'
                  ? 'bg-[#0F4C81] text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Median LOS
            </button>
          </div>
        </div>

        <div className="h-[235px] pt-2 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sortedData}
              layout="vertical"
              margin={{ top: 10, right: 80, bottom: 30, left: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200/60 dark:text-slate-800/80" />
              <XAxis
                type="number"
                tick={{ fontSize: 10, fill: dark ? '#94a3b8' : '#64748b', fontFamily: 'monospace' }}
                tickFormatter={v => (metric === 'visits' ? `${v}M` : `${v}h`)}
                stroke="#94a3b8"
                height={40}
                label={{
                  value: metric === 'visits' ? 'Total ED Patient Arrivals (Count / Millions)' : 'Reported Median Length of Stay (Hours)',
                  position: 'insideBottom',
                  offset: -12,
                  fill: dark ? '#94a3b8' : '#475569',
                  fontSize: 11,
                  fontWeight: 700,
                  fontFamily: 'monospace'
                }}
              />
              <YAxis
                type="category"
                dataKey="problem"
                tick={{ fontSize: 10.5, fill: dark ? '#cbd5e1' : '#475569', fontWeight: 600 }}
                stroke="#94a3b8"
                width={150}
              />
              <Tooltip
                formatter={(val: any, _name: string, item: any) => [
                  metric === 'visits'
                    ? `${fmtK(item.payload.visits)} visits (${item.payload.los_hours} h stay)`
                    : `${item.payload.los_hours} h (${item.payload.los_min} min · ${fmtK(item.payload.visits)} visits)`,
                  item.payload.problem,
                ]}
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.95)',
                  borderRadius: '0.75rem',
                  borderColor: '#334155',
                  color: '#fff',
                  fontSize: '11px',
                }}
              />
              <Bar dataKey={metric === 'visits' ? 'visits_m' : 'los_hours'} radius={[0, 6, 6, 0]} barSize={18}>
                {sortedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
                <LabelList
                  dataKey={metric === 'visits' ? 'visits' : 'los_hours'}
                  position="right"
                  offset={8}
                  formatter={(v: any) => metric === 'visits' ? fmtK(Number(v)) : `${Number(v).toFixed(2)} h`}
                  fill={dark ? '#E2E8F0' : '#1E293B'}
                  fontSize={10.5}
                  fontWeight={700}
                  fontFamily="monospace"
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two-Part Insight Callout */}
      <div className={`p-2.5 rounded-xl border text-[11px] leading-relaxed flex items-start gap-2 ${
        dark ? 'bg-[#152033] border-[#1e2d4a] text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'
      }`}>
        <Stethoscope size={13} className="text-[#0F4C81] dark:text-[#3B82F6] shrink-0 mt-0.5" />
        <span>
          <strong>Highest Volume:</strong> <strong>Trauma (31.5M visits)</strong> and <strong>Falls (10.0M visits)</strong> dominate ED intake · <strong>Longest Stay:</strong> <strong>Acute Myocardial Infarction (4.98 h)</strong> demands the longest median stay duration.
        </span>
      </div>
    </div>
  );
}
