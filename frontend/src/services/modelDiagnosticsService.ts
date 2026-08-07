/**
 * Healthcare Analytics Platform - Model Diagnostics Client
 *
 * Overfitting / underfitting assessment of the post-cleaning dataset. Computation runs in
 * the FastAPI backend (backend/analytics/statistics/model_validation.py); the Express
 * server proxies /api/model-diagnostics/* through to it.
 */

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

export interface DataQuality {
  total_rows: number;
  usable_rows: number;
  dropped_missing: number;
  dropped_non_numeric: number;
  usable_ratio: number;
}

export interface CrossValidation {
  fold_scores: number[];
  mean_r2: number;
  std_r2: number;
  k: number;
}

export interface FitDiagnosticsResult {
  success: boolean;
  status: 'ok' | 'insufficient_data' | 'invalid_request' | 'backend_offline' | 'proxy_error';
  message?: string;
  feature?: string;
  target?: string;
  degree?: number;
  test_ratio?: number;
  data_quality?: DataQuality;
  diagnosis?: FitDiagnosis | null;
  metrics?: { train: SplitMetrics; holdout: SplitMetrics };
  learning_curve?: LearningCurvePoint[];
  complexity_curve?: ComplexityCurvePoint[];
  optimal_degree?: number;
  cross_validation?: CrossValidation;
  scatter?: ScatterPoint[];
  residuals?: ResidualPoint[];
}

const DIAGNOSTICS_BASE = '/api/model-diagnostics';

/** Numeric columns in the cleaned dataset that can act as a feature or target. */
export async function fetchModelableColumns(records: any[]): Promise<string[]> {
  const response = await fetch(`${DIAGNOSTICS_BASE}/columns`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ records })
  });
  if (!response.ok) return [];
  const data = await response.json();
  return data.columns || [];
}

/** Assess whether a model fitted on the cleaned data over- or underfits. */
export async function assessModelFit(
  records: any[],
  feature: string,
  target: string,
  degree = 1,
  testRatio = 0.3
): Promise<FitDiagnosticsResult> {
  const response = await fetch(`${DIAGNOSTICS_BASE}/assess`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ records, feature, target, degree, test_ratio: testRatio })
  });
  return response.json();
}
