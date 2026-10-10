import React, { useState, useEffect } from 'react';
import { CareerRoadmap, SteppingStonePathway } from '../types/roadmap';
import { fetchOpportunityRadar } from '../lib/api';
import { 
  Compass, 
  ArrowRight, 
  Clock, 
  Layers, 
  CheckCircle2, 
  Sparkles, 
  FileCode2, 
  AlertCircle,
  RotateCcw
} from 'lucide-react';

interface OpportunityRadarViewProps {
  roadmap: CareerRoadmap;
  onSelectPathwayAsNewGoal: (role: string) => void;
}

export const OpportunityRadarView: React.FC<OpportunityRadarViewProps> = ({
  roadmap,
  onSelectPathwayAsNewGoal,
}) => {
  const [pathways, setPathways] = useState<SteppingStonePathway[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPathway, setSelectedPathway] = useState<SteppingStonePathway | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetchOpportunityRadar(roadmap.target_role)
      .then((data) => {
        if (isMounted) {
          setPathways(data);
          if (data.length > 0) setSelectedPathway(data[0]);
        }
      })
      .catch((err) => {
        console.error('Failed to load stepping stones:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [roadmap.target_role]);

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider font-mono">
            Feature 4 · Opportunity Radar
          </span>
        </div>
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Compass className="w-6 h-6 text-emerald-400" />
          Stepping-Stone Career Pathways & Bridge Roles
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-3xl">
          Students rarely jump directly to senior dream roles in one leap. Explore high-leverage intermediate stepping-stone opportunities that get you hired sooner while advancing toward your final goal.
        </p>
      </div>

      {isLoading ? (
        <div className="p-16 text-center space-y-3">
          <RotateCcw className="w-6 h-6 text-emerald-400 animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Charting realistic stepping stones toward {roadmap.target_role}...</p>
        </div>
      ) : pathways.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Stepping-Stone Pathways Cards */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Identified Bridge Roles
            </h3>

            {pathways.map((pw) => {
              const isSelected = selectedPathway?.id === pw.id;
              return (
                <div
                  key={pw.id}
                  onClick={() => setSelectedPathway(pw)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#10192A] border-emerald-500/70 shadow-xl shadow-emerald-500/10'
                      : 'bg-[#0E1424] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40 font-bold">
                      ~{pw.typicalTimelineMonths} Months to Job Ready
                    </span>
                    <span className="text-slate-500 text-xs font-mono">
                      {pw.estimatedLearningHours}h study
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-100 mb-1">
                    {pw.role}
                  </h4>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {pw.steppingStoneRationale}
                  </p>

                  <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-slate-800/80 text-[11px] text-slate-400">
                    <Layers className="w-3 h-3 text-emerald-400" />
                    <span>{pw.transferableSkills.length} Transferable Skills</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Detailed Bridge Dossier */}
          <div className="lg:col-span-7">
            {selectedPathway ? (
              <div className="bg-[#0E1424] p-6 rounded-2xl border border-slate-800 shadow-xl space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 font-mono">
                      Stepping-Stone Pathway Dossier
                    </span>
                    <h3 className="text-xl font-bold text-slate-100">
                      {selectedPathway.role}
                    </h3>
                  </div>

                  <button
                    onClick={() => onSelectPathwayAsNewGoal(selectedPathway.role)}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-[#080B14] rounded-xl font-bold text-xs shadow-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Test-Drive This Roadmap
                  </button>
                </div>

                {/* Rationale */}
                <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 text-xs">
                  <span className="font-semibold text-slate-300 block mb-1">Why This Stepping Stone Works:</span>
                  <p className="text-slate-400 leading-relaxed">
                    {selectedPathway.steppingStoneRationale}
                  </p>
                </div>

                {/* Transferable Skills vs Bridge Skills */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-[#111827] rounded-xl border border-emerald-900/30">
                    <span className="font-bold text-emerald-400 uppercase tracking-wider text-[11px] block mb-2">
                      Transferable Skills You Already Have
                    </span>
                    <ul className="space-y-1.5 text-slate-300 text-[11px]">
                      {selectedPathway.transferableSkills.map((ts, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{ts}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-[#111827] rounded-xl border border-amber-900/30">
                    <span className="font-bold text-amber-400 uppercase tracking-wider text-[11px] block mb-2">
                      Bridge Skills to Acquire
                    </span>
                    <ul className="space-y-1.5 text-slate-300 text-[11px]">
                      {selectedPathway.bridgeSkills.map((bs, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <ArrowRight className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>{bs}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Recommended Portfolio Projects */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                    <FileCode2 className="w-4 h-4 text-cyan-400" />
                    High-Impact Stepping-Stone Projects
                  </h4>
                  <div className="space-y-2">
                    {selectedPathway.recommendedProjects.map((proj, idx) => (
                      <div key={idx} className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-xs text-slate-200 flex items-start gap-2.5">
                        <span className="font-mono text-cyan-400 font-bold">{idx + 1}.</span>
                        <span>{proj}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Assumptions & Limitations */}
                <div className="p-4 bg-slate-900/40 rounded-xl border border-slate-800/80 text-[11px] text-slate-500 space-y-1">
                  <div className="font-semibold text-slate-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Assumptions & Honest Limitations</span>
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 pl-1">
                    {selectedPathway.assumptionsAndLimitations.map((al, idx) => (
                      <li key={idx}>{al}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
};
