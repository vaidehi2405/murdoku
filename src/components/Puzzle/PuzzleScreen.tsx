import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { Puzzle, ActiveTool, GameStateSnapshot, CaseProgress } from '../../types/puzzleTypes';
import { SuspectList } from './SuspectList';
import { PuzzleBoard } from './PuzzleBoard';
import { ToolPanel } from './ToolPanel';
import { PuzzleTimer } from './PuzzleTimer';
import { HintModal } from './HintModal';
import { SolutionConfirmModal } from './SolutionConfirmModal';
import { SolutionExplanationPanel } from './SolutionExplanationPanel';
import { validateSolution } from '../../game/validation/validator';
import { loadCaseProgress, saveCaseProgress } from '../../game/storage';
import { ArrowLeft, AlertTriangle, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PuzzleScreenProps {
  puzzle: Puzzle;
  onQuit: () => void;
  onSolveSuccess: (finalTimeSeconds: number, attempts: number, hintsUsed: number, solutionRevealed: boolean) => void;
}

export const PuzzleScreen: React.FC<PuzzleScreenProps> = ({
  puzzle,
  onQuit,
  onSolveSuccess,
}) => {
  // Game State
  const [selectedSuspectId, setSelectedSuspectId] = useState<string>(puzzle.suspects[0].id);
  const [activeTool, setActiveTool] = useState<ActiveTool>('place');

  // Separated Game State Structures
  const [placements, setPlacements] = useState<Record<string, string>>({}); // suspectId -> "row,col"
  const [notes, setNotes] = useState<Record<string, string[]>>({}); // suspectId -> ["row,col"]
  const [eliminatedCells, setEliminatedCells] = useState<Record<string, string[]>>({}); // suspectId -> ["row,col"]

  // Undo History Stack
  const [history, setHistory] = useState<GameStateSnapshot[]>([]);

  // Timer, Attempts & Hint Tracking State
  const [seconds, setSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [attempts, setAttempts] = useState(1);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [activeHintIndex, setActiveHintIndex] = useState(0);
  const [solutionRevealed, setSolutionRevealed] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);

  // Modals & Panels State
  const [isHintModalOpen, setIsHintModalOpen] = useState(false);
  const [isSolutionModalOpen, setIsSolutionModalOpen] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Load existing progress from LocalStorage on mount
  useEffect(() => {
    const saved = loadCaseProgress(puzzle.caseId);
    if (saved) {
      setPlacements(saved.placements || {});
      setNotes(saved.notes || {});
      setEliminatedCells(saved.eliminatedCells || {});
      setSeconds(saved.elapsedTime || 0);
      setAttempts(saved.attempts || 1);
      setHintsUsed(saved.hintsUsed || 0);
      setActiveHintIndex(saved.activeHintIndex || 0);
      setSolutionRevealed(saved.solutionRevealed || false);
      setIsReadOnly(saved.isReadOnly || false);
      if (saved.isReadOnly) {
        setIsTimerRunning(false);
      }
    }
  }, [puzzle.caseId]);

  // Persist state to LocalStorage
  const persistProgress = useCallback(
    (statusOverride?: 'in_progress' | 'completed') => {
      const saved = loadCaseProgress(puzzle.caseId);
      const updated: CaseProgress = {
        caseId: puzzle.caseId,
        status: statusOverride || saved?.status || 'in_progress',
        placements,
        notes,
        eliminatedCells,
        elapsedTime: seconds,
        attempts,
        bestTime: saved?.bestTime,
        bestTimeSeconds: saved?.bestTimeSeconds,
        hintsUsed,
        activeHintIndex,
        solutionRevealed,
        isReadOnly,
        lastPlayed: Date.now(),
      };
      saveCaseProgress(updated);
    },
    [puzzle.caseId, placements, notes, eliminatedCells, seconds, attempts, hintsUsed, activeHintIndex, solutionRevealed, isReadOnly]
  );

  // Auto-save progress periodically
  useEffect(() => {
    if (isTimerRunning && !isReadOnly) {
      persistProgress('in_progress');
    }
  }, [seconds, placements, notes, eliminatedCells, isTimerRunning, isReadOnly, persistProgress]);

  // Selected Suspect object
  const selectedSuspect = useMemo(
    () => puzzle.suspects.find((s) => s.id === selectedSuspectId) || puzzle.suspects[0],
    [puzzle, selectedSuspectId]
  );

  // Count placed suspects
  const placedCount = useMemo(
    () => Object.values(placements).filter(Boolean).length,
    [placements]
  );

  // Active Hint Target Coords for Highlighting
  const activeHintTargetCoords = useMemo(() => {
    if (!isHintModalOpen || puzzle.hints.length === 0) return [];
    const h = puzzle.hints[Math.min(activeHintIndex, puzzle.hints.length - 1)];
    return h.targetCellCoords || [];
  }, [isHintModalOpen, activeHintIndex, puzzle.hints]);

  // Evaluate clues dynamically for live feedback if placements exist
  const satisfiedClueIds = useMemo(() => {
    const set = new Set<string>();
    for (const clue of puzzle.clues) {
      const { condition } = clue;
      const subjectCoord = placements[condition.subject];
      if (subjectCoord) {
        const { isValid } = validateSolution(placements, puzzle);
        if (isValid) set.add(clue.id);
      }
    }
    return set;
  }, [placements, puzzle]);

  // Helper to push current state into undo history before mutation
  const pushHistory = () => {
    const snapshot: GameStateSnapshot = {
      placements: { ...placements },
      notes: { ...notes },
      eliminatedCells: { ...eliminatedCells },
    };
    setHistory((prev) => [...prev, snapshot]);
    setValidationError(null);
  };

  // Undo action
  const handleUndo = () => {
    if (history.length === 0 || isReadOnly) return;
    const lastSnapshot = history[history.length - 1];
    setPlacements(lastSnapshot.placements);
    setNotes(lastSnapshot.notes);
    setEliminatedCells(lastSnapshot.eliminatedCells);
    setHistory((prev) => prev.slice(0, -1));
    setValidationError(null);
  };

  // Reset board
  const handleResetBoard = () => {
    if (isReadOnly) return;
    pushHistory();
    setPlacements({});
    setNotes({});
    setEliminatedCells({});
  };

  // Cell Interaction Handler
  const handleCellClick = (row: number, col: number) => {
    if (isReadOnly) return;

    const coordKey = `${row},${col}`;
    const targetCell = puzzle.cells[row][col];

    if (!targetCell.occupiable) {
      setValidationError(`Cell (${row},${col}) contains an obstacle (${targetCell.objectName || 'Furniture'}). Suspects cannot be placed here.`);
      return;
    }

    pushHistory();
    const currentSuspectId = selectedSuspectId;

    if (activeTool === 'place') {
      setPlacements((prev) => {
        const next = { ...prev };
        if (next[currentSuspectId] === coordKey) {
          delete next[currentSuspectId];
        } else {
          next[currentSuspectId] = coordKey;
        }
        return next;
      });
    } else if (activeTool === 'note') {
      setNotes((prev) => {
        const suspectNotes = prev[currentSuspectId] || [];
        const nextNotes = suspectNotes.includes(coordKey)
          ? suspectNotes.filter((c) => c !== coordKey)
          : [...suspectNotes, coordKey];
        return { ...prev, [currentSuspectId]: nextNotes };
      });
    } else if (activeTool === 'eliminate') {
      setEliminatedCells((prev) => {
        const suspectElims = prev[currentSuspectId] || [];
        const nextElims = suspectElims.includes(coordKey)
          ? suspectElims.filter((c) => c !== coordKey)
          : [...suspectElims, coordKey];
        return { ...prev, [currentSuspectId]: nextElims };
      });
    } else if (activeTool === 'erase') {
      setPlacements((prev) => {
        const next = { ...prev };
        for (const [sId, cKey] of Object.entries(next)) {
          if (cKey === coordKey) delete next[sId];
        }
        return next;
      });
      setNotes((prev) => {
        const next: Record<string, string[]> = {};
        for (const [sId, cList] of Object.entries(prev)) {
          next[sId] = cList.filter((c) => c !== coordKey);
        }
        return next;
      });
      setEliminatedCells((prev) => {
        const next: Record<string, string[]> = {};
        for (const [sId, cList] of Object.entries(prev)) {
          next[sId] = cList.filter((c) => c !== coordKey);
        }
        return next;
      });
    }
  };

  // Hint Navigation
  const handleOpenHint = () => {
    if (hintsUsed === 0) {
      setHintsUsed(1);
      setActiveHintIndex(0);
    }
    setIsHintModalOpen(true);
  };

  const handleNextHint = () => {
    if (activeHintIndex < puzzle.hints.length - 1) {
      const nextIndex = activeHintIndex + 1;
      setActiveHintIndex(nextIndex);
      setHintsUsed((prev) => Math.max(prev, nextIndex + 1));
    }
  };

  // Solution Reveal Handler
  const handleConfirmRevealSolution = () => {
    setIsSolutionModalOpen(false);

    // Populate placements with correct solution mapping
    const solutionPlacements: Record<string, string> = {};
    for (const [suspectId, coordObj] of Object.entries(puzzle.solution)) {
      solutionPlacements[suspectId] = `${coordObj.row},${coordObj.col}`;
    }

    setPlacements(solutionPlacements);
    setSolutionRevealed(true);
    setIsReadOnly(true);
    setIsTimerRunning(false);
  };

  // Solution Submission Handler
  const handleSubmit = () => {
    if (isReadOnly) return;

    const result = validateSolution(placements, puzzle);
    if (!result.isValid) {
      setAttempts((prev) => prev + 1);
      setValidationError(result.message || "Not quite. Some placements don't satisfy the clues.");
    } else {
      setIsTimerRunning(false);
      persistProgress('completed');
      onSolveSuccess(seconds, attempts, hintsUsed, solutionRevealed);
    }
  };

  const handleExit = () => {
    persistProgress(solutionRevealed ? 'completed' : 'in_progress');
    onQuit();
  };

  return (
    <div className="h-screen w-screen bg-[#F4F0E8] text-stone-900 flex flex-col overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="h-14 px-6 bg-stone-900 text-stone-100 flex items-center justify-between border-b border-stone-800 shadow-md flex-shrink-0">
        <button
          onClick={handleExit}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-400 font-bold text-xs uppercase tracking-wider transition-colors border border-stone-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Investigation</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-stone-800 text-stone-300">
            {puzzle.caseNumber}
          </span>
          <span className="text-sm font-black tracking-wide uppercase text-amber-300">
            {puzzle.title}
          </span>
          {solutionRevealed && (
            <span className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded bg-red-800 text-amber-300 border border-red-700">
              SOLUTION REVEALED
            </span>
          )}
        </div>

        <div className="flex items-center gap-4">
          <PuzzleTimer
            seconds={seconds}
            isRunning={isTimerRunning}
            onTick={() => setSeconds((s) => s + 1)}
          />

          <span className="text-xs font-bold px-2.5 py-1 rounded bg-stone-800 text-stone-300">
            Attempt #{attempts}
          </span>

          {hintsUsed > 0 && (
            <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded bg-amber-950 text-amber-300 border border-amber-800">
              <Lightbulb className="w-3.5 h-3.5" />
              {hintsUsed} {hintsUsed === 1 ? 'hint' : 'hints'}
            </span>
          )}
        </div>
      </header>

      {/* Validation Banner Alert */}
      <AnimatePresence>
        {validationError && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-amber-100 border-b border-amber-300 px-6 py-2 flex items-center justify-between text-amber-900 text-xs font-bold z-20 flex-shrink-0"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0" />
              <span>{validationError}</span>
            </div>
            <button
              onClick={() => setValidationError(null)}
              className="text-amber-800 hover:text-amber-950 font-black uppercase text-[11px]"
            >
              DISMISS
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3-Column Desktop Puzzle Interface */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Suspects & Clues */}
        <SuspectList
          suspects={puzzle.suspects}
          clues={puzzle.clues}
          selectedSuspectId={selectedSuspectId}
          placements={placements}
          onSelectSuspect={setSelectedSuspectId}
          satisfiedClueIds={satisfiedClueIds}
        />

        {/* Center Hero: 6x6 Interactive Map Grid & Solution Explanation */}
        <div className="flex-1 overflow-y-auto h-full bg-[#FAF7F0] p-4 flex flex-col items-center justify-start gap-4">
          <PuzzleBoard
            puzzle={puzzle}
            selectedSuspect={selectedSuspect}
            activeTool={activeTool}
            placements={placements}
            notes={notes}
            eliminatedCells={eliminatedCells}
            onCellClick={handleCellClick}
            targetCellCoords={activeHintTargetCoords}
            isReadOnly={isReadOnly}
            isSolutionRevealed={solutionRevealed}
          />

          {/* Solution Explanation Panel when revealed */}
          {solutionRevealed && (
            <div className="w-full flex flex-col items-center flex-shrink-0 pt-2 pb-16">
              <SolutionExplanationPanel explanation={puzzle.solutionExplanation} />
              {/* Bottom Scroll Padding Spacer */}
              <div className="h-16 w-full flex-shrink-0" />
            </div>
          )}
        </div>

        {/* Right Column: Game Tools & Actions */}
        <ToolPanel
          activeTool={activeTool}
          onSelectTool={setActiveTool}
          onUndo={handleUndo}
          canUndo={history.length > 0}
          onReset={handleResetBoard}
          onSubmit={handleSubmit}
          onOpenHint={handleOpenHint}
          onOpenSolutionModal={() => setIsSolutionModalOpen(true)}
          placedCount={placedCount}
          totalSuspects={puzzle.suspects.length}
          hintsUsedCount={hintsUsed}
          totalHints={puzzle.hints.length}
          isReadOnly={isReadOnly}
        />
      </div>

      {/* Modals */}
      <HintModal
        isOpen={isHintModalOpen}
        hints={puzzle.hints}
        activeHintIndex={activeHintIndex}
        onNextHint={handleNextHint}
        onClose={() => setIsHintModalOpen(false)}
      />

      <SolutionConfirmModal
        isOpen={isSolutionModalOpen}
        onConfirm={handleConfirmRevealSolution}
        onCancel={() => setIsSolutionModalOpen(false)}
      />
    </div>
  );
};
