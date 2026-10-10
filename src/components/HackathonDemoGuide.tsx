import React from 'react';
import { 
  Sparkles, 
  X, 
  Play, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  GitCompare, 
  Radar, 
  Compass, 
  CheckCircle2 
} from 'lucide-react';

interface HackathonDemoGuideProps {
  onClose: () => void;
  onJumpToStep: (step: number) => void;
}

export const HackathonDemoGuide: React.FC<HackathonDemoGuideProps> = ({
  onClose,
  onJumpToStep,
}) => {
  const steps = [
    {
      time: '0:00–0:25',
      title: 'The Goal & Baseline',
      desc: 'Student inputs target role (e.g. AI Engineer), current skills (e.g. Basic Python), and study envelope.',
      actionLabel: 'Launch Onboarding',
      icon: Clock,
      stepId: 1,
    },
    {
      time: '0:25–0:55',
      title: 'The Flight Graph (DAG)',
      desc: 'Real AI generation outputs custom directed acyclic graph. Explore zoom/pan, categories, and prerequisite highlighting.',
      actionLabel: 'View Flight Graph',
      icon: Play,
      stepId: 2,
    },
    {
      time: '0:55–1:35',
      title: 'SkillProof Mission & Rubric',
      desc: 'Open milestone, inspect rubric standards, submit code extract, and run provisional AI rubric assessment.',
      actionLabel: 'Open SkillProof Mission',
      icon: ShieldCheck,
      stepId: 3,
    },
    {
      time: '1:35–2:20',
      title: 'Career Multiverse (What-If)',
      desc: 'Simulate: "What if I only have 3 months?" Compare side-by-side graph diffs and accept/reject the proposal.',
      actionLabel: 'Open Multiverse',
      icon: GitCompare,
      stepId: 4,
    },
    {
      time: '2:20–2:45',
      title: 'Opportunity & Reality Radars',
      desc: 'Traceable employer requirements with real public citations and 3 intermediate bridge roles.',
      actionLabel: 'Inspect Radars',
      icon: Radar,
      stepId: 5,
    },
    {
      time: '2:45–3:00',
      title: 'The Impact',
      desc: 'Evidence-driven flight simulation replacing blind checklists and hallucinations.',
      actionLabel: 'Summary View',
      icon: Compass,
      stepId: 6,
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-md bg-[#0E1424] border border-amber-500/40 rounded-2xl shadow-2xl p-5 space-y-4 animate-in slide-in-from-bottom-5 duration-200">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-amber-500/10 text-amber-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
              3-Minute Live Demo Cue Sheet
            </h4>
            <span className="text-[10px] text-amber-400 font-mono">Judges & Mentors Sequence</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80 hover:border-slate-700 transition-all space-y-1.5 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-amber-400 bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-900/40">
                  {s.time}
                </span>
                <button
                  onClick={() => onJumpToStep(s.stepId)}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  {s.actionLabel} <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="font-semibold text-slate-200 text-xs flex items-center gap-1.5">
                <Icon className="w-3.5 h-3.5 text-slate-400" />
                <span>{s.title}</span>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                {s.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
