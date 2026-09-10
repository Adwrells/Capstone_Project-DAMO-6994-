/**
 * Healthcare Analytics Platform — Executive Dashboard
 * ===================================================
 * Operational & Clinical Modelling of Emergency Department Wait Times & Resource Burden
 * University of Niagara Falls — DAMO-6994 Capstone Project
 *
 * Architecture:
 * 1. Dashboard Header (Capstone metadata, active database status, theme toggle)
 * 2. Central Filter Bar (Fiscal Year, Sex, Age Cohort, CTAS Acuity, Disposition, Reset)
 * 3. 5 Executive KPIs (Total Visits, Reported LOS, Admission Rate, ERBI, Hypotheses Evaluated)
 * 4. System Overview Trends (Visual A: Visit Volume Trend | Visual B: Reported LOS Trend)
 * 5. Hypothesis Analysis Suite (H1 CTAS vs LOS | H2 Admission vs LOS | H3 WLS Regression | H4 Age vs LOS | H5 Sex vs Disposition)
 * 6. Operational & Clinical Analysis (Resource Burden by CTAS | Top 10 Main Problems | Resource Burden Trend)
 * 7. Hypothesis Evidence Hub (Master H1–H5 Synthesis Cards)
 * 8. Descriptive Statistics (Key numeric variable distributions & skewness analysis)
 */

import React, { useState, useEffect, useMemo } from 'react';
import DashboardHeader from './components/DashboardHeader';
import DashboardFilters from './components/DashboardFilters';
import ExecutiveKPIGrid from './components/ExecutiveKPIGrid';
import VisitVolumeTrend from './components/VisitVolumeTrend';
import LOSTrend from './components/LOSTrend';
import H1CTASLOS from './components/H1CTASLOS';
import H2AdmissionLOS from './components/H2AdmissionLOS';
import H3UrgencyRegression from './components/H3UrgencyRegression';
import H4AgeLOS from './components/H4AgeLOS';
import H5SexDisposition from './components/H5SexDisposition';
import ResourceBurdenByCTAS from './components/ResourceBurdenByCTAS';
import TopMainProblems from './components/TopMainProblems';
import ResourceBurdenTrend from './components/ResourceBurdenTrend';
import HypothesisEvidenceHub from './components/HypothesisEvidenceHub';
import DescriptiveStatsTable from './components/DescriptiveStatsTable';
import CustomChartBuilder from '../../components/charts/CustomChartBuilder';
import CustomChartCard from './components/CustomChartCard';
import SectionHeader from '../../components/common/SectionHeader';

import { DashboardKPIs, TrendDataPoint, FilterState } from './components/types';

