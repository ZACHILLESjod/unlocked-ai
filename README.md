# UNLOCKED — AI Career Flight Simulator
> **“Don't just plan your career. Test-drive it.”**

UNLOCKED is a full-stack, AI-powered Career Flight Simulator that transforms a student's dream job into a personalized, interactive, evidence-driven career journey. Rather than relying on generic chatbots or static checklists, UNLOCKED provides dynamic dependency graphs, portfolio-backed SkillProof rubrics, What-If Multiverse simulations, and traceable employer market intelligence.

---

## 🌟 The Five Signature Features

### 1. SkillProof — Your Portfolio Becomes Your Passport
Distinguishes what a student claims to know from what they can demonstrate:
- **Four Distinct States:** `Not started` · `Learning` · `Evidence submitted` · `Demonstrated`.
- **Mission Briefs & Rubrics:** Each milestone provides deliverables and a multi-criteria evaluation rubric with weights and passing standards.
- **Provisional AI Assessments:** Evaluates student code snippets and implementation summaries against rubric criteria, returning strengths, gaps, and actionable next steps.
- **Dependency Unlocking:** Moving a skill to Demonstrated automatically satisfies prerequisites and unlocks downstream milestones.

### 2. Career Multiverse — Explore Alternative Futures Before Choosing One
A What-If Career Simulation workspace:
- **Interactive Constraint Tuning:** Adjust weekly study hours (1–40), target timeline (1–24 months), target career goal, or recognized known skills.
- **Visual Graph Diff:** Highlights added (+), skipped (-), paced (~), and preserved (=) nodes with delta calculations for total effort and calendar duration.
- **Work Safeguard:** Preserves 100% of completed milestones and demonstrated skills across any scenario.
- **Accept / Reject Actions:** Accept applies the validated proposal to the active flight plan; Reject preserves original progress.

### 3. Reality Radar — Career Planning Grounded in Employer Evidence
Connects roadmap milestones to verified job market requirements:
- **Curated Ground-Truth Index:** Sampled from genuine public job specifications across leading tech organizations (Anthropic, Stripe, Vercel, Databricks, Red Hat, Cloudflare).
- **Verified Frequencies:** Ratios and percentages calculated from the sample (e.g., "Supported by 9 of 10 sampled specs").
- **Traceable Citations:** Direct excerpts, publication dates, and source links.
- **Skill Coverage & Gap Analysis:** Instantly highlights which employer demands are covered by your flight path vs. identified skill gaps.

### 4. Opportunity Radar — Hidden Stepping Stones to Your Dream Job
Reveals high-leverage intermediate bridge roles:
- Shows realistic intermediate milestones (e.g., Target: AI Engineer → Bridge roles: Python Backend Specialist, Data & Vector Pipeline Engineer, AI Evaluation Associate).
- Highlights transferable skills from your current profile, necessary bridge skills, and high-impact transition projects.
- One-click option to test-drive an intermediate pathway before tackling the ultimate destination.

### 5. Adaptive Roadmap Intelligence — Your Roadmap Evolves With You
- Evaluates existing roadmaps and updated constraints using a Directed Acyclic Graph (DAG) cycle-detection engine.
- Skips redundant introductory concepts for recognized skills while maintaining prerequisite integrity.
- Explains trade-offs and bottlenecks with stable milestone identifiers.

---

## ⏱ 3-Minute Hackathon Demo Script

- **0:00–0:25 — The Goal & Baseline:** Open Onboarding, select "AI Engineer", enter "Basic Python", and set study parameters.
- **0:25–0:55 — The Flight Graph:** Explore the generated React Flow DAG canvas with zoom, pan, domain filters, and prerequisite highlighting.
- **0:55–1:35 — SkillProof:** Click a milestone (e.g. Async Python), inspect rubric criteria, paste a code excerpt, and click "Submit Evidence" to trigger provisional rubric evaluation and confetti unlock.
- **1:35–2:20 — Career Multiverse:** Click "What-If Simulator", test "What if I only have 3 months?", compare the side-by-side diff, and review feasibility warnings.
- **2:20–2:45 — Reality Radar & Opportunity Radar:** Inspect employer citations for Python & RAG, then explore intermediate bridge roles.
- **2:45–3:00 — The Impact:** Summarize how UNLOCKED delivers credible, evidence-driven career intelligence.

*(Use the floating "3-Min Demo Guide" button in the navigation bar to jump directly between these steps during live presentations).*

---

## 🛠 Architecture & Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, `@xyflow/react` (React Flow), Lucide icons, `canvas-confetti`.
- **Backend:** Express, Node.js, `tsx` server-side runtime with Vite middleware integration.
- **AI Engine:** `@google/genai` TypeScript SDK running server-side (`gemini-3.8-flash`) with structured schema generation and cycle-safe graph validation.
- **State & Persistence:** Auto-syncing `localStorage` persistence with JSON & Markdown export support.

### API Contracts

| Route | Method | Purpose |
|---|---|---|
| `/api/roadmap/generate` | `POST` | Generates a validated DAG roadmap for target goal, skills, and study constraints |
| `/api/roadmap/milestone-advice` | `POST` | Delivers tactical flight steps, practical projects, and common pitfalls |
| `/api/roadmap/replan` | `POST` | Re-evaluates roadmaps against constraint changes while preserving completed work |
| `/api/roadmap/evaluate-evidence` | `POST` | Conducts rubric-level provisional assessments on code and deliverables |
| `/api/reality-radar/:role` | `GET` | Returns curated employer requirements and traceable citations |
| `/api/opportunity-radar/:role` | `GET` | Returns stepping-stone career pathways and transferable skills |

---

## 🚀 Getting Started

1. **Clone & Install Dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment:**
   Ensure `GEMINI_API_KEY` is provided in `.env` (automatically injected in AI Studio Build).

3. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000`.

4. **Build for Production:**
   ```bash
   npm run build
   ```
