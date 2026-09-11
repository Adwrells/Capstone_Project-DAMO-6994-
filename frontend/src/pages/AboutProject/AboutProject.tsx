/**
 * Healthcare Analytics Platform - About Project Page (Page 1)
 * Master's Capstone Project | Master of Data Analytics
 * Dark Enterprise Healthcare Analytics Identity
 */

import React, { useState } from 'react';
import {
  GraduationCap, Database, Cpu, TrendingUp, Activity, Sparkles,
  ArrowRight, ShieldCheck, CheckCircle2, Server, Layers, Clock,
  BarChart3, AlertTriangle, Workflow, Code, Calendar, Compass,
  FileCheck, LineChart, PieChart, Lock, ChevronRight, Info, Zap,
  Target, Users, FileSpreadsheet
} from 'lucide-react';
import ArchitecturePipelineCard from '../../components/architecture/ArchitecturePipelineCard';
import PageHeader from '../../components/common/PageHeader';
import SectionHeader from '../../components/common/SectionHeader';
import StatBadge from '../../components/common/StatBadge';

interface AboutProjectProps {
  onReset?: () => void;
  isDarkMode?: boolean;
  onBeginPrep?: () => void;
}

export default function AboutProject({ onReset, isDarkMode = true, onBeginPrep }: AboutProjectProps) {
  const [activeTab, setActiveTab] = useState<'hypotheses' | 'pipeline' | 'architecture'>('hypotheses');

  return (
    <div className="space-y-8 text-left font-sans animate-fade-in max-w-6xl mx-auto pb-16" id="about-project-stage">

      {/* ── 1. PAGE HEADER & EXECUTIVE HERO ─────────────────────────────────── */}
      <PageHeader
        align="center"
        badgeIcon={<Sparkles size={12} className="text-blue-500 dark:text-blue-400" />}
        category="EXECUTIVE RESEARCH OVERVIEW · CAPSTONE PLATFORM"
        title="Canadian Emergency Department Analytics Platform"
        subtitle="Explanatory biostatistical modeling of ED Length of Stay (LOS) and longitudinal hospital resource burden using aggregate CIHI NACRS administrative data (2003–2021)."
        contextPills={[
          { label: 'Program', value: 'Master of Data Analytics', icon: <GraduationCap size={13} className="text-blue-500 dark:text-blue-400" />, variant: 'blue' },
          { label: 'Source', value: 'CIHI NACRS Aggregate', icon: <Database size={13} className="text-slate-500 dark:text-slate-400" />, variant: 'default' },
          { label: 'Time Span', value: '19 Fiscal Years', icon: <Calendar size={13} className="text-amber-500 dark:text-amber-400" />, variant: 'amber' },
          { label: 'Quality Audit', value: '100% Validated', icon: <ShieldCheck size={13} className="text-emerald-500 dark:text-emerald-400" />, variant: 'success' },
        ]}
      />

      {/* Hero Overview Card */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-[#111e35] p-6 sm:p-8 shadow-sm transition-all space-y-7">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-36 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-5 border-b border-slate-100 dark:border-white/[0.06] pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/10 dark:bg-blue-500/15 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10.5px] font-mono font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              Core Research Thesis
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-snug">
              What systemic and clinical factors drive ED stay duration and cumulative emergency strain?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed font-normal">
              Synthesizes 8,685+ pre-aggregated records across 175.8M visits to isolate independent predictors of operational delays, evaluate patient demographic disparities, and forecast near-term demand trajectories.
            </p>
          </div>

          {onBeginPrep && (
            <button
              type="button"
              onClick={onBeginPrep}
              className="h-10 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md hover:shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer select-none group self-start md:self-center shrink-0"
            >
              <span>Explore Data Pipeline</span>
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}
        </div>

        {/* 4 Telemetry Metrics Bar — Centralized & Upgraded */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {/* 1. Clinical Records */}
          <div className="relative group p-4.5 rounded-2xl bg-slate-50/90 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.06] hover:border-blue-500/40 dark:hover:border-blue-500/40 hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center mb-2 shadow-xs group-hover:scale-110 transition-transform">
              <Database size={17} />
            </div>
            <div className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-0.5">
              Clinical Records
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-mono tracking-tight my-0.5">
              8,685+
            </div>
            <div className="inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
              6 Harmonized Worksheets
            </div>
          </div>

          {/* 2. Time Horizon */}
          <div className="relative group p-4.5 rounded-2xl bg-slate-50/90 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.06] hover:border-emerald-500/40 dark:hover:border-emerald-500/40 hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-2 shadow-xs group-hover:scale-110 transition-transform">
              <Calendar size={17} />
            </div>
            <div className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-0.5">
              Time Horizon
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-mono tracking-tight my-0.5">
              19 Years
            </div>
            <div className="inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
              2003–04 to 2021–22
            </div>
          </div>

          {/* 3. Hypotheses */}
          <div className="relative group p-4.5 rounded-2xl bg-slate-50/90 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.06] hover:border-purple-500/40 dark:hover:border-purple-500/40 hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 dark:text-purple-400 border border-purple-500/20 flex items-center justify-center mb-2 shadow-xs group-hover:scale-110 transition-transform">
              <BarChart3 size={17} />
            </div>
            <div className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-0.5">
              Hypotheses
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-mono tracking-tight my-0.5">
              5 Tested
            </div>
            <div className="inline-flex items-center gap-1 text-[11px] text-purple-600 dark:text-purple-400 font-mono font-semibold mt-0.5">
              H1–H5 Verified (p &lt; .0001)
            </div>
          </div>

          {/* 4. Data Integrity */}
          <div className="relative group p-4.5 rounded-2xl bg-slate-50/90 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.06] hover:border-teal-500/40 dark:hover:border-teal-500/40 hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-2 shadow-xs group-hover:scale-110 transition-transform">
              <ShieldCheck size={17} />
            </div>
            <div className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-0.5">
              Data Integrity
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono tracking-tight my-0.5">
              100%
            </div>
            <div className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-mono font-semibold mt-0.5">
              0 Missing / 0 Duplicates
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. FOUR EXECUTIVE PILLARS ────────────────────────────────────────── */}
      <div className="space-y-3.5">
        <SectionHeader
          category="METHODOLOGICAL FRAMEWORK"
          title="Four Foundations of the Analytics Platform"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="executive-pillars-grid">
          {/* Pillar 01 */}
          <div className="relative group flex flex-col justify-between p-5 rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#111e35] shadow-xs hover:shadow-lg hover:-translate-y-1 hover:border-blue-500/40 dark:hover:border-blue-500/40 transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10.5px] font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20">
                  01 · Source Data
                </span>
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform">
                  <Database size={15} />
                </div>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Multi-Cohort Integration
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                Combines 19-year longitudinal trends, triage presentations, presenting complaints, and demographic breakdowns from CIHI NACRS.
              </p>
            </div>
            <div className="pt-3 mt-4 border-t border-slate-100 dark:border-white/[0.06] flex items-center gap-2 text-[10px] font-mono text-slate-400 dark:text-slate-500">
              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-white/[0.04]">CIHI NACRS</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-white/[0.04]">6 Worksheets</span>
            </div>
          </div>

          {/* Pillar 02 */}
          <div className="relative group flex flex-col justify-between p-5 rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#111e35] shadow-xs hover:shadow-lg hover:-translate-y-1 hover:border-emerald-500/40 dark:hover:border-emerald-500/40 transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10.5px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  02 · Longitudinal
                </span>
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform">
                  <Calendar size={15} />
                </div>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                19-Year Trend Analysis
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                Tracks annual patient volume, median stay durations, pandemic shifts, and cumulative Total ED-Minutes (TEM) system burden.
              </p>
            </div>
            <div className="pt-3 mt-4 border-t border-slate-100 dark:border-white/[0.06] flex items-center gap-2 text-[10px] font-mono text-slate-400 dark:text-slate-500">
              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-white/[0.04]">2003–2022</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-white/[0.04]">TEM Metric</span>
            </div>
          </div>

          {/* Pillar 03 */}
          <div className="relative group flex flex-col justify-between p-5 rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#111e35] shadow-xs hover:shadow-lg hover:-translate-y-1 hover:border-purple-500/40 dark:hover:border-purple-500/40 transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-500" />
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10.5px] font-mono font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20">
                  03 · Inference
                </span>
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center border border-purple-500/20 group-hover:scale-110 transition-transform">
                  <BarChart3 size={15} />
                </div>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                Statistical Testing
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                Rigorous frequency-weighted non-parametric tests (Kruskal-Wallis, Mann-Whitney U), Dunn post-hoc contrasts, and WLS regression models.
              </p>
            </div>
            <div className="pt-3 mt-4 border-t border-slate-100 dark:border-white/[0.06] flex items-center gap-2 text-[10px] font-mono text-slate-400 dark:text-slate-500">
              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-white/[0.04]">Kruskal-Wallis</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-white/[0.04]">WLS Models</span>
            </div>
          </div>

          {/* Pillar 04 */}
          <div className="relative group flex flex-col justify-between p-5 rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#111e35] shadow-xs hover:shadow-lg hover:-translate-y-1 hover:border-amber-500/40 dark:hover:border-amber-500/40 transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10.5px] font-mono font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                  04 · Governance
                </span>
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20 group-hover:scale-110 transition-transform">
                  <Lock size={15} />
                </div>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                Privacy-Safe Research
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                100% aggregate administrative health data. Non-identifiable group statistics strictly for health system operations research.
              </p>
            </div>
            <div className="pt-3 mt-4 border-t border-slate-100 dark:border-white/[0.06] flex items-center gap-2 text-[10px] font-mono text-slate-400 dark:text-slate-500">
              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-white/[0.04]">Aggregate Data</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-white/[0.04]">De-Identified</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. CLINICAL CHALLENGE & FIVE RESEARCH OBJECTIVES ─────────────────── */}
      <div className="space-y-6">
        {/* 3.1 The Clinical Challenge */}
        <div className="relative overflow-hidden p-6 sm:p-7 rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#111e35] space-y-4 shadow-sm">
          <div className="absolute top-0 left-0 w-64 h-48 bg-rose-500/5 dark:bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-white/[0.06] pb-4 relative">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center justify-center shrink-0 shadow-xs shadow-rose-500/10">
                <AlertTriangle size={18} />
              </span>
              <div>
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 font-mono block">
                  Systemic Challenge
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                  Where Does ED Bottlenecking Occur?
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[10.5px] font-mono text-slate-500 dark:text-slate-400">
              <span>Focus: NACRS Ambulatory Cohorts</span>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span className="inline-flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-bold uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                System-Level Analysis
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            Canadian emergency departments navigate multifaceted throughput constraints across aging populations, acuity variations, and hospital bed shortages. Length of Stay (LOS) serves as the primary macro-indicator of system strain.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
            {[
              {
                tag: 'Acuity Gradient',
                desc: 'Resuscitation and Emergent presentations require intensive stabilization, extending median stay durations.',
                icon: <Activity size={14} className="text-rose-500" />,
                metric: '4.80h CTAS II vs 1.33h V',
                color: 'border-rose-500/30 text-rose-600 dark:text-rose-400 bg-rose-500/10',
                ratioPct: 78,
                ratioLabel: '3.6× Stay Disparity',
              },
              {
                tag: 'Geriatric Burden',
                desc: 'Older adults (65+) experience complex multimorbidity, driving higher aggregate median stay times.',
                icon: <Users size={14} className="text-amber-500" />,
                metric: '4.17h (65+) vs 2.05h Ped',
                color: 'border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10',
                ratioPct: 67,
                ratioLabel: '2.0× Pediatric LOS',
              },
              {
                tag: 'Admission Delays',
                desc: 'Admitted visits exhibit severe boarding delays (10.60h median vs. 2.50h for discharged patients).',
                icon: <Clock size={14} className="text-purple-500" />,
                metric: '10.60h vs 2.50h Boarding',
                color: 'border-purple-500/30 text-purple-600 dark:text-purple-400 bg-purple-500/10',
                ratioPct: 81,
                ratioLabel: '4.2× Boarding Delay',
              },
              {
                tag: 'TEM Volume Strain',
                desc: 'Total ED-Minutes = Visit Volume × Median Stay Duration captures compounding system load.',
                icon: <TrendingUp size={14} className="text-blue-500" />,
                metric: 'Vol × Median LOS Metric',
                color: 'border-blue-500/30 text-blue-600 dark:text-blue-400 bg-blue-500/10',
                ratioPct: 92,
                ratioLabel: 'Compounding Scale',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.05] hover:border-slate-300 dark:hover:border-white/[0.12] hover:bg-slate-100/70 dark:hover:bg-white/[0.04] transition-all space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      {item.icon}
                      <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">{item.tag}</span>
                    </div>
                    <span className={`text-[9.5px] font-mono font-bold px-2 py-0.5 rounded-md border ${item.color}`}>
                      {item.metric}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <div className="pt-1 flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-slate-200 dark:bg-white/[0.08] overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.color.includes('rose') ? 'bg-rose-500' : item.color.includes('amber') ? 'bg-amber-500' : item.color.includes('purple') ? 'bg-purple-500' : 'bg-blue-500'}`}
                      style={{ width: `${item.ratioPct}%` }}
                    />
                  </div>
                  <span className="text-[9.5px] font-mono text-slate-400 dark:text-slate-500 shrink-0 font-semibold">
                    {item.ratioLabel}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3.2 Five Research Objectives (Directly Below) */}
        <div className="p-6 sm:p-7 rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#111e35] space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-white/[0.06] pb-4">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center shrink-0 shadow-xs shadow-blue-500/10">
                <Sparkles size={18} />
              </span>
              <div>
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 font-mono block">
                  Analytical Framework
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                  Five Core Research Objectives
                </h3>
              </div>
            </div>

            <span className="text-[11px] font-mono font-semibold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 shadow-xs self-start sm:self-auto">
              01 → 05 Longitudinal Pipeline
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            Structured biostatistical framework to isolate clinical drivers of stay duration, quantify compounding population strain, and forecast longitudinal health service demand.
          </p>

          <div className="space-y-2.5 pt-1">
            {[
              {
                num: '01',
                title: 'Explain Stay Drivers',
                tag: 'Acuity & Age',
                desc: 'Quantify how triage acuity, age groups, sex, and visit outcomes drive variation in reported ED length of stay.',
                icon: <Clock size={14} className="text-blue-500" />,
                color: 'text-blue-600 dark:text-blue-400 border-blue-500/20 bg-blue-500/10',
                hoverBorder: 'hover:border-blue-500/40 dark:hover:border-blue-500/40',
              },
              {
                num: '02',
                title: 'Measure TEM Burden',
                tag: 'Cumulative Strain',
                desc: 'Compute Total ED-Minutes (TEM) = Visit Volume × Median LOS to evaluate cumulative longitudinal resource strain.',
                icon: <Activity size={14} className="text-emerald-500" />,
                color: 'text-emerald-600 dark:text-emerald-400 border-emerald-500/20 bg-emerald-500/10',
                hoverBorder: 'hover:border-emerald-500/40 dark:hover:border-emerald-500/40',
              },
              {
                num: '03',
                title: 'WLS Regression',
                tag: 'β Coefficients',
                desc: 'Execute weighted least squares regressions to isolate the independent effect of urgency scores on stay duration.',
                icon: <Cpu size={14} className="text-purple-500" />,
                color: 'text-purple-600 dark:text-purple-400 border-purple-500/20 bg-purple-500/10',
                hoverBorder: 'hover:border-purple-500/40 dark:hover:border-purple-500/40',
              },
              {
                num: '04',
                title: 'High-Burden Cohorts',
                tag: 'Bed Occupancy',
                desc: 'Identify combinations of triage level, age segment, and clinical complaints creating disproportionate bed occupancy.',
                icon: <Users size={14} className="text-amber-500" />,
                color: 'text-amber-600 dark:text-amber-400 border-amber-500/20 bg-amber-500/10',
                hoverBorder: 'hover:border-amber-500/40 dark:hover:border-amber-500/40',
              },
              {
                num: '05',
                title: 'Longitudinal Forecasting',
                tag: 'SES & 95% CI',
                desc: 'Analyze 19-year longitudinal trajectories and forecast near-term demand using Simple Exponential Smoothing (SES) with 95% confidence bands.',
                icon: <TrendingUp size={14} className="text-cyan-500" />,
                color: 'text-cyan-600 dark:text-cyan-400 border-cyan-500/20 bg-cyan-500/10',
                hoverBorder: 'hover:border-cyan-500/40 dark:hover:border-cyan-500/40',
              },
            ].map((obj) => (
              <div
                key={obj.num}
                className={`p-3.5 rounded-xl bg-slate-50/80 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.05] ${obj.hoverBorder} transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <span className="font-bold font-mono flex items-center gap-1.5 text-xs text-slate-900 dark:text-slate-100 shrink-0">
                    {obj.icon}
                    <span className={obj.color.split(' ')[0]}>{obj.num}.</span>
                    <span>{obj.title}</span>
                  </span>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
                    {obj.desc}
                  </p>
                </div>
                <span className={`text-[9.5px] font-mono font-semibold px-2 py-0.5 rounded border shrink-0 self-start sm:self-auto ${obj.color}`}>
                  {obj.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 4. INTERACTIVE DEEP-DIVE TABS ───────────────────────────────────── */}
      <div className="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#111e35] space-y-6 shadow-sm">
        {/* Tab Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-white/[0.06] pb-4">
          <div>
            <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
              Analytical Verification
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
              Scientific Rigor, Data Pipeline & Architecture
            </h3>
          </div>

          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-[#0c1628] border border-slate-200 dark:border-white/[0.08] text-xs font-medium">
            <button
              type="button"
              onClick={() => setActiveTab('hypotheses')}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'hypotheses'
                  ? 'bg-blue-600 text-white shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BarChart3 size={13} />
              <span>5 Hypotheses (H1–H5)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('pipeline')}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'pipeline'
                  ? 'bg-blue-600 text-white shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Workflow size={13} />
              <span>7-Stage Pipeline</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('architecture')}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'architecture'
                  ? 'bg-blue-600 text-white shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layers size={13} />
              <span>Tech Stack</span>
            </button>
          </div>
        </div>

        {/* TAB 1: 5 FORMAL HYPOTHESES */}
        {activeTab === 'hypotheses' && (
          <div className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  tag: 'H1',
                  title: 'CTAS Triage Acuity & LOS',
                  question: 'Does median ED stay differ across CTAS urgency levels (1–5)?',
                  method: 'Weighted Kruskal-Wallis & Dunn Post-Hoc',
                  statKey: 'ε² = 0.7251',
                  badge: 'Reject H₀',
                  pVal: 'p < 0.0001',
                  variant: 'reject' as const,
                  finding: 'CTAS I Resuscitation (4.60h / 276m) and CTAS II Emergent (4.80h / 288m) exhibit substantially longer stays than CTAS V Non-Urgent (1.33h / 80m).',
                },
                {
                  tag: 'H2',
                  title: 'Admission Status & LOS',
                  question: 'Does length of stay differ between admitted and non-admitted visits?',
                  method: 'Weighted Mann-Whitney U Test',
                  statKey: 'rb = 0.9981',
                  badge: 'Reject H₀',
                  pVal: 'p < 0.0001',
                  variant: 'reject' as const,
                  finding: 'Admitted visits follow significantly longer aggregate stay durations (10.60h median stay vs. 2.50h for non-admitted visits).',
                },
                {
                  tag: 'H3',
                  title: 'WLS Regression Predictors of LOS',
                  question: 'Does CTAS urgency score predict reported median stay duration?',
                  method: 'Weighted Least Squares (WLS) Regression',
                  statKey: 'R² = 0.6256',
                  badge: 'Reject H₀',
                  pVal: 'R² = 0.6256',
                  variant: 'reject' as const,
                  finding: 'Urgency score significantly predicts reported stay duration (β₁ = -73.92 min/unit / -1.23 h/unit, N = 174.2M visits).',
                },
                {
                  tag: 'H4',
                  title: 'Patient Age Group & LOS',
                  question: 'Does reported median stay differ across broad age categories?',
                  method: 'Weighted Kruskal-Wallis & Dunn Post-Hoc',
                  statKey: 'ε² = 0.7218',
                  badge: 'Reject H₀',
                  pVal: 'p < 0.0001',
                  variant: 'reject' as const,
                  finding: 'Older Adults 65+ (4.17h / 250m) experience longer aggregate stays than pediatric patients (2.05h / 123m).',
                },
                {
                  tag: 'H5',
                  title: 'Patient Sex & Visit Disposition',
                  question: 'Is patient sex significantly associated with ED admission outcome?',
                  method: 'Pearson Chi-Square Test',
                  statKey: 'V = 0.0102',
                  badge: 'Reject H₀ (Negligible)',
                  pVal: 'V = 0.0102',
                  variant: 'negligible' as const,
                  finding: 'Statistically significant due to sample size (χ² = 18,164.97, N = 175.76M), with negligible practical effect (Cramér\'s V = 0.0102; Female 9.95% vs Male 10.56%).',
                },
              ].map((h) => (
                <div
                  key={h.tag}
                  className="p-4.5 rounded-2xl bg-slate-50/80 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.06] hover:border-slate-300 dark:hover:border-white/[0.15] hover:-translate-y-1 hover:shadow-md transition-all duration-300 space-y-3 flex flex-col justify-between group"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold font-mono bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                        {h.tag}
                      </span>
                      <StatBadge label={h.badge} sublabel={h.pVal} variant={h.variant} />
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {h.title}
                    </h4>

                    <div className="text-[11px] italic text-slate-600 dark:text-slate-300 bg-white/70 dark:bg-white/[0.02] border-l-2 border-l-blue-500/60 px-2.5 py-1.5 rounded-r-lg">
                      "{h.question}"
                    </div>

                    <div className="text-[11px] text-slate-700 dark:text-slate-300 bg-white dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/[0.04] p-2.5 rounded-xl leading-relaxed font-normal">
                      {h.finding}
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-slate-200/60 dark:border-white/[0.04] flex items-center justify-between text-[10.5px] font-mono text-slate-400 dark:text-slate-400">
                    <span className="truncate mr-2" title={`Method: ${h.method}`}>Method: {h.method}</span>
                    <span className="shrink-0 px-1.5 py-0.5 rounded bg-slate-200/60 dark:bg-white/[0.05] text-slate-600 dark:text-slate-300 font-semibold">
                      {h.statKey}
                    </span>
                  </div>
                </div>
              ))}

              {/* Card 6: Empirical Biostatistical Engine */}
              <div className="relative overflow-hidden p-5 rounded-2xl bg-gradient-to-br from-blue-600/10 via-indigo-600/5 to-purple-600/10 dark:from-blue-500/[0.08] dark:via-indigo-500/[0.04] dark:to-purple-500/[0.08] border border-blue-500/30 hover:border-blue-500/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-3">
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/15 rounded-full blur-2xl pointer-events-none" />

                <div className="space-y-3 relative">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-500 dark:text-blue-400 border border-blue-500/30 flex items-center justify-center shadow-xs">
                      <Sparkles size={17} />
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                      5 / 5 Decided
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      Empirical Biostatistical Engine
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                      National population-scale verification across non-parametric &amp; regression frameworks.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[10.5px]">
                    <div className="p-2 rounded-lg bg-white/70 dark:bg-white/[0.03] border border-blue-500/15">
                      <div className="text-slate-400 text-[9.5px]">VISITS TESTED</div>
                      <div className="font-bold text-slate-900 dark:text-slate-100">175.8M</div>
                    </div>
                    <div className="p-2 rounded-lg bg-white/70 dark:bg-white/[0.03] border border-blue-500/15">
                      <div className="text-slate-400 text-[9.5px]">SIGNIFICANCE</div>
                      <div className="font-bold text-emerald-600 dark:text-emerald-400">α = 0.05</div>
                    </div>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-blue-500/20 text-[10.5px] font-mono text-blue-600 dark:text-blue-400 font-semibold flex items-center justify-between">
                  <span>Rigorous Non-Parametric Framework</span>
                  <CheckCircle2 size={13} className="text-emerald-500" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: 7-STAGE PIPELINE */}
        {activeTab === 'pipeline' && (
          <div className="space-y-4 animate-fade-in text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                {
                  stage: 'STAGE 1',
                  title: 'About Project',
                  desc: 'Clinical problem statement, academic framework, and 5 pre-specified hypotheses.',
                  icon: <Compass size={13} className="text-blue-500" />,
                  color: 'text-blue-600 dark:text-blue-400',
                },
                {
                  stage: 'STAGE 2',
                  title: 'Prep & Quality Engine',
                  desc: 'Unit harmonization (hours/min), deduplication, schema validation, and cohort cleaning.',
                  icon: <FileCheck size={13} className="text-emerald-500" />,
                  color: 'text-emerald-600 dark:text-emerald-400',
                },
                {
                  stage: 'STAGE 3',
                  title: 'Dataset Explorer',
                  desc: 'Interactive cohort exploration across triage acuity, life-stage groups, and 19 fiscal years.',
                  icon: <Database size={13} className="text-cyan-500" />,
                  color: 'text-cyan-600 dark:text-cyan-400',
                },
                {
                  stage: 'STAGE 4',
                  title: 'Hypothesis Testing',
                  desc: 'Evaluates H1–H5 with Kruskal-Wallis, Mann-Whitney U, WLS regression, and ERBI forecasting.',
                  icon: <Activity size={13} className="text-purple-500" />,
                  color: 'text-purple-600 dark:text-purple-400',
                },
                {
                  stage: 'STAGE 5',
                  title: 'Executive Dashboard',
                  desc: 'KPI cards, interactive custom visual builder, H1–H5 visual suite, and operational charts.',
                  icon: <BarChart3 size={13} className="text-amber-500" />,
                  color: 'text-amber-600 dark:text-amber-400',
                },
                {
                  stage: 'STAGE 6',
                  title: 'Strategic Insights',
                  desc: 'Executive decision matrix, policy recommendations, and hospital capacity planning directives.',
                  icon: <Target size={13} className="text-rose-500" />,
                  color: 'text-rose-600 dark:text-rose-400',
                },
                {
                  stage: 'STAGE 7',
                  title: 'Reports & Export',
                  desc: 'Comprehensive audit trail, methodology documentation, and PDF executive summary dossier exports.',
                  icon: <FileSpreadsheet size={13} className="text-indigo-500" />,
                  color: 'text-indigo-600 dark:text-indigo-400',
                },
                {
                  stage: 'END-TO-END',
                  title: 'Complete Lifecycle',
                  desc: 'Deterministic data integrity flow from raw CIHI data ingestion to executive policy decision matrix.',
                  icon: <Workflow size={13} className="text-teal-500" />,
                  color: 'text-teal-600 dark:text-teal-400',
                },
              ].map((s, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.06] hover:border-slate-300 dark:hover:border-white/[0.15] hover:-translate-y-0.5 transition-all space-y-1"
                >
                  <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 font-mono">
                    {s.icon} {s.stage}
                  </span>
                  <span className={`font-semibold ${s.color} block text-xs`}>
                    {s.title}
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Sequential Analytics Flow Indicator */}
            <div className="p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-white/[0.06] bg-slate-50/60 dark:bg-white/[0.01] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs">
              <div className="flex items-center gap-2">
                <Workflow size={14} className="text-blue-500" />
                <span className="font-semibold text-slate-900 dark:text-slate-100 font-mono text-[11px] uppercase tracking-wider">
                  Sequential Clinical Analytics Progression
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 text-[10.5px] font-mono text-slate-500 dark:text-slate-400">
                <span className="text-blue-600 dark:text-blue-400 font-semibold">Stage 1</span>
                <span>→</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Stage 2</span>
                <span>→</span>
                <span className="text-cyan-600 dark:text-cyan-400 font-semibold">Stage 3</span>
                <span>→</span>
                <span className="text-purple-600 dark:text-purple-400 font-semibold">Stage 4</span>
                <span>→</span>
                <span className="text-amber-600 dark:text-amber-400 font-semibold">Stage 5</span>
                <span>→</span>
                <span className="text-rose-600 dark:text-rose-400 font-semibold">Stage 6</span>
                <span>→</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold">Stage 7</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TECH STACK & ARCHITECTURE */}
        {activeTab === 'architecture' && (
          <div className="space-y-6 animate-fade-in text-xs">
            <ArchitecturePipelineCard isDarkMode={isDarkMode} />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.06] space-y-1">
                <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 font-mono">
                  <Code size={13} className="text-blue-500" /> FRONTEND
                </span>
                <span className="font-semibold text-blue-600 dark:text-blue-400 block text-xs">React 18/19 + TypeScript + Vite</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">Tailwind CSS v4, Recharts visuals, Lucide icons, responsive executive layouts.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.06] space-y-1">
                <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 font-mono">
                  <Server size={13} className="text-emerald-500" /> BACKEND
                </span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 block text-xs">FastAPI + Python 3.12</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">SciPy, Statsmodels, Pandas biostatistical engine, strict Pydantic contracts.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.06] space-y-1">
                <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 font-mono">
                  <Database size={13} className="text-purple-500" /> DATABASE
                </span>
                <span className="font-semibold text-purple-600 dark:text-purple-400 block text-xs">SQLite WAL Analytical Store</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">Thread-safe repository pattern containing 8,685 rows across 6 CIHI tables.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.06] space-y-1">
                <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 font-mono">
                  <ShieldCheck size={13} className="text-amber-500" /> TESTING &amp; QA
                </span>
                <span className="font-semibold text-amber-600 dark:text-amber-400 block text-xs">Automated Test Suites</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">Automated test coverage across statistical equations and REST API endpoints.</p>
              </div>
            </div>

            {/* Unidirectional Data Pipeline Flow */}
            <div className="p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-white/[0.06] bg-slate-50/60 dark:bg-white/[0.01]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Workflow size={15} className="text-blue-500" />
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100 font-mono">
                    Unidirectional Clinical Data Pipeline Flow
                  </h4>
                </div>
                <span className="text-[10px] font-mono text-slate-400">Strict Separation of Concerns</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-[11px]">
                <div className="p-3 rounded-lg bg-white dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.05] space-y-1">
                  <div className="text-blue-600 dark:text-blue-400 font-semibold font-mono text-xs">1. Ingestion</div>
                  <p className="text-slate-700 dark:text-slate-200 font-medium">Raw CIHI Excel Workbook</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Multi-worksheet Excel loaded via openpyxl and seeded into SQLite repository.</p>
                </div>

                <div className="p-3 rounded-lg bg-white dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.05] space-y-1">
                  <div className="text-teal-600 dark:text-teal-400 font-semibold font-mono text-xs">2. Preparation</div>
                  <p className="text-slate-700 dark:text-slate-200 font-medium">Client-Side Engine</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Harmonizes units (TEM = Vol × LOS), standardizes CTAS, controls roll-up totals.</p>
                </div>

                <div className="p-3 rounded-lg bg-white dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.05] space-y-1">
                  <div className="text-purple-600 dark:text-purple-400 font-semibold font-mono text-xs">3. Analytics Core</div>
                  <p className="text-slate-700 dark:text-slate-200 font-medium">Biostatistical Verification</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Weighted Kruskal-Wallis, Mann-Whitney U, Dunn post-hoc, WLS regression, and SES.</p>
                </div>

                <div className="p-3 rounded-lg bg-white dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.05] space-y-1">
                  <div className="text-amber-600 dark:text-amber-400 font-semibold font-mono text-xs">4. Delivery</div>
                  <p className="text-slate-700 dark:text-slate-200 font-medium">Clinical Decision Support</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Live Recharts visualization, executive KPI cards, and print-ready PDF reports.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── 5. GOVERNANCE & DATA DISCLAIMER ─────────────────────────────────── */}
      <div className="p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.02] flex items-start gap-3.5 text-xs text-slate-600 dark:text-slate-300">
        <ShieldCheck size={18} className="text-blue-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 text-[11px] font-mono block">
            Administrative Data Disclaimer & Ethics Compliance
          </span>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            This research platform operates exclusively on de-identified, pre-aggregated administrative health data from the <strong>Canadian Institute for Health Information (CIHI) NACRS</strong>. It is designed for system-level operations analytics and does not diagnose, treat, or predict individual patient outcomes.
          </p>
        </div>
      </div>

    </div>
  );
}
