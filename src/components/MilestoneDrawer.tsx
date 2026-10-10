import React, { useState } from 'react';
import { Milestone, RubricCriterion } from '../types/roadmap';
import { 
  X, 
  CheckCircle2, 
  ExternalLink, 
  Code2, 
  FileText, 
  ShieldCheck, 
  AlertCircle, 
  Sparkles, 
  Send, 
  Clock, 
  ListChecks, 
  BookOpen, 
  Layers,
  ChevronRight,
  RotateCcw
} from 'lucide-react';
import { fetchMilestoneAdvice, fetchEvaluateEvidence } from '../lib/api';

interface MilestoneDrawerProps {
  milestone: Milestone | null;
  onClose: () => void;
  onUpdateMilestone: (updated: Milestone) => void;
  targetRole: string;
  allMilestones: Milestone[];
}

export const MilestoneDrawer: React.FC<MilestoneDrawerProps> = ({
  milestone,
  onClose,
  onUpdateMilestone,
  targetRole,
  allMilestones,
}) => {
  if (!milestone) return null;

  const [activeTab, setActiveTab] = useState<'mission' | 'skillproof' | 'advice'>('mission');

  // Evidence submission state
  const [repoUrl, setRepoUrl] = useState(milestone.submission?.repoUrl || '');
  const [liveUrl, setLiveUrl] = useState(milestone.submission?.liveUrl || '');
  const [summary, setSummary] = useState(milestone.submission?.summary || '');
  const [codeSnippet, setCodeSnippet] = useState(milestone.submission?.codeSnippet || '');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationError, setEvaluationError] = useState<string | null>(null);

  // AI Advice state
  const [adviceData, setAdviceData] = useState<any>(null);
  const [isLoadingAdvice, setIsLoadingAdvice] = useState(false);

  // Completed tasks local check
  const [completedTasks, setCompletedTasks] = useState<Set<number>>(new Set());

  const toggleTask = (index: number) => {
    const next = new Set(completedTasks);
    if (next.has(index)) next.delete(index);
    else next.add(index);
    setCompletedTasks(next);

    // If all tasks done, consider marking learning_status in_progress/completed
    if (next.size === milestone.tasks.length && milestone.learning_status === 'not_started') {
      onUpdateMilestone({
        ...milestone,
        learning_status: 'in_progress',
      });
    }
  };

  const handleStatusToggle = (newStatus: 'not_started' | 'in_progress' | 'completed') => {
    onUpdateMilestone({
      ...milestone,
      learning_status: newStatus,
    });
  };

  const handleSubmitEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!summary.trim() && !codeSnippet.trim()) {
      setEvaluationError('Please provide a project summary or a code snippet for rubric evaluation.');
      return;
    }

    setIsEvaluating(true);
    setEvaluationError(null);

    try {
      const evaluation = await fetchEvaluateEvidence({
        milestone_title: milestone.title,
        mission_brief: milestone.mission_brief || milestone.description,
        rubric: milestone.rubric || [],
        repo_url: repoUrl,
        live_url: liveUrl,
        summary,
        code_snippet: codeSnippet,
      });

      const isDemonstrated = evaluation.overallDecision === 'demonstrated';

      const updatedMilestone: Milestone = {
        ...milestone,
        evidence_status: isDemonstrated ? 'demonstrated' : 'revision_requested',
        learning_status: isDemonstrated ? 'completed' : 'in_progress',
        submission: {
          repoUrl,
          liveUrl,
          summary,
          codeSnippet,
          submittedAt: new Date().toISOString(),
          evaluation,
        },
      };

      onUpdateMilestone(updatedMilestone);
    } catch (err: any) {
      console.error('Evidence submission failed:', err);
      setEvaluationError(err.message || 'Failed to evaluate evidence.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleRequestAdvice = async () => {
    setIsLoadingAdvice(true);
    try {
      const data = await fetchMilestoneAdvice({
        goal: targetRole,
        current_skills: [],
        milestone_title: milestone.title,
        milestone_description: milestone.description,
        prerequisites_status: milestone.prerequisites.length ? 'Prerequisites tracked' : 'Foundational',
        weekly_hours: 10,
        current_progress: milestone.learning_status,
      });
      setAdviceData(data);
    } catch (err) {
      console.error('Failed to get advice:', err);
    } finally {
      setIsLoadingAdvice(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-xl bg-[#0B0F19] border-l border-slate-800 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-6 border-b border-slate-800 bg-[#0E1424] flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-cyan-400 font-mono">
              {milestone.category}
            </span>
            <span className="text-slate-600">·</span>
            <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
              <Clock className="w-3 h-3 text-slate-500" />
              <span>{milestone.estimated_hours} Hours Est.</span>
            </div>
          </div>
          <h2 className="text-xl font-bold text-slate-100 leading-snug">
            {milestone.title}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
          aria-label="Close drawer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 bg-[#0B0F19] px-6">
        <button
          onClick={() => setActiveTab('mission')}
          className={`py-3 px-3 text-xs font-medium border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'mission'
              ? 'border-cyan-400 text-cyan-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ListChecks className="w-4 h-4" />
          Mission & Tasks
        </button>
        <button
          onClick={() => setActiveTab('skillproof')}
          className={`py-3 px-3 text-xs font-medium border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'skillproof'
              ? 'border-cyan-400 text-cyan-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          SkillProof Evidence
          {milestone.evidence_status === 'demonstrated' && (
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          )}
        </button>
        <button
          onClick={() => {
            setActiveTab('advice');
            if (!adviceData && !isLoadingAdvice) handleRequestAdvice();
          }}
          className={`py-3 px-3 text-xs font-medium border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'advice'
              ? 'border-cyan-400 text-cyan-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          AI Tactics
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* TAB 1: Mission & Tasks */}
        {activeTab === 'mission' && (
          <div className="space-y-6">
            {/* Status quick switcher */}
            <div className="p-3 bg-[#111827] rounded-xl border border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">Learning Status:</span>
              <div className="flex items-center gap-1.5">
                {(['not_started', 'in_progress', 'completed'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusToggle(st)}
                    className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                      milestone.learning_status === st
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    {st === 'not_started' ? 'Not Started' : st === 'in_progress' ? 'In Progress' : 'Completed'}
                  </button>
                ))}
              </div>
            </div>

            {/* Mission Brief */}
            <div className="p-4 bg-[#111827]/70 rounded-xl border border-slate-800/80">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                Mission Brief & Objective
              </h3>
              <p className="text-sm text-slate-200 leading-relaxed">
                {milestone.mission_brief || milestone.description}
              </p>
            </div>

            {/* Career Relevance */}
            {milestone.career_relevance && (
              <div className="p-4 bg-[#0F1626]/70 rounded-xl border border-cyan-900/30">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-1 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  Market Relevance
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {milestone.career_relevance}
                </p>
              </div>
            )}

            {/* Prerequisites */}
            {milestone.prerequisites && milestone.prerequisites.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Prerequisites
                </h3>
                <div className="space-y-1.5">
                  {milestone.prerequisites.map((pId) => {
                    const prereq = allMilestones.find((m) => m.id === pId);
                    const isDone = prereq?.learning_status === 'completed' || prereq?.evidence_status === 'demonstrated';
                    return (
                      <div
                        key={pId}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs"
                      >
                        <span className="text-slate-300 font-medium">
                          {prereq ? prereq.title : pId}
                        </span>
                        <span className={`text-[11px] font-mono ${isDone ? 'text-emerald-400' : 'text-slate-500'}`}>
                          {isDone ? 'Fulfilled ✓' : 'Pending'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step-by-Step Tasks */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Execution Tasks
                </h3>
                <span className="text-xs text-slate-500 font-mono">
                  {completedTasks.size} / {milestone.tasks?.length || 0} completed
                </span>
              </div>
              <div className="space-y-2">
                {(milestone.tasks || []).map((task, idx) => {
                  const isChecked = completedTasks.has(idx);
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleTask(idx)}
                      className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-300'
                          : 'bg-[#111827]/40 border-slate-800 text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="mt-0.5 w-4 h-4 rounded border-slate-700 text-cyan-500 focus:ring-0"
                      />
                      <span className={`text-xs leading-relaxed ${isChecked ? 'line-through text-slate-400' : ''}`}>
                        {task}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Deliverables */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Expected Deliverables
              </h3>
              <div className="space-y-1.5">
                {(milestone.deliverables || []).map((del, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-300 p-2 bg-slate-900/40 rounded-lg border border-slate-800/80">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{del}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Learning Resources */}
            {milestone.resources && milestone.resources.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Recommended Learning Resources
                </h3>
                <div className="space-y-2">
                  {milestone.resources.map((res, idx) => (
                    <a
                      key={idx}
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-xl bg-[#111827] border border-slate-800 hover:border-slate-700 group transition-all"
                    >
                      <div className="flex items-center gap-2.5">
                        <BookOpen className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                        <div>
                          <div className="text-xs font-medium text-slate-200 group-hover:text-cyan-300 transition-colors">
                            {res.title}
                          </div>
                          <div className="text-[10px] text-slate-500 uppercase tracking-wider">
                            {res.type} · {res.isFree ? 'Free' : 'Subscription'}
                          </div>
                        </div>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SkillProof Evidence */}
        {activeTab === 'skillproof' && (
          <div className="space-y-6">
            {/* Status Banner */}
            <div className={`p-4 rounded-xl border ${
              milestone.evidence_status === 'demonstrated'
                ? 'bg-emerald-950/30 border-emerald-500/40'
                : milestone.evidence_status === 'evidence_submitted'
                ? 'bg-amber-950/30 border-amber-500/40'
                : 'bg-[#111827] border-slate-800'
            }`}>
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className={`w-4 h-4 ${
                  milestone.evidence_status === 'demonstrated' ? 'text-emerald-400' : 'text-slate-400'
                }`} />
                <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                  SkillProof Verification Status
                </h4>
              </div>
              <p className="text-xs text-slate-400">
                {milestone.evidence_status === 'demonstrated'
                  ? 'Demonstrated. Evaluated against milestone rubric. Prerequisites for dependent nodes are unlocked.'
                  : milestone.evidence_status === 'revision_requested'
                  ? 'Revision Requested. Address gap feedback below and resubmit your implementation.'
                  : milestone.evidence_status === 'evidence_submitted'
                  ? 'Evidence under evaluation.'
                  : 'Not demonstrated yet. Self-reported progress does not unlock dependent paths until proven against the rubric.'}
              </p>
            </div>

            {/* Rubric Definition */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Evaluation Rubric Standards
              </h3>
              <div className="space-y-2">
                {(milestone.rubric || []).map((r, idx) => (
                  <div key={idx} className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-slate-200">{r.criterion}</span>
                      <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-800/40">
                        {r.weight}% Weight
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px] mb-1.5">{r.description}</p>
                    <div className="text-[11px] text-slate-300 bg-slate-950/60 p-2 rounded border border-slate-800/60 font-mono">
                      Passing Standard: {r.passingStandard}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submission Form */}
            <form onSubmit={handleSubmitEvidence} className="p-4 bg-[#111827] rounded-xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                Submit Project Evidence
              </h4>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  GitHub Repository or Portfolio URL
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/your-username/project-repo"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Deployed Live Application URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://your-project.vercel.app"
                  value={liveUrl}
                  onChange={(e) => setLiveUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Technical Summary of What You Implemented
                </label>
                <textarea
                  rows={2}
                  placeholder="Explain architectural decisions, libraries used, and how you verified functionality..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-medium text-slate-400">
                    Code Snippet / Core Implementation Extract
                  </label>
                  <span className="text-[10px] text-cyan-400">Enables rubric verification</span>
                </div>
                <textarea
                  rows={4}
                  placeholder="Paste representative code snippet, schema, or configuration for automated rubric scoring..."
                  value={codeSnippet}
                  onChange={(e) => setCodeSnippet(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {evaluationError && (
                <div className="p-2.5 bg-rose-950/40 border border-rose-800/40 rounded-lg text-xs text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{evaluationError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isEvaluating}
                className="w-full py-2.5 px-4 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-[#080B14] font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {isEvaluating ? (
                  <>
                    <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                    Evaluating Evidence Against Rubric...
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    Submit Evidence for Rubric Assessment
                  </>
                )}
              </button>
            </form>

            {/* Assessment Feedback Results */}
            {milestone.submission?.evaluation && (
              <div className="p-4 bg-[#0F1424] rounded-xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    Provisional Assessment Results
                  </span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded font-mono ${
                    milestone.submission.evaluation.overallDecision === 'demonstrated'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {milestone.submission.evaluation.overallDecision === 'demonstrated'
                      ? 'DEMONSTRATED ✓'
                      : 'NEEDS REVISION'}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                  {milestone.submission.evaluation.summaryFeedback}
                </p>

                {/* Criterion Level Scores */}
                <div>
                  <h5 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Criterion-Level Breakdown
                  </h5>
                  <div className="space-y-1.5">
                    {milestone.submission.evaluation.criteriaResults.map((cr, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-slate-900/40 border border-slate-800/80 text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-slate-200">{cr.criterion}</span>
                          <span className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded ${
                            cr.status === 'pass'
                              ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                              : 'bg-amber-950/60 text-amber-400 border border-amber-800/40'
                          }`}>
                            {cr.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">{cr.feedback}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Strengths & Gaps */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-emerald-950/10 rounded-lg border border-emerald-900/30">
                    <span className="font-semibold text-emerald-400 text-[11px] block mb-1">Strengths</span>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-300 text-[11px]">
                      {milestone.submission.evaluation.strengths.map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 bg-amber-950/10 rounded-lg border border-amber-900/30">
                    <span className="font-semibold text-amber-400 text-[11px] block mb-1">Gaps / Next Steps</span>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-300 text-[11px]">
                      {milestone.submission.evaluation.gaps.map((g, idx) => (
                        <li key={idx}>{g}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-800 font-mono">
                  Provisional Assessment · Based on student-submitted explanation and code excerpt.
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: AI Tactics */}
        {activeTab === 'advice' && (
          <div className="space-y-6">
            {isLoadingAdvice ? (
              <div className="p-8 text-center space-y-3">
                <RotateCcw className="w-6 h-6 text-cyan-400 animate-spin mx-auto" />
                <p className="text-xs text-slate-400">Synthesizing personalized flight tactics for this milestone...</p>
              </div>
            ) : adviceData ? (
              <div className="space-y-4">
                {/* Why it matters */}
                <div className="p-4 bg-[#111827] rounded-xl border border-slate-800">
                  <h4 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
                    Why Employers Test This
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {adviceData.why_it_matters}
                  </p>
                </div>

                {/* Key concepts */}
                <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800">
                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Core Concepts to Master
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {(adviceData.key_concepts || []).map((c: string, idx: number) => (
                      <span key={idx} className="text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-200 border border-slate-700">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Ordered Implementation Steps */}
                <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800">
                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Ordered Implementation Sequence
                  </h4>
                  <div className="space-y-2">
                    {(adviceData.ordered_tasks || []).map((task: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <span className="font-mono text-cyan-400 font-bold shrink-0">{idx + 1}.</span>
                        <span>{task}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Common Pitfalls */}
                {adviceData.common_pitfalls && (
                  <div className="p-4 bg-amber-950/20 rounded-xl border border-amber-900/40">
                    <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
                      Common Traps to Avoid
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {adviceData.common_pitfalls.map((pitfall: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-amber-400">•</span>
                          <span>{pitfall}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center p-8">
                <button
                  onClick={handleRequestAdvice}
                  className="px-4 py-2 bg-cyan-500 text-[#080B14] rounded-lg text-xs font-semibold hover:bg-cyan-400 transition-colors"
                >
                  Load Flight Tactics
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
