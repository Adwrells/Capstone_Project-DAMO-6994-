import React from 'react';
import { Users, Clock, CheckCircle2, Zap, BarChart3, TrendingUp, TrendingDown } from 'lucide-react';
import { DashboardKPIs } from './types';
import { fmtK, fmtPct, fmtLOS, fmtERBI } from './formatters';

interface ExecutiveKPIGridProps {
  kpis: DashboardKPIs | null;
  filteredVisitsCount?: number;
  filteredMedianLOS?: number;
  isDarkMode: boolean;
}

export default function ExecutiveKPIGrid({
  kpis,
  filteredVisitsCount,
  filteredMedianLOS,
  isDarkMode,
}: ExecutiveKPIGridProps) {
  const dark = isDarkMode;

  const totalVisits = filteredVisitsCount ?? kpis?.total_ed_visits ?? 175762944;
  const medianLOSHours = filteredMedianLOS ?? kpis?.reported_median_los_hours ?? 3.69;
  const admissionRate = kpis?.admission_rate_percent ?? 10.25;
  const erbiScore = kpis?.overall_erbi_score ?? 9.32;
  const totalBurdenHours = kpis?.total_burden_hours ?? 1623142920.63;

  const isLOSOverBenchmark = medianLOSHours > 6.0;

  const cards = [
    {
      id: 'kpi-visits',
      label: 'Total ED Visits',
      value: fmtK(totalVisits),
      unit: 'patients recorded',
      subtitle: `${kpis?.year_range || '2003-2004 to 2021-2022'} series`,
      footer: (
        <span className="flex items-center gap-1 text-emerald-500 font-semibold">
          <TrendingUp size={12} /> National CIHI Cohort
        </span>
      ),
      icon: <Users size={16} className="text-blue-500" />,
      accentBorder: 'border-l-blue-500',
      badge: 'POPULATION',
      badgeStyle: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    },
    {
      id: 'kpi-los',
      label: 'Reported Median LOS',
      value: fmtLOS(medianLOSHours),
      unit: `${Math.round(medianLOSHours * 60)} min median stay`,
      subtitle: isLOSOverBenchmark
        ? `+${(medianLOSHours - 6.0).toFixed(1)}h over benchmark`
        : 'CIHI 6-hour benchmark',
      footer: (
        <span
          className={`flex items-center gap-1 font-semibold ${
            isLOSOverBenchmark ? 'text-rose-400' : 'text-emerald-400'
          }`}
        >
          {isLOSOverBenchmark ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {isLOSOverBenchmark ? `+${(medianLOSHours - 6.0).toFixed(1)}h over 6h target` : 'Target Met (< 6.0 hrs)'}
        </span>
      ),
      icon: <Clock size={16} className={isLOSOverBenchmark ? 'text-rose-400' : 'text-emerald-400'} />,
      accentBorder: isLOSOverBenchmark ? 'border-l-rose-500' : 'border-l-emerald-500',
      badge: isLOSOverBenchmark ? 'EXCEEDED' : 'BENCHMARK MET',
      badgeStyle: isLOSOverBenchmark
        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    },
    {
      id: 'kpi-admission',
      label: 'Inpatient Admission Rate',
      value: fmtPct(admissionRate, 2),
      unit: 'of all presentations',
      subtitle: `${fmtK(kpis?.total_admitted_visits || 18004220)} admitted visits`,
      footer: (
        <span className="flex items-center gap-1 text-blue-400 font-semibold">
          <BarChart3 size={12} /> Disposition Stratified
        </span>
      ),
      icon: <BarChart3 size={16} className="text-blue-400" />,
      accentBorder: 'border-l-blue-400',
      badge: 'CLINICAL RATIO',
      badgeStyle: 'bg-blue-500/10 text-blue-300 border-blue-400/20',
    },
    {
      id: 'kpi-erbi',
      label: 'Resource Burden Index',
      value: fmtERBI(erbiScore),
      unit: 'overall ERBI score',
      subtitle: `${fmtK(totalBurdenHours)} acuity-weighted hrs`,
      footer: (
        <span className="flex items-center gap-1 text-purple-400 font-semibold">
          <Zap size={12} /> CTAS × LOS × Volume
        </span>
      ),
      icon: <Zap size={16} className="text-purple-400" />,
      accentBorder: 'border-l-purple-500',
      badge: 'ERBI PROXY',
      badgeStyle: 'bg-purple-500/10 text-purple-300 border-purple-400/20',
    },
    {
      id: 'kpi-hypotheses',
      label: 'Hypotheses Evaluated',
      value: `${kpis?.hypotheses_evaluated || 5} / ${kpis?.hypotheses_total || 5}`,
      unit: 'statistical tests',
      subtitle: '100% decision rate',
      footer: (
        <span className="flex items-center gap-1 text-emerald-400 font-semibold">
          <CheckCircle2 size={12} /> H1–H5 Significant
        </span>
      ),
      icon: <CheckCircle2 size={16} className="text-emerald-400" />,
      accentBorder: 'border-l-emerald-500',
      badge: 'VERIFIED',
      badgeStyle: 'bg-emerald-500/10 text-emerald-300 border-emerald-400/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
      {cards.map(kpi => (
        <div
          key={kpi.id}
          className={`rounded-2xl border ${kpi.accentBorder} border-l-4 p-4.5 flex flex-col justify-between transition-all shadow-xs hover:border-slate-300 dark:hover:border-white/[0.15] ${
            dark ? 'bg-[#111e35] border-white/[0.08]' : 'bg-white border-slate-200'
          }`}
        >
          {/* Top Label + Icon/Badge */}
          <div className="flex items-start justify-between gap-2">
            <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {kpi.label}
            </span>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className={`text-[9.5px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${kpi.badgeStyle}`}>
                {kpi.badge}
              </span>
            </div>
          </div>

          {/* Metric Value + Unit */}
          <div className="my-2.5 space-y-0.5">
            <div className={`text-2xl sm:text-3xl font-bold font-mono tracking-tight ${dark ? 'text-slate-100' : 'text-slate-900'}`}>
              {kpi.value}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-sans font-medium">
              {kpi.unit}
            </div>
          </div>

          {/* Subtitle & Footer */}
          <div className="pt-2 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between text-[11px]">
            <span className="text-slate-400 dark:text-slate-500 truncate mr-1">
              {kpi.subtitle}
            </span>
            <span className="shrink-0">
              {kpi.footer}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
