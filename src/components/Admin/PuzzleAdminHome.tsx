import React, { useState, useMemo } from 'react';
import type { PuzzleDefinition } from '../../types/puzzleTypes';
import {
  getAllRegisteredPuzzles,
  getPuzzleDrafts,
  savePuzzleDraft,
  deletePuzzleDraft,
} from '../../game/puzzleRegistry';
import { validateAuthorPuzzle } from '../../game/validation/authorValidation';
import { getGenerationStats } from '../../game/inventory/inventoryManager';
import { triggerBackgroundGeneration } from '../../game/inventory/generationOrchestrator';
import {
  Plus,
  ArrowLeft,
  Edit,
  Copy,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Play,
  Trash2,
  BookOpen,
  Bot,
  Zap,
  RefreshCw,
} from 'lucide-react';

interface PuzzleAdminHomeProps {
  onSelectPuzzleToEdit: (puzzle: PuzzleDefinition) => void;
  onCreateNewPuzzle: () => void;
  onExitAdmin: () => void;
  onTestPlayCase: (caseId: string) => void;
}

export const PuzzleAdminHome: React.FC<PuzzleAdminHomeProps> = ({
  onSelectPuzzleToEdit,
  onCreateNewPuzzle,
  onExitAdmin,
  onTestPlayCase,
}) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [testBatchSize, setTestBatchSize] = useState(1);

  // Combine static, published, and draft puzzles
  const allPuzzles = useMemo(() => {
    const published = getAllRegisteredPuzzles();
    const drafts = Object.values(getPuzzleDrafts());

    // Map by ID
    const combined: (PuzzleDefinition & { isDraft?: boolean })[] = [
      ...published.map((p) => ({ ...p, isDraft: false })),
      ...drafts.map((d) => ({ ...d, isDraft: true })),
    ];

    return combined;
  }, [refreshTrigger]);

  const handleDuplicate = (puzzle: PuzzleDefinition) => {
    const newId = `draft-${Date.now()}`;
    const newCaseNumber = `CASE ${(allPuzzles.length + 1).toString().padStart(2, '0')}`;
    const duplicate: PuzzleDefinition = {
      ...JSON.parse(JSON.stringify(puzzle)),
      id: newId,
      caseId: `case-${(allPuzzles.length + 1).toString().padStart(2, '0')}`,
      caseNumber: newCaseNumber,
      title: `${puzzle.title} (Copy)`,
    };
    savePuzzleDraft(duplicate);
    setRefreshTrigger((n) => n + 1);
  };

  const handleDeleteDraft = (draftId: string) => {
    deletePuzzleDraft(draftId);
    setRefreshTrigger((n) => n + 1);
  };

  return (
    <div className="min-h-screen bg-[#F4F0E8] text-stone-900 flex flex-col font-sans">
      {/* Top Admin Header */}
      <header className="h-16 px-8 bg-stone-900 text-stone-100 flex items-center justify-between border-b border-stone-800 shadow-md">
        <div className="flex items-center gap-4">
          <button
            onClick={onExitAdmin}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-400 font-bold text-xs uppercase tracking-wider transition-colors border border-stone-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Game</span>
          </button>
          <div className="h-6 w-px bg-stone-700" />
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h1 className="text-base font-black tracking-wider uppercase text-stone-100">
              PUZZLE AUTHORING STUDIO
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
              INTERNAL TOOL
            </span>
          </div>
        </div>

        <button
          onClick={onCreateNewPuzzle}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs uppercase tracking-wider shadow-md transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>CREATE NEW PUZZLE</span>
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto p-8">
        <div className="bg-[#FAF8F5] border-2 border-stone-800 rounded-3xl shadow-xl overflow-hidden">
          <div className="px-8 py-5 border-b border-stone-200 flex items-center justify-between bg-stone-100/60">
            <div>
              <h2 className="text-sm font-black uppercase tracking-wider text-stone-900">
                CASE REPOSITORY & DRAFTS ({allPuzzles.length})
              </h2>
              <p className="text-xs text-stone-500 font-medium mt-0.5">
                Deterministic puzzle definitions loaded by the game engine.
              </p>
            </div>
          </div>

          {/* Puzzle Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-100/90 text-[11px] font-black uppercase tracking-wider text-stone-600">
                  <th className="py-3.5 px-6">Case ID</th>
                  <th className="py-3.5 px-6">Title</th>
                  <th className="py-3.5 px-4">Difficulty</th>
                  <th className="py-3.5 px-4">Grid</th>
                  <th className="py-3.5 px-4 text-center">Suspects</th>
                  <th className="py-3.5 px-4 text-center">Clues</th>
                  <th className="py-3.5 px-6">Validation & Solver</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 text-xs font-semibold text-stone-800">
                {allPuzzles.map((p) => {
                  const valReport = validateAuthorPuzzle(p);
                  return (
                    <tr key={p.id} className="hover:bg-amber-50/50 transition-colors">
                      <td className="py-4 px-6 font-mono font-bold text-stone-900">
                        {p.caseNumber || p.caseId}
                      </td>
                      <td className="py-4 px-6 font-bold text-stone-900">
                        {p.title}
                        <div className="text-[11px] text-stone-500 font-normal truncate max-w-xs">
                          {p.description}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-stone-200 text-stone-800">
                          {p.difficulty?.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-mono font-bold">
                        {p.gridRows || 6}×{p.gridCols || 6}
                      </td>
                      <td className="py-4 px-4 text-center font-bold">
                        {p.suspects?.length || 0}
                      </td>
                      <td className="py-4 px-4 text-center font-bold">
                        {p.clues?.length || 0}
                      </td>
                      <td className="py-4 px-6">
                        {valReport.isPublishable ? (
                          <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                            <span>1 Solution (Valid)</span>
                          </div>
                        ) : valReport.solutionCount === 0 ? (
                          <div className="flex items-center gap-1.5 text-red-600 font-bold text-xs">
                            <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                            <span>0 Solutions</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-amber-700 font-bold text-xs">
                            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                            <span>{valReport.solutionCount} Solutions (Ambiguous)</span>
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        {p.isDraft ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300">
                            DRAFT
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                            PUBLISHED
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onSelectPuzzleToEdit(p)}
                            className="p-1.5 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-800 transition-colors title='Edit Puzzle'"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDuplicate(p)}
                            className="p-1.5 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-800 transition-colors title='Duplicate Puzzle'"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          {!p.isDraft && (
                            <button
                              onClick={() => onTestPlayCase(p.caseId)}
                              className="p-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 transition-colors title='Test Play in Game'"
                            >
                              <Play className="w-4 h-4" />
                            </button>
                          )}
                          {p.isDraft && (
                            <button
                              onClick={() => handleDeleteDraft(p.id)}
                              className="p-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-800 transition-colors title='Delete Draft'"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Generated Cases Section */}
        <div className="mt-8 bg-[#FAF8F5] border-2 border-stone-800 rounded-3xl shadow-xl overflow-hidden">
          <div className="px-8 py-5 border-b border-stone-200 flex items-center justify-between bg-stone-100/60">
            <div className="flex items-center gap-3">
              <Bot className="w-5 h-5 text-purple-600" />
              <div>
                <h2 className="text-sm font-black uppercase tracking-wider text-stone-900">
                  AI GENERATED CASES
                </h2>
                <p className="text-xs text-stone-500 font-medium mt-0.5">
                  Puzzles generated by Groq and validated by the mathematical solver.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-stone-200 px-3 py-1.5 rounded-lg">
                <label className="text-[10px] font-black uppercase tracking-wider text-stone-600">Batch Size:</label>
                <select
                  value={testBatchSize}
                  onChange={(e) => setTestBatchSize(parseInt(e.target.value))}
                  className="bg-white border border-stone-300 rounded px-2 py-0.5 text-xs font-bold text-stone-800"
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => {
                  setIsGenerating(true);
                  triggerBackgroundGeneration(testBatchSize);
                  setTimeout(() => {
                    setIsGenerating(false);
                    setRefreshTrigger((n) => n + 1);
                  }, 5000);
                }}
                disabled={isGenerating}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wider shadow-md transition-all ${
                  isGenerating
                    ? 'bg-stone-400 text-stone-200 cursor-not-allowed'
                    : 'bg-purple-600 hover:bg-purple-500 text-white hover:scale-105 active:scale-95'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span>{isGenerating ? 'GENERATING...' : 'GENERATE TEST BATCH'}</span>
              </button>
              <button
                onClick={() => setRefreshTrigger((n) => n + 1)}
                className="p-2 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          {(() => {
            const stats = getGenerationStats();
            return (
              <div className="px-8 py-3 bg-stone-50 border-b border-stone-200 flex items-center gap-6 text-xs font-bold">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  <span className="text-stone-600">Generated:</span>
                  <span className="text-stone-900">{stats.generated}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span className="text-stone-600">Validating:</span>
                  <span className="text-stone-900">{stats.validating}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span className="text-stone-600">Approved:</span>
                  <span className="text-stone-900">{stats.approved}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                  <span className="text-stone-600">Available:</span>
                  <span className="text-stone-900">{stats.available}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                  <span className="text-stone-600">Rejected:</span>
                  <span className="text-stone-900">{stats.rejected}</span>
                </div>
                <div className="flex items-center gap-1.5 ml-auto">
                  <span className="text-stone-600">Total:</span>
                  <span className="text-stone-900 font-mono">{stats.total}</span>
                </div>
              </div>
            );
          })()}

          {/* Generation Logs */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-100/90 text-[11px] font-black uppercase tracking-wider text-stone-600">
                  <th className="py-3 px-4">Case ID</th>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-3">Difficulty</th>
                  <th className="py-3 px-3">Direct/Relational</th>
                  <th className="py-3 px-3 text-center">Redundant</th>
                  <th className="py-3 px-3 text-center">Connectivity</th>
                  <th className="py-3 px-3 text-center">Deduction Depth</th>
                  <th className="py-3 px-3 text-center">Solvability Score</th>
                  <th className="py-3 px-3">State</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 text-xs font-semibold text-stone-800">
                {(() => {
                  const stats = getGenerationStats();
                  if (stats.entries.length === 0) {
                    return (
                      <tr>
                        <td colSpan={10} className="py-8 text-center text-stone-500 text-xs font-medium">
                          No AI-generated puzzles yet. Click "Generate Test Batch" to start.
                        </td>
                      </tr>
                    );
                  }
                  return stats.entries.map((entry) => {
                    const qm = entry.qualityMetrics;
                    return (
                      <tr key={entry.puzzle.caseId} className="hover:bg-purple-50/50 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-stone-900">
                          {entry.puzzle.caseNumber || entry.puzzle.caseId}
                        </td>
                        <td className="py-3 px-4 font-bold text-stone-900">
                          {entry.puzzle.title}
                          <div className="text-[11px] text-stone-500 font-normal truncate max-w-xs">
                            {entry.puzzle.description}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-stone-200">
                            {entry.puzzle.difficulty?.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono">
                          {qm ? (
                            <span className="text-purple-700 font-bold">
                              {qm.directClueCount} dir / {qm.relationalClueCount} rel
                            </span>
                          ) : (
                            '—'
                          )}
                        </td>
                        <td className="py-3 px-3 font-mono text-center">
                          {qm ? (
                            <span className={qm.redundantClueCount > 2 ? 'text-red-600 font-bold' : 'text-stone-700'}>
                              {qm.redundantClueCount}
                            </span>
                          ) : (
                            '0'
                          )}
                        </td>
                        <td className="py-3 px-3 font-mono text-center">
                          {qm ? `${(qm.suspectConnectivityScore * 100).toFixed(0)}%` : '—'}
                        </td>
                        <td className="py-3 px-3 font-mono text-center">
                          {qm ? `${qm.deductionDepth} steps` : '—'}
                        </td>
                        <td className="py-3 px-3 text-center font-bold">
                          {qm ? (
                            <span
                              className={`px-2 py-0.5 rounded-md font-mono text-[11px] ${
                                qm.humanSolvabilityScore >= 80
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : qm.humanSolvabilityScore >= 50
                                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                  : 'bg-red-100 text-red-800 border border-red-300'
                              }`}
                            >
                              {qm.humanSolvabilityScore} / 100
                            </span>
                          ) : (
                            '—'
                          )}
                        </td>
                        <td className="py-3 px-3">
                          {entry.status === 'available' ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">AVAILABLE</span>
                          ) : entry.status === 'approved' ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-100 text-blue-800 border border-blue-300">APPROVED</span>
                          ) : entry.status === 'rejected' ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-red-100 text-red-800 border border-red-300" title={entry.rejectionReason || ''}>REJECTED</span>
                          ) : entry.status === 'generated' ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-800 border border-amber-300">GENERATED</span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-stone-200 text-stone-700">{entry.status.toUpperCase()}</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {(entry.status === 'available' || entry.status === 'approved') && (
                              <button
                                onClick={() => onTestPlayCase(entry.puzzle.caseId)}
                                className="p-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 transition-colors"
                                title="Play Case"
                              >
                                <Play className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {entry.status !== 'rejected' && (
                              <button
                                onClick={() => onSelectPuzzleToEdit(entry.puzzle)}
                                className="p-1.5 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-800 transition-colors"
                                title="Edit Puzzle"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  });
                })()}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};
