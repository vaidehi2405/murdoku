import React from 'react';
import type { PuzzleDefinition, Hint } from '../../../types/puzzleTypes';
import { Lightbulb, BookOpen, Plus, Trash2 } from 'lucide-react';

interface StepHintsExplanationProps {
  puzzle: PuzzleDefinition;
  onChange: (updates: Partial<PuzzleDefinition>) => void;
}

export const StepHintsExplanation: React.FC<StepHintsExplanationProps> = ({ puzzle, onChange }) => {
  const hints = puzzle.hints || [];

  const handleUpdateHint = (index: number, updates: Partial<Hint>) => {
    const nextHints = [...hints];
    if (!nextHints[index]) {
      nextHints[index] = {
        level: (index + 1) as 1 | 2 | 3,
        title: `Hint Level ${index + 1}`,
        text: '',
      };
    }
    nextHints[index] = { ...nextHints[index], ...updates };
    onChange({ hints: nextHints });
  };

  const handleUpdateExplanation = (field: 'culpritName' | 'summary', val: string) => {
    onChange({
      solutionExplanation: {
        ...puzzle.solutionExplanation,
        culpritId: puzzle.solutionExplanation?.culpritId || puzzle.suspects[0]?.id || 'culprit',
        culpritName: field === 'culpritName' ? val : puzzle.solutionExplanation?.culpritName || '',
        summary: field === 'summary' ? val : puzzle.solutionExplanation?.summary || '',
        steps: puzzle.solutionExplanation?.steps || [],
      },
    });
  };

  const handleAddStep = () => {
    const nextSteps = [...(puzzle.solutionExplanation?.steps || []), ''];
    onChange({
      solutionExplanation: {
        ...puzzle.solutionExplanation,
        culpritId: puzzle.solutionExplanation?.culpritId || puzzle.suspects[0]?.id || 'culprit',
        culpritName: puzzle.solutionExplanation?.culpritName || puzzle.suspects[0]?.name || '',
        summary: puzzle.solutionExplanation?.summary || '',
        steps: nextSteps,
      },
    });
  };

  const handleUpdateStep = (index: number, val: string) => {
    const nextSteps = [...(puzzle.solutionExplanation?.steps || [])];
    nextSteps[index] = val;
    onChange({
      solutionExplanation: {
        ...puzzle.solutionExplanation,
        steps: nextSteps,
      },
    });
  };

  const handleRemoveStep = (index: number) => {
    const nextSteps = puzzle.solutionExplanation?.steps?.filter((_, i) => i !== index) || [];
    onChange({
      solutionExplanation: {
        ...puzzle.solutionExplanation,
        steps: nextSteps,
      },
    });
  };

  return (
    <div className="space-y-8">
      {/* 3 Progressive Hints Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <h3 className="text-sm font-black uppercase tracking-wider text-stone-900">
            3-Level Progressive Hints
          </h3>
        </div>

        {[0, 1, 2].map((lvlIndex) => {
          const hint = hints[lvlIndex] || {
            level: (lvlIndex + 1) as 1 | 2 | 3,
            title: `Hint Level ${lvlIndex + 1}`,
            text: '',
          };

          const subtitle =
            lvlIndex === 0
              ? 'Level 1: Gentle Conceptual Hint (points toward starting clue)'
              : lvlIndex === 1
              ? 'Level 2: Specific Deduction (narrows down room/area)'
              : 'Level 3: Direct Placement (gives concrete solution placement)';

          return (
            <div key={lvlIndex} className="p-4 bg-white border-2 border-stone-300 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-amber-800">
                  HINT {lvlIndex + 1} OF 3
                </span>
                <span className="text-[10px] text-stone-500 font-bold">{subtitle}</span>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-stone-600 mb-1">
                  Hint Title
                </label>
                <input
                  type="text"
                  value={hint.title || ''}
                  onChange={(e) => handleUpdateHint(lvlIndex, { title: e.target.value })}
                  placeholder="e.g. Starting with the Corner Room"
                  className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-300 text-xs font-bold text-stone-900"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-stone-600 mb-1">
                  Hint Explanation Text
                </label>
                <textarea
                  value={hint.text || ''}
                  onChange={(e) => handleUpdateHint(lvlIndex, { text: e.target.value })}
                  rows={2}
                  placeholder="e.g. Look at Ada's clue. Since Ada was on the carpet, she must be at..."
                  className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-300 text-xs font-medium text-stone-900 resize-none"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Solution Explanation Section */}
      <div className="space-y-4 pt-4 border-t border-stone-200">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-amber-600" />
          <h3 className="text-sm font-black uppercase tracking-wider text-stone-900">
            Solution Explanation (View Solution Panel)
          </h3>
        </div>

        <div className="p-4 bg-white border-2 border-stone-300 rounded-2xl space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-stone-600 mb-1">
                Primary Culprit / Focus Suspect
              </label>
              <select
                value={puzzle.solutionExplanation?.culpritName || puzzle.suspects[0]?.name}
                onChange={(e) => handleUpdateExplanation('culpritName', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-300 text-xs font-bold text-stone-900"
              >
                {puzzle.suspects.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-stone-600 mb-1">
                Summary Introduction Sentence
              </label>
              <input
                type="text"
                value={puzzle.solutionExplanation?.summary || ''}
                onChange={(e) => handleUpdateExplanation('summary', e.target.value)}
                placeholder="The mystery was solved by connecting room constraints..."
                className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-300 text-xs font-bold text-stone-900"
              />
            </div>
          </div>

          {/* Reasoning Steps */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-[10px] font-black uppercase tracking-wider text-stone-600">
                Step-by-Step Reasoning (3–8 points)
              </label>
              <button
                onClick={handleAddStep}
                className="text-[10px] font-bold text-amber-700 hover:text-amber-900 uppercase flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>Add Step</span>
              </button>
            </div>

            {(puzzle.solutionExplanation?.steps || []).map((step, sIndex) => (
              <div key={sIndex} className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-stone-400 w-4">
                  {sIndex + 1}.
                </span>
                <input
                  type="text"
                  value={step}
                  onChange={(e) => handleUpdateStep(sIndex, e.target.value)}
                  placeholder={`Step ${sIndex + 1} reasoning point...`}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-300 text-xs font-medium text-stone-900"
                />
                <button
                  onClick={() => handleRemoveStep(sIndex)}
                  className="p-1 text-stone-400 hover:text-red-600"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
