import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  DollarSign, 
  RotateCcw,
  Zap
} from 'lucide-react';
import { fetchGenerateRoadmap } from '../lib/api';
import { CareerRoadmap } from '../types/roadmap';

interface OnboardingWizardProps {
  onRoadmapGenerated: (roadmap: CareerRoadmap) => void;
  onCancel: () => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  onRoadmapGenerated,
  onCancel,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form state
  const [goal, setGoal] = useState('AI Engineer');
  const [customGoal, setCustomGoal] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Basic Python', 'Git fundamentals']);
  const [skillInput, setSkillInput] = useState('');
  const [experienceLevel, setExperienceLevel] = useState<'beginner' | 'intermediate' | 'career_switcher'>('beginner');
  const [weeklyHours, setWeeklyHours] = useState(12);
  const [targetMonths, setTargetMonths] = useState(6);
  const [budgetTier, setBudgetTier] = useState<'free_only' | 'standard' | 'flexible'>('standard');

  // Loading & error state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStage, setGenerationStage] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const popularRoles = [
    'AI Engineer',
    'Full Stack Web Developer',
    'Cloud & DevOps Engineer',
    'Data Scientist / ML Engineer',
    'Cybersecurity Analyst',
    'Frontend Developer (React/TS)',
  ];

  const suggestedSkills = [
    'Python',
    'JavaScript',
    'TypeScript',
    'React',
    'HTML/CSS',
    'SQL',
    'Git',
    'Docker',
    'Linux Basics',
    'FastAPI',
  ];

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const addCustomSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    const trimmed = skillInput.trim();
    if (trimmed && !selectedSkills.includes(trimmed)) {
      setSelectedSkills([...selectedSkills, trimmed]);
      setSkillInput('');
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setErrorMessage(null);
    setGenerationStage('Analyzing profile inputs & market skill dependencies...');

    try {
      const finalGoal = goal === 'custom' ? customGoal.trim() : goal;

      setTimeout(() => {
        setGenerationStage('Synthesizing milestones, rubrics & project briefs...');
      }, 900);

      setTimeout(() => {
        setGenerationStage('Validating acyclic dependency graph & time allocations...');
      }, 1900);

      const generated = await fetchGenerateRoadmap({
        goal: finalGoal,
        current_skills: selectedSkills,
        weekly_hours: weeklyHours,
        target_months: targetMonths,
        budget_tier: budgetTier,
        experience_level: experienceLevel,
      });

      onRoadmapGenerated(generated);
    } catch (err: any) {
      console.error('Roadmap generation error:', err);
      setErrorMessage(err.message || 'Failed to generate flight path. Please try again.');
      setIsGenerating(false);
    }
  };

  const selectedGoalDisplay = goal === 'custom' ? customGoal : goal;

  return (
    <div className="w-full max-w-3xl mx-auto p-6 space-y-6">
      {/* Wizard Progress Stepper */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 font-mono">
            Flight Plan Initialization
          </span>
          <h2 className="text-xl font-bold text-slate-100">
            Configure Your Career Flight Path
          </h2>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
          <span>Step {step} of 4</span>
        </div>
      </div>

      {/* Stepper Progress Bar */}
      <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-300 rounded-full"
          style={{ width: `${(step / 4) * 100}%` }}
        />
      </div>

      {isGenerating ? (
        <div className="bg-[#0E1424] p-12 rounded-3xl border border-cyan-500/30 text-center space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20 animate-ping"></div>
            <div className="relative w-16 h-16 rounded-full bg-cyan-950/60 border border-cyan-400 flex items-center justify-center text-cyan-400">
              <RotateCcw className="w-8 h-8 animate-spin" />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-bold text-slate-100">
              Generating Your Career Flight Path
            </h3>
            <p className="text-xs text-cyan-300 font-mono">
              {generationStage}
            </p>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Synthesizing real market rubrics, structuring acyclic prerequisite nodes, and customizing milestones for {selectedGoalDisplay}.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-[#0E1424] p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
          {/* STEP 1: Career Goal */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div>
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-1">
                  Step 1 · Choose Your Target Role
                </h3>
                <p className="text-xs text-slate-400">
                  Select a target position or enter a custom specialty.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {popularRoles.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      setGoal(r);
                      setCustomGoal('');
                    }}
                    className={`p-3.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                      goal === r
                        ? 'bg-cyan-950/40 border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-500/10'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Or enter custom role:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Distributed Systems Engineer, MLOps Specialist..."
                  value={customGoal}
                  onChange={(e) => {
                    setCustomGoal(e.target.value);
                    setGoal('custom');
                  }}
                  className="w-full px-4 py-2.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Experience Baseline
                </label>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  {[
                    { id: 'beginner', label: 'Beginner', desc: 'Starting from scratch' },
                    { id: 'intermediate', label: 'Intermediate', desc: 'Some coding experience' },
                    { id: 'career_switcher', label: 'Switcher', desc: 'Transitioning from another field' },
                  ].map((lvl) => (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setExperienceLevel(lvl.id as any)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        experienceLevel === lvl.id
                          ? 'bg-violet-950/40 border-violet-400 text-violet-300'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="font-bold text-slate-200">{lvl.label}</div>
                      <div className="text-[10px] text-slate-500">{lvl.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Current Skills */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div>
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-1">
                  Step 2 · Your Current Skill Inventory
                </h3>
                <p className="text-xs text-slate-400">
                  Tell us what you already know. UNLOCKED skips redundant beginner topics while reserving required validation rubrics.
                </p>
              </div>

              {/* Selected Skills Chips */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Recognized Skills ({selectedSkills.length})
                </label>
                <div className="flex flex-wrap gap-1.5 min-h-[42px] p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                  {selectedSkills.length === 0 ? (
                    <span className="text-xs text-slate-600 italic">No skills selected yet (starting from ground floor)</span>
                  ) : (
                    selectedSkills.map((s) => (
                      <span
                        key={s}
                        onClick={() => toggleSkill(s)}
                        className="px-2.5 py-1 text-xs font-medium bg-cyan-950/40 text-cyan-300 border border-cyan-800/60 rounded-lg flex items-center gap-1.5 cursor-pointer hover:bg-rose-950/40 hover:text-rose-300 hover:border-rose-800/60 transition-colors"
                      >
                        {s} <span className="text-slate-500 hover:text-rose-300">×</span>
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Add Custom Skill */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Add another skill:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Next.js, PyTorch, Linux CLI..."
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={addCustomSkill}
                    className="flex-1 px-4 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    type="button"
                    onClick={addCustomSkill}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Suggested Skills */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2">
                  Suggested Common Foundations:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {suggestedSkills.map((s) => {
                    const isSelected = selectedSkills.includes(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => toggleSkill(s)}
                        className={`px-2.5 py-1 text-xs rounded-lg border transition-all ${
                          isSelected
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                            : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Time & Budget Constraints */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div>
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-1">
                  Step 3 · Availability & Resource Constraints
                </h3>
                <p className="text-xs text-slate-400">
                  Calibrate your flight duration. UNLOCKED designs realistic milestones based on actual weekly hours.
                </p>
              </div>

              {/* Weekly hours slider */}
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    Weekly Study Availability
                  </span>
                  <span className="font-mono text-cyan-400 font-bold">{weeklyHours} Hours / Week</span>
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
                  <span>2 hrs (Paced)</span>
                  <span>15 hrs (Focused)</span>
                  <span>40 hrs (Full-time)</span>
                </div>
              </div>

              {/* Target timeline slider */}
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-violet-400" />
                    Target Timeline
                  </span>
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
                  <span>24 mos (Extended)</span>
                </div>
              </div>

              {/* Budget Tier */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Resource & Budget Preference
                </label>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  {[
                    { id: 'free_only', label: '100% Free', desc: 'Open-source & docs only' },
                    { id: 'standard', label: 'Standard', desc: 'Mix of free & cheap tutorials' },
                    { id: 'flexible', label: 'Flexible', desc: 'Open to certifications' },
                  ].map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setBudgetTier(b.id as any)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        budgetTier === b.id
                          ? 'bg-cyan-950/40 border-cyan-400 text-cyan-300'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="font-bold text-slate-200">{b.label}</div>
                      <div className="text-[10px] text-slate-500">{b.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Review Flight Plan */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div>
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-1">
                  Step 4 · Flight Plan Review
                </h3>
                <p className="text-xs text-slate-400">
                  Review your parameters before launching AI flight path synthesis.
                </p>
              </div>

              <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Target Role</span>
                  <span className="font-bold text-slate-100">{selectedGoalDisplay}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Experience Baseline</span>
                  <span className="font-medium text-slate-200 uppercase tracking-wider text-[11px]">{experienceLevel}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Current Recognized Skills</span>
                  <span className="font-medium text-slate-200">{selectedSkills.join(', ') || 'None (Starting from scratch)'}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Study Envelope</span>
                  <span className="font-mono text-cyan-400 font-bold">{weeklyHours} hrs/week over {targetMonths} months (~{weeklyHours * targetMonths * 4} total hours)</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-400">Budget Tier</span>
                  <span className="font-medium text-slate-200 uppercase tracking-wider text-[11px]">{budgetTier}</span>
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 bg-rose-950/40 border border-rose-800/40 rounded-xl text-xs text-rose-300">
                  {errorMessage}
                </div>
              )}
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => (s - 1) as any)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-800 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Previous Step
              </button>
            ) : (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-slate-500 hover:text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep((s) => (s + 1) as any)}
                className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-[#080B14] rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                Next Step
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleGenerate}
                className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-[#080B14] rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                Launch Flight Synthesis
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
