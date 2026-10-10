import { CareerRoadmap, SteppingStonePathway } from '../types/roadmap';

export const DEMO_AI_ENGINEER_ROADMAP: CareerRoadmap = {
  id: 'roadmap-ai-engineer-demo',
  goal: 'AI Engineer / LLM Application Developer',
  target_role: 'AI Engineer',
  summary: 'A structured, evidence-grounded pathway transitioning from core Python fundamentals to production-grade LLM orchestration, evaluation harnesses, and full-stack AI interfaces.',
  current_skills: ['Basic Python', 'Git fundamentals'],
  weekly_hours: 12,
  target_months: 6,
  budget_tier: 'standard',
  experience_level: 'beginner',
  total_estimated_hours: 288,
  timeline_assumptions: 'Based on 12 hours/week over 24 weeks (~6 months). Assumes 6-8 hours focused technical implementation and 4-6 hours project build and evaluation per milestone.',
  assumptions: [
    'Learner has basic familiarity with terminal commands and Python syntax.',
    'Access to free-tier cloud credits or local development machine with 16GB RAM.',
    'API calls utilize modern LLM developer tiers (Gemini, Claude, or local Ollama).'
  ],
  generationSource: 'validated-curated',
  revisionCount: 1,
  createdAt: '2026-10-01T12:00:00.000Z',
  updatedAt: '2026-10-09T12:00:00.000Z',
  milestones: [
    {
      id: 'm-python-async',
      title: 'Async Python & Modern Type Annotations',
      description: 'Master async/await concurrency, Pydantic data validation models, and structural typing for production APIs.',
      category: 'Fundamentals',
      prerequisites: [],
      estimated_hours: 24,
      learning_status: 'completed',
      evidence_status: 'demonstrated',
      tasks: [
        'Understand event loops, asyncio.gather, and concurrency vs parallelism in Python.',
        'Implement Pydantic v2 schemas for strict data coercion and custom validators.',
        'Build type-safe error handling and structured logging middleware.'
      ],
      deliverables: [
        'A reusable async HTTP client module with exponential backoff and rate-limit handling.',
        'Pydantic test suite verifying edge cases, nullability, and custom regex validations.'
      ],
      resources: [
        { title: 'Official Python Asyncio Documentation', url: 'https://docs.python.org/3/library/asyncio.html', type: 'doc', isFree: true },
        { title: 'Pydantic v2 Interactive Guide', url: 'https://docs.pydantic.dev/latest/', type: 'doc', isFree: true }
      ],
      completion_criteria: [
        'Asynchronous requests handle 50 concurrent mock fetches without thread starvation.',
        'Pydantic model rejects malformed schema payloads with descriptive validation errors.',
        'Type annotations pass mypy --strict with zero errors.'
      ],
      career_relevance: 'Supported by 10 of 10 sampled AI engineering job specs; foundational for LLM streaming and low-latency API wrappers.',
      mission_brief: 'Build an async scraper and streaming API wrapper that polls an upstream rate-limited service, parses payloads into validated Pydantic models, and writes structured JSON logs.',
      rubric: [
        {
          id: 'c1',
          criterion: 'Concurrency Architecture',
          weight: 35,
          description: 'Effective use of asyncio primitives without blocking synchronous calls.',
          passingStandard: 'Uses asyncio.gather or TaskGroup; does not invoke blocking I/O functions synchronously.'
        },
        {
          id: 'c2',
          criterion: 'Data Validation & Typing',
          weight: 35,
          description: 'Strict typing and Pydantic v2 model integrity.',
          passingStandard: 'Passes strict mypy; schema defines field constraints and default values correctly.'
        },
        {
          id: 'c3',
          criterion: 'Resilience & Error Handling',
          weight: 30,
          description: 'Proper handling of timeouts, rate limits, and network errors.',
          passingStandard: 'Includes try/except blocks with retry backoff and clean graceful exits.'
        }
      ],
      submission: {
        repoUrl: 'https://github.com/student/async-pydantic-pipeline',
        summary: 'Built an async pipeline using httpx and Pydantic v2 to fetch, validate, and batch-process external API records with exponential backoff.',
        codeSnippet: `import asyncio\nimport httpx\nfrom pydantic import BaseModel, Field\n\nclass ApiResponse(BaseModel):\n    id: str\n    score: float = Field(ge=0.0, le=1.0)\n\nasync def fetch_item(client: httpx.AsyncClient, item_id: str) -> ApiResponse:\n    for attempt in range(3):\n        try:\n            r = await client.get(f"/items/{item_id}", timeout=5.0)\n            r.raise_for_status()\n            return ApiResponse.model_validate(r.json())\n        except (httpx.HTTPError, httpx.TimeoutException):\n            await asyncio.sleep(2 ** attempt)\n    raise RuntimeError("Max retries exceeded")`,
        submittedAt: '2026-10-02T14:30:00.000Z',
        evaluation: {
          evaluatedAt: '2026-10-02T14:35:00.000Z',
          isProvisional: true,
          overallDecision: 'demonstrated',
          summaryFeedback: 'Excellent implementation of asynchronous retries with exponential backoff and strict Pydantic v2 schema validation.',
          strengths: ['Proper exponential backoff calculation', 'Clean Pydantic field constraint annotations', 'Async client lifecycle management'],
          gaps: ['Could incorporate structured jitter in the retry backoff to avoid thundering herd in distributed systems'],
          nextSteps: ['Apply these async streaming patterns to FastAPI in Milestone 2'],
          criteriaResults: [
            { criterionId: 'c1', criterion: 'Concurrency Architecture', status: 'pass', feedback: 'Correct non-blocking async loops and timeout enforcement.' },
            { criterionId: 'c2', criterion: 'Data Validation & Typing', status: 'pass', feedback: 'Pydantic model validation handles edge cases smoothly.' },
            { criterionId: 'c3', criterion: 'Resilience & Error Handling', status: 'pass', feedback: 'Exponential backoff handles transient failures reliably.' }
          ]
        }
      }
    },
    {
      id: 'm-fastapi-backend',
      title: 'FastAPI Production Services & Streaming SSE',
      description: 'Build high-performance REST APIs supporting token streaming, dependency injection, and OpenAPI documentation.',
      category: 'Backend',
      prerequisites: ['m-python-async'],
      estimated_hours: 32,
      learning_status: 'in_progress',
      evidence_status: 'none',
      tasks: [
        'Configure FastAPI with application lifespan handlers and modular routers.',
        'Implement Server-Sent Events (SSE) streaming endpoints with StreamingResponse.',
        'Configure CORS, API key auth middleware, and error schemas.'
      ],
      deliverables: [
        'A working FastAPI service streaming tokens chunk-by-chunk to the client.',
        'Automated pytest suite using AsyncClient for endpoint verification.'
      ],
      resources: [
        { title: 'FastAPI Streaming Response Guide', url: 'https://fastapi.tiangolo.com/advanced/custom-response/#streamingresponse', type: 'doc', isFree: true },
        { title: 'Test-Driven Development with FastAPI and Docker', url: 'https://testdriven.io', type: 'tutorial', isFree: false }
      ],
      completion_criteria: [
        'Streaming endpoint produces text/event-stream chunks without buffering latency.',
        'Integration tests confirm 200 OK on happy path and 422 on invalid request body.'
      ],
      career_relevance: 'Supported by 9 of 10 sampled AI engineering specs; crucial for interactive AI user experiences.',
      mission_brief: 'Create a FastAPI microservice that accepts prompt requests and streams token generation events to a client using Server-Sent Events with structured JSON error boundaries.',
      rubric: [
        {
          id: 'c1',
          criterion: 'Streaming Protocol Compliance',
          weight: 40,
          description: 'True streaming response using text/event-stream without in-memory buffering.',
          passingStandard: 'Yields data chunks incrementally and terminates stream cleanly.'
        },
        {
          id: 'c2',
          criterion: 'Dependency Injection & Auth',
          weight: 30,
          description: 'Clean dependency injection for configuration and API key verification.',
          passingStandard: 'Uses FastAPI Depends() for auth and shared service clients.'
        },
        {
          id: 'c3',
          criterion: 'Automated Testing',
          weight: 30,
          description: 'Pytest suite verifying streaming responses and failure cases.',
          passingStandard: 'Test suite covers valid streaming and malformed inputs with httpx AsyncClient.'
        }
      ]
    },
    {
      id: 'm-vector-rag',
      title: 'Vector Databases & Hybrid Semantic RAG',
      description: 'Implement chunking strategies, dense vector embeddings, hybrid keyword search, and contextual reranking.',
      category: 'AI/ML',
      prerequisites: ['m-python-async'],
      estimated_hours: 40,
      learning_status: 'not_started',
      evidence_status: 'none',
      tasks: [
        'Evaluate recursive character vs semantic chunking strategies for technical documentation.',
        'Index documents in pgvector / Pinecone with metadata filtering.',
        'Implement BM25 lexical search combined with vector cosine similarity and cross-encoder reranking.'
      ],
      deliverables: [
        'A production RAG ingestion script with document deduplication and chunk hashing.',
        'A query retrieval service returning top-k relevant snippets with source citations.'
      ],
      resources: [
        { title: 'pgvector Official Documentation', url: 'https://github.com/pgvector/pgvector', type: 'repo', isFree: true },
        { title: 'Retrieval Augmented Generation Best Practices', url: 'https://www.pinecone.io/learn/retrieval-augmented-generation/', type: 'tutorial', isFree: true }
      ],
      completion_criteria: [
        'Ingestion pipeline generates embeddings and stores document chunk metadata.',
        'Retrieval pipeline executes hybrid search with latency under 150ms on 10,000 chunks.'
      ],
      career_relevance: 'Supported by 9 of 10 sampled job descriptions; core differentiator for enterprise LLM apps.',
      mission_brief: 'Build a documentation search pipeline that ingests Markdown files, generates vector embeddings, stores them in pgvector/Pinecone with metadata, and performs hybrid search with source attribution.',
      rubric: [
        {
          id: 'c1',
          criterion: 'Chunking & Ingestion Strategy',
          weight: 35,
          description: 'Thoughtful chunk boundary preservation and metadata retention.',
          passingStandard: 'Chunks preserve sentence and header hierarchy; metadata includes source file, section, and hash.'
        },
        {
          id: 'c2',
          criterion: 'Retrieval Quality & Re-ranking',
          weight: 40,
          description: 'High-precision retrieval combining semantic similarity and keyword filtering.',
          passingStandard: 'Demonstrates reciprocal rank fusion or cross-encoder reranking on sample queries.'
        },
        {
          id: 'c3',
          criterion: 'Performance & Benchmarking',
          weight: 25,
          description: 'Measurement of retrieval latency and precision@k.',
          passingStandard: 'Logs retrieval timing and returns accurate document references.'
        }
      ]
    },
    {
      id: 'm-eval-guardrails',
      title: 'LLM Evaluation Harness & Safety Guardrails',
      description: 'Design automated regression evaluation suites, hallucination detection, prompt injection defenses, and structured outputs.',
      category: 'AI/ML',
      prerequisites: ['m-fastapi-backend', 'm-vector-rag'],
      estimated_hours: 36,
      learning_status: 'not_started',
      evidence_status: 'none',
      tasks: [
        'Build a golden dataset of 50 query-answer ground truth pairs.',
        'Implement LLM-as-a-judge automated grading for factual accuracy and tone.',
        'Add regex/semantic guardrails to detect prompt injection and PII leakage.'
      ],
      deliverables: [
        'An evaluation report script measuring pass rates and hallucination metrics.',
        'Input/output guardrail middleware integrated into the backend service.'
      ],
      resources: [
        { title: 'Promptfoo Automated Evals Framework', url: 'https://www.promptfoo.dev', type: 'tool', isFree: true },
        { title: 'DeepLearning.AI: Evaluating and Debugging Generative AI', url: 'https://www.deeplearning.ai', type: 'course', isFree: true }
      ],
      completion_criteria: [
        'Eval harness runs automatically against test cases with output diff reporting.',
        'Guardrails successfully block prompt injection test payloads.'
      ],
      career_relevance: 'Supported by 8 of 10 sampled job descriptions; transforms hobby projects into enterprise-ready software.',
      mission_brief: 'Implement an automated evaluation pipeline that scores an LLM application against a golden test suite for factual consistency, latency, and jailbreak resistance.',
      rubric: [
        {
          id: 'c1',
          criterion: 'Benchmark Rigor',
          weight: 40,
          description: 'Comprehensive test suite with diverse test cases, edge cases, and adversarial prompts.',
          passingStandard: 'Golden test suite has >= 25 labeled test cases with quantitative scoring rubrics.'
        },
        {
          id: 'c2',
          criterion: 'Defensive Guardrails',
          weight: 35,
          description: 'Effective pre-execution sanitization and post-generation safety checks.',
          passingStandard: 'Detects jailbreak patterns and prevents PII leakage before client delivery.'
        },
        {
          id: 'c3',
          criterion: 'Evaluation Metrics & Reporting',
          weight: 25,
          description: 'Clear statistical reporting of accuracy, latency, and cost per query.',
          passingStandard: 'Outputs structured markdown or JSON summary with pass/fail ratios.'
        }
      ]
    },
    {
      id: 'm-react-ai-ui',
      title: 'Full-Stack Interactive AI Interfaces (TypeScript & SSE)',
      description: 'Develop responsive React web applications with real-time markdown rendering, stop generation, and citation popovers.',
      category: 'Frontend',
      prerequisites: ['m-fastapi-backend'],
      estimated_hours: 36,
      learning_status: 'not_started',
      evidence_status: 'none',
      tasks: [
        'Consume Server-Sent Events streams with fetch and ReadableStream reader in React.',
        'Render streaming Markdown with syntax-highlighted code blocks.',
        'Build interactive citation popovers linking directly to retrieved source documents.'
      ],
      deliverables: [
        'A fully responsive chat & search web application deployed to a public URL.',
        'Keyboard-accessible UI complying with WCAG 2.1 AA standards.'
      ],
      resources: [
        { title: 'Vercel AI SDK Architecture', url: 'https://sdk.vercel.ai/docs', type: 'doc', isFree: true },
        { title: 'MDN: Server-Sent Events API', url: 'https://developer.mozilla.org', type: 'doc', isFree: true }
      ],
      completion_criteria: [
        'User can abort active generation via AbortController.',
        'Citations highlight the exact chunk in the source panel when clicked.'
      ],
      career_relevance: 'Supported by 7 of 10 sampled job descriptions; required for customer-facing AI applications.',
      mission_brief: 'Build a production-grade React/TypeScript interface that connects to your streaming AI backend, displays streamed tokens with zero jitter, and provides interactive source attribution popovers.',
      rubric: [
        {
          id: 'c1',
          criterion: 'Streaming State & UX',
          weight: 40,
          description: 'Smooth token rendering, cancellation with AbortController, and auto-scrolling management.',
          passingStandard: 'Handles rapid token bursts without UI freezing; cancel button immediately terminates network request.'
        },
        {
          id: 'c2',
          criterion: 'Citation & Document Attribution',
          weight: 35,
          description: 'Clear, clickable source chips linking directly to retrieved context snippets.',
          passingStandard: 'Clicking citation opens a preview drawer showing the exact text chunk and metadata.'
        },
        {
          id: 'c3',
          criterion: 'Accessibility & Polish',
          weight: 25,
          description: 'Keyboard navigation, accessible color contrast, and responsive layout.',
          passingStandard: 'Passes basic axe accessibility audit with no critical color contrast or ARIA violations.'
        }
      ]
    },
    {
      id: 'm-capstone-system',
      title: 'Capstone: Production Enterprise Agent with Tool Calling',
      description: 'Synthesize all skills into a deployed multi-tool agent with persistent memory, telemetry, and containerized deployment.',
      category: 'Portfolio Project',
      prerequisites: ['m-eval-guardrails', 'm-react-ai-ui'],
      estimated_hours: 48,
      learning_status: 'not_started',
      evidence_status: 'none',
      tasks: [
        'Implement structured tool calling (database querying, web search, code sandbox).',
        'Dockerize the application with multi-stage builds and non-root security.',
        'Deploy to public cloud with SSL, OpenTelemetry tracing, and rate limits.'
      ],
      deliverables: [
        'A live, publicly accessible web application with GitHub repository and demo video.',
        'Architecture diagram explaining data flow, tool execution loops, and guardrails.'
      ],
      resources: [
        { title: 'Docker Multi-stage Builds Documentation', url: 'https://docs.docker.com/build/building/multi-stage/', type: 'doc', isFree: true },
        { title: 'OpenTelemetry in Modern Python Applications', url: 'https://opentelemetry.io', type: 'doc', isFree: true }
      ],
      completion_criteria: [
        'Agent successfully decides when to execute tools vs when to respond directly.',
        'Application survives simulated network dropouts and validates all inputs.'
      ],
      career_relevance: 'The crowning portfolio asset cited in recruiter interviews to demonstrate senior junior readiness.',
      mission_brief: 'Architect, build, and deploy an autonomous AI agent capable of multi-step tool execution, persistent session history, and transparent token cost observability.',
      rubric: [
        {
          id: 'c1',
          criterion: 'Tool Calling Orchestration',
          weight: 35,
          description: 'Safe and deterministic schema-based tool execution loops.',
          passingStandard: 'Uses structured function schemas; validates parameters before invocation; handles tool errors gracefully.'
        },
        {
          id: 'c2',
          criterion: 'Production Architecture & Deployment',
          weight: 35,
          description: 'Containerized deployment with HTTPS, environment isolation, and health checks.',
          passingStandard: 'Deployed on public URL with Dockerfile and clean GitHub README documentation.'
        },
        {
          id: 'c3',
          criterion: 'Observability & Cost Tracking',
          weight: 30,
          description: 'Structured tracing of tool invocations, token counts, and latency.',
          passingStandard: 'Dashboard or logs quantify tokens consumed and latency per tool step.'
        }
      ]
    }
  ],
  edges: [
    { id: 'e-1-2', source: 'm-python-async', target: 'm-fastapi-backend' },
    { id: 'e-1-3', source: 'm-python-async', target: 'm-vector-rag' },
    { id: 'e-2-4', source: 'm-fastapi-backend', target: 'm-eval-guardrails' },
    { id: 'e-3-4', source: 'm-vector-rag', target: 'm-eval-guardrails' },
    { id: 'e-2-5', source: 'm-fastapi-backend', target: 'm-react-ai-ui' },
    { id: 'e-4-6', source: 'm-eval-guardrails', target: 'm-capstone-system' },
    { id: 'e-5-6', source: 'm-react-ai-ui', target: 'm-capstone-system' }
  ]
};

