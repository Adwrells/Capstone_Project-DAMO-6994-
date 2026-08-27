/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  TrendingUp,
  Activity,
  Layers,
  ArrowRight,
  Compass,
  Calendar,
  Info,
  Scale,
  RefreshCw,
  Sliders,
  Clock,
  Sparkles,
  Database,
  Calculator,
  Target,
  FileCheck,
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  LayoutDashboard,
  Check,
  FileSpreadsheet,
} from 'lucide-react';
import { fetchStrategicInsights } from '../../services/apiService';

// Type Definitions conforming to Master Implementation Specification
type EvidenceStrength =
  | 'Strong'
  | 'Moderate'
  | 'Limited'
  | 'Exploratory'
  | 'Insufficient';

type Priority = 'Critical' | 'High' | 'Medium' | 'Monitor';

interface StrategicInsight {
  id: string;
  title: string;
  sourceType: 'hypothesis' | 'regression' | 'trend' | 'forecast' | 'dashboard' | 'unavailable';
  sourceIds: string[];
  verifiedFinding: string;
  finding?: string;
  methodology: string;
  method?: string;
  metrics: {
    pValue?: number | null;
    effectSize?: number | null;
    effectMagnitude?: string | null;
    effectMetric?: string | null;
    modelMetric?: number | null;
    trendStatistic?: number | null;
    trendDirection?: string | null;
    sensSlope?: number | null;
    slope?: number | null;
    intercept?: number | null;
    rejectNull?: boolean | null;
    decision?: string | null;
    erbiScore?: number | null;
    weightedN?: number | null;
    hStatistic?: number | null;
    uStatistic?: number | null;
    chi2?: number | null;
    forecast?: any;
  };
  statisticalConclusion: string;
  evidenceStrength: EvidenceStrength;
  whyItMatters?: string;
  practicalInterpretation: string;
  strategicImplication: string;
  recommendedAction: string;
  priority: Priority;
  practicalImportance: string;
  decisionBoundary: string;
  groupSummaries?: any[];
}

interface ScorecardItem {
  id: string;
  title: string;
  tier: string;
  priority: Priority;
  evidence: string;
  why: string;
  action: string;
}

interface DashboardInsightItem {
  letter: string;
  title: string;
  dashboardObservation: string;
  analyticalValidation: string;
  whyItMatters: string;
  strategicConsideration: string;
  evidenceLabel: string;
  boundary: string;
}

interface ExecutiveTakeaway {
  number: string;
  title: string;
  finding: string;
  relevance: string;
  evidence: string;
}

interface PriorityRecommendation {
  id: string;
  number: string;
  title: string;
  priority: Priority;
  supportingSourceIds: string[];
  strategicRationale: string;
  planningInputs?: string[];
  investigationDomains?: string[];
  monitoringDimensions?: string[];
  workflowSteps?: string[];
  reportingStandards?: string[];
  note?: string;
  expectedStrategicValue: string;
  decisionBoundary: string;
}

interface StrategicPayload {
  dataSource: string;
  alpha: number;
  evidenceIndicators: {
    evidenceSourcesCount: number;
    hypothesesSynthesized: string;
    modelTrendOutputsCount: string;
    decisionScope: string;
  };
  executiveStatement: string;
  executiveTakeaways: ExecutiveTakeaway[];
  scorecardItems: ScorecardItem[];
  dashboardInsights: DashboardInsightItem[];
  statisticalValidation: StrategicInsight[];
  evidenceMatrix: StrategicInsight[];
  recommendations: PriorityRecommendation[];
  boundariesSupports: string[];
  boundariesNotProven: string[];
  finalConclusion: string;
  roadmap: {
    immediate: string[];
    mediumTerm: string[];
    longTerm: string[];
  };
  synthesisErrors?: string[] | null;
}

interface ConsultantInsightsProps {
  isLoading?: boolean;
}

