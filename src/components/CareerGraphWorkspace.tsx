import React, { useState, useMemo, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  useNodesState,
  useEdgesState,
  Edge,
  Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { CareerRoadmap, Milestone, MultiverseScenario } from '../types/roadmap';
import { CustomMilestoneNode } from './CustomMilestoneNode';
import { calculateGraphLayout } from '../lib/graphLayout';
import { 
  Search, 
  Filter, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  Layers, 
  ArrowRight,
  GitCompare,
  RotateCcw
} from 'lucide-react';

const nodeTypes = {
  milestoneNode: CustomMilestoneNode,
};

interface CareerGraphWorkspaceProps {
  roadmap: CareerRoadmap;
  selectedMilestoneId: string | null;
  onSelectMilestone: (id: string | null) => void;
  activeScenario?: MultiverseScenario | null;
  onAcceptScenario?: () => void;
  onRejectScenario?: () => void;
}

export const CareerGraphWorkspace: React.FC<CareerGraphWorkspaceProps> = ({
  roadmap,
  selectedMilestoneId,
  onSelectMilestone,
  activeScenario,
  onAcceptScenario,
  onRejectScenario,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const completedIds = useMemo(() => {
    return new Set(
      roadmap.milestones
        .filter((m) => m.learning_status === 'completed')
        .map((m) => m.id)
    );
  }, [roadmap.milestones]);

  const demonstratedIds = useMemo(() => {
    return new Set(
      roadmap.milestones
        .filter((m) => m.evidence_status === 'demonstrated')
        .map((m) => m.id)
    );
  }, [roadmap.milestones]);

  // Compute upstream prerequisites and downstream dependents for highlighting
  const { upstreamPrereqs, downstreamDependents } = useMemo(() => {
    if (!selectedMilestoneId) return { upstreamPrereqs: new Set<string>(), downstreamDependents: new Set<string>() };

    const up = new Set<string>();
    const down = new Set<string>();

    const targetMilestone = roadmap.milestones.find((m) => m.id === selectedMilestoneId);
    if (targetMilestone) {
      targetMilestone.prerequisites.forEach((p) => up.add(p));
    }

    roadmap.milestones.forEach((m) => {
      if (m.prerequisites.includes(selectedMilestoneId)) {
        down.add(m.id);
      }
    });

    return { upstreamPrereqs: up, downstreamDependents: down };
  }, [selectedMilestoneId, roadmap.milestones]);

  // Calculate layout
  const { nodes: rawNodes, edges: rawEdges } = useMemo(() => {
    return calculateGraphLayout(roadmap.milestones, roadmap.edges, completedIds, demonstratedIds);
  }, [roadmap.milestones, roadmap.edges, completedIds, demonstratedIds]);

  // Apply filters, search, and diff styling
  const processedNodes = useMemo(() => {
    return rawNodes.map((node) => {
      const milestone = node.data.milestone as Milestone;
      const matchesSearch = searchQuery === '' || 
        milestone.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        milestone.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || milestone.category === selectedCategory;
      
      const nodeStatus = node.data.status;
      const matchesStatus = selectedStatus === 'all' || nodeStatus === selectedStatus;

      const isVisible = matchesSearch && matchesCategory && matchesStatus;

      // Multiverse diff check
      let diffStatus: 'added' | 'removed' | 'modified' | 'preserved' | undefined;
      if (activeScenario) {
        if (activeScenario.diff.addedMilestoneIds?.includes(milestone.id)) {
          diffStatus = 'added';
        } else if (activeScenario.diff.removedMilestoneIds?.includes(milestone.id)) {
          diffStatus = 'removed';
        } else if (activeScenario.diff.modifiedMilestoneIds?.includes(milestone.id)) {
          diffStatus = 'modified';
        } else {
          diffStatus = 'preserved';
        }
      }

      return {
        ...node,
        style: {
          opacity: isVisible ? 1 : 0.25,
          pointerEvents: isVisible ? ('auto' as const) : ('none' as const),
        },
        data: {
          ...node.data,
          isSelected: milestone.id === selectedMilestoneId,
          isPrereqOfSelected: upstreamPrereqs.has(milestone.id),
          isDependentOfSelected: downstreamDependents.has(milestone.id),
          diffStatus,
          onSelectMilestone: (id: string) => onSelectMilestone(id),
        },
      };
    });
  }, [
    rawNodes,
    searchQuery,
    selectedCategory,
    selectedStatus,
    selectedMilestoneId,
    upstreamPrereqs,
    downstreamDependents,
    activeScenario,
    onSelectMilestone,
  ]);

  const processedEdges = useMemo(() => {
    return rawEdges.map((edge) => {
      const isConnectedToSelected =
        edge.source === selectedMilestoneId || edge.target === selectedMilestoneId;
      
      return {
        ...edge,
        style: {
          ...edge.style,
          stroke: isConnectedToSelected ? '#22D3EE' : edge.style.stroke,
          strokeWidth: isConnectedToSelected ? 3 : edge.style.strokeWidth,
        },
      };
    });
  }, [rawEdges, selectedMilestoneId]);

  const [nodes, , onNodesChange] = useNodesState(processedNodes);
  const [edges, , onEdgesChange] = useEdgesState(processedEdges);

  // Sync state when processedNodes change
  React.useEffect(() => {
    // Keep nodes synchronized with layout updates
  }, [processedNodes]);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    roadmap.milestones.forEach((m) => set.add(m.category));
    return Array.from(set);
  }, [roadmap.milestones]);

  const demonstratedCount = roadmap.milestones.filter((m) => m.evidence_status === 'demonstrated').length;
  const completedCount = roadmap.milestones.filter((m) => m.learning_status === 'completed').length;

  return (
    <div className="relative w-full h-[calc(100vh-64px)] bg-[#080B14] overflow-hidden">
      {/* Top Filter and Search Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Left: Filters & Search */}
        <div className="flex flex-wrap items-center gap-2 pointer-events-auto bg-[#0E1424]/90 backdrop-blur-md p-2 rounded-xl border border-slate-800 shadow-xl">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search flight path..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-900 border border-slate-700/60 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 w-44"
            />
          </div>

          <div className="h-4 w-px bg-slate-800" />

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-700/60 rounded-lg text-slate-300 focus:outline-none focus:border-cyan-400"
          >
            <option value="all">All Domains</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-700/60 rounded-lg text-slate-300 focus:outline-none focus:border-cyan-400"
          >
            <option value="all">All States</option>
            <option value="demonstrated">Demonstrated</option>
            <option value="in_progress">In Progress</option>
            <option value="available">Available</option>
            <option value="locked">Prerequisites Locked</option>
          </select>
        </div>

        {/* Right: Metrics & Multiverse Diff Banner */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {activeScenario ? (
            <div className="flex items-center gap-3 bg-violet-950/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-violet-500/40 shadow-xl text-xs">
              <div className="flex items-center gap-1.5 text-violet-300 font-medium">
                <GitCompare className="w-4 h-4 text-violet-400" />
                <span>Comparing Scenario: {activeScenario.name}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={onAcceptScenario}
                  className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-[#080B14] rounded-lg font-bold text-xs cursor-pointer transition-colors"
                >
                  Accept & Apply
                </button>
                <button
                  onClick={onRejectScenario}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium text-xs cursor-pointer transition-colors"
                >
                  Reject & Revert
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 bg-[#0E1424]/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-800 shadow-xl text-xs">
              <div className="flex items-center gap-1.5 text-slate-300">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>{roadmap.milestones.length} Milestones</span>
              </div>
              <span className="text-slate-700">·</span>
              <div className="flex items-center gap-1.5 text-emerald-400 font-mono">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{demonstratedCount} Demonstrated</span>
              </div>
              <span className="text-slate-700">·</span>
              <div className="flex items-center gap-1.5 text-slate-400 font-mono">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>{roadmap.total_estimated_hours}h Total</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main React Flow Canvas */}
      <ReactFlow
        nodes={processedNodes}
        edges={processedEdges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.2}
        maxZoom={1.5}
        className="bg-[#080B14]"
      >
        <Background color="#1E293B" gap={28} size={1} />
        <Controls className="!bg-[#0E1424] !border-slate-800 !fill-slate-300 !rounded-xl !shadow-xl" />
        <MiniMap
          nodeColor={(n) => {
            if (n.data?.status === 'demonstrated') return '#10B981';
            if (n.data?.status === 'in_progress') return '#8B5CF6';
            if (n.data?.status === 'available') return '#22D3EE';
            return '#1E293B';
          }}
          className="!bg-[#0E1424] !border-slate-800 !rounded-xl"
          maskColor="rgba(8, 11, 20, 0.7)"
        />

        {/* Legend Panel at bottom-left */}
        <Panel position="bottom-left" className="bg-[#0E1424]/85 backdrop-blur-md p-2.5 rounded-xl border border-slate-800 text-[11px] text-slate-400 shadow-xl flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Demonstrated</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-violet-500"></span>
            <span>In Flight</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span>
            <span>Available Next</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-700"></span>
            <span>Locked (Prereqs Pending)</span>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
};
