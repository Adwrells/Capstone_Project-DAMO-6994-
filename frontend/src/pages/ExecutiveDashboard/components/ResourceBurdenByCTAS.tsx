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
import { Zap, Info } from 'lucide-react';
import { fmtK } from './formatters';

interface ResourceBurdenByCTASProps {
  isDarkMode: boolean;
}

const BURDEN_RANKED_DATA = [
  { level: 'CTAS III - Urgent', short: 'CTAS III (Urgent)', burden_hours: 766.69, raw_burden: 766689463, pct_share: 52.3, erbi_score: 10.63, visits: '72.10M', color: '#F59E0B' },
  { level: 'Less urgent (CTAS IV)', short: 'CTAS IV (Less Urgent)', burden_hours: 361.43, raw_burden: 361431941, pct_share: 24.7, erbi_score: 6.13, visits: '58.99M', color: '#3B82F6' },
  { level: 'CTAS II - Emergent', short: 'CTAS II (Emergent)', burden_hours: 259.41, raw_burden: 259407115, pct_share: 17.7, erbi_score: 9.70, visits: '26.74M', color: '#F97316' },
  { level: 'Non-urgent (CTAS V)', short: 'CTAS V (Non-Urgent)', burden_hours: 65.46, raw_burden: 65458737, pct_share: 4.5, erbi_score: 4.34, visits: '15.09M', color: '#10B981' },
  { level: 'CTAS I - Resuscitation', short: 'CTAS I (Resuscitation)', burden_hours: 6.04, raw_burden: 6039195, pct_share: 0.4, erbi_score: 4.69, visits: '1.29M', color: '#EF4444' },
];

function CustomBurdenTooltip({ active, payload }: any) {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;

  return (
    <div className="bg-slate-900/95 dark:bg-[#0b1329]/95 backdrop-blur-md border border-slate-700/80 dark:border-purple-500/30 p-3 rounded-xl shadow-xl text-xs space-y-1.5 min-w-[220px]">
      <span className="font-bold text-slate-200 font-mono block border-b border-slate-700/60 pb-1">
        {d.level}
      </span>
      <div className="flex justify-between items-baseline gap-3">
        <span className="text-purple-400 font-medium">Estimated Burden:</span>
        <span className="font-mono font-bold text-white">{d.burden_hours}M Patient-Hours</span>
      </div>
      <div className="flex justify-between items-baseline gap-3">
        <span className="text-slate-400 text-[10px]">Aggregate Share:</span>
        <span className="font-mono text-cyan-300 font-bold">{d.pct_share}% of Total</span>
      </div>
      <div className="flex justify-between items-baseline gap-3">
        <span className="text-slate-400 text-[10px]">Mean ERBI Index:</span>
        <span className="font-mono text-amber-300 font-bold">{d.erbi_score}</span>
      </div>
      <div className="flex justify-between items-baseline gap-3 pt-1 border-t border-slate-800 text-[10px]">
        <span className="text-slate-400">Total Visits:</span>
        <span className="font-mono text-slate-200">{d.visits}</span>
      </div>
    </div>
  );
}

export default function ResourceBurdenByCTAS({ isDarkMode }: ResourceBurdenByCTASProps) {
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
              Operational Modeling · Primary Visual
            </span>
            <h3 className={`text-sm font-extrabold ${dark ? 'text-white' : 'text-slate-900'}`}>
              Estimated Resource Burden by CTAS
            </h3>
            <p className="text-[10px] text-slate-400">Aggregate Acuity-Hours = Urgency Score × Length of Stay × Visits</p>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
            <Zap size={11} /> Top: CTAS III (52.3%)
          </span>
        </div>

        <div style={{ height: 230 }} className="mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={BURDEN_RANKED_DATA}
              layout="vertical"
              margin={{ top: 10, right: 40, bottom: 10, left: 110 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200/60 dark:text-slate-800/80" />
              <XAxis
                type="number"
                tick={{ fontSize: 9, fill: '#64748b', fontFamily: 'monospace' }}
                tickFormatter={v => `${v}M`}
                stroke="#94a3b8"
              />
              <YAxis
                type="category"
                dataKey="short"
                tick={{ fontSize: 9.5, fill: '#64748b', fontWeight: 600 }}
                stroke="#94a3b8"
                width={105}
              />
              <Tooltip content={<CustomBurdenTooltip />} />
              <Bar dataKey="burden_hours" radius={[0, 6, 6, 0]} barSize={20}>
                {BURDEN_RANKED_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Clinical Context Footnote */}
      <div className={`p-2.5 rounded-xl border text-[10px] leading-relaxed flex items-start gap-2 ${
        dark ? 'bg-[#152033] border-[#1e2d4a] text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'
      }`}>
        <Info size={13} className="text-[#0F4C81] dark:text-[#3B82F6] shrink-0 mt-0.5" />
        <span>
          <strong>Operational Implication:</strong> CTAS III (Urgent) represents over <strong>52.3% (766.7M hours)</strong> of total emergency system burden, driven by moderate acuity paired with high volume (72.1M visits).
        </span>
      </div>
    </div>
  );
}
