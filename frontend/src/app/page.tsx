'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { LandingHero } from '@/components/LandingHero';
import { DashboardView } from '@/components/DashboardView';
import { ExecuteView } from '@/components/ExecuteView';
import { MemoryView } from '@/components/MemoryView';
import { KnowledgeGraphView } from '@/components/KnowledgeGraphView';
import { TelemetryView } from '@/components/TelemetryView';
import { FailuresView } from '@/components/FailuresView';
import { SettingsView } from '@/components/SettingsView';

export default function Home() {
  const [isLandingPage, setIsLandingPage] = useState(true);
  const [activeTab, setActiveTab] = useState('execute');

  const handleLaunchFromLanding = () => {
    setIsLandingPage(false);
    setActiveTab('execute');
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isLandingPage={isLandingPage}
        setIsLandingPage={setIsLandingPage}
      />

      {/* Main Content Area */}
      {isLandingPage ? (
        <LandingHero onLaunch={handleLaunchFromLanding} />
      ) : (
        <div className="flex-1 flex overflow-hidden">
          {/* Left Navigation Sidebar */}
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Active View Module */}
          <main className="flex-1 flex flex-col min-w-0 bg-zinc-950/40 relative">
            {activeTab === 'dashboard' && (
              <DashboardView onNavigateExecute={() => setActiveTab('execute')} />
            )}
            {activeTab === 'execute' && <ExecuteView />}
            {activeTab === 'memory' && <MemoryView />}
            {activeTab === 'knowledge-graph' && <KnowledgeGraphView />}
            {activeTab === 'telemetry' && <TelemetryView />}
            {activeTab === 'failures' && <FailuresView />}
            {activeTab === 'settings' && <SettingsView />}
          </main>
        </div>
      )}
    </div>
  );
}
