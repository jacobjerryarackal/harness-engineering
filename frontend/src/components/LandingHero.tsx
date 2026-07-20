'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  Shield,
  Cpu,
  RefreshCw,
  Zap,
  CheckCircle2,
  Terminal,
  Activity,
  Code2,
} from 'lucide-react';

interface LandingHeroProps {
  onLaunch: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onLaunch }) => {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col justify-between p-6 sm:p-12 relative overflow-hidden bg-zinc-950">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Hero Header */}
      <div className="max-w-5xl mx-auto text-center space-y-6 pt-8 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800 text-xs font-mono text-emerald-400 shadow-xl"
        >
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>FROZEN ARCHITECTURE AUTHORITY • MODEL AGNOSTIC</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-7xl font-extrabold tracking-tight text-white leading-tight"
        >
          SYMPHONY
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-500">
            Harness Operating System
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto font-normal leading-relaxed"
        >
          &quot;Autonomous Engineering Control Plane&quot;
          <br />
          Coordinates specialized engineering harnesses across the software development lifecycle, powered by shared organizational intelligence and continuous production learning.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="pt-4 flex items-center justify-center gap-4"
        >
          <button
            onClick={onLaunch}
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-indigo-600 text-zinc-950 font-bold text-base shadow-2xl shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span>Launch Symphony OS</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>

      {/* Large Animated Architecture Pipeline Diagram */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="max-w-6xl mx-auto w-full my-12 glass-panel rounded-2xl p-6 sm:p-8 border border-zinc-800/80 shadow-2xl z-10 relative"
      >
        <div className="flex items-center justify-between pb-6 border-b border-zinc-800/80 mb-6">
          <div className="flex items-center gap-2 font-mono text-xs text-zinc-400">
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>CONTROL PLANE ARCHITECTURE INTERFACE</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>7 HARNESSES REGISTERED</span>
          </div>
        </div>

        {/* Visual Workflow Steps */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 text-center">
          {[
            { name: 'Specification', icon: Code2, desc: 'Reqs & Specs' },
            { name: 'Research', icon: Terminal, desc: 'Codebase Inspect' },
            { name: 'Architecture', icon: Cpu, desc: 'Component Design' },
            { name: 'Engineering', icon: Zap, desc: 'Code Generation' },
            { name: 'Evaluation', icon: CheckCircle2, desc: 'Test Suite' },
            { name: 'Deployment', icon: Shield, desc: 'Runtime Packaging' },
            { name: 'Learning', icon: RefreshCw, desc: 'Feedback Loop' },
          ].map((harness, idx) => {
            const Icon = harness.icon;
            return (
              <div
                key={harness.name}
                className="glass-panel p-4 rounded-xl border border-zinc-800/80 hover:border-emerald-500/40 hover:bg-zinc-900/80 transition-all group relative overflow-hidden"
              >
                <div className="w-10 h-10 mx-auto rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-3 text-emerald-400 group-hover:scale-110 group-hover:border-emerald-500/50 transition-all">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="font-bold text-xs text-zinc-200 mb-1">{harness.name}</div>
                <div className="text-[10px] text-zinc-400 font-mono">{harness.desc}</div>
                <div className="mt-2 text-[9px] font-mono text-emerald-400/80 bg-emerald-500/10 px-1.5 py-0.5 rounded inline-block">
                  Phase 0{idx + 1}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Principles & Features Grid */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 z-10 pb-8">
        <div className="glass-panel p-5 rounded-xl border border-zinc-800/80 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <Cpu className="w-4 h-4" />
            <span>Model Agnostic</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Operates independently of specific LLM vendors using clean typed dependency injection contracts.
          </p>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-zinc-800/80 space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
            <Shield className="w-4 h-4" />
            <span>Shared Intelligence</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Persistent Knowledge Graph, Policy Engine, and Evidence Store prevent repeated reasoning.
          </p>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-zinc-800/80 space-y-2">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
            <RefreshCw className="w-4 h-4" />
            <span>Production Feedback</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Telemetry extraction feeds back into the Failure Repository and Memory Updater: Loss = Information.
          </p>
        </div>
      </div>
    </div>
  );
};
