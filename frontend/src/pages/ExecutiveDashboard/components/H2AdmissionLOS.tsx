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
      className={`rounded-2xl border p-6 shadow-xs space-y-4 transition-colors flex flex-col justify-between h-full ${
        dark ? 'bg-[#131f37] border-[#1e2d4a]' : 'bg-white border-slate-200'
      }`}
    >
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0F4C81] dark:text-[#3B82F6] block">
            Hypothesis H2 · Primary Visual
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9.5px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck size={11} /> Reject H₀ (p &lt; 0.0001)
          </span>
        </div>
        <h3 className={`text-base font-extrabold ${dark ? 'text-white' : 'text-slate-900'}`}>
          Admission Status vs Reported LOS
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-light">
          Reported median LOS differs significantly by inpatient admission status (Discharged vs Admitted)
        </p>

        <div className="h-[235px] pt-2 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={DISPOSITION_DATA}
              layout="vertical"
              margin={{ top: 15, right: 80, bottom: 30, left: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200/60 dark:text-slate-800/80" />
              <XAxis
                type="number"
                tick={{ fontSize: 10, fill: dark ? '#94a3b8' : '#64748b', fontFamily: 'monospace' }}
                tickFormatter={v => `${v}h`}
                stroke="#94a3b8"
                domain={[0, 12]}
                height={40}
                label={{
                  value: 'Reported Median Length of Stay (Hours)',
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
                dataKey="short"
                tick={{ fontSize: 11, fill: dark ? '#cbd5e1' : '#475569', fontWeight: 600 }}
                stroke="#94a3b8"
                width={90}
              />
              <Tooltip
                formatter={(val: any, _name: string, item: any) => [
                  `${val} h (${item.payload.los_min} min) · ${item.payload.visits} visits`,
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
                <LabelList
                  dataKey="los_hours"
                  position="right"
                  offset={8}
                  formatter={(v: any) => `${Number(v).toFixed(2)} h`}
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

      {/* Analytical Takeaway Note */}
      <div className={`px-3 py-2 rounded-xl border text-[11px] leading-relaxed ${
        dark ? 'bg-[#152033]/60 border-[#1e2d4a] text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'
      }`}>
        <span>
          <strong>Inpatient Disparity:</strong> <strong>Δ = +8.10 h (+324% longer stay)</strong> for admitted patients (10.60 h vs 2.50 h for discharged cases; rank-biserial effect <em>r_b = 0.998</em>).
        </span>
      </div>

      {/* Compact Evidence Panel */}
      <div className="pt-2 border-t border-slate-100 dark:border-[#1e2d4a] grid grid-cols-4 gap-2 text-center text-[10px]">
        <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-[#182640]">
          <span className="text-slate-400 block text-[8.5px] font-bold uppercase">Method</span>
          <span className="font-bold text-slate-800 dark:text-slate-200 truncate">Mann-Whitney U</span>
        </div>
        <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-[#182640]">
          <span className="text-slate-400 block text-[8.5px] font-bold uppercase">Test Stat</span>
          <span className="font-mono font-bold text-blue-600 dark:text-blue-400">U = 2.69 × 10¹²</span>
        </div>
        <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-[#182640]">
          <span className="text-slate-400 block text-[8.5px] font-bold uppercase">Rank-Biserial</span>
          <span className="font-mono font-bold text-purple-600 dark:text-purple-400">r_b = 0.998</span>
        </div>
        <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40">
          <span className="text-emerald-600 dark:text-emerald-400 block text-[8.5px] font-bold uppercase">Decision</span>
          <span className="font-bold text-emerald-700 dark:text-emerald-300">Reject H₀</span>
        </div>
      </div>
    </div>
  );
}
