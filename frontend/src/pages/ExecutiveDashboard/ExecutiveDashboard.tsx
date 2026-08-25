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
import { DashboardKPIs, TrendDataPoint, FilterState } from './components/types';
import { KPIItem, CustomVisualization } from '../../utils/types';

interface ExecutiveDashboardProps {
  datasetName: string;
  fields: any[];
  data: any[];
  aiKPIs?: KPIItem[] | null;
  customCharts?: CustomVisualization[];
  onAddChart?: (c: CustomVisualization) => void;
  onRemoveChart?: (id: string) => void;
  onNavigateToAnalytics?: () => void;
  isDarkMode?: boolean;
  setIsDarkMode?: (v: boolean) => void;
}

// Fallback 19-Year Longitudinal CIHI NACRS Trend Series
const DEFAULT_TREND_SERIES: TrendDataPoint[] = [
  { fiscal_year: '2003-2004', ed_visits: 1254300, median_los_min: 165, los_hours: 2.75, erbi_m_min: 124.1 },
  { fiscal_year: '2004-2005', ed_visits: 1310200, median_los_min: 168, los_hours: 2.80, erbi_m_min: 132.0 },
  { fiscal_year: '2005-2006', ed_visits: 1385400, median_los_min: 172, los_hours: 2.87, erbi_m_min: 142.9 },
  { fiscal_year: '2006-2007', ed_visits: 1442100, median_los_min: 175, los_hours: 2.92, erbi_m_min: 151.4 },
  { fiscal_year: '2007-2008', ed_visits: 1520600, median_los_min: 180, los_hours: 3.00, erbi_m_min: 164.2 },
  { fiscal_year: '2008-2009', ed_visits: 1605300, median_los_min: 184, los_hours: 3.07, erbi_m_min: 177.2 },
  { fiscal_year: '2009-2010', ed_visits: 1689200, median_los_min: 190, los_hours: 3.17, erbi_m_min: 192.5 },
  { fiscal_year: '2010-2011', ed_visits: 1792100, median_los_min: 195, los_hours: 3.25, erbi_m_min: 209.6 },
  { fiscal_year: '2011-2012', ed_visits: 1884500, median_los_min: 201, los_hours: 3.35, erbi_m_min: 227.2 },
  { fiscal_year: '2012-2013', ed_visits: 1978200, median_los_min: 206, los_hours: 3.43, erbi_m_min: 244.5 },
  { fiscal_year: '2013-2014', ed_visits: 2085400, median_los_min: 212, los_hours: 3.53, erbi_m_min: 265.2 },
  { fiscal_year: '2014-2015', ed_visits: 2194300, median_los_min: 218, los_hours: 3.63, erbi_m_min: 286.9 },
  { fiscal_year: '2015-2016', ed_visits: 2310500, median_los_min: 224, los_hours: 3.73, erbi_m_min: 310.5 },
  { fiscal_year: '2016-2017', ed_visits: 2425100, median_los_min: 230, los_hours: 3.83, erbi_m_min: 334.6 },
  { fiscal_year: '2017-2018', ed_visits: 2548900, median_los_min: 235, los_hours: 3.92, erbi_m_min: 359.3 },
  { fiscal_year: '2018-2019', ed_visits: 2689200, median_los_min: 240, los_hours: 4.00, erbi_m_min: 387.2 },
  { fiscal_year: '2019-2020', ed_visits: 2795400, median_los_min: 245, los_hours: 4.08, erbi_m_min: 410.9 },
  { fiscal_year: '2020-2021', ed_visits: 2480100, median_los_min: 238, los_hours: 3.97, erbi_m_min: 354.1 },
  { fiscal_year: '2021-2022', ed_visits: 2894500, median_los_min: 250, los_hours: 4.17, erbi_m_min: 434.1 },
];

export default function ExecutiveDashboard({
  datasetName,
  fields,
  data,
  onNavigateToAnalytics,
  isDarkMode = false,
  setIsDarkMode,
}: ExecutiveDashboardProps) {
  const dark = isDarkMode;

  // Backend KPIs & Trend State
  const [backendKPIs, setBackendKPIs] = useState<DashboardKPIs | null>(null);
  const [trendSeries, setTrendSeries] = useState<TrendDataPoint[]>(DEFAULT_TREND_SERIES);
  const [isLoading, setIsLoading] = useState(false);

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
    fetch('/api/dashboard/kpis')
      .then(r => r.json())
      .then(json => {
        if (json.success && json.kpis) {
          setBackendKPIs(json.kpis);
        }
      })
      .catch(err => console.error('Failed to fetch dashboard KPIs:', err));

    fetch('/api/dashboard/trends')
      .then(r => r.json())
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VisitVolumeTrend data={activeTrendSeries} isDarkMode={dark} />
        <LOSTrend data={activeTrendSeries} isDarkMode={dark} />
      </div>

      {/* ══ 5. HYPOTHESIS ANALYSIS SUITE (H1 – H5) ═══════════════════════════ */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#1e2d4a] pb-2">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0F4C81] dark:text-[#3B82F6] block">
              Biostatistical Modeling · Primary Hypotheses
            </span>
            <h2 className={`text-base font-extrabold ${dark ? 'text-white' : 'text-slate-900'}`}>
              Hypothesis Testing Visual Suite (H1 – H5)
            </h2>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Weighted Non-Parametric &amp; WLS Engine</span>
        </div>

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
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#1e2d4a] pb-2">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0F4C81] dark:text-[#3B82F6] block">
              Operational Resource Allocation &amp; Clinical Burden
            </span>
            <h2 className={`text-base font-extrabold ${dark ? 'text-white' : 'text-slate-900'}`}>
              Estimated Resource Burden &amp; Diagnostic Profiles
            </h2>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">ERBI = Σ(Urgency × LOS × Visits)</span>
        </div>

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

      {/* Footer Provenance */}
      <p className={`text-center text-[10px] font-mono py-2 ${dark ? 'text-slate-600' : 'text-slate-400'}`}>
        Canadian Emergency Department Analytics Platform · DAMO-6994 Capstone · University of Niagara Falls · CIHI NACRS Analytical Core
      </p>
    </div>
  );
}
