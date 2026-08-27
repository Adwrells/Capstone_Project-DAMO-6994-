import React from 'react';
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
import { ShieldCheck } from 'lucide-react';
import { fmtHours, fmtMinutes, fmtP } from './formatters';

interface H1CTASLOSProps {
  isDarkMode: boolean;
}

const CTAS_ORDERED_DATA = [
  { level: 'CTAS I - Resuscitation', short: 'CTAS I', los_hours: 4.60, los_min: 276, color: '#EF4444', visits: '1.29M' },
  { level: 'CTAS II - Emergent', short: 'CTAS II', los_hours: 4.80, los_min: 288, color: '#F97316', visits: '26.74M' },
  { level: 'CTAS III - Urgent', short: 'CTAS III', los_hours: 3.40, los_min: 204, color: '#F59E0B', visits: '72.10M' },
  { level: 'Less urgent', short: 'CTAS IV', los_hours: 1.90, los_min: 114, color: '#3B82F6', visits: '58.99M' },
  { level: 'Non-urgent', short: 'CTAS V', los_hours: 1.33, los_min: 80, color: '#10B981', visits: '15.09M' },
];

export default function H1CTASLOS({ isDarkMode }: H1CTASLOSProps) {
  const dark = isDarkMode;

  return (
    <div
      className={`rounded-2xl border p-5 shadow-xs space-y-3.5 transition-colors flex flex-col justify-between ${
        dark ? 'bg-[#131f37] border-[#1e2d4a]' : 'bg-white border-slate-200'
      }`}
    >
      <div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#0F4C81] dark:text-[#3B82F6] block">
              Hypothesis H1 · Primary Visual
            </span>
            <h3 className={`text-sm font-extrabold ${dark ? 'text-white' : 'text-slate-900'}`}>
              CTAS Triage Acuity vs Reported LOS
            </h3>
            <p className="text-[10px] text-slate-400">Clinical hierarchy ordering (Resuscitation → Non-Urgent)</p>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck size={11} /> Reject H₀ (p &lt; 0.0001)
          </span>
        </div>

        <div style={{ height: 230 }} className="mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={CTAS_ORDERED_DATA}
              layout="vertical"
              margin={{ top: 10, right: 65, bottom: 10, left: 65 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200/60 dark:text-slate-800/80" />
              <XAxis
                type="number"
                tick={{ fontSize: 9, fill: '#64748b', fontFamily: 'monospace' }}
                tickFormatter={v => `${v}h`}
                stroke="#94a3b8"
                domain={[0, 6]}
              />
              <YAxis
                type="category"
                dataKey="short"
                tick={{ fontSize: 9.5, fill: '#64748b', fontWeight: 600 }}
                stroke="#94a3b8"
                width={60}
              />
              <Tooltip
                formatter={(val: any, _name: string, item: any) => [
                  `${val} hrs (${item.payload.los_min} min) · ${item.payload.visits} visits`,
                  item.payload.level,
                ]}
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.95)',
                  borderRadius: '0.75rem',
                  borderColor: '#334155',
                  color: '#fff',
                  fontSize: '11px',
                }}
              />
              <Bar dataKey="los_hours" radius={[0, 6, 6, 0]} barSize={20}>
                {CTAS_ORDERED_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
                <LabelList
                  dataKey="los_hours"
                  position="right"
                  offset={8}
                  formatter={(v: any) => `${Number(v).toFixed(2)} hrs`}
                  fill={dark ? '#E2E8F0' : '#1E293B'}
                  fontSize={9.5}
                  fontWeight={700}
                  fontFamily="monospace"
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Compact Evidence Panel */}
      <div className="pt-2.5 border-t border-slate-100 dark:border-[#1e2d4a] grid grid-cols-4 gap-2 text-center text-[10px]">
        <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-[#182640]">
          <span className="text-slate-400 block text-[8px] font-bold uppercase">Method</span>
          <span className="font-bold text-slate-800 dark:text-slate-200 truncate">Kruskal-Wallis</span>
        </div>
        <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-[#182640]">
          <span className="text-slate-400 block text-[8px] font-bold uppercase">Test Stat</span>
          <span className="font-mono font-bold text-blue-600 dark:text-blue-400">H = 1.26e8</span>
        </div>
        <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-[#182640]">
          <span className="text-slate-400 block text-[8px] font-bold uppercase">Effect Size</span>
          <span className="font-mono font-bold text-purple-600 dark:text-purple-400">ε² = 0.725</span>
        </div>
        <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40">
          <span className="text-emerald-600 dark:text-emerald-400 block text-[8px] font-bold uppercase">Decision</span>
          <span className="font-bold text-emerald-700 dark:text-emerald-300">Reject H₀</span>
        </div>
      </div>
    </div>
  );
}
