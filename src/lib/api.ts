import { CareerRoadmap, MilestoneSubmission, MultiverseScenario, RealityRadarRoleData, SteppingStonePathway } from '../types/roadmap';

export async function fetchGenerateRoadmap(payload: {
  goal: string;
  current_skills: string[];
  weekly_hours: number;
  target_months: number;
  budget_tier?: string;
  experience_level?: string;
}): Promise<CareerRoadmap> {
  const res = await fetch('/api/roadmap/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to generate roadmap (${res.status})`);
  }
  return res.json();
}

export async function fetchMilestoneAdvice(payload: {
  goal: string;
  current_skills: string[];
  milestone_title: string;
  milestone_description: string;
  prerequisites_status: string;
  weekly_hours: number;
  current_progress: string;
}) {
  const res = await fetch('/api/roadmap/milestone-advice', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error('Failed to fetch milestone advice');
  }
  return res.json();
}

export async function fetchReplanRoadmap(payload: {
  current_roadmap: CareerRoadmap;
  new_constraints: {
    weekly_hours: number;
    target_months: number;
    target_role?: string;
    known_skills?: string[];
    free_resources_only?: boolean;
  };
  reason?: string;
}): Promise<{
  proposedRoadmap: CareerRoadmap;
  diff: MultiverseScenario['diff'];
  summary: string;
}> {
  const res = await fetch('/api/roadmap/replan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to replan roadmap');
  }
  return res.json();
}

export async function fetchEvaluateEvidence(payload: {
  milestone_title: string;
  mission_brief: string;
  rubric: any[];
  repo_url?: string;
  live_url?: string;
  summary: string;
  code_snippet?: string;
}) {
  const res = await fetch('/api/roadmap/evaluate-evidence', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to evaluate evidence');
  }
  return res.json();
}

export async function fetchRealityRadar(role: string): Promise<RealityRadarRoleData> {
  const res = await fetch(`/api/reality-radar/${encodeURIComponent(role)}`);
  if (!res.ok) {
    throw new Error('Failed to load reality radar data');
  }
  return res.json();
}

export async function fetchOpportunityRadar(role: string): Promise<SteppingStonePathway[]> {
  const res = await fetch(`/api/opportunity-radar/${encodeURIComponent(role)}`);
  if (!res.ok) {
    throw new Error('Failed to load opportunity radar data');
  }
  return res.json();
}
