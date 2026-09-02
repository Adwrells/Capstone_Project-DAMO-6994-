/**
 * Healthcare Analytics Platform - Centralized Domain Types & API Contracts
 *
 * Defines canonical TypeScript interfaces for executive dashboards,
 * data explorer schemas, statistical models, BI visualization, and persistence contracts.
 */

// ----------------------------------------------------
// 1. DATASET EXPLORER & DATA QUALITY SCHEMAS
// ----------------------------------------------------

export type ColumnType = 'numeric' | 'categorical' | 'date' | 'boolean' | 'text';

export interface ColumnInfo {
  name: string;
  type: ColumnType;
  missingCount: number;
  duplicateCount: number;
  outliersCount: number;
  sampleValues: any[];
}

export interface DatasetStats {
  rows: number;
  cols: number;
  missingValues: number;
  duplicateRecords: number;
  outliersCount: number;
  qualityScore: number;
}

export interface CleaningAction {
  column: string;
  issue: string;
  method: string;
  rowsAffected: number;
}

export interface CleaningSummary {
  initialScore: number;
  finalScore: number;
  actionsTaken: CleaningAction[];
}

export interface PreloadedDataset {
  key: string;
  label?: string;
  name: string;
  sheetName?: string;
  filePath?: string;
  rows?: number;
  cols?: number;
  rowCount?: number;
  colCount?: number;
  fileSize?: string;
  memoryUsage?: string;
  missingValues?: number;
  duplicates?: number;
  dataTypes?: string[];
  loadStatus: 'success' | 'error';
  errorMessage?: string;
  fields: { name: string; type: ColumnType }[];
  data: Record<string, any>[];
  sourceTable: string;
  dbStatus: 'sqlite' | 'excel_import' | 'unavailable';
  importedAt?: string;
}

export interface NumericalMetrics {
  mean: number;
  median: number;
  mode: number | string;
  variance: number;
  stdDev: number;
  min: number;
  max: number;
  q1: number;
  q3: number;
}

export interface CategoricalMetrics {
  frequencyDistribution: Array<{
    category: string;
    count: number;
    share: number;
  }>;
}

export interface QuantitativeAnalytics {
  correlationMatrix: Array<{
    columnA: string;
    columnB: string;
    coefficient: number;
  }>;
  distributionMetric?: string;
  outliersDetected: number;
}

export interface KPIItem {
  id: string;
  title: string;
  value: string | number;
  trend: 'up' | 'down' | 'neutral';
  comparisonPeriod: string;
  growthPercent: number;
  score?: number;
}

export interface AIKeyFinding {
  title: string;
  description: string;
  type: 'finding' | 'opportunity' | 'risk' | 'anomaly';
  impact: string;
}

export interface StrategicRecommendation {
  finding: string;
  whyItMatters: string;
  recommendedAction: string;
  expectedImpact: string;
  priorityLevel: 'High' | 'Medium' | 'Low';
}

export interface ImpactForecast {
  revenueIncrease: string;
  costReduction: string;
  expectedRoi: string;
}

export interface AIAnalysisResult {
  datasetOverview: string;
  kpis: KPIItem[];
  keyFindings: AIKeyFinding[];
  recommendations: StrategicRecommendation[];
  impactForecast: ImpactForecast;
}

export type AggregationOption = 'Sum' | 'Average' | 'Count' | 'Median' | 'Min' | 'Max';

export interface CustomVisualization {
  id: string;
  title: string;
  type: 'Bar' | 'Column' | 'Pie' | 'Donut' | 'Line' | 'Area' | 'Scatter' | 'Histogram' | 'Heatmap' | 'Treemap' | 'Bubble' | 'Funnel' | 'Waterfall' | 'Box Plot' | 'Sankey' | 'Radar' | 'Gauge';
  xAxisColumn: string;
  yAxisColumn: string;
  aggregation: AggregationOption;
  groupByColumn?: string;
  sortByColumn?: string;
  sortOrder?: 'asc' | 'desc';
  subtitle?: string;
  description?: string;
  showGridlines?: boolean;
  showLegend?: boolean;
  legendPosition?: 'top' | 'bottom' | 'left' | 'right';
  showDataLabels?: boolean;
  xAxisLabelRotation?: number;
  xAxisTitle?: string;
  yAxisTitle?: string;
  enableTrendLine?: boolean;
  enableMovingAverage?: boolean;
  targetValue?: number;
  themeName?: string;
  confidenceScore?: number;
  selectionReasoning?: string;
  showAnomalies?: boolean;
  colorScaleMin?: string;
  colorScaleMax?: string;
  topN?: number;
  showTooltips?: boolean;
  logScale?: boolean;
  unitFormat?: 'auto' | 'raw' | 'thousands' | 'millions' | 'billions' | 'percentage' | 'currency';
  fontSize?: number;
  fontFamily?: string;
  chartColor?: string;
}

// ----------------------------------------------------
// 2. EXECUTIVE DASHBOARD & MACRO KPI CONTRACTS
// ----------------------------------------------------

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

// ----------------------------------------------------
// 3. STATISTICAL & MODEL DIAGNOSTICS CONTRACTS
// ----------------------------------------------------

export type FitVerdict = 'Overfitting' | 'Underfitting' | 'Good Fit';

export interface FitDiagnosis {
  verdict: FitVerdict;
  severity: 'None' | 'Moderate' | 'High';
  train_r2: number;
  test_r2: number;
  generalization_gap: number;
  explanation: string;
  recommendation: string;
}

export interface SplitMetrics {
  n: number;
  r2: number;
  rmse: number;
  mae: number;
}

export interface LearningCurvePoint {
  train_size: number;
  train_rmse: number;
  validation_rmse: number;
  train_r2: number;
  validation_r2: number;
}

export interface ComplexityCurvePoint {
  degree: number;
  train_r2: number;
  validation_r2: number;
  train_rmse: number;
  validation_rmse: number;
  gap: number;
}

export interface ScatterPoint {
  x: number;
  actual: number;
  predicted: number;
  split: 'train' | 'holdout';
}

export interface ResidualPoint {
  predicted: number;
  residual: number;
  split: 'train' | 'holdout';
}

export interface ModelDiagnosticsResponse {
  feature_col: string;
  target_col: string;
  train_metrics: SplitMetrics;
  test_metrics: SplitMetrics;
  generalization_gap: number;
  diagnosis: FitDiagnosis;
  learning_curve: LearningCurvePoint[];
  complexity_curve: ComplexityCurvePoint[];
  scatter_data: ScatterPoint[];
  residuals: ResidualPoint[];
  cross_validation?: {
    k_folds: number;
    mean_r2: number;
    std_r2: number;
    scores: number[];
  };
}

// ----------------------------------------------------
// 4. USER DATASET PERSISTENCE CONTRACTS
// ----------------------------------------------------

export interface UserDatasetEntry {
  dataset_id: string;
  table_name: string;
  display_name: string;
  row_count: number;
  column_count: number;
  quality_score: number | null;
  created_at?: string;
}

export interface PersistResult extends Partial<UserDatasetEntry> {
  success: boolean;
  detail?: string;
}

// ----------------------------------------------------
// 5. ARCHITECTURE INTROSPECTION CONTRACTS
// ----------------------------------------------------

export interface ArchitectureStageStatus {
  status: string;
  description: string;
}

export interface ArchitecturePipelineOverview {
  success: boolean;
  status: string;
  stages: Record<string, ArchitectureStageStatus>;
}
