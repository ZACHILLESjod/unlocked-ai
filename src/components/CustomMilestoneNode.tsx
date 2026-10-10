import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Milestone } from '../types/roadmap';
import { 
  CheckCircle2, 
  Lock, 
  Sparkles, 
  Clock, 
  FileCode2, 
  ShieldCheck, 
  AlertCircle,
  ArrowRight
} from 'lucide-react';

interface CustomNodeProps {
  data: {
    milestone: Milestone;
    status: 'locked' | 'available' | 'in_progress' | 'completed' | 'demonstrated';
    isSelected?: boolean;
    isPrereqOfSelected?: boolean;
    isDependentOfSelected?: boolean;
    diffStatus?: 'added' | 'removed' | 'modified' | 'preserved';
    onSelectMilestone?: (milestoneId: string) => void;
  };
}

export const CustomMilestoneNode = memo(({ data }: CustomNodeProps) => {
  const { milestone, status, isSelected, isPrereqOfSelected, isDependentOfSelected, diffStatus, onSelectMilestone } = data;

  const getStatusStyles = () => {
    if (diffStatus === 'added') {
      return 'border-emerald-500/80 bg-emerald-950/20 shadow-emerald-500/10 shadow-lg';
    }
    if (diffStatus === 'removed') {
      return 'border-rose-500/80 bg-rose-950/20 opacity-60 line-through';
    }
    if (diffStatus === 'modified') {
      return 'border-amber-500/80 bg-amber-950/20 shadow-amber-500/10 shadow-lg';
    }

    switch (status) {
      case 'demonstrated':
        return 'border-emerald-500/80 bg-[#0B151C] shadow-[0_0_20px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/30';
      case 'completed':
        return 'border-cyan-500/70 bg-[#0A1220] shadow-[0_0_15px_rgba(34,211,238,0.1)]';
      case 'in_progress':
        return 'border-violet-500/80 bg-[#120F24] shadow-[0_0_20px_rgba(139,92,246,0.2)] ring-1 ring-violet-500/40';
      case 'available':
        return 'border-slate-700 bg-[#0D1322] hover:border-cyan-500/60 hover:bg-[#10182D] transition-colors';
      case 'locked':
      default:
        return 'border-slate-800/80 bg-[#0A0E17]/90 opacity-65';
    }
  };

  const getStatusBadge = () => {
    if (diffStatus === 'added') {
      return (
        <span className="text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
          + Multiverse Add
        </span>
      );
    }
    if (diffStatus === 'removed') {
      return (
        <span className="text-[10px] font-medium text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
          - Skipped
        </span>
      );
    }
    if (diffStatus === 'modified') {
      return (
        <span className="text-[10px] font-medium text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
          ~ Adjusted
        </span>
      );
    }

    if (milestone.evidence_status === 'demonstrated') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          Skill Demonstrated
        </span>
      );
    }
    if (milestone.evidence_status === 'evidence_submitted') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/30">
          <AlertCircle className="w-3 h-3 text-amber-400" />
          Review Pending
        </span>
      );
    }
    if (status === 'completed') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">
          <CheckCircle2 className="w-3 h-3 text-cyan-400" />
          Completed
        </span>
      );
    }
    if (status === 'in_progress') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-violet-400 bg-violet-500/10 px-1.5 py-0.5 rounded border border-violet-500/30 animate-pulse">
          <Sparkles className="w-3 h-3 text-violet-400" />
          In Flight
        </span>
      );
    }
    if (status === 'available') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded">
          <ArrowRight className="w-3 h-3 text-cyan-400" />
          Available Next
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-500 bg-slate-900/80 px-1.5 py-0.5 rounded">
        <Lock className="w-2.5 h-2.5 text-slate-500" />
        Prerequisites Locked
      </span>
    );
  };

  return (
    <div
      onClick={() => onSelectMilestone?.(milestone.id)}
      className={`relative w-[300px] rounded-xl border p-4 cursor-pointer transition-all duration-200 select-none ${getStatusStyles()} ${
        isSelected ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-[#080B14]' : ''
      } ${isPrereqOfSelected ? 'ring-1 ring-cyan-500/70 border-cyan-400/60' : ''} ${
        isDependentOfSelected ? 'ring-1 ring-violet-500/70 border-violet-400/60' : ''
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !-left-1.5 !bg-cyan-400 !border-2 !border-[#080B14]"
      />

      {/* Card Header: Category & Hours */}
      <div className="flex items-center justify-between text-xs mb-2">
        <span className="font-medium text-slate-400 uppercase tracking-wider text-[10px]">
          {milestone.category}
        </span>
        <div className="flex items-center gap-1 text-slate-400 text-[11px] font-mono">
          <Clock className="w-3 h-3 text-slate-500" />
          <span>{milestone.estimated_hours}h</span>
        </div>
      </div>

      {/* Milestone Title */}
      <h4 className="text-sm font-semibold text-slate-100 leading-snug line-clamp-2 mb-2">
        {milestone.title}
      </h4>

      {/* Description Snippet */}
      <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed">
        {milestone.description}
      </p>

      {/* Footer Info: Status Badge & Deliverables Count */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
        <div>{getStatusBadge()}</div>

        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <FileCode2 className="w-3 h-3 text-slate-500" />
          <span>{milestone.deliverables?.length || 1} {milestone.deliverables?.length === 1 ? 'task' : 'deliverables'}</span>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !-right-1.5 !bg-cyan-400 !border-2 !border-[#080B14]"
      />
    </div>
  );
});

CustomMilestoneNode.displayName = 'CustomMilestoneNode';
