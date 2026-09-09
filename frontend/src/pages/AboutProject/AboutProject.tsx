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
      <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#111e35] p-6 sm:p-8 shadow-sm transition-all space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-white/[0.06] pb-5">
          <div className="space-y-1">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Core Research Thesis
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
              What systemic and clinical factors drive ED stay duration and cumulative emergency strain?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
              Synthesizes 8,685+ pre-aggregated records across 175.8M visits to isolate independent predictors of operational delays, evaluate patient demographic disparities, and forecast near-term demand trajectories.
            </p>
          </div>

          {onBeginPrep && (
            <button
              type="button"
              onClick={onBeginPrep}
              className="btn-primary self-start md:self-center shrink-0 cursor-pointer text-xs"
            >
              <span>Explore Data Pipeline</span>
              <ArrowRight size={14} />
            </button>
          )}
        </div>

        {/* 4 Telemetry Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.06] space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[10.5px] font-mono font-semibold uppercase">
              <Database size={13} className="text-blue-500" />
              <span>Clinical Records</span>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono">8,685+</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">6 Harmonized Worksheets</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.06] space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[10.5px] font-mono font-semibold uppercase">
              <Calendar size={13} className="text-emerald-500" />
              <span>Time Horizon</span>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono">19 Years</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">2003–04 to 2021–22</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.06] space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[10.5px] font-mono font-semibold uppercase">
              <BarChart3 size={13} className="text-purple-500" />
              <span>Hypotheses</span>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono">5 Tested</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">H1–H5 Verified (p &lt; .0001)</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.06] space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[10.5px] font-mono font-semibold uppercase">
              <ShieldCheck size={13} className="text-emerald-500" />
              <span>Data Integrity</span>
            </div>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">100%</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">0 Missing / 0 Duplicates</div>
          </div>
        </div>
      </div>

      {/* ── 2. FOUR EXECUTIVE PILLARS ────────────────────────────────────────── */}
      <div className="space-y-3">
        <SectionHeader
          category="METHODOLOGICAL FRAMEWORK"
          title="Four Foundations of the Analytics Platform"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="executive-pillars-grid">
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#111e35] space-y-2 border-l-4 border-l-blue-500 shadow-xs hover:border-slate-300 dark:hover:border-white/[0.15] transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-blue-600 dark:text-blue-400 uppercase">01 · Source Data</span>
              <Database size={16} className="text-blue-500" />
            </div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Multi-Cohort Integration</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              Combines 19-year longitudinal trends, triage presentations, presenting complaints, and demographic breakdowns from CIHI NACRS.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#111e35] space-y-2 border-l-4 border-l-emerald-500 shadow-xs hover:border-slate-300 dark:hover:border-white/[0.15] transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase">02 · Longitudinal</span>
              <Calendar size={16} className="text-emerald-500" />
            </div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">19-Year Trend Analysis</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              Tracks annual patient volume, median stay durations, pandemic shifts, and cumulative Total ED-Minutes (TEM) system burden.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#111e35] space-y-2 border-l-4 border-l-purple-500 shadow-xs hover:border-slate-300 dark:hover:border-white/[0.15] transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-purple-600 dark:text-purple-400 uppercase">03 · Inference</span>
              <BarChart3 size={16} className="text-purple-500" />
            </div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Statistical Testing</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              Rigorous frequency-weighted non-parametric tests (Kruskal-Wallis, Mann-Whitney U), Dunn post-hoc contrasts, and WLS regression models.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#111e35] space-y-2 border-l-4 border-l-amber-500 shadow-xs hover:border-slate-300 dark:hover:border-white/[0.15] transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-amber-600 dark:text-amber-400 uppercase">04 · Governance</span>
              <Lock size={16} className="text-amber-500" />
            </div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Privacy-Safe Research</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              100% aggregate administrative health data. Non-identifiable group statistics strictly for health system operations research.
            </p>
          </div>
        </div>
      </div>

      {/* ── 3. CLINICAL CHALLENGE & FIVE RESEARCH OBJECTIVES ─────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: The Clinical Challenge */}
        <div className="lg:col-span-5 p-6 rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#111e35] space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                <AlertTriangle size={16} />
              </span>
              <div>
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 font-mono block">
                  Systemic Challenge
                </span>
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  Where Does ED Bottlenecking Occur?
                </h3>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              Canadian emergency departments navigate multifaceted throughput constraints across aging populations, acuity variations, and hospital bed shortages. Length of Stay (LOS) serves as the primary macro-indicator of system strain.
            </p>

            <div className="space-y-2 pt-1">
              {[
                { tag: 'Acuity Gradient', desc: 'Resuscitation and Emergent presentations require intensive stabilization, extending median stay durations.' },
                { tag: 'Geriatric Burden', desc: 'Older adults (65+) experience complex multimorbidity, driving higher aggregate median stay times.' },
                { tag: 'Admission Delays', desc: 'Admitted visits exhibit severe boarding delays (10.60h median vs. 2.50h for discharged patients).' },
                { tag: 'TEM Volume Strain', desc: 'Total ED-Minutes = Visit Volume × Median Stay Duration captures compounding system load.' },
              ].map((item, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.05] text-xs">
                  <span className="font-semibold text-slate-900 dark:text-slate-200 block text-[11.5px]">{item.tag}</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-white/[0.06] text-[10.5px] font-mono text-slate-500 flex justify-between items-center">
            <span>Focus: NACRS Ambulatory Cohorts</span>
            <span className="text-rose-600 dark:text-rose-400 font-bold uppercase">System-Level Analysis</span>
          </div>
        </div>

        {/* Right: Five Research Objectives */}
        <div className="lg:col-span-7 p-6 rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#111e35] space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10.5px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 font-mono block">
                Analytical Framework
              </span>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Five Core Research Objectives
              </h3>
            </div>
            <span className="text-[11px] font-mono font-semibold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
              01 → 05 Pipeline
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.05] space-y-1">
              <span className="font-semibold text-blue-600 dark:text-blue-400 font-mono flex items-center gap-1.5 text-xs">
                <Clock size={13} /> 01. Explain Stay Drivers
              </span>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
                Quantify how triage acuity, age groups, sex, and visit outcomes drive variation in reported ED length of stay.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.05] space-y-1">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1.5 text-xs">
                <Activity size={13} /> 02. Measure TEM Burden
              </span>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
                Compute Total ED-Minutes (TEM) = Visit Volume × Median LOS to evaluate cumulative longitudinal resource strain.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.05] space-y-1">
              <span className="font-semibold text-purple-600 dark:text-purple-400 font-mono flex items-center gap-1.5 text-xs">
                <Cpu size={13} /> 03. WLS Regression
              </span>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
                Execute weighted least squares regressions to isolate the independent effect of urgency scores on stay duration.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.05] space-y-1">
              <span className="font-semibold text-amber-600 dark:text-amber-400 font-mono flex items-center gap-1.5 text-xs">
                <Users size={13} /> 04. High-Burden Cohorts
              </span>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
                Identify combinations of triage level, age segment, and clinical complaints creating disproportionate bed occupancy.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.05] sm:col-span-2 space-y-1">
              <span className="font-semibold text-cyan-600 dark:text-cyan-400 font-mono flex items-center gap-1.5 text-xs">
                <TrendingUp size={13} /> 05. Longitudinal Forecasting
              </span>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
                Analyze 19-year longitudinal trajectories and forecast near-term demand using Simple Exponential Smoothing (SES) with 95% confidence bands.
              </p>
            </div>
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
            <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100">
              Scientific Rigor, Data Pipeline & Architecture
            </h3>
          </div>

          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] text-xs font-medium">
            <button
              type="button"
              onClick={() => setActiveTab('hypotheses')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'hypotheses'
                  ? 'bg-blue-600 text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BarChart3 size={13} />
              <span>5 Hypotheses (H1–H5)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('pipeline')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'pipeline'
                  ? 'bg-blue-600 text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Workflow size={13} />
              <span>7-Stage Pipeline</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('architecture')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'architecture'
                  ? 'bg-blue-600 text-white shadow-xs font-semibold'
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {[
                {
                  tag: 'H1',
                  title: 'CTAS Triage Acuity & LOS',
                  question: 'Does median ED stay differ across CTAS urgency levels (1–5)?',
                  method: 'Weighted Kruskal-Wallis & Dunn Post-Hoc',
                  badge: 'Reject H₀',
                  pVal: 'p < 0.0001',
                  variant: 'reject' as const,
                  finding: 'CTAS I Resuscitation (4.60h / 276m) and CTAS II Emergent (4.80h / 288m) exhibit substantially longer stays than CTAS V Non-Urgent (1.33h / 80m) (ε² = 0.7251).',
                },
                {
                  tag: 'H2',
                  title: 'Admission Status & LOS',
                  question: 'Does length of stay differ between admitted and non-admitted visits?',
                  method: 'Weighted Mann-Whitney U Test',
                  badge: 'Reject H₀',
                  pVal: 'p < 0.0001',
                  variant: 'reject' as const,
                  finding: 'Admitted visits follow significantly longer aggregate stay durations (10.60h median stay vs. 2.50h for non-admitted visits; rb = 0.9981).',
                },
                {
                  tag: 'H3',
                  title: 'WLS Regression Predictors of LOS',
                  question: 'Does CTAS urgency score predict reported median stay duration?',
                  method: 'Weighted Least Squares (WLS) Regression',
                  badge: 'Reject H₀',
                  pVal: 'R² = 0.6256',
                  variant: 'reject' as const,
                  finding: 'Urgency score significantly predicts reported stay duration (β₁ = -73.92 min/unit / -1.23 h/unit, R² = 0.6256, N = 174.2M visits).',
                },
                {
                  tag: 'H4',
                  title: 'Patient Age Group & LOS',
                  question: 'Does reported median stay differ across broad age categories?',
                  method: 'Weighted Kruskal-Wallis & Dunn Post-Hoc',
                  badge: 'Reject H₀',
                  pVal: 'p < 0.0001',
                  variant: 'reject' as const,
                  finding: 'Older Adults 65+ (4.17h / 250m) experience longer aggregate stays than pediatric patients (2.05h / 123m) (ε² = 0.7218).',
                },
                {
                  tag: 'H5',
                  title: 'Patient Sex & Visit Disposition',
                  question: 'Is patient sex significantly associated with ED admission outcome?',
                  method: 'Pearson Chi-Square Test (N = 175.8M)',
                  badge: 'Reject H₀ (Negligible)',
                  pVal: 'V = 0.0102',
                  variant: 'negligible' as const,
                  finding: 'Statistically significant due to massive sample size (χ² = 18,164.97, N = 175.76M), with negligible practical effect (Cramér\'s V = 0.0102; Female 9.95% vs Male 10.56%).',
                },
              ].map((h) => (
                <div key={h.tag} className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.06] space-y-2 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-xs font-bold font-mono bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                        {h.tag}
                      </span>
                      <StatBadge label={h.badge} sublabel={h.pVal} variant={h.variant} />
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{h.title}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                      "{h.question}"
                    </p>
                    <p className="text-[11px] text-slate-700 dark:text-slate-300 bg-white dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/[0.04] p-2 rounded-lg leading-relaxed font-normal">
                      {h.finding}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 block pt-2 border-t border-slate-200/60 dark:border-white/[0.04]">
                    Method: {h.method}
                  </span>
                </div>
              ))}

              <div className="p-4 rounded-xl bg-blue-500/[0.04] border border-blue-500/20 flex flex-col justify-center items-center text-center space-y-2">
                <Sparkles size={22} className="text-blue-500" />
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">Empirical Biostatistical Engine</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">All 5 hypotheses verified with non-parametric tests, Dunn post-hoc contrasts &amp; WLS models.</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: 7-STAGE PIPELINE */}
        {activeTab === 'pipeline' && (
          <div className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {[
                { stage: '1. About Project', desc: 'Clinical problem statement, academic framework, and 5 pre-specified hypotheses.' },
                { stage: '2. Prep & Quality Engine', desc: 'Unit harmonization (hours/min), deduplication, schema validation, and cohort cleaning.' },
                { stage: '3. Dataset Explorer', desc: 'Interactive cohort exploration across triage acuity, life-stage groups, and 19 fiscal years.' },
                { stage: '4. Hypothesis Testing', desc: 'Evaluates H1–H5 with Kruskal-Wallis, Mann-Whitney U, WLS regression, and ERBI forecasting.' },
                { stage: '5. Executive Dashboard', desc: 'KPI cards, interactive custom visual builder, H1–H5 visual suite, and operational charts.' },
                { stage: '6. Strategic Insights', desc: 'Executive decision matrix, policy recommendations, and hospital capacity planning directives.' },
                { stage: '7. Reports & Export', desc: 'Comprehensive audit trail, methodology documentation, and PDF executive summary dossier exports.' },
              ].map((s, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.06] space-y-1">
                  <span className="font-mono font-semibold text-blue-600 dark:text-blue-400 block text-xs">{s.stage}</span>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 font-normal leading-relaxed">{s.desc}</p>
                </div>
              ))}
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
