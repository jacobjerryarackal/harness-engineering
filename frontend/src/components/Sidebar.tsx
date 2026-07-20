'use client';

import React from 'react';
import {
  LayoutDashboard,
  Play,
  Database,
  Network,
  Activity,
  AlertTriangle,
  Settings,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'execute', label: 'Execute', icon: Play, badge: 'Live' },
    { id: 'memory', label: 'Memory', icon: Database },
    { id: 'knowledge-graph', label: 'Knowledge Graph', icon: Network },
    { id: 'telemetry', label: 'Telemetry', icon: Activity },
    { id: 'failures', label: 'Failures', icon: AlertTriangle },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-zinc-800/80 bg-zinc-950/60 flex flex-col justify-between p-3 select-none">
      <div className="space-y-4">
        {/* Navigation Category Label */}
        <div className="px-3 pt-2 text-[10px] font-mono uppercase tracking-wider text-zinc-400">
          Control Plane Modules
        </div>

        {/* Navigation List */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-zinc-800/90 text-white border border-zinc-700/80 shadow-md shadow-black/20'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-emerald-400' : 'text-zinc-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30 animate-pulse">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info Box */}
      <div className="glass-panel p-3 rounded-xl space-y-2 border border-zinc-800/80">
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-200">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Harness Operating System</span>
        </div>
        <p className="text-[11px] text-zinc-400 leading-relaxed">
          Model-agnostic orchestrator coordinating 7 specialized engineering harnesses.
        </p>
      </div>
    </aside>
  );
};