export const DEMO_AI_ENGINEER_STEPPING_STONES: SteppingStonePathway[] = [
  {
    id: 'step-python-dev',
    role: 'Python Backend Developer',
    title: 'Bridge Pathway 1: Python Backend Specialist',
    steppingStoneRationale: 'A realistic, highly accessible entry point. Mastering async APIs and data pipelines allows you to get hired faster while continuing to build LLM applications on the job.',
    typicalTimelineMonths: 3,
    estimatedLearningHours: 90,
    transferableSkills: ['Python 3.12 syntax', 'Asyncio event loops', 'Pydantic data schemas', 'FastAPI REST APIs', 'PostgreSQL queries'],
    bridgeSkills: ['Database migration scripts (Alembic)', 'Unit testing with pytest', 'Redis caching'],
    recommendedProjects: [
      'High-throughput Webhook Ingestion Service with rate limiting and retry queues',
      'CRUD Microservice with JWT authentication and relational Postgres schema'
    ],
    prerequisites: ['Basic Python fundamentals', 'Git workflow'],
    assumptionsAndLimitations: [
      'Focuses primarily on backend plumbing before complex AI inference layers.',
      'Average junior backend roles require 3-6 months preparation compared to 6-9 months for standalone AI engineering.'
    ]
  },
  {
    id: 'step-data-analyst',
    role: 'Data & Analytics Engineer',
    title: 'Bridge Pathway 2: Analytics & Vector Pipeline Engineer',
    steppingStoneRationale: 'Leverages structured data analysis, SQL, and embeddings extraction. Provides immediate commercial value to organizations building data warehouses for AI.',
    typicalTimelineMonths: 4,
    estimatedLearningHours: 110,
    transferableSkills: ['SQL & PostgreSQL', 'Data cleaning pipelines', 'Vector chunking analysis', 'Python scripting'],
    bridgeSkills: ['Pandas / Polars', 'dbt (data build tool)', 'Data visualization (DuckDB / Streamlit)'],
    recommendedProjects: [
      'Automated Document Metadata Extraction and Semantic Search Ingestion Pipeline',
      'Dataset Evaluation Dashboard benchmarking model response accuracy over time'
    ],
    prerequisites: ['Basic statistics', 'Relational database basics'],
    assumptionsAndLimitations: [
      'Emphasizes data hygiene and batch pipelines rather than real-time interactive SSE interfaces.'
    ]
  },
  {
    id: 'step-ml-intern',
    role: 'Machine Learning / AI Associate',
    title: 'Bridge Pathway 3: AI Tooling & Evaluation Associate',
    steppingStoneRationale: 'Focuses heavily on LLM evaluation harnesses, prompt regression suites, and safety benchmarking—an area where senior teams desperately need junior support.',
    typicalTimelineMonths: 4,
    estimatedLearningHours: 120,
    transferableSkills: ['Prompt engineering frameworks', 'Eval golden datasets', 'Guardrails validation', 'API orchestration'],
    bridgeSkills: ['LLM benchmarking (RAGAS / Promptfoo)', 'Hugging Face transformers basics', 'Weights & Biases logging'],
    recommendedProjects: [
      'Automated LLM Hallucination Benchmark Suite with CI/CD regression triggers',
      'Domain-Specific Synthetic Dataset Generator with automated quality filters'
    ],
    prerequisites: ['Python basics', 'Understanding of LLM temperature and top_p'],
    assumptionsAndLimitations: [
      'Requires strong attention to detail and rigorous quantitative testing methodology.'
    ]
  }
];
