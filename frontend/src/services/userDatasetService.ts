/**
 * Healthcare Analytics Platform - User Dataset Persistence Client
 *
 * Persists a user's cleaned dataset into SQLite so Explorer, Dashboard and Reports can read
 * it back from the database rather than only from React state.
 *
 * Each upload lands in its own isolated table. The seeded H1-H5 tables are never touched —
 * see architecture.md §4A.
 */

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

const BASE = '/api/user-datasets';

/** Writes cleaned rows to their own table. Resolves with success:false rather than throwing. */
export async function persistCleanedDataset(
  records: any[],
  displayName: string,
  qualityScore?: number
): Promise<PersistResult> {
  try {
    const response = await fetch(BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        records,
        display_name: displayName,
        quality_score: qualityScore ?? null
      })
    });

    if (!response.ok) {
      // The Python backend may simply not be running; that must not break the
      // cleaning workflow, which stays fully functional from React state alone.
      return { success: false, detail: `Persistence unavailable (HTTP ${response.status})` };
    }
    return await response.json();
  } catch {
    return { success: false, detail: 'Python analytics backend unreachable' };
  }
}

/** Every persisted dataset, newest first. */
export async function listUserDatasets(): Promise<UserDatasetEntry[]> {
  try {
    const response = await fetch(BASE);
    if (!response.ok) return [];
    return (await response.json()).datasets || [];
  } catch {
    return [];
  }
}

/** Rows for one persisted dataset. */
export async function fetchUserDataset(datasetId: string, limit = 1000) {
  const response = await fetch(`${BASE}/${encodeURIComponent(datasetId)}?limit=${limit}`);
  if (!response.ok) throw new Error(`Dataset ${datasetId} not found`);
  return response.json();
}

/** Drops a persisted dataset and its registry entry. */
export async function deleteUserDataset(datasetId: string): Promise<boolean> {
  const response = await fetch(`${BASE}/${encodeURIComponent(datasetId)}`, { method: 'DELETE' });
  return response.ok;
}
