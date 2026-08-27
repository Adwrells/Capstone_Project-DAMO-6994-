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
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0F4C81] dark:text-[#3B82F6] block">
            Hypothesis H1 · Primary Visual
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9.5px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck size={11} /> Reject H₀ (p &lt; 0.0001)
          </span>
        </div>
        <h3 className={`text-base font-extrabold ${dark ? 'text-white' : 'text-slate-900'}`}>
          Reported Median LOS Across CTAS Triage Levels
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-light">
          Non-linear duration gradient across clinical acuity tiers (CTAS I Resuscitation → CTAS V Non-Urgent)
        </p>

        <div style={{ height: 215 }} className="pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={CTAS_ORDERED_DATA}
              layout="vertical"
              margin={{ top: 5, right: 65, bottom: 25, left: 85 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200/60 dark:text-slate-800/80" />
              <XAxis
                type="number"
                tick={{ fontSize: 9.5, fill: '#64748b', fontFamily: 'monospace' }}
                tickFormatter={v => `${v}h`}
                stroke="#94a3b8"
                domain={[0, 6]}
                height={35}
                label={{
                  value: 'Reported Median LOS (h)',
                  position: 'insideBottom',
                  offset: -10,
                  fill: dark ? '#94a3b8' : '#475569',
                  fontSize: 10,
                  fontWeight: 700,
                  fontFamily: 'monospace'
                }}
              />
              <YAxis
                type="category"
                dataKey="short"
                tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }}
                stroke="#94a3b8"
                width={75}
                label={{
                  value: 'CTAS Triage Level',
                  angle: -90,
                  position: 'insideLeft',
                  offset: -10,
                  fill: dark ? '#94a3b8' : '#475569',
                  fontSize: 10,
                  fontWeight: 700,
                  fontFamily: 'monospace'
                }}
              />
              <Tooltip
                formatter={(val: any, _name: string, item: any) => [
                  `${val} h (${item.payload.los_min} min) · ${item.payload.visits} visits`,
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
                  formatter={(v: any) => `${Number(v).toFixed(2)} h`}
                  fill={dark ? '#E2E8F0' : '#1E293B'}
                  fontSize={10}
                  fontWeight={700}
                  fontFamily="monospace"
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Analytical Takeaway Note */}
      <div className={`px-3 py-1.5 rounded-lg border text-[10.5px] leading-relaxed ${
        dark ? 'bg-[#152033]/60 border-[#1e2d4a] text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'
      }`}>
        <span>
          <strong>Analytical Finding:</strong> Significant aggregate duration differences exist across tiers. <strong>CTAS II Emergent peaks at 4.80 h</strong> due to extensive stabilization and diagnostic workups prior to admission.
        </span>
      </div>

      {/* Compact Evidence Panel */}
      <div className="pt-2 border-t border-slate-100 dark:border-[#1e2d4a] grid grid-cols-4 gap-2 text-center text-[10px]">
        <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-[#182640]">
          <span className="text-slate-400 block text-[8.5px] font-bold uppercase">Method</span>
          <span className="font-bold text-slate-800 dark:text-slate-200 truncate">Kruskal-Wallis</span>
        </div>
        <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-[#182640]">
          <span className="text-slate-400 block text-[8.5px] font-bold uppercase">Test Stat</span>
          <span className="font-mono font-bold text-blue-600 dark:text-blue-400">H = 1.26 × 10⁸</span>
        </div>
        <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-[#182640]">
          <span className="text-slate-400 block text-[8.5px] font-bold uppercase">Effect Size</span>
          <span className="font-mono font-bold text-purple-600 dark:text-purple-400">ε² = 0.725</span>
        </div>
        <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40">
          <span className="text-emerald-600 dark:text-emerald-400 block text-[8.5px] font-bold uppercase">Decision</span>
          <span className="font-bold text-emerald-700 dark:text-emerald-300">Reject H₀</span>
        </div>
      </div>
    </div>
  );
}
