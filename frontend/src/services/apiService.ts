/**
 * Healthcare Analytics Platform - Centralized API Service Client
 *
 * Provides typed HTTP client methods for interacting with FastAPI backend
 * endpoints via the Express reverse proxy.
 */

import type { DashboardKPIs } from '../types/domain';

const API_BASE_URL = '/api';

/**
 * Checks backend API health status.
 */
export async function fetchHealth(): Promise<{ status: string; service?: string; version?: string }> {
  const response = await fetch(`${API_BASE_URL}/health`);
  if (!response.ok) throw new Error(`API Health check failed with status ${response.status}`);
  return response.json();
}

/**
 * Fetches the list of analytical datasets available in SQLite/Explorer.
 */
export async function fetchDatasetsList(): Promise<string[]> {
  const response = await fetch(`${API_BASE_URL}/datasets`);
  if (!response.ok) throw new Error(`Failed to fetch dataset list (${response.status})`);
  const data = await response.json();
  return data.datasets || [];
}

/**
 * Fetches computed Executive Dashboard macro KPIs.
 */
export async function fetchDashboardKPIs(): Promise<DashboardKPIs | any> {
  const response = await fetch(`${API_BASE_URL}/dashboard/kpis`);
  if (!response.ok) throw new Error(`Failed to fetch dashboard KPIs (${response.status})`);
  return response.json();
}

/**
 * Fetches aggregated summary payload for the Executive Dashboard.
 */
export async function fetchDashboardSummary(): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/dashboard/summary`);
  if (!response.ok) throw new Error(`Failed to fetch dashboard summary (${response.status})`);
  return response.json();
}

/**
 * Fetches dataset worksheets available in the preload catalog.
 */
export async function fetchDatasetSheets(): Promise<string[]> {
  const response = await fetch(`${API_BASE_URL}/dataset/sheets`);
  if (!response.ok) throw new Error(`Failed to fetch worksheet names (${response.status})`);
  return response.json();
}

/**
 * Fetches raw tabular data records for a specified dataset worksheet.
 */
export async function fetchDatasetSheetData(sheet: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/dataset/${encodeURIComponent(sheet)}`);
  if (!response.ok) throw new Error(`Failed to fetch worksheet data for ${sheet} (${response.status})`);
  return response.json();
}

/**
 * Fetches descriptive metrics and statistics for a specified worksheet.
 */
export async function fetchDatasetSheetStats(sheet: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/dataset/statistics/${encodeURIComponent(sheet)}`);
  if (!response.ok) throw new Error(`Failed to fetch worksheet statistics for ${sheet} (${response.status})`);
  return response.json();
}

/**
 * Executes or retrieves statistical hypothesis test results (H1 - H5).
 */
export async function fetchHypothesisResult(hypothesisId: 'h1' | 'h2' | 'h3' | 'h4' | 'h5'): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/statistics/${hypothesisId.toLowerCase()}`);
  if (!response.ok) throw new Error(`Failed to fetch ${hypothesisId.toUpperCase()} statistics (${response.status})`);
  return response.json();
}

/**
 * Fetches the consolidated hypothesis evidence hub summary.
 */
export async function fetchStatisticsDashboard(): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/statistics/dashboard`);
  if (!response.ok) throw new Error(`Failed to fetch statistics dashboard summary (${response.status})`);
  return response.json();
}

/**
 * Fetches the registry of statistical methods and mathematical specifications.
 */
export async function fetchStatisticalMethods(): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/statistics/methods`);
  if (!response.ok) throw new Error(`Failed to fetch statistical methods (${response.status})`);
  return response.json();
}

/**
 * Fetches longitudinal Mann-Kendall trend tests and ERBI time-series metrics.
 */
export async function fetchTrends(): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/statistics/trends`);
  if (!response.ok) throw new Error(`Failed to fetch longitudinal trend analysis (${response.status})`);
  return response.json();
}

/**
 * Fetches descriptive summary statistics for a given SQLite table or numeric array payload.
 */
export async function fetchSummaryStatistics(tableName: string = 'ED_Visits', payload?: Record<string, any>): Promise<any> {
  const url = `${API_BASE_URL}/statistics/summary?table_name=${encodeURIComponent(tableName)}`;
  const options: RequestInit = payload
    ? {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    : { method: 'GET' };

  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`Failed to fetch summary statistics (${response.status})`);
  return response.json();
}

/**
 * Fetches strategic consultant recommendations and bottleneck analysis.
 */
export async function fetchInsights(): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/insights`);
  if (!response.ok) throw new Error(`Failed to fetch consultant insights (${response.status})`);
  return response.json();
}

/**
 * Fetches standard analytics report templates and metadata.
 */
export async function fetchReports(): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/reports`);
  if (!response.ok) throw new Error(`Failed to fetch reports catalog (${response.status})`);
  return response.json();
}
