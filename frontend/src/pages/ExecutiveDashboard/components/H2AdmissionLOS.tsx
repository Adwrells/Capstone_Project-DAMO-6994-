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
import StatBadge from '../../../components/common/StatBadge';
import AnalyticalTakeaway from '../../../components/common/AnalyticalTakeaway';

interface H2AdmissionLOSProps {
  isDarkMode: boolean;
}

const DISPOSITION_DATA = [
  { group: 'Non-Admitted', short: 'Non-Admitted', los_hours: 2.50, los_min: 150, color: '#10B981', visits: '157.62M' },
  { group: 'Admitted Inpatient', short: 'Admitted', los_hours: 10.60, los_min: 636, color: '#EF4444', visits: '18.00M' },
];

export default function H2AdmissionLOS({ isDarkMode }: H2AdmissionLOSProps) {
  const dark = isDarkMode;

  return (
    <div
      className={`rounded-2xl border p-5 shadow-xs space-y-3 transition-colors flex flex-col justify-between h-full ${
        dark ? 'bg-[#111e35] border-white/[0.08]' : 'bg-white border-slate-200'
      }`}
    >
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            HYPOTHESIS H2 · WEIGHTED MANN-WHITNEY U
          </span>
          <StatBadge label="Reject H₀" sublabel="p < 0.0001" variant="reject" />
        </div>
        <h3 className={`text-base font-semibold ${dark ? 'text-slate-100' : 'text-slate-900'}`}>
          Admission Status vs Reported LOS
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
          Reported median LOS differs significantly by admission status (Admitted Inpatient vs Non-Admitted).
        </p>

        <div className="h-[230px] pt-1 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={DISPOSITION_DATA}
              layout="vertical"
              margin={{ top: 15, right: 80, bottom: 25, left: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200/60 dark:text-slate-800/80" />
              <XAxis
                type="number"
                tick={{ fontSize: 10, fill: dark ? '#94a3b8' : '#64748b', fontFamily: 'monospace' }}
                tickFormatter={v => `${v}h`}
                stroke="#94a3b8"
                domain={[0, 12]}
                height={35}
                label={{
                  value: 'Reported Median Length of Stay (Hours)',
                  position: 'insideBottom',
                  offset: -10,
                  fill: dark ? '#94a3b8' : '#475569',
                  fontSize: 10.5,
                  fontWeight: 600,
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
                  backgroundColor: dark ? '#0f172a' : '#ffffff',
                  borderRadius: '0.75rem',
                  borderColor: dark ? '#334155' : '#e2e8f0',
                  color: dark ? '#fff' : '#0f172a',
                  fontSize: '11px',
                }}
              />
              <Bar dataKey="los_hours" radius={[0, 4, 4, 0]} barSize={24}>
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
      <AnalyticalTakeaway title="INPATIENT DISPARITY">
        <strong>Δ = +8.10 h (+324% longer stay)</strong> for admitted patients (10.60 h vs 2.50 h for non-admitted visits; rank-biserial effect <em>r_b = 0.998</em>).
      </AnalyticalTakeaway>

      {/* Statistical Result Strip */}
      <div className="pt-2 border-t border-slate-100 dark:border-white/[0.06] grid grid-cols-4 gap-2 text-center text-[10.5px]">
        <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-white/[0.03]">
          <span className="text-slate-400 block text-[9px] font-mono font-bold uppercase">Method</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">Mann-Whitney U</span>
        </div>
        <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-white/[0.03]">
          <span className="text-slate-400 block text-[9px] font-mono font-bold uppercase">Test Stat</span>
          <span className="font-mono font-bold text-blue-600 dark:text-blue-400">U = 2.69 × 10¹²</span>
        </div>
        <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-white/[0.03]">
          <span className="text-slate-400 block text-[9px] font-mono font-bold uppercase">Rank-Biserial</span>
          <span className="font-mono font-bold text-purple-600 dark:text-purple-400">r_b = 0.998</span>
        </div>
        <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <span className="text-emerald-600 dark:text-emerald-400 block text-[9px] font-mono font-bold uppercase">Significance</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400">p &lt; 0.0001</span>
        </div>
      </div>
    </div>
  );
}
