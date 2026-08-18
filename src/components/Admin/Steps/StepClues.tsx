import React, { useState } from 'react';
import type { PuzzleDefinition, Clue, ClueType, ClueCondition } from '../../../types/puzzleTypes';
import { formatClueText } from '../../../game/rules/clueFormatter';
import { Plus, Trash2, Copy, Sparkles } from 'lucide-react';

interface StepCluesProps {
  puzzle: PuzzleDefinition;
  onChange: (updates: Partial<PuzzleDefinition>) => void;
}

export const StepClues: React.FC<StepCluesProps> = ({ puzzle, onChange }) => {
  const [selectedType, setSelectedType] = useState<ClueType>('in_room');
  const [subjectId, setSubjectId] = useState<string>(puzzle.suspects[0]?.id || '');
  const [referenceId, setReferenceId] = useState<string>(Object.keys(puzzle.rooms)[0] || '');
  const [secondaryRefId, setSecondaryRefId] = useState<string>('');

  const clueTypes: { type: ClueType; label: string }[] = [
    { type: 'in_room', label: 'IN ROOM' },
    { type: 'not_in_room', label: 'NOT IN ROOM' },
    { type: 'same_room', label: 'SAME ROOM AS' },
    { type: 'not_same_room', label: 'DIFFERENT ROOM FROM' },
    { type: 'south_of', label: 'SOUTH OF' },
    { type: 'north_of', label: 'NORTH OF' },
    { type: 'east_of', label: 'EAST OF' },
    { type: 'west_of', label: 'WEST OF' },
    { type: 'beside_suspect', label: 'BESIDE SUSPECT' },
    { type: 'not_beside_suspect', label: 'NOT BESIDE SUSPECT' },
    { type: 'alone', label: 'ALONE IN ROOM' },
    { type: 'alone_with', label: 'ALONE WITH IN ROOM' },
    { type: 'empty_area', label: 'EMPTY ROOM / NOBODY IN ROOM' },
    { type: 'corner', label: 'IN A CORNER' },
    { type: 'on_object', label: 'ON OBJECT / FURNITURE' },
    { type: 'beside_object', label: 'BESIDE OBJECT' },
    { type: 'west_of_all', label: 'WEST OF ALL OTHERS' },
    { type: 'diagonal', label: 'DIAGONAL FROM' },
  ];

  // Current preview condition
  const previewCondition: ClueCondition = {
    type: selectedType,
    subject: subjectId || puzzle.suspects[0]?.id || 'suspect',
    reference: referenceId,
    secondaryReference: secondaryRefId,
  };

  const previewText = formatClueText(previewCondition, puzzle);

  const handleAddClue = () => {
    const newClue: Clue = {
      id: `clue-${Date.now()}`,
      suspectId: subjectId || puzzle.suspects[0]?.id || 'suspect',
      text: previewText,
      condition: { ...previewCondition },
    };

    onChange({
      clues: [...puzzle.clues, newClue],
    });
  };

  const handleRemoveClue = (clueId: string) => {
    onChange({
      clues: puzzle.clues.filter((c) => c.id !== clueId),
    });
  };

  const handleDuplicateClue = (clue: Clue) => {
    const dup: Clue = {
      ...clue,
      id: `clue-${Date.now()}`,
    };
    onChange({
      clues: [...puzzle.clues, dup],
    });
  };

  const isRoomTargetType = selectedType === 'in_room' || selectedType === 'not_in_room' || selectedType === 'empty_area';
  const isObjectTargetType = selectedType === 'on_object' || selectedType === 'beside_object';
  const isNoReferenceType = selectedType === 'alone' || selectedType === 'corner' || selectedType === 'west_of_all';
  const isSecondaryTargetType = selectedType === 'alone_with';

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-black uppercase tracking-wider text-stone-900 mb-1">
          Structured Clue Builder
        </h3>
        <p className="text-xs text-stone-500 font-medium">
          Create formal logical constraints. Player-facing text is automatically formatted.
        </p>
      </div>

      {/* Clue Builder Form Card */}
      <div className="p-4 bg-white border-2 border-stone-800 rounded-2xl shadow-sm space-y-4">
        <div>
          <label className="block text-[11px] font-black uppercase tracking-wider text-stone-700 mb-1">
            1. Select Constraint / Clue Type
          </label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as ClueType)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border-2 border-stone-300 focus:border-amber-500 focus:outline-hidden text-xs font-bold text-stone-900"
          >
            {clueTypes.map((t) => (
              <option key={t.type} value={t.type}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Subject and Reference Selectors */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-stone-700 mb-1">
              {selectedType === 'empty_area' ? 'Target Room' : 'Subject Suspect'}
            </label>
            {selectedType === 'empty_area' ? (
              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-300 text-xs font-bold text-stone-900"
              >
                {Object.values(puzzle.rooms).map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            ) : (
              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-300 text-xs font-bold text-stone-900"
              >
                {puzzle.suspects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {!isNoReferenceType && (
            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider text-stone-700 mb-1">
                {isRoomTargetType ? 'Target Room' : isObjectTargetType ? 'Target Object' : 'Reference Suspect'}
              </label>

              {isRoomTargetType ? (
                <select
                  value={referenceId}
                  onChange={(e) => setReferenceId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-300 text-xs font-bold text-stone-900"
                >
                  {Object.values(puzzle.rooms).map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              ) : isObjectTargetType ? (
                <select
                  value={referenceId}
                  onChange={(e) => setReferenceId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-300 text-xs font-bold text-stone-900"
                >
                  <option value="safe">Safe</option>
                  <option value="desk">Desk</option>
                  <option value="chair">Chair</option>
                  <option value="couch">Couch / Sofa</option>
                  <option value="table">Table</option>
                  <option value="plant">Plant</option>
                  <option value="bookshelf">Bookshelf</option>
                  <option value="cabinet">Cabinet</option>
                  <option value="fireplace">Fireplace</option>
                  <option value="carpet">Carpet / Rug</option>
                  <option value="microscope">Microscope</option>
                  <option value="bar">Bar</option>
                </select>
              ) : (
                <select
                  value={referenceId}
                  onChange={(e) => setReferenceId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-300 text-xs font-bold text-stone-900"
                >
                  {puzzle.suspects
                    .filter((s) => s.id !== subjectId)
                    .map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                </select>
              )}
            </div>
          )}
        </div>

        {/* Secondary Reference for alone_with */}
        {isSecondaryTargetType && (
          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-stone-700 mb-1">
              Companion Suspect
            </label>
            <select
              value={secondaryRefId}
              onChange={(e) => setSecondaryRefId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-300 text-xs font-bold text-stone-900"
            >
              {puzzle.suspects
                .filter((s) => s.id !== subjectId && s.id !== referenceId)
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
            </select>
          </div>
        )}

        {/* Auto Generated Preview */}
        <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl space-y-1">
          <div className="flex items-center gap-1.5 text-amber-900 text-[10px] font-extrabold uppercase">
            <Sparkles className="w-3 h-3 text-amber-600" />
            <span>Player-Facing Sentence Preview</span>
          </div>
          <p className="text-xs font-bold text-stone-900 italic">"{previewText}"</p>
        </div>

        <button
          onClick={handleAddClue}
          className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Clue to Puzzle</span>
        </button>
      </div>

      {/* Clues List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-black uppercase tracking-wider text-stone-700">
            Active Clues ({puzzle.clues.length})
          </h4>
          <span className="text-[10px] text-stone-500 font-bold">
            {puzzle.clues.length < 5 ? 'Recommend ≥ 6 clues' : 'Good clue density'}
          </span>
        </div>

        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {puzzle.clues.map((c, index) => {
            return (
              <div
                key={c.id}
                className="p-3 bg-white border-2 border-stone-200 hover:border-stone-400 rounded-xl flex items-start justify-between gap-2 transition-all shadow-2xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-stone-200 text-stone-700">
                      #{index + 1}
                    </span>
                    <span className="text-[10px] font-black uppercase text-amber-700">
                      {c.condition.type.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-stone-800 leading-snug">{c.text}</p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleDuplicateClue(c)}
                    className="p-1 text-stone-400 hover:text-stone-700 transition-colors title='Duplicate'"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleRemoveClue(c.id)}
                    className="p-1 text-stone-400 hover:text-red-600 transition-colors title='Remove'"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
