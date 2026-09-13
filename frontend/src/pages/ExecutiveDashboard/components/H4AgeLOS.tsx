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

interface H4AgeLOSProps {
  isDarkMode: boolean;
}

const AGE_ORDERED_DATA = [
  { group: 'Pediatric & Youth (0-17)', short: 'Pediatric', los_hours: 2.05, los_min: 123, color: '#38BDF8', visits: '38.91M' },
  { group: 'Young Adult (18-34)', short: 'Young Adult', los_hours: 2.53, los_min: 152, color: '#3B82F6', visits: '57.97M' },
  { group: 'Middle Adult (35-64)', short: 'Middle Adult', los_hours: 2.87, los_min: 172, color: '#6366F1', visits: '41.67M' },
  { group: 'Older Adult (65+)', short: 'Older Adult', los_hours: 4.17, los_min: 250, color: '#0F4C81', visits: '37.21M' },
];

export default function H4AgeLOS({ isDarkMode }: H4AgeLOSProps) {
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
            HYPOTHESIS H4 · WEIGHTED KRUSKAL-WALLIS
          </span>
          <div className="flex items-center gap-2">
            <StatBadge label="Reject H₀" sublabel="p < 0.0001" variant="reject" />
            <DownloadVisualButton
              cardRef={cardRef}
              visualTitle="H4_Age_Group_LOS_Kruskal_Wallis"
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
          Age Group vs Reported Length of Stay
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
          Progressive monotonic duration rise from Pediatric (2.05 h) to Older Adult (4.17 h) cohorts.
        </p>

        <div className="h-[230px] pt-1 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={AGE_ORDERED_DATA}
              layout="vertical"
              margin={{ top: 10, right: 75, bottom: 25, left: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200/60 dark:text-slate-800/80" />
              <XAxis
                type="number"
                tick={{ fontSize: 10, fill: dark ? '#94a3b8' : '#64748b', fontFamily: 'monospace' }}
                tickFormatter={v => `${v}h`}
                stroke="#94a3b8"
                domain={[0, 5.0]}
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
              <Bar dataKey="los_hours" radius={[0, 4, 4, 0]} barSize={22}>
                {AGE_ORDERED_DATA.map((entry, index) => (
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
      <AnalyticalTakeaway title="DEMOGRAPHIC TRAJECTORY">
        Aggregate stay duration increases monotonically across age brackets (<strong>+103.4% rise in 65+</strong> relative to pediatric cases; ε² = 0.7218). Non-causal association.
      </AnalyticalTakeaway>

      {/* Statistical Result Strip */}
      <div className="pt-2 border-t border-slate-100 dark:border-white/[0.06] grid grid-cols-4 gap-2 text-center text-[10.5px]">
        <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-white/[0.03]">
          <span className="text-slate-400 block text-[9px] font-mono font-bold uppercase">Method</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">Kruskal-Wallis</span>
        </div>
        <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-white/[0.03]">
          <span className="text-slate-400 block text-[9px] font-mono font-bold uppercase">Test Stat</span>
          <span className="font-mono font-bold text-blue-600 dark:text-blue-400">H = 1.27 × 10⁸</span>
        </div>
        <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-white/[0.03]">
          <span className="text-slate-400 block text-[9px] font-mono font-bold uppercase">Effect Size</span>
          <span className="font-mono font-bold text-purple-600 dark:text-purple-400">ε² = 0.7218</span>
        </div>
        <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <span className="text-emerald-600 dark:text-emerald-400 block text-[9px] font-mono font-bold uppercase">Significance</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400">p &lt; 0.0001</span>
        </div>
      </div>
    </div>
  );
}
