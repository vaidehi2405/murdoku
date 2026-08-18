import { useState, useEffect } from 'react';
import type { Case } from './types/case';
import type { PuzzleDefinition } from './types/puzzleTypes';
import { getPuzzleDefinition } from './game/puzzleRegistry';
import { CASE_02_PUZZLE } from './game/puzzles/case02';
import { loadCaseProgress, saveCaseProgress, createFreshAttempt } from './game/storage';
import { triggerBackgroundGeneration } from './game/inventory/generationOrchestrator';
import { CaseLibrary } from './components/CaseLibrary';
import { PuzzleScreen } from './components/Puzzle/PuzzleScreen';
import { ResultScreen } from './components/Result/ResultScreen';
import { PuzzlePlaceholderView } from './components/PuzzlePlaceholderView';
import { PuzzleAdminHome } from './components/Admin/PuzzleAdminHome';
import { PuzzleEditor } from './components/Admin/PuzzleEditor';

type AppView = 'library' | 'puzzle' | 'result' | 'placeholder' | 'admin_home' | 'admin_editor';

export function App() {
  const [activeView, setActiveView] = useState<AppView>('library');
  const [activeCase, setActiveCase] = useState<Case | null>(null);
  const [activeMode, setActiveMode] = useState<'play' | 'continue' | 'replay'>('play');

  // Admin Editor State
  const [editingPuzzle, setEditingPuzzle] = useState<PuzzleDefinition | null>(null);

  // Refresh key to force CaseLibrary re-render after generation or completion
  const [libraryRefreshKey, setLibraryRefreshKey] = useState(0);

  // Solved Stats
  const [solvedStats, setSolvedStats] = useState<{
    finalTimeSeconds: number;
    attempts: number;
    hintsUsed: number;
    solutionRevealed: boolean;
    isNewBest: boolean;
  } | null>(null);

  // URL location listener for /admin/puzzles
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      if (path.startsWith('/admin/puzzles')) {
        setActiveView('admin_home');
      }
    };

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const navigateToAdmin = () => {
    window.history.pushState({}, '', '/admin/puzzles');
    setActiveView('admin_home');
  };

  const navigateToGame = () => {
    window.history.pushState({}, '', '/');
    setActiveView('library');
  };

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectCase = (caseData: Case, mode: 'play' | 'continue' | 'replay') => {
    setActiveCase(caseData);
    setActiveMode(mode);

    const puzzleDef = getPuzzleDefinition(caseData.id);

    if (puzzleDef) {
      const existing = loadCaseProgress(caseData.id);

      if (mode === 'replay') {
        createFreshAttempt(caseData.id, existing);
      } else if (mode === 'play' && !existing) {
        createFreshAttempt(caseData.id);
      }

      setActiveView('puzzle');
    } else {
      setActiveView('placeholder');
    }
  };

  const handleSolveSuccess = (
    finalTimeSeconds: number,
    attempts: number,
    hintsUsed: number,
    solutionRevealed: boolean
  ) => {
    if (!activeCase) return;

    const existing = loadCaseProgress(activeCase.id);
    const formatted = formatTime(finalTimeSeconds);

    let isNewBest = false;
    let newBestTime = existing?.bestTime;
    let newBestSeconds = existing?.bestTimeSeconds;

    if (!solutionRevealed) {
      if (!existing?.bestTimeSeconds || finalTimeSeconds < existing.bestTimeSeconds) {
        isNewBest = true;
        newBestTime = formatted;
        newBestSeconds = finalTimeSeconds;
      }
    }

    if (existing) {
      saveCaseProgress({
        ...existing,
        status: 'completed',
        elapsedTime: finalTimeSeconds,
        attempts,
        hintsUsed,
        solutionRevealed,
        bestTime: newBestTime,
        bestTimeSeconds: newBestSeconds,
        isReadOnly: false,
      });
    }

    setSolvedStats({
      finalTimeSeconds,
      attempts,
      hintsUsed,
      solutionRevealed,
      isNewBest,
    });

    setActiveView('result');

    // Trigger background generation after completion (silent, non-blocking)
    triggerBackgroundGeneration();
    setLibraryRefreshKey((k) => k + 1);
  };

  const handlePlayAgainFromResult = () => {
    if (activeCase) {
      const existing = loadCaseProgress(activeCase.id);
      createFreshAttempt(activeCase.id, existing);
    }
    setActiveView('puzzle');
  };

  // Admin Studio Handlers
  const handleCreateNewPuzzle = () => {
    const newDraft: PuzzleDefinition = {
      ...JSON.parse(JSON.stringify(CASE_02_PUZZLE)),
      id: `draft-${Date.now()}`,
      caseId: `case-${Date.now().toString().slice(-4)}`,
      caseNumber: 'NEW CASE',
      title: 'Untitled Mystery',
      description: 'A new logic puzzle investigation.',
      clues: [],
      solution: {},
      hints: [
        { level: 1, title: 'Gentle Hint', text: 'Consider the initial room sightings.' },
        { level: 2, title: 'Specific Deduction', text: 'Narrow down the candidate cells.' },
        { level: 3, title: 'Direct Placement', text: 'Identify the exact coordinate.' },
      ],
      solutionExplanation: {
        culpritId: 'suspect_1',
        culpritName: 'Unknown',
        summary: 'The mystery was solved by deductions.',
        steps: ['Step 1 reasoning...', 'Step 2 reasoning...', 'Step 3 reasoning...'],
      },
    };
    setEditingPuzzle(newDraft);
    setActiveView('admin_editor');
  };

  const handleEditPuzzle = (puzzleToEdit: PuzzleDefinition) => {
    setEditingPuzzle(puzzleToEdit);
    setActiveView('admin_editor');
  };

  const handleTestPlayCase = (caseId: string) => {
    const puzzleDef = getPuzzleDefinition(caseId);
    if (puzzleDef) {
      const caseData: Case = {
        id: puzzleDef.caseId,
        caseNumber: puzzleDef.caseNumber || puzzleDef.caseId.toUpperCase(),
        title: puzzleDef.title,
        difficulty: puzzleDef.difficulty,
        status: 'new',
        estimatedTime: puzzleDef.estimatedTime,
        orderIndex: 99,
        roomType: 'mansion',
      };
      setActiveCase(caseData);
      setActiveMode('play');
      setActiveView('puzzle');
    }
  };

  const handlePublishSuccess = (publishedCaseId: string) => {
    handleTestPlayCase(publishedCaseId);
  };

  // View Routing Render
  if (activeView === 'admin_home') {
    return (
      <PuzzleAdminHome
        onSelectPuzzleToEdit={handleEditPuzzle}
        onCreateNewPuzzle={handleCreateNewPuzzle}
        onExitAdmin={navigateToGame}
        onTestPlayCase={handleTestPlayCase}
      />
    );
  }

  if (activeView === 'admin_editor' && editingPuzzle) {
    return (
      <PuzzleEditor
        initialPuzzle={editingPuzzle}
        onExit={() => setActiveView('admin_home')}
        onPublishSuccess={handlePublishSuccess}
      />
    );
  }

  const activePuzzleDef = activeCase ? getPuzzleDefinition(activeCase.id) : null;

  if (activeView === 'puzzle' && activePuzzleDef) {
    return (
      <PuzzleScreen
        puzzle={activePuzzleDef}
        onQuit={navigateToGame}
        onSolveSuccess={handleSolveSuccess}
      />
    );
  }

  if (activeView === 'result' && activePuzzleDef && solvedStats) {
    return (
      <ResultScreen
        puzzle={activePuzzleDef}
        finalTimeSeconds={solvedStats.finalTimeSeconds}
        attempts={solvedStats.attempts}
        hintsUsed={solvedStats.hintsUsed}
        solutionRevealed={solvedStats.solutionRevealed}
        isNewBest={solvedStats.isNewBest}
        onPlayAgain={handlePlayAgainFromResult}
        onBackToCases={navigateToGame}
        onNextCase={navigateToGame}
      />
    );
  }

  if (activeView === 'placeholder' && activeCase) {
    return (
      <PuzzlePlaceholderView
        caseData={activeCase}
        mode={activeMode}
        onBack={navigateToGame}
      />
    );
  }

  return (
    <CaseLibrary
      onSelectCase={handleSelectCase}
      onOpenAdmin={navigateToAdmin}
      refreshKey={libraryRefreshKey}
    />
  );
}

export default App;
