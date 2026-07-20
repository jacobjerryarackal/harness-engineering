'use client';

import React, { useEffect, useState } from 'react';
import { fetchMemory, MemoryData } from '@/lib/api';
import { Database, Search, RefreshCw, Terminal, Layers, FileCode } from 'lucide-react';

export const MemoryView: React.FC = () => {
  const [data, setData] = useState<MemoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchMemory();
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const tracesMap = data?.traces || {};
  const contextVars = Object.entries(data?.context_variables || {}).filter(
    ([k, v]) =>
      k.toLowerCase().includes(search.toLowerCase()) ||
      JSON.stringify(v).toLowerCase().includes(search.toLowerCase())
  );
  const projectState = Object.entries(data?.project_state || {}).filter(
    ([k, v]) =>
      k.toLowerCase().includes(search.toLowerCase()) ||
      JSON.stringify(v).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 p-6 space-y-6 overflow-auto h-[calc(100vh-3.5rem)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Database className="w-6 h-6 text-emerald-400" />
            Shared Core Memory
          </h2>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            Execution Traces • Session Context • Project Workspace State
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search memory..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>
          <button
            onClick={loadData}
            className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Session Context Variables */}
        <div className="glass-panel p-5 rounded-xl border border-zinc-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              Session Context
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {contextVars.length} Keys
            </span>
          </div>

          <div className="space-y-2 max-h-[350px] overflow-auto pr-1">
            {contextVars.length > 0 ? (
              contextVars.map(([k, v]) => (
                <div key={k} className="bg-zinc-900/80 p-3 rounded-lg border border-zinc-800 font-mono text-xs space-y-1">
                  <div className="text-cyan-400 font-semibold text-[11px]">{k}</div>
                  <div className="text-zinc-300 text-[11px] break-all">{JSON.stringify(v)}</div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-zinc-500 text-xs font-mono">No active session context variables.</div>
            )}
          </div>
        </div>

        {/* Workspace State */}
        <div className="glass-panel p-5 rounded-xl border border-zinc-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileCode className="w-4 h-4 text-indigo-400" />
              Workspace State
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {projectState.length} Variables
            </span>
          </div>

          <div className="space-y-2 max-h-[350px] overflow-auto pr-1">
            {projectState.length > 0 ? (
              projectState.map(([k, v]) => (
                <div key={k} className="bg-zinc-900/80 p-3 rounded-lg border border-zinc-800 font-mono text-xs space-y-1">
                  <div className="text-indigo-400 font-semibold text-[11px]">{k}</div>
                  <div className="text-zinc-300 text-[11px] break-all">{JSON.stringify(v)}</div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-zinc-500 text-xs font-mono">No workspace state records.</div>
            )}
          </div>
        </div>

        {/* Execution Traces */}
        <div className="glass-panel p-5 rounded-xl border border-zinc-800/80 space-y-4 md:col-span-1">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              Memory Traces Log
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {Object.keys(tracesMap).length} Runs
            </span>
          </div>

          <div className="space-y-3 max-h-[350px] overflow-auto pr-1 font-mono text-xs">
            {Object.entries(tracesMap).length > 0 ? (
              Object.entries(tracesMap).map(([runId, logs]) => (
                <div key={runId} className="bg-zinc-900/80 p-3 rounded-lg border border-zinc-800 space-y-1.5">
                  <div className="text-emerald-400 font-bold text-[11px] flex items-center justify-between">
                    <span>Run: {runId}</span>
                    <span className="text-[9px] text-zinc-500">{logs.length} logs</span>
                  </div>
                  <div className="space-y-1 pl-1 text-[10px] text-zinc-400">
                    {logs.map((log, idx) => (
                      <div key={idx} className="truncate">• {log}</div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-zinc-500 text-xs font-mono">No execution traces recorded.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
