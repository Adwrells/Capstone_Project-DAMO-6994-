import React, { useState, useRef } from 'react';
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
import DownloadVisualButton from './DownloadVisualButton';

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
  const [overrideTheme, setOverrideTheme] = useState<'light' | 'dark' | null>(null);
  const dark = overrideTheme !== null ? overrideTheme === 'dark' : isDarkMode;
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={cardRef}
      className={`rounded-2xl border p-5 shadow-xs space-y-3 transition-colors flex flex-col justify-between h-full ${
        dark ? 'bg-[#111e35] border-white/[0.08]' : 'bg-white border-slate-200'
      }`}
    >
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            HYPOTHESIS H1 · WEIGHTED KRUSKAL-WALLIS
          </span>
          <div className="flex items-center gap-2">
            <StatBadge label="Reject H₀" sublabel="p < 0.0001" variant="reject" />
            <DownloadVisualButton
              cardRef={cardRef}
              visualTitle="H1_CTAS_Triage_LOS_Kruskal_Wallis"
              isDarkMode={dark}
              onSetTheme={async (theme) => {
                setOverrideTheme(theme);
                await new Promise((r) => setTimeout(r, 120));
              }}
              onResetTheme={() => setOverrideTheme(null)}
            />
          </div>
        </div>
        <h3 className={`text-base font-semibold ${dark ? 'text-slate-100' : 'text-slate-900'}`}>
          Reported Median LOS Across CTAS Triage Levels
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
          Non-linear duration gradient across acuity tiers (CTAS I Resuscitation → CTAS V Non-Urgent).
        </p>

        <div className="h-[230px] pt-1 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={CTAS_ORDERED_DATA}
              layout="vertical"
              margin={{ top: 10, right: 75, bottom: 25, left: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200/60 dark:text-slate-800/80" />
              <XAxis
                type="number"
                tick={{ fontSize: 10, fill: dark ? '#94a3b8' : '#64748b', fontFamily: 'monospace' }}
                tickFormatter={v => `${v}h`}
                stroke="#94a3b8"
                domain={[0, 6]}
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
                width={85}
              />
              <Tooltip
                formatter={(val: any, _name: string, item: any) => [
                  `${val} h (${item.payload.los_min} min) · ${item.payload.visits} visits`,
                  item.payload.level,
                ]}
                contentStyle={{
                  backgroundColor: dark ? '#0f172a' : '#ffffff',
                  borderRadius: '0.75rem',
                  borderColor: dark ? '#334155' : '#e2e8f0',
                  color: dark ? '#fff' : '#0f172a',
                  fontSize: '11px',
                }}
              />
              <Bar dataKey="los_hours" radius={[0, 4, 4, 0]} barSize={20}>
                {CTAS_ORDERED_DATA.map((entry, index) => (
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
      <AnalyticalTakeaway title="ANALYTICAL FINDING">
        Significant aggregate duration differences exist across tiers. <strong>CTAS II Emergent peaks at 4.80h (288m)</strong> due to extensive stabilization and diagnostic workups prior to admission.
      </AnalyticalTakeaway>

      {/* Statistical Result Strip */}
      <div className="pt-2 border-t border-slate-100 dark:border-white/[0.06] grid grid-cols-4 gap-2 text-center text-[10.5px]">
        <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-white/[0.03]">
          <span className="text-slate-400 block text-[9px] font-mono font-bold uppercase">Method</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">Kruskal-Wallis</span>
        </div>
        <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-white/[0.03]">
          <span className="text-slate-400 block text-[9px] font-mono font-bold uppercase">Test Stat</span>
          <span className="font-mono font-bold text-blue-600 dark:text-blue-400">H = 1.26 × 10⁸</span>
        </div>
        <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-white/[0.03]">
          <span className="text-slate-400 block text-[9px] font-mono font-bold uppercase">Effect Size</span>
          <span className="font-mono font-bold text-purple-600 dark:text-purple-400">ε² = 0.725</span>
        </div>
        <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <span className="text-emerald-600 dark:text-emerald-400 block text-[9px] font-mono font-bold uppercase">Significance</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400">p &lt; 0.0001</span>
        </div>
      </div>
    </div>
  );
}
