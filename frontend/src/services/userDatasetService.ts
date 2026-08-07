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
const SESSION_KEY = 'ha-session-id';

/**
 * Opaque per-browser identifier scoping uploads to this session.
 *
 * Isolation, not authentication: the value is generated client-side and sent unverified,
 * so it can be forged. It stops users seeing each other's uploads by accident; it is not
 * a confidentiality control. See architecture.md §6.4.
 *
 * Persisted in localStorage so a refresh keeps the same identity — sessionStorage would
 * orphan every dataset the moment the tab closed.
 */
export function getSessionId(): string {
  try {
    let id = localStorage.getItem(SESSION_KEY);
    if (!id) {
      id = (crypto.randomUUID?.() ?? `sess-${Date.now()}-${Math.random().toString(36).slice(2)}`);
      localStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    // Private browsing can block localStorage. A per-page-load id still isolates this
    // caller from others; it just will not survive a refresh.
    return `sess-ephemeral-${Math.random().toString(36).slice(2)}`;
  }
}

function sessionHeaders(extra: Record<string, string> = {}): Record<string, string> {
  return { 'X-Session-Id': getSessionId(), ...extra };
}

/** Writes cleaned rows to their own table. Resolves with success:false rather than throwing. */
export async function persistCleanedDataset(
  records: any[],
  displayName: string,
  qualityScore?: number
): Promise<PersistResult> {
  try {
    const response = await fetch(BASE, {
      method: 'POST',
      headers: sessionHeaders({ 'Content-Type': 'application/json' }),
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
    const response = await fetch(BASE, { headers: sessionHeaders() });
    if (!response.ok) return [];
    return (await response.json()).datasets || [];
  } catch {
    return [];
  }
}

/** Rows for one persisted dataset. */
export async function fetchUserDataset(datasetId: string, limit = 1000) {
  const response = await fetch(
    `${BASE}/${encodeURIComponent(datasetId)}?limit=${limit}`,
    { headers: sessionHeaders() }
  );
  if (!response.ok) throw new Error(`Dataset ${datasetId} not found`);
  return response.json();
}

/** Drops a persisted dataset and its registry entry. */
export async function deleteUserDataset(datasetId: string): Promise<boolean> {
  const response = await fetch(`${BASE}/${encodeURIComponent(datasetId)}`, { method: 'DELETE', headers: sessionHeaders() });
  return response.ok;
}
