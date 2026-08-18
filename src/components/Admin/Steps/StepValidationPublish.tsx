import React, { useState } from 'react';
import type { PuzzleDefinition } from '../../../types/puzzleTypes';
import { validateAuthorPuzzle } from '../../../game/validation/authorValidation';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Play,
  Save,
  Send,
} from 'lucide-react';

interface StepValidationPublishProps {
  puzzle: PuzzleDefinition;
  onSaveDraft: () => void;
  onPublish: () => void;
}

export const StepValidationPublish: React.FC<StepValidationPublishProps> = ({
  puzzle,
  onSaveDraft,
  onPublish,
}) => {
  const [isSolving, setIsSolving] = useState(false);

  const report = validateAuthorPuzzle(puzzle);

  const handleRunSolver = () => {
    setIsSolving(true);
    setTimeout(() => {
      setIsSolving(false);
    }, 150);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-black uppercase tracking-wider text-stone-900 mb-1">
          Mathematical Solver & Validation
        </h3>
        <p className="text-xs text-stone-500 font-medium">
          Run the brute-force solver to prove that this puzzle has exactly one mathematically unique solution.
        </p>
      </div>

      {/* Big Solver Action Box */}
      <div className="p-5 bg-stone-900 text-stone-100 rounded-3xl border-2 border-stone-800 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-widest text-amber-300">
            SOLVER ENGINE STATUS
          </span>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-stone-800 text-stone-300">
            {report.solutionCount === 1 ? '1 UNIQUE' : `${report.solutionCount} SOLUTIONS`}
          </span>
        </div>

        {/* Status Callout */}
        <div
          className={`p-4 rounded-2xl border-2 flex items-center gap-3 ${
            report.isPublishable
              ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
              : report.solutionCount === 0
              ? 'bg-red-950/80 border-red-500 text-red-200'
              : 'bg-amber-950/80 border-amber-500 text-amber-200'
          }`}
        >
          {report.isPublishable ? (
            <CheckCircle2 className="w-7 h-7 text-emerald-400 flex-shrink-0" />
          ) : report.solutionCount === 0 ? (
            <XCircle className="w-7 h-7 text-red-400 flex-shrink-0" />
          ) : (
            <AlertTriangle className="w-7 h-7 text-amber-400 flex-shrink-0" />
          )}

          <div>
            <div className="text-sm font-black uppercase tracking-wide">
              {report.isPublishable
                ? '✓ READY TO PUBLISH (1 UNIQUE SOLUTION)'
                : report.solutionCount === 0
                ? '✕ 0 SOLUTIONS (CONTRADICTION FOUND)'
                : `⚠ ${report.solutionCount} SOLUTIONS (AMBIGUOUS PUZZLE)`}
            </div>
            <div className="text-xs font-normal opacity-90 mt-0.5">
              {report.isPublishable
                ? 'Mathematical solver confirmed exactly one valid placement configuration matching your solution.'
                : report.solutionCount === 0
                ? 'The clue set produces no valid solutions. Check for conflicting spatial constraints.'
                : 'Multiple placement combinations satisfy all current clues. Add more clues to narrow it down to 1.'}
            </div>
          </div>
        </div>

        <button
          onClick={handleRunSolver}
          disabled={isSolving}
          className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95 disabled:opacity-50"
        >
          <Play className="w-4 h-4 fill-stone-950" />
          <span>{isSolving ? 'CALCULATING COMBINATIONS...' : 'RUN MATHEMATICAL SOLVER'}</span>
        </button>
      </div>

      {/* 10-Point Checklist */}
      <div className="space-y-3">
        <h4 className="text-xs font-black uppercase tracking-wider text-stone-700">
          Validation Checklist ({report.checks.filter((c) => c.passed).length} / {report.checks.length} Passed)
        </h4>

        <div className="space-y-2">
          {report.checks.map((check) => (
            <div
              key={check.id}
              className={`p-3 rounded-xl border flex items-center justify-between text-xs font-bold transition-all ${
                check.passed
                  ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                  : 'bg-red-50/60 border-red-200 text-red-950'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {check.passed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                )}
                <span>{check.title}</span>
              </div>
              <span className="text-[10px] font-normal text-stone-600">{check.message}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-stone-200">
        <button
          onClick={onSaveDraft}
          className="flex-1 py-3 px-4 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>SAVE DRAFT</span>
        </button>

        <button
          onClick={onPublish}
          disabled={!report.isPublishable}
          className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
          <span>PUBLISH PUZZLE</span>
        </button>
      </div>
    </div>
  );
};
