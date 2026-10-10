export type LearningStatus = 'not_started' | 'in_progress' | 'completed';
export type EvidenceStatus = 'none' | 'evidence_submitted' | 'demonstrated' | 'revision_requested';

export interface RubricCriterion {
  id: string;
  criterion: string;
  weight: number; // e.g. 25
  description: string;
  passingStandard: string;
}

export interface CriterionEvaluationResult {
  criterionId: string;
  criterion: string;
  status: 'pass' | 'needs_improvement';
  feedback: string;
}

export interface MilestoneSubmission {
  repoUrl?: string;
  liveUrl?: string;
  portfolioUrl?: string;
  summary: string;
  codeSnippet?: string;
  submittedAt: string;
  evaluation?: {
    evaluatedAt: string;
    isProvisional: true;
    overallDecision: 'demonstrated' | 'needs_revision';
    summaryFeedback: string;
    strengths: string[];
    gaps: string[];
    nextSteps: string[];
    criteriaResults: CriterionEvaluationResult[];
  };
}

export interface MilestoneResource {
  title: string;
  url: string;
  type: 'doc' | 'tutorial' | 'course' | 'repo' | 'tool';
  isFree: boolean;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  category: 'Fundamentals' | 'Frontend' | 'Backend' | 'AI/ML' | 'Cloud/DevOps' | 'Data' | 'Security' | 'System Design' | 'Portfolio Project';
  prerequisites: string[]; // List of IDs this milestone depends on
  estimated_hours: number;
  tasks: string[];
  deliverables: string[];
  resources: MilestoneResource[];
  learning_status: LearningStatus;
  evidence_status: EvidenceStatus;
  completion_criteria: string[];
  career_relevance: string;
  mission_brief?: string;
  rubric: RubricCriterion[];
  submission?: MilestoneSubmission;
}

export interface RoadmapEdge {
  id: string;
  source: string;
  target: string;
}

export interface CareerRoadmap {
  id: string;
  goal: string;
  target_role: string;
  summary: string;
  current_skills: string[];
  weekly_hours: number;
  target_months: number;
  budget_tier: 'free_only' | 'standard' | 'flexible';
  experience_level: 'beginner' | 'intermediate' | 'career_switcher';
  total_estimated_hours: number;
  timeline_assumptions: string;
  assumptions: string[];
  milestones: Milestone[];
  edges: RoadmapEdge[];
  createdAt: string;
  updatedAt: string;
  generationSource: 'gemini-live' | 'validated-curated';
  revisionCount: number;
}

export interface MultiverseScenario {
  id: string;
  name: string;
  hypothesis: string;
  constraints: {
    weekly_hours: number;
    target_months: number;
    target_role?: string;
    known_skills?: string[];
    free_resources_only?: boolean;
  };
  proposedRoadmap: CareerRoadmap;
  diff: {
    addedMilestoneIds: string[];
    removedMilestoneIds: string[];
    modifiedMilestoneIds: string[];
    preservedMilestoneIds: string[];
    addedMilestones: Milestone[];
    removedMilestones: Milestone[];
    modifiedMilestones: { original: Milestone; proposed: Milestone; changes: string[] }[];
    preservedMilestones: Milestone[];
    effortDeltaHours: number;
    timelineDeltaMonths: number;
    feasibilityWarning?: string;
    transferableSkills: string[];
    bottlenecks: string[];
    tradeoffs: string[];
  };
  status: 'draft' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface SteppingStonePathway {
  id: string;
  role: string;
  title: string;
  steppingStoneRationale: string;
  typicalTimelineMonths: number;
  transferableSkills: string[];
  bridgeSkills: string[];
  recommendedProjects: string[];
  estimatedLearningHours: number;
  prerequisites: string[];
  assumptionsAndLimitations: string[];
}

export interface RealityRadarRequirement {
  skill: string;
  frequencyRatio: string; // e.g. "8 of 10"
  percentage: number;
  importance: 'Must Have' | 'Preferred' | 'Differentiating';
  representativeSources: {
    company: string;
    context: string;
    link: string;
    date: string;
  }[];
  matchedMilestoneId?: string;
  inCurrentRoadmap: boolean;
}

export interface RealityRadarRoleData {
  role: string;
  sampleSize: number;
  retrievalDate: string;
  sourceGeography: string;
  dataDisclaimer: string;
  topRequirements: RealityRadarRequirement[];
  commonTechnologies: string[];
  experienceExpectations: string;
}
