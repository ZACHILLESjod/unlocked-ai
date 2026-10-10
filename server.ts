import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { generateRoadmapAI, evaluateEvidenceAI, replanRoadmapAI } from './src/server/geminiService';
import { getRealityRadarForRole } from './src/data/curatedJobMarket';
import { DEMO_AI_ENGINEER_STEPPING_STONES } from './src/data/demoRoadmaps';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// 1. POST /api/roadmap/generate
app.post('/api/roadmap/generate', async (req, res) => {
  try {
    const { goal, current_skills = [], weekly_hours = 10, target_months = 6, budget_tier, experience_level } = req.body;
    
    if (!goal || typeof goal !== 'string') {
      return res.status(400).json({ error: 'Goal is required.' });
    }

    const roadmap = await generateRoadmapAI({
      goal,
      current_skills: Array.isArray(current_skills) ? current_skills : [current_skills],
      weekly_hours: Number(weekly_hours) || 10,
      target_months: Number(target_months) || 6,
      budget_tier,
      experience_level,
    });

    return res.json(roadmap);
  } catch (error: any) {
    console.error('Roadmap generate error:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate career roadmap' });
  }
});

// 2. POST /api/roadmap/milestone-advice
app.post('/api/roadmap/milestone-advice', async (req, res) => {
  try {
    const {
      goal,
      current_skills = [],
      milestone_title,
      milestone_description,
      prerequisites_status,
      weekly_hours = 10,
      current_progress,
    } = req.body;

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
    });

    const prompt = `You are UNLOCKED's AI Career Mentor advising a student on the milestone: "${milestone_title}".
Target Career: "${goal}"
Milestone Context: "${milestone_description}"
Prerequisites Status: "${prerequisites_status || 'Satisfied'}"
Weekly Study Time: ${weekly_hours} hrs/week
Current Progress: "${current_progress || 'Beginning'}"
Current Student Skills: [${current_skills.join(', ')}]

Provide tactical, high-leverage flight advice.
Return strict JSON:
{
  "why_it_matters": "Why employers evaluate this specific skill in technical interviews.",
  "key_concepts": ["Concept 1", "Concept 2", "Concept 3"],
  "ordered_tasks": [
    "Step 1: Foundational setup or architecture decision",
    "Step 2: Core implementation",
    "Step 3: Edge cases, tests, and deployment"
  ],
  "practical_project": {
    "title": "Clear project name",
    "deliverable": "Specific artifact to build and show",
    "estimated_hours": 15
  },
  "learning_resources": [
    { "title": "Resource title", "url": "https://example.com", "type": "doc", "isFree": true }
  ],
  "completion_criteria": [
    "Criteria 1: Quantifiable functional standard",
    "Criteria 2: Code quality standard"
  ],
  "common_pitfalls": [
    "Mistake beginners make and how to avoid it 1",
    "Mistake beginners make and how to avoid it 2"
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json', temperature: 0.2 },
    });

    const data = JSON.parse(response.text?.trim() || '{}');
    return res.json(data);
  } catch (error: any) {
    console.error('Milestone advice error:', error);
    // Reliable fallback response
    return res.json({
      why_it_matters: 'This milestone builds essential engineering discipline directly evaluated in technical portfolio screens.',
      key_concepts: ['Architectural design', 'Edge-case handling', 'Verification testing'],
      ordered_tasks: [
        'Study official reference documentation and setup project scaffolding.',
        'Implement core functional logic adhering to clean coding standards.',
        'Write integration tests and prepare deployment evidence.'
      ],
      practical_project: {
        title: `${req.body.milestone_title || 'Core'} Implementation Sprint`,
        deliverable: 'A working repository with README documentation, unit tests, and CI automation.',
        estimated_hours: 16
      },
      learning_resources: [
        { title: 'Official Documentation & Guides', url: 'https://docs.github.com', type: 'doc', isFree: true }
      ],
      completion_criteria: [
        'Code passes automated linters and unit test suites.',
        'Demonstrates clear handling of error and network exceptions.'
      ],
      common_pitfalls: [
        'Skipping unit tests until after completion rather than testing incrementally.',
        'Focusing too much on superficial styling before rock-solid business logic.'
      ]
    });
  }
});

// 3. POST /api/roadmap/replan
app.post('/api/roadmap/replan', async (req, res) => {
  try {
    const { current_roadmap, new_constraints, reason } = req.body;
    if (!current_roadmap) {
      return res.status(400).json({ error: 'current_roadmap is required.' });
    }

    const result = await replanRoadmapAI({
      currentRoadmap: current_roadmap,
      newConstraints: new_constraints || {
        weekly_hours: current_roadmap.weekly_hours,
        target_months: current_roadmap.target_months,
      },
      reason,
    });

    return res.json(result);
  } catch (error: any) {
    console.error('Roadmap replan error:', error);
    return res.status(500).json({ error: error.message || 'Failed to replan roadmap' });
  }
});

// 4. POST /api/roadmap/evaluate-evidence
app.post('/api/roadmap/evaluate-evidence', async (req, res) => {
  try {
    const { milestone_title, mission_brief, rubric, repo_url, live_url, summary, code_snippet } = req.body;

    const evaluation = await evaluateEvidenceAI({
      milestoneTitle: milestone_title || 'Milestone Evidence',
      missionBrief: mission_brief || 'Demonstrate competency',
      rubric: Array.isArray(rubric) ? rubric : [],
      repoUrl: repo_url,
      liveUrl: live_url,
      summary: summary || '',
      codeSnippet: code_snippet || '',
    });

    return res.json(evaluation);
  } catch (error: any) {
    console.error('Evidence evaluation error:', error);
    return res.status(500).json({ error: error.message || 'Failed to evaluate evidence' });
  }
});

// 5. GET /api/reality-radar/:role
app.get('/api/reality-radar/:role', (req, res) => {
  const role = req.params.role || 'ai-engineer';
  const marketData = getRealityRadarForRole(role);
  return res.json(marketData);
});

// 6. GET /api/opportunity-radar/:role
app.get('/api/opportunity-radar/:role', (req, res) => {
  return res.json(DEMO_AI_ENGINEER_STEPPING_STONES);
});

// Mount Vite or serve static assets
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[UNLOCKED] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[UNLOCKED] Failed to start server:', err);
});
