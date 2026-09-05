/**
 * Healthcare Analytics Platform — Stage 6: Strategic Insights & Recommendations
 * ==============================================================================
 * Master Senior Data Analyst / Master's Capstone Implementation
 *
 * Information Architecture:
 *   01 · Executive Decision Summary (Header, Scope, 4 Evidence Indicators, Executive Statement, 4 Takeaways)
 *   02 · Strategic Priority Scorecard (4 Categories, Action Directions, Priority Display Rule)
 *   03 · Dashboard Insights & Evidence (5 Insights A–E with Live Visual Indicators & Governance Boundaries)
 *   04 · Statistical Validation & Analytical Interpretation (H1–H5 & Trend Validation Cards)
 *   05 · H1–H5 Evidence-to-Action Matrix (Filterable Matrix with Multi-Dimensional Evidence Strength)
 *   06 · Strategic Recommendations (4 Traceable Action Frameworks with 8-Stage Monitoring Lifecycle)
 *   07 · Strategic Roadmap (Immediate, Medium-Term, Long-Term Future Research)
 *   08 · Decision Boundaries & Interpretation Limits (What is Supported vs Strict Non-Claims + Final Conclusion)
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
  BarChart2,
  GitBranch,
  ArrowUpRight,
  Check,
  ChevronRight,
  Maximize2,
} from 'lucide-react';
import { fetchStrategicInsights } from '../../services/apiService';
import PageHeader from '../../components/common/PageHeader';
import SectionHeader from '../../components/common/SectionHeader';
import StatBadge from '../../components/common/StatBadge';

// Type Definitions conforming strictly to the Master Decision Support Contract
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
  onNavigateNext?: () => void;
}

export default function ConsultantInsights({ isLoading: parentLoading, onNavigateNext }: ConsultantInsightsProps) {
  const [data, setData] = useState<StrategicPayload | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedInsightFilter, setSelectedInsightFilter] = useState<'ALL' | 'H1' | 'H2' | 'H3' | 'H4' | 'H5'>('ALL');
  const [showEvidenceTooltip, setShowEvidenceTooltip] = useState<boolean>(false);
  const [activeWorkflowStep, setActiveWorkflowStep] = useState<number | null>(null);

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
      <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl p-16 text-center flex flex-col items-center justify-center space-y-4 shadow-sm animate-pulse" id="insights-loading">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-[#0F4C81] dark:text-[#3B82F6]">
          <Sparkles size={26} className="animate-spin" />
        </div>
        <h4 className="text-slate-800 dark:text-white font-sans text-base font-bold">
          Synthesizing Strategic Decision Support Layer...
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-lg font-light leading-relaxed">
          Translating completed H1–H5 hypothesis tests, WLS regression, Mann-Kendall trend models, and dashboard metrics into evidence-based executive decision support.
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="border border-rose-200 dark:border-rose-900/40 bg-rose-50/40 dark:bg-rose-950/20 rounded-2xl p-10 text-center space-y-4">
        <AlertCircle size={36} className="text-rose-500 mx-auto" />
        <h3 className="text-base font-bold text-rose-800 dark:text-rose-300">Unable to Load Strategic Evidence</h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
          {error || 'Unable to load the latest strategic evidence. Please verify that the SQLite analytical tables and statistical engines are active.'}
        </p>
        <button
          onClick={loadData}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#0F4C81] hover:bg-[#0c3c66] dark:bg-[#3B82F6] dark:hover:bg-[#2563eb] text-white text-xs font-semibold rounded-xl shadow-sm transition-colors cursor-pointer"
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
    <div className="space-y-12 text-left animate-fade-in pb-16 font-sans max-w-7xl mx-auto" id="strategic-insights-section">
      
      {/* ========================================================================= */}
      {/* PAGE HEADER                                                               */}
      {/* ========================================================================= */}
      <PageHeader
        category="STAGE 06 · STRATEGIC DECISION SUPPORT"
        title="Strategic Insights & Recommendations"
        subtitle="Evidence-informed strategic translation of CIHI NACRS emergency department data. Synthesizes hypothesis results (H1–H5), WLS regression modeling, Mann-Kendall longitudinal trends, and dashboard telemetry into actionable healthcare planning considerations within aggregate governance boundaries."
        contextPills={[
          { label: 'Scope: Aggregate-Level Planning', variant: 'blue' },
          { label: `${evidenceIndicators?.evidenceSourcesCount || 5} Evidence Bases`, variant: 'default' },
          { label: evidenceIndicators?.hypothesesSynthesized || 'H1–H5 Synthesized', variant: 'success' },
          { label: evidenceIndicators?.modelTrendOutputsCount || '4 Analytical Streams', variant: 'purple' },
        ]}
      />

      {/* ========================================================================= */}
      {/* SECTION 01 — EXECUTIVE DECISION SUMMARY                                   */}
      {/* ========================================================================= */}
      <section aria-labelledby="section-01-title" className="space-y-5">
        <SectionHeader
          category="01 · EXECUTIVE SUMMARY"
          title="Executive Decision Summary"
          subtitle="Synthesized high-level findings and decision relevance grounded in complete CIHI NACRS evidence."
          metadata="Scope: Aggregate Planning"
        />

        <div className="border border-slate-200/90 dark:border-slate-800/80 bg-white dark:bg-[#0d172a] rounded-2xl p-6 sm:p-7 shadow-xs space-y-6 transition-colors">
          {/* 4 Compact Evidence Indicators */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-3.5 bg-slate-50/80 dark:bg-[#131f37] rounded-xl border border-slate-200/80 dark:border-slate-800/80 flex items-center gap-3.5 shadow-3xs">
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 text-[#0F4C81] dark:text-[#3B82F6] flex items-center justify-center shrink-0">
                <Database size={18} />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-sans font-medium">Evidence Base</span>
                <span className="font-bold text-slate-900 dark:text-white text-xs">{evidenceIndicators?.evidenceSourcesCount || 5} Tables &amp; Data Services</span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50/80 dark:bg-[#131f37] rounded-xl border border-slate-200/80 dark:border-slate-800/80 flex items-center gap-3.5 shadow-3xs">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <FileCheck size={18} />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-sans font-medium">Hypotheses Synthesized</span>
                <span className="font-bold text-slate-900 dark:text-white text-xs">{evidenceIndicators?.hypothesesSynthesized || 'H1–H5 Completed'}</span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50/80 dark:bg-[#131f37] rounded-xl border border-slate-200/80 dark:border-slate-800/80 flex items-center gap-3.5 shadow-3xs">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <Calculator size={18} />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-sans font-medium">Analytical Engines</span>
                <span className="font-bold text-slate-900 dark:text-white text-xs">{evidenceIndicators?.modelTrendOutputsCount || '4 Evidence Streams'}</span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50/80 dark:bg-[#131f37] rounded-xl border border-slate-200/80 dark:border-slate-800/80 flex items-center gap-3.5 shadow-3xs">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Target size={18} />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-sans font-medium">Decision Scope</span>
                <span className="font-bold text-slate-900 dark:text-white text-xs">{evidenceIndicators?.decisionScope || 'Aggregate-Level Planning'}</span>
              </div>
            </div>
          </div>

          {/* Executive Decision Statement (Prominent Callout) */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0F4C81]/12 via-[#0F4C81]/6 to-transparent dark:from-[#3B82F6]/15 dark:via-[#3B82F6]/5 dark:to-transparent border-l-4 border-[#0F4C81] dark:border-[#3B82F6] border-y border-r border-slate-200/80 dark:border-slate-800 space-y-2 shadow-xs">
            <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-[#0F4C81] dark:text-[#3B82F6] flex items-center gap-2">
              <Sparkles size={14} />
              Executive Decision Statement
            </span>
            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-100 leading-relaxed font-normal">
              {executiveStatement}
            </p>
          </div>

          {/* Four Executive Takeaway Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
            {executiveTakeaways.map((takeaway) => (
              <div
                key={takeaway.number}
                className="p-4.5 rounded-2xl bg-slate-50/80 dark:bg-[#131f37]/60 border border-slate-200 dark:border-slate-800 space-y-3 flex flex-col justify-between hover:shadow-xs transition-shadow"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300/60 dark:border-slate-700">
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
                <div className="pt-2.5 border-t border-slate-200/70 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 font-light">
                  <strong className="font-semibold text-slate-800 dark:text-slate-200">Decision Relevance:</strong> {takeaway.relevance}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 02 — STRATEGIC PRIORITY SCORECARD                                 */}
      {/* ========================================================================= */}
      <section aria-labelledby="section-02-title" className="space-y-4">
        <SectionHeader
          category="02 · STRATEGIC SCORECARD"
          title="Strategic Priority Scorecard"
          subtitle="Answers: What should decision-makers pay attention to first?"
          metadata="Action Hierarchy"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4.5">
          {scorecardItems.map((item, idx) => {
            const isCritical = item.tier.includes('CRITICAL');
            const isHigh = item.tier.includes('HIGH') && !isCritical;
            const isMonitor = item.tier.includes('MONITOR');

            const tierStyle = isCritical
              ? 'border-amber-400/90 dark:border-amber-500/70 bg-amber-50/40 dark:bg-[#0d172a] text-amber-900 dark:text-amber-200 shadow-3xs'
              : isHigh
              ? 'border-blue-300 dark:border-blue-700/70 bg-blue-50/40 dark:bg-[#0d172a] text-blue-900 dark:text-blue-200 shadow-3xs'
              : 'border-slate-300 dark:border-slate-800 bg-slate-50/60 dark:bg-[#0d172a] text-slate-700 dark:text-slate-300 shadow-3xs';

            const badgeBg = isCritical
              ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700'
              : isHigh
              ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-900 dark:text-blue-200 border-blue-300 dark:border-blue-700'
              : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700';

            return (
              <div
                key={item.id || idx}
                className={`rounded-2xl p-5 border flex flex-col justify-between space-y-3.5 transition-all ${tierStyle}`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase border ${badgeBg}`}>
                      {item.tier}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 font-bold">{item.evidence}</span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug">
                    {item.title}
                  </h3>
                  <div className="space-y-1 text-[11px] font-light leading-relaxed">
                    <p><strong className="font-semibold text-slate-800 dark:text-slate-200">Why:</strong> {item.why}</p>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-slate-200/80 dark:border-slate-800 text-[11px] font-light leading-relaxed">
                  <strong className="font-semibold text-slate-800 dark:text-slate-200 block text-[10px] uppercase font-mono tracking-wider mb-0.5">
                    Action Direction:
                  </strong>
                  <span>{item.action}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Priority Display Rule Notice */}
        <div className="px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#131f37]/50 border border-slate-200 dark:border-slate-800 flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400">
          <Info size={14} className="text-[#0F4C81] dark:text-[#3B82F6] shrink-0" />
          <span>
            <strong className="font-semibold text-slate-800 dark:text-slate-200">Priority Display Rule:</strong> Strategic priority is assigned considering effect size, practical relevance, decision impact, strength of evidence, and data limitations — not $p$-value alone.
          </span>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* SECTION 03 — DASHBOARD INSIGHTS & EVIDENCE                                */}
      {/* ========================================================================= */}
      <section aria-labelledby="section-03-title" className="space-y-5">
        <SectionHeader
          category="03 · DASHBOARD EVIDENCE"
          title="Dashboard Insights & Evidence"
          subtitle="Directly connected to Stage 5 Executive Dashboard visuals & SQLite canonical data."
          metadata="5 Evidence Connectors (A–E)"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {dashboardInsights.map((ins) => {
            // Contextual Mini Visual representation for each insight letter
            const renderMiniVisual = (letter: string) => {
              switch (letter) {
                case 'A':
                  return (
                    <div className="p-3 rounded-xl bg-slate-100/70 dark:bg-[#131f37] border border-slate-200 dark:border-slate-800 space-y-1.5 text-[10px] font-mono">
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">
                        Verified CTAS Median LOS Breakdown (N = 174.2M)
                      </span>
                      <div className="grid grid-cols-5 gap-1.5 text-center">
                        <div className="p-1 rounded bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300 font-bold">
                          <span className="block">CTAS I</span>
                          <span className="font-normal text-slate-700 dark:text-slate-300">4.60h</span>
                        </div>
                        <div className="p-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 font-bold">
                          <span className="block">CTAS II</span>
                          <span className="font-normal text-slate-700 dark:text-slate-300">4.80h</span>
                        </div>
                        <div className="p-1 rounded bg-yellow-500/10 border border-yellow-500/30 text-yellow-700 dark:text-yellow-300 font-bold">
                          <span className="block">CTAS III</span>
                          <span className="font-normal text-slate-700 dark:text-slate-300">3.40h</span>
                        </div>
                        <div className="p-1 rounded bg-blue-500/10 border border-blue-500/30 text-blue-700 dark:text-blue-300 font-bold">
                          <span className="block">CTAS IV</span>
                          <span className="font-normal text-slate-700 dark:text-slate-300">1.90h</span>
                        </div>
                        <div className="p-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-bold">
                          <span className="block">CTAS V</span>
                          <span className="font-normal text-slate-700 dark:text-slate-300">1.33h</span>
                        </div>
                      </div>
                    </div>
                  );
                case 'B':
                  return (
                    <div className="p-3 rounded-xl bg-slate-100/70 dark:bg-[#131f37] border border-slate-200 dark:border-slate-800 space-y-2 text-[10px] font-mono">
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">
                        Disposition Stay Disparity (N = 175.6M visits)
                      </span>
                      <div className="grid grid-cols-2 gap-2 text-center">
                        <div className="p-1.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                          <span className="text-emerald-700 dark:text-emerald-300 font-bold block">Non-Admitted / Discharged</span>
                          <span className="text-slate-700 dark:text-slate-200 font-semibold">2.50 hrs (150 min) · 157.62M visits</span>
                        </div>
                        <div className="p-1.5 rounded bg-rose-500/10 border border-rose-500/30">
                          <span className="text-rose-700 dark:text-rose-300 font-bold block">Admitted Inpatient</span>
                          <span className="text-slate-700 dark:text-slate-200 font-semibold">10.60 hrs (636 min) · 18.00M visits</span>
                        </div>
                      </div>
                      <div className="text-center text-[10px] text-slate-500 font-mono">
                        Disparity Gap: <strong className="text-rose-600 dark:text-rose-400">+8.10 hrs (+324% longer stay duration)</strong>
                      </div>
                    </div>
                  );
                case 'C':
                  return (
                    <div className="p-3 rounded-xl bg-slate-100/70 dark:bg-[#131f37] border border-slate-200 dark:border-slate-800 space-y-1.5 text-[10px] font-mono">
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">
                        WLS Regression Model Outputs
                      </span>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="p-1 rounded bg-blue-500/10 border border-blue-500/30">
                          <span className="text-blue-700 dark:text-blue-300 font-bold block">R² Score</span>
                          <span className="text-slate-700 dark:text-slate-200">0.6256 (62.56%)</span>
                        </div>
                        <div className="p-1 rounded bg-indigo-500/10 border border-indigo-500/30">
                          <span className="text-indigo-700 dark:text-indigo-300 font-bold block">Slope β₁</span>
                          <span className="text-slate-700 dark:text-slate-200">-73.92 min/unit</span>
                        </div>
                        <div className="p-1 rounded bg-purple-500/10 border border-purple-500/30">
                          <span className="text-purple-700 dark:text-purple-300 font-bold block">Intercept β₀</span>
                          <span className="text-slate-700 dark:text-slate-200">430.95 min</span>
                        </div>
                      </div>
                    </div>
                  );
                case 'D':
                  return (
                    <div className="p-3 rounded-xl bg-slate-100/70 dark:bg-[#131f37] border border-slate-200 dark:border-slate-800 space-y-1.5 text-[10px] font-mono">
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">
                        Age-Stratified Median Stay Duration (N = 175.76M)
                      </span>
                      <div className="grid grid-cols-4 gap-1.5 text-center">
                        <div className="p-1 rounded bg-cyan-500/10 border border-cyan-500/30">
                          <span className="text-cyan-700 dark:text-cyan-300 font-bold block">0–17 Ped</span>
                          <span className="text-slate-600 dark:text-slate-300">2.05h (123m)</span>
                        </div>
                        <div className="p-1 rounded bg-blue-500/10 border border-blue-500/30">
                          <span className="text-blue-700 dark:text-blue-300 font-bold block">18–34 Y-Ad</span>
                          <span className="text-slate-600 dark:text-slate-300">2.53h (152m)</span>
                        </div>
                        <div className="p-1 rounded bg-amber-500/10 border border-amber-500/30">
                          <span className="text-amber-700 dark:text-amber-300 font-bold block">35–64 M-Ad</span>
                          <span className="text-slate-600 dark:text-slate-300">2.87h (172m)</span>
                        </div>
                        <div className="p-1 rounded bg-emerald-500/10 border border-emerald-500/30">
                          <span className="text-emerald-700 dark:text-emerald-300 font-bold block">65+ Older</span>
                          <span className="text-slate-600 dark:text-slate-300">4.17h (250m)</span>
                        </div>
                      </div>
                    </div>
                  );
                case 'E':
                  return (
                    <div className="p-3 rounded-xl bg-slate-100/70 dark:bg-[#131f37] border border-slate-200 dark:border-slate-800 space-y-1.5 text-[10px] font-mono">
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">
                        Sex vs Disposition Rates (Statistical vs Practical)
                      </span>
                      <div className="grid grid-cols-2 gap-2 text-center">
                        <div className="p-1 rounded bg-slate-50 dark:bg-[#131f37] border border-slate-200 dark:border-slate-800">
                          <span className="text-slate-700 dark:text-slate-300 font-bold block">Female (90.98M)</span>
                          <span>90.05% Disch | 9.95% Adm</span>
                        </div>
                        <div className="p-1 rounded bg-slate-50 dark:bg-[#131f37] border border-slate-200 dark:border-slate-800">
                          <span className="text-slate-700 dark:text-slate-300 font-bold block">Male (84.78M)</span>
                          <span>89.44% Disch | 10.56% Adm</span>
                        </div>
                      </div>
                      <div className="text-center text-[10px] text-slate-500 font-mono">
                        χ² = 18,164.97 (p &lt; 0.001) · Cramér's V = 0.0102 (Negligible effect)
                      </div>
                    </div>
                  );
                default:
                  return null;
              }
            };

            return (
              <div
                key={ins.letter}
                className="border border-slate-200/90 dark:border-slate-800/80 bg-white dark:bg-[#0d172a] rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
              >
                <div className="space-y-3.5">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-[#0F4C81] text-white dark:bg-[#3B82F6] flex items-center justify-center text-xs font-bold font-mono shadow-xs">
                        {ins.letter}
                      </span>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug">
                        {ins.title}
                      </h3>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[9px] font-bold uppercase border border-slate-200 dark:border-slate-700">
                      {ins.evidenceLabel}
                    </span>
                  </div>

                  {/* Live Mini Visual */}
                  {renderMiniVisual(ins.letter)}

                  {/* What the Dashboard Shows */}
                  <div className="p-3.5 rounded-xl bg-slate-50/90 dark:bg-[#131f37]/60 border border-slate-200/80 dark:border-slate-800 space-y-1">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block flex items-center gap-1.5">
                      <LayoutDashboard size={12} className="text-[#0F4C81] dark:text-[#3B82F6]" />
                      What the Dashboard Shows
                    </span>
                    <p className="text-xs text-slate-700 dark:text-slate-300 font-light leading-relaxed">
                      {ins.dashboardObservation}
                    </p>
                  </div>

                  {/* What the Analysis Validates */}
                  <div className="p-3.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 space-y-1">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#0F4C81] dark:text-[#3B82F6] block flex items-center gap-1.5">
                      <FileCheck size={12} />
                      What the Analysis Validates
                    </span>
                    <p className="text-xs text-slate-800 dark:text-slate-200 font-normal leading-relaxed font-mono">
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
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-start gap-2 text-[10px] text-slate-400 font-mono">
                  <span className="text-amber-600 dark:text-amber-400 font-bold shrink-0">BOUNDARY:</span>
                  <span className="leading-relaxed font-sans font-light text-slate-500 dark:text-slate-400">{ins.boundary}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 04 — STATISTICAL VALIDATION & ANALYTICAL INTERPRETATION           */}
      {/* ========================================================================= */}
      <section aria-labelledby="section-04-title" className="space-y-4">
        <SectionHeader
          category="04 · STATISTICAL SYNTHESIS"
          title="Statistical Validation & Analytical Interpretation"
          subtitle="Empirical grounding across H1–H5 hypotheses and longitudinal models."
          metadata="H1–H5 & Longitudinal"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {statisticalValidation.map((stat, sIdx) => {
            const isReject = stat.statisticalConclusion?.toLowerCase().includes('reject');
            return (
              <div
                key={stat.id || sIdx}
                className="border border-slate-200/90 dark:border-slate-800/80 bg-white dark:bg-[#0d172a] rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-3.5 hover:shadow-sm transition-shadow"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#0F4C81] text-white dark:bg-[#3B82F6] font-mono text-[10px] font-bold">
                      {stat.id}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono text-slate-400 font-bold">{stat.evidenceStrength} Evidence</span>
                      <StatBadge label={isReject ? 'Reject H₀' : 'Fail to Reject'} variant={isReject ? 'reject' : 'fail_to_reject'} />
                    </div>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug">
                    {stat.title}
                  </h4>
                  <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 space-y-1">
                    <div><span className="text-slate-400 font-sans">Method:</span> {stat.methodology}</div>
                    <div><span className="text-slate-400 font-sans">Decision:</span> <strong className="text-slate-900 dark:text-white font-bold">{stat.statisticalConclusion}</strong></div>
                  </div>
                  <div className="p-3 bg-slate-50/80 dark:bg-[#131f37]/50 rounded-xl border border-slate-200/70 dark:border-slate-800/70 space-y-1 text-xs font-light text-slate-700 dark:text-slate-300 leading-relaxed">
                    <span className="text-[9px] font-mono font-bold uppercase text-slate-400 block">Practical Interpretation</span>
                    <p>{stat.practicalInterpretation}</p>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                  <span className="text-slate-700 dark:text-slate-300 font-sans font-light block leading-relaxed">
                    <strong className="font-semibold text-slate-800 dark:text-slate-200">Relevance:</strong> {stat.strategicImplication}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 05 — H1–H5 EVIDENCE-TO-ACTION MATRIX                              */}
      {/* ========================================================================= */}
      <section aria-labelledby="section-05-title" className="space-y-4">
        <SectionHeader
          category="05 · EVIDENCE MATRIX"
          title="H1–H5 Evidence-to-Action Matrix"
          subtitle="Comprehensive synthesis of all five approved hypothesis tests into actionable healthcare planning considerations."
          metadata="Multi-Dimensional Framework"
        />

        <div className="border border-slate-200/90 dark:border-slate-800/80 bg-white dark:bg-[#0d172a] rounded-2xl p-6 sm:p-7 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4.5">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <Layers size={18} className="text-[#0F4C81] dark:text-[#3B82F6]" />
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white font-mono">
                  Synthesized Evidence-to-Action Protocol
                </h3>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowEvidenceTooltip(!showEvidenceTooltip)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-0.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Evidence Strength Framework"
                  >
                    <HelpCircle size={15} />
                  </button>
                  {showEvidenceTooltip && (
                    <div className="absolute left-0 top-7 z-30 w-84 p-4 bg-slate-900 text-white rounded-xl shadow-2xl text-[11px] font-sans font-light leading-relaxed border border-slate-700 animate-fade-in">
                      <div className="font-bold text-slate-200 mb-1.5 flex items-center gap-1.5">
                        <Info size={14} className="text-sky-400" />
                        Multi-Dimensional Evidence Framework
                      </div>
                      Evidence strength reflects the combined interpretation of statistical support, effect magnitude, practical relevance, consistency with related findings, data coverage, and methodological limitations. It is never determined by $p$-value alone.
                    </div>
                  )}
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-light">
                Filter by specific hypothesis to inspect individual action pathways.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#131f37] p-1 rounded-xl border border-slate-200 dark:border-slate-800 self-start sm:self-auto">
              {(['ALL', 'H1', 'H2', 'H3', 'H4', 'H5'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedInsightFilter(tab)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
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
          <div className="space-y-4.5">
            {filteredMatrix.map((item) => {
              const strengthBadge = {
                Strong: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
                Moderate: 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/30',
                Limited: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30',
                Exploratory: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30',
                Insufficient: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30',
              }[item.evidenceStrength] || 'bg-slate-100 text-slate-600';

              const priorityBadge = {
                Critical: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30',
                High: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30',
                Medium: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30',
                Monitor: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30',
              }[item.priority] || 'bg-slate-100 text-slate-600';

              return (
                <div
                  key={item.id}
                  className="border border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#131f37]/40 rounded-2xl p-5 space-y-3.5 text-xs shadow-3xs"
                >
                  {/* Row Top */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-200/80 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-0.5 rounded-md bg-[#0F4C81] dark:bg-[#3B82F6] text-white font-mono font-bold text-[11px] shadow-3xs">
                        {item.id}
                      </span>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                        {item.title}
                      </h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase border ${strengthBadge}`}>
                        {item.evidenceStrength} Evidence
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase border ${priorityBadge}`}>
                        Priority: {item.priority}
                      </span>
                    </div>
                  </div>

                  {/* 4 Multi-Column Information Units */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
                    <div className="p-3.5 bg-white dark:bg-[#0d172a] rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400 block">Verified Finding</span>
                      <p className="text-[11px] text-slate-700 dark:text-slate-300 font-light leading-relaxed">{item.verifiedFinding || item.finding}</p>
                      <div className="pt-2 text-[10px] font-mono text-slate-400 border-t border-slate-100 dark:border-slate-800/80">
                        Method: {item.methodology}
                      </div>
                    </div>

                    <div className="p-3.5 bg-white dark:bg-[#0d172a] rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400 block">Practical Interpretation</span>
                      <p className="text-[11px] text-slate-700 dark:text-slate-300 font-light leading-relaxed">{item.practicalInterpretation}</p>
                    </div>

                    <div className="p-3.5 bg-white dark:bg-[#0d172a] rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400 block">Strategic Consideration</span>
                      <p className="text-[11px] text-slate-700 dark:text-slate-300 font-light leading-relaxed">{item.strategicImplication}</p>
                    </div>

                    <div className="p-3.5 bg-white dark:bg-[#0d172a] rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#0F4C81] dark:text-[#3B82F6] block">Recommended Action</span>
                      <p className="text-[11px] text-slate-700 dark:text-slate-300 font-light leading-relaxed">{item.recommendedAction}</p>
                    </div>
                  </div>

                  {/* Boundary */}
                  <div className="px-3.5 py-2 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 flex items-start gap-2 text-[10px] text-amber-900 dark:text-amber-300 font-mono">
                    <span className="font-bold shrink-0">BOUNDARY:</span>
                    <span className="font-sans font-light text-slate-600 dark:text-slate-400 leading-relaxed">{item.decisionBoundary}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* SECTION 06 — STRATEGIC RECOMMENDATIONS                                    */}
      {/* ========================================================================= */}
      <section aria-labelledby="section-06-title" className="space-y-4">
        <SectionHeader
          category="06 · RECOMMENDATIONS"
          title="Strategic Recommendations"
          subtitle="Fewer, stronger, evidence-traceable action frameworks grounded in empirical findings."
          metadata="4 Action Frameworks"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {recommendations.map((rec) => {
            const priorityBadge = {
              Critical: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30',
              High: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30',
              Medium: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30',
              Monitor: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30',
            }[rec.priority] || 'bg-slate-100 text-slate-600';

            return (
              <div
                key={rec.id}
                className="border border-slate-200/90 dark:border-slate-800/80 bg-white dark:bg-[#0d172a] rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
              >
                <div className="space-y-4">
                  {/* Top Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-lg bg-[#0F4C81] text-white dark:bg-[#3B82F6] flex items-center justify-center text-xs font-bold font-mono shadow-3xs">
                        {rec.number}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">
                        Evidence Base: {rec.supportingSourceIds.join(' · ')}
                      </span>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase border ${priorityBadge}`}>
                      Priority: {rec.priority}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                    {rec.title}
                  </h3>

                  {/* Strategic Rationale */}
                  <div className="text-xs text-slate-600 dark:text-slate-300 font-light leading-relaxed space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                      Strategic Rationale
                    </span>
                    <p>{rec.strategicRationale}</p>
                  </div>

                  {/* Recommendation 01: Planning Inputs */}
                  {rec.planningInputs && (
                    <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-[#131f37]/60 border border-slate-200/80 dark:border-slate-800 space-y-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0F4C81] dark:text-[#3B82F6] block">
                        Recommended Planning Inputs (Supported Variables Only)
                      </span>
                      <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 font-light">
                        {rec.planningInputs.map((inp, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#0F4C81] dark:bg-[#3B82F6]" />
                            <span>{inp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Recommendation 02: Investigation Domains */}
                  {rec.investigationDomains && (
                    <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-[#131f37]/60 border border-slate-200/80 dark:border-slate-800 space-y-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0F4C81] dark:text-[#3B82F6] block">
                        Candidate Review Domains (Exploratory Areas)
                      </span>
                      <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 font-light">
                        {rec.investigationDomains.map((dom, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#0F4C81] dark:bg-[#3B82F6]" />
                            <span>{dom}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Recommendation 03: Continuous Monitoring Dimensions + 8-Stage Lifecycle Workflow */}
                  {rec.monitoringDimensions && (
                    <div className="space-y-3">
                      <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-[#131f37]/60 border border-slate-200/80 dark:border-slate-800 space-y-2">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0F4C81] dark:text-[#3B82F6] block">
                          Verified Monitoring Dimensions
                        </span>
                        <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-700 dark:text-slate-300 font-light">
                          {rec.monitoringDimensions.map((dim, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 truncate">
                              <span className="w-1 h-1 rounded-full bg-[#0F4C81] dark:bg-[#3B82F6] shrink-0" />
                              <span className="truncate">{dim}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 8-Stage Visual Lifecycle Workflow */}
                      <div className="p-3.5 rounded-xl bg-blue-50/40 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 space-y-2">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0F4C81] dark:text-[#3B82F6] flex items-center justify-between">
                          <span>Evidence Refresh Lifecycle Workflow</span>
                          <span className="text-[9px] font-normal text-slate-400">8 Sequential Stages</span>
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[10px] font-mono">
                          {[
                            '1. New Data Release',
                            '2. Quality Validation',
                            '3. Refresh Tables',
                            '4. Recalculate Metrics',
                            '5. Re-run Tests',
                            '6. Refresh Dashboard',
                            '7. Update Evidence',
                            '8. Compare Baseline',
                          ].map((step, sIdx) => (
                            <div
                              key={sIdx}
                              onClick={() => setActiveWorkflowStep(sIdx === activeWorkflowStep ? null : sIdx)}
                              className={`p-1.5 rounded-lg border text-center transition-all cursor-pointer ${
                                activeWorkflowStep === sIdx
                                  ? 'bg-[#0F4C81] text-white dark:bg-[#3B82F6] border-[#0F4C81] dark:border-[#3B82F6] font-bold shadow-xs'
                                  : 'bg-white dark:bg-[#131f37] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              {step}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Recommendation 04: Reporting Standards */}
                  {rec.reportingStandards && (
                    <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-[#131f37]/60 border border-slate-200/80 dark:border-slate-800 space-y-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0F4C81] dark:text-[#3B82F6] block">
                        Recommended Analytical Reporting Standard
                      </span>
                      <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 font-light">
                        {rec.reportingStandards.map((std, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#0F4C81] dark:bg-[#3B82F6]" />
                            <span>{std}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Expected Strategic Value */}
                  <div className="text-xs text-slate-600 dark:text-slate-300 font-light leading-relaxed pt-1 space-y-0.5">
                    <strong className="text-slate-900 dark:text-white font-semibold block text-[11px]">
                      Expected Strategic Value:
                    </strong>
                    <p>{rec.expectedStrategicValue}</p>
                  </div>
                </div>

                {/* Governance Boundary */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[10px] font-mono text-slate-400">
                  <span className="text-amber-600 dark:text-amber-400 font-bold block mb-0.5">GOVERNANCE BOUNDARY:</span>
                  <span className="leading-relaxed font-sans font-light text-slate-500 dark:text-slate-400">{rec.decisionBoundary}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 07 — STRATEGIC ROADMAP                                            */}
      {/* ========================================================================= */}
      <section aria-labelledby="section-07-title" className="space-y-4">
        <SectionHeader
          category="07 · ROADMAP"
          title="Strategic Phased Roadmap"
          subtitle="Phased implementation horizons translating empirical findings into operational workflows. Future research is strictly separated from current capabilities."
          metadata="3 Execution Horizons"
        />

        <div className="border border-slate-200/90 dark:border-slate-800/80 bg-white dark:bg-[#0d172a] rounded-2xl p-6 sm:p-7 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* Immediate Horizon */}
            <div className="border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-[#131f37]/50 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-2.5">
                <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                  IMMEDIATE · 0–3 MONTHS
                </span>
                <Clock size={14} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-white font-sans">
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

            {/* Medium-Term Horizon */}
            <div className="border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-[#131f37]/50 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-2.5">
                <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/30">
                  MEDIUM TERM · 3–12 MONTHS
                </span>
                <TrendingUp size={14} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-white font-sans">
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

            {/* Long-Term / Future Research Horizon */}
            <div className="border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-[#131f37]/50 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-2.5">
                <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/30">
                  LONG TERM · FUTURE RESEARCH
                </span>
                <Compass size={14} className="text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-white font-sans">
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
              <div className="pt-2 text-[9px] font-mono text-purple-700 dark:text-purple-300 uppercase font-bold border-t border-purple-200/50 dark:border-purple-900/50 text-center">
                Future Research — Not Current Platform Capabilities
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 08 — FINAL STRATEGIC CONCLUSION                                   */}
      {/* ========================================================================= */}
      <section aria-labelledby="section-08-title" className="space-y-4">
        <SectionHeader
          category="08 · CONCLUSION"
          title="Final Strategic Conclusion"
          subtitle="Decision boundaries, strict non-claims, and overarching executive governance summary."
          metadata="Governance Integrity"
        />

        <div className="p-6 sm:p-7 rounded-2xl bg-[#080d19] text-white border border-slate-800/90 space-y-3 text-left shadow-lg">
          <div className="flex items-center gap-2 text-[#3B82F6]">
            <Sparkles size={16} />
            <span id="section-08-title" className="text-xs font-mono font-extrabold uppercase tracking-wider">
              Governance &amp; Executive Summary
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-light">
            {finalConclusion}
          </p>
        </div>
      </section>

      {/* ── WORKFLOW ADVANCEMENT TO STAGE 7 ──────────────────────── */}
      {onNavigateNext && (
        <div className="mt-8 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0d172a] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm text-left">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-blue-600 dark:text-blue-400 block">
              Stage 6 · Strategic Insights &amp; Clinical Advisory Complete
            </span>
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
              <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
              <span>Evidence-to-Action Matrix &amp; 4 Priority Frameworks Synthesized</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Advance to Stage 7 to export executive summaries, download raw datasets, and print the formal capstone project dossier.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onNavigateNext}
              className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <span>Proceed to Stage 7: Reports &amp; Export</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
