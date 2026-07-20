'use client';

import React, { useEffect, useState } from 'react';
import { Activity, Terminal, ShieldCheck, Sparkles, Cpu, Layers } from 'lucide-react';
import { fetchHealth } from '@/lib/api';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isLandingPage: boolean;
  setIsLandingPage: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isLandingPage,
  setIsLandingPage,
}) => {
  const [health, setHealth] = useState<'healthy' | 'offline' | 'checking'>('checking');

  useEffect(() => {
    const check = async () => {
      const res = await fetchHealth();
      setHealth(res.status === 'healthy' ? 'healthy' : 'offline');
    };
    check();
    const interval = setInterval(check, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-14 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50 px-4 flex items-center justify-between">
      {/* Brand & Tagline */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsLandingPage(true)}
          className="flex items-center gap-2 group text-left focus:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 via-cyan-500 to-indigo-600 p-[1px] shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all">
            <div className="w-full h-full bg-zinc-950 rounded-[7px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-white text-base">SYMPHONY</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                v1.0 OS
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 font-mono hidden sm:block">
              Autonomous Engineering Control Plane
            </p>
          </div>
        </button>
      </div>

      {/* Center Nav Toggles */}
      <div className="flex items-center gap-1 bg-zinc-900/90 p-1 rounded-lg border border-zinc-800 text-xs font-medium">
        <button
          onClick={() => setIsLandingPage(true)}
          className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
            isLandingPage
              ? 'bg-zinc-800 text-white shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          Overview
        </button>
        <button
          onClick={() => {
            setIsLandingPage(false);
            if (activeTab === 'dashboard') setActiveTab('execute');
          }}
          className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
            !isLandingPage
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Cpu className="w-3.5 h-3.5 text-emerald-400" />
          Operating System UI
        </button>
      </div>

      {/* Status Bar */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-mono px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800">
          <span className="relative flex h-2 w-2">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                health === 'healthy'
                  ? 'bg-emerald-400'
                  : health === 'offline'
                  ? 'bg-rose-500'
                  : 'bg-amber-400'
              }`}
            ></span>
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                health === 'healthy'
                  ? 'bg-emerald-500'
                  : health === 'offline'
                  ? 'bg-rose-600'
                  : 'bg-amber-500'
              }`}
            ></span>
          </span>
          <span className="text-zinc-300">
            {health === 'healthy'
              ? 'FastAPI Backend Online'
              : health === 'offline'
              ? 'Backend Offline'
              : 'Checking API...'}
          </span>
        </div>
      </div>
    </header>
  );
};
