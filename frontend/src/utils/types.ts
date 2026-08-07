/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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

// Represents a dataset preloaded from the server filesystem (Excel files)
// and stored permanently in SQLite for fast subsequent retrieval.
export interface PreloadedDataset {
  key: 'dataset_1' | 'dataset_2' | 'dataset_3';
  label: string;           // e.g. "Dataset 1"
  name: string;            // Friendly display name
  filePath: string;        // Absolute server-side path to original Excel file
  rows: number;
  cols: number;
  fileSize: string;        // e.g. "142 KB"
  memoryUsage: string;     // e.g. "2.1 MB"
  missingValues: number;
  duplicates: number;
  dataTypes: string[];     // e.g. ["Fiscal Year (categorical)", "Province (categorical)", ...]
  loadStatus: 'success' | 'error';
  errorMessage?: string;
  fields: { name: string; type: 'numeric' | 'categorical' | 'date' | 'boolean' | 'text' }[];
  data: Record<string, any>[];

  // SQLite-specific metadata
  sourceTable: string;     // SQLite table name (e.g. "top_10_main_problems")
  dbStatus: 'sqlite' | 'excel_import' | 'unavailable'; // How data was retrieved
  importedAt?: string;     // ISO timestamp when data was imported into SQLite
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
    share: number; // 0 to 1 font percentage
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
  
  // Custom Formatting Pane Options
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
