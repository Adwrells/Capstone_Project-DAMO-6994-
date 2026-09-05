import React from 'react';
import { ArrowRight, ShieldCheck, CheckCircle2, ChevronRight } from 'lucide-react';
import { HypothesisHubItem } from './types';

interface HypothesisEvidenceHubProps {
  onNavigateToAnalytics?: () => void;
  isDarkMode: boolean;
}

const HYPOTHESIS_CARDS: HypothesisHubItem[] = [
  {
    id: 'H1',
    title: 'H1: CTAS Acuity & LOS',
    question: 'Does reported ED length of stay differ across CTAS triage levels?',
    method: 'Weighted Kruskal-Wallis & Dunn Post-Hoc',
    test_statistic: 'H = 1.26e8 (df=4)',
    p_value: 0.0,
    effect_size: 'ε² = 0.7251 (Large)',
    decision: 'Reject H₀',
    clinical_takeaway: 'Higher triage acuity (CTAS I–II) strongly associates with extended stay duration (4.6–4.8h) compared to non-urgent visits (<2h).',
  },
  {
    id: 'H2',
    title: 'H2: Admission Status & LOS',
    question: 'Does reported ED length of stay differ between admitted and non-admitted visits?',
    method: 'Weighted Mann-Whitney U Test',
    test_statistic: 'U = 2.69e12 (z=6952)',
    p_value: 0.0,
    effect_size: 'r_b = 0.9981 (Very Large)',
    decision: 'Reject H₀',
    clinical_takeaway: 'Admitted inpatients experience over 4× longer emergency stays (median 10.60h) than non-admitted visits (median 2.50h).',
  },
  {
    id: 'H3',
    title: 'H3: CTAS Urgency Prediction',
    question: 'Does CTAS urgency score predict reported ED length of stay?',
    method: 'Weighted Least Squares (WLS) Regression',
    test_statistic: 'Slope β = -1.23h / score (-73.92 min)',
    p_value: 0.0,
    effect_size: 'R² = 0.6256 (62.6% variance)',
    decision: 'Reject H₀',
    clinical_takeaway: 'Each unit increase in CTAS urgency score associates with a 1.23 hour (-73.92 min) decrease in reported median stay (p < 0.001, 95% CI [-78.00, -69.85] min).',
  },
  {
    id: 'H4',
    title: 'H4: Age Cohort & LOS',
    question: 'Does reported ED length of stay differ across broad age groups?',
    method: 'Weighted Kruskal-Wallis & Dunn Post-Hoc',
    test_statistic: 'H = 1.27e8 (df=3)',
    p_value: 0.0,
    effect_size: 'ε² = 0.7218 (Large)',
    decision: 'Reject H₀',
    clinical_takeaway: 'Older adults (65+) experience the longest median stays (4.17h / 250 min), over double pediatric stays (2.05h / 123 min).',
  },
  {
    id: 'H5',
    title: 'H5: Sex & Disposition',
    question: 'Is patient sex associated with visit disposition (Admitted vs Non-Admitted)?',
    method: 'Pearson Chi-Square Test of Independence',
    test_statistic: 'χ² = 18,165 (df=1)',
    p_value: 0.0,
    effect_size: 'Cramér’s V = 0.0102 (Negligible)',
    decision: 'Reject H₀',
    clinical_takeaway: 'Statistically significant due to massive sample size (N=175.76M), but clinically negligible difference (Male 10.56% admitted vs Female 9.95%).',
  },
];

export default function HypothesisEvidenceHub({
  onNavigateToAnalytics,
  isDarkMode,
}: HypothesisEvidenceHubProps) {
  const dark = isDarkMode;

  return (
    <div
      className={`rounded-2xl border p-6 shadow-xs space-y-5 transition-colors ${
        dark ? 'bg-[#131f37] border-[#1e2d4a]' : 'bg-white border-slate-200'
      }`}
    >
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#0F4C81] dark:text-[#3B82F6] block">
            Executive Synthesis · Hypothesis Evidence Hub
          </span>
          <h3 className={`text-base font-extrabold ${dark ? 'text-white' : 'text-slate-900'}`}>
            Master Analytical Conclusions (H1 – H5)
          </h3>
          <p className="text-[11px] text-slate-400">Standardized empirical test statistics, effect sizes, and operational takeaways</p>
        </div>

        {onNavigateToAnalytics && (
          <button
            type="button"
            onClick={onNavigateToAnalytics}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#0F4C81] hover:bg-[#0c3e6b] text-white text-xs font-bold shadow-xs cursor-pointer transition"
          >
            <span>Open Stage 3: Statistical Analysis</span>
            <ChevronRight size={14} />
          </button>
        )}
      </div>

      {/* 5 Hypothesis Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {HYPOTHESIS_CARDS.map(h => (
          <div
            key={h.id}
            className={`rounded-xl border p-4 flex flex-col justify-between space-y-3 transition-all hover:shadow-md ${
              dark ? 'bg-[#0f1a2e] border-[#1e2d4a]' : 'bg-[#F8FAFC] border-slate-200'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold font-mono text-[#0F4C81] dark:text-[#3B82F6] uppercase">
                  {h.id}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  <ShieldCheck size={9} /> {h.decision}
                </span>
              </div>

              <h4 className={`text-xs font-bold leading-tight ${dark ? 'text-white' : 'text-slate-900'}`}>
                {h.title}
              </h4>

              <div className="space-y-1 text-[10px]">
                <div className="flex justify-between text-slate-400">
                  <span>Method:</span>
                  <span className="font-semibold text-slate-600 dark:text-slate-300 truncate max-w-[110px] text-right">
                    {h.method.split('&')[0]}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Statistic:</span>
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                    {h.test_statistic.split('(')[0]}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Effect Size:</span>
                  <span className="font-mono font-bold text-purple-600 dark:text-purple-400">
                    {h.effect_size.split('(')[0]}
                  </span>
                </div>
              </div>

              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug pt-1 border-t border-slate-200/60 dark:border-slate-800">
                {h.clinical_takeaway}
              </p>
            </div>

            {onNavigateToAnalytics && (
              <button
                type="button"
                onClick={onNavigateToAnalytics}
                className="w-full pt-2 flex items-center justify-center gap-1 text-[10px] font-bold text-[#0F4C81] dark:text-[#3B82F6] hover:underline cursor-pointer border-t border-slate-200/60 dark:border-slate-800"
              >
                <span>View Detailed Analysis</span>
                <ArrowRight size={10} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
