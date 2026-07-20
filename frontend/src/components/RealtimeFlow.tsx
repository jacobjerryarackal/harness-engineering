'use client';

import React, { useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  Handle,
  Position,
  NodeProps,
  Edge,
  Node,
} from '@xyflow/react';
import {
  Brain,
  Route,
  CheckSquare,
  FileCode,
  Search,
  Building2,
  Code,
  ShieldCheck,
  Rocket,
  Lightbulb,
  Activity,
  Network,
  Database,
  Layers,
} from 'lucide-react';

export type StepStatus = 'idle' | 'running' | 'success' | 'failure';

export interface NodeStateMap {
  [nodeId: string]: StepStatus;
}

const nodeIcons: Record<string, any> = {
  'intent-analyzer': Brain,
  'harness-router': Route,
  'harness-selector': CheckSquare,
  'execution-planner': Layers,
  'spec-harness': FileCode,
  'research-harness': Search,
  'arch-harness': Building2,
  'eng-harness': Code,
  'eval-harness': ShieldCheck,
  'deploy-harness': Rocket,
  'learn-harness': Lightbulb,
  'telemetry-node': Activity,
  'knowledge-graph-node': Network,
  'memory-update-node': Database,
};

// Custom Node Component for ReactFlow
const ControlPlaneNode: React.FC<NodeProps> = ({ data }) => {
  const label = data.label as string;
  const status = (data.status as StepStatus) || 'idle';
  const iconKey = data.iconKey as string;
  const Icon = nodeIcons[iconKey] || Activity;

  let borderStyle = 'border-zinc-800 bg-zinc-900/90 text-zinc-400';
  let badgeStyle = 'bg-zinc-800 text-zinc-400';
  let pulseGlow = '';

  if (status === 'running') {
    borderStyle = 'border-amber-400/90 bg-amber-950/40 text-amber-200 shadow-xl shadow-amber-500/20';
    badgeStyle = 'bg-amber-500/20 text-amber-300 border border-amber-500/30';
    pulseGlow = 'animate-pulse';
  } else if (status === 'success') {
    borderStyle = 'border-emerald-500/90 bg-emerald-950/40 text-emerald-100 shadow-xl shadow-emerald-500/20';
    badgeStyle = 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
  } else if (status === 'failure') {
    borderStyle = 'border-rose-500/90 bg-rose-950/40 text-rose-100 shadow-xl shadow-rose-500/20';
    badgeStyle = 'bg-rose-500/20 text-rose-300 border border-rose-500/30';
  }

  return (
    <div
      className={`px-4 py-3 rounded-xl border ${borderStyle} ${pulseGlow} transition-all duration-300 min-w-[170px] backdrop-blur-md shadow-lg`}
    >
      <Handle type="target" position={Position.Top} className="!bg-zinc-600 !w-2 !h-2" />
      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-lg bg-zinc-950/80 border border-white/10 flex items-center justify-center">
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <div className="font-bold text-xs text-white leading-tight">{label}</div>
          <div className="mt-1 flex items-center gap-1">
            <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded font-semibold ${badgeStyle}`}>
              {status}
            </span>
          </div>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-zinc-600 !w-2 !h-2" />
    </div>
  );
};

const nodeTypes = {
  controlPlaneNode: ControlPlaneNode,
};

interface RealtimeFlowProps {
  nodeStates: NodeStateMap;
}

export const RealtimeFlow: React.FC<RealtimeFlowProps> = ({ nodeStates }) => {
  const nodes: Node[] = useMemo(() => {
    const rawNodes = [
      { id: 'intent-analyzer', label: 'Intent Analyzer', iconKey: 'intent-analyzer', x: 250, y: 0 },
      { id: 'harness-router', label: 'Harness Router', iconKey: 'harness-router', x: 250, y: 80 },
      { id: 'harness-selector', label: 'Harness Selector', iconKey: 'harness-selector', x: 250, y: 160 },
      { id: 'execution-planner', label: 'Execution Planner', iconKey: 'execution-planner', x: 250, y: 240 },
      
      // Parallel / Sequential Harness Row
      { id: 'spec-harness', label: 'Spec Harness', iconKey: 'spec-harness', x: 0, y: 340 },
      { id: 'research-harness', label: 'Research Harness', iconKey: 'research-harness', x: 170, y: 340 },
      { id: 'arch-harness', label: 'Arch Harness', iconKey: 'arch-harness', x: 340, y: 340 },
      { id: 'eng-harness', label: 'Engineering Harness', iconKey: 'eng-harness', x: 510, y: 340 },
      { id: 'eval-harness', label: 'Evaluation Harness', iconKey: 'eval-harness', x: 680, y: 340 },

      // Deployment & Learning
      { id: 'deploy-harness', label: 'Deployment Harness', iconKey: 'deploy-harness', x: 250, y: 440 },
      { id: 'learn-harness', label: 'Learning Harness', iconKey: 'learn-harness', x: 250, y: 520 },

      // Feedback loop back to memory
      { id: 'telemetry-node', label: 'Telemetry', iconKey: 'telemetry-node', x: 250, y: 600 },
      { id: 'knowledge-graph-node', label: 'Knowledge Graph', iconKey: 'knowledge-graph-node', x: 250, y: 680 },
      { id: 'memory-update-node', label: 'Memory Update', iconKey: 'memory-update-node', x: 250, y: 760 },
    ];

    return rawNodes.map((n) => ({
      id: n.id,
      type: 'controlPlaneNode',
      position: { x: n.x, y: n.y },
      data: {
        label: n.label,
        iconKey: n.iconKey,
        status: nodeStates[n.id] || 'idle',
      },
    }));
  }, [nodeStates]);

  const edges: Edge[] = useMemo(() => {
    return [
      { id: 'e1', source: 'intent-analyzer', target: 'harness-router', animated: true, style: { stroke: '#3f3f46' } },
      { id: 'e2', source: 'harness-router', target: 'harness-selector', animated: true, style: { stroke: '#3f3f46' } },
      { id: 'e3', source: 'harness-selector', target: 'execution-planner', animated: true, style: { stroke: '#3f3f46' } },
      
      // Planner to harnesses
      { id: 'e4a', source: 'execution-planner', target: 'spec-harness', animated: true, style: { stroke: '#3f3f46' } },
      { id: 'e4b', source: 'execution-planner', target: 'research-harness', animated: true, style: { stroke: '#3f3f46' } },
      { id: 'e4c', source: 'execution-planner', target: 'arch-harness', animated: true, style: { stroke: '#3f3f46' } },
      { id: 'e4d', source: 'execution-planner', target: 'eng-harness', animated: true, style: { stroke: '#3f3f46' } },
      { id: 'e4e', source: 'execution-planner', target: 'eval-harness', animated: true, style: { stroke: '#3f3f46' } },

      // Harnesses to Deployment
      { id: 'e5a', source: 'spec-harness', target: 'deploy-harness', animated: true, style: { stroke: '#3f3f46' } },
      { id: 'e5b', source: 'eng-harness', target: 'deploy-harness', animated: true, style: { stroke: '#3f3f46' } },
      { id: 'e5c', source: 'eval-harness', target: 'deploy-harness', animated: true, style: { stroke: '#3f3f46' } },

      // Feedback loop
      { id: 'e6', source: 'deploy-harness', target: 'learn-harness', animated: true, style: { stroke: '#3f3f46' } },
      { id: 'e7', source: 'learn-harness', target: 'telemetry-node', animated: true, style: { stroke: '#10b981' } },
      { id: 'e8', source: 'telemetry-node', target: 'knowledge-graph-node', animated: true, style: { stroke: '#10b981' } },
      { id: 'e9', source: 'knowledge-graph-node', target: 'memory-update-node', animated: true, style: { stroke: '#10b981' } },
    ];
  }, []);

  return (
    <div className="w-full h-full min-h-[600px] rounded-xl overflow-hidden glass-panel border border-zinc-800/80 relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#27272a" gap={20} size={1} />
        <Controls />
      </ReactFlow>
    </div>
  );
};
