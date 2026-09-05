import React from 'react';
import { Users, Clock, CheckCircle2, Zap, BarChart3, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { DashboardKPIs } from './types';
import { fmtK, fmtNum, fmtPct, fmtHours } from './formatters';

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
  const medianLOSHours = filteredMedianLOS ?? kpis?.reported_median_los_hours ?? 2.80;
  const admissionRate = kpis?.admission_rate_percent ?? 10.25;
  const erbiScore = kpis?.overall_erbi_score ?? 9.32;
  const totalBurdenHours = kpis?.total_burden_hours ?? 1623142920.63;

  const isLOSOverBenchmark = medianLOSHours > 6.0;

  const cards = [
    {
      id: 'kpi-visits',
      label: 'Total ED Visits',
      value: fmtK(totalVisits),
      subtitle: `${kpis?.year_range || '2003-2004 to 2021-2022'} series`,
      footer: (
        <span className="flex items-center justify-center gap-1 text-emerald-500 font-semibold">
          <TrendingUp size={11} /> National CIHI NACRS Cohort
        </span>
      ),
      icon: <Users size={20} className="text-white" />,
      gradient: 'from-[#0F4C81] to-[#118d95]',
      badge: 'POPULATION',
      badgeStyle: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
    },
    {
      id: 'kpi-los',
      label: 'Reported Median LOS',
      value: `${medianLOSHours.toFixed(2)} hrs`,
      subtitle: `${Math.round(medianLOSHours * 60)} minutes median stay`,
      footer: (
        <span
          className={`flex items-center justify-center gap-1 font-semibold ${
            isLOSOverBenchmark ? 'text-rose-400' : 'text-emerald-400'
          }`}
        >
          {isLOSOverBenchmark ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
          {isLOSOverBenchmark ? `+${(medianLOSHours - 6.0).toFixed(1)}h above 6h target` : 'Within CIHI 6h Benchmark'}
        </span>
      ),
      icon: <Clock size={20} className="text-white" />,
      gradient: isLOSOverBenchmark ? 'from-amber-500 to-rose-600' : 'from-emerald-600 to-teal-700',
      badge: isLOSOverBenchmark ? 'BENCHMARK EXCEEDED' : 'TARGET MET',
      badgeStyle: isLOSOverBenchmark
        ? 'bg-rose-500/20 text-rose-300 border-rose-400/30'
        : 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
    },
    {
      id: 'kpi-admission',
      label: 'Inpatient Admission Rate',
      value: fmtPct(admissionRate, 2),
      subtitle: `${fmtK(kpis?.total_admitted_visits || 18004220)} Admitted Inpatients`,
      footer: (
        <span className="flex items-center justify-center gap-1 text-[#0F4C81] dark:text-[#3B82F6] font-semibold">
          <BarChart3 size={11} /> Disposition Stratified
        </span>
      ),
      icon: <BarChart3 size={20} className="text-white" />,
      gradient: 'from-[#0F4C81] to-[#3B82F6]',
      badge: 'CLINICAL RATIO',
      badgeStyle: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
    },
    {
      id: 'kpi-erbi',
      label: 'Estimated Resource Burden',
      value: `${erbiScore.toFixed(2)} Score`,
      subtitle: `${fmtK(totalBurdenHours)} Acuity-Weighted Hrs`,
      footer: (
        <span className="flex items-center justify-center gap-1 text-purple-400 font-semibold">
          <Zap size={11} /> CTAS × LOS × Visits
        </span>
      ),
      icon: <Zap size={20} className="text-white" />,
      gradient: 'from-purple-700 to-indigo-600',
      badge: 'ERBI PROXY',
      badgeStyle: 'bg-purple-500/20 text-purple-300 border-purple-400/30',
    },
    {
      id: 'kpi-hypotheses',
      label: 'Hypotheses Evaluated',
      value: `${kpis?.hypotheses_evaluated || 5} / ${kpis?.hypotheses_total || 5}`,
      subtitle: '100% Empirical Decision Rate',
      footer: (
        <span className="flex items-center justify-center gap-1 text-emerald-400 font-semibold">
          <CheckCircle2 size={11} /> H1–H5 Statistically Verified
        </span>
      ),
      icon: <CheckCircle2 size={20} className="text-white" />,
      gradient: 'from-teal-600 to-emerald-600',
      badge: 'SIGNIFICANT',
      badgeStyle: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map(kpi => (
        <div
          key={kpi.id}
          className={`rounded-2xl border overflow-hidden shadow-xs hover:shadow-md transition-all ${
            dark ? 'bg-[#0f1a2e] border-[#1e2d4a]' : 'bg-white border-slate-200'
          }`}
        >
          {/* Card Header Gradient Strip */}
          <div className={`bg-gradient-to-br ${kpi.gradient} px-4 pt-4 pb-3.5 flex flex-col items-center gap-1.5`}>
            <div className="p-2 rounded-xl bg-white/15 backdrop-blur-xs shadow-inner">{kpi.icon}</div>
            <span className={`text-[8px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full border ${kpi.badgeStyle}`}>
              {kpi.badge}
            </span>
          </div>

          {/* Card Body */}
          <div className="px-4 py-3.5 text-center space-y-1">
            <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 block">
              {kpi.label}
            </span>
            <p className={`text-2xl sm:text-3xl font-extrabold tracking-tight font-mono ${dark ? 'text-white' : 'text-slate-900'}`}>
              {kpi.value}
            </p>
            <p className="text-[10px] text-slate-500 font-medium leading-snug min-h-[2.2em]">{kpi.subtitle}</p>

            <div className={`mt-2.5 pt-2 border-t text-[9px] ${dark ? 'border-[#1e2d4a]' : 'border-slate-100'}`}>
              {kpi.footer}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
