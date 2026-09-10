import React, { useState, useRef } from 'react';
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
import StatBadge from '../../../components/common/StatBadge';
import AnalyticalTakeaway from '../../../components/common/AnalyticalTakeaway';
import DownloadVisualButton from './DownloadVisualButton';

interface H3UrgencyRegressionProps {
  isDarkMode: boolean;
}

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
            HYPOTHESIS H3 · WEIGHTED LEAST SQUARES (WLS)
          </span>
          <div className="flex items-center gap-2">
            <StatBadge label="Reject H₀" sublabel="R² = 0.6256" variant="reject" />
            <DownloadVisualButton
              cardRef={cardRef}
              visualTitle="H3_Urgency_Score_WLS_Regression"
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
          CTAS Urgency Score vs Reported Stay
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
          Linear regression demonstrates significant negative slope between urgency score (1–5) and stay duration.
        </p>

        <div className="h-[230px] pt-1 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              margin={{ top: 15, right: 30, bottom: 25, left: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200/60 dark:text-slate-800/80" />
              <XAxis
                type="number"
                dataKey="score"
                name="Urgency Score"
                domain={[0.5, 5.5]}
                ticks={[1, 2, 3, 4, 5]}
                tick={{ fontSize: 10, fill: dark ? '#94a3b8' : '#64748b', fontFamily: 'monospace' }}
                stroke="#94a3b8"
                height={35}
                label={{
                  value: 'CTAS Urgency Score (1 = Resuscitation → 5 = Non-Urgent)',
                  position: 'insideBottom',
                  offset: -10,
                  fill: dark ? '#94a3b8' : '#475569',
                  fontSize: 10.5,
                  fontWeight: 600,
                  fontFamily: 'monospace'
                }}
              />
              <YAxis
                type="number"
                dataKey="los_hours"
                name="Reported LOS"
                domain={[0, 6.0]}
                tick={{ fontSize: 10, fill: dark ? '#94a3b8' : '#64748b', fontFamily: 'monospace' }}
                tickFormatter={v => `${v}h`}
                stroke="#94a3b8"
                width={45}
                label={{
                  value: 'Median LOS (h)',
                  angle: -90,
                  position: 'insideLeft',
                  offset: 8,
                  style: { textAnchor: 'middle' },
                  fontSize: 10.5,
                  fill: dark ? '#94a3b8' : '#475569',
                  fontWeight: 600,
                  fontFamily: 'monospace'
                }}
              />
              <ZAxis type="number" dataKey="visits" range={[140, 650]} />
              <Tooltip content={<CustomScatterTooltip />} />
              <Scatter
                name="Observed Acuity Cohorts"
                data={SCATTER_BUBBLE_DATA}
                fill="#2563EB"
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
      <AnalyticalTakeaway title="REGRESSION FINDING">
        Urgency score significantly predicts reported stay duration: <strong>β₁ = -73.92 min/score (-1.23 h/score)</strong>, <strong>R² = 0.6256 (p &lt; 0.001)</strong>; robust explanatory power across 174.2M visits.
      </AnalyticalTakeaway>

      {/* Statistical Result Strip */}
      <div className="pt-2 border-t border-slate-100 dark:border-white/[0.06] grid grid-cols-4 gap-2 text-center text-[10.5px]">
        <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-white/[0.03]">
          <span className="text-slate-400 block text-[9px] font-mono font-bold uppercase">Slope (β₁)</span>
          <span className="font-mono font-bold text-slate-800 dark:text-slate-200">-1.23 h/score</span>
        </div>
        <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-white/[0.03]">
          <span className="text-slate-400 block text-[9px] font-mono font-bold uppercase">R-Squared</span>
          <span className="font-mono font-bold text-blue-600 dark:text-blue-400">R² = 0.6256</span>
        </div>
        <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-white/[0.03]">
          <span className="text-slate-400 block text-[9px] font-mono font-bold uppercase">95% CI</span>
          <span className="font-mono font-bold text-purple-600 dark:text-purple-400">[-1.30h, -1.16h]</span>
        </div>
        <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <span className="text-emerald-600 dark:text-emerald-400 block text-[9px] font-mono font-bold uppercase">Significance</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400">p &lt; 0.0001</span>
        </div>
      </div>
    </div>
  );
}
