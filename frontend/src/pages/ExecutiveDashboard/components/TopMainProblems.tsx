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
      className={`rounded-2xl border p-5 shadow-xs space-y-3.5 transition-colors flex flex-col justify-between ${
        dark ? 'bg-[#131f37] border-[#1e2d4a]' : 'bg-white border-slate-200'
      }`}
    >
      <div>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#0F4C81] dark:text-[#3B82F6] block">
              Clinical Profiling · Primary Visual
            </span>
            <h3 className={`text-sm font-extrabold ${dark ? 'text-white' : 'text-slate-900'}`}>
              Top Main Presenting Problems
            </h3>
            <p className="text-[10px] text-slate-400">Chief diagnostic complaints ranked by volume and stay duration</p>
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

        <div style={{ height: 230 }} className="mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sortedData}
              layout="vertical"
              margin={{ top: 10, right: 35, bottom: 10, left: 120 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200/60 dark:text-slate-800/80" />
              <XAxis
                type="number"
                tick={{ fontSize: 9, fill: '#64748b', fontFamily: 'monospace' }}
                tickFormatter={v => (metric === 'visits' ? `${v}M` : `${v}h`)}
                stroke="#94a3b8"
              />
              <YAxis
                type="category"
                dataKey="problem"
                tick={{ fontSize: 9, fill: '#64748b', fontWeight: 600 }}
                stroke="#94a3b8"
                width={115}
              />
              <Tooltip
                formatter={(val: any, _name: string, item: any) => [
                  metric === 'visits'
                    ? `${fmtK(item.payload.visits)} visits (${item.payload.los_hours}h stay)`
                    : `${item.payload.los_hours} hrs (${item.payload.los_min} min)`,
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
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Clinical Context Footnote */}
      <div className={`p-2.5 rounded-xl border text-[10px] leading-relaxed flex items-start gap-2 ${
        dark ? 'bg-[#152033] border-[#1e2d4a] text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'
      }`}>
        <Stethoscope size={13} className="text-[#0F4C81] dark:text-[#3B82F6] shrink-0 mt-0.5" />
        <span>
          <strong>Volume vs Complexity:</strong> <strong>Trauma</strong> accounts for highest arrival volume (31.5M visits), whereas <strong>Acute Myocardial Infarction</strong> demands the longest median emergency department stay duration (4.98 hrs).
        </span>
      </div>
    </div>
  );
}
