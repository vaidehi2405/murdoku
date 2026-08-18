import React, { useState } from 'react';
import type { PuzzleDefinition, CellObject } from '../../types/puzzleTypes';
import { StepCaseInfo } from './Steps/StepCaseInfo';
import { StepBoardRooms } from './Steps/StepBoardRooms';
import { StepSuspectsSolution } from './Steps/StepSuspectsSolution';
import { StepClues } from './Steps/StepClues';
import { StepHintsExplanation } from './Steps/StepHintsExplanation';
import { StepValidationPublish } from './Steps/StepValidationPublish';
import {
  savePuzzleDraft,
  publishCustomPuzzle,
} from '../../game/puzzleRegistry';
import {
  ArrowLeft,
  Save,
  Send,
  FileText,
  LayoutGrid,
  Users,
  Key,
  Lightbulb,
  CheckCircle2,
  Lock,
  Armchair,
} from 'lucide-react';

interface PuzzleEditorProps {
  initialPuzzle: PuzzleDefinition;
  onExit: () => void;
  onPublishSuccess: (publishedCaseId: string) => void;
}

type EditorStep = 'case' | 'board' | 'suspects' | 'clues' | 'hints' | 'validate';

export const PuzzleEditor: React.FC<PuzzleEditorProps> = ({
  initialPuzzle,
  onExit,
  onPublishSuccess,
}) => {
  const [puzzle, setPuzzle] = useState<PuzzleDefinition>(JSON.parse(JSON.stringify(initialPuzzle)));
  const [activeStep, setActiveStep] = useState<EditorStep>('case');

  // Board Editor Active Tool & Selections
  const [activeBoardTool, setActiveBoardTool] = useState<'room_paint' | 'toggle_block' | 'place_object'>('room_paint');
  const [selectedRoomId, setSelectedRoomId] = useState<string>(Object.keys(puzzle.rooms)[0] || '');
  const [selectedObject, setSelectedObject] = useState<CellObject>('desk');
  const [selectedSuspectId, setSelectedSuspectId] = useState<string>(puzzle.suspects[0]?.id || '');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleUpdatePuzzle = (updates: Partial<PuzzleDefinition>) => {
    setPuzzle((prev) => ({ ...prev, ...updates }));
  };

  // Cell Click Handler on Visual Map Grid
  const handleCellClick = (row: number, col: number) => {
    if (activeStep === 'board') {
      const nextCells = puzzle.cells.map((rList, rIdx) =>
        rList.map((cObj, cIdx) => {
          if (rIdx === row && cIdx === col) {
            if (activeBoardTool === 'room_paint') {
              const room = puzzle.rooms[selectedRoomId];
              return {
                ...cObj,
                roomId: selectedRoomId,
                roomName: room?.name || selectedRoomId,
              };
            } else if (activeBoardTool === 'toggle_block') {
              const isBlocking = cObj.occupiable;
              return {
                ...cObj,
                occupiable: !isBlocking,
                object: (isBlocking ? 'bookshelf' : 'none') as CellObject,
                objectName: isBlocking ? 'Blocked Obstacle' : undefined,
              };
            } else if (activeBoardTool === 'place_object') {
              return {
                ...cObj,
                object: selectedObject,
                objectName: selectedObject !== 'none' ? selectedObject.toUpperCase() : undefined,
                occupiable: selectedObject === 'none' || selectedObject === 'carpet' || selectedObject === 'chair' || selectedObject === 'couch',
              };
            }
          }
          return cObj;
        })
      );
      handleUpdatePuzzle({ cells: nextCells });
    } else if (activeStep === 'suspects' || activeStep === 'validate') {
      // Assign solution placement to selectedSuspectId
      if (!selectedSuspectId) return;

      const targetCell = puzzle.cells[row][col];
      if (!targetCell.occupiable) {
        showToast(`Cannot place suspect on blocked obstacle (${row},${col})`);
        return;
      }

      const nextSolution = { ...puzzle.solution };
      nextSolution[selectedSuspectId] = { row, col };
      handleUpdatePuzzle({ solution: nextSolution });
    }
  };

  const handleSaveDraft = () => {
    savePuzzleDraft(puzzle);
    showToast('✓ Draft saved to LocalStorage');
  };

  const handlePublish = () => {
    publishCustomPuzzle(puzzle);
    showToast('✓ Puzzle Published Successfully!');
    setTimeout(() => {
      onPublishSuccess(puzzle.caseId);
    }, 500);
  };

  const navSteps: { id: EditorStep; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'case', label: '1. Case Info', icon: FileText },
    { id: 'board', label: '2. Board & Rooms', icon: LayoutGrid },
    { id: 'suspects', label: '3. Suspects & Solution', icon: Users },
    { id: 'clues', label: '4. Clue Builder', icon: Key },
    { id: 'hints', label: '5. Hints & Reasoning', icon: Lightbulb },
    { id: 'validate', label: '6. Validate & Publish', icon: CheckCircle2 },
  ];

  return (
    <div className="h-screen w-screen bg-[#F4F0E8] text-stone-900 flex flex-col overflow-hidden font-sans">
      {/* Top Admin Editor Header */}
      <header className="h-14 px-6 bg-stone-900 text-stone-100 flex items-center justify-between border-b border-stone-800 shadow-md flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-400 font-bold text-xs uppercase tracking-wider transition-colors border border-stone-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Close Editor</span>
          </button>
          <div className="h-5 w-px bg-stone-700" />
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-stone-800 text-stone-300">
            {puzzle.caseNumber || puzzle.caseId}
          </span>
          <span className="text-sm font-black tracking-wide uppercase text-stone-100 truncate max-w-sm">
            {puzzle.title || 'Untitled Case'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {toastMessage && (
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-400 text-stone-950 shadow-sm animate-fade-in">
              {toastMessage}
            </span>
          )}

          <button
            onClick={handleSaveDraft}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs uppercase tracking-wider border border-stone-700 transition-colors shadow-xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Draft</span>
          </button>

          <button
            onClick={handlePublish}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-xs uppercase tracking-wider shadow-sm transition-all hover:scale-105 active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Publish</span>
          </button>
        </div>
      </header>

      {/* 3-Column Studio Interface */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Step Navigation Tabs */}
        <aside className="w-64 bg-[#FAF8F5] border-r-2 border-stone-300 p-4 flex flex-col justify-between flex-shrink-0">
          <div className="space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-widest text-stone-500 block px-3 mb-2">
              AUTHORING STAGES
            </span>
            {navSteps.map((step) => {
              const Icon = step.icon;
              const isActive = activeStep === step.id;

              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={`w-full py-3 px-3.5 rounded-2xl flex items-center gap-3 text-xs font-black uppercase tracking-wider transition-all text-left ${
                    isActive
                      ? 'bg-stone-900 text-amber-300 shadow-md'
                      : 'text-stone-700 hover:bg-stone-200/80 hover:text-stone-900'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{step.label}</span>
                </button>
              );
            })}
          </div>

          <div className="p-3 bg-stone-200/70 border border-stone-300 rounded-2xl text-[11px] font-semibold text-stone-600">
            <span className="block font-black text-stone-900 uppercase mb-0.5">Tip:</span>
            Switch between steps at any time. Changes are retained in editor memory.
          </div>
        </aside>

        {/* Center Hero Column: Large Visual Map Grid */}
        <div className="flex-1 overflow-y-auto bg-[#FAF7F0] p-6 flex flex-col items-center justify-center select-none">
          {/* Room Legend Header */}
          <div className="w-full max-w-[580px] flex items-center justify-between mb-3 px-2 text-xs font-bold text-stone-600">
            <div className="flex items-center gap-3 overflow-x-auto py-1">
              {Object.values(puzzle.rooms).map((room) => (
                <div key={room.id} className="flex items-center gap-1.5 whitespace-nowrap">
                  <div
                    className="w-3 h-3 rounded-full border shadow-xs"
                    style={{ backgroundColor: room.color, borderColor: room.borderColor }}
                  />
                  <span className="text-[11px] font-bold" style={{ color: room.textColor }}>
                    {room.name}
                  </span>
                </div>
              ))}
            </div>
            <span className="text-[11px] font-mono text-stone-500 font-bold">
              {puzzle.gridRows}×{puzzle.gridCols} GRID
            </span>
          </div>

          {/* Large Grid Map */}
          <div className="w-full max-w-[580px] aspect-square bg-stone-900 border-4 border-stone-800 rounded-3xl p-3.5 shadow-2xl flex flex-col justify-between">
            <div
              className="grid gap-2 w-full h-full"
              style={{
                gridTemplateColumns: `repeat(${puzzle.gridCols}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${puzzle.gridRows}, minmax(0, 1fr))`,
              }}
            >
              {puzzle.cells.map((rowCells, r) =>
                rowCells.map((cell, c) => {
                  const room = puzzle.rooms[cell.roomId] || {
                    color: '#F5F5F4',
                    borderColor: '#E7E5E4',
                    textColor: '#78716C',
                  };

                  // Check if any suspect has solution placement here
                  const placedSuspect = puzzle.suspects.find(
                    (s) => puzzle.solution?.[s.id]?.row === r && puzzle.solution?.[s.id]?.col === c
                  );

                  return (
                    <div
                      key={`${r}-${c}`}
                      onClick={() => handleCellClick(r, c)}
                      style={{
                        backgroundColor: cell.occupiable ? room.color : '#44403C',
                        borderColor: room.borderColor,
                      }}
                      className={`relative rounded-xl border-2 flex flex-col items-center justify-between p-1 cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-xs ${
                        !cell.occupiable ? 'opacity-90' : ''
                      }`}
                    >
                      {/* Cell Coordinate Label */}
                      <span className="text-[9px] font-mono font-bold text-stone-400 self-start">
                        {r},{c}
                      </span>

                      {/* Cell Obstacle / Object Icon or Solution Badge */}
                      {placedSuspect ? (
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-white font-black text-xs shadow-md border-2 border-white"
                          style={{ backgroundColor: placedSuspect.color }}
                        >
                          {placedSuspect.initial}
                        </div>
                      ) : !cell.occupiable ? (
                        <div className="flex flex-col items-center text-stone-400">
                          <Lock className="w-4 h-4 text-stone-300" />
                          <span className="text-[8px] font-black uppercase text-stone-300 tracking-tighter mt-0.5">
                            BLOCKED
                          </span>
                        </div>
                      ) : cell.object && cell.object !== 'none' ? (
                        <div className="flex flex-col items-center text-stone-600">
                          <Armchair className="w-3.5 h-3.5 text-stone-500" />
                          <span className="text-[8px] font-black uppercase text-stone-600 tracking-tighter truncate max-w-[50px]">
                            {cell.object}
                          </span>
                        </div>
                      ) : (
                        <div className="w-3 h-3" />
                      )}

                      <div className="h-1" />
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Step Property Inspector & Controls */}
        <aside className="w-[460px] bg-[#FAF8F5] border-l-2 border-stone-300 p-6 overflow-y-auto flex-shrink-0">
          {activeStep === 'case' && (
            <StepCaseInfo puzzle={puzzle} onChange={handleUpdatePuzzle} />
          )}

          {activeStep === 'board' && (
            <StepBoardRooms
              puzzle={puzzle}
              onChange={handleUpdatePuzzle}
              activeTool={activeBoardTool}
              onSelectTool={setActiveBoardTool}
              selectedRoomId={selectedRoomId}
              onSelectRoom={setSelectedRoomId}
              selectedObject={selectedObject}
              onSelectObject={setSelectedObject}
            />
          )}

          {activeStep === 'suspects' && (
            <StepSuspectsSolution
              puzzle={puzzle}
              onChange={handleUpdatePuzzle}
              selectedSuspectId={selectedSuspectId}
              onSelectSuspect={setSelectedSuspectId}
            />
          )}

          {activeStep === 'clues' && (
            <StepClues puzzle={puzzle} onChange={handleUpdatePuzzle} />
          )}

          {activeStep === 'hints' && (
            <StepHintsExplanation puzzle={puzzle} onChange={handleUpdatePuzzle} />
          )}

          {activeStep === 'validate' && (
            <StepValidationPublish
              puzzle={puzzle}
              onSaveDraft={handleSaveDraft}
              onPublish={handlePublish}
            />
          )}
        </aside>
      </div>
    </div>
  );
};
