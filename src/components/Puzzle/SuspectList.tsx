import React from 'react';
import type { Suspect, Clue } from '../../types/puzzleTypes';
import { SuspectCard } from './SuspectCard';
import { Users } from 'lucide-react';

interface SuspectListProps {
  suspects: Suspect[];
  clues: Clue[];
  selectedSuspectId: string | null;
  placements: Record<string, string>;
  onSelectSuspect: (suspectId: string) => void;
  satisfiedClueIds?: Set<string>;
}

export const SuspectList: React.FC<SuspectListProps> = ({
  suspects,
  clues,
  selectedSuspectId,
  placements,
  onSelectSuspect,
  satisfiedClueIds,
}) => {
  const hasAnyPlacements = Object.values(placements).some((coord) => Boolean(coord));

  return (
    <div className="w-80 flex flex-col bg-[#ECE7DE] border-r border-stone-300 overflow-hidden h-full">
      {/* List Header */}
      <div className="py-3 px-4 bg-[#E0D9CB] border-b border-stone-300 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-stone-700" />
          <h3 className="text-xs font-black tracking-wider uppercase text-stone-900">
            SUSPECTS & CLUES
          </h3>
        </div>
        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-stone-300 text-stone-700">
          {suspects.length}
        </span>
      </div>

      {/* Scrollable Suspects List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {suspects.map((suspect) => {
          const suspectClues = clues.filter((c) => c.suspectId === suspect.id);
          return (
            <SuspectCard
              key={suspect.id}
              suspect={suspect}
              clues={suspectClues}
              isSelected={selectedSuspectId === suspect.id}
              placementCoord={placements[suspect.id]}
              onSelect={onSelectSuspect}
              satisfiedClueIds={satisfiedClueIds}
              hasAnyPlacements={hasAnyPlacements}
            />
          );
        })}
      </div>
    </div>
  );
};
