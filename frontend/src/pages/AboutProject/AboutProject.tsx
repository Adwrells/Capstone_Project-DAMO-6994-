/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  GraduationCap, Database, Cpu, FileText, TrendingUp, Users, Activity,
  Sparkles, ArrowRight, ShieldCheck, CheckCircle2, Server, Layers,
  Clock, BarChart3, AlertTriangle, Workflow, Code, Zap, ChevronRight
} from 'lucide-react';

interface AboutProjectProps {
  onReset: () => void;
  isDarkMode?: boolean;
  onBeginPrep?: () => void;
}

export default function AboutProject({ onReset, isDarkMode = false, onBeginPrep }: AboutProjectProps) {
  return (
    <div className="space-y-10 text-left font-sans animate-fade-in max-w-6xl mx-auto pb-12" id="about-project-stage">

      {/* ── 1. PROFESSIONAL HERO SECTION ─────────────────────────────────── */}
      <div className={`relative overflow-hidden rounded-3xl border p-8 md:p-10 shadow-lg transition-all ${
        isDarkMode
          ? 'border-indigo-900/40 bg-gradient-to-br from-slate-900 via-slate-900/95 to-indigo-950/30 text-white'
          : 'border-indigo-100 bg-gradient-to-br from-white via-slate-50/50 to-indigo-50/20 text-slate-900'
      }`}>
        {/* Background Decorative Accent Gradients */}
        <div className="absolute -right-16 -top-16 w-96 h-96 rounded-full bg-gradient-to-br from-indigo-500/10 via-sky-500/10 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 bottom-0 w-72 h-72 rounded-full bg-emerald-500/5 blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-6 w-full">

          {/* Top Pill Badges */}
          <div className="flex flex-nowrap items-center gap-2.5 overflow-x-auto scrollbar-none whitespace-nowrap pb-1 sm:pb-0">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] sm:text-xs font-bold font-mono tracking-wider uppercase whitespace-nowrap shrink-0 bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-500/25 shadow-2xs">
              <GraduationCap size={14} className="text-indigo-600 dark:text-indigo-400" />
              🇨🇦 CIHI NACRS AGGREGATE DATA
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] sm:text-xs font-bold font-mono tracking-wider uppercase whitespace-nowrap shrink-0 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25 shadow-2xs">
              <ShieldCheck size={14} className="text-emerald-600 dark:text-emerald-400" />
              📊 HEALTHCARE ANALYTICS & DECISION SUPPORT
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] sm:text-xs font-bold font-mono tracking-wider uppercase whitespace-nowrap shrink-0 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-2xs">
              🎓 MASTER'S CAPSTONE PROJECT
            </span>
          </div>

          {/* Main Title & Subtitle */}
          <div className="space-y-4 w-full">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight text-slate-900 dark:text-white font-display">
              Canadian Emergency Department Analytics Platform
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base font-normal leading-relaxed text-pretty border-l-4 border-indigo-600 dark:border-indigo-400 pl-4 py-1 max-w-5xl">
              An interactive healthcare analytics platform built using CIHI National Ambulatory Care Reporting System (NACRS) aggregate data to analyze emergency department length of stay, visit trends, patient demographics, triage acuity, disposition outcomes, and estimated resource burden across Canadian hospitals. The platform integrates statistical analysis, hypothesis testing, executive dashboards, and strategic reporting to support evidence-based healthcare decision-making.
            </p>
          </div>

          {/* Action Row */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={onBeginPrep}
              className="h-12 px-7 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 cursor-pointer select-none"
              id="hero-begin-data-prep-btn"
            >
              <Database size={17} />
              <span>Begin Data Preparation</span>
              <ArrowRight size={17} className="ml-1" />
            </button>
          </div>
        </div>
      </div>

      {/* ── 2. EXECUTIVE SUMMARY CARDS (4 METRIC CARDS) ───────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" id="executive-summary-cards">

        {/* Card 1: Core Ingestion */}
        <div className={`p-6 rounded-2xl border border-t-4 border-t-indigo-600 space-y-4 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 ${
          isDarkMode ? 'border-slate-800 bg-slate-900/90 text-white' : 'border-slate-200 bg-white text-slate-900'
        }`}>
          {/* 1. Icon */}
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200/80 dark:border-indigo-800/80 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-2xs">
            <Database size={22} />
          </div>

          {/* 2. Heading */}
          <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
            Core Ingestion
          </h3>

          {/* 3. Classname / Tag */}
          <div>
            <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-mono font-bold uppercase bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-200 border border-indigo-300/80 dark:border-indigo-700/60">
              3 Approved Datasets
            </span>
          </div>

          {/* 4. Description */}
          <p className="text-xs text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
            Preloaded from SQLite store: Chief Complaints, Longitudinal ED Visits (2003–2021), & Post-Pandemic Provincial Statistics.
          </p>
        </div>

        {/* Card 2: Feature Engineering */}
        <div className={`p-6 rounded-2xl border border-t-4 border-t-emerald-600 space-y-4 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 ${
          isDarkMode ? 'border-slate-800 bg-slate-900/90 text-white' : 'border-slate-200 bg-white text-slate-900'
        }`}>
          {/* 1. Icon */}
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200/80 dark:border-emerald-800/80 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-2xs">
            <Zap size={22} />
          </div>

          {/* 2. Heading */}
          <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
            Feature Engineering
          </h3>

          {/* 3. Classname / Tag */}
          <div>
            <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-mono font-bold uppercase bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 border border-emerald-300/80 dark:border-emerald-700/60">
              20+ Clinical Variables
            </span>
          </div>

          {/* 4. Description */}
          <p className="text-xs text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
            Engineered TEM (Total ED Minutes), Resource Utilization Index (RUI), CTAS Integer Encodings, and Pandemic Cohort Markers.
          </p>
        </div>

        {/* Card 3: Modeling Engine */}
        <div className={`p-6 rounded-2xl border border-t-4 border-t-amber-600 space-y-4 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 ${
          isDarkMode ? 'border-slate-800 bg-slate-900/90 text-white' : 'border-slate-200 bg-white text-slate-900'
        }`}>
          {/* 1. Icon */}
          <div className="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-950/80 border border-amber-200/80 dark:border-amber-800/80 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-2xs">
            <Cpu size={22} />
          </div>

          {/* 2. Heading */}
          <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
            Modeling Engine
          </h3>

          {/* 3. Classname / Tag */}
          <div>
            <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-mono font-bold uppercase bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 border border-amber-300/80 dark:border-amber-700/60">
              4 Solver Frameworks
            </span>
          </div>

          {/* 4. Description */}
          <p className="text-xs text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
            Welch T-Tests, OLS Regressions, Longitudinal ARIMA Forecasting, and Lloyds K-Means Patient Acuity Clustering.
          </p>
        </div>

        {/* Card 4: Governance */}
        <div className={`p-6 rounded-2xl border border-t-4 border-t-sky-600 space-y-4 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 ${
          isDarkMode ? 'border-slate-800 bg-slate-900/90 text-white' : 'border-slate-200 bg-white text-slate-900'
        }`}>
          {/* 1. Icon */}
          <div className="w-11 h-11 rounded-2xl bg-sky-50 dark:bg-sky-950/80 border border-sky-200/80 dark:border-sky-800/80 flex items-center justify-center text-sky-600 dark:text-sky-400 shadow-2xs">
            <ShieldCheck size={22} />
          </div>

          {/* 2. Heading */}
          <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
            Governance & Compliance
          </h3>

          {/* 3. Classname / Tag */}
          <div>
            <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-mono font-bold uppercase bg-sky-100 dark:bg-sky-900/60 text-sky-800 dark:text-sky-200 border border-sky-300/80 dark:border-sky-700/60">
              100% CIHI Aggregate
            </span>
          </div>

          {/* 4. Description */}
          <p className="text-xs text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
            Fully anonymized administrative research cohorts adhering to Canadian Institute for Health Information standards.
          </p>
        </div>
      </div>

      {/* ── 3. CLINICAL PROBLEM & RESEARCH OBJECTIVES GRID ───────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Clinical Problem Card */}
        <div className={`lg:col-span-5 p-7 rounded-3xl border border-t-4 border-t-rose-600 flex flex-col justify-between shadow-sm ${
          isDarkMode ? 'border-slate-800 bg-slate-900/90' : 'border-slate-200 bg-white'
        }`}>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                <AlertTriangle size={22} />
              </span>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 font-mono block">Systemic Challenge</span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Clinical Problem Statement</h3>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              <strong className="font-semibold text-slate-900 dark:text-white">Emergency Departments (EDs)</strong> serve as the critical gateway of Canadian hospital care. However, rising patient complexity, aging demographics, and systemic hospital bed shortages create chronic ED crowding and prolonged patient Length of Stay (LOS).
            </p>

            <div className="space-y-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  CTAS Level 3 Triage Bottlenecks
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal pl-4">
                  "Urgent" Level 3 patients experience disproportionate delays due to clinical priority queuing behind resuscitation cases.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Roster Misalignment & Burnout
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal pl-4">
                  Static nurse roster schedules fail to anticipate peak arrival hours, triggering ambulance diversions and elevated LWBS rates.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
            <span>Focus: NACRS Ambulatory Cohorts</span>
            <span className="text-rose-600 dark:text-rose-400 font-bold uppercase">High Severity Impact</span>
          </div>
        </div>

        {/* Research Objectives Card */}
        <div className={`lg:col-span-7 p-7 rounded-3xl border border-t-4 border-t-indigo-600 space-y-5 shadow-sm ${
          isDarkMode ? 'border-slate-800 bg-slate-900/90' : 'border-slate-200 bg-white'
        }`}>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-mono block">Academic Framework</span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Research Objectives & Hypotheses</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            {/* Obj 1 */}
            <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200/70 dark:border-indigo-900/50 space-y-2.5 hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 font-mono">01. ACUITY</span>
                <Clock size={16} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Acuity Profiling</h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
                Quantify the statistical impact of CTAS level boarding on total stay times and prove CTAS 3 bottleneck hypotheses.
              </p>
            </div>

            {/* Obj 2 */}
            <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-900/50 space-y-2.5 hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 font-mono">02. RESOURCES</span>
                <Activity size={16} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Resource Modeling</h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
                Map regional resource complexity via Resource Utilization Index (RUI) across fiscal years and COVID-19 cohorts.
              </p>
            </div>

            {/* Obj 3 */}
            <div className="p-4 rounded-2xl bg-sky-50/60 dark:bg-sky-950/40 border border-sky-200/70 dark:border-sky-900/50 space-y-2.5 hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-700 dark:text-sky-300 font-mono">03. FORECAST</span>
                <TrendingUp size={16} className="text-sky-600 dark:text-sky-400" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Pathway Forecasting</h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
                Implement OLS regressions & ARIMA longitudinal projections to provide actionable patient-flow foresight.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between">
            <span className="text-xs text-slate-600 dark:text-slate-300 font-normal">
              Ready to process the datasets and execute data cleaning?
            </span>
            <button
              onClick={onBeginPrep}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <span>Begin Prep Engine</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ── 4. PLATFORM WORKFLOW DIAGRAM ──────────────────────────────────── */}
      <div className={`p-8 rounded-3xl border space-y-6 shadow-sm ${
        isDarkMode ? 'border-slate-800 bg-slate-900/90' : 'border-slate-200 bg-white'
      }`} id="platform-workflow-diagram">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-mono block">End-to-End Pipeline</span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Platform Workflow & Execution Sequence</h3>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800">
            5 Interconnected Enterprise Stages
          </span>
        </div>

        {/* Workflow Diagram Grid with Step Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">

          {/* Stage 1 */}
          <div className="p-5 rounded-2xl border border-t-4 border-t-indigo-600 border-indigo-200/80 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/30 space-y-2.5 relative group hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 font-mono uppercase bg-indigo-100 dark:bg-indigo-900/60 px-2 py-0.5 rounded">Stage 1</span>
              <Database size={18} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">SQLite Ingestion</h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
              Automatic loading of 3 approved CIHI datasets from SQLite store.
            </p>
          </div>

          {/* Stage 2 */}
          <div className="p-5 rounded-2xl border border-t-4 border-t-emerald-600 border-emerald-200/80 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/30 space-y-2.5 relative group hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 font-mono uppercase bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded">Stage 2</span>
              <Workflow size={18} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Prep & Quality Engine</h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
              Schema validation, deduplication, imputation, and feature engineering.
            </p>
          </div>

          {/* Stage 3 */}
          <div className="p-5 rounded-2xl border border-t-4 border-t-sky-600 border-sky-200/80 dark:border-sky-900/60 bg-sky-50/40 dark:bg-sky-950/30 space-y-2.5 relative group hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-sky-700 dark:text-sky-300 font-mono uppercase bg-sky-100 dark:bg-sky-900/60 px-2 py-0.5 rounded">Stage 3</span>
              <BarChart3 size={18} className="text-sky-600 dark:text-sky-400" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Analytical Explorer</h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
              Vectorized DuckDB queries, filtering, and distribution summaries.
            </p>
          </div>

          {/* Stage 4 */}
          <div className="p-5 rounded-2xl border border-t-4 border-t-violet-600 border-violet-200/80 dark:border-violet-900/60 bg-violet-50/40 dark:bg-violet-950/30 space-y-2.5 relative group hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-violet-700 dark:text-violet-300 font-mono uppercase bg-violet-100 dark:bg-violet-900/60 px-2 py-0.5 rounded">Stage 4</span>
              <Cpu size={18} className="text-violet-600 dark:text-violet-400" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Statistical Modeling</h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
              Welch T-Tests, OLS regressions, ARIMA forecasting, and Gemini AI.
            </p>
          </div>

          {/* Stage 5 */}
          <div className="p-5 rounded-2xl border border-t-4 border-t-amber-600 border-amber-200/80 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/30 space-y-2.5 relative group hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 font-mono uppercase bg-amber-100 dark:bg-amber-900/60 px-2 py-0.5 rounded">Stage 5</span>
              <TrendingUp size={18} className="text-amber-600 dark:text-amber-400" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Executive Dashboard</h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
              Executive KPIs, chart builder, strategic consultant dossier reports.
            </p>
          </div>
        </div>
      </div>

      {/* ── 5. TECHNOLOGY STACK & ARCHITECTURE OVERVIEW ──────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="technology-stack-section">

        {/* Technology Stack Section */}
        <div className={`lg:col-span-6 p-7 rounded-3xl border border-t-4 border-t-indigo-600 space-y-5 shadow-sm ${
          isDarkMode ? 'border-slate-800 bg-slate-900/90' : 'border-slate-200 bg-white'
        }`}>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-mono block">Infrastructure</span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Technology Stack</h3>
          </div>

          <div className="grid grid-cols-2 gap-3.5 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Code size={14} className="text-indigo-600 dark:text-indigo-400" />
                React 18 & TypeScript
              </span>
              <span className="text-[11px] text-slate-600 dark:text-slate-300 font-normal block leading-relaxed">Type-safe component architecture with instant re-renders.</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Database size={14} className="text-emerald-600 dark:text-emerald-400" />
                SQLite & Better-SQLite3
              </span>
              <span className="text-[11px] text-slate-600 dark:text-slate-300 font-normal block leading-relaxed">Disk-backed persistent database store with WAL mode.</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Zap size={14} className="text-amber-600 dark:text-amber-400" />
                Emulated DuckDB Engine
              </span>
              <span className="text-[11px] text-slate-600 dark:text-slate-300 font-normal block leading-relaxed">Vectorized SQL processing with Parquet columnar storage.</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sparkles size={14} className="text-sky-600 dark:text-sky-400" />
                Google Gemini 3.6 AI
              </span>
              <span className="text-[11px] text-slate-600 dark:text-slate-300 font-normal block leading-relaxed">Generative AI model for automated clinical narrative insights.</span>
            </div>
          </div>
        </div>

        {/* Platform Architecture Overview */}
        <div className={`lg:col-span-6 p-7 rounded-3xl border border-t-4 border-t-emerald-600 space-y-5 shadow-sm ${
          isDarkMode ? 'border-slate-800 bg-slate-900/90' : 'border-slate-200 bg-white'
        }`}>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-mono block">System Design</span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Platform Architecture Overview</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-900 dark:text-white block">Layer 1: Client Presentation Layer</span>
                <span className="text-[11px] text-slate-600 dark:text-slate-300 font-normal">Single-Page App canvas, theme state manager, interactive dashboard</span>
              </div>
              <Layers size={18} className="text-indigo-600 dark:text-indigo-400 shrink-0 ml-2" />
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-900 dark:text-white block">Layer 2: Express API & Cache Gateway</span>
                <span className="text-[11px] text-slate-600 dark:text-slate-300 font-normal">REST endpoints, Redis-style in-memory cache, audit logging</span>
              </div>
              <Server size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0 ml-2" />
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-900 dark:text-white block">Layer 3: Storage & Analytical Engine</span>
                <span className="text-[11px] text-slate-600 dark:text-slate-300 font-normal">SQLite database, Parquet columnar store, statistical regressors</span>
              </div>
              <Database size={18} className="text-sky-600 dark:text-sky-400 shrink-0 ml-2" />
            </div>
          </div>
        </div>
      </div>

      {/* ── 6. ADMINISTRATIVE DATA DISCLAIMER ────────────────────────────── */}
      <div className={`p-6 rounded-3xl border border-indigo-200 dark:border-indigo-900/60 flex items-start gap-4 shadow-sm ${
        isDarkMode ? 'bg-gradient-to-r from-indigo-950/30 via-slate-900 to-slate-900 text-slate-200' : 'bg-gradient-to-r from-indigo-50/70 via-white to-slate-50 text-slate-800'
      }`}>
        <ShieldCheck size={24} className="text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
        <div className="space-y-1.5 text-xs leading-relaxed font-normal">
          <span className="font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 text-[11px] font-mono block">
            Administrative Data Disclaimer — CIHI Aggregate Data
          </span>
          <p className="text-slate-600 dark:text-slate-300">
            This analytics platform utilizes aggregate administrative health data sourced from the Canadian Institute for Health Information (CIHI) National Ambulatory Care Reporting System (NACRS). Data files are de-identified, non-identifiable, and compliant with institutional research ethics and Canadian health data governance.
          </p>
        </div>
      </div>

      {/* ── 7. BOTTOM CALL-TO-ACTION & RESET BAR ─────────────────────────── */}
      <div className={`p-8 rounded-3xl border flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md ${
        isDarkMode ? 'border-slate-800 bg-slate-900/90' : 'border-slate-200 bg-white'
      }`}>
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Ready to Execute Data Preparation & Quality Engine?</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 font-normal">
            Proceed to Page 2 to inspect SQLite database tables, run schema validation, and merge longitudinal cohorts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onReset}
            className="h-11 px-5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer transition shadow-2xs"
          >
            Reset Session
          </button>

          <button
            onClick={onBeginPrep}
            className="h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md hover:shadow-lg transition flex items-center gap-2 cursor-pointer select-none"
            id="bottom-begin-data-prep-btn"
          >
            <Database size={16} />
            <span>Begin Data Preparation</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

    </div>
  );
}
