'use client';

import React, { useState } from 'react';
import { Settings, Server, Cpu, Shield, Save, Check } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';

export const SettingsView: React.FC = () => {
  const [apiUrl, setApiUrl] = useState(API_BASE_URL);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex-1 p-6 space-y-6 overflow-auto h-[calc(100vh-3.5rem)] max-w-4xl">
      {/* Header */}
      <div className="border-b border-zinc-800 pb-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-zinc-400" />
          Settings & Orchestration Configuration
        </h2>
        <p className="text-xs text-zinc-400 font-mono mt-1">
          FastAPI Endpoint • Model-Agnostic Settings • Policy Constraints
        </p>
      </div>

      <div className="space-y-6">
        {/* API Backend URL */}
        <div className="glass-panel p-5 rounded-xl border border-zinc-800 space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Server className="w-4 h-4 text-emerald-400" />
            <span>FastAPI Backend Connection</span>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-zinc-400">REST API Base URL</label>
            <input
              type="text"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-xs text-zinc-200 font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Model Agnostic Mode */}
        <div className="glass-panel p-5 rounded-xl border border-zinc-800 space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>Execution Model Configuration</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between bg-zinc-900/80 p-3 rounded-lg border border-zinc-800">
              <div>
                <div className="text-white font-bold">Model Agnostic Execution</div>
                <div className="text-zinc-400 text-[11px]">Enforces deterministic programmatic harness execution</div>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded border border-emerald-500/30">
                ACTIVE
              </span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-2">
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
          >
            {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{saved ? 'Configuration Saved' : 'Save Configuration'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
