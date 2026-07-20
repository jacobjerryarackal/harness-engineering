'use client';

import React, { useEffect, useState } from 'react';
import { fetchFailures, FailureEntry } from '@/lib/api';
import { AlertTriangle, ShieldAlert, RefreshCw, CheckCircle2, Terminal } from 'lucide-react';

export const FailuresView: React.FC = () => {
  const [failures, setFailures] = useState<FailureEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchFailures();
      setFailures(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="flex-1 p-6 space-y-6 overflow-auto h-[calc(100vh-3.5rem)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-rose-400" />
            Failure Repository & Recovery
          </h2>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            Logged Runtime Errors • Component Failures • Learning Loop Outcomes
          </p>
        </div>
        <button
          onClick={loadData}
          className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Failure Cards */}
      <div className="space-y-4">
        {failures.length > 0 ? (
          failures.map((f, idx) => (
            <div key={idx} className="glass-panel p-5 rounded-xl border border-rose-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-rose-400" />
                  <span className="font-bold text-sm text-white">Component: {f.component}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    Run {f.run_id}
                  </span>
                </div>
                <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3" />
                  Processed by Learning Engine
                </div>
              </div>

              <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800 font-mono text-xs text-rose-300">
                <div className="text-[10px] text-zinc-500 mb-1 font-sans">ERROR MESSAGE</div>
                {f.error_message}
              </div>

              {f.stack_trace && (
                <div className="bg-zinc-950/80 p-3 rounded-lg border border-zinc-800 font-mono text-[11px] text-zinc-400 max-h-32 overflow-auto">
                  <div className="text-[10px] text-zinc-500 mb-1 flex items-center gap-1">
                    <Terminal className="w-3 h-3" /> STACK TRACE
                  </div>
                  <pre className="whitespace-pre-wrap">{f.stack_trace}</pre>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-20 glass-panel rounded-xl border border-zinc-800">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3 opacity-60" />
            <h3 className="font-bold text-white text-base">No System Failures Recorded</h3>
            <p className="text-xs text-zinc-400 font-mono max-w-sm mx-auto mt-1">
              All harnesses and production runtimes are operating without unhandled error incidents.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
