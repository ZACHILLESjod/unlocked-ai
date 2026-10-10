import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CareerRoadmap, Milestone, MultiverseScenario } from './types/roadmap';
import { DEMO_AI_ENGINEER_ROADMAP } from './data/demoRoadmaps';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { OnboardingWizard } from './components/OnboardingWizard';
import { CommandCenter } from './components/CommandCenter';
import { CareerGraphWorkspace } from './components/CareerGraphWorkspace';
import { MilestoneDrawer } from './components/MilestoneDrawer';
import { MultiverseWorkspace } from './components/MultiverseWorkspace';
import { RealityRadarView } from './components/RealityRadarView';
import { OpportunityRadarView } from './components/OpportunityRadarView';
import { SettingsAndExportModal } from './components/SettingsAndExportModal';
import { HackathonDemoGuide } from './components/HackathonDemoGuide';

const STORAGE_KEY = 'unlocked_active_roadmap_v2';

export function App() {
  const [roadmap, setRoadmap] = useState<CareerRoadmap>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load roadmap from storage:', e);
    }
    return DEMO_AI_ENGINEER_ROADMAP;
  });

  const [currentView, setCurrentView] = useState<
    'landing' | 'onboarding' | 'command_center' | 'graph_workspace' | 'multiverse' | 'reality_radar' | 'opportunity_radar'
  >('command_center');

  const [activeMilestoneId, setActiveMilestoneId] = useState<string | null>(null);
  const [activeScenario, setActiveScenario] = useState<MultiverseScenario | null>(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showDemoGuide, setShowDemoGuide] = useState(false);

  // Auto-save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(roadmap));
    } catch (e) {
      console.error('Failed to save roadmap to storage:', e);
    }
  }, [roadmap]);

  // Active milestone for drawer
  const selectedMilestone = roadmap.milestones.find((m) => m.id === activeMilestoneId) || null;

  const handleUpdateMilestone = (updated: Milestone) => {
    const wasDemonstrated = selectedMilestone?.evidence_status === 'demonstrated';
    const isNowDemonstrated = updated.evidence_status === 'demonstrated';

    if (!wasDemonstrated && isNowDemonstrated) {
      // Fire celebration confetti!
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#22D3EE', '#8B5CF6', '#10B981'],
        });
      } catch (e) {
        // Safe fallback if canvas-confetti has issue
      }
    }

    setRoadmap((prev) => ({
      ...prev,
      milestones: prev.milestones.map((m) => (m.id === updated.id ? updated : m)),
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleRoadmapGenerated = (newRoadmap: CareerRoadmap) => {
    setRoadmap(newRoadmap);
    setCurrentView('command_center');
  };

  const handleAcceptScenario = (scenario: MultiverseScenario) => {
    setRoadmap(scenario.proposedRoadmap);
    setActiveScenario(null);
    setCurrentView('graph_workspace');
    try {
      confetti({
        particleCount: 50,
        spread: 45,
        origin: { y: 0.5 },
      });
    } catch (e) {}
  };

  const handleRejectScenario = () => {
    setActiveScenario(null);
  };

  const handlePreviewScenarioInGraph = (scenario: MultiverseScenario) => {
    setActiveScenario(scenario);
    setCurrentView('graph_workspace');
  };

  const handleSelectPathwayAsNewGoal = (newRole: string) => {
    setRoadmap((prev) => ({
      ...prev,
      target_role: newRole,
      goal: newRole,
      updatedAt: new Date().toISOString(),
    }));
    setCurrentView('command_center');
  };

  // Demo Guide step jump handler
  const handleJumpToDemoStep = (stepId: number) => {
    switch (stepId) {
      case 1:
        setCurrentView('onboarding');
        break;
      case 2:
        setCurrentView('graph_workspace');
        break;
      case 3:
        setCurrentView('graph_workspace');
        // Open the first milestone
        if (roadmap.milestones.length > 0) {
          setActiveMilestoneId(roadmap.milestones[0].id);
        }
        break;
      case 4:
        setCurrentView('multiverse');
        break;
      case 5:
        setCurrentView('reality_radar');
        break;
      case 6:
      default:
        setCurrentView('command_center');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-[#080B14] text-[#F8FAFC] flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Navigation Header */}
      <Navbar
        currentView={currentView}
        onChangeView={setCurrentView}
        targetRole={roadmap?.target_role}
        hasActiveRoadmap={Boolean(roadmap)}
        onOpenSettings={() => setShowSettingsModal(true)}
        onToggleDemoGuide={() => setShowDemoGuide((prev) => !prev)}
        showDemoGuide={showDemoGuide}
        onNewRoadmap={() => setCurrentView('onboarding')}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingPage
            onStartOnboarding={() => setCurrentView('onboarding')}
            onLoadPreset={(preset) => {
              setRoadmap(preset);
              setCurrentView('command_center');
            }}
            onExploreGraphDemo={() => {
              setRoadmap(DEMO_AI_ENGINEER_ROADMAP);
              setCurrentView('graph_workspace');
            }}
          />
        )}

        {currentView === 'onboarding' && (
          <div className="py-12 px-4">
            <OnboardingWizard
              onRoadmapGenerated={handleRoadmapGenerated}
              onCancel={() => setCurrentView('command_center')}
            />
          </div>
        )}

        {currentView === 'command_center' && (
          <div className="py-8 px-4">
            <CommandCenter
              roadmap={roadmap}
              onNavigateToGraph={(focusMilestoneId) => {
                if (focusMilestoneId) setActiveMilestoneId(focusMilestoneId);
                setCurrentView('graph_workspace');
              }}
              onNavigateToMultiverse={() => setCurrentView('multiverse')}
              onNavigateToRealityRadar={() => setCurrentView('reality_radar')}
              onNavigateToOpportunityRadar={() => setCurrentView('opportunity_radar')}
              onSelectMilestone={(id) => {
                setActiveMilestoneId(id);
              }}
            />
          </div>
        )}

        {currentView === 'graph_workspace' && (
          <CareerGraphWorkspace
            roadmap={activeScenario ? activeScenario.proposedRoadmap : roadmap}
            selectedMilestoneId={activeMilestoneId}
            onSelectMilestone={(id) => setActiveMilestoneId(id)}
            activeScenario={activeScenario}
            onAcceptScenario={() => activeScenario && handleAcceptScenario(activeScenario)}
            onRejectScenario={handleRejectScenario}
          />
        )}

        {currentView === 'multiverse' && (
          <div className="py-8 px-4">
            <MultiverseWorkspace
              currentRoadmap={roadmap}
              onAcceptScenario={handleAcceptScenario}
              onPreviewInGraph={handlePreviewScenarioInGraph}
              onClose={() => setCurrentView('command_center')}
            />
          </div>
        )}

        {currentView === 'reality_radar' && (
          <div className="py-8 px-4">
            <RealityRadarView
              roadmap={roadmap}
            />
          </div>
        )}

        {currentView === 'opportunity_radar' && (
          <div className="py-8 px-4">
            <OpportunityRadarView
              roadmap={roadmap}
              onSelectPathwayAsNewGoal={handleSelectPathwayAsNewGoal}
            />
          </div>
        )}
      </main>

      {/* Slide-over Milestone Details & SkillProof Drawer */}
      {activeMilestoneId && (
        <MilestoneDrawer
          milestone={selectedMilestone}
          onClose={() => setActiveMilestoneId(null)}
          onUpdateMilestone={handleUpdateMilestone}
          targetRole={roadmap.target_role}
          allMilestones={roadmap.milestones}
        />
      )}

      {/* Settings & Export Dialog */}
      {showSettingsModal && (
        <SettingsAndExportModal
          roadmap={roadmap}
          onClose={() => setShowSettingsModal(false)}
          onResetRoadmap={() => {
            setRoadmap(DEMO_AI_ENGINEER_ROADMAP);
            localStorage.removeItem(STORAGE_KEY);
            setCurrentView('command_center');
          }}
          onLoadDemoPreset={() => {
            setRoadmap(DEMO_AI_ENGINEER_ROADMAP);
            setCurrentView('command_center');
          }}
        />
      )}

      {/* Floating 3-Minute Hackathon Demo Cue Sheet */}
      {showDemoGuide && (
        <HackathonDemoGuide
          onClose={() => setShowDemoGuide(false)}
          onJumpToStep={handleJumpToDemoStep}
        />
      )}
    </div>
  );
}

export default App;
