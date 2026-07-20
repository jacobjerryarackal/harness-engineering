'use client';

import React, { useState } from 'react';
import { executeGoal, ExecuteResponse, API_BASE_URL } from '@/lib/api';
import { RealtimeFlow, NodeStateMap } from './RealtimeFlow';
import { RightPanel } from './RightPanel';
import { Play, Sparkles, AlertCircle, RotateCcw } from 'lucide-react';

const DOMAIN_TO_NODE_ID: Record<string, string> = {
  SPECIFICATION: 'spec-harness',
  RESEARCH: 'research-harness',
  ARCHITECTURE: 'arch-harness',
  ENGINEERING: 'eng-harness',
  EVALUATION: 'eval-harness',
  DEPLOYMENT: 'deploy-harness',
  LEARNING: 'learn-harness',
};

export const ExecuteView: React.FC = () => {
  const [prompt, setPrompt] = useState('Design and implement a JWT Authentication Service');
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<ExecuteResponse | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [nodeStates, setNodeStates] = useState<NodeStateMap>({});

  const samplePrompts = [
    'Design and implement a JWT Authentication Service',
    'Write spec, research architecture, implement and test a Python module',
    'Deploy and evaluate high performance microservice',
    'Analyze system failure and perform learning updates',
  ];

  const handleExecute = async () => {
    if (!prompt.trim() || isRunning) return;

    setIsRunning(true);
    setError(null);
    setResponse(null);
    setLogs(['[System] Initiating Symphony Harness Operating System...']);
    setNodeStates({});

    try {
      // 1. Invoke Backend Execution API
      const res = await executeGoal({ request_text: prompt });
      setResponse(res);

      // 2. Control Plane Animation Sequence
      const controlPlaneNodes = [
        'intent-analyzer',
        'harness-router',
        'harness-selector',
        'execution-planner',
      ];

      for (const nodeId of controlPlaneNodes) {
        setNodeStates((prev) => ({ ...prev, [nodeId]: 'running' }));
        setLogs((prev) => [...prev, `[Control Plane] Executing ${nodeId}...`]);
        await new Promise((r) => setTimeout(r, 200));
        setNodeStates((prev) => ({ ...prev, [nodeId]: res.success ? 'success' : 'failure' }));
      }

      // 3. Harness Layer Animation Sequence (Only participated harnesses)
      const selectedDomains = res.selected_harnesses || [];
      const participatedHarnessNodeIds: string[] = [];

      for (const domain of selectedDomains) {
        const nodeId = DOMAIN_TO_NODE_ID[domain.toUpperCase()];
        if (nodeId && !participatedHarnessNodeIds.includes(nodeId)) {
          participatedHarnessNodeIds.push(nodeId);
          setNodeStates((prev) => ({ ...prev, [nodeId]: 'running' }));
          setLogs((prev) => [...prev, `[Harness Layer] Executing ${domain} harness...`]);
          await new Promise((r) => setTimeout(r, 250));
          setNodeStates((prev) => ({ ...prev, [nodeId]: res.success ? 'success' : 'failure' }));
        }
      }

      // 4. Post-Processing Animation Sequence
      const postProcessingNodes = [
        'deploy-harness',
        'learn-harness',
        'telemetry-node',
        'knowledge-graph-node',
        'memory-update-node',
      ];

      for (const nodeId of postProcessingNodes) {
        if (!participatedHarnessNodeIds.includes(nodeId)) {
          setNodeStates((prev) => ({ ...prev, [nodeId]: 'running' }));
          setLogs((prev) => [...prev, `[Post-Processing] Running ${nodeId}...`]);
          await new Promise((r) => setTimeout(r, 200));
          setNodeStates((prev) => ({ ...prev, [nodeId]: res.success ? 'success' : 'failure' }));
        }
      }

      // 5. Append runtime telemetry logs if present
      if (res.telemetry_summary?.logs) {
        setLogs((prev) => [...prev, ...res.telemetry_summary.logs]);
      }

      setLogs((prev) => [...prev, `[System] Execution finished successfully. All artifacts compiled.`]);
    } catch (err: any) {
      const isNetworkError = err.name === 'TypeError' || err.message?.includes('fetch') || err.message?.includes('Failed to fetch');
      const errorMessage = isNetworkError
        ? `Unable to connect to Symphony Control Plane API (${API_BASE_URL}). Please verify the backend server is running.`
        : (err.message || 'Execution error');
      setError(errorMessage);
      setLogs((prev) => [...prev, `[System Error] ${errorMessage}`]);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 gap-4 overflow-hidden h-[calc(100vh-3.5rem)]">
      {/* Top Prompt Controls Bar */}
      <div className="glass-panel p-4 rounded-xl border border-zinc-800 space-y-3 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-mono text-xs text-zinc-300">
            <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="font-bold">ENGINEERING INTENT PROMPT</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {samplePrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => setPrompt(p)}
                className="text-[10px] font-mono px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 transition-all"
              >
                Sample 0{i + 1}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your engineering goal (e.g. Design and implement a JWT Authentication Service)..."
            className="flex-1 bg-zinc-950 border border-zinc-800 focus:border-emerald-500 rounded-lg px-4 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none transition-all font-mono"
            onKeyDown={(e) => e.key === 'Enter' && handleExecute()}
          />
          <button
            onClick={handleExecute}
            disabled={isRunning || !prompt.trim()}
            className="px-6 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-zinc-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
          >
            {isRunning ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin" />
                <span>Orchestrating...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Execute</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-rose-400 text-xs font-mono bg-rose-500/10 p-2.5 rounded border border-rose-500/20">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Main Split: Control Plane Flow Visualizer (Left) vs Right Panel (Right) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0 overflow-hidden">
        {/* React Flow Control Plane Graph */}
        <div className="lg:col-span-7 h-full flex flex-col min-h-0">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-mono text-zinc-400">REAL-TIME CONTROL PLANE FLOW</span>
            <span className="text-[10px] font-mono text-emerald-400">REACT FLOW INTERACTIVE GRAPH</span>
          </div>
          <div className="flex-1 min-h-0">
            <RealtimeFlow nodeStates={nodeStates} />
          </div>
        </div>

        {/* Right Panel for Artifacts, Logs, JSON, Telemetry */}
        <div className="lg:col-span-5 h-full flex flex-col min-h-0">
          <RightPanel response={response} isRunning={isRunning} logs={logs} />
        </div>
      </div>
    </div>
  );
};
