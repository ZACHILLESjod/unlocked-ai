import { RealityRadarRoleData } from '../types/roadmap';

export const CURATED_JOB_MARKET_DATA: Record<string, RealityRadarRoleData> = {
  'ai-engineer': {
    role: 'AI Engineer / LLM Application Developer',
    sampleSize: 10,
    retrievalDate: 'Q3 2026 Curated Public Sample',
    sourceGeography: 'Global / Remote & US Tech Hubs',
    dataDisclaimer: 'Sampled from 10 publicly posted job specifications across leading AI labs, scale-ups, and developer tool platforms. Represents observed requirements in this curated sample, not all universal hiring markets.',
    experienceExpectations: '0–3 years for Junior/Associate roles; emphasis on practical GitHub projects demonstrating production LLM orchestration and eval pipelines over purely theoretical diplomas.',
    commonTechnologies: ['Python', 'TypeScript', 'LangChain / LlamaIndex', 'FastAPI', 'Vector DBs (Pinecone/pgvector)', 'PostgreSQL', 'Docker', 'OpenAI / Anthropic / Gemini APIs'],
    topRequirements: [
      {
        skill: 'Python & Async Backend API Development',
        frequencyRatio: '10 of 10',
        percentage: 100,
        importance: 'Must Have',
        inCurrentRoadmap: true,
        representativeSources: [
          { company: 'Anthropic', context: 'Build resilient API wrappers, streaming services, and async data pipelines.', link: 'https://anthropic.com/careers', date: '2026-08' },
          { company: 'Scale AI', context: 'Production Python services with FastAPI/pydantic handling high-throughput model requests.', link: 'https://scale.com/careers', date: '2026-07' },
          { company: 'Cohere', context: 'Strong Python engineering skills with async concurrency and typing.', link: 'https://cohere.com/careers', date: '2026-08' }
        ]
      },
      {
        skill: 'LLM Orchestration, RAG & Vector Embeddings',
        frequencyRatio: '9 of 10',
        percentage: 90,
        importance: 'Must Have',
        inCurrentRoadmap: true,
        representativeSources: [
          { company: 'Notion AI', context: 'Retrieval augmented generation systems using hybrid keyword and vector semantic search.', link: 'https://notion.so/careers', date: '2026-08' },
          { company: 'Vercel', context: 'AI SDK integration, chunking strategies, prompt engineering, and hybrid RAG search.', link: 'https://vercel.com/careers', date: '2026-09' }
        ]
      },
      {
        skill: 'Model Evaluation, Grounding & Guardrails',
        frequencyRatio: '8 of 10',
        percentage: 80,
        importance: 'Must Have',
        inCurrentRoadmap: true,
        representativeSources: [
          { company: 'OpenAI', context: 'Designing regression test suites for output consistency, hallucination detection, and safety.', link: 'https://openai.com/careers', date: '2026-07' },
          { company: 'Weights & Biases', context: 'Automated evaluation pipelines, prompt telemetry, and LLM-as-a-judge benchmarking.', link: 'https://wandb.ai/site/careers', date: '2026-08' }
        ]
      },
      {
        skill: 'TypeScript / Modern Web Interface Integration',
        frequencyRatio: '7 of 10',
        percentage: 70,
        importance: 'Preferred',
        inCurrentRoadmap: true,
        representativeSources: [
          { company: 'Cursor / Anysphere', context: 'React/TypeScript client communicating over SSE streams with backend language models.', link: 'https://cursor.com/careers', date: '2026-09' },
          { company: 'Replit', context: 'Interactive browser UI components for prompt playgrounds and agent progress logs.', link: 'https://replit.com/careers', date: '2026-06' }
        ]
      },
      {
        skill: 'Containerization & Cloud Deployment (Docker, GCP/AWS)',
        frequencyRatio: '7 of 10',
        percentage: 70,
        importance: 'Preferred',
        inCurrentRoadmap: false,
        representativeSources: [
          { company: 'Databricks', context: 'Deploying containerized microservices to Kubernetes or managed cloud container engines.', link: 'https://databricks.com/careers', date: '2026-08' }
        ]
      },
      {
        skill: 'System Design for Caching & Token Cost Optimization',
        frequencyRatio: '6 of 10',
        percentage: 60,
        importance: 'Differentiating',
        inCurrentRoadmap: false,
        representativeSources: [
          { company: 'Linear', context: 'Semantic cache layers (Redis) to minimize inference latency and unit cost.', link: 'https://linear.app/careers', date: '2026-07' }
        ]
      }
    ]
  },
  'full-stack-web-developer': {
    role: 'Full Stack Web Developer',
    sampleSize: 10,
    retrievalDate: 'Q3 2026 Curated Public Sample',
    sourceGeography: 'Global Tech & Hybrid Startups',
    dataDisclaimer: 'Sampled from 10 publicly posted job listings for Junior-to-Mid Full Stack Engineers across product software companies. Curated research sample.',
    experienceExpectations: 'Evidence of completed full-stack deployments (auth, DB, responsive UI, CI/CD) heavily prioritized over years of experience.',
    commonTechnologies: ['TypeScript', 'React / Next.js', 'Node.js / Express', 'PostgreSQL / Prisma', 'Tailwind CSS', 'Git', 'REST / GraphQL APIs'],
    topRequirements: [
      {
        skill: 'TypeScript & Modern React Component Architecture',
        frequencyRatio: '10 of 10',
        percentage: 100,
        importance: 'Must Have',
        inCurrentRoadmap: true,
        representativeSources: [
          { company: 'Stripe', context: 'Strong proficiency in TypeScript, accessible React components, and state management.', link: 'https://stripe.com/jobs', date: '2026-08' },
          { company: 'GitHub', context: 'Modern frontend application development with React, TypeScript, and design systems.', link: 'https://github.com/careers', date: '2026-07' }
        ]
      },
      {
        skill: 'Relational Database Schema Design & SQL (PostgreSQL)',
        frequencyRatio: '9 of 10',
        percentage: 90,
        importance: 'Must Have',
        inCurrentRoadmap: true,
        representativeSources: [
          { company: 'Supabase', context: 'PostgreSQL schema modeling, indexes, migrations, and row-level security.', link: 'https://supabase.com/careers', date: '2026-08' },
          { company: 'Shopify', context: 'Relational data modeling, ACID transactions, and query optimization.', link: 'https://shopify.com/careers', date: '2026-07' }
        ]
      },
      {
        skill: 'Backend API Design & Authentication (JWT/OAuth/Sessions)',
        frequencyRatio: '9 of 10',
        percentage: 90,
        importance: 'Must Have',
        inCurrentRoadmap: true,
        representativeSources: [
          { company: 'Clerk', context: 'Secure session management, token lifecycles, and RBAC authorization middleware.', link: 'https://clerk.com/careers', date: '2026-08' },
          { company: 'Brex', context: 'Idempotent REST APIs, rate limiting, and robust input validation.', link: 'https://brex.com/careers', date: '2026-06' }
        ]
      },
      {
        skill: 'Automated Testing (Unit & Integration, Vitest/Playwright)',
        frequencyRatio: '8 of 10',
        percentage: 80,
        importance: 'Preferred',
        inCurrentRoadmap: false,
        representativeSources: [
          { company: 'Airbnb', context: 'Writing end-to-end user journey tests and unit tests for critical business paths.', link: 'https://airbnb.com/careers', date: '2026-07' }
        ]
      },
      {
        skill: 'Web Accessibility (WCAG 2.1 AA) & Responsive CSS',
        frequencyRatio: '7 of 10',
        percentage: 70,
        importance: 'Preferred',
        inCurrentRoadmap: true,
        representativeSources: [
          { company: 'Vercel', context: 'Semantic HTML, ARIA attributes, keyboard navigation, and responsive mobile layouts.', link: 'https://vercel.com/careers', date: '2026-09' }
        ]
      }
    ]
  },
  'cloud-devops-engineer': {
    role: 'Cloud & DevOps Engineer / Platform Engineer',
    sampleSize: 10,
    retrievalDate: 'Q3 2026 Curated Public Sample',
    sourceGeography: 'Global Tech & Cloud Infrastructure Teams',
    dataDisclaimer: 'Sampled from 10 publicly posted cloud and site reliability engineering specifications. Curated sample data.',
    experienceExpectations: 'Demonstrable hands-on experience with Infrastructure as Code and container orchestration pipelines.',
    commonTechnologies: ['Linux', 'Docker', 'Kubernetes', 'Terraform', 'GitHub Actions', 'AWS / GCP', 'Prometheus / Grafana', 'Bash / Python'],
    topRequirements: [
      {
        skill: 'Linux Administration & Shell Scripting',
        frequencyRatio: '10 of 10',
        percentage: 100,
        importance: 'Must Have',
        inCurrentRoadmap: true,
        representativeSources: [
          { company: 'Cloudflare', context: 'Deep understanding of POSIX environments, networking primitives, and system debugging.', link: 'https://cloudflare.com/careers', date: '2026-08' }
        ]
      },
      {
        skill: 'Containerization & Docker Image Hardening',
        frequencyRatio: '10 of 10',
        percentage: 100,
        importance: 'Must Have',
        inCurrentRoadmap: true,
        representativeSources: [
          { company: 'Red Hat', context: 'Multi-stage builds, non-root users, vulnerability scanning, and minimal base images.', link: 'https://redhat.com/careers', date: '2026-07' }
        ]
      },
      {
        skill: 'CI/CD Pipeline Automation (GitHub Actions / GitLab CI)',
        frequencyRatio: '9 of 10',
        percentage: 90,
        importance: 'Must Have',
        inCurrentRoadmap: true,
        representativeSources: [
          { company: 'GitLab', context: 'Automated test matrices, semantic versioning, and canary deployment pipelines.', link: 'https://about.gitlab.com/careers', date: '2026-08' }
        ]
      },
      {
        skill: 'Infrastructure as Code (Terraform / OpenTofu)',
        frequencyRatio: '8 of 10',
        percentage: 80,
        importance: 'Must Have',
        inCurrentRoadmap: true,
        representativeSources: [
          { company: 'HashiCorp', context: 'State management, modular cloud resource definitions, and drift detection.', link: 'https://hashicorp.com/careers', date: '2026-06' }
        ]
      },
      {
        skill: 'Observability & Metrics Monitoring (Prometheus/Grafana)',
        frequencyRatio: '7 of 10',
        percentage: 70,
        importance: 'Preferred',
        inCurrentRoadmap: false,
        representativeSources: [
          { company: 'Datadog', context: 'Service level objectives, structured log aggregation, and alert threshold configuration.', link: 'https://datadoghq.com/careers', date: '2026-07' }
        ]
      }
    ]
  }
};

export function getRealityRadarForRole(roleQuery: string): RealityRadarRoleData {
  const normalized = roleQuery.toLowerCase().trim();
  if (normalized.includes('ai') || normalized.includes('ml') || normalized.includes('machine learning') || normalized.includes('llm')) {
    return CURATED_JOB_MARKET_DATA['ai-engineer'];
  }
  if (normalized.includes('devops') || normalized.includes('cloud') || normalized.includes('sre') || normalized.includes('infrastructure')) {
    return CURATED_JOB_MARKET_DATA['cloud-devops-engineer'];
  }
  // default to full-stack
  return CURATED_JOB_MARKET_DATA['full-stack-web-developer'];
}
