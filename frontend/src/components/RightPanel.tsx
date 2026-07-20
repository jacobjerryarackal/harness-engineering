'use client';

import React, { useState } from 'react';
import { ExecuteResponse } from '@/lib/api';
import {
  Activity,
  Layers,
  CheckSquare,
  Lightbulb,
  Network,
  Terminal,
  FileText,
  Copy,
  Check,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Cpu,
  Database,
  Info,
} from 'lucide-react';

interface RightPanelProps {
  response: ExecuteResponse | null;
  isRunning: boolean;
  logs: string[];
}

type TabKey = 'summary' | 'plan' | 'harnesses' | 'learning' | 'knowledge' | 'runtime' | 'json';

const HARNESS_EXPLANATIONS: Record<string, string> = {
  SPECIFICATION: 'Selected to analyze requirements, extract constraints, and compile formal spec documents.',
  RESEARCH: 'Selected to investigate technical patterns, external libraries, and architecture precedents.',
  ARCHITECTURE: 'Selected to design component blueprints, interface contracts, and schema boundaries.',
  ENGINEERING: 'Selected to coordinate code implementation, module generation, and file writing.',
  EVALUATION: 'Selected to execute verification test suites, assess compliance, and validate output quality.',
  DEPLOYMENT: 'Selected to package runtime deployment artifacts and trigger target environment execution.',
  LEARNING: 'Selected to parse post-mortem feedback, extract events, and update organizational memory.',
};

