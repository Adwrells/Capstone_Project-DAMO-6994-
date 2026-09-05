import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ZAxis,
  LabelList,
} from 'recharts';
import { ShieldCheck } from 'lucide-react';

interface H3UrgencyRegressionProps {
  isDarkMode: boolean;
}

// Verified CTAS urgency data points with bubble size proportional to visit volume
const SCATTER_BUBBLE_DATA = [
  { score: 1, los_hours: 4.60, los_min: 276, visits: 1286555, visits_str: '1.29M', level: 'CTAS I - Resuscitation' },
  { score: 2, los_hours: 4.80, los_min: 288, visits: 26742361, visits_str: '26.74M', level: 'CTAS II - Emergent' },
  { score: 3, los_hours: 3.40, los_min: 204, visits: 72100128, visits_str: '72.10M', level: 'CTAS III - Urgent' },
  { score: 4, los_hours: 1.90, los_min: 114, visits: 58990020, visits_str: '58.99M', level: 'CTAS IV - Less Urgent' },
  { score: 5, los_hours: 1.33, los_min: 80, visits: 15088331, visits_str: '15.09M', level: 'CTAS V - Non-Urgent' },
];

function CustomScatterTooltip({ active, payload }: any) {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;

  return (
    <div className="bg-slate-900/95 dark:bg-[#0b1329]/95 backdrop-blur-md border border-slate-700/80 dark:border-blue-500/30 p-3 rounded-xl shadow-xl text-xs space-y-1.5 min-w-[210px]">
      <span className="font-bold text-slate-200 font-mono block border-b border-slate-700/60 pb-1">
        {d.level} (Score {d.score})
      </span>
      <div className="flex justify-between items-baseline gap-3">
        <span className="text-slate-400 text-[10px]">Reported Median LOS:</span>
        <span className="font-extrabold font-mono text-sm text-cyan-400">{d.los_hours.toFixed(2)} hrs</span>
      </div>
      <div className="flex justify-between items-baseline gap-3">
        <span className="text-slate-400 text-[10px]">Duration in Minutes:</span>
        <span className="font-mono text-slate-200">{d.los_min} min</span>
      </div>
      <div className="flex justify-between items-baseline gap-3 pt-1 border-t border-slate-800 text-[10px]">
        <span className="text-slate-400">ED Visit Volume:</span>
        <span className="font-mono text-slate-200 font-bold">{d.visits_str}</span>
      </div>
    </div>
  );
}

export default function H3UrgencyRegression({ isDarkMode }: H3UrgencyRegressionProps) {
  const dark = isDarkMode;

  return (
    <div
      className={`rounded-2xl border p-6 shadow-xs space-y-3.5 transition-colors flex flex-col justify-between h-full ${
        dark ? 'bg-[#131f37] border-[#1e2d4a]' : 'bg-white border-slate-200'
      }`}
    >
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0F4C81] dark:text-[#3B82F6] block">
            Hypothesis H3 · Primary Visual
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9.5px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck size={11} /> Reject H₀ (p &lt; 0.0001)
          </span>
        </div>
        <h3 className={`text-base font-extrabold ${dark ? 'text-white' : 'text-slate-900'}`}>
          CTAS Urgency Predicting Reported LOS
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-light">
          Bubble area is proportional to aggregate ED visit volume across acuity tiers
        </p>

        <div className="h-[230px] pt-1 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={SCATTER_BUBBLE_DATA}
              margin={{ top: 20, right: 30, bottom: 30, left: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200/60 dark:text-slate-800/80" />
              <XAxis
                type="number"
                dataKey="score"
                name="Urgency Score"
                domain={[0.5, 5.5]}
                ticks={[1, 2, 3, 4, 5]}
                tickFormatter={v => `CTAS ${v}`}
                tick={{ fontSize: 10, fill: dark ? '#94a3b8' : '#64748b', fontFamily: 'monospace', dy: 4 }}
                stroke="#94a3b8"
                height={42}
                label={{
                  value: 'CTAS Urgency Score (1 = Resuscitation → 5 = Non-Urgent)',
                  position: 'insideBottom',
                  offset: -12,
                  fontSize: 11,
                  fill: dark ? '#94a3b8' : '#475569',
                  fontWeight: 700,
                  fontFamily: 'monospace'
                }}
              />
              <YAxis
                type="number"
                dataKey="los_hours"
                name="Length of Stay"
                domain={[0, 6]}
                ticks={[0, 2, 4, 6]}
                tick={{ fontSize: 10, fill: dark ? '#94a3b8' : '#64748b', fontFamily: 'monospace' }}
                tickFormatter={v => `${v}h`}
                stroke="#94a3b8"
                width={65}
                label={{
                  value: 'Reported LOS (Hours)',
                  angle: -90,
                  position: 'insideLeft',
                  offset: 8,
                  style: { textAnchor: 'middle' },
                  fontSize: 11,
                  fill: dark ? '#94a3b8' : '#475569',
                  fontWeight: 700,
                  fontFamily: 'monospace'
                }}
              />
              <ZAxis type="number" dataKey="visits" range={[140, 650]} />
              <Tooltip content={<CustomScatterTooltip />} />
              <Scatter
                name="Observed Acuity Cohorts"
                data={SCATTER_BUBBLE_DATA}
                fill="#0F4C81"
                stroke="#38BDF8"
                strokeWidth={2}
              >
                <LabelList
                  dataKey="los_hours"
                  position="top"
                  offset={12}
                  formatter={(v: any) => `${Number(v).toFixed(2)}h`}
                  fill={dark ? '#38BDF8' : '#0284C7'}
                  fontSize={10.5}
                  fontWeight={700}
                  fontFamily="monospace"
                />
              </Scatter>
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Analytical Takeaway Note */}
      <div className={`px-3 py-2 rounded-xl border text-[11px] leading-relaxed ${
        dark ? 'bg-[#152033]/60 border-[#1e2d4a] text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'
      }`}>
        <span>
          <strong>Analytical Interpretation:</strong> Within the aggregate CTAS cohort, weighted regression identifies a statistically significant linear relationship between CTAS urgency score and reported median LOS (<em>R² = 0.6256, p &lt; 0.001</em>); explanatory at the aggregate level, not establishing individual-level causality.
        </span>
      </div>

      {/* Compact Evidence Panel */}
      <div className="pt-2 border-t border-slate-100 dark:border-[#1e2d4a] grid grid-cols-4 gap-2 text-center text-[10px]">
        <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-[#182640]">
          <span className="text-slate-400 block text-[8.5px] font-bold uppercase">Slope (β₁)</span>
          <span className="font-mono font-bold text-slate-800 dark:text-slate-200">-1.23 h/score</span>
        </div>
        <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-[#182640]">
          <span className="text-slate-400 block text-[8.5px] font-bold uppercase">R-Squared</span>
          <span className="font-mono font-bold text-blue-600 dark:text-blue-400">R² = 0.6256</span>
        </div>
        <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-[#182640]">
          <span className="text-slate-400 block text-[8.5px] font-bold uppercase">95% CI</span>
          <span className="font-mono font-bold text-purple-600 dark:text-purple-400">[-1.30h, -1.16h]</span>
        </div>
        <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40">
          <span className="text-emerald-600 dark:text-emerald-400 block text-[8.5px] font-bold uppercase">Decision</span>
          <span className="font-bold text-emerald-700 dark:text-emerald-300">Reject H₀</span>
        </div>
      </div>
    </div>
  );
}
