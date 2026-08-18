import React from 'react';
import type { Puzzle, Suspect, ActiveTool } from '../../types/puzzleTypes';
import { Book, Armchair, Shield, Leaf, Table, Sparkles, X, ShieldAlert, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

interface PuzzleBoardProps {
  puzzle: Puzzle;
  selectedSuspect: Suspect | null;
  activeTool: ActiveTool;
  placements: Record<string, string>; // suspectId -> "row,col"
  notes: Record<string, string[]>; // suspectId -> ["row,col"]
  eliminatedCells: Record<string, string[]>; // suspectId -> ["row,col"]
  onCellClick: (row: number, col: number) => void;
  targetCellCoords?: string[]; // Highlighting cells for active hint
  isReadOnly?: boolean;
  isSolutionRevealed?: boolean;
}

export const PuzzleBoard: React.FC<PuzzleBoardProps> = ({
  puzzle,
  selectedSuspect,
  activeTool: _activeTool,
  placements,
  notes,
  eliminatedCells,
  onCellClick,
  targetCellCoords = [],
  isReadOnly = false,
  isSolutionRevealed = false,
}) => {
  // Inverse lookup for placements: "row,col" -> suspect
  const placementMap: Record<string, Suspect> = {};
  for (const [suspectId, coord] of Object.entries(placements)) {
    if (!coord) continue;
    const suspect = puzzle.suspects.find((s) => s.id === suspectId);
    if (suspect) {
      placementMap[coord] = suspect;
    }
  }

  // Active suspect eliminations
  const activeEliminations = selectedSuspect ? eliminatedCells[selectedSuspect.id] || [] : [];

  // Helper to render furniture icons
  const renderObjectIcon = (objType: string, objName?: string) => {
    switch (objType) {
      case 'bookshelf':
        return (
          <div className="flex flex-col items-center justify-center text-stone-600 opacity-60">
            <Book className="w-6 h-6" />
            <span className="text-[9px] font-extrabold uppercase tracking-tight mt-0.5">
              {objName || 'Shelf'}
            </span>
          </div>
        );
      case 'chair':
        return (
          <div className="flex flex-col items-center justify-center text-stone-500 opacity-70">
            <Armchair className="w-5 h-5" />
            <span className="text-[9px] font-extrabold uppercase tracking-tight mt-0.5">
              {objName || 'Chair'}
            </span>
          </div>
        );
      case 'carpet':
        return (
          <div className="absolute inset-1 border border-dashed border-amber-600/40 rounded bg-amber-500/10 pointer-events-none flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-amber-600/40" />
          </div>
        );
      case 'safe':
        return (
          <div className="flex flex-col items-center justify-center text-stone-700 opacity-70">
            <Shield className="w-5 h-5 text-stone-700" />
            <span className="text-[9px] font-extrabold uppercase tracking-tight mt-0.5">
              {objName || 'Safe'}
            </span>
          </div>
        );
      case 'plant':
        return (
          <div className="flex flex-col items-center justify-center text-emerald-700 opacity-70">
            <Leaf className="w-5 h-5" />
            <span className="text-[9px] font-extrabold uppercase tracking-tight mt-0.5">
              {objName || 'Plant'}
            </span>
          </div>
        );
      case 'table':
        return (
          <div className="flex flex-col items-center justify-center text-stone-700 opacity-70">
            <Table className="w-6 h-6" />
            <span className="text-[9px] font-extrabold uppercase tracking-tight mt-0.5">
              {objName || 'Table'}
            </span>
          </div>
        );
      case 'pedestal':
        return (
          <div className="flex flex-col items-center justify-center text-stone-700 opacity-70">
            <ShieldAlert className="w-5 h-5" />
            <span className="text-[9px] font-extrabold uppercase tracking-tight mt-0.5">
              {objName || 'Pedestal'}
            </span>
          </div>
        );
      case 'desk':
        return (
          <div className="flex flex-col items-center justify-center text-stone-600 opacity-70">
            <Table className="w-5 h-5 text-stone-600" />
            <span className="text-[9px] font-extrabold uppercase tracking-tight mt-0.5">
              {objName || 'Desk'}
            </span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center p-2 select-none">
      {/* Room Legend Header & Solution Status */}
      <div className="w-full max-w-[620px] flex items-center justify-between mb-3 px-2 text-xs font-bold text-stone-600">
        <div className="flex items-center gap-4">
          {Object.values(puzzle.rooms).map((room) => (
            <div key={room.id} className="flex items-center gap-1.5">
              <span
                className="w-3 h-3 rounded border"
                style={{ backgroundColor: room.color, borderColor: room.borderColor }}
              />
              <span
                className="uppercase tracking-wider text-[11px] font-extrabold"
                style={{ color: room.textColor }}
              >
                {room.name}
              </span>
            </div>
          ))}
        </div>

        {isSolutionRevealed && (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-800 text-amber-300 text-xs font-black uppercase tracking-widest shadow-xs">
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            SOLUTION REVEALED
          </span>
        )}
      </div>

      {/* Main 6x6 Board Outer Frame */}
      <div className="relative w-full max-w-[620px] aspect-square bg-stone-900 border-4 border-stone-800 rounded-2xl shadow-2xl overflow-hidden p-3">
        {/* 6x6 Grid Container */}
        <div className="w-full h-full grid grid-cols-6 grid-rows-6 gap-1 bg-stone-700/60 rounded-lg p-1">
          {puzzle.cells.map((rowCells, r) =>
            rowCells.map((cell, c) => {
              const coordKey = `${r},${c}`;
              const room = puzzle.rooms[cell.roomId];
              const placedSuspect = placementMap[coordKey];
              const isEliminated = activeEliminations.includes(coordKey);
              const isHintTarget = targetCellCoords.includes(coordKey);

              // Gather notes for this cell across suspects
              const cellNotes: Suspect[] = [];
              for (const [suspectId, noteCoords] of Object.entries(notes)) {
                if (noteCoords.includes(coordKey)) {
                  const s = puzzle.suspects.find((sp) => sp.id === suspectId);
                  if (s) cellNotes.push(s);
                }
              }

              return (
                <div
                  key={coordKey}
                  onClick={() => !isReadOnly && onCellClick(r, c)}
                  className={`relative flex flex-col items-center justify-center rounded-lg transition-all duration-150 overflow-hidden ${
                    isReadOnly
                      ? 'cursor-default'
                      : !cell.occupiable
                      ? 'bg-stone-300/80 cursor-not-allowed border border-stone-400/80 opacity-90'
                      : 'cursor-pointer hover:ring-2 hover:ring-amber-500/80 hover:z-20 border'
                  } ${isHintTarget ? 'ring-4 ring-amber-400 ring-offset-1 z-30 animate-pulse' : ''}`}
                  style={{
                    backgroundColor: cell.occupiable ? room.color : '#D6D3D1',
                    borderColor: isHintTarget ? '#F59E0B' : room.borderColor,
                  }}
                >
                  {/* Coordinate Label Accent */}
                  <span className="absolute top-1 left-1.5 text-[9px] font-mono font-bold text-stone-400 opacity-60 pointer-events-none">
                    {r},{c}
                  </span>

                  {/* Obstacle / Object Icon */}
                  {cell.object !== 'none' && !placedSuspect && renderObjectIcon(cell.object, cell.objectName)}

                  {/* Placed Suspect (Hero Badge) */}
                  {placedSuspect && (
                    <motion.div
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="z-10 flex flex-col items-center justify-center"
                    >
                      <div
                        className="w-11 h-11 rounded-full flex items-center justify-center font-black text-lg shadow-md border-2 border-white ring-2 ring-stone-900/30"
                        style={{
                          backgroundColor: placedSuspect.badgeBg,
                          color: placedSuspect.textColor,
                        }}
                      >
                        {placedSuspect.initial}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider mt-0.5 px-1.5 py-0.2 rounded bg-stone-900 text-stone-100 shadow-xs">
                        {placedSuspect.name}
                      </span>
                    </motion.div>
                  )}

                  {/* Eliminated X Overlay */}
                  {isEliminated && !placedSuspect && (
                    <div className="absolute inset-0 flex items-center justify-center bg-red-900/10 pointer-events-none z-10">
                      <X className="w-12 h-12 text-red-600 opacity-80 stroke-[3]" />
                    </div>
                  )}

                  {/* Cell Notes Tags */}
                  {!placedSuspect && cellNotes.length > 0 && (
                    <div className="absolute bottom-1 right-1 flex flex-wrap gap-0.5 max-w-[80%] justify-end pointer-events-none z-10">
                      {cellNotes.map((s) => (
                        <span
                          key={s.id}
                          className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-black text-white shadow-xs"
                          style={{ backgroundColor: s.color }}
                        >
                          {s.initial}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
