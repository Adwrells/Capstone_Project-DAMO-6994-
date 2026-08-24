/**
 * Healthcare Analytics Platform - API Service Client
 * Centralized HTTP client methods for interacting with FastAPI backend endpoints.
 */

const API_BASE_URL = '/api';

export async function fetchHealth(): Promise<{ status: string }> {
  const response = await fetch(`${API_BASE_URL}/health`);
  if (!response.ok) throw new Error('API Health check failed');
  return response.json();
}

export async function fetchDatasetsList(): Promise<string[]> {
  const response = await fetch(`${API_BASE_URL}/datasets`);
  if (!response.ok) throw new Error('Failed to fetch dataset list');
  const data = await response.json();
  return data.datasets || [];
}

export async function fetchDashboardKPIs(): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/dashboard/kpis`);
  if (!response.ok) throw new Error('Failed to fetch dashboard KPIs');
  return response.json();
}

export async function fetchDashboardSummary(): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/dashboard/summary`);
  if (!response.ok) throw new Error('Failed to fetch dashboard summary');
  return response.json();
}

export async function fetchDatasetSheets(): Promise<string[]> {
  const response = await fetch(`${API_BASE_URL}/dataset/sheets`);
  if (!response.ok) throw new Error('Failed to fetch worksheet names');
  return response.json();
}

export async function fetchDatasetSheetData(sheet: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/dataset/${encodeURIComponent(sheet)}`);
  if (!response.ok) throw new Error(`Failed to fetch worksheet data for ${sheet}`);
  return response.json();
}

export async function fetchDatasetSheetStats(sheet: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/dataset/statistics/${encodeURIComponent(sheet)}`);
  if (!response.ok) throw new Error(`Failed to fetch worksheet statistics for ${sheet}`);
  return response.json();
}

export async function fetchHypothesisResult(hypothesisId: 'h1' | 'h2' | 'h3' | 'h4' | 'h5'): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/statistics/${hypothesisId.toLowerCase()}`);
  if (!response.ok) throw new Error(`Failed to fetch ${hypothesisId.toUpperCase()} statistics`);
  return response.json();
}

export async function fetchStatisticsDashboard(): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/statistics/dashboard`);
  if (!response.ok) throw new Error('Failed to fetch statistics dashboard summary');
  return response.json();
}

export async function fetchStatisticalMethods(): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/statistics/methods`);
  if (!response.ok) throw new Error('Failed to fetch statistical methods');
  return response.json();
}

export async function fetchTrends(): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/statistics/trends`);
  if (!response.ok) throw new Error('Failed to fetch longitudinal trend analysis');
  return response.json();
}