export const RightPanel: React.FC<RightPanelProps> = ({
  response,
  isRunning,
  logs,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('summary');
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const selectedHarnesses = response?.selected_harnesses || [];
  const executionPlan = response?.execution_plan || [];
  const learningUpdates = response?.learning_updates || [];
  const knowledgeTriples = learningUpdates.filter((u) => u.action === 'ADD_TRIPLE');
  const generatedFilesCount = Object.keys(response?.execution_artifacts?.generated_files || {}).length;

  return (
    <div className="w-full h-full flex flex-col glass-panel rounded-xl border border-zinc-800/80 overflow-hidden">
      {/* Header Tabs Navigation (Scrollable) */}
      <div className="flex items-center px-2 py-2 bg-zinc-950/90 border-b border-zinc-800/80 overflow-x-auto no-scrollbar gap-1">
        {[
          { id: 'summary', label: 'Summary', icon: Activity, color: 'text-emerald-400' },
          { id: 'plan', label: 'Execution Plan', icon: Layers, color: 'text-cyan-400' },
          { id: 'harnesses', label: 'Harnesses', icon: CheckSquare, color: 'text-purple-400' },
          { id: 'learning', label: 'Learning Report', icon: Lightbulb, color: 'text-amber-400' },
          { id: 'knowledge', label: 'Knowledge Updates', icon: Network, color: 'text-blue-400' },
          { id: 'runtime', label: 'Runtime Report', icon: Terminal, color: 'text-rose-400' },
          { id: 'json', label: 'JSON', icon: FileText, color: 'text-zinc-400' },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabKey)}
              className={`px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
                isActive
                  ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${tab.color}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Body */}
      <div className="flex-1 overflow-auto p-4 bg-zinc-950/60 font-mono text-xs">
        {!response && !isRunning && (
          <div className="h-full flex flex-col items-center justify-center text-center text-zinc-500 py-16">
            <Layers className="w-10 h-10 mb-3 opacity-30 text-emerald-400" />
            <p className="text-sm font-semibold text-zinc-300">Control Plane Ready</p>
            <p className="text-xs text-zinc-500 max-w-xs mt-1 font-sans">
              Enter an engineering intent prompt above to execute the Symphony orchestration pipeline and generate real-time runtime artifacts.
            </p>
          </div>
        )}

        {/* 1. Execution Summary */}
        {activeTab === 'summary' && (
          <div className="space-y-4">
            {response ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                  <span className="text-xs font-bold text-zinc-200">ORCHESTRATION EXECUTION SUMMARY</span>
                  <span className="text-[10px] text-zinc-500 font-mono">Run ID: {response.run_id}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="glass-panel p-3 rounded-lg border border-zinc-800 bg-zinc-900/40">
                    <div className="text-[10px] text-zinc-400">EXECUTION STATUS</div>
                    <div className="text-sm font-bold text-emerald-400 flex items-center gap-1.5 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                      {response.success ? 'SUCCESS' : 'FAILED'}
                    </div>
                  </div>

                  <div className="glass-panel p-3 rounded-lg border border-zinc-800 bg-zinc-900/40">
                    <div className="text-[10px] text-zinc-400">SELECTED HARNESSES</div>
                    <div className="text-sm font-bold text-purple-300 mt-0.5">
                      {selectedHarnesses.length} Participated
                    </div>
                  </div>

                  <div className="glass-panel p-3 rounded-lg border border-zinc-800 bg-zinc-900/40">
                    <div className="text-[10px] text-zinc-400">EVIDENCE ARTIFACTS</div>
                    <div className="text-sm font-bold text-cyan-300 mt-0.5">
                      {generatedFilesCount} Evidence Items
                    </div>
                  </div>

                  <div className="glass-panel p-3 rounded-lg border border-zinc-800 bg-zinc-900/40">
                    <div className="text-[10px] text-zinc-400">KNOWLEDGE TRIPLES</div>
                    <div className="text-sm font-bold text-amber-300 mt-0.5">
                      +{knowledgeTriples.length} Added
                    </div>
                  </div>
                </div>

                <div className="glass-panel p-3 rounded-lg border border-zinc-800 bg-zinc-900/40 space-y-2">
                  <div className="text-[10px] text-zinc-400 uppercase font-bold">ANALYZED INTENT</div>
                  <div className="text-xs text-emerald-300 bg-zinc-950 p-2 rounded border border-zinc-800">
                    Type: <span className="font-bold">{response.intent.intent_type}</span>
                  </div>
                </div>
              </div>
            ) : isRunning ? (
              <div className="text-center py-12 text-zinc-400 animate-pulse">Orchestrating intent pipeline...</div>
            ) : null}
          </div>
        )}

        {/* 2. Execution Plan */}
        {activeTab === 'plan' && (
          <div className="space-y-3">
            <div className="text-xs font-bold text-zinc-200 border-b border-zinc-800/80 pb-2 flex items-center justify-between">
              <span>CONTROL PLANE EXECUTION DAG</span>
              <span className="text-[10px] text-cyan-400">DETERMINISTIC PIPELINE</span>
            </div>

            <div className="space-y-1.5">
              {[
                { name: '1. Intent Analysis', desc: 'Parses user prompt and identifies domain requirements' },
                { name: '2. Harness Routing', desc: 'Sequences domains into canonical dependency order' },
                { name: '3. Harness Selection', desc: 'Queries HarnessRegistry for active domain implementations' },
              ].map((step, idx) => (
                <div key={idx} className="p-2 rounded bg-zinc-900/80 border border-zinc-800 text-[11px] flex justify-between items-center">
                  <div>
                    <span className="font-bold text-cyan-300">{step.name}</span>
                    <p className="text-[10px] text-zinc-500 font-sans mt-0.5">{step.desc}</p>
                  </div>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono">COMPLETE</span>
                </div>
              ))}

              {executionPlan.map((step, idx) => (
                <div key={idx} className="p-2 rounded bg-zinc-900 border border-purple-500/30 text-[11px] flex justify-between items-center">
                  <div>
                    <span className="font-bold text-purple-300">{idx + 4}. Harness: {step.domain}</span>
                    <p className="text-[10px] text-zinc-400 font-mono mt-0.5">Step ID: {step.step_id}</p>
                  </div>
                  <span className="text-[9px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded font-mono">EXECUTED</span>
                </div>
              ))}

              {[
                { name: 'Deployment', desc: 'Simulates target runtime artifact execution' },
                { name: 'Learning Engine', desc: 'Extracts telemetry events and updates memory' },
                { name: 'Telemetry Collector', desc: 'Captures logs, exit codes, and process metrics' },
                { name: 'Knowledge Graph', desc: 'Stores semantic RDF triples for platform reuse' },
                { name: 'Memory Update', desc: 'Commits state updates to shared core services' },
              ].map((step, idx) => (
                <div key={idx} className="p-2 rounded bg-zinc-900/80 border border-zinc-800 text-[11px] flex justify-between items-center">
                  <div>
                    <span className="font-bold text-amber-300">{idx + 4 + executionPlan.length}. {step.name}</span>
                    <p className="text-[10px] text-zinc-500 font-sans mt-0.5">{step.desc}</p>
                  </div>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono">COMPLETE</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. Harness Selection */}
        {activeTab === 'harnesses' && (
          <div className="space-y-3">
            <div className="text-xs font-bold text-zinc-200 border-b border-zinc-800/80 pb-2 flex items-center justify-between">
              <span>PARTICIPATING HARNESS REGISTRY</span>
              <span className="text-[10px] text-purple-400">{selectedHarnesses.length} HARNESSES SELECTED</span>
            </div>

            {selectedHarnesses.map((harness, idx) => (
              <div key={idx} className="glass-panel p-3 rounded-lg border border-purple-500/30 bg-purple-950/20 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-200 text-xs flex items-center gap-1.5">
                    <CheckSquare className="w-3.5 h-3.5 text-purple-400" />
                    {harness} HARNESS
                  </span>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono">ACTIVE</span>
                </div>
                <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
                  {HARNESS_EXPLANATIONS[harness.toUpperCase()] || 'Selected to coordinate engineering execution for this domain.'}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* 4. Learning Report */}
        {activeTab === 'learning' && (
          <div className="space-y-3">
            <div className="text-xs font-bold text-zinc-200 border-b border-zinc-800/80 pb-2 flex items-center justify-between">
              <span>RUNTIME LEARNING REPORT</span>
              <span className="text-[10px] text-amber-400">{learningUpdates.length} MEMORY UPDATES</span>
            </div>

            <div className="space-y-2">
              {learningUpdates.map((update, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-300 text-xs flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                      Action: {update.action}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">Update #{idx + 1}</span>
                  </div>
                  <div className="text-[11px] text-zinc-300 space-y-0.5">
                    {update.subject && <div><span className="text-zinc-500">Subject:</span> {update.subject}</div>}
                    {update.predicate && <div><span className="text-zinc-500">Predicate:</span> {update.predicate}</div>}
                    {update.obj && <div><span className="text-zinc-500">Object:</span> {update.obj}</div>}
                    {update.error_message && <div><span className="text-rose-400">Error:</span> {update.error_message}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. Knowledge Updates */}
        {activeTab === 'knowledge' && (
          <div className="space-y-3">
            <div className="text-xs font-bold text-zinc-200 border-b border-zinc-800/80 pb-2 flex items-center justify-between">
              <span>NEW SEMANTIC KNOWLEDGE TRIPLES</span>
              <span className="text-[10px] text-blue-400">RDF TRIPLE STORE</span>
            </div>

            {knowledgeTriples.length > 0 ? (
              knowledgeTriples.map((triple, idx) => (
                <div key={idx} className="glass-panel p-3 rounded-lg border border-blue-500/30 bg-blue-950/20 space-y-1.5 font-mono text-[11px]">
                  <div className="text-blue-300 font-bold flex items-center gap-1.5">
                    <Network className="w-3.5 h-3.5 text-blue-400" />
                    Triple #{idx + 1}
                  </div>
                  <div className="bg-zinc-950 p-2 rounded border border-zinc-800 space-y-1 text-zinc-300">
                    <div><span className="text-zinc-500">Subject:</span> <span className="text-white font-bold">{triple.subject}</span></div>
                    <div><span className="text-zinc-500">Predicate:</span> <span className="text-blue-300">{triple.predicate}</span></div>
                    <div><span className="text-zinc-500">Object:</span> <span className="text-emerald-300">{triple.obj}</span></div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-zinc-500">
                <Network className="w-8 h-8 mx-auto mb-2 opacity-50" />
                No knowledge triples generated for this run.
              </div>
            )}
          </div>
        )}

        {/* 6. Runtime Report */}
        {activeTab === 'runtime' && (
          <div className="space-y-3">
            <div className="text-xs font-bold text-zinc-200 border-b border-zinc-800/80 pb-2 flex items-center justify-between">
              <span>PRODUCTION RUNTIME & TELEMETRY</span>
              <span className="text-[10px] text-rose-400">RUNTIME REPORT</span>
            </div>

            {response?.telemetry_summary ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="glass-panel p-3 rounded-lg border border-zinc-800 bg-zinc-900/40">
                    <div className="text-[10px] text-zinc-400">STATUS</div>
                    <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {response.telemetry_summary.status}
                    </div>
                  </div>
                  <div className="glass-panel p-3 rounded-lg border border-zinc-800 bg-zinc-900/40">
                    <div className="text-[10px] text-zinc-400">EXIT CODE</div>
                    <div className="text-xs font-bold text-white mt-0.5">
                      {response.telemetry_summary.exit_code}
                    </div>
                  </div>
                </div>

                {response.telemetry_summary.metrics && (
                  <div className="glass-panel p-3 rounded-lg border border-zinc-800 space-y-1">
                    <div className="text-[10px] text-zinc-400 uppercase font-bold">RUNTIME METRICS</div>
                    {Object.entries(response.telemetry_summary.metrics).map(([k, v]) => (
                      <div key={k} className="flex justify-between text-xs font-mono py-0.5 border-b border-zinc-900">
                        <span className="text-zinc-400">{k}:</span>
                        <span className="text-emerald-300 font-bold">{String(v)}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="glass-panel p-3 rounded-lg border border-zinc-800 space-y-1.5">
                  <div className="text-[10px] text-zinc-400 uppercase font-bold">EXECUTION LOGS</div>
                  <div className="bg-zinc-950 p-2 rounded border border-zinc-800 space-y-1 max-h-40 overflow-y-auto">
                    {response.telemetry_summary.logs?.map((l, i) => (
                      <div key={i} className="text-[10px] text-zinc-300 font-mono">
                        {l}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-zinc-500">
                <Terminal className="w-8 h-8 mx-auto mb-2 opacity-50" />
                No runtime report available yet.
              </div>
            )}
          </div>
        )}

        {/* 7. Raw JSON Output */}
        {activeTab === 'json' && (
          <div className="relative glass-panel p-3 rounded-lg border border-zinc-800 bg-zinc-900/90 text-amber-300 overflow-x-auto">
            {response ? (
              <>
                <button
                  onClick={() => handleCopy(JSON.stringify(response, null, 2))}
                  className="absolute top-2 right-2 p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-all"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <pre className="text-[11px] leading-relaxed whitespace-pre-wrap font-mono">
                  {JSON.stringify(response, null, 2)}
                </pre>
              </>
            ) : (
              <div className="text-center py-12 text-zinc-500">
                <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                No JSON payload available.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
