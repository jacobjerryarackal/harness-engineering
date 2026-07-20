'use client';

import React, { useEffect, useState } from 'react';
import { fetchKnowledgeGraph, KnowledgeTriple } from '@/lib/api';
import { Network, Search, RefreshCw, ArrowRight, Database, Tag } from 'lucide-react';

export const KnowledgeGraphView: React.FC = () => {
  const [triples, setTriples] = useState<KnowledgeTriple[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchKnowledgeGraph();
      setTriples(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredTriples = triples.filter(
    (t) =>
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.predicate.toLowerCase().includes(search.toLowerCase()) ||
      t.obj.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 p-6 space-y-6 overflow-auto h-[calc(100vh-3.5rem)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Network className="w-6 h-6 text-cyan-400" />
            Semantic Knowledge Graph
          </h2>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            Subject-Predicate-Object Triples • Shared Organizational Intelligence
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search triples..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-cyan-500 font-mono"
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

      {/* Triples Visual Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTriples.length > 0 ? (
          filteredTriples.map((t, idx) => (
            <div
              key={idx}
              className="glass-panel p-4 rounded-xl border border-zinc-800 hover:border-cyan-500/40 transition-all space-y-3"
            >
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                <span className="text-[10px] font-mono text-zinc-500 uppercase">Fact Triple #0{idx + 1}</span>
                {t.metadata?.type && (
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                    {t.metadata.type}
                  </span>
                )}
              </div>

              {/* Subject -> Predicate -> Object Flow */}
              <div className="flex items-center justify-between gap-2 bg-zinc-950/80 p-3 rounded-lg border border-zinc-800/80 font-mono text-xs">
                <div className="text-emerald-400 font-bold truncate max-w-[90px]">{t.subject}</div>
                <div className="flex items-center gap-1 text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  <span>{t.predicate}</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
                <div className="text-indigo-300 font-bold truncate max-w-[90px]">{t.obj}</div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-16 text-zinc-500 font-mono text-xs">
            <Network className="w-10 h-10 mx-auto mb-2 opacity-40" />
            No triples found matching search criteria. Run a prompt to populate facts.
          </div>
        )}
      </div>
    </div>
  );
};
