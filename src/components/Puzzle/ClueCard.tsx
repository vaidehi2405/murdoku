import React from 'react';
import type { Clue } from '../../types/puzzleTypes';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface ClueCardProps {
  clue: Clue;
  isSatisfied?: boolean;
  hasPlacements?: boolean;
}

export const ClueCard: React.FC<ClueCardProps> = ({ clue, isSatisfied, hasPlacements }) => {
  return (
    <div
      className={`p-2.5 rounded-lg border text-xs font-medium transition-all ${
        hasPlacements
          ? isSatisfied
            ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900'
            : 'bg-amber-50/90 border-amber-300 text-amber-900'
          : 'bg-[#FAF7F0] border-stone-300 text-stone-800'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="leading-snug flex-1">{clue.text}</p>
        {hasPlacements && (
          <div className="flex-shrink-0 mt-0.5">
            {isSatisfied ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
