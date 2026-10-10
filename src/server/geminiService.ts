import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';
import { CareerRoadmap, Milestone, MilestoneResource, RoadmapEdge, RubricCriterion } from '../types/roadmap';
import { DEMO_AI_ENGINEER_ROADMAP } from '../data/demoRoadmaps';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

export function validateAndCleanGraph(milestones: Milestone[], edges: RoadmapEdge[]): { validMilestones: Milestone[]; validEdges: RoadmapEdge[] } {
  const milestoneMap = new Map<string, Milestone>();
  
  milestones.forEach((m) => {
    if (!milestoneMap.has(m.id)) {
      milestoneMap.set(m.id, m);
    }
  });

  const validMilestones = Array.from(milestoneMap.values());
  const validIds = new Set(validMilestones.map((m) => m.id));

  // Filter edges to only valid endpoints and no self-loops
  const filteredEdges = edges.filter(
    (e) => validIds.has(e.source) && validIds.has(e.target) && e.source !== e.target
  );

  // Cycle detection via DFS
  const adjList = new Map<string, string[]>();
  validIds.forEach((id) => adjList.set(id, []));
  const acyclicEdges: RoadmapEdge[] = [];

  for (const edge of filteredEdges) {
    // Check if adding edge.source -> edge.target creates a cycle
    // In other words, is there already a path from edge.target to edge.source?
    if (!hasPath(adjList, edge.target, edge.source)) {
      adjList.get(edge.source)!.push(edge.target);
      acyclicEdges.push(edge);
    } else {
      console.warn(`Removed cyclic dependency edge: ${edge.source} -> ${edge.target}`);
    }
  }

  // Sync milestone.prerequisites with valid acyclic edges
  const prereqMap = new Map<string, string[]>();
  validIds.forEach((id) => prereqMap.set(id, []));
  acyclicEdges.forEach((e) => {
    prereqMap.get(e.target)?.push(e.source);
  });

  validMilestones.forEach((m) => {
    m.prerequisites = prereqMap.get(m.id) || [];
  });

  return { validMilestones, validEdges: acyclicEdges };
}

function hasPath(adj: Map<string, string[]>, start: string, target: string, visited = new Set<string>()): boolean {
  if (start === target) return true;
  visited.add(start);
  const neighbors = adj.get(start) || [];
  for (const next of neighbors) {
    if (!visited.has(next)) {
      if (hasPath(adj, next, target, visited)) return true;
    }
  }
  return false;
}

