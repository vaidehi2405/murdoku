import type { PuzzleDefinition } from '../../../types/puzzleTypes';
import type { Difficulty } from '../../../types/case';

interface StepCaseInfoProps {
  puzzle: PuzzleDefinition;
  onChange: (updates: Partial<PuzzleDefinition>) => void;
}

export const StepCaseInfo: React.FC<StepCaseInfoProps> = ({ puzzle, onChange }) => {
  const difficulties: { id: Difficulty; label: string }[] = [
    { id: 'very_easy', label: 'Very Easy' },
    { id: 'easy', label: 'Easy' },
    { id: 'medium', label: 'Medium' },
    { id: 'hard', label: 'Hard' },
    { id: 'expert', label: 'Expert' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-black uppercase tracking-wider text-stone-900 mb-1">
          Case Information
        </h3>
        <p className="text-xs text-stone-500 font-medium">
          Set basic identity, metadata, and target difficulty for the puzzle.
        </p>
      </div>

      <div className="space-y-4">
        {/* Case ID & Number */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-stone-700 mb-1">
              Case ID (unique slug)
            </label>
            <input
              type="text"
              value={puzzle.caseId}
              onChange={(e) =>
                onChange({
                  caseId: e.target.value.toLowerCase().replace(/\s+/g, '-'),
                  caseNumber: e.target.value.toUpperCase(),
                })
              }
              placeholder="e.g. case-07"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border-2 border-stone-300 focus:border-amber-500 focus:outline-hidden text-xs font-bold text-stone-900 shadow-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-stone-700 mb-1">
              Case Number Label
            </label>
            <input
              type="text"
              value={puzzle.caseNumber}
              onChange={(e) => onChange({ caseNumber: e.target.value })}
              placeholder="e.g. CASE 07"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border-2 border-stone-300 focus:border-amber-500 focus:outline-hidden text-xs font-bold text-stone-900 shadow-xs"
            />
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-stone-700 mb-1">
            Case Title
          </label>
          <input
            type="text"
            value={puzzle.title}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="e.g. The Empty Room"
            className="w-full px-3.5 py-2.5 rounded-xl bg-white border-2 border-stone-300 focus:border-amber-500 focus:outline-hidden text-xs font-bold text-stone-900 shadow-xs"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-stone-700 mb-1">
            Story / Case Briefing
          </label>
          <textarea
            value={puzzle.description}
            onChange={(e) => onChange({ description: e.target.value })}
            rows={3}
            placeholder="A suspect disappeared into thin air from the inner archive..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-white border-2 border-stone-300 focus:border-amber-500 focus:outline-hidden text-xs font-medium text-stone-900 shadow-xs resize-none"
          />
        </div>

        {/* Difficulty & Estimated Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-stone-700 mb-1">
              Difficulty Rating
            </label>
            <select
              value={puzzle.difficulty}
              onChange={(e) => onChange({ difficulty: e.target.value as Difficulty })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border-2 border-stone-300 focus:border-amber-500 focus:outline-hidden text-xs font-bold text-stone-900 shadow-xs"
            >
              {difficulties.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-stone-700 mb-1">
              Estimated Solving Time
            </label>
            <input
              type="text"
              value={puzzle.estimatedTime}
              onChange={(e) => onChange({ estimatedTime: e.target.value })}
              placeholder="e.g. ~8–12 min"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border-2 border-stone-300 focus:border-amber-500 focus:outline-hidden text-xs font-bold text-stone-900 shadow-xs"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
