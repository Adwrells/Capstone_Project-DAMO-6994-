import React from 'react';
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
import { ShieldCheck } from 'lucide-react';
import { fmtPct, fmtP } from './formatters';

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

function CustomH5Tooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;

  return (
    <div className="bg-slate-900/95 dark:bg-[#0b1329]/95 backdrop-blur-md border border-slate-700/80 dark:border-blue-500/30 p-3 rounded-xl shadow-xl text-xs space-y-1.5 min-w-[210px]">
      <span className="font-bold text-slate-200 font-mono block border-b border-slate-700/60 pb-1">
        {d.sex} (Total N = {d.total})
      </span>
      <div className="flex justify-between items-baseline gap-3">
        <span className="text-emerald-400 font-medium">Non-Admitted %:</span>
        <span className="font-mono font-bold text-emerald-300">{d['Non-Admitted']}% ({d.non_admitted_count})</span>
      </div>
      <div className="flex justify-between items-baseline gap-3">
        <span className="text-rose-400 font-medium">Inpatient Admitted %:</span>
        <span className="font-mono font-bold text-rose-300">{d.Admitted}% ({d.admitted_count})</span>
      </div>
      <span className="text-[9px] text-slate-400 font-mono block pt-1 border-t border-slate-800">
        Disparity Δ = +0.61% higher admission for males
      </span>
    </div>
  );
}

export default function H5SexDisposition({ isDarkMode }: H5SexDispositionProps) {
  const dark = isDarkMode;

  return (
    <div
      className={`rounded-2xl border p-6 shadow-xs space-y-4 transition-colors flex flex-col justify-between h-full ${
        dark ? 'bg-[#131f37] border-[#1e2d4a]' : 'bg-white border-slate-200'
      }`}
    >
      <div className="space-y-1">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0F4C81] dark:text-[#3B82F6] block">
            Hypothesis H5 · Primary Visual
          </span>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9.5px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
              <ShieldCheck size={11} /> p &lt; 0.0001 · Negligible Practical Effect (V = 0.010)
            </span>
            <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              Priority: Monitor
            </span>
          </div>
        </div>
        <h3 className={`text-base font-extrabold ${dark ? 'text-white' : 'text-slate-900'}`}>
          Patient Sex vs Visit Disposition (100% Stacked Proportions)
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-light">
          Comparative inpatient admission proportions between Female and Male clinical cohorts across 175.76M encounters
        </p>

        <div className="h-[190px] pt-2 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={SEX_DISP_STACKED_DATA}
              layout="vertical"
              margin={{ top: 10, right: 30, bottom: 30, left: 10 }}
              stackOffset="expand"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200/60 dark:text-slate-800/80" />
              <XAxis
                type="number"
                tick={{ fontSize: 10, fill: dark ? '#94a3b8' : '#64748b', fontFamily: 'monospace' }}
                tickFormatter={v => `${Math.round(v * 100)}%`}
                stroke="#94a3b8"
                domain={[0, 1]}
                height={38}
                label={{
                  value: 'Visit Disposition Proportion (%)',
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
                width={80}
              />
              <Tooltip content={<CustomH5Tooltip />} />
              <Bar dataKey="Non-Admitted" stackId="a" fill="#10B981" barSize={26} name="Non-Admitted (%)">
                <LabelList
                  dataKey="Non-Admitted"
                  position="center"
                  formatter={(v: any) => `${Number(v).toFixed(1)}%`}
                  fill="#ffffff"
                  fontSize={11}
                  fontWeight={700}
                  fontFamily="monospace"
                />
              </Bar>
              <Bar dataKey="Admitted" stackId="a" fill="#EF4444" barSize={26} name="Admitted Inpatient (%)">
                <LabelList
                  dataKey="Admitted"
                  position="center"
                  formatter={(v: any) => `${Number(v).toFixed(1)}%`}
                  fill="#ffffff"
                  fontSize={11}
                  fontWeight={700}
                  fontFamily="monospace"
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 text-[11px] font-medium text-slate-500 dark:text-slate-400 pt-1">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-[#10B981]" />
            <span>Non-Admitted Discharges (~90%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-[#EF4444]" />
            <span>Admitted Inpatients (~10%)</span>
          </div>
        </div>
      </div>

      {/* Analytical Callout Note */}
      <div className={`px-3 py-2 rounded-xl border text-[11px] leading-relaxed ${
        dark ? 'bg-[#152033]/60 border-[#1e2d4a] text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'
      }`}>
        <span>
          <strong>Practical Assessment:</strong> Difference in admitted proportion is only <strong>+0.61 percentage points</strong> (9.95% Female vs 10.56% Male). Statistical detectability is driven by the massive sample size (N = 175.76M); operational effect is negligible.
        </span>
      </div>

      {/* Compact Evidence Panel */}
      <div className="pt-2 border-t border-slate-100 dark:border-[#1e2d4a] grid grid-cols-4 gap-2 text-center text-[10px]">
        <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-[#182640]">
          <span className="text-slate-400 block text-[8.5px] font-bold uppercase">Method</span>
          <span className="font-bold text-slate-800 dark:text-slate-200 truncate">Pearson Chi-Square</span>
        </div>
        <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-[#182640]">
          <span className="text-slate-400 block text-[8.5px] font-bold uppercase">Chi-Square (χ²)</span>
          <span className="font-mono font-bold text-blue-600 dark:text-blue-400">χ² = 18,165</span>
        </div>
        <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-[#182640]">
          <span className="text-slate-400 block text-[8.5px] font-bold uppercase">Cramér's V</span>
          <span className="font-mono font-bold text-amber-500">V = 0.010 (Negligible)</span>
        </div>
        <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40">
          <span className="text-emerald-600 dark:text-emerald-400 block text-[8.5px] font-bold uppercase">Decision</span>
          <span className="font-bold text-amber-700 dark:text-amber-300">Reject H₀ (Negligible)</span>
        </div>
      </div>
    </div>
  );
}
