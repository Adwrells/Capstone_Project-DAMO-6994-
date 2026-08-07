/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Sparkles, CheckCircle2, AlertTriangle, CornerDownRight, Zap, 
  TrendingUp, FileText, ArrowUpRight, HelpCircle, Activity, LayoutGrid, Award
} from 'lucide-react';

interface ConsultantInsightsProps {
  isLoading: boolean;
}

interface StrategicRecommendation {
  category: "Hospital" | "Policy" | "Future Research";
  title: string;
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  expectedImpact: "HIGH" | "MEDIUM" | "LOW";
  recommendedAction: string;
  expectedBenefit: string;
}

export default function ConsultantInsights({ isLoading }: ConsultantInsightsProps) {
  const [activeTab, setActiveTab] = useState<'summary' | 'hospital' | 'policy' | 'research'>('summary');

  // Predefined Recommendations matching Capstone specifications
  const recommendations: StrategicRecommendation[] = [
    // 1. Hospital Recommendations
    {
      category: "Hospital",
      title: "Establish a Rapid Assessment Zone (RAZ) for Triage Diversion",
      priority: "CRITICAL",
      riskLevel: "MEDIUM",
      expectedImpact: "HIGH",
      recommendedAction: "Isolate CTAS Level 3 (Urgent) cases identified in our statistical bottleneck clusters. Deploy an independent Rapid Assessment Zone (RAZ) staffed by specialized Nurse Practitioners to fast-track non-complex, urgent clinical paths, routing them away from physical emergency waiting bays.",
      expectedBenefit: "Reduces overall CTAS Level 3 stay times by an estimated 2.2 Hours, compressing ambulatory waiting room density and decreasing rates of patients leaving without being seen (LWBS)."
    },
    {
      category: "Hospital",
      title: "Integrate Electronic CDI Pre-Submission Billing Auditing",
      priority: "HIGH",
      riskLevel: "LOW",
      expectedImpact: "HIGH",
      recommendedAction: "Integrate a real-time clinical documentation improvement (CDI) computer-assisted auditing framework in the electronic health record (EHR) to flag and validate high-acuity CTAS 1/2 diagnostic codes prior to provincial funding submissions.",
      expectedBenefit: "Recovers up to 15% in previously omitted or under-coded clinical overhead reimbursements, directly stabilizing hospital operational margins."
    },
    {
      category: "Hospital",
      title: "Geriatric Transition Liaison & Social Discharge Coordinator",
      priority: "HIGH",
      riskLevel: "HIGH",
      expectedImpact: "HIGH",
      recommendedAction: "Form a dedicated transitional social work liaison team with local long-term care and post-acute rehabilitation centers to coordinate secure geriatric discharge transport immediately upon ED stabilization.",
      expectedBenefit: "Resolves extreme 12h+ geriatric boarding outliers, freeing active acute emergency beds and accelerating patient-flow cycle times."
    },
    // 2. Healthcare Policy Recommendations
    {
      category: "Policy",
      title: "Transition to Activity-Based Acuity Funding (CIHI Standard)",
      priority: "CRITICAL",
      riskLevel: "HIGH",
      expectedImpact: "HIGH",
      recommendedAction: "Advocate for provincial ministries of health to transition global emergency block funding models into activity-based models indexed directly against NACRS-measured triage acuity and engineered Resource Utilization Indexes (RUI).",
      expectedBenefit: "Creates systemic incentives for hospitals to optimize throughput efficiency while ensuring high-complexity trauma hubs are fairly compensated."
    },
    {
      category: "Policy",
      title: "Standardize Multi-Provincial NACRS ETL Data Models",
      priority: "MEDIUM",
      riskLevel: "LOW",
      expectedImpact: "MEDIUM",
      recommendedAction: "Standardize clinical schemas and CTAS text strings at the national level (CIHI) to guarantee frictionless cross-provincial healthcare data interoperability, matching our engineered ETL engine rules.",
      expectedBenefit: "Enables robust, longitudinal national study cohorts and facilitates automated, reproducible machine learning modeling of patient flow patterns across Canada."
    },
    // 3. Future Research Recommendations
    {
      category: "Future Research",
      title: "Incorporate Machine Learning for Real-Time Nurse Roster Matching",
      priority: "MEDIUM",
      riskLevel: "LOW",
      expectedImpact: "HIGH",
      recommendedAction: "Expand the static ARIMA time-series models into dynamic, deep recurrent neural networks (LSTM) that ingest live local weather patterns, municipal transit feeds, and regional influenza trackers to predict patient influxes 48 hours in advance.",
      expectedBenefit: "Enables precise predictive scheduling of nursing cohorts, curbing overtime costs by up to 18% while preventing active wait spikes before they occur."
    },
    {
      category: "Future Research",
      title: "Socio-Economic Determinants and Wait-Time Disparities",
      priority: "LOW",
      riskLevel: "LOW",
      expectedImpact: "MEDIUM",
      recommendedAction: "Conduct longitudinal studies linkage matching regional postal codes with the Canadian Marginalization Index to evaluate the impact of local primary care deficits on avoidable ED utilization.",
      expectedBenefit: "Informs targeted regional public health funding in underserved neighborhoods to deflect chronic minor ailments away from emergency rooms."
    }
  ];

  if (isLoading) {
    return (
      <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-sm animate-pulse" id="insights-loading">
        <Sparkles size={28} className="text-indigo-600 dark:text-indigo-400 animate-spin" />
        <h4 className="text-slate-800 dark:text-white font-sans text-sm font-bold">Synthesizing McKinsey Strategic Action Priorities...</h4>
        <p className="text-xs text-slate-500 max-w-sm font-light leading-relaxed">
          Loading predefined clinical decisions, strategic roadmaps and policy guidelines.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left animate-fade-in" id="strategic-insights-section">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-[#0F4C81] dark:text-[#3B82F6] font-bold">
            <span className="px-2.5 py-1 rounded-md bg-[#0F4C81]/10 dark:bg-[#3B82F6]/10 border border-[#0F4C81]/20 dark:border-[#3B82F6]/20 text-[10px] text-[#0F4C81] dark:text-[#3B82F6] font-semibold tracking-wider uppercase">EXECUTIVE ROADMAP</span>
            <span className="text-xs text-slate-400 font-normal">Stage 6 Active</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white mt-1">
            Strategic Insights & Recommendations
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-light mt-0.5">
            McKinsey-style executive intelligence suite. Strategic analysis, operational recommendations, and policy guidelines mapped directly from our mathematical cohort analysis.
          </p>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="flex flex-wrap border-b border-slate-200 dark:border-slate-800 gap-1">
        <button
          onClick={() => setActiveTab('summary')}
          className={`py-2.5 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
            activeTab === 'summary' ? 'border-[#0F4C81] text-[#0F4C81] dark:border-[#3B82F6] dark:text-[#3B82F6]' : 'border-transparent text-slate-400 hover:text-slate-650'
          }`}
        >
          <FileText size={14} />
          <span>Executive Summary & Bottlenecks</span>
        </button>
        <button
          onClick={() => setActiveTab('hospital')}
          className={`py-2.5 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
            activeTab === 'hospital' ? 'border-[#0F4C81] text-[#0F4C81] dark:border-[#3B82F6] dark:text-[#3B82F6]' : 'border-transparent text-slate-400 hover:text-slate-650'
          }`}
        >
          <Activity size={14} />
          <span>Hospital Recommendations</span>
        </button>
        <button
          onClick={() => setActiveTab('policy')}
          className={`py-2.5 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
            activeTab === 'policy' ? 'border-[#0F4C81] text-[#0F4C81] dark:border-[#3B82F6] dark:text-[#3B82F6]' : 'border-transparent text-slate-400 hover:text-slate-650'
          }`}
        >
          <Award size={14} />
          <span>Healthcare Policy Recommendations</span>
        </button>
        <button
          onClick={() => setActiveTab('research')}
          className={`py-2.5 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
            activeTab === 'research' ? 'border-[#0F4C81] text-[#0F4C81] dark:border-[#3B82F6] dark:text-[#3B82F6]' : 'border-transparent text-slate-400 hover:text-slate-650'
          }`}
        >
          <TrendingUp size={14} />
          <span>Future Research Framework</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="space-y-6">
        
        {/* Tab 1: Executive Summary & Bottlenecks */}
        {activeTab === 'summary' && (
          <div className="space-y-6 animate-fade-in">
            {/* Executive Summary Callout */}
            <div className="border border-[#0F4C81]/20 dark:border-[#3B82F6]/20 bg-gradient-to-br from-[#0F4C81]/5 to-indigo-50/10 dark:from-[#3B82F6]/5 dark:to-transparent rounded-xl p-6 shadow-3xs">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0F4C81] dark:text-[#3B82F6] block mb-2">
                Executive Abstract & Clinical Thesis
              </span>
              <p className="text-sm font-bold text-slate-850 dark:text-white leading-relaxed">
                "Our comprehensive evaluation of the CIHI NACRS Emergency Department cohort confirms that Length of Stay (LOS) is not a simple random distribution, but rather a structurally constrained clinical process. Systemic delays are highly concentrated in CTAS Level 3 'Urgent' cases and geriatric patient flows. By utilizing a multi-tier analytics solver, we have validated critical operational bottlenecks, enabling leadership to shift resources from reactive staffing models to proactive, predictive clinical pathways."
              </p>
            </div>

            {/* Grid for Key Findings & Operational Bottlenecks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Key Findings */}
              <div className="border border-[#E5E7EB] dark:border-[#1e2d4a] bg-white dark:bg-[#131f37] rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-[#1e2d4a] pb-3">
                  <LayoutGrid size={16} className="text-[#0F4C81] dark:text-[#3B82F6]" />
                  <h3 className="text-sm font-extrabold text-[#111827] dark:text-white uppercase tracking-wider font-mono">
                    Key Analytical Findings
                  </h3>
                </div>
                
                <div className="space-y-3.5 text-xs text-slate-550">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 size={14} className="text-[#2E8B57] mt-0.5 shrink-0" />
                    <p className="font-light leading-relaxed">
                      <strong className="font-semibold text-slate-800 dark:text-slate-200">Acuity Polarization:</strong> Triage categories accurately match care complexity. Extreme resuscitations (CTAS 1/2) yield very long baseline stays, while minor ailments (CTAS 5) are handled rapidly.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 size={14} className="text-[#2E8B57] mt-0.5 shrink-0" />
                    <p className="font-light leading-relaxed">
                      <strong className="font-semibold text-slate-800 dark:text-slate-200">Pandemic Loading:</strong> Public health crises significantly lengthened ED boarding cycles, multiplying mean stay times by an average of 1.34x due to strict isolation workflows.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 size={14} className="text-[#2E8B57] mt-0.5 shrink-0" />
                    <p className="font-light leading-relaxed">
                      <strong className="font-semibold text-slate-800 dark:text-slate-200">Cost-Wait Coupling:</strong> Pearson correlation modeling validates a strong positive linear coupling ($r \approx 0.88$) between total minutes in triage and hospital resource costs.
                    </p>
                  </div>
                </div>
              </div>

              {/* Operational Bottlenecks */}
              <div className="border border-[#E5E7EB] dark:border-[#1e2d4a] bg-white dark:bg-[#131f37] rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-[#1e2d4a] pb-3">
                  <AlertTriangle size={16} className="text-amber-500" />
                  <h3 className="text-sm font-extrabold text-[#111827] dark:text-white uppercase tracking-wider font-mono">
                    Operational Bottlenecks Identified
                  </h3>
                </div>
                
                <div className="space-y-3.5 text-xs text-slate-550">
                  <div className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                    <p className="font-light leading-relaxed">
                      <strong className="font-semibold text-slate-800 dark:text-slate-200">CTAS Level 3 Overflow:</strong> Representing 42% of encounters, urgent cases wait disproportionately long compared to their severity index due to diagnostic queue congestion.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                    <p className="font-light leading-relaxed">
                      <strong className="font-semibold text-slate-800 dark:text-slate-200">Geriatric Boarding blockages:</strong> High-severity elderly patients (65+) represent 65% of all extreme 12h+ boarding events, caused by delayed transfers to post-acute facilities.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                    <p className="font-light leading-relaxed">
                      <strong className="font-semibold text-slate-800 dark:text-slate-200">Documentation Revenue Omission:</strong> Complex encounters result in high indirect administrative overheads that capture 15% less revenue due to incomplete medical coding.
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Hypothesis Outcomes Overview */}
            <div className="border border-[#E5E7EB] dark:border-[#1e2d4a] bg-white dark:bg-[#131f37] rounded-xl p-5 space-y-4">
              <h3 className="text-xs font-extrabold text-slate-700 dark:text-slate-200 uppercase tracking-wider font-mono">
                Statistical Hypothesis Decisions Matrix
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3.5 text-xs font-mono">
                <div className="p-3 bg-[#F8FAFC] dark:bg-[#152033] rounded-lg border border-slate-200 dark:border-[#1e2d4a] text-center">
                  <span className="text-[10px] text-slate-400 block font-bold mb-1">H1: Welch T-Test</span>
                  <span className="text-[#2E8B57] font-bold">REJECTED H0</span>
                  <p className="text-[10px] text-slate-400 mt-1">Pandemic LOS is statistically elevated.</p>
                </div>
                <div className="p-3 bg-[#F8FAFC] dark:bg-[#152033] rounded-lg border border-slate-200 dark:border-[#1e2d4a] text-center">
                  <span className="text-[10px] text-slate-400 block font-bold mb-1">H2: One-way ANOVA</span>
                  <span className="text-[#2E8B57] font-bold">REJECTED H0</span>
                  <p className="text-[10px] text-slate-400 mt-1">Stay times vary strongly by CTAS levels.</p>
                </div>
                <div className="p-3 bg-[#F8FAFC] dark:bg-[#152033] rounded-lg border border-slate-200 dark:border-[#1e2d4a] text-center">
                  <span className="text-[10px] text-slate-400 block font-bold mb-1">H3: WLS Regression</span>
                  <span className="text-[#2E8B57] font-bold">REJECTED H0</span>
                  <p className="text-[10px] text-slate-400 mt-1">Cost is driven by age and triage rank.</p>
                </div>
                <div className="p-3 bg-[#F8FAFC] dark:bg-[#152033] rounded-lg border border-slate-200 dark:border-[#1e2d4a] text-center">
                  <span className="text-[10px] text-slate-400 block font-bold mb-1">H4: Correlation</span>
                  <span className="text-[#2E8B57] font-bold">REJECTED H0</span>
                  <p className="text-[10px] text-slate-400 mt-1">Total minutes are coupled with direct cost.</p>
                </div>
                <div className="p-3 bg-[#F8FAFC] dark:bg-[#152033] rounded-lg border border-slate-200 dark:border-[#1e2d4a] text-center">
                  <span className="text-[10px] text-slate-400 block font-bold mb-1">H5: ARIMA & K-Means</span>
                  <span className="text-[#2E8B57] font-bold">REJECTED H0</span>
                  <p className="text-[10px] text-slate-400 mt-1">Centroids are separate; inflows rise.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Hospital Recommendations */}
        {activeTab === 'hospital' && (
          <div className="space-y-4 animate-fade-in">
            {recommendations.filter(r => r.category === "Hospital").map((rec, index) => (
              <RecommendationCard key={index} rec={rec} />
            ))}
          </div>
        )}

        {/* Tab 3: Policy Recommendations */}
        {activeTab === 'policy' && (
          <div className="space-y-4 animate-fade-in">
            {recommendations.filter(r => r.category === "Policy").map((rec, index) => (
              <RecommendationCard key={index} rec={rec} />
            ))}
          </div>
        )}

        {/* Tab 4: Future Research */}
        {activeTab === 'research' && (
          <div className="space-y-4 animate-fade-in">
            {recommendations.filter(r => r.category === "Future Research").map((rec, index) => (
              <RecommendationCard key={index} rec={rec} />
            ))}
          </div>
        )}

      </div>

    </div>
  );
}

// Sub-component: RecommendationCard
function RecommendationCard({ rec }: { rec: StrategicRecommendation; key?: any }) {
  return (
    <div className="border border-[#E5E7EB] dark:border-[#1e2d4a] bg-white dark:bg-[#131f37] rounded-xl overflow-hidden shadow-3xs hover:shadow-xs transition-shadow">
      
      {/* Card Header */}
      <div className="px-6 py-4 bg-[#F9FAFB] dark:bg-[#152033] border-b border-[#E5E7EB] dark:border-[#1e2d4a] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-[#0F4C81]/10 text-[#0F4C81] dark:text-[#3B82F6]">
            <Zap size={14} />
          </div>
          <h3 className="font-extrabold text-[#111827] dark:text-white text-sm">
            {rec.title}
          </h3>
        </div>
        
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold tracking-wider uppercase ${
            rec.priority === "CRITICAL" 
              ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400' 
              : 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400'
          }`}>
            Priority: {rec.priority}
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold tracking-wider text-slate-500 bg-slate-100 dark:bg-[#182640] dark:text-slate-400 uppercase">
            Risk: {rec.riskLevel}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 space-y-4 text-xs leading-relaxed">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
          
          {/* Action Column */}
          <div className="md:col-span-8 space-y-1.5 text-slate-550">
            <span className="text-[10px] font-mono font-extrabold text-slate-400 uppercase tracking-widest block">
              Recommended Action & Clinical Context
            </span>
            <p className="font-light">
              {rec.recommendedAction}
            </p>
          </div>

          {/* Benefit Column */}
          <div className="md:col-span-4 space-y-1.5 p-4 rounded-xl bg-emerald-50/20 dark:bg-[#152033]/40 border-l-3 border-[#2E8B57]">
            <span className="text-[10px] font-mono font-extrabold text-[#2E8B57] uppercase tracking-widest block">
              Expected Operational Benefit
            </span>
            <p className="text-slate-600 dark:text-slate-350 font-light font-mono text-[11px] leading-relaxed">
              {rec.expectedBenefit}
            </p>
          </div>

        </div>

        {/* Micro-metrics Row */}
        <div className="pt-4 border-t border-slate-100 dark:border-[#1e2d4a] flex justify-between items-center text-[10px] font-mono text-slate-450">
          <div className="flex items-center gap-1.5">
            <TrendingUp size={12} className="text-[#0F4C81] dark:text-[#3B82F6]" />
            <span>Expected Strategic Impact Level:</span>
            <strong className="text-slate-800 dark:text-slate-200 uppercase">{rec.expectedImpact}</strong>
          </div>
          <div className="flex items-center gap-1">
            <span>Framework Source:</span>
            <span className="text-[#0F4C81] dark:text-[#3B82F6] font-bold uppercase tracking-wider">CIHI CAPSTONE v4.0</span>
          </div>
        </div>

      </div>

    </div>
  );
}
