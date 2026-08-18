import React, { useState } from 'react';
import type { PuzzleDefinition, Suspect } from '../../../types/puzzleTypes';
import { Plus, Trash2, CheckCircle2, AlertTriangle } from 'lucide-react';

interface StepSuspectsSolutionProps {
  puzzle: PuzzleDefinition;
  onChange: (updates: Partial<PuzzleDefinition>) => void;
  selectedSuspectId: string;
  onSelectSuspect: (suspectId: string) => void;
}

export const StepSuspectsSolution: React.FC<StepSuspectsSolutionProps> = ({
  puzzle,
  onChange,
  selectedSuspectId,
  onSelectSuspect,
}) => {
  const [newSuspectName, setNewSuspectName] = useState('');
  const [newSuspectColor, setNewSuspectColor] = useState('#3B82F6');

  // Add suspect helper
  const handleAddSuspect = () => {
    if (!newSuspectName.trim()) return;
    const sId = newSuspectName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const newSuspect: Suspect = {
      id: sId,
      name: newSuspectName.trim(),
      initial: newSuspectName.trim()[0].toUpperCase(),
      color: newSuspectColor,
      badgeBg: newSuspectColor,
      textColor: '#FFFFFF',
      avatarBg: '#E0F2FE',
    };

    onChange({
      suspects: [...puzzle.suspects, newSuspect],
    });
    setNewSuspectName('');
    onSelectSuspect(sId);
  };

  // Remove suspect helper
  const handleRemoveSuspect = (suspectId: string) => {
    const nextSuspects = puzzle.suspects.filter((s) => s.id !== suspectId);
    const nextSolution = { ...puzzle.solution };
    delete nextSolution[suspectId];
    onChange({
      suspects: nextSuspects,
      solution: nextSolution,
    });
  };

  // Row and Col check
  const solutionRows = new Set<number>();
  const solutionCols = new Set<number>();
  let hasRowCollision = false;
  let hasColCollision = false;

  for (const [_, coord] of Object.entries(puzzle.solution || {})) {
    if (solutionRows.has(coord.row)) hasRowCollision = true;
    if (solutionCols.has(coord.col)) hasColCollision = true;
    solutionRows.add(coord.row);
    solutionCols.add(coord.col);
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-black uppercase tracking-wider text-stone-900 mb-1">
          Suspects & Solution Target
        </h3>
        <p className="text-xs text-stone-500 font-medium">
          Select a suspect, then click a cell on the board to assign their intended solution placement.
        </p>
      </div>

      {/* Row/Col Status Pill */}
      <div className="p-3 bg-stone-100 rounded-2xl border border-stone-200 space-y-1">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-stone-600">Total Suspects:</span>
          <span className="font-mono text-stone-900">{puzzle.suspects.length}</span>
        </div>
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-stone-600">Solution Placements:</span>
          <span className="font-mono text-stone-900">
            {Object.keys(puzzle.solution || {}).length} / {puzzle.suspects.length}
          </span>
        </div>
        {hasRowCollision || hasColCollision ? (
          <div className="pt-2 flex items-center gap-1.5 text-red-600 text-xs font-bold">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>Row or Column duplicate detected in solution!</span>
          </div>
        ) : Object.keys(puzzle.solution || {}).length === puzzle.suspects.length && puzzle.suspects.length > 0 ? (
          <div className="pt-2 flex items-center gap-1.5 text-emerald-700 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>All suspects placed with unique rows and columns!</span>
          </div>
        ) : null}
      </div>

      {/* Suspects List */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-black uppercase tracking-wider text-stone-700">
          Suspects Roster
        </h4>
        {puzzle.suspects.map((s) => {
          const placement = puzzle.solution?.[s.id];
          const isSelected = selectedSuspectId === s.id;

          return (
            <div
              key={s.id}
              onClick={() => onSelectSuspect(s.id)}
              className={`p-3 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                isSelected
                  ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-400/40'
                  : 'border-stone-300 bg-white hover:border-stone-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white font-black text-xs shadow-xs"
                  style={{ backgroundColor: s.color }}
                >
                  {s.initial}
                </div>
                <div>
                  <div className="text-xs font-black text-stone-900">{s.name}</div>
                  <div className="text-[10px] text-stone-500 font-mono">
                    {placement ? `Placed at (${placement.row}, ${placement.col})` : 'Unplaced'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {placement ? (
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
                    ({placement.row},{placement.col})
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                    Needs Placement
                  </span>
                )}

                {puzzle.suspects.length > 4 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveSuspect(s.id);
                    }}
                    className="p-1 text-stone-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add New Suspect Form */}
      <div className="p-3.5 bg-white border-2 border-dashed border-stone-300 rounded-2xl space-y-3">
        <span className="text-[11px] font-black uppercase tracking-wider text-stone-600 block">
          + Add New Suspect
        </span>
        <div className="flex gap-2">
          <input
            type="text"
            value={newSuspectName}
            onChange={(e) => setNewSuspectName(e.target.value)}
            placeholder="e.g. Gabriel"
            className="flex-1 px-3 py-2 rounded-lg bg-stone-50 border border-stone-300 text-xs font-bold text-stone-900"
          />
          <input
            type="color"
            value={newSuspectColor}
            onChange={(e) => setNewSuspectColor(e.target.value)}
            className="w-10 h-9 rounded border cursor-pointer"
          />
        </div>
        <button
          onClick={handleAddSuspect}
          className="w-full py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Suspect</span>
        </button>
      </div>
    </div>
  );
};
