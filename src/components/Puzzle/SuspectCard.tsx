import React from 'react';
import type { Suspect, Clue } from '../../types/puzzleTypes';
import { ClueCard } from './ClueCard';
import { MapPin } from 'lucide-react';

interface SuspectCardProps {
  suspect: Suspect;
  clues: Clue[];
  isSelected: boolean;
  placementCoord?: string; // "row,col"
  onSelect: (suspectId: string) => void;
  satisfiedClueIds?: Set<string>;
  hasAnyPlacements?: boolean;
}

export const SuspectCard: React.FC<SuspectCardProps> = ({
  suspect,
  clues,
  isSelected,
  placementCoord,
  onSelect,
  satisfiedClueIds,
  hasAnyPlacements,
}) => {
  return (
    <div
      onClick={() => onSelect(suspect.id)}
      className={`rounded-xl border p-3 cursor-pointer transition-all duration-200 ${
        isSelected
          ? 'bg-white border-stone-900 shadow-md ring-2 ring-stone-900/20'
          : 'bg-[#FAF8F5] hover:bg-white border-stone-300 shadow-xs'
      }`}
    >
      {/* Top Header Row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2.5">
          {/* Avatar Initial Circle */}
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shadow-xs border"
            style={{
              backgroundColor: suspect.badgeBg,
              color: suspect.textColor,
              borderColor: suspect.color,
            }}
          >
            {suspect.initial}
          </div>

          <div>
            <h4 className="font-extrabold text-stone-900 text-sm leading-none">{suspect.name}</h4>
            <div className="text-[11px] font-semibold text-stone-500 mt-0.5">
              {clues.length} {clues.length === 1 ? 'clue' : 'clues'}
            </div>
          </div>
        </div>

        {/* Placement Status */}
        {placementCoord ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-stone-900 text-amber-300">
            <MapPin className="w-3 h-3 text-amber-400" />
            {placementCoord}
          </span>
        ) : (
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
            UNPLACED
          </span>
        )}
      </div>

      {/* Associated Clues List */}
      <div className="space-y-1.5 mt-2">
        {clues.map((clue) => (
          <ClueCard
            key={clue.id}
            clue={clue}
            isSatisfied={satisfiedClueIds?.has(clue.id)}
            hasPlacements={hasAnyPlacements}
          />
        ))}
      </div>
    </div>
  );
};
