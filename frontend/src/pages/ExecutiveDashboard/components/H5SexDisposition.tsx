import React, { useState, useRef } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
} from 'recharts';
import StatBadge from '../../../components/common/StatBadge';
import AnalyticalTakeaway from '../../../components/common/AnalyticalTakeaway';
import DownloadVisualButton from './DownloadVisualButton';

interface H5SexDispositionProps {
  isDarkMode: boolean;
}

const SEX_DISP_STACKED_DATA = [
  {
    sex: 'Female Patients',
    short: 'Female',
    'Non-Admitted': 90.05,
    Admitted: 9.95,
    non_admitted_count: '81.93M',
    admitted_count: '9.05M',
    total: '90.98M',
  },
  {
    sex: 'Male Patients',
    short: 'Male',
    'Non-Admitted': 89.44,
    Admitted: 10.56,
    non_admitted_count: '75.83M',
    admitted_count: '8.96M',
    total: '84.78M',
  },
];

function CustomH5Tooltip({ active, payload }: any) {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;

  return (
    <div className="bg-slate-900/95 dark:bg-[#0b1329]/95 backdrop-blur-md border border-slate-700/80 dark:border-blue-500/30 p-3 rounded-xl shadow-xl text-xs space-y-1.5 min-w-[210px]">
      <span className="font-bold text-slate-200 font-mono block border-b border-slate-700/60 pb-1">
        {d.sex} (Total N = {d.total})
      </span>
      <div className="flex justify-between items-baseline gap-3">
        <span className="text-emerald-400 font-medium">Non-Admitted:</span>
        <span className="font-mono font-bold text-emerald-300">{d['Non-Admitted']}% ({d.non_admitted_count})</span>
      </div>
      <div className="flex justify-between items-baseline gap-3">
        <span className="text-rose-400 font-medium">Admitted Inpatient:</span>
        <span className="font-mono font-bold text-rose-300">{d.Admitted}% ({d.admitted_count})</span>
      </div>
      <span className="text-[9.5px] text-slate-400 font-mono block pt-1 border-t border-slate-800">
        Disparity Δ = +0.61% higher admission for males
      </span>
    </div>
  );
}

export default function H5SexDisposition({ isDarkMode }: H5SexDispositionProps) {
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
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            HYPOTHESIS H5 · PEARSON CHI-SQUARE (N = 175.8M)
          </span>
          <div className="flex items-center gap-2">
            <StatBadge label="Reject H₀ (Negligible)" sublabel="V = 0.0102" variant="negligible" />
            <DownloadVisualButton
              cardRef={cardRef}
              visualTitle="H5_Sex_Disposition_Chi_Square"
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
          Patient Sex vs Visit Disposition
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
          Inpatient admission proportions between Female and Male clinical cohorts across 175.76M encounters.
        </p>

        <div className="h-[185px] pt-1 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={SEX_DISP_STACKED_DATA}
              layout="vertical"
              margin={{ top: 10, right: 30, bottom: 25, left: 10 }}
              stackOffset="expand"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200/60 dark:text-slate-800/80" />
              <XAxis
                type="number"
                tick={{ fontSize: 10, fill: dark ? '#94a3b8' : '#64748b', fontFamily: 'monospace' }}
                tickFormatter={v => `${Math.round(v * 100)}%`}
                stroke="#94a3b8"
                domain={[0, 1]}
                height={35}
                label={{
                  value: 'Visit Disposition Proportion (%)',
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
                width={75}
              />
              <Tooltip content={<CustomH5Tooltip />} />
              <Bar dataKey="Non-Admitted" stackId="a" fill="#10B981" barSize={24} name="Non-Admitted (%)">
                <LabelList
                  dataKey="Non-Admitted"
                  position="center"
                  formatter={(v: any) => `${Number(v).toFixed(1)}%`}
                  fill="#ffffff"
                  fontSize={10.5}
                  fontWeight={700}
                  fontFamily="monospace"
                />
              </Bar>
              <Bar dataKey="Admitted" stackId="a" fill="#EF4444" barSize={24} name="Admitted Inpatient (%)">
                <LabelList
                  dataKey="Admitted"
                  position="center"
                  formatter={(v: any) => `${Number(v).toFixed(1)}%`}
                  fill="#ffffff"
                  fontSize={10.5}
                  fontWeight={700}
                  fontFamily="monospace"
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 text-[11px] font-medium text-slate-500 dark:text-slate-400 pt-0.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#10B981]" />
            <span>Non-Admitted Discharges (~90%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#EF4444]" />
            <span>Admitted Inpatients (~10%)</span>
          </div>
        </div>
      </div>

      {/* Analytical Takeaway Note */}
      <AnalyticalTakeaway title="PRACTICAL ASSESSMENT">
        Difference in admitted proportion is only <strong>+0.61 percentage points</strong> (9.95% Female vs 10.56% Male). Statistical detectability is driven by the massive sample size (N = 175.76M); operational effect is negligible.
      </AnalyticalTakeaway>

      {/* Statistical Result Strip */}
      <div className="pt-2 border-t border-slate-100 dark:border-white/[0.06] grid grid-cols-4 gap-2 text-center text-[10.5px]">
        <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-white/[0.03]">
          <span className="text-slate-400 block text-[9px] font-mono font-bold uppercase">Method</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">Pearson Chi-Square</span>
        </div>
        <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-white/[0.03]">
          <span className="text-slate-400 block text-[9px] font-mono font-bold uppercase">Chi-Square (χ²)</span>
          <span className="font-mono font-bold text-blue-600 dark:text-blue-400">χ² = 18,165</span>
        </div>
        <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-white/[0.03]">
          <span className="text-slate-400 block text-[9px] font-mono font-bold uppercase">Cramér's V</span>
          <span className="font-mono font-bold text-amber-500">V = 0.0102</span>
        </div>
        <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <span className="text-amber-600 dark:text-amber-400 block text-[9px] font-mono font-bold uppercase">Significance</span>
          <span className="font-bold text-amber-600 dark:text-amber-400">p &lt; 0.0001 (Negl.)</span>
        </div>
      </div>
    </div>
  );
}
