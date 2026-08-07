/**
 * Healthcare Analytics Platform - API Service Client
 * Provides centralized HTTP methods for interacting with FastAPI backend endpoints.
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
