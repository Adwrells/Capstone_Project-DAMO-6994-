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
} from 'recharts';
import { ShieldCheck } from 'lucide-react';
import { fmtHours, fmtMinutes, fmtP } from './formatters';

interface H2AdmissionLOSProps {
  isDarkMode: boolean;
}

const DISPOSITION_DATA = [
  { group: 'Non-Admitted', short: 'Discharged', los_hours: 2.50, los_min: 150, color: '#10B981', visits: '157.62M' },
  { group: 'Admitted Inpatient', short: 'Admitted', los_hours: 10.60, los_min: 636, color: '#EF4444', visits: '18.00M' },
];

export default function H2AdmissionLOS({ isDarkMode }: H2AdmissionLOSProps) {
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
              Hypothesis H2 · Primary Visual
            </span>
            <h3 className={`text-sm font-extrabold ${dark ? 'text-white' : 'text-slate-900'}`}>
              Admission Status vs Reported LOS
            </h3>
            <p className="text-[10px] text-slate-400">Inpatient Admission Disparity: Δ = +8.10 hrs (+324% longer)</p>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck size={11} /> Reject H₀ (p &lt; 0.0001)
          </span>
        </div>

        <div style={{ height: 230 }} className="mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={DISPOSITION_DATA}
              layout="vertical"
              margin={{ top: 20, right: 35, bottom: 20, left: 75 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200/60 dark:text-slate-800/80" />
              <XAxis
                type="number"
                tick={{ fontSize: 9, fill: '#64748b', fontFamily: 'monospace' }}
                tickFormatter={v => `${v}h`}
                stroke="#94a3b8"
                domain={[0, 12]}
              />
              <YAxis
                type="category"
                dataKey="short"
                tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }}
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
              <Bar dataKey="los_hours" radius={[0, 6, 6, 0]} barSize={26}>
                {DISPOSITION_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Compact Evidence Panel */}
      <div className="pt-2.5 border-t border-slate-100 dark:border-[#1e2d4a] grid grid-cols-4 gap-2 text-center text-[10px]">
        <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-[#182640]">
          <span className="text-slate-400 block text-[8px] font-bold uppercase">Method</span>
          <span className="font-bold text-slate-800 dark:text-slate-200 truncate">Mann-Whitney U</span>
        </div>
        <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-[#182640]">
          <span className="text-slate-400 block text-[8px] font-bold uppercase">Test Stat</span>
          <span className="font-mono font-bold text-blue-600 dark:text-blue-400">U = 2.69e12</span>
        </div>
        <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-[#182640]">
          <span className="text-slate-400 block text-[8px] font-bold uppercase">Rank-Biserial</span>
          <span className="font-mono font-bold text-purple-600 dark:text-purple-400">r_b = 0.998</span>
        </div>
        <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40">
          <span className="text-emerald-600 dark:text-emerald-400 block text-[8px] font-bold uppercase">Decision</span>
          <span className="font-bold text-emerald-700 dark:text-emerald-300">Reject H₀</span>
        </div>
      </div>
    </div>
  );
}
