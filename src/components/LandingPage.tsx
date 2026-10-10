import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  GitCompare, 
  Radar, 
  Compass, 
  RotateCcw, 
  Layers, 
  Clock, 
  CheckCircle2,
  Terminal,
  Zap,
  Play
} from 'lucide-react';
import { DEMO_AI_ENGINEER_ROADMAP } from '../data/demoRoadmaps';
import { CareerRoadmap } from '../types/roadmap';

interface LandingPageProps {
  onStartOnboarding: () => void;
  onLoadPreset: (roadmap: CareerRoadmap) => void;
  onExploreGraphDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartOnboarding,
  onLoadPreset,
  onExploreGraphDemo,
}) => {
  return (
    <div className="w-full min-h-screen bg-[#080B14] text-[#F8FAFC] selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-6 max-w-6xl mx-auto text-center space-y-8">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-violet-600/20 via-cyan-500/15 to-transparent blur-[120px] pointer-events-none -z-10" />

        {/* Tagline kicker */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs text-slate-300 shadow-xl backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span>AI Career Flight Simulator</span>
          <span className="text-slate-600">·</span>
          <span className="text-cyan-300 font-medium">“Don't just plan your career. Test-drive it.”</span>
        </div>

        {/* Hero Title */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-100 leading-[1.1]">
            Turn Your Dream Job Into an{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400">
              Interactive Flight Path.
            </span>
          </h1>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Stop following static checklists or vague chatbots. UNLOCKED transforms career preparation with interactive dependency graphs, portfolio-backed SkillProof rubrics, What-If Multiverse simulations, and employer evidence.
          </p>
        </div>

        {/* Main Action CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={onStartOnboarding}
            className="px-6 py-3.5 bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-[#080B14] font-extrabold text-sm rounded-xl shadow-xl shadow-cyan-500/20 transition-all flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
          >
            <Sparkles className="w-4 h-4" />
            Build My Career Roadmap
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onLoadPreset(DEMO_AI_ENGINEER_ROADMAP)}
            className="px-5 py-3.5 bg-[#111827] hover:bg-[#162035] text-slate-200 border border-slate-800 hover:border-slate-700 font-semibold text-sm rounded-xl transition-all flex items-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 text-cyan-400" />
            Launch Instant AI Engineer Demo
          </button>
        </div>

        {/* Quick Demo Presets Strip */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
          <span>Instant One-Click Presets:</span>
          <button
            onClick={() => onLoadPreset(DEMO_AI_ENGINEER_ROADMAP)}
            className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 transition-colors cursor-pointer"
          >
            AI Engineer (Python to LLM)
          </button>
          <button
            onClick={onStartOnboarding}
            className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 transition-colors cursor-pointer"
          >
            Full Stack Web Developer
          </button>
          <button
            onClick={onStartOnboarding}
            className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 transition-colors cursor-pointer"
          >
            Cloud & DevOps Engineer
          </button>
        </div>

        {/* Flight Graph Interactive Teaser Mockup */}
        <div className="pt-10 max-w-5xl mx-auto">
          <div className="p-3 bg-[#0E1424]/90 rounded-2xl border border-slate-800 shadow-2xl backdrop-blur-md">
            <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800/80 text-xs">
              <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Flight Canvas Preview · AI Engineer Trajectory</span>
              </div>
              <button
                onClick={onExploreGraphDemo}
                className="text-cyan-400 hover:text-cyan-300 font-medium text-xs flex items-center gap-1 cursor-pointer"
              >
                Inspect Live Graph <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Mini visual DAG preview */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="p-4 rounded-xl bg-slate-900/70 border border-emerald-500/40 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-emerald-400 font-bold uppercase font-mono">01 · Demonstrated</span>
                  <span className="text-slate-500 font-mono">24h</span>
                </div>
                <div className="font-semibold text-slate-200 text-xs">Async Python & Pydantic Validation</div>
                <div className="text-[11px] text-slate-400">Proved via live code snippet and rubric verification.</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/70 border border-violet-500/50 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-violet-400 font-bold uppercase font-mono">02 · In Flight</span>
                  <span className="text-slate-500 font-mono">32h</span>
                </div>
                <div className="font-semibold text-slate-200 text-xs">FastAPI Token Streaming (SSE)</div>
                <div className="text-[11px] text-slate-400">Depends on Async Python. Live streaming responses.</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-2 opacity-70">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-bold uppercase font-mono">03 · Queued</span>
                  <span className="text-slate-600 font-mono">40h</span>
                </div>
                <div className="font-semibold text-slate-300 text-xs">Vector Databases & Hybrid RAG</div>
                <div className="text-[11px] text-slate-500">Unlocks upon completing FastAPI streaming.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Five Signature Features Section */}
      <section className="py-20 px-6 border-t border-slate-800/80 bg-[#0B0F19]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
              The Architecture of UNLOCKED
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100">
              The Five Signature Innovations
            </h2>
            <p className="text-sm text-slate-400 max-w-2xl mx-auto">
              Engineered to eliminate empty checklists, generic advice, and blind commitment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1: SkillProof */}
            <div className="p-6 bg-[#0E1424] rounded-2xl border border-slate-800 hover:border-emerald-500/40 transition-all space-y-4 group">
              <div className="w-10 h-10 rounded-xl bg-emerald-950/40 border border-emerald-800/40 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">
                1. SkillProof
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Your portfolio becomes your passport. Move beyond self-reported checkboxes. Submit code excerpts and GitHub deliverables evaluated against rigorous milestone rubrics.
              </p>
              <div className="text-[11px] font-mono text-emerald-400">
                States: Not started · Learning · Evidence · Demonstrated
              </div>
            </div>

            {/* Feature 2: Career Multiverse */}
            <div className="p-6 bg-[#0E1424] rounded-2xl border border-slate-800 hover:border-violet-500/40 transition-all space-y-4 group">
              <div className="w-10 h-10 rounded-xl bg-violet-950/40 border border-violet-800/40 flex items-center justify-center text-violet-400">
                <GitCompare className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-100 group-hover:text-violet-300 transition-colors">
                2. Career Multiverse
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Explore alternative futures before choosing one. Simulate: "What if I have only 3 months?" or "What if I switch roles?" Compare side-by-side graph diffs with preserved progress.
              </p>
              <div className="text-[11px] font-mono text-violet-400">
                What-If Sandbox · Visual Graph Diffs · Accept / Revert
              </div>
            </div>

            {/* Feature 3: Reality Radar */}
            <div className="p-6 bg-[#0E1424] rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition-all space-y-4 group">
              <div className="w-10 h-10 rounded-xl bg-cyan-950/40 border border-cyan-800/40 flex items-center justify-center text-cyan-400">
                <Radar className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                3. Reality Radar
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ground your flight path in real employer evidence. See which skills appear across sampled public job descriptions (e.g. "Supported by 9 of 10 sampled specs") with source links.
              </p>
              <div className="text-[11px] font-mono text-cyan-400">
                Curated Public Samples · Verified Frequencies · Traceable Citations
              </div>
            </div>

            {/* Feature 4: Opportunity Radar */}
            <div className="p-6 bg-[#0E1424] rounded-2xl border border-slate-800 hover:border-emerald-500/40 transition-all space-y-4 group">
              <div className="w-10 h-10 rounded-xl bg-emerald-950/40 border border-emerald-800/40 flex items-center justify-center text-emerald-400">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">
                4. Opportunity Radar
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Discover the hidden stepping stones to your dream job. Explore intermediate roles you can land in 3–4 months using transferable skills while continuing to aim higher.
              </p>
              <div className="text-[11px] font-mono text-emerald-400">
                Bridge Roles · Transferable Skills · Transition Projects
              </div>
            </div>

            {/* Feature 5: Adaptive Replanning */}
            <div className="p-6 bg-[#0E1424] rounded-2xl border border-slate-800 hover:border-violet-500/40 transition-all space-y-4 group">
              <div className="w-10 h-10 rounded-xl bg-violet-950/40 border border-violet-800/40 flex items-center justify-center text-violet-400">
                <RotateCcw className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-100 group-hover:text-violet-300 transition-colors">
                5. Adaptive Replanning
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Your flight plan adapts dynamically as you prove skills or change availability. Completed work is never deleted, and prerequisites recalculate automatically.
              </p>
              <div className="text-[11px] font-mono text-violet-400">
                DAG Recalculation · Preserved Milestones · Stable IDs
              </div>
            </div>

            {/* Interactive Graph Engine */}
            <div className="p-6 bg-[#0E1424] rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition-all space-y-4 group">
              <div className="w-10 h-10 rounded-xl bg-cyan-950/40 border border-cyan-800/40 flex items-center justify-center text-cyan-400">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                Interactive Graph Canvas
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Powered by React Flow DAG calculations. Zoom, pan, search, filter by domain, and inspect upstream prerequisites and downstream bottlenecks in real time.
              </p>
              <div className="text-[11px] font-mono text-cyan-400">
                React Flow · Prerequisite Tracing · Real Time Pan/Zoom
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Walkthrough */}
      <section className="py-20 px-6 max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
            How It Works
          </span>
          <h2 className="text-3xl font-bold text-slate-100">
            Three Steps to Take Flight
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-[#0E1424] rounded-2xl border border-slate-800 space-y-3">
            <span className="font-mono text-2xl font-extrabold text-cyan-400">01</span>
            <h3 className="text-base font-bold text-slate-100">Enter Goal & Inventory</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Define your career goal, weekly hours, and current skills. The AI generates a customized prerequisite graph without generic fluff.
            </p>
          </div>

          <div className="p-6 bg-[#0E1424] rounded-2xl border border-slate-800 space-y-3">
            <span className="font-mono text-2xl font-extrabold text-violet-400">02</span>
            <h3 className="text-base font-bold text-slate-100">Build & Demonstrate</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tackle hands-on project briefs. Submit code snippets and repository links for rubric-based SkillProof verification to unlock dependent paths.
            </p>
          </div>

          <div className="p-6 bg-[#0E1424] rounded-2xl border border-slate-800 space-y-3">
            <span className="font-mono text-2xl font-extrabold text-emerald-400">03</span>
            <h3 className="text-base font-bold text-slate-100">Simulate & Adapt</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Use What-If Multiverse simulations to test schedule shifts or role pivots. Ground your strategy in Reality Radar employer requirements.
            </p>
          </div>
        </div>

        <div className="text-center pt-4">
          <button
            onClick={onStartOnboarding}
            className="px-6 py-3.5 bg-cyan-500 hover:bg-cyan-400 text-[#080B14] font-extrabold text-xs rounded-xl shadow-lg transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            Start Your Flight Simulation Now
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-slate-800/80 text-center text-xs text-slate-500 flex flex-wrap items-center justify-between max-w-6xl mx-auto gap-4">
        <div>
          <span className="font-bold text-slate-300">UNLOCKED</span> · AI Career Flight Simulator
        </div>
        <div className="text-[11px] text-slate-500">
          Provisional AI assessments & curated public job samples · Designed for career builders
        </div>
      </footer>
    </div>
  );
};
