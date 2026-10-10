import { Milestone, RoadmapEdge } from '../types/roadmap';

export interface PositionedNodeData {
  milestone: Milestone;
  status: 'locked' | 'available' | 'in_progress' | 'completed' | 'demonstrated';
  isPrereqOfSelected?: boolean;
  isDependentOfSelected?: boolean;
  isDiffAdded?: boolean;
  isDiffRemoved?: boolean;
  isDiffModified?: boolean;
  isDiffPreserved?: boolean;
  onSelectMilestone?: (milestoneId: string) => void;
}

export function calculateGraphLayout(milestones: Milestone[], edges: RoadmapEdge[], completedIds: Set<string>, demonstratedIds: Set<string>) {
  const milestoneMap = new Map<string, Milestone>(milestones.map((m) => [m.id, m]));
  const adj = new Map<string, string[]>();
  const inDegree = new Map<string, number>();

  milestones.forEach((m) => {
    adj.set(m.id, []);
    inDegree.set(m.id, 0);
  });

  edges.forEach((e) => {
    if (adj.has(e.source) && inDegree.has(e.target)) {
      adj.get(e.source)!.push(e.target);
      inDegree.set(e.target, (inDegree.get(e.target) || 0) + 1);
    }
  });

  // Calculate layer / depth via longest path from any root
  const depthMap = new Map<string, number>();
  
  function getDepth(id: string, visited = new Set<string>()): number {
    if (depthMap.has(id)) return depthMap.get(id)!;
    if (visited.has(id)) return 0;
    visited.add(id);

    const m = milestoneMap.get(id);
    if (!m || !m.prerequisites || m.prerequisites.length === 0) {
      depthMap.set(id, 0);
      return 0;
    }

    let maxPrereqDepth = -1;
    for (const pId of m.prerequisites) {
      if (milestoneMap.has(pId)) {
        maxPrereqDepth = Math.max(maxPrereqDepth, getDepth(pId, new Set(visited)));
      }
    }

    const calculated = maxPrereqDepth + 1;
    depthMap.set(id, calculated);
    return calculated;
  }

  milestones.forEach((m) => getDepth(m.id));

  // Group nodes by depth layer
  const layers = new Map<number, string[]>();
  milestones.forEach((m) => {
    const d = depthMap.get(m.id) || 0;
    if (!layers.has(d)) layers.set(d, []);
    layers.get(d)!.push(m.id);
  });

  const X_SPACING = 360;
  const Y_SPACING = 210;
  const X_OFFSET = 80;
  const Y_OFFSET = 80;

  const nodes = milestones.map((m) => {
    const layer = depthMap.get(m.id) || 0;
    const layerItems = layers.get(layer) || [m.id];
    const indexInLayer = layerItems.indexOf(m.id);
    const totalInLayer = layerItems.length;

    // Center nodes in each layer
    const yCenterOffset = ((3 - totalInLayer) * Y_SPACING) / 2;
    const x = X_OFFSET + layer * X_SPACING;
    const y = Math.max(Y_OFFSET, Y_OFFSET + indexInLayer * Y_SPACING + Math.max(0, yCenterOffset));

    // Determine derived node status
    let status: 'locked' | 'available' | 'in_progress' | 'completed' | 'demonstrated' = 'locked';
    if (m.evidence_status === 'demonstrated') {
      status = 'demonstrated';
    } else if (m.learning_status === 'completed') {
      status = 'completed';
    } else if (m.learning_status === 'in_progress' || m.evidence_status === 'evidence_submitted') {
      status = 'in_progress';
    } else {
      // Check if all prerequisites are fulfilled (either completed or demonstrated)
      const allPrereqsMet = m.prerequisites.length === 0 || m.prerequisites.every(
        (pId) => completedIds.has(pId) || demonstratedIds.has(pId)
      );
      status = allPrereqsMet ? 'available' : 'locked';
    }

    return {
      id: m.id,
      type: 'milestoneNode',
      position: { x, y },
      data: {
        milestone: m,
        status,
      },
    };
  });

  const flowEdges = edges.map((e) => {
    const sourceDemonstrated = demonstratedIds.has(e.source) || completedIds.has(e.source);
    return {
      id: e.id,
      source: e.source,
      target: e.target,
      animated: sourceDemonstrated,
      style: {
        stroke: sourceDemonstrated ? '#22D3EE' : '#334155',
        strokeWidth: sourceDemonstrated ? 2.5 : 1.5,
      },
    };
  });

  return { nodes, edges: flowEdges };
}
