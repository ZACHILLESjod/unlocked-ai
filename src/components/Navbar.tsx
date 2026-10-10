import React from 'react';
import { 
  Compass, 
  Layers, 
  GitCompare, 
  Radar, 
  Home, 
  Sparkles, 
  Settings, 
  HelpCircle,
  FileDown
} from 'lucide-react';

interface NavbarProps {
  currentView: 'landing' | 'onboarding' | 'command_center' | 'graph_workspace' | 'multiverse' | 'reality_radar' | 'opportunity_radar';
  onChangeView: (view: 'landing' | 'onboarding' | 'command_center' | 'graph_workspace' | 'multiverse' | 'reality_radar' | 'opportunity_radar') => void;
  targetRole?: string;
  hasActiveRoadmap: boolean;
  onOpenSettings: () => void;
  onToggleDemoGuide: () => void;
  showDemoGuide: boolean;
  onNewRoadmap: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onChangeView,
  targetRole,
  hasActiveRoadmap,
  onOpenSettings,
  onToggleDemoGuide,
  showDemoGuide,
  onNewRoadmap,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-[#080B14]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between">
      {/* Brand */}
      <div className="flex items-center gap-6">
        <div 
          onClick={() => onChangeView(hasActiveRoadmap ? 'command_center' : 'landing')}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-400 p-[1px] shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#080B14] rounded-[11px] flex items-center justify-center">
              <Compass className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <div>
            <span className="font-extrabold text-base tracking-wider text-slate-100">
              UNLOCKED
            </span>
            <span className="hidden sm:inline-block text-[10px] text-cyan-400 font-mono ml-2 border border-cyan-800/40 bg-cyan-950/40 px-1.5 py-0.2 rounded">
              v2.4
            </span>
          </div>
        </div>

        {/* Navigation Tabs (visible when roadmap is active) */}
        {hasActiveRoadmap && currentView !== 'landing' && currentView !== 'onboarding' && (
          <nav className="hidden md:flex items-center gap-1 bg-[#0E1424] p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => onChangeView('command_center')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                currentView === 'command_center'
                  ? 'bg-slate-800 text-cyan-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              Command Center
            </button>

            <button
              onClick={() => onChangeView('graph_workspace')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                currentView === 'graph_workspace'
                  ? 'bg-slate-800 text-cyan-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Flight Graph
            </button>

            <button
              onClick={() => onChangeView('multiverse')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                currentView === 'multiverse'
                  ? 'bg-slate-800 text-violet-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <GitCompare className="w-3.5 h-3.5 text-violet-400" />
              Multiverse
            </button>

            <button
              onClick={() => onChangeView('reality_radar')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                currentView === 'reality_radar'
                  ? 'bg-slate-800 text-cyan-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Radar className="w-3.5 h-3.5 text-cyan-400" />
              Reality Radar
            </button>

            <button
              onClick={() => onChangeView('opportunity_radar')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                currentView === 'opportunity_radar'
                  ? 'bg-slate-800 text-emerald-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              Stepping Stones
            </button>
          </nav>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        {/* 3-Minute Demo Guide Button for Judges */}
        <button
          onClick={onToggleDemoGuide}
          className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${
            showDemoGuide
              ? 'bg-amber-950/60 border-amber-500/60 text-amber-300 shadow-lg shadow-amber-500/10'
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
          }`}
          title="Open Hackathon 3-Minute Live Demo Cue Sheet"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">3-Min Demo Guide</span>
        </button>

        {hasActiveRoadmap ? (
          <>
            <button
              onClick={onNewRoadmap}
              className="px-3 py-1.5 text-xs font-medium bg-[#111827] hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              New Plan
            </button>

            <button
              onClick={onOpenSettings}
              className="p-2 text-slate-400 hover:text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-colors cursor-pointer"
              title="Settings & Export Data"
            >
              <Settings className="w-4 h-4" />
            </button>
          </>
        ) : (
          <button
            onClick={onNewRoadmap}
            className="px-4 py-2 bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-[#080B14] font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
          >
            Get Started
          </button>
        )}
      </div>
    </header>
  );
};
