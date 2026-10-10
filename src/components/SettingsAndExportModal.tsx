import React from 'react';
import { CareerRoadmap } from '../types/roadmap';
import { 
  X, 
  FileDown, 
  RotateCcw, 
  Trash2, 
  ShieldCheck, 
  Database, 
  Download,
  Copy,
  Check
} from 'lucide-react';

interface SettingsAndExportModalProps {
  roadmap: CareerRoadmap | null;
  onClose: () => void;
  onResetRoadmap: () => void;
  onLoadDemoPreset: () => void;
}

export const SettingsAndExportModal: React.FC<SettingsAndExportModalProps> = ({
  roadmap,
  onClose,
  onResetRoadmap,
  onLoadDemoPreset,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleExportJSON = () => {
    if (!roadmap) return;
    const blob = new Blob([JSON.stringify(roadmap, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `UNLOCKED-FlightPlan-${roadmap.target_role.replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopySummary = () => {
    if (!roadmap) return;
    const text = `# UNLOCKED — Career Flight Plan: ${roadmap.target_role}
Summary: ${roadmap.summary}
Pacing: ${roadmap.weekly_hours} hrs/week over ${roadmap.target_months} months (~${roadmap.total_estimated_hours} total hours)
Milestones:
${roadmap.milestones.map((m, i) => `${i + 1}. [${m.evidence_status === 'demonstrated' ? 'DEMONSTRATED' : m.learning_status.toUpperCase()}] ${m.title} (${m.estimated_hours}h) - Category: ${m.category}`).join('\n')}
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0E1424] border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl p-6 space-y-6 animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-100">
              Flight Settings & Data Export
            </h3>
            <span className="text-xs text-slate-500">Local persistence and export controls</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Data Persistence Status */}
        <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <Database className="w-4 h-4 text-cyan-400" />
            <div>
              <div className="font-semibold text-slate-200">Local Persistence Active</div>
              <div className="text-[11px] text-slate-500">Auto-saved to browser storage</div>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
            SYNCED
          </span>
        </div>

        {/* Export Options */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Export Options
          </h4>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleExportJSON}
              disabled={!roadmap}
              className="p-3 bg-[#111827] hover:bg-[#162035] border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-semibold text-slate-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              Download JSON
            </button>

            <button
              onClick={handleCopySummary}
              disabled={!roadmap}
              className="p-3 bg-[#111827] hover:bg-[#162035] border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-semibold text-slate-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-violet-400" />
                  Copy Markdown
                </>
              )}
            </button>
          </div>
        </div>

        {/* Preset & Reset Management */}
        <div className="space-y-3 pt-3 border-t border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Reset & Sample Data
          </h4>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => {
                onLoadDemoPreset();
                onClose();
              }}
              className="w-full p-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium rounded-xl border border-slate-800 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
              Reload Verified AI Engineer Preset
            </button>

            <button
              onClick={() => {
                if (window.confirm('Reset all progress and start fresh?')) {
                  onResetRoadmap();
                  onClose();
                }
              }}
              className="w-full p-2.5 bg-rose-950/20 hover:bg-rose-950/40 text-rose-300 text-xs font-medium rounded-xl border border-rose-900/40 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear Saved Roadmap Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
