'use client';

import React, { useEffect, useState } from 'react';
import { fetchHealth, fetchMemory, fetchKnowledgeGraph, fetchFailures } from '@/lib/api';
import {
  LayoutDashboard,
  Play,
  Cpu,
  Database,
  Network,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Activity,
  Layers,
} from 'lucide-react';

interface DashboardViewProps {
  onNavigateExecute: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigateExecute }) => {
  const [health, setHealth] = useState('checking');
  const [tracesCount, setTracesCount] = useState(0);
  const [triplesCount, setTriplesCount] = useState(0);
  const [failuresCount, setFailuresCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      const h = await fetchHealth();
      setHealth(h.status);

      const mem = await fetchMemory().catch(() => null);
      if (mem?.traces) setTracesCount(Object.keys(mem.traces).length);

      const kg = await fetchKnowledgeGraph().catch(() => []);
      setTriplesCount(kg.length);

      const fail = await fetchFailures().catch(() => []);
      setFailuresCount(fail.length);
    };
    load();
  }, []);

  return (
    <div className="flex-1 p-6 space-y-6 overflow-auto h-[calc(100vh-3.5rem)]">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-zinc-800/80 bg-gradient-to-r from-zinc-900 via-zinc-950 to-zinc-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>SYMPHONY HARNESS OS DASHBOARD</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            Autonomous Engineering Control Plane
          </h2>
          <p className="text-xs text-zinc-400 font-mono">
            Model-agnostic orchestration platform coordinating 7 specialized harnesses.
          </p>
        </div>

        <button
          onClick={onNavigateExecute}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-indigo-600 text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 hover:scale-[1.02] transition-all"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Launch Prompt Execution</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-xl border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
            <span>REGISTERED HARNESSES</span>
            <Cpu className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">7</div>
          <div className="text-[10px] font-mono text-emerald-400">Spec, Research, Arch, Eng, Eval, Deploy, Learn</div>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
            <span>MEMORY TRACES</span>
            <Database className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold text-cyan-400">{tracesCount}</div>
          <div className="text-[10px] font-mono text-zinc-400">Recorded execution trace sessions</div>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
            <span>KNOWLEDGE TRIPLES</span>
            <Network className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-extrabold text-indigo-400">{triplesCount}</div>
          <div className="text-[10px] font-mono text-zinc-400">Semantic graph facts</div>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
            <span>SYSTEM HEALTH</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 capitalize">{health}</div>
          <div className="text-[10px] font-mono text-zinc-400">FastAPI REST Backend Status</div>
        </div>
      </div>

      {/* Control Plane Modules Overview */}
      <div className="glass-panel p-6 rounded-2xl border border-zinc-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          Registered Core Control Plane Pipeline
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { title: 'Intent Analyzer', desc: 'Parses requests and identifies engineering intent' },
            { title: 'Harness Router', desc: 'Routes intent into ordered domain sequences' },
            { title: 'Harness Selector', desc: 'Queries registry for active harnesses' },
            { title: 'Execution Planner', desc: 'Compiles sequential execution DAG strategies' },
            { title: 'Context Manager', desc: 'Aggregates shared memory into run contexts' },
            { title: 'Execution Engine', desc: 'Executes harnesses & propagates state updates' },
          ].map((item, idx) => (
            <div key={idx} className="bg-zinc-900/80 p-3.5 rounded-xl border border-zinc-800 space-y-1">
              <div className="text-xs font-bold text-emerald-400">{item.title}</div>
              <div className="text-[11px] text-zinc-400 leading-normal">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