export default function ConsultantInsights({ isLoading: parentLoading }: ConsultantInsightsProps) {
  const [data, setData] = useState<StrategicPayload | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedInsightFilter, setSelectedInsightFilter] = useState<'ALL' | 'H1' | 'H2' | 'H3' | 'H4' | 'H5'>('ALL');
  const [showEvidenceTooltip, setShowEvidenceTooltip] = useState<boolean>(false);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchStrategicInsights();
      if (res && res.success) {
        setData(res);
      } else {
        throw new Error(res?.detail || res?.message || 'Failed to synthesize strategic insights');
      }
    } catch (err: any) {
      console.error('[Strategic Insights Error]', err);
      setError(err?.message || 'Unable to load strategic evidence synthesis.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading || parentLoading) {
    return (
      <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-sm animate-pulse" id="insights-loading">
        <Sparkles size={28} className="text-[#0F4C81] dark:text-[#3B82F6] animate-spin" />
        <h4 className="text-slate-800 dark:text-white font-sans text-sm font-bold">Synthesizing Strategic Decision Support Evidence...</h4>
        <p className="text-xs text-slate-500 max-w-md font-light leading-relaxed">
          Translating completed H1–H5 hypothesis tests, WLS regression, Mann-Kendall trend models, and dashboard metrics into evidence-based executive decision support.
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="border border-rose-200 dark:border-rose-900/40 bg-rose-50/40 dark:bg-rose-950/20 rounded-xl p-8 text-center space-y-4">
        <AlertCircle size={32} className="text-rose-500 mx-auto" />
        <h3 className="text-base font-bold text-rose-800 dark:text-rose-300">Unable to Load Strategic Evidence</h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
          {error || 'Unable to load the latest strategic evidence. Please review the underlying analysis results.'}
        </p>
        <button
          onClick={loadData}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#0F4C81] hover:bg-[#0c3c66] dark:bg-[#3B82F6] dark:hover:bg-[#2563eb] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          <RefreshCw size={14} />
          Retry Evidence Synthesis
        </button>
      </div>
    );
  }

  const {
    evidenceIndicators,
    executiveStatement,
    executiveTakeaways,
    scorecardItems,
    dashboardInsights,
    statisticalValidation,
    evidenceMatrix,
    recommendations,
    boundariesSupports,
    boundariesNotProven,
    finalConclusion,
    roadmap,
  } = data;

  const filteredMatrix = selectedInsightFilter === 'ALL'
    ? evidenceMatrix
    : evidenceMatrix.filter(item => item.id === selectedInsightFilter);

  return (
    <div className="space-y-10 text-left animate-fade-in pb-16 font-sans" id="strategic-insights-section">
      
      {/* ========================================================================= */}
      {/* SECTION 01 — EXECUTIVE DECISION SUMMARY                                   */}
      {/* ========================================================================= */}
      <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131f37] rounded-xl p-6.5 shadow-xs space-y-6">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-[#0F4C81]/10 dark:bg-[#3B82F6]/10 border border-[#0F4C81]/20 dark:border-[#3B82F6]/20 text-[10px] text-[#0F4C81] dark:text-[#3B82F6] font-semibold tracking-wider uppercase font-mono">
                STAGE 6 · STRATEGIC DECISION SUPPORT
              </span>
              <span className="text-xs text-slate-400 font-normal">Evidence-Bound Executive Synthesis</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1.5">
              Strategic Insights &amp; Recommendations
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-xs font-light mt-1.5 max-w-3xl leading-relaxed">
              This section translates completed aggregate emergency department analysis, dashboard evidence, statistical testing, explanatory modelling, and longitudinal trend analysis into evidence-informed planning considerations. Findings are interpreted within the scope of the available CIHI NACRS aggregate data and do not establish individual-level outcomes or causal mechanisms.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto bg-slate-50 dark:bg-[#182640] px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px] font-mono text-slate-500 dark:text-slate-400 shrink-0">
            <Scale size={14} className="text-[#0F4C81] dark:text-[#3B82F6]" />
            <span>Scope: <strong className="text-slate-800 dark:text-slate-200">Aggregate-Level Planning</strong></span>
          </div>
        </div>

        {/* 4 Compact Evidence Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 text-xs font-mono">
          <div className="p-3 bg-slate-50 dark:bg-[#182640]/70 rounded-lg border border-slate-200/80 dark:border-slate-700/60 flex items-center gap-3">
            <Database size={18} className="text-[#0F4C81] dark:text-[#3B82F6] shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-sans">Evidence Base</span>
              <span className="font-bold text-slate-900 dark:text-white text-xs">{evidenceIndicators?.evidenceSourcesCount || 5} Data Tables &amp; Services</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-[#182640]/70 rounded-lg border border-slate-200/80 dark:border-slate-700/60 flex items-center gap-3">
            <FileCheck size={18} className="text-[#2E8B57] shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-sans">Hypotheses Synthesized</span>
              <span className="font-bold text-slate-900 dark:text-white text-xs">{evidenceIndicators?.hypothesesSynthesized || 'H1–H5'}</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-[#182640]/70 rounded-lg border border-slate-200/80 dark:border-slate-700/60 flex items-center gap-3">
            <Calculator size={18} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-sans">Analytical Engines</span>
              <span className="font-bold text-slate-900 dark:text-white text-xs">{evidenceIndicators?.modelTrendOutputsCount || '4 Evidence Streams'}</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-[#182640]/70 rounded-lg border border-slate-200/80 dark:border-slate-700/60 flex items-center gap-3">
            <Target size={18} className="text-amber-600 dark:text-amber-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-sans">Decision Scope</span>
              <span className="font-bold text-slate-900 dark:text-white text-xs">{evidenceIndicators?.decisionScope || 'Aggregate-Level Planning'}</span>
            </div>
          </div>
        </div>

        {/* Executive Decision Statement (Prominent Callout) */}
        <div className="p-4.5 rounded-xl bg-gradient-to-r from-[#0F4C81]/10 via-[#0F4C81]/5 to-transparent dark:from-[#3B82F6]/15 dark:via-[#3B82F6]/5 dark:to-transparent border-l-4 border-[#0F4C81] dark:border-[#3B82F6] border-y border-r border-slate-200/80 dark:border-slate-800 space-y-1.5">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0F4C81] dark:text-[#3B82F6] flex items-center gap-1.5">
            <Sparkles size={13} />
            Executive Decision Statement
          </span>
          <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
            {executiveStatement}
          </p>
        </div>

        {/* Four Executive Takeaway Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          {executiveTakeaways.map((takeaway) => (
            <div
              key={takeaway.number}
              className="p-4 rounded-xl bg-slate-50/70 dark:bg-[#182640]/40 border border-slate-200 dark:border-slate-700/60 space-y-2 flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    TAKEAWAY {takeaway.number}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 font-bold">{takeaway.evidence}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                  {takeaway.title}
                </h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 font-light leading-relaxed">
                  {takeaway.finding}
                </p>
              </div>
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/50 text-[10px] text-slate-500 dark:text-slate-400 font-light">
                <strong className="font-semibold text-slate-700 dark:text-slate-200">Decision:</strong> {takeaway.relevance}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* ========================================================================= */}
      {/* SECTION 02 — STRATEGIC PRIORITY SCORECARD                                 */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div className="flex items-center gap-2">
            <Sliders size={18} className="text-[#0F4C81] dark:text-[#3B82F6]" />
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-white font-mono">
              02 · Strategic Priority Scorecard
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-light">
            Answers: <em>What should decision-makers pay attention to first?</em>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {scorecardItems.map((item, idx) => {
            const tierStyle = {
              'CRITICAL / HIGH': 'border-amber-400 dark:border-amber-500/80 bg-amber-50/30 dark:bg-amber-950/20 text-amber-900 dark:text-amber-200',
              'HIGH PRIORITY': 'border-blue-300 dark:border-blue-700 bg-blue-50/30 dark:bg-blue-950/20 text-blue-900 dark:text-blue-200',
              'MONITOR': 'border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 text-slate-700 dark:text-slate-300',
            }[item.tier] || 'border-slate-200 bg-white text-slate-700';

            const badgeBg = {
              'CRITICAL / HIGH': 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700',
              'HIGH PRIORITY': 'bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700',
              'MONITOR': 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600',
            }[item.tier] || 'bg-slate-100 text-slate-700';

            return (
              <div
                key={item.id || idx}
                className={`rounded-xl p-4.5 border shadow-3xs flex flex-col justify-between space-y-3 ${tierStyle}`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase border ${badgeBg}`}>
                      {item.tier}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 font-bold">{item.evidence}</span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                    {item.title}
                  </h3>
                  <div className="space-y-1 text-[11px] font-light leading-relaxed">
                    <p><strong className="font-semibold text-slate-800 dark:text-slate-200">Why:</strong> {item.why}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px] font-light leading-relaxed">
                  <strong className="font-semibold text-slate-800 dark:text-slate-200 block text-[10px] uppercase font-mono tracking-wider">
                    Action Direction:
                  </strong>
                  <span>{item.action}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 03 — DASHBOARD INSIGHTS & EVIDENCE                                */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div className="flex items-center gap-2">
            <LayoutDashboard size={18} className="text-[#0F4C81] dark:text-[#3B82F6]" />
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-white font-mono">
              03 · Dashboard Insights &amp; Evidence
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-light">
            Directly connected to Stage 5 Executive Dashboard visuals &amp; SQLite data
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {dashboardInsights.map((ins) => (
            <div
              key={ins.letter}
              className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131f37] rounded-xl p-5.5 shadow-3xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-[#0F4C81] text-white dark:bg-[#3B82F6] flex items-center justify-center text-[10px] font-bold font-mono">
                      {ins.letter}
                    </span>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                      {ins.title}
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono text-[9px] font-bold uppercase border border-slate-200 dark:border-slate-700">
                    {ins.evidenceLabel}
                  </span>
                </div>

                {/* What the Dashboard Shows */}
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#182640]/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400 block flex items-center gap-1">
                    <LayoutDashboard size={11} className="text-[#0F4C81] dark:text-[#3B82F6]" />
                    What the Dashboard Shows
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-light leading-relaxed">
                    {ins.dashboardObservation}
                  </p>
                </div>

                {/* What the Analysis Validates */}
                <div className="p-3 rounded-lg bg-blue-50/40 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-900/40 space-y-1">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#0F4C81] dark:text-[#3B82F6] block flex items-center gap-1">
                    <FileCheck size={11} />
                    What the Analysis Validates
                  </span>
                  <p className="text-xs text-slate-800 dark:text-slate-200 font-light leading-relaxed font-mono">
                    {ins.analyticalValidation}
                  </p>
                </div>

                {/* Why It Matters */}
                <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300 font-light leading-relaxed">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                    Why It Matters
                  </span>
                  <p>{ins.whyItMatters}</p>
                </div>

                {/* Strategic Consideration */}
                <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300 font-light leading-relaxed">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#0F4C81] dark:text-[#3B82F6] block">
                    Strategic Consideration
                  </span>
                  <p>{ins.strategicConsideration}</p>
                </div>
              </div>

              {/* Boundary */}
              <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-start gap-1.5 text-[10px] text-slate-400 font-mono">
                <span className="text-amber-500 font-bold shrink-0">BOUNDARY:</span>
                <span className="leading-tight font-sans font-light text-slate-500 dark:text-slate-400">{ins.boundary}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 04 — STATISTICAL VALIDATION & ANALYTICAL INTERPRETATION           */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator size={18} className="text-[#0F4C81] dark:text-[#3B82F6]" />
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-white font-mono">
              04 · Statistical Validation &amp; Analytical Interpretation
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-light font-mono">H1–H5 &amp; Longitudinal Models</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {statisticalValidation.map((stat, sIdx) => (
            <div
              key={stat.id || sIdx}
              className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131f37] rounded-xl p-4.5 shadow-3xs flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-[#0F4C81] text-white dark:bg-[#3B82F6] font-mono text-[10px] font-bold">
                    {stat.id}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 font-bold">{stat.evidenceStrength} Evidence</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                  {stat.title}
                </h4>
                <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 space-y-0.5">
                  <div><span className="text-slate-400 font-sans">Method:</span> {stat.methodology}</div>
                  <div><span className="text-slate-400 font-sans">Decision:</span> <strong className="text-slate-800 dark:text-slate-200">{stat.statisticalConclusion}</strong></div>
                </div>
                <div className="p-2.5 bg-slate-50 dark:bg-[#182640]/50 rounded-lg border border-slate-200/60 dark:border-slate-700/50 space-y-1 text-xs font-light text-slate-700 dark:text-slate-300 leading-relaxed">
                  <span className="text-[9px] font-mono font-bold uppercase text-slate-400 block">Practical Interpretation</span>
                  <p>{stat.practicalInterpretation}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] font-mono text-slate-400">
                <span className="text-slate-700 dark:text-slate-300 font-sans font-light block leading-relaxed">
                  <strong className="font-semibold text-slate-800 dark:text-slate-200">Relevance:</strong> {stat.strategicImplication}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 05 — H1–H5 EVIDENCE-TO-ACTION MATRIX                              */}
      {/* ========================================================================= */}
      <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131f37] rounded-xl p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Layers size={18} className="text-[#0F4C81] dark:text-[#3B82F6]" />
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-white font-mono">
                05 · H1–H5 Evidence-to-Action Matrix
              </h2>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowEvidenceTooltip(!showEvidenceTooltip)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-0.5"
                  title="Evidence Strength Definition"
                >
                  <HelpCircle size={14} />
                </button>
                {showEvidenceTooltip && (
                  <div className="absolute left-0 top-6 z-20 w-80 p-3 bg-slate-900 text-white rounded-lg shadow-xl text-[11px] font-sans font-light leading-relaxed border border-slate-700">
                    <div className="font-bold text-slate-200 mb-1 flex items-center gap-1.5">
                      <Info size={13} className="text-sky-400" />
                      Evidence Strength Framework
                    </div>
                    Evidence strength reflects the combined interpretation of statistical support, effect magnitude, practical relevance, consistency with related findings, data coverage, and methodological limitations. Evidence strength is not determined by p-value alone.
                  </div>
                )}
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-light mt-0.5">
              Comprehensive synthesis of all five approved hypothesis tests into actionable healthcare planning considerations.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#182640] p-1 rounded-lg border border-slate-200 dark:border-slate-700 self-start sm:self-auto">
            {(['ALL', 'H1', 'H2', 'H3', 'H4', 'H5'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedInsightFilter(tab)}
                className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                  selectedInsightFilter === tab
                    ? 'bg-white dark:bg-[#0F4C81] text-[#0F4C81] dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Matrix Rows */}
        <div className="space-y-4">
          {filteredMatrix.map((item) => {
            const strengthBadge = {
              Strong: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
              Moderate: 'bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800',
              Limited: 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
              Exploratory: 'bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
              Insufficient: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700',
            }[item.evidenceStrength] || 'bg-slate-100 text-slate-600';

            const priorityBadge = {
              Critical: 'bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
              High: 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
              Medium: 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
              Monitor: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700',
            }[item.priority] || 'bg-slate-100 text-slate-600';

            return (
              <div
                key={item.id}
                className="border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-[#182640]/30 rounded-xl p-4.5 space-y-3 text-xs"
              >
                {/* Row Top */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 dark:border-slate-700/60 pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2 py-0.5 rounded bg-[#0F4C81] dark:bg-[#3B82F6] text-white font-mono font-bold text-[11px]">
                      {item.id}
                    </span>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                      {item.title}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase border ${strengthBadge}`}>
                      {item.evidenceStrength} Evidence
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase border ${priorityBadge}`}>
                      Priority: {item.priority}
                    </span>
                  </div>
                </div>

                {/* 4 Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
                  <div className="p-3 bg-white dark:bg-[#131f37] rounded-lg border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400 block">Verified Finding</span>
                    <p className="text-[11px] text-slate-700 dark:text-slate-300 font-light leading-relaxed">{item.verifiedFinding || item.finding}</p>
                    <div className="pt-2 text-[10px] font-mono text-slate-400">Method: {item.methodology}</div>
                  </div>

                  <div className="p-3 bg-white dark:bg-[#131f37] rounded-lg border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400 block">Practical Interpretation</span>
                    <p className="text-[11px] text-slate-700 dark:text-slate-300 font-light leading-relaxed">{item.practicalInterpretation}</p>
                  </div>

                  <div className="p-3 bg-white dark:bg-[#131f37] rounded-lg border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400 block">Strategic Consideration</span>
                    <p className="text-[11px] text-slate-700 dark:text-slate-300 font-light leading-relaxed">{item.strategicImplication}</p>
                  </div>

                  <div className="p-3 bg-white dark:bg-[#131f37] rounded-lg border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#0F4C81] dark:text-[#3B82F6] block">Recommended Action</span>
                    <p className="text-[11px] text-slate-700 dark:text-slate-300 font-light leading-relaxed">{item.recommendedAction}</p>
                  </div>
                </div>

                {/* Boundary */}
                <div className="px-3 py-1.5 rounded bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30 flex items-start gap-1.5 text-[10px] text-amber-900 dark:text-amber-300 font-mono">
                  <span className="font-bold shrink-0">BOUNDARY:</span>
                  <span className="font-sans font-light text-slate-600 dark:text-slate-400">{item.decisionBoundary}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 06 — STRATEGIC RECOMMENDATIONS                                    */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target size={18} className="text-[#0F4C81] dark:text-[#3B82F6]" />
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-white font-mono">
              06 · Strategic Recommendations
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-light">
            Evidence-Based &amp; Proportionate Action Framework
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {recommendations.map((rec) => {
            const priorityBadge = {
              Critical: 'bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
              High: 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
              Medium: 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
              Monitor: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700',
            }[rec.priority] || 'bg-slate-100 text-slate-600';

            return (
              <div
                key={rec.id}
                className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131f37] rounded-xl p-5.5 shadow-3xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3.5">
                  {/* Top Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-[#0F4C81] text-white dark:bg-[#3B82F6] flex items-center justify-center text-xs font-bold font-mono">
                        {rec.number}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">
                        Evidence: {rec.supportingSourceIds.join(' · ')}
                      </span>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase border ${priorityBadge}`}>
                      Priority: {rec.priority}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                    {rec.title}
                  </h3>

                  {/* Strategic Rationale */}
                  <div className="text-xs text-slate-600 dark:text-slate-300 font-light leading-relaxed space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                      Strategic Rationale
                    </span>
                    <p>{rec.strategicRationale}</p>
                  </div>

                  {/* Specific Inputs / Domains / Frameworks */}
                  {rec.planningInputs && (
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#182640]/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1.5">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0F4C81] dark:text-[#3B82F6] block">
                        Recommended Planning Inputs
                      </span>
                      <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300 font-light">
                        {rec.planningInputs.map((inp, idx) => (
                          <li key={idx} className="flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-[#0F4C81] dark:bg-[#3B82F6]" />
                            <span>{inp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {rec.investigationDomains && (
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#182640]/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1.5">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0F4C81] dark:text-[#3B82F6] block">
                        Candidate Review Domains
                      </span>
                      <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300 font-light">
                        {rec.investigationDomains.map((dom, idx) => (
                          <li key={idx} className="flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-[#0F4C81] dark:bg-[#3B82F6]" />
                            <span>{dom}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {rec.monitoringDimensions && (
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#182640]/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1.5">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0F4C81] dark:text-[#3B82F6] block">
                        Continuous Monitoring Dimensions
                      </span>
                      <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300 font-light">
                        {rec.monitoringDimensions.map((dim, idx) => (
                          <li key={idx} className="flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-[#0F4C81] dark:bg-[#3B82F6]" />
                            <span>{dim}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {rec.reportingStandards && (
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#182640]/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1.5">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0F4C81] dark:text-[#3B82F6] block">
                        Recommended Reporting Standards
                      </span>
                      <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300 font-light">
                        {rec.reportingStandards.map((std, idx) => (
                          <li key={idx} className="flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-[#0F4C81] dark:bg-[#3B82F6]" />
                            <span>{std}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Expected Strategic Value */}
                  <div className="text-xs text-slate-600 dark:text-slate-300 font-light leading-relaxed pt-1">
                    <strong className="text-slate-800 dark:text-slate-200 font-semibold block text-[11px]">
                      Expected Strategic Value:
                    </strong>
                    <p>{rec.expectedStrategicValue}</p>
                  </div>
                </div>

                {/* Governance Boundary */}
                <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 text-[10px] font-mono text-slate-400">
                  <span className="text-amber-500 font-bold block">GOVERNANCE BOUNDARY:</span>
                  <span className="leading-tight font-sans font-light text-slate-500 dark:text-slate-400">{rec.decisionBoundary}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 07 — STRATEGIC ROADMAP                                            */}
      {/* ========================================================================= */}
      <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131f37] rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Calendar size={18} className="text-[#0F4C81] dark:text-[#3B82F6]" />
          <div>
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-white font-mono">
              07 · Strategic Phased Roadmap
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-light">
              Phased implementation horizons translating empirical findings into operational workflows. Future research is separated from immediate platform capabilities.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Immediate */}
          <div className="border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#182640]/40 rounded-xl p-4 space-y-2.5">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700/60 pb-2">
              <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                IMMEDIATE · 0–3 MONTHS
              </span>
              <Clock size={13} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 font-sans">
              Establish the Evidence Baseline
            </div>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 font-light leading-relaxed">
              {roadmap.immediate.map((step, sIdx) => (
                <li key={sIdx} className="flex items-start gap-2">
                  <ArrowRight size={13} className="text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Medium Term */}
          <div className="border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#182640]/40 rounded-xl p-4 space-y-2.5">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700/60 pb-2">
              <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                MEDIUM TERM · 3–12 MONTHS
              </span>
              <TrendingUp size={13} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 font-sans">
              Integrate Evidence Into Planning
            </div>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 font-light leading-relaxed">
              {roadmap.mediumTerm.map((step, sIdx) => (
                <li key={sIdx} className="flex items-start gap-2">
                  <ArrowRight size={13} className="text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Long Term */}
          <div className="border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#182640]/40 rounded-xl p-4 space-y-2.5">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700/60 pb-2">
              <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                LONG TERM · FUTURE RESEARCH
              </span>
              <Compass size={13} className="text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 font-sans">
              Expand Analytical Capability Responsibly
            </div>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 font-light leading-relaxed">
              {roadmap.longTerm.map((step, sIdx) => (
                <li key={sIdx} className="flex items-start gap-2">
                  <ArrowRight size={13} className="text-purple-600 dark:text-purple-400 mt-0.5 shrink-0" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
            <div className="pt-2 text-[9px] font-mono text-purple-600 dark:text-purple-400 uppercase font-bold border-t border-purple-200/40 dark:border-purple-900/40">
              Future Research — Not Current Platform Capabilities
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 08 — DECISION BOUNDARIES & INTERPRETATION LIMITS                  */}
      {/* ========================================================================= */}
      <div className="border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#131f37] rounded-xl p-6.5 shadow-xs space-y-5">
        <div className="flex items-center gap-2.5 border-b border-slate-200 dark:border-slate-700 pb-3">
          <ShieldCheck size={20} className="text-[#0F4C81] dark:text-[#3B82F6]" />
          <div>
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white font-mono">
              08 · Decision Boundaries &amp; Interpretation Limits
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-light">
              Explicit academic and governance boundaries defining confirmed analytical scope versus strict non-claims.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Confirmed Analytical Scope (Checkmarks) */}
          <div className="space-y-3 p-4.5 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/60">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-emerald-600 dark:text-emerald-400" />
              What the Analysis Supports
            </span>
            <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 font-light leading-relaxed">
              {boundariesSupports.map((item, bIdx) => (
                <li key={bIdx} className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Strict Methodological Limits (Crosses) */}
          <div className="space-y-3 p-4.5 rounded-xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-800/60">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
              <AlertCircle size={15} className="text-rose-600 dark:text-rose-400" />
              What the Analysis Does Not Prove
            </span>
            <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 font-light leading-relaxed">
              {boundariesNotProven.map((item, bIdx) => (
                <li key={bIdx} className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold">✕</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Final Strategic Conclusion */}
        <div className="p-5 rounded-xl bg-slate-900 text-white dark:bg-[#0b1222] border border-slate-800 space-y-2 text-left">
          <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
            <Sparkles size={14} />
            Final Strategic Conclusion
          </span>
          <p className="text-xs text-slate-200 leading-relaxed font-light">
            {finalConclusion}
          </p>
        </div>
      </div>

    </div>
  );
}
