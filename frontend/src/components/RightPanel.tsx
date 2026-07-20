'use client';

import React, { useState } from 'react';
import { ExecuteResponse } from '@/lib/api';
import {
  Code,
  FileText,
  Activity,
  Terminal,
  Copy,
  Check,
  Zap,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

interface RightPanelProps {
  response: ExecuteResponse | null;
  isRunning: boolean;
  logs: string[];
}

export const RightPanel: React.FC<RightPanelProps> = ({
  response,
  isRunning,
  logs,
}) => {
  const [activeTab, setActiveTab] = useState<'artifacts' | 'logs' | 'telemetry' | 'json'>('artifacts');
  const [copied, setCopied] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generatedFiles = response?.execution_artifacts?.generated_files || {};
  const fileNames = Object.keys(generatedFiles);
  const activeFile = selectedFile && generatedFiles[selectedFile] ? selectedFile : fileNames[0] || null;

  return (
    <div className="w-full h-full flex flex-col glass-panel rounded-xl border border-zinc-800/80 overflow-hidden">
      {/* Header Tabs */}
      <div className="flex items-center justify-between px-3 py-2 bg-zinc-950/80 border-b border-zinc-800/80">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('artifacts')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'artifacts'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Code className="w-3.5 h-3.5 text-emerald-400" />
            Artifacts ({fileNames.length})
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'logs'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            Logs
          </button>
          <button
            onClick={() => setActiveTab('telemetry')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'telemetry'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-indigo-400" />
            Telemetry
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'json'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            JSON Output
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="flex-1 overflow-auto p-4 bg-zinc-950/60 font-mono text-xs">
        {activeTab === 'artifacts' && (
          <div className="space-y-4">
            {fileNames.length > 0 ? (
              <>
                <div className="flex gap-2 border-b border-zinc-800/80 pb-2 overflow-x-auto">
                  {fileNames.map((fileName) => (
                    <button
                      key={fileName}
                      onClick={() => setSelectedFile(fileName)}
                      className={`px-2.5 py-1 rounded text-[11px] font-mono transition-all flex items-center gap-1.5 ${
                        activeFile === fileName
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                      }`}
                    >
                      <FileText className="w-3 h-3 text-emerald-400" />
                      {fileName}
                    </button>
                  ))}
                </div>

                {activeFile && (
                  <div className="relative glass-panel p-3 rounded-lg border border-zinc-800 bg-zinc-900/90 text-zinc-200 overflow-x-auto">
                    <button
                      onClick={() => handleCopy(generatedFiles[activeFile])}
                      className="absolute top-2 right-2 p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-all"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <pre className="text-xs leading-relaxed font-mono whitespace-pre-wrap">
                      {generatedFiles[activeFile]}
                    </pre>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 text-zinc-500">
                <Code className="w-8 h-8 mx-auto mb-2 opacity-50" />
                No execution artifacts generated yet. Run a prompt to generate files.
              </div>
            )}
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="space-y-1.5">
            {logs.length > 0 ? (
              logs.map((log, index) => (
                <div key={index} className="flex gap-2 text-zinc-300 font-mono text-[11px]">
                  <span className="text-zinc-600 select-none">[{index + 1}]</span>
                  <span className={log.includes('failed') || log.includes('error') ? 'text-rose-400 font-bold' : log.includes('success') ? 'text-emerald-400 font-bold' : ''}>
                    {log}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-zinc-500">
                <Terminal className="w-8 h-8 mx-auto mb-2 opacity-50" />
                Execution logs will appear here during execution.
              </div>
            )}
          </div>
        )}

        {activeTab === 'telemetry' && (
          <div className="space-y-4">
            {response?.telemetry_summary ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="glass-panel p-3 rounded-lg border border-zinc-800">
                    <div className="text-[10px] text-zinc-400">STATUS</div>
                    <div className="text-sm font-bold text-emerald-400 flex items-center gap-1.5 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                      {response.telemetry_summary.status}
                    </div>
                  </div>
                  <div className="glass-panel p-3 rounded-lg border border-zinc-800">
                    <div className="text-[10px] text-zinc-400">EXIT CODE</div>
                    <div className="text-sm font-bold text-white mt-0.5">
                      {response.telemetry_summary.exit_code}
                    </div>
                  </div>
                </div>

                <div className="glass-panel p-3 rounded-lg border border-zinc-800 space-y-2">
                  <div className="text-[10px] text-zinc-400">LEARNING UPDATES ({response.learning_updates?.length || 0})</div>
                  {response.learning_updates?.map((up, i) => (
                    <div key={i} className="bg-zinc-900 p-2 rounded border border-zinc-800 text-[11px] text-emerald-300 flex items-center justify-between">
                      <span className="font-semibold text-white">{up.action}</span>
                      <span className="text-zinc-400">{up.subject || up.component || 'Core'}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-zinc-500">
                <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                No telemetry recorded for the current run.
              </div>
            )}
          </div>
        )}

        {activeTab === 'json' && (
          <div className="relative glass-panel p-3 rounded-lg border border-zinc-800 bg-zinc-900/90 text-amber-300 overflow-x-auto">
            {response ? (
              <pre className="text-[11px] leading-relaxed whitespace-pre-wrap font-mono">
                {JSON.stringify(response, null, 2)}
              </pre>
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
