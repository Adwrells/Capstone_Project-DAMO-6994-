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

interface H4AgeLOSProps {
  isDarkMode: boolean;
}

const AGE_ORDERED_DATA = [
  { group: 'Pediatric & Youth (0-17)', short: 'Pediatric', los_hours: 2.05, los_min: 123, color: '#06B6D4', visits: '38.91M' },
  { group: 'Young Adult (18-34)', short: 'Young Adult', los_hours: 2.53, los_min: 152, color: '#3B82F6', visits: '57.97M' },
  { group: 'Middle Adult (35-64)', short: 'Middle Adult', los_hours: 2.87, los_min: 172, color: '#F59E0B', visits: '41.67M' },
  { group: 'Older Adult (65+)', short: 'Older Adult', los_hours: 4.17, los_min: 250, color: '#10B981', visits: '37.21M' },
];

export default function H4AgeLOS({ isDarkMode }: H4AgeLOSProps) {
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
              Hypothesis H4 · Primary Visual
            </span>
            <h3 className={`text-sm font-extrabold ${dark ? 'text-white' : 'text-slate-900'}`}>
              Age Group vs Reported Length of Stay
            </h3>
            <p className="text-[10px] text-slate-400">Demographic lifecycle ordering (Pediatric → Older Adult)</p>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck size={11} /> Reject H₀ (p &lt; 0.0001)
          </span>
        </div>

        <div style={{ height: 230 }} className="mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={AGE_ORDERED_DATA}
              layout="vertical"
              margin={{ top: 10, right: 65, bottom: 10, left: 75 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200/60 dark:text-slate-800/80" />
              <XAxis
                type="number"
                tick={{ fontSize: 9, fill: '#64748b', fontFamily: 'monospace' }}
                tickFormatter={v => `${v}h`}
                stroke="#94a3b8"
                domain={[0, 5.2]}
              />
              <YAxis
                type="category"
                dataKey="short"
                tick={{ fontSize: 9.5, fill: '#64748b', fontWeight: 600 }}
                stroke="#94a3b8"
                width={70}
              />
              <Tooltip
                formatter={(val: any, _name: string, item: any) => [
                  `${val} hrs (${item.payload.los_min} min) · ${item.payload.visits} visits`,
                  item.payload.group,
                ]}
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.95)',
                  borderRadius: '0.75rem',
                  borderColor: '#334155',
                  color: '#fff',
                  fontSize: '11px',
                }}
              />
              <Bar dataKey="los_hours" radius={[0, 6, 6, 0]} barSize={22}>
                {AGE_ORDERED_DATA.map((entry, index) => (
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
          <span className="font-mono font-bold text-blue-600 dark:text-blue-400">H = 1.27e8</span>
        </div>
        <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-[#182640]">
          <span className="text-slate-400 block text-[8px] font-bold uppercase">Effect Size</span>
          <span className="font-mono font-bold text-purple-600 dark:text-purple-400">ε² = 0.722</span>
        </div>
        <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40">
          <span className="text-emerald-600 dark:text-emerald-400 block text-[8px] font-bold uppercase">Decision</span>
          <span className="font-bold text-emerald-700 dark:text-emerald-300">Reject H₀</span>
        </div>
      </div>
    </div>
  );
}
