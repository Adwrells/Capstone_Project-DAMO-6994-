export interface ArchitectureStageStatus {
  status: string;
  description: string;
}

export interface ArchitecturePipelineOverview {
  success: boolean;
  status: string;
  stages: Record<string, ArchitectureStageStatus>;
}

export async function fetchArchitecturePipelineOverview(): Promise<ArchitecturePipelineOverview> {
  const response = await fetch('/api/architecture/pipeline');
  if (!response.ok) {
    throw new Error('Architecture pipeline overview request failed');
  }
  return response.json();
}
