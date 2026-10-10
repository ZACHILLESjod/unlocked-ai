import React, { useState, useEffect } from 'react';
import { CareerRoadmap, RealityRadarRoleData } from '../types/roadmap';
import { fetchRealityRadar } from '../lib/api';
import { 
  Radar, 
  ExternalLink, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Search, 
  Building2, 
  Calendar, 
  Layers, 
  Info,
  RotateCcw
} from 'lucide-react';

interface RealityRadarViewProps {
  roadmap: CareerRoadmap;
  onAddSkillToRoadmap?: (skillName: string) => void;
}

export const RealityRadarView: React.FC<RealityRadarViewProps> = ({
  roadmap,
  onAddSkillToRoadmap,
}) => {
  const [marketData, setMarketData] = useState<RealityRadarRoleData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetchRealityRadar(roadmap.target_role)
      .then((data) => {
        if (isMounted) {
          setMarketData(data);
          if (data.topRequirements.length > 0) {
            setSelectedSkill(data.topRequirements[0].skill);
          }
        }
      })
      .catch((err) => {
        console.error('Failed to load reality radar:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [roadmap.target_role]);

  // Check which skills in reality radar are covered in roadmap milestones
  const coveredSkillsMap = React.useMemo(() => {
    if (!marketData) return new Map<string, boolean>();
    const map = new Map<string, boolean>();
    const roadmapTitles = roadmap.milestones.map((m) => m.title.toLowerCase());
    const roadmapDescriptions = roadmap.milestones.map((m) => m.description.toLowerCase());

    marketData.topRequirements.forEach((req) => {
      const words = req.skill.toLowerCase().split(/[\s,&/]+/);
      const isCovered = words.some(
        (w) => w.length > 3 && (roadmapTitles.some((t) => t.includes(w)) || roadmapDescriptions.some((d) => d.includes(w)))
      );
      map.set(req.skill, isCovered);
    });

    return map;
  }, [marketData, roadmap.milestones]);

  const activeRequirement = marketData?.topRequirements.find((r) => r.skill === selectedSkill);

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider font-mono">
            Feature 3 · Reality Radar
          </span>
        </div>
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Radar className="w-6 h-6 text-cyan-400" />
          Employer Evidence & Job Requirement Radar
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-3xl">
          Ground your flight path in verified market requirements. Every skill frequency is derived directly from our curated sample of public job specifications—not hallucinated statistics.
        </p>
      </div>

      {isLoading ? (
        <div className="p-16 text-center space-y-3">
          <RotateCcw className="w-6 h-6 text-cyan-400 animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Retrieving employer job requirement evidence for {roadmap.target_role}...</p>
        </div>
      ) : marketData ? (
        <div className="space-y-6">
          {/* Metadata Disclosure Card */}
          <div className="p-4 bg-[#0E1424] rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Target Role</span>
                <span className="font-bold text-slate-200">{marketData.role}</span>
              </div>
              <div className="h-6 w-px bg-slate-800" />
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Curated Sample Size</span>
                <span className="font-mono text-cyan-400 font-bold">{marketData.sampleSize} Public Job Descriptions</span>
              </div>
              <div className="h-6 w-px bg-slate-800" />
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Retrieval Date</span>
                <span className="font-mono text-slate-300">{marketData.retrievalDate}</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 max-w-sm">
              <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>{marketData.dataDisclaimer}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Requirements Frequency Table */}
            <div className="lg:col-span-6 bg-[#0E1424] p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Employer-Requested Core Competencies
                </h3>
                <span className="text-[10px] text-slate-500 font-mono">Sample Frequency</span>
              </div>

              <div className="space-y-2.5">
                {marketData.topRequirements.map((req, idx) => {
                  const isCovered = coveredSkillsMap.get(req.skill);
                  const isSelected = selectedSkill === req.skill;

                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedSkill(req.skill)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#141C30] border-cyan-500/70 shadow-lg shadow-cyan-500/10'
                          : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                            req.importance === 'Must Have'
                              ? 'bg-rose-950/40 text-rose-400 border border-rose-800/40'
                              : req.importance === 'Preferred'
                              ? 'bg-amber-950/40 text-amber-400 border border-amber-800/40'
                              : 'bg-violet-950/40 text-violet-400 border border-violet-800/40'
                          }`}>
                            {req.importance}
                          </span>
                          <span className="font-semibold text-xs text-slate-200">
                            {req.skill}
                          </span>
                        </div>

                        <span className="text-xs font-mono font-bold text-cyan-400">
                          {req.frequencyRatio}
                        </span>
                      </div>

                      {/* Progress bar representing frequency */}
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-2">
                        <div
                          className="h-full bg-gradient-to-r from-violet-500 to-cyan-400 rounded-full"
                          style={{ width: `${req.percentage}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500 font-mono">
                          Supported by {req.percentage}% of sampled listings
                        </span>

                        <span className={`flex items-center gap-1 font-medium ${
                          isCovered ? 'text-emerald-400' : 'text-amber-400'
                        }`}>
                          {isCovered ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              Covered in Roadmap
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-3 h-3 text-amber-400" />
                              Skill Gap
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Selected Requirement Sources & Citations */}
            <div className="lg:col-span-6 space-y-6">
              {activeRequirement ? (
                <div className="bg-[#0E1424] p-6 rounded-2xl border border-slate-800 shadow-xl space-y-5">
                  <div className="border-b border-slate-800 pb-3">
                    <span className="text-[10px] text-cyan-400 font-mono uppercase tracking-wider">
                      Ground Truth Citations
                    </span>
                    <h3 className="text-base font-bold text-slate-100">
                      {activeRequirement.skill}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Observed in {activeRequirement.frequencyRatio} ({activeRequirement.percentage}%) of sampled specifications in the {marketData.retrievalDate} index.
                    </p>
                  </div>

                  {/* Representative Excerpts from Genuine Public Postings */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Representative Excerpts from Job Specifications
                    </h4>

                    {activeRequirement.representativeSources.map((source, i) => (
                      <div key={i} className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                            <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                            <span>{source.company}</span>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {source.date}
                            </span>
                            <a
                              href={source.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5"
                            >
                              Listing <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          </div>
                        </div>

                        <p className="text-slate-300 italic text-[11px] pl-2 border-l border-cyan-500/40">
                          "{source.context}"
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Common Technologies Cloud */}
                  <div className="pt-3 border-t border-slate-800">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                      Associated Stack & Technologies
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {marketData.commonTechnologies.map((tech, i) => (
                        <span key={i} className="px-2.5 py-1 bg-slate-900 text-slate-300 text-xs rounded-lg border border-slate-800 font-mono">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Experience Expectations */}
                  <div className="p-3.5 bg-[#111827] rounded-xl border border-slate-800/80 text-xs">
                    <span className="font-semibold text-slate-200 block mb-1">
                      Experience Expectations in This Sample:
                    </span>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      {marketData.experienceExpectations}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center text-slate-500">
                  Select a skill on the left to inspect citations and sources.
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
