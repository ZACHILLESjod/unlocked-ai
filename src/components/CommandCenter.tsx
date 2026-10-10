import React from 'react';
import { CareerRoadmap, Milestone } from '../types/roadmap';
import { 
  Compass, 
  Radar, 
  GitCompare, 
  ShieldCheck, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  FileCode2,
  Calendar,
  AlertCircle
} from 'lucide-react';

interface CommandCenterProps {
  roadmap: CareerRoadmap;
  onNavigateToGraph: (focusMilestoneId?: string) => void;
  onNavigateToMultiverse: () => void;
  onNavigateToRealityRadar: () => void;
  onNavigateToOpportunityRadar: () => void;
  onSelectMilestone: (id: string) => void;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({
  roadmap,
  onNavigateToGraph,
  onNavigateToMultiverse,
  onNavigateToRealityRadar,
  onNavigateToOpportunityRadar,
  onSelectMilestone,
}) => {
  const demonstratedCount = roadmap.milestones.filter((m) => m.evidence_status === 'demonstrated').length;
  const completedCount = roadmap.milestones.filter((m) => m.learning_status === 'completed').length;
  const inProgressMilestones = roadmap.milestones.filter((m) => m.learning_status === 'in_progress');
  const availableMilestones = roadmap.milestones.filter(
    (m) => m.learning_status === 'not_started' && m.prerequisites.every((p) => 
      roadmap.milestones.find((x) => x.id === p)?.learning_status === 'completed' ||
      roadmap.milestones.find((x) => x.id === p)?.evidence_status === 'demonstrated'
    )
  );

  // Active focus milestone is first in-progress or first available
  const activeFocus = inProgressMilestones[0] || availableMilestones[0] || roadmap.milestones[0];

  // Calculate remaining effort
  const remainingHours = roadmap.milestones
    .filter((m) => m.evidence_status !== 'demonstrated' && m.learning_status !== 'completed')
    .reduce((sum, m) => sum + m.estimated_hours, 0);

  const estimatedWeeksRemaining = Math.max(1, Math.ceil(remainingHours / (roadmap.weekly_hours || 10)));

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-8 animate-in fade-in duration-200">
      {/* Hero Mission Control Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0E1424] via-[#0B0F19] to-[#120F24] p-8 rounded-3xl border border-slate-800 shadow-2xl">
        <div className="relative z-10 flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-cyan-400 font-mono uppercase tracking-widest bg-cyan-950/40 px-2.5 py-1 rounded border border-cyan-800/40">
                Active Career Flight
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-400 font-mono">
                Revision #{roadmap.revisionCount || 1}
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">
              {roadmap.target_role}
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              {roadmap.summary}
            </p>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onNavigateToGraph()}
              className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-[#080B14] font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Layers className="w-4 h-4" />
              Launch Flight Graph
            </button>
            <button
              onClick={onNavigateToMultiverse}
              className="px-4 py-2.5 bg-violet-600/30 hover:bg-violet-600/50 text-violet-200 font-semibold text-xs rounded-xl border border-violet-500/40 transition-all flex items-center gap-2 cursor-pointer"
            >
              <GitCompare className="w-4 h-4 text-violet-400" />
              What-If Simulator
            </button>
          </div>
        </div>

        {/* Core Flight Metrics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/80">
          <div className="space-y-1">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
              Demonstrated Skills
            </span>
            <div className="text-2xl font-bold font-mono text-emerald-400 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>{demonstratedCount} / {roadmap.milestones.length}</span>
            </div>
            <span className="text-[10px] text-slate-500 block">Verified via SkillProof rubrics</span>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
              Remaining Effort
            </span>
            <div className="text-2xl font-bold font-mono text-slate-100 flex items-center gap-2">
              <Clock className="w-5 h-5 text-slate-400" />
              <span>{remainingHours} Hours</span>
            </div>
            <span className="text-[10px] text-slate-500 block">Across remaining milestones</span>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
              Estimated Timeline
            </span>
            <div className="text-2xl font-bold font-mono text-cyan-400 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyan-400" />
              <span>~{estimatedWeeksRemaining} Weeks</span>
            </div>
            <span className="text-[10px] text-slate-500 block">At {roadmap.weekly_hours} hrs/week pacing</span>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
              Learning State
            </span>
            <div className="text-2xl font-bold font-mono text-violet-400 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-violet-400" />
              <span>{completedCount} Completed</span>
            </div>
            <span className="text-[10px] text-slate-500 block">{inProgressMilestones.length} currently in flight</span>
          </div>
        </div>
      </div>

      {/* Main Command Center Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Active Focus Milestone (In-Flight Task) */}
        <div className="lg:col-span-7 space-y-6">
          {activeFocus && (
            <div className="bg-[#0E1424] p-6 rounded-2xl border border-cyan-500/30 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
                    Current Focus Milestone
                  </span>
                </div>
                <span className="text-xs font-mono text-slate-400">{activeFocus.category}</span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-100 mb-1.5">
                  {activeFocus.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeFocus.mission_brief || activeFocus.description}
                </p>
              </div>

              {/* Tasks to tackle */}
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Immediate Flight Tasks
                </h4>
                <div className="space-y-2">
                  {(activeFocus.tasks || []).slice(0, 3).map((task, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
                      <span className="font-mono text-cyan-400 font-bold">{idx + 1}.</span>
                      <span>{task}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="text-xs text-slate-400 font-mono">
                  Est. Effort: {activeFocus.estimated_hours} Hours
                </div>
                <button
                  onClick={() => onSelectMilestone(activeFocus.id)}
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-[#080B14] font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  Open Mission & Submit Evidence
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Milestone Flight Path List */}
          <div className="bg-[#0E1424] p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Full Milestone Sequence
              </h3>
              <button
                onClick={() => onNavigateToGraph()}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                View on Canvas <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2.5">
              {roadmap.milestones.map((m, idx) => {
                const isDemonstrated = m.evidence_status === 'demonstrated';
                const isCompleted = m.learning_status === 'completed';
                const isInProgress = m.learning_status === 'in_progress';

                return (
                  <div
                    key={m.id}
                    onClick={() => onSelectMilestone(m.id)}
                    className="p-3 bg-slate-900/50 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl flex items-center justify-between transition-all cursor-pointer text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-slate-500 text-[11px] w-5">
                        0{idx + 1}.
                      </span>
                      <div>
                        <div className="font-semibold text-slate-200">{m.title}</div>
                        <div className="text-[10px] text-slate-500">{m.category} · {m.estimated_hours}h</div>
                      </div>
                    </div>

                    <div>
                      {isDemonstrated ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800/40">
                          Demonstrated ✓
                        </span>
                      ) : isCompleted ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold text-cyan-400 bg-cyan-950/40 border border-cyan-800/40">
                          Completed
                        </span>
                      ) : isInProgress ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold text-violet-400 bg-violet-950/40 border border-violet-800/40">
                          In Flight
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500 font-mono">
                          Queued
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Radars & Next Horizons */}
        <div className="lg:col-span-5 space-y-6">
          {/* Reality Radar Gateway Card */}
          <div
            onClick={onNavigateToRealityRadar}
            className="p-6 bg-gradient-to-br from-[#0E1424] to-[#101A2C] rounded-2xl border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer shadow-xl group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-800/40 text-cyan-400">
                <Radar className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono text-cyan-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Explore Evidence <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>

            <h4 className="text-base font-bold text-slate-100 mb-1">
              Reality Radar · Market Evidence
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Inspect verified job description requirements from 10 sampled industry postings for {roadmap.target_role}.
            </p>

            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80 text-[11px] text-slate-300">
              <span className="font-semibold text-cyan-300 block mb-0.5">Ground Truth Signal</span>
              Requirements mapped directly to your flight milestones.
            </div>
          </div>

          {/* Opportunity Radar Gateway Card */}
          <div
            onClick={onNavigateToOpportunityRadar}
            className="p-6 bg-gradient-to-br from-[#0E1424] to-[#121E24] rounded-2xl border border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer shadow-xl group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-emerald-400">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Bridge Roles <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>

            <h4 className="text-base font-bold text-slate-100 mb-1">
              Opportunity Radar · Stepping Stones
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Discover 3 intermediate roles that can get you hired faster while bridging the gap to your dream job.
            </p>

            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80 text-[11px] text-slate-300">
              <span className="font-semibold text-emerald-300 block mb-0.5">Strategic Flight Paths</span>
              Leverage your transferable skills to land intermediate offers.
            </div>
          </div>

          {/* Multiverse Simulation Gateway Card */}
          <div
            onClick={onNavigateToMultiverse}
            className="p-6 bg-gradient-to-br from-[#0E1424] to-[#18112C] rounded-2xl border border-slate-800 hover:border-violet-500/50 transition-all cursor-pointer shadow-xl group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-violet-950/40 border border-violet-800/40 text-violet-400">
                <GitCompare className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono text-violet-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Simulate Scenarios <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>

            <h4 className="text-base font-bold text-slate-100 mb-1">
              Career Multiverse · What-If Simulator
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Test alternative study budgets, aggressive deadlines, or different career goals without disrupting your current progress.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
