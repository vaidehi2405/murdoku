import React, { useState, useMemo, useEffect } from 'react';
import type { Case, Difficulty, TabFilter, SortOption } from '../types/case';
import { INITIAL_CASES } from '../data/casesData';
import { getAllProgress } from '../game/storage';
import { getAllRegisteredPuzzles } from '../game/puzzleRegistry';
import { triggerBackgroundGeneration } from '../game/inventory/generationOrchestrator';
import { Header } from './Header';
import { CaseTabs } from './CaseTabs';
import { FiltersBar } from './FiltersBar';
import { CaseCard } from './CaseCard';
import { DeskFooter } from './DeskFooter';
import { HowToPlayModal } from './HowToPlayModal';
import { SettingsModal } from './SettingsModal';
import { SearchX } from 'lucide-react';

interface CaseLibraryProps {
  onSelectCase: (caseData: Case, mode: 'play' | 'continue' | 'replay') => void;
  onOpenAdmin?: () => void;
  refreshKey?: number;
}

export const CaseLibrary: React.FC<CaseLibraryProps> = ({ onSelectCase, onOpenAdmin, refreshKey = 0 }) => {
  const [activeTab, setActiveTab] = useState<TabFilter>('all');
  const [activeDifficulty, setActiveDifficulty] = useState<Difficulty | 'all'>('all');
  const [activeSort, setActiveSort] = useState<SortOption>('difficulty');

  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Trigger background generation check on mount (non-blocking, silent)
  useEffect(() => {
    triggerBackgroundGeneration();
  }, []);

  // Merge static initial cases with saved progress from LocalStorage and published custom puzzles
  const cases: Case[] = useMemo(() => {
    const savedMap = getAllProgress();
    const registeredPuzzles = getAllRegisteredPuzzles();

    // Map existing initial cases
    const initialMap = new Map(INITIAL_CASES.map((c) => [c.id, c]));

    // Merge registered puzzles into case list
    for (const puzzle of registeredPuzzles) {
      if (initialMap.has(puzzle.caseId)) {
        const existing = initialMap.get(puzzle.caseId)!;
        initialMap.set(puzzle.caseId, {
          ...existing,
          title: puzzle.title,
          difficulty: puzzle.difficulty,
          estimatedTime: puzzle.estimatedTime || existing.estimatedTime,
        });
      } else {
        // New custom published puzzle!
        initialMap.set(puzzle.caseId, {
          id: puzzle.caseId,
          caseNumber: puzzle.caseNumber || puzzle.caseId.toUpperCase(),
          title: puzzle.title,
          difficulty: puzzle.difficulty,
          status: 'new',
          estimatedTime: puzzle.estimatedTime || '~8–12 min',
          orderIndex: initialMap.size + 1,
          roomType: 'mansion',
        });
      }
    }

    return Array.from(initialMap.values()).map((c) => {
      const saved = savedMap[c.id];
      if (!saved) return c;

      return {
        ...c,
        status: saved.status,
        elapsedTime: saved.elapsedTime ? `${formatTime(saved.elapsedTime)} elapsed` : c.elapsedTime,
        bestTime: saved.bestTime || c.bestTime,
        attempts: saved.attempts || c.attempts,
      };
    });
  }, [refreshKey]);

  // Tab Counts
  const tabCounts = useMemo(() => {
    return {
      all: cases.length,
      inProgress: cases.filter((c) => c.status === 'in_progress').length,
      completed: cases.filter((c) => c.status === 'completed').length,
    };
  }, [cases]);

  // Filtered & Sorted Cases Computation
  const processedCases = useMemo(() => {
    // 1. Tab Filter
    let result = cases.filter((c) => {
      if (activeTab === 'in_progress') return c.status === 'in_progress';
      if (activeTab === 'completed') return c.status === 'completed';
      return true; // 'all'
    });

    // 2. Difficulty Filter
    if (activeDifficulty !== 'all') {
      result = result.filter((c) => c.difficulty === activeDifficulty);
    }

    // 3. Sorting
    const diffOrder: Record<Difficulty, number> = {
      very_easy: 1,
      easy: 2,
      medium: 3,
      hard: 4,
      expert: 5,
    };

    result.sort((a, b) => {
      switch (activeSort) {
        case 'difficulty':
          if (diffOrder[a.difficulty] !== diffOrder[b.difficulty]) {
            return diffOrder[a.difficulty] - diffOrder[b.difficulty];
          }
          return a.orderIndex - b.orderIndex;

        case 'newest':
          return b.orderIndex - a.orderIndex;

        case 'shortest': {
          const aTime = parseInt(a.estimatedTime?.replace(/[^0-9]/g, '') || '10', 10);
          const bTime = parseInt(b.estimatedTime?.replace(/[^0-9]/g, '') || '10', 10);
          return aTime - bTime;
        }

        case 'longest': {
          const aTime = parseInt(a.estimatedTime?.replace(/[^0-9]/g, '') || '10', 10);
          const bTime = parseInt(b.estimatedTime?.replace(/[^0-9]/g, '') || '10', 10);
          return bTime - aTime;
        }

        default:
          return a.orderIndex - b.orderIndex;
      }
    });

    return result;
  }, [cases, activeTab, activeDifficulty, activeSort]);

  const handleResetData = () => {
    localStorage.removeItem('murdoku_case_progress_v1');
    localStorage.removeItem('murdoku_custom_puzzles_v1');
    localStorage.removeItem('murdoku_puzzle_drafts_v1');
    setActiveTab('all');
    setActiveDifficulty('all');
    setActiveSort('difficulty');
    setIsSettingsOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F7F4EC] text-stone-900 flex flex-col font-sans selection:bg-amber-300 selection:text-stone-900">
      {/* Top Header */}
      <Header
        onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Primary Tab Navigation */}
      <CaseTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        counts={tabCounts}
      />

      {/* Main Center Content Section */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-6 pt-6 pb-10">
        {/* Filters & Sorting Bar */}
        <FiltersBar
          activeDifficulty={activeDifficulty}
          onDifficultyChange={setActiveDifficulty}
          activeSort={activeSort}
          onSortChange={setActiveSort}
        />

        {/* Case Cards Grid */}
        {processedCases.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {processedCases.map((caseItem) => (
              <CaseCard
                key={caseItem.id}
                caseData={caseItem}
                onSelectCase={onSelectCase}
              />
            ))}
          </div>
        ) : (
          <div className="w-full py-20 flex flex-col items-center justify-center bg-[#FAF7F0] border-2 border-dashed border-stone-300 rounded-2xl text-center">
            <div className="w-14 h-14 rounded-full bg-stone-200 flex items-center justify-center text-stone-500 mb-3">
              <SearchX className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-stone-800 uppercase tracking-wide">
              No Case Files Found
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mt-1 mb-4">
              There are no case files matching your selected tab or difficulty criteria.
            </p>
            <button
              onClick={() => {
                setActiveTab('all');
                setActiveDifficulty('all');
              }}
              className="px-4 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-100 text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
            >
              RESET ALL FILTERS
            </button>
          </div>
        )}
      </main>

      {/* Desk Footer Legend */}
      <DeskFooter />

      {/* Modals */}
      <HowToPlayModal
        isOpen={isHowToPlayOpen}
        onClose={() => setIsHowToPlayOpen(false)}
      />
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onResetProgress={handleResetData}
        onOpenAdmin={onOpenAdmin}
      />
    </div>
  );
};
