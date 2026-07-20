export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export interface ExecuteRequest {
  request_text: string;
  run_id?: string;
}

export interface ExecuteResponse {
  run_id: string;
  success: boolean;
  intent: {
    intent_type: string;
    required_domains: string[];
  };
  selected_harnesses: string[];
  execution_plan: Array<{
    step_id: string;
    domain: string;
  }>;
  execution_artifacts: {
    generated_files: Record<string, string>;
    test_results: Record<string, any>;
    deployment_status: string | null;
  };
  telemetry_summary: {
    run_id: string;
    status: string;
    exit_code: number;
    logs: string[];
    metrics: Record<string, any>;
  };
  learning_updates: Array<{
    action: string;
    [key: string]: any;
  }>;
}

export interface MemoryData {
  traces: Record<string, string[]>;
  context_variables: Record<string, any>;
  project_state: Record<string, any>;
}

export interface KnowledgeTriple {
  subject: string;
  predicate: string;
  obj: string;
  metadata: Record<string, any>;
}

export interface FailureEntry {
  run_id: string;
  component: string;
  error_message: string;
  stack_trace: string | null;
  timestamp: number;
}

export interface TelemetryEntry {
  run_id: string;
  status: string;
  exit_code: number;
  logs: string[];
  metrics: Record<string, any>;
  timestamp: number;
}

export async function fetchHealth(): Promise<{ status: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Backend unhealthy');
    return await res.json();
  } catch (err) {
    return { status: 'offline' };
  }
}

export async function executeGoal(payload: ExecuteRequest): Promise<ExecuteResponse> {
  const res = await fetch(`${API_BASE_URL}/execute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({ detail: 'Execution failed' }));
    throw new Error(errData.detail || 'Execution failed');
  }
  return await res.json();
}

export async function fetchMemory(): Promise<MemoryData> {
  const res = await fetch(`${API_BASE_URL}/memory`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch memory state');
  return await res.json();
}

export async function fetchKnowledgeGraph(): Promise<KnowledgeTriple[]> {
  const res = await fetch(`${API_BASE_URL}/knowledge-graph`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch knowledge graph');
  return await res.json();
}

export async function fetchFailures(): Promise<FailureEntry[]> {
  const res = await fetch(`${API_BASE_URL}/failures`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch failures');
  return await res.json();
}

export async function fetchTelemetry(): Promise<TelemetryEntry[]> {
  const res = await fetch(`${API_BASE_URL}/telemetry`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch telemetry');
  return await res.json();
}
