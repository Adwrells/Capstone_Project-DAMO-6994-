export interface DashboardKPIs {
  total_ed_visits: number;
  total_cohort_expanded_visits: number;
  reported_median_los_min: number;
  reported_median_los_hours: number;
  admission_rate_percent: number;
  total_admitted_visits: number;
  total_non_admitted_visits: number;
  overall_erbi_score: number;
  total_burden_hours: number;
  hypotheses_evaluated: number;
  hypotheses_total: number;
  year_range: string;
  top_condition: string;
}

export interface TrendDataPoint {
  fiscal_year: string;
  ed_visits: number;
  median_los_min: number;
  los_hours: number;
  erbi_m_min: number;
}

export interface HypothesisHubItem {
  id: string;
  title: string;
  question: string;
  method: string;
  test_statistic: string;
  p_value: number;
  effect_size: string;
  decision: string;
  clinical_takeaway: string;
}

export interface MainProblemItem {
  problem: string;
  ed_visits: number;
  percent_share: number;
  los_hours: number;
  los_min: number;
}

export interface ResourceBurdenItem {
  triage_level?: string;
  age_category?: string;
  total_visits: number;
  avg_erbi_score: number;
  raw_burden_hours: number;
}

export interface FilterState {
  years: string[];
  sex: string[];
  ageGroups: string[];
  ctasLevels: string[];
  dispositions: string[];
}