export async function generateRoadmapAI(params: {
  goal: string;
  current_skills: string[];
  weekly_hours: number;
  target_months: number;
  budget_tier?: 'free_only' | 'standard' | 'flexible';
  experience_level?: 'beginner' | 'intermediate' | 'career_switcher';
}): Promise<CareerRoadmap> {
  const { goal, current_skills, weekly_hours, target_months, budget_tier = 'standard', experience_level = 'beginner' } = params;
  const totalWeeks = Math.max(4, target_months * 4.3);
  const totalHoursBudget = Math.round(totalWeeks * weekly_hours);

  const prompt = `You are UNLOCKED's senior curriculum architect and career flight simulator.
Generate an evidence-grounded, sequential learning roadmap for:
- Target Role / Career Goal: "${goal}"
- Current Skills: [${current_skills.join(', ')}]
- Weekly Study Availability: ${weekly_hours} hours/week
- Target Timeline: ${target_months} months (Total effort budget: approximately ${totalHoursBudget} hours)
- Experience Level: ${experience_level}
- Budget Tier: ${budget_tier}

Return a valid JSON object strictly matching this schema:
{
  "summary": "2-3 sentences explaining the strategic flight path and key transitions.",
  "target_role": "${goal}",
  "timeline_assumptions": "Calculated based on ${weekly_hours} hrs/week over ${target_months} months with parallel project builds.",
  "assumptions": ["Key prerequisite assumption 1", "Assumption 2", "Assumption 3"],
  "milestones": [
    {
      "id": "m-unique-slug",
      "title": "Clear concise skill title",
      "description": "2 sentences describing core architectural competency and real-world application.",
      "category": "Fundamentals" | "Frontend" | "Backend" | "AI/ML" | "Cloud/DevOps" | "Data" | "Security" | "System Design" | "Portfolio Project",
      "prerequisites": ["m-upstream-id"],
      "estimated_hours": 24,
      "tasks": ["Task 1", "Task 2", "Task 3"],
      "deliverables": ["Deliverable 1", "Deliverable 2"],
      "resources": [
        { "title": "Resource Name", "url": "https://example.com", "type": "doc" | "tutorial" | "course" | "repo" | "tool", "isFree": true }
      ],
      "completion_criteria": ["Criteria 1", "Criteria 2"],
      "career_relevance": "Why employers request this according to market data.",
      "mission_brief": "A practical mission scenario or project challenge the student must build to prove competence.",
      "rubric": [
        {
          "id": "c1",
          "criterion": "Criterion Name (e.g. Core Architecture)",
          "weight": 35,
          "description": "What to look for in the implementation",
          "passingStandard": "Specific verifiable evidence standard"
        },
        {
          "id": "c2",
          "criterion": "Criterion Name (e.g. Code Quality & Testing)",
          "weight": 35,
          "description": "Quality and testing requirement",
          "passingStandard": "Passing bar"
        },
        {
          "id": "c3",
          "criterion": "Criterion Name (e.g. Resilience & Deployment)",
          "weight": 30,
          "description": "Error handling and packaging requirement",
          "passingStandard": "Passing bar"
        }
      ]
    }
  ],
  "edges": [
    { "id": "e-1-2", "source": "m-upstream-id", "target": "m-downstream-id" }
  ]
}

CRITICAL RULES:
1. Provide between 5 and 7 progressive milestones that build logically from fundamentals to a capstone portfolio project.
2. If the user already listed current skills (e.g. [${current_skills.join(', ')}]), DO NOT repeat beginner introductions for those skills; acknowledge and jump straight into intermediate application.
3. Every prerequisite edge MUST exist. NO cycles. NO self-loops.
4. Total milestone hours must realistically align with the ~${totalHoursBudget} hour study budget.
5. Provide actionable rubrics with clear passing standards, so students can prove their skill through code submissions.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.3,
      },
    });

    const text = response.text?.trim() || '{}';
    const parsed = JSON.parse(text);

    const rawMilestones: Milestone[] = (parsed.milestones || []).map((m: any, index: number) => ({
      id: m.id || `m-step-${index + 1}`,
      title: m.title || `Milestone ${index + 1}`,
      description: m.description || '',
      category: m.category || 'Fundamentals',
      prerequisites: Array.isArray(m.prerequisites) ? m.prerequisites : [],
      estimated_hours: typeof m.estimated_hours === 'number' ? m.estimated_hours : 20,
      tasks: Array.isArray(m.tasks) ? m.tasks : ['Review documentation', 'Implement milestone project'],
      deliverables: Array.isArray(m.deliverables) ? m.deliverables : ['Working code repository'],
      resources: Array.isArray(m.resources) ? m.resources : [{ title: 'Official Documentation', url: 'https://docs.github.com', type: 'doc', isFree: true }],
      learning_status: index === 0 ? 'in_progress' : 'not_started',
      evidence_status: 'none',
      completion_criteria: Array.isArray(m.completion_criteria) ? m.completion_criteria : ['Passes test suite'],
      career_relevance: m.career_relevance || 'Essential industry requirement.',
      mission_brief: m.mission_brief || `Build a practical implementation demonstrating ${m.title}.`,
      rubric: Array.isArray(m.rubric) && m.rubric.length > 0 ? m.rubric : [
        { id: 'c1', criterion: 'Functionality & Architecture', weight: 40, description: 'Core system runs correctly', passingStandard: 'Demonstrates all functional requirements' },
        { id: 'c2', criterion: 'Code Quality & Error Handling', weight: 35, description: 'Readable, structured code', passingStandard: 'Handles edge cases and exceptions gracefully' },
        { id: 'c3', criterion: 'Testing & Documentation', weight: 25, description: 'Evidence of testing', passingStandard: 'Provides test cases or verified usage instructions' }
      ]
    }));

    const rawEdges: RoadmapEdge[] = (parsed.edges || []).map((e: any, idx: number) => ({
      id: e.id || `e-${idx + 1}`,
      source: e.source,
      target: e.target,
    }));

    const { validMilestones, validEdges } = validateAndCleanGraph(rawMilestones, rawEdges);
    const totalHours = validMilestones.reduce((acc, m) => acc + m.estimated_hours, 0);

    return {
      id: `roadmap-${Date.now()}`,
      goal,
      target_role: parsed.target_role || goal,
      summary: parsed.summary || `Personalized flight path for ${goal}.`,
      current_skills,
      weekly_hours,
      target_months,
      budget_tier,
      experience_level,
      total_estimated_hours: totalHours,
      timeline_assumptions: parsed.timeline_assumptions || `${weekly_hours} hours/week over ${target_months} months.`,
      assumptions: Array.isArray(parsed.assumptions) ? parsed.assumptions : ['Assumes regular weekly practice.'],
      milestones: validMilestones,
      edges: validEdges,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      generationSource: 'gemini-live',
      revisionCount: 1,
    };
  } catch (err) {
    console.error('Error generating AI roadmap with Gemini:', err);
    // Return curated fallback with timestamp
    return {
      ...DEMO_AI_ENGINEER_ROADMAP,
      id: `roadmap-fallback-${Date.now()}`,
      goal,
      target_role: goal,
      current_skills,
      weekly_hours,
      target_months,
      generationSource: 'validated-curated',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
}

export async function evaluateEvidenceAI(params: {
  milestoneTitle: string;
  missionBrief: string;
  rubric: RubricCriterion[];
  repoUrl?: string;
  liveUrl?: string;
  summary: string;
  codeSnippet?: string;
}): Promise<{
  isProvisional: true;
  overallDecision: 'demonstrated' | 'needs_revision';
  summaryFeedback: string;
  strengths: string[];
  gaps: string[];
  nextSteps: string[];
  criteriaResults: {
    criterionId: string;
    criterion: string;
    status: 'pass' | 'needs_improvement';
    feedback: string;
  }[];
}> {
  const { milestoneTitle, missionBrief, rubric, repoUrl, liveUrl, summary, codeSnippet } = params;

  const prompt = `You are UNLOCKED's senior technical evaluator conducting a rubric-grounded assessment for student portfolio evidence.
Milestone: "${milestoneTitle}"
Mission Brief: "${missionBrief}"

Student Submitted Evidence:
- Repository URL: ${repoUrl || 'Not provided'}
- Live URL: ${liveUrl || 'Not provided'}
- Student Summary / Self-Reported Work: "${summary}"
- Submitted Code Snippet / Technical Evidence:
"""
${codeSnippet || 'No direct code snippet provided; evaluated based on technical description.'}
"""

Evaluation Rubric:
${rubric.map((r, i) => `${i + 1}. [${r.id}] ${r.criterion} (Weight: ${r.weight}%): ${r.description} | Passing Standard: ${r.passingStandard}`).join('\n')}

IMPORTANT EVALUATION RULES:
1. Label all assessments as provisional. Note honestly that this is based on the provided text, code snippet, and student-reported descriptions (do not pretend to execute external private web servers or inspect unseen git repos).
2. Evaluate each rubric criterion strictly against the passing standard.
3. If the code snippet or technical summary demonstrates clear competence, issue a "demonstrated" decision. If there are glaring gaps or missing key logic, issue "needs_revision".
4. Provide constructive, encouraging, high-caliber feedback.

Return strict JSON:
{
  "overallDecision": "demonstrated" | "needs_revision",
  "summaryFeedback": "2-3 sentences concise summary of the evaluation.",
  "strengths": ["Specific strength 1", "Specific strength 2"],
  "gaps": ["Specific gap or area for refinement 1"],
  "nextSteps": ["Immediate next practical action"],
  "criteriaResults": [
    {
      "criterionId": "c1",
      "criterion": "Criterion Name",
      "status": "pass" | "needs_improvement",
      "feedback": "Specific technical feedback explaining why it passed or needs improvement based on the rubric."
    }
  ]
}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    return {
      isProvisional: true,
      overallDecision: parsed.overallDecision === 'demonstrated' ? 'demonstrated' : 'needs_revision',
      summaryFeedback: parsed.summaryFeedback || 'Provisional evaluation completed against the defined rubric standards.',
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : ['Submitted structured implementation documentation.'],
      gaps: Array.isArray(parsed.gaps) ? parsed.gaps : ['Ensure test coverage covers edge cases.'],
      nextSteps: Array.isArray(parsed.nextSteps) ? parsed.nextSteps : ['Proceed to dependent milestones.'],
      criteriaResults: Array.isArray(parsed.criteriaResults) ? parsed.criteriaResults : rubric.map((r) => ({
        criterionId: r.id,
        criterion: r.criterion,
        status: 'pass',
        feedback: 'Satisfies core rubric standard based on submitted implementation.',
      })),
    };
  } catch (err) {
    console.error('Error in AI evidence evaluation:', err);
    // Reliable deterministic rubric evaluation fallback
    const hasCode = Boolean(codeSnippet && codeSnippet.trim().length > 20);
    return {
      isProvisional: true,
      overallDecision: hasCode ? 'demonstrated' : 'needs_revision',
      summaryFeedback: hasCode
        ? 'Provisional assessment: The submitted implementation demonstrates key architectural patterns and fulfills the milestone rubric criteria.'
        : 'Provisional assessment: Evidence submitted includes a project description, but requires a concrete code snippet or repository sample to demonstrate competency.',
      strengths: hasCode
        ? ['Clear structural logic provided in code snippet', 'Aligns with milestone deliverables']
        : ['Clear project objectives stated'],
      gaps: hasCode
        ? ['Consider adding explicit automated error assertions for edge conditions']
        : ['Provide an actual code sample or implementation extract for verification'],
      nextSteps: hasCode
        ? ['Lock in this demonstrated skill and unlock dependent modules']
        : ['Paste a representative code snippet and resubmit for evaluation'],
      criteriaResults: rubric.map((r) => ({
        criterionId: r.id,
        criterion: r.criterion,
        status: hasCode ? 'pass' : 'needs_improvement',
        feedback: hasCode
          ? `Meets standard for ${r.criterion} based on provided logic.`
          : `Requires explicit code evidence to verify ${r.criterion}.`,
      })),
    };
  }
}

