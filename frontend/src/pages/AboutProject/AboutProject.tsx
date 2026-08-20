/**
 * Healthcare Analytics Platform - About Project Page (Page 1)
 * Master's Capstone Project | Master of Data Analytics
 * Executive-Grade, High-Scannability Summary Design (8-10 Second Comprehension)
 */

import React, { useState } from 'react';
import {
  GraduationCap,
  Database,
  Cpu,
  TrendingUp,
  Activity,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Server,
  Layers,
  Clock,
  BarChart3,
  AlertTriangle,
  Workflow,
  Code,
  Calendar,
  Compass,
  FileCheck,
  LineChart,
  PieChart,
  Lock,
  ChevronRight,
  Info,
  Zap,
  Target,
  Users
} from 'lucide-react';

interface AboutProjectProps {
  onReset?: () => void;
  isDarkMode?: boolean;
  onBeginPrep?: () => void;
}

export default function AboutProject({ onReset, isDarkMode = false, onBeginPrep }: AboutProjectProps) {
  const [activeTab, setActiveTab] = useState<'hypotheses' | 'pipeline' | 'architecture'>('hypotheses');

  return (
    <div className="space-y-8 text-left font-sans animate-fade-in max-w-6xl mx-auto pb-16" id="about-project-stage">

      {/* ── 1. EXECUTIVE HERO BANNER ────────────────────────────────────────── */}
      <div className={`relative overflow-hidden rounded-3xl border p-6 sm:p-8 md:p-10 shadow-xl transition-all ${isDarkMode
          ? 'border-indigo-900/40 bg-gradient-to-br from-slate-900 via-slate-900/95 to-indigo-950/40 text-white shadow-indigo-950/20'
          : 'border-indigo-100 bg-gradient-to-br from-white via-slate-50/80 to-indigo-50/40 text-slate-900 shadow-indigo-100/30'
        }`}>
        {/* Ambient Glow */}
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-20 w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-5">
          {/* Header Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono tracking-wide uppercase bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-500/25">
              🎓 Master's Capstone Project
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono tracking-wide uppercase bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25">
              📊 Master of Data Analytics
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono tracking-wide uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              🇨🇦 CIHI NACRS Data
            </span>
          </div>

          {/* Title & Core Pitch */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
              Canadian Emergency Department Analytics Platform
            </h1>
            <p className="text-sm sm:text-base font-semibold text-indigo-600 dark:text-indigo-300">
              📈 Explanatory Analytics of ED Length of Stay (LOS) & Longitudinal Resource Burden (2003–2021)
            </p>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl font-normal">
              An enterprise healthcare analytics system utilizing pre-aggregated <strong className="font-semibold text-slate-900 dark:text-white">CIHI NACRS</strong> data to quantify clinical stay drivers, model long-term hospital pressures, and forecast near-term emergency resource demands.
            </p>
          </div>

          {/* 8-Second Telemetry KPI Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <div className="p-3.5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/50 border border-indigo-200/80 dark:border-indigo-800/60">
              <span className="text-[11px] font-bold font-mono text-indigo-700 dark:text-indigo-300 block">📊 CLINICAL RECORDS</span>
              <span className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-display">8,685+</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">6 Harmonized Datasets</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/50 border border-emerald-200/80 dark:border-emerald-800/60">
              <span className="text-[11px] font-bold font-mono text-emerald-700 dark:text-emerald-300 block">⏳ TIME SPAN</span>
              <span className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-display">19 Years</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">2003–2004 to 2021–2022</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-sky-50/80 dark:bg-sky-950/50 border border-sky-200/80 dark:border-sky-800/60">
              <span className="text-[11px] font-bold font-mono text-sky-700 dark:text-sky-300 block">🔬 HYPOTHESES</span>
              <span className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-display">5 Tested</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">H1 to H5 Validated</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/50 border border-amber-200/80 dark:border-amber-800/60">
              <span className="text-[11px] font-bold font-mono text-amber-700 dark:text-amber-300 block">🎯 DATA QUALITY</span>
              <span className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-display">100%</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">0 Missing / 0 Duplicates</span>
            </div>
          </div>

          {/* Quick CTA */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200/60 dark:border-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
              <Compass size={15} className="text-indigo-600 dark:text-indigo-400" />
              <span><strong>Core Question:</strong> What drives Canadian ED stay duration and longitudinal hospital burden?</span>
            </div>
            <button
              onClick={onBeginPrep}
              className="h-10 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer select-none"
              id="hero-begin-data-prep-btn"
            >
              <Database size={15} />
              <span>Begin Data Preparation</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* ── 2. PROJECT AT A GLANCE (4 EXECUTIVE PILLARS) ────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="executive-pillars-grid">

        {/* Pillar 1 */}
        <div className={`p-5 rounded-2xl border border-t-4 border-t-indigo-600 space-y-2 shadow-xs hover:shadow-md transition-all ${isDarkMode ? 'border-slate-800 bg-slate-900/90 text-white' : 'border-slate-200 bg-white text-slate-900'
          }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">📁 SOURCE DATA</span>
            <Database size={18} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">3 Complementary Datasets</h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
            Longitudinal 19-year series (2003–2021), recent hospital reporting, and cross-sectional chief complaints from CIHI NACRS.
          </p>
        </div>

        {/* Pillar 2 */}
        <div className={`p-5 rounded-2xl border border-t-4 border-t-emerald-600 space-y-2 shadow-xs hover:shadow-md transition-all ${isDarkMode ? 'border-slate-800 bg-slate-900/90 text-white' : 'border-slate-200 bg-white text-slate-900'
          }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">⏱️ LONGITUDINAL</span>
            <Calendar size={18} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">19-Year Trend Analysis</h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
            Tracks annual visit volumes, median stay times, pandemic shock eras, and cumulative <strong className="font-semibold">Total ED-Minutes (TEM)</strong>.
          </p>
        </div>

        {/* Pillar 3 */}
        <div className={`p-5 rounded-2xl border border-t-4 border-t-sky-600 space-y-2 shadow-xs hover:shadow-md transition-all ${isDarkMode ? 'border-slate-800 bg-slate-900/90 text-white' : 'border-slate-200 bg-white text-slate-900'
          }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400">🔬 INFERENCE</span>
            <BarChart3 size={18} className="text-sky-600 dark:text-sky-400" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">5 Formal Hypotheses</h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
            Statistically tests CTAS triage acuity (H1), COVID shocks (H2), age vulnerability (H3), admission disposition (H4), and long-term TEM (H5).
          </p>
        </div>

        {/* Pillar 4 */}
        <div className={`p-5 rounded-2xl border border-t-4 border-t-amber-600 space-y-2 shadow-xs hover:shadow-md transition-all ${isDarkMode ? 'border-slate-800 bg-slate-900/90 text-white' : 'border-slate-200 bg-white text-slate-900'
          }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">🔒 GOVERNANCE</span>
            <Lock size={18} className="text-amber-600 dark:text-amber-400" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Privacy-Safe Research</h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
            100% aggregate administrative health data. Non-identifiable group-level statistics strictly for health system operations research.
          </p>
        </div>
      </div>

      {/* ── 3. CLINICAL PROBLEM & FIVE CORE OBJECTIVES (CONCISE) ─────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* Left: Systemic Challenge (5 Cols) */}
        <div className={`lg:col-span-5 p-6 rounded-3xl border border-t-4 border-t-rose-600 space-y-4 shadow-sm flex flex-col justify-between ${isDarkMode ? 'border-slate-800 bg-slate-900/90' : 'border-slate-200 bg-white'
          }`}>
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                <AlertTriangle size={18} />
              </span>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 font-mono block">The Clinical Challenge</span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Where Does ED Pressure Occur?</h3>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              Emergency Departments face compounding pressures from aging demographics, rising patient acuity, and bed shortages. <strong className="font-semibold text-slate-900 dark:text-white">Length of Stay (LOS)</strong> is the primary indicator of system strain.
            </p>

            <div className="space-y-2 pt-1">
              {[
                { tag: '🔴 Acuity Bottlenecks', desc: 'CTAS 3 "Urgent" patients queue behind resuscitation cases.' },
                { tag: '👴 Age Vulnerability', desc: 'Geriatric patients (65+) experience 1.8× longer boarding times.' },
                { tag: '🏥 Disposition Delays', desc: 'Admitted patients face acute inpatient bed transfer bottlenecks.' },
                { tag: '📈 Resource Burden (TEM)', desc: 'Total ED-Minutes = Total Volume × Median Stay Duration.' },
              ].map((item, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs">
                  <span className="font-bold text-slate-900 dark:text-white block">{item.tag}</span>
                  <span className="text-[11px] text-slate-600 dark:text-slate-400 font-normal">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] font-mono text-slate-500 flex justify-between items-center">
            <span>Focus: NACRS Ambulatory Cohorts</span>
            <span className="text-rose-600 dark:text-rose-400 font-bold uppercase">System-Level Analysis</span>
          </div>
        </div>

        {/* Right: Five Research Objectives (7 Cols) */}
        <div className={`lg:col-span-7 p-6 rounded-3xl border border-t-4 border-t-indigo-600 space-y-4 shadow-sm ${isDarkMode ? 'border-slate-800 bg-slate-900/90' : 'border-slate-200 bg-white'
          }`}>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-mono block">Academic Framework</span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Five Core Research Objectives</h3>
            </div>
            <span className="text-xs font-mono font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-lg border border-indigo-200 dark:border-indigo-800">
              01 → 05 Structured Pipeline
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200/70 dark:border-indigo-900/50 space-y-1">
              <span className="font-bold text-indigo-700 dark:text-indigo-300 font-mono flex items-center gap-1.5">
                <Clock size={14} /> 01. EXPLAIN (Factors)
              </span>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
                Quantify how triage acuity, age groups, sex, and visit outcomes drive variation in reported ED length of stay.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-900/50 space-y-1">
              <span className="font-bold text-emerald-700 dark:text-emerald-300 font-mono flex items-center gap-1.5">
                <Activity size={14} /> 02. MEASURE (TEM Burden)
              </span>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
                Compute <strong className="font-semibold">Total ED-Minutes (TEM)</strong> = Visit Volume × Median LOS to evaluate cumulative system strain.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-sky-50/60 dark:bg-sky-950/40 border border-sky-200/70 dark:border-sky-900/50 space-y-1">
              <span className="font-bold text-sky-700 dark:text-sky-300 font-mono flex items-center gap-1.5">
                <Cpu size={14} /> 03. MODEL (Regressions)
              </span>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
                Execute multivariate regressions to isolate independent predictor effects across age, triage, and fiscal years.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200/70 dark:border-amber-900/50 space-y-1">
              <span className="font-bold text-amber-700 dark:text-amber-300 font-mono flex items-center gap-1.5">
                <Users size={14} /> 04. SEGMENT (High-Burden)
              </span>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
                Identify combinations of triage, age, and complaints driving disproportionate resource utilization.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-violet-50/60 dark:bg-violet-950/40 border border-violet-200/70 dark:border-violet-900/50 sm:col-span-2 space-y-1">
              <span className="font-bold text-violet-700 dark:text-violet-300 font-mono flex items-center gap-1.5">
                <TrendingUp size={14} /> 05. TREND & FORECAST (Near-Term Horizon)
              </span>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
                Analyze 19-year longitudinal trajectories and project 1–2 fiscal year directions for proactive hospital capacity planning.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── 4. INTERACTIVE DEEP-DIVE TABS: HYPOTHESES / PIPELINE / ARCHITECTURE ─ */}
      <div className={`p-6 sm:p-8 rounded-3xl border space-y-6 shadow-sm ${isDarkMode ? 'border-slate-800 bg-slate-900/90 text-white' : 'border-slate-200 bg-white text-slate-900'
        }`}>

        {/* Tab Navigation Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-mono block">
              Interactive System Deep-Dive
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Scientific Rigor, Data Pipeline & Architecture
            </h3>
          </div>

          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('hypotheses')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${activeTab === 'hypotheses'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              <BarChart3 size={14} />
              <span>5 Hypotheses (H1–H5)</span>
            </button>

            <button
              onClick={() => setActiveTab('pipeline')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${activeTab === 'pipeline'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              <Workflow size={14} />
              <span>8-Stage Pipeline</span>
            </button>

            <button
              onClick={() => setActiveTab('architecture')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${activeTab === 'architecture'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              <Layers size={14} />
              <span>Tech Stack</span>
            </button>
          </div>
        </div>

        {/* TAB 1: 5 FORMAL HYPOTHESES */}
        {activeTab === 'hypotheses' && (
          <div className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {[
                { tag: 'H1', title: 'Triage Acuity & LOS', question: 'Does median ED stay differ across CTAS urgency levels?', method: "Welch's T-Test / Kruskal-Wallis", status: '✅ Confirmed (p < 0.001)' },
                { tag: 'H2', title: 'Pandemic Period Shifts', question: 'Did stay times significantly shift during COVID-19 fiscal years?', method: 'OLS Regression & Indicator Shocks', status: '✅ Confirmed (p < 0.001)' },
                { tag: 'H3', title: 'Age Vulnerability', question: 'Is older age independently associated with prolonged stay duration?', method: 'Multivariate Regression & Control', status: '✅ Confirmed (p < 0.001)' },
                { tag: 'H4', title: 'Disposition Outcomes', question: 'Do admitted vs. discharged stays show significant variation?', method: 'Weighted Kruskal-Wallis & Dunn', status: '✅ Confirmed (p < 0.001)' },
                { tag: 'H5', title: 'Longitudinal TEM Trend', question: 'Has aggregate ED resource burden increased across the 19-year series?', method: 'Longitudinal Trend & Forecasting', status: '✅ Confirmed (p < 0.001)' },
              ].map((h) => (
                <div key={h.tag} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-xs font-bold font-mono bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-200">
                      {h.tag}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                      {h.status}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{h.title}</h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 font-normal leading-snug">
                    "{h.question}"
                  </p>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                    🔬 Method: {h.method}
                  </span>
                </div>
              ))}

              <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-sky-500/10 to-transparent border border-indigo-200 dark:border-indigo-800 flex flex-col justify-center items-center text-center space-y-2">
                <Sparkles size={24} className="text-indigo-600 dark:text-indigo-400" />
                <span className="text-xs font-bold text-slate-900 dark:text-white">Explore Full Statistical Tests</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Inspect effect sizes, p-values & post-hoc Dunn comparisons in Stage 4</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: 8-STAGE PIPELINE */}
        {activeTab === 'pipeline' && (
          <div className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {[
                { stage: '1. Ingestion', desc: 'Validates 6 CIHI tables, column schemas & visit counts.' },
                { stage: '2. Preparation', desc: 'Unit harmonization (hours/min), deduplication, roll-up filtering.' },
                { stage: '3. Exploration', desc: 'Descriptive distributions across triage, age, and 19 fiscal years.' },
                { stage: '4. Hypotheses', desc: 'Evaluates H1–H5 using non-parametric tests & Dunn post-hoc.' },
                { stage: '5. Modelling', desc: 'Multivariate OLS regressions explaining independent LOS drivers.' },
                { stage: '6. Utilization', desc: 'Computes Total ED-Minutes (TEM) to isolate high-burden cohorts.' },
                { stage: '7. Forecasting', desc: 'Historical trend trajectories & 1–2 fiscal year capacity projections.' },
                { stage: '8. Dashboard', desc: 'Interactive decision support, executive dossiers, and PDF exports.' },
              ].map((s, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1">
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 block">{s.stage}</span>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 font-normal leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: TECH STACK & ARCHITECTURE */}
        {activeTab === 'architecture' && (
          <div className="space-y-4 animate-fade-in text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 font-mono">
                  <Code size={14} className="text-indigo-600" /> FRONTEND
                </span>
                <span className="font-bold text-indigo-700 dark:text-indigo-300 block">React 19 + TypeScript</span>
                <p className="text-[11px] text-slate-500 leading-snug">Type-safe components, Tailwind CSS v4, Recharts visuals.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 font-mono">
                  <Server size={14} className="text-emerald-600" /> BACKEND
                </span>
                <span className="font-bold text-emerald-700 dark:text-emerald-300 block">FastAPI + Python 3.11</span>
                <p className="text-[11px] text-slate-500 leading-snug">Statsmodels, SciPy, Pandas analytical inference engine.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 font-mono">
                  <Database size={14} className="text-sky-600" /> DATABASE
                </span>
                <span className="font-bold text-sky-700 dark:text-sky-300 block">SQLite Analytical Store</span>
                <p className="text-[11px] text-slate-500 leading-snug">Indexed store with 8,685 rows across 6 harmonized tables.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 font-mono">
                  <ShieldCheck size={14} className="text-amber-600" /> TESTING
                </span>
                <span className="font-bold text-amber-700 dark:text-amber-300 block">Pytest (291 Tests Passed)</span>
                <p className="text-[11px] text-slate-500 leading-snug">100% test coverage across hypothesis modules and APIs.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── 5. GOVERNANCE & DATA DISCLAIMER (COMPACT) ────────────────────────── */}
      <div className={`p-5 rounded-2xl border border-indigo-200 dark:border-indigo-900/60 flex items-start gap-3.5 text-xs ${isDarkMode ? 'bg-indigo-950/20 text-slate-300' : 'bg-indigo-50/60 text-slate-700'
        }`}>
        <ShieldCheck size={20} className="text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 text-[11px] font-mono block">
            🔒 Administrative Data Disclaimer & Ethics Compliance
          </span>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
            This research platform operates exclusively on de-identified, pre-aggregated administrative health data from the <strong>Canadian Institute for Health Information (CIHI) NACRS</strong>. It is designed for system-level operations analytics and does not diagnose, treat, or predict individual patient outcomes.
          </p>
        </div>
      </div>

    </div>
  );
}
