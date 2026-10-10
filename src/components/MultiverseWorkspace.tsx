import React, { useState } from 'react';
import { CareerRoadmap, Milestone, MultiverseScenario } from '../types/roadmap';
import { fetchReplanRoadmap } from '../lib/api';
import { 
  GitCompare, 
  Sparkles, 
  Clock, 
  AlertTriangle, 
  Check, 
  X, 
  ArrowRight, 
  Sliders, 
  Plus, 
  RotateCcw,
  ShieldCheck,
  Zap,
  TrendingDown,
  TrendingUp,
  Layers
} from 'lucide-react';

interface MultiverseWorkspaceProps {
  currentRoadmap: CareerRoadmap;
  onAcceptScenario: (scenario: MultiverseScenario) => void;
  onPreviewInGraph: (scenario: MultiverseScenario) => void;
  onClose: () => void;
}

export const MultiverseWorkspace: React.FC<MultiverseWorkspaceProps> = ({
  currentRoadmap,
  onAcceptScenario,
  onPreviewInGraph,
  onClose,
}) => {
  // Scenario inputs
  const [weeklyHours, setWeeklyHours] = useState(currentRoadmap.weekly_hours);
  const [targetMonths, setTargetMonths] = useState(currentRoadmap.target_months);
  const [targetRole, setTargetRole] = useState(currentRoadmap.target_role);
  const [freeResourcesOnly, setFreeResourcesOnly] = useState(false);
  const [additionalSkills, setAdditionalSkills] = useState('');
  
  // Quick scenario preset presets
  const applyPreset = (preset: { hours: number; months: number; role?: string; label: string }) => {
    setWeeklyHours(preset.hours);
    setTargetMonths(preset.months);
    if (preset.role) setTargetRole(preset.role);
  };

  const [isSimulating, setIsSimulating] = useState(false);
  const [activeScenario, setActiveScenario] = useState<MultiverseScenario | null>(null);
  const [simulationError, setSimulationError] = useState<string | null>(null);

  const handleRunSimulation = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSimulating(true);
    setSimulationError(null);

    try {
      const skillsList = additionalSkills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const result = await fetchReplanRoadmap({
        current_roadmap: currentRoadmap,
        new_constraints: {
          weekly_hours: Number(weeklyHours),
          target_months: Number(targetMonths),
          target_role: targetRole !== currentRoadmap.target_role ? targetRole : undefined,
          known_skills: skillsList,
          free_resources_only: freeResourcesOnly,
        },
      });

      const scenario: MultiverseScenario = {
        id: `scenario-${Date.now()}`,
        name: `${targetMonths}mo @ ${weeklyHours}h/wk${targetRole !== currentRoadmap.target_role ? ` (${targetRole})` : ''}`,
        hypothesis: `What if I study ${weeklyHours} hrs/week over ${targetMonths} months${targetRole !== currentRoadmap.target_role ? ` targeting ${targetRole}` : ''}?`,
        constraints: {
          weekly_hours: Number(weeklyHours),
          target_months: Number(targetMonths),
          target_role: targetRole,
          known_skills: skillsList,
          free_resources_only: freeResourcesOnly,
        },
        proposedRoadmap: result.proposedRoadmap,
        diff: result.diff,
        status: 'draft',
        createdAt: new Date().toISOString(),
      };

      setActiveScenario(scenario);
    } catch (err: any) {
      console.error('Simulation error:', err);
      setSimulationError(err.message || 'Failed to simulate scenario.');
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-violet-400 uppercase tracking-wider font-mono">
              Feature 2 · Career Multiverse
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <GitCompare className="w-6 h-6 text-violet-400" />
            What-If Flight Simulator & Branch Comparison
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Test-drive alternative study commitments, aggressive timelines, or career pivots before committing your active roadmap.
          </p>
        </div>

        <button
          onClick={onClose}
          className="px-3.5 py-1.5 text-xs text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors"
        >
          Return to Command Center
        </button>
      </div>

      {/* Preset Quick Scenario Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-500 font-medium">Quick Scenarios:</span>
        <button
          onClick={() => applyPreset({ hours: currentRoadmap.weekly_hours, months: Math.max(1, Math.round(currentRoadmap.target_months / 2)), label: '3-Month Sprint' })}
          className="px-3 py-1.5 bg-[#111827] hover:bg-[#162035] border border-slate-800 text-xs text-slate-300 rounded-lg transition-colors flex items-center gap-1.5"
        >
          <Zap className="w-3 h-3 text-amber-400" />
          What if I have only 3 months?
        </button>
        <button
          onClick={() => applyPreset({ hours: 5, months: currentRoadmap.target_months, label: 'Part-Time 5h/wk' })}
          className="px-3 py-1.5 bg-[#111827] hover:bg-[#162035] border border-slate-800 text-xs text-slate-300 rounded-lg transition-colors flex items-center gap-1.5"
        >
          <Clock className="w-3 h-3 text-cyan-400" />
          What if I study only 5h/week?
        </button>
        <button
          onClick={() => {
            applyPreset({ hours: 15, months: 6, role: 'Full Stack Web Developer', label: 'Pivot to Full Stack' });
          }}
          className="px-3 py-1.5 bg-[#111827] hover:bg-[#162035] border border-slate-800 text-xs text-slate-300 rounded-lg transition-colors flex items-center gap-1.5"
        >
          <GitCompare className="w-3 h-3 text-violet-400" />
          What if I pivot to Full Stack Web?
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Constraints Control Console */}
        <div className="lg:col-span-5 bg-[#0E1424] p-6 rounded-2xl border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              Scenario Constraints
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">Sandbox Mode</span>
          </div>

          <form onSubmit={handleRunSimulation} className="space-y-5">
            {/* Target Role */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Target Role
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. AI Engineer, Full Stack Developer"
                className="w-full px-3.5 py-2 text-xs bg-slate-900 border border-slate-700/60 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Weekly Hours Slider */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-300">Weekly Study Hours</span>
                <span className="font-mono text-cyan-400 font-bold">{weeklyHours} hrs / week</span>
              </div>
              <input
                type="range"
                min="2"
                max="40"
                step="1"
                value={weeklyHours}
                onChange={(e) => setWeeklyHours(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>2 hrs (Casual)</span>
                <span>20 hrs (Intensive)</span>
                <span>40 hrs (Full-time)</span>
              </div>
            </div>

            {/* Target Timeline Months */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-300">Target Timeline</span>
                <span className="font-mono text-violet-400 font-bold">{targetMonths} Months</span>
              </div>
              <input
                type="range"
                min="1"
                max="24"
                step="1"
                value={targetMonths}
                onChange={(e) => setTargetMonths(Number(e.target.value))}
                className="w-full accent-violet-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>1 mo (Sprint)</span>
                <span>6 mos (Standard)</span>
                <span>24 mos (Degree Pace)</span>
              </div>
            </div>

            {/* Known Skills Override */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Additional Known Skills to Skip
              </label>
              <input
                type="text"
                value={additionalSkills}
                onChange={(e) => setAdditionalSkills(e.target.value)}
                placeholder="e.g. Docker, SQL, Basic Python (comma-separated)"
                className="w-full px-3.5 py-2 text-xs bg-slate-900 border border-slate-700/60 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-400"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                UNLOCKED adapts by skipping introductory material while preserving advanced prerequisites.
              </p>
            </div>

            {/* Free Resources Only Toggle */}
            <div className="flex items-center justify-between p-3 bg-slate-900/60 rounded-xl border border-slate-800">
              <div>
                <div className="text-xs font-semibold text-slate-200">Free Resources Only</div>
                <div className="text-[10px] text-slate-500">Filter out paid certifications and subscriptions</div>
              </div>
              <input
                type="checkbox"
                checked={freeResourcesOnly}
                onChange={(e) => setFreeResourcesOnly(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 text-cyan-500 focus:ring-0 cursor-pointer"
              />
            </div>

            {simulationError && (
              <div className="p-3 bg-rose-950/40 border border-rose-800/40 rounded-xl text-xs text-rose-300">
                {simulationError}
              </div>
            )}

            <button
              type="submit"
              disabled={isSimulating}
              className="w-full py-3 px-4 bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-[#080B14] font-bold text-xs rounded-xl shadow-lg shadow-violet-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSimulating ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin" />
                  Calculating Alternative Flight Path...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate What-If Branch Comparison
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Comparative Flight Deck */}
        <div className="lg:col-span-7 space-y-6">
          {activeScenario ? (
            <div className="bg-[#0E1424] p-6 rounded-2xl border border-violet-500/30 shadow-2xl space-y-6">
              {/* Diff Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-violet-400 font-mono">
                    Scenario Proposal Diff
                  </span>
                  <h3 className="text-lg font-bold text-slate-100">
                    {activeScenario.name}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onPreviewInGraph(activeScenario)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5"
                  >
                    <Layers className="w-3.5 h-3.5 text-cyan-400" />
                    Preview in Graph Canvas
                  </button>
                  <button
                    onClick={() => onAcceptScenario(activeScenario)}
                    className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-[#080B14] text-xs font-bold rounded-lg shadow-md transition-colors flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Accept & Switch Active Path
                  </button>
                </div>
              </div>

              {/* Feasibility Warning Banner if aggressive */}
              {activeScenario.diff.feasibilityWarning && (
                <div className="p-4 bg-amber-950/30 border border-amber-600/40 rounded-xl text-xs text-amber-200 flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-amber-300 mb-0.5">Timeline Realism Advisory:</span>
                    <span>{activeScenario.diff.feasibilityWarning}</span>
                  </div>
                </div>
              )}

              {/* High Level Metrics Comparison */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                  <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-1">
                    Total Effort
                  </div>
                  <div className="text-base font-bold font-mono text-slate-100 flex items-center gap-1.5">
                    <span>{activeScenario.proposedRoadmap.total_estimated_hours}h</span>
                    {activeScenario.diff.effortDeltaHours !== 0 && (
                      <span className={`text-xs font-normal ${
                        activeScenario.diff.effortDeltaHours < 0 ? 'text-emerald-400' : 'text-amber-400'
                      }`}>
                        ({activeScenario.diff.effortDeltaHours > 0 ? '+' : ''}{activeScenario.diff.effortDeltaHours}h)
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                  <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-1">
                    Timeline Span
                  </div>
                  <div className="text-base font-bold font-mono text-slate-100 flex items-center gap-1.5">
                    <span>{activeScenario.constraints.target_months} mos</span>
                    {activeScenario.diff.timelineDeltaMonths !== 0 && (
                      <span className={`text-xs font-normal ${
                        activeScenario.diff.timelineDeltaMonths < 0 ? 'text-emerald-400' : 'text-slate-400'
                      }`}>
                        ({activeScenario.diff.timelineDeltaMonths > 0 ? '+' : ''}{activeScenario.diff.timelineDeltaMonths}m)
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 col-span-2 sm:col-span-1">
                  <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-1">
                    Completed Work Safeguard
                  </div>
                  <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>100% Preserved</span>
                  </div>
                </div>
              </div>

              {/* Added / Skipped / Modified Milestones Diff */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Graph Structural Differences
                </h4>

                <div className="space-y-2">
                  {/* Added Milestones */}
                  {(activeScenario.diff.addedMilestones || []).map((m) => (
                    <div key={m.id} className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-xl flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-emerald-400 font-mono bg-emerald-900/40 px-1.5 py-0.5 rounded">
                          + ADDED
                        </span>
                        <span className="font-semibold text-slate-200">{m.title}</span>
                      </div>
                      <span className="text-slate-400 font-mono text-[11px]">{m.estimated_hours}h</span>
                    </div>
                  ))}

                  {/* Skipped / Removed Milestones */}
                  {(activeScenario.diff.removedMilestones || []).map((m) => (
                    <div key={m.id} className="p-3 bg-rose-950/20 border border-rose-500/30 rounded-xl flex items-center justify-between text-xs opacity-75">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-rose-400 font-mono bg-rose-900/40 px-1.5 py-0.5 rounded">
                          - SKIPPED
                        </span>
                        <span className="line-through text-slate-400">{m.title}</span>
                      </div>
                      <span className="text-slate-500 font-mono text-[11px]">{m.estimated_hours}h saved</span>
                    </div>
                  ))}

                  {/* Modified Milestones */}
                  {(activeScenario.diff.modifiedMilestones || []).map((mod, idx) => (
                    <div key={idx} className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-xl flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-amber-400 font-mono bg-amber-900/40 px-1.5 py-0.5 rounded">
                          ~ PACED
                        </span>
                        <span className="font-semibold text-slate-200">{mod.proposed.title}</span>
                      </div>
                      <span className="text-amber-300 font-mono text-[11px]">
                        {mod.changes.join(', ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trade-offs & Transferable Skills */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800">
                  <h5 className="font-bold text-slate-300 uppercase tracking-wider text-[11px] mb-2">
                    Key Trade-Offs & Bottlenecks
                  </h5>
                  <ul className="space-y-1.5 text-slate-400 text-[11px]">
                    {(activeScenario.diff.tradeoffs || []).map((to, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{to}</span>
                      </li>
                    ))}
                    {(activeScenario.diff.bottlenecks || []).map((bn, i) => (
                      <li key={`bn-${i}`} className="flex items-start gap-1.5">
                        <span className="text-violet-400 font-bold">•</span>
                        <span>Bottleneck: {bn}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800">
                  <h5 className="font-bold text-slate-300 uppercase tracking-wider text-[11px] mb-2">
                    Transferable Skills Preserved
                  </h5>
                  <div className="flex flex-wrap gap-1.5">
                    {(activeScenario.diff.transferableSkills || []).map((ts, i) => (
                      <span key={i} className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-[11px] border border-slate-700">
                        {ts}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#0E1424]/60 p-12 rounded-2xl border border-slate-800/80 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-violet-950/40 border border-violet-800/40 flex items-center justify-center mx-auto text-violet-400">
                <GitCompare className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-200">
                No Scenario Active in Flight Deck
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                Adjust the study hours, target timeline, or career role on the left, or select one of the Quick Scenarios above to generate an instant comparative proposal.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
