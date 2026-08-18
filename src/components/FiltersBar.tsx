import React from 'react';
import type { Difficulty, SortOption } from '../types/case';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';

interface FiltersBarProps {
  activeDifficulty: Difficulty | 'all';
  onDifficultyChange: (diff: Difficulty | 'all') => void;
  activeSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export const FiltersBar: React.FC<FiltersBarProps> = ({
  activeDifficulty,
  onDifficultyChange,
  activeSort,
  onSortChange,
}) => {
  const difficulties: { id: Difficulty | 'all'; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'very_easy', label: 'Very Easy' },
    { id: 'easy', label: 'Easy' },
    { id: 'medium', label: 'Medium' },
    { id: 'hard', label: 'Hard' },
    { id: 'expert', label: 'Expert' },
  ];

  return (
    <div className="w-full flex items-center justify-between py-3 px-5 bg-[#FAF7F0] border border-stone-300 rounded-xl shadow-xs mb-6">
      {/* Difficulty Filter Buttons */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-black text-stone-500 uppercase tracking-widest mr-2 flex items-center gap-1.5">
          <SlidersHorizontal className="w-3.5 h-3.5 text-stone-600" />
          DIFFICULTY
        </span>

        <div className="flex items-center gap-1.5 flex-wrap">
          {difficulties.map((diff) => {
            const isActive = activeDifficulty === diff.id;
            return (
              <button
                key={diff.id}
                onClick={() => onDifficultyChange(diff.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 ${
                  isActive
                    ? 'bg-stone-900 text-stone-50 shadow-xs border border-stone-900'
                    : 'bg-stone-200/70 hover:bg-stone-300/80 text-stone-700 border border-stone-300/70'
                }`}
              >
                {diff.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sort Dropdown */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-black text-stone-500 uppercase tracking-widest">
          SORT BY
        </span>

        <div className="relative">
          <select
            value={activeSort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="appearance-none bg-stone-100 border border-stone-300 hover:border-stone-400 rounded-lg py-1.5 pl-3 pr-8 text-xs font-bold text-stone-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500/50 shadow-xs"
          >
            <option value="difficulty">Difficulty</option>
            <option value="newest">Newest</option>
            <option value="shortest">Shortest</option>
            <option value="longest">Longest</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-stone-600 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};