import { fetchDashboardKPIs, fetchDashboardTrends } from '../../services/apiService';
import { KPIItem, CustomVisualization } from '../../utils/types';
import { Sparkles, X, PlusCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

interface ExecutiveDashboardProps {
  datasetName: string;
  fields: any[];
  data: any[];
  aiKPIs?: KPIItem[] | null;
  customCharts?: CustomVisualization[];
  onAddChart?: (c: CustomVisualization) => void;
  onRemoveChart?: (id: string) => void;
  onNavigateToAnalytics?: () => void;
  onNavigateNext?: () => void;
  isDarkMode?: boolean;
  setIsDarkMode?: (v: boolean) => void;
}

// Fallback 19-Year Longitudinal CIHI NACRS Trend Series (age_sex table: 175,762,944 total visits)
const DEFAULT_TREND_SERIES: TrendDataPoint[] = [
  { fiscal_year: '2003-2004', ed_visits: 4906394, median_los_min: 132.8, los_hours: 2.21, tem_m_min: 651.57, erbi_m_min: 651.57 },
  { fiscal_year: '2004-2005', ed_visits: 5247805, median_los_min: 137.8, los_hours: 2.30, tem_m_min: 723.15, erbi_m_min: 723.15 },
  { fiscal_year: '2005-2006', ed_visits: 5417114, median_los_min: 141.7, los_hours: 2.36, tem_m_min: 767.61, erbi_m_min: 767.61 },
  { fiscal_year: '2006-2007', ed_visits: 5429867, median_los_min: 146.1, los_hours: 2.44, tem_m_min: 793.30, erbi_m_min: 793.30 },
  { fiscal_year: '2007-2008', ed_visits: 5530328, median_los_min: 156.4, los_hours: 2.61, tem_m_min: 864.94, erbi_m_min: 864.94 },
  { fiscal_year: '2008-2009', ed_visits: 5559194, median_los_min: 162.8, los_hours: 2.71, tem_m_min: 905.04, erbi_m_min: 905.04 },
  { fiscal_year: '2009-2010', ed_visits: 5763341, median_los_min: 164.6, los_hours: 2.74, tem_m_min: 948.65, erbi_m_min: 948.65 },
  { fiscal_year: '2010-2011', ed_visits: 8171651, median_los_min: 154.8, los_hours: 2.58, tem_m_min: 1264.97, erbi_m_min: 1264.97 },
  { fiscal_year: '2011-2012', ed_visits: 9064585, median_los_min: 157.3, los_hours: 2.62, tem_m_min: 1425.86, erbi_m_min: 1425.86 },
  { fiscal_year: '2012-2013', ed_visits: 10041516, median_los_min: 158.7, los_hours: 2.64, tem_m_min: 1593.59, erbi_m_min: 1593.59 },
  { fiscal_year: '2013-2014', ed_visits: 10362125, median_los_min: 162.7, los_hours: 2.71, tem_m_min: 1685.92, erbi_m_min: 1685.92 },
  { fiscal_year: '2014-2015', ed_visits: 10857038, median_los_min: 167.4, los_hours: 2.79, tem_m_min: 1817.47, erbi_m_min: 1817.47 },
  { fiscal_year: '2015-2016', ed_visits: 11082171, median_los_min: 170.2, los_hours: 2.84, tem_m_min: 1886.19, erbi_m_min: 1886.19 },
  { fiscal_year: '2016-2017', ed_visits: 11172324, median_los_min: 174.4, los_hours: 2.91, tem_m_min: 1948.45, erbi_m_min: 1948.45 },
  { fiscal_year: '2017-2018', ed_visits: 11439577, median_los_min: 179.7, los_hours: 2.99, tem_m_min: 2055.69, erbi_m_min: 2055.69 },
  { fiscal_year: '2018-2019', ed_visits: 15080342, median_los_min: 203.9, los_hours: 3.40, tem_m_min: 3074.88, erbi_m_min: 3074.88 },
  { fiscal_year: '2019-2020', ed_visits: 15023099, median_los_min: 209.2, los_hours: 3.49, tem_m_min: 3142.83, erbi_m_min: 3142.83 },
  { fiscal_year: '2020-2021', ed_visits: 11622444, median_los_min: 202.6, los_hours: 3.38, tem_m_min: 2354.71, erbi_m_min: 2354.71 },
  { fiscal_year: '2021-2022', ed_visits: 13992029, median_los_min: 227.8, los_hours: 3.80, tem_m_min: 3187.38, erbi_m_min: 3187.38 },
];

export default function ExecutiveDashboard({
  datasetName,
  fields,
  data,
  customCharts,
  onAddChart,
  onRemoveChart,
  onNavigateToAnalytics,
  onNavigateNext,
  isDarkMode = false,
  setIsDarkMode,
}: ExecutiveDashboardProps) {
  const dark = isDarkMode;

  // Backend KPIs & Trend State
  const [backendKPIs, setBackendKPIs] = useState<DashboardKPIs | null>(null);
  const [trendSeries, setTrendSeries] = useState<TrendDataPoint[]>(DEFAULT_TREND_SERIES);
  const [isLoading, setIsLoading] = useState(false);

  // ── Visual Studio / Custom Chart Builder State ─────────────────────────────
  const [isVisualBuilderOpen, setIsVisualBuilderOpen] = useState(false);
  const [localCustomCharts, setLocalCustomCharts] = useState<CustomVisualization[]>(() => {
    if (customCharts && customCharts.length > 0) return customCharts;
    try {
      const saved = localStorage.getItem('healthcare_analytics_custom_charts');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  useEffect(() => {
    if (customCharts && customCharts.length > 0) {
      setLocalCustomCharts(customCharts);
    }
  }, [customCharts]);

  const handleAddCustomChart = (chart: CustomVisualization) => {
    setLocalCustomCharts(prev => {
      const updated = [...prev, chart];
      try {
        localStorage.setItem('healthcare_analytics_custom_charts', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    onAddChart?.(chart);
    setIsVisualBuilderOpen(false);

    // Smoothly scroll down to the committed visual row
    setTimeout(() => {
      const el = document.getElementById('committed-visuals-section');
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 120);
  };

  const handleRemoveCustomChart = (id: string) => {
    setLocalCustomCharts(prev => {
      const updated = prev.filter(c => c.id !== id);
      try {
        localStorage.setItem('healthcare_analytics_custom_charts', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    onRemoveChart?.(id);
  };

  // ── Central Filter State ───────────────────────────────────────────────────
  const [filters, setFilters] = useState<FilterState>({
    years: [],
    sex: [],
    ageGroups: [],
    ctasLevels: [],
    dispositions: [],
  });

  const handleFilterChange = (key: keyof FilterState, values: string[]) => {
    setFilters(prev => ({ ...prev, [key]: values }));
  };

  const handleResetFilters = () => {
    setFilters({
      years: [],
      sex: [],
      ageGroups: [],
      ctasLevels: [],
      dispositions: [],
    });
  };

  // ── Fetch Verified Backend Analytics Data ──────────────────────────────────
  useEffect(() => {
    setIsLoading(true);
    fetchDashboardKPIs()
      .then(json => {
        if (json.success && json.kpis) {
          setBackendKPIs(json.kpis);
        }
      })
      .catch(err => console.error('Failed to fetch dashboard KPIs:', err));

    fetchDashboardTrends()
      .then(json => {
        if (json.success && Array.isArray(json.series) && json.series.length > 0) {
          setTrendSeries(json.series);
        }
      })
      .catch(err => console.error('Failed to fetch dashboard trends:', err))
      .finally(() => setIsLoading(false));
  }, []);

  // ── Detect Columns & Extract Unique Options ────────────────────────────────
  const allCols = useMemo(() => fields.map(f => String(f.name || '')), [fields]);
  const findCol = (...kws: string[]) =>
    allCols.find(c => kws.some(k => c.toLowerCase().includes(k.toLowerCase()))) ?? '';

  const COL = useMemo(
    () => ({
      year: findCol('fiscal year', 'fiscal_year', 'year'),
      sex: findCol('sex', 'gender'),
      ageGroup: findCol('age group', 'age_group', 'age_broad', 'age'),
      ctas: findCol('ctas', 'triage level', 'triage_level'),
      disposition: findCol('visit disposition', 'disposition', 'admission'),
      los: findCol('length of stay', 'los', 'length_of_stay', 'median_length'),
      visits: findCol('ed visits', 'ed_visits', 'visit_count', 'total_ed_visits'),
    }),
    [allCols]
  );

  const distinct = (col: string) =>
    col ? [...new Set(data.map(r => String(r[col] ?? '')).filter(Boolean))].sort() : [];

  const filterOptions = useMemo(
    () => ({
      years: distinct(COL.year).length ? distinct(COL.year) : trendSeries.map(t => t.fiscal_year),
      sexes: distinct(COL.sex).length ? distinct(COL.sex) : ['Female', 'Male'],
      ageGroups: distinct(COL.ageGroup).length
        ? distinct(COL.ageGroup)
        : ['Pediatric & Youth (0-17)', 'Young Adult (18-34)', 'Middle Adult (35-64)', 'Older Adult (65+)'],
      ctasLevels: distinct(COL.ctas).length
        ? distinct(COL.ctas)
        : ['CTAS I - Resuscitation', 'CTAS II - Emergent', 'CTAS III - Urgent', 'Less urgent', 'Non-urgent'],
      dispositions: distinct(COL.disposition).length
        ? distinct(COL.disposition)
        : ['Non-Admitted', 'Admitted Inpatient'],
    }),
    [data, COL, trendSeries]
  );

  // ── Computed Filtered Dataset ──────────────────────────────────────────────
  const filteredData = useMemo(() => {
    return data.filter(r => {
      if (filters.years.length && COL.year && !filters.years.includes(String(r[COL.year] ?? ''))) return false;
      if (filters.sex.length && COL.sex && !filters.sex.includes(String(r[COL.sex] ?? ''))) return false;
      if (filters.ageGroups.length && COL.ageGroup && !filters.ageGroups.includes(String(r[COL.ageGroup] ?? '')))
        return false;
      if (filters.ctasLevels.length && COL.ctas && !filters.ctasLevels.includes(String(r[COL.ctas] ?? '')))
        return false;
      if (
        filters.dispositions.length &&
        COL.disposition &&
        !filters.dispositions.includes(String(r[COL.disposition] ?? ''))
      )
        return false;
      return true;
    });
  }, [data, filters, COL]);

  // Filtered Visit Volume & LOS
  const filteredVisitsCount = useMemo(() => {
    if (!COL.visits) return filteredData.length;
    const vals = filteredData.map(r => Number(r[COL.visits])).filter(v => !isNaN(v) && v > 0);
    return vals.length ? vals.reduce((a, b) => a + b, 0) : filteredData.length;
  }, [filteredData, COL.visits]);

  const filteredMedianLOS = useMemo(() => {
    if (!COL.los) return backendKPIs?.reported_median_los_hours ?? 3.69;
    const vals = filteredData.map(r => Number(r[COL.los])).filter(v => !isNaN(v) && v > 0).sort((a, b) => a - b);
    if (!vals.length) return backendKPIs?.reported_median_los_hours ?? 3.69;
    const mid = Math.floor(vals.length / 2);
    const medVal = vals.length % 2 !== 0 ? vals[mid] : (vals[mid - 1] + vals[mid]) / 2;
    return medVal > 24 ? medVal / 60.0 : medVal; // convert minutes to hours if needed
  }, [filteredData, COL.los, backendKPIs]);

  // Filtered Trend Series when Year filter is applied
  const activeTrendSeries = useMemo(() => {
    if (filters.years.length === 0) return trendSeries;
    return trendSeries.filter(t => filters.years.includes(t.fiscal_year));
  }, [trendSeries, filters.years]);

  return (
    <div
      id="executive-dashboard-root"
      className={`space-y-6 p-4 sm:p-6 rounded-3xl select-none transition-colors ${
        dark ? 'bg-[#0C1524] text-slate-100' : 'bg-slate-50 text-slate-800'
      }`}
    >
      {/* ══ 1. DASHBOARD HEADER ══════════════════════════════════════════════ */}
      <DashboardHeader
        datasetName={datasetName}
        filteredCount={filteredData.length}
        totalCount={data.length}
        fieldCount={fields.length}
        isDarkMode={dark}
        onToggleDarkMode={() => setIsDarkMode && setIsDarkMode(!dark)}
      />

      {/* ══ 2. CENTRAL DASHBOARD FILTERS ═════════════════════════════════════ */}
      <DashboardFilters
        filterOptions={filterOptions}
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        onCreateVisual={() => setIsVisualBuilderOpen(true)}
        isDarkMode={dark}
      />

      {/* ══ 3. FIVE EXECUTIVE KPIS ═══════════════════════════════════════════ */}
      <ExecutiveKPIGrid
        kpis={backendKPIs}
        filteredVisitsCount={filteredVisitsCount}
        filteredMedianLOS={filteredMedianLOS}
        isDarkMode={dark}
      />

      {/* ══ 4. SYSTEM OVERVIEW TRENDS ════════════════════════════════════════ */}
      <div className="space-y-6">
        <VisitVolumeTrend data={activeTrendSeries} isDarkMode={dark} />
        <LOSTrend data={activeTrendSeries} isDarkMode={dark} />
      </div>

      {/* ══ 4B. COMMITTED CUSTOM VISUALS ROW ═════════════════════════════════ */}
      {localCustomCharts.length > 0 && (
        <div className="space-y-6" id="committed-visuals-section">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <SectionHeader
              category="CUSTOM ANALYTICS STUDIO · USER-COMMITTED VISUALS"
              title={`Committed Visuals & Custom Analyses (${localCustomCharts.length})`}
              right="Interactive Live Cross-Cuts"
            />
            <button
              type="button"
              onClick={() => setIsVisualBuilderOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs hover:shadow-blue-500/25 transition flex items-center gap-1.5 cursor-pointer self-start sm:self-auto shrink-0"
            >
              <PlusCircle size={13} />
              <span>Add Another Visual</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {localCustomCharts.map(chart => (
              <CustomChartCard
                key={chart.id}
                chart={chart}
                data={filteredData.length ? filteredData : data}
                isDarkMode={dark}
                onRemove={handleRemoveCustomChart}
              />
            ))}
          </div>
        </div>
      )}

      {/* ══ 5. HYPOTHESIS ANALYSIS SUITE (H1 – H5) ═══════════════════════════ */}
      <div className="space-y-6">
        <SectionHeader
          category="BIOSTATISTICAL MODELING · PRIMARY HYPOTHESES"
          title="Hypothesis Testing Visual Suite (H1 – H5)"
          right="Weighted Non-Parametric & WLS Engine"
        />

        {/* Row 1: H1 & H2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <H1CTASLOS isDarkMode={dark} />
          <H2AdmissionLOS isDarkMode={dark} />
        </div>

        {/* Row 2: H3 & H4 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <H3UrgencyRegression isDarkMode={dark} />
          <H4AgeLOS isDarkMode={dark} />
        </div>

        {/* Row 3: H5 Full Width */}
        <H5SexDisposition isDarkMode={dark} />
      </div>

      {/* ══ 6. OPERATIONAL & CLINICAL ANALYSIS ═══════════════════════════════ */}
      <div className="space-y-6">
        <SectionHeader
          category="OPERATIONAL RESOURCE ALLOCATION · CLINICAL BURDEN"
          title="Estimated Resource Burden & Diagnostic Profiles"
          right="ERBI = Σ(Urgency × LOS × Visits)"
        />


        {/* Operational Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ResourceBurdenByCTAS isDarkMode={dark} />
          <TopMainProblems isDarkMode={dark} />
        </div>

        {/* Longitudinal ERBI Forecasting */}
        <ResourceBurdenTrend isDarkMode={dark} />
      </div>

      {/* ══ 7. HYPOTHESIS EVIDENCE HUB ═══════════════════════════════════════ */}
      <HypothesisEvidenceHub
        onNavigateToAnalytics={onNavigateToAnalytics}
        isDarkMode={dark}
      />

      {/* ══ 8. DESCRIPTIVE STATISTICS TABLE ══════════════════════════════════ */}
      <DescriptiveStatsTable
        data={filteredData.length ? filteredData : data}
        fields={fields}
        isDarkMode={dark}
      />

      {/* ══ VISUAL BUILDER MODAL ═════════════════════════════════════════════ */}
      {isVisualBuilderOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-md overflow-y-auto animate-in fade-in duration-150"
          onClick={() => setIsVisualBuilderOpen(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            className={`relative w-full max-w-6xl max-h-[92vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden transition-colors ${
              dark ? 'bg-[#0F172A] border-[#1e2d4a] text-slate-100' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-[#1e2d4a] shrink-0 bg-slate-50/50 dark:bg-[#131f37]/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#0F4C81] to-[#3B82F6] flex items-center justify-center text-white shadow-xs">
                  <Sparkles size={17} />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold leading-tight text-slate-900 dark:text-white">
                    Interactive Visual Studio &amp; AI Chart Designer
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-light">
                    Build custom aggregated charts, analytics overlays, and cross-cuts from active dataset records.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsVisualBuilderOpen(false)}
                className="w-8 h-8 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-500 hover:border-rose-300 dark:hover:border-rose-800 cursor-pointer transition"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <CustomChartBuilder
                fields={fields}
                data={filteredData.length ? filteredData : data}
                customCharts={localCustomCharts}
                onAddChart={handleAddCustomChart}
                onRemoveChart={handleRemoveCustomChart}
                isDarkMode={dark}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── WORKFLOW ADVANCEMENT TO STAGE 6 ──────────────────────── */}
      {onNavigateNext && (
        <div className="p-4 sm:p-5 rounded-2xl border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-[#111e35] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm transition-all text-left">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-blue-600 dark:text-blue-400 block">
              Stage 5 · Executive Synthesis &amp; Macro Overview Complete
            </span>
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-xs sm:text-sm">
              <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
              <span>Operational KPIs &amp; Longitudinal ERBI Synthesis Ready</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Advance to Stage 6 for Strategic Insights, Clinical Decision Boundaries, and Prioritized Intervention Roadmaps.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onNavigateNext}
              className="h-10 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md hover:shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer select-none group"
            >
              <span>Proceed to Stage 6: Strategic Insights</span>
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      )}

      {/* Footer Provenance */}
      <p className={`text-center text-[10px] font-mono py-2 ${dark ? 'text-slate-600' : 'text-slate-400'}`}>
        Canadian Emergency Department Analytics Platform · DAMO-6994 Capstone · University of Niagara Falls · CIHI NACRS Analytical Core
      </p>
    </div>
  );
}