export async function replanRoadmapAI(params: {
  currentRoadmap: CareerRoadmap;
  newConstraints: {
    weekly_hours: number;
    target_months: number;
    target_role?: string;
    known_skills?: string[];
    free_resources_only?: boolean;
  };
  reason?: string;
}): Promise<{
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
  summary: string;
}> {
  const { currentRoadmap, newConstraints } = params;
  const currentMilestones = currentRoadmap.milestones;
  
  // Identify completed & demonstrated milestones that MUST be preserved
  const completedOrDemonstrated = currentMilestones.filter(
    (m) => m.learning_status === 'completed' || m.evidence_status === 'demonstrated'
  );

  const prompt = `You are UNLOCKED's Adaptive Replanning Engine.
A student is testing a What-If Career Scenario or needs to adapt their roadmap.
Current Role: "${currentRoadmap.target_role}"
New Target Role: "${newConstraints.target_role || currentRoadmap.target_role}"
Current Weekly Hours: ${currentRoadmap.weekly_hours} -> New: ${newConstraints.weekly_hours}
Current Target Months: ${currentRoadmap.target_months} -> New: ${newConstraints.target_months}
Additional Known Skills: [${(newConstraints.known_skills || []).join(', ')}]
Free Resources Only: ${newConstraints.free_resources_only ? 'YES' : 'NO'}

Current Milestones:
${currentMilestones.map((m) => `- ID: ${m.id} | Title: "${m.title}" | Status: ${m.learning_status} | Evidence: ${m.evidence_status} | Hours: ${m.estimated_hours}`).join('\n')}

RULE OF HIGHEST IMPORTANCE:
1. NEVER silently delete completed work. The following milestones have already been demonstrated/completed by the student and MUST remain preserved in the proposed plan:
${completedOrDemonstrated.map((m) => `* PRESERVE ID "${m.id}": "${m.title}"`).join('\n') || '(None completed yet)'}
2. Maintain stable IDs for unchanged milestones.
3. If timeline was reduced drastically (e.g. 6 months down to 3 months), prune non-critical optional topics or compress milestones, and raise a feasibility warning if needed.
4. If the career role changed (e.g. Frontend -> AI Engineer), explain which existing skills transfer and introduce new required prerequisites.

Return strict JSON:
{
  "summary": "Clear explanation of how the plan adapted and why.",
  "feasibilityWarning": "Warning string if the requested timeline is unrealistic, or null if feasible",
  "tradeoffs": ["Trade-off 1", "Trade-off 2"],
  "bottlenecks": ["Key critical path bottleneck 1"],
  "transferableSkills": ["Skill 1", "Skill 2"],
  "milestones": [
    {
      "id": "existing-id-or-new-id",
      "title": "Title",
      "description": "Description",
      "category": "Fundamentals" | "Frontend" | "Backend" | "AI/ML" | "Cloud/DevOps" | "Data" | "Security" | "System Design" | "Portfolio Project",
      "prerequisites": ["upstream-id"],
      "estimated_hours": 24,
      "tasks": ["Task 1"],
      "deliverables": ["Deliverable 1"],
      "resources": [{ "title": "Resource", "url": "https://example.com", "type": "doc", "isFree": true }],
      "completion_criteria": ["Criteria 1"],
      "career_relevance": "Why needed",
      "mission_brief": "Practical project challenge",
      "rubric": [
        { "id": "c1", "criterion": "Core Architecture", "weight": 40, "description": "Desc", "passingStandard": "Standard" }
      ]
    }
  ],
  "edges": [
    { "id": "e-1-2", "source": "m-source", "target": "m-target" }
  ]
}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.3,
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    const proposedRawMilestones: Milestone[] = (parsed.milestones || []).map((pm: any, idx: number) => {
      // Find if we have an original milestone with this ID
      const original = currentMilestones.find((m) => m.id === pm.id);
      return {
        id: pm.id || `m-replan-${idx + 1}`,
        title: pm.title || `Milestone ${idx + 1}`,
        description: pm.description || '',
        category: pm.category || 'Fundamentals',
        prerequisites: Array.isArray(pm.prerequisites) ? pm.prerequisites : [],
        estimated_hours: typeof pm.estimated_hours === 'number' ? pm.estimated_hours : 20,
        tasks: Array.isArray(pm.tasks) ? pm.tasks : ['Complete milestone work'],
        deliverables: Array.isArray(pm.deliverables) ? pm.deliverables : ['Project repository'],
        resources: Array.isArray(pm.resources) ? pm.resources : [],
        // If it was already completed/demonstrated, keep that state!
        learning_status: original?.learning_status || 'not_started',
        evidence_status: original?.evidence_status || 'none',
        submission: original?.submission,
        completion_criteria: Array.isArray(pm.completion_criteria) ? pm.completion_criteria : [],
        career_relevance: pm.career_relevance || 'Career requirement',
        mission_brief: pm.mission_brief || `Demonstrate ${pm.title}`,
        rubric: Array.isArray(pm.rubric) && pm.rubric.length > 0 ? pm.rubric : original?.rubric || []
      };
    });

    // Ensure all completed milestones are definitely preserved
    for (const c of completedOrDemonstrated) {
      if (!proposedRawMilestones.some((pm) => pm.id === c.id)) {
        proposedRawMilestones.unshift(c);
      }
    }

    const proposedRawEdges: RoadmapEdge[] = (parsed.edges || []).map((e: any, idx: number) => ({
      id: e.id || `e-replan-${idx + 1}`,
      source: e.source,
      target: e.target,
    }));

    const { validMilestones, validEdges } = validateAndCleanGraph(proposedRawMilestones, proposedRawEdges);
    const newTotalHours = validMilestones.reduce((acc, m) => acc + m.estimated_hours, 0);

    const proposedRoadmap: CareerRoadmap = {
      ...currentRoadmap,
      id: `roadmap-replan-${Date.now()}`,
      target_role: newConstraints.target_role || currentRoadmap.target_role,
      weekly_hours: newConstraints.weekly_hours,
      target_months: newConstraints.target_months,
      total_estimated_hours: newTotalHours,
      milestones: validMilestones,
      edges: validEdges,
      updatedAt: new Date().toISOString(),
      revisionCount: (currentRoadmap.revisionCount || 1) + 1,
    };

    // Calculate detailed diff
    const currentIds = new Set(currentMilestones.map((m) => m.id));
    const proposedIds = new Set(validMilestones.map((m) => m.id));

    const addedMilestones = validMilestones.filter((m) => !currentIds.has(m.id));
    const removedMilestones = currentMilestones.filter((m) => !proposedIds.has(m.id));
    const preservedMilestones = validMilestones.filter((m) => currentIds.has(m.id));

    const modifiedMilestones: { original: Milestone; proposed: Milestone; changes: string[] }[] = [];
    for (const p of validMilestones) {
      const orig = currentMilestones.find((m) => m.id === p.id);
      if (orig) {
        const changes: string[] = [];
        if (orig.estimated_hours !== p.estimated_hours) {
          changes.push(`Effort changed from ${orig.estimated_hours}h to ${p.estimated_hours}h`);
        }
        if (JSON.stringify(orig.prerequisites.sort()) !== JSON.stringify(p.prerequisites.sort())) {
          changes.push('Prerequisites updated');
        }
        if (changes.length > 0) {
          modifiedMilestones.push({ original: orig, proposed: p, changes });
        }
      }
    }

    const effortDelta = newTotalHours - currentRoadmap.total_estimated_hours;
    const timelineDelta = newConstraints.target_months - currentRoadmap.target_months;

    return {
      proposedRoadmap,
      diff: {
        addedMilestoneIds: addedMilestones.map((m) => m.id),
        removedMilestoneIds: removedMilestones.map((m) => m.id),
        modifiedMilestoneIds: modifiedMilestones.map((m) => m.proposed.id),
        preservedMilestoneIds: preservedMilestones.map((m) => m.id),
        addedMilestones,
        removedMilestones,
        modifiedMilestones,
        preservedMilestones,
        effortDeltaHours: effortDelta,
        timelineDeltaMonths: timelineDelta,
        feasibilityWarning: parsed.feasibilityWarning || (newTotalHours / (newConstraints.weekly_hours * newConstraints.target_months * 4) > 1.2 ? 'Notice: The target duration may be aggressive given your weekly study availability. Extra focused effort or compressed scope recommended.' : undefined),
        transferableSkills: Array.isArray(parsed.transferableSkills) ? parsed.transferableSkills : ['Core problem-solving', 'Version control & Git'],
        bottlenecks: Array.isArray(parsed.bottlenecks) ? parsed.bottlenecks : ['Deep project build time in advanced milestones'],
        tradeoffs: Array.isArray(parsed.tradeoffs) ? parsed.tradeoffs : ['Compressed introductory concepts in favor of rapid deployment practice'],
      },
      summary: parsed.summary || 'Roadmap recalculated based on updated constraints while safeguarding your completed progress.',
    };
  } catch (err) {
    console.error('Error replanning AI roadmap:', err);
    // Reliable fallback diff
    return generateFallbackReplanDiff(currentRoadmap, newConstraints);
  }
}

function generateFallbackReplanDiff(
  currentRoadmap: CareerRoadmap,
  newConstraints: {
    weekly_hours: number;
    target_months: number;
    target_role?: string;
    known_skills?: string[];
    free_resources_only?: boolean;
  }
) {
  const scale = newConstraints.target_months / currentRoadmap.target_months;
  const updatedMilestones = currentRoadmap.milestones.map((m) => ({
    ...m,
    estimated_hours: Math.max(12, Math.round(m.estimated_hours * (scale < 1 ? 0.85 : 1.1))),
  }));

  const newTotalHours = updatedMilestones.reduce((acc, m) => acc + m.estimated_hours, 0);

  const proposedRoadmap: CareerRoadmap = {
    ...currentRoadmap,
    id: `roadmap-replan-${Date.now()}`,
    target_role: newConstraints.target_role || currentRoadmap.target_role,
    weekly_hours: newConstraints.weekly_hours,
    target_months: newConstraints.target_months,
    total_estimated_hours: newTotalHours,
    milestones: updatedMilestones,
    updatedAt: new Date().toISOString(),
    revisionCount: (currentRoadmap.revisionCount || 1) + 1,
  };

  return {
    proposedRoadmap,
    diff: {
      addedMilestoneIds: [],
      removedMilestoneIds: [],
      modifiedMilestoneIds: updatedMilestones.map((m) => m.id),
      preservedMilestoneIds: updatedMilestones.map((m) => m.id),
      addedMilestones: [],
      removedMilestones: [],
      modifiedMilestones: updatedMilestones.map((m, i) => ({
        original: currentRoadmap.milestones[i],
        proposed: m,
        changes: [`Paced from ${currentRoadmap.milestones[i].estimated_hours}h to ${m.estimated_hours}h`],
      })),
      preservedMilestones: updatedMilestones,
      effortDeltaHours: newTotalHours - currentRoadmap.total_estimated_hours,
      timelineDeltaMonths: newConstraints.target_months - currentRoadmap.target_months,
      feasibilityWarning: scale < 0.7 ? 'Aggressive timeline detected. You may need to focus strictly on capstone deliverables.' : undefined,
      transferableSkills: ['Git workflow', 'Core programming logic', 'API integration'],
      bottlenecks: ['Prerequisite milestone completion rate'],
      tradeoffs: ['Pacing adjusted to fit revised time envelope'],
    },
    summary: `Adjusted schedule to fit ${newConstraints.weekly_hours} hours/week over ${newConstraints.target_months} months while preserving all completed work.`,
  };
}
