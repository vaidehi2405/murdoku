import React, { useState } from 'react';
import type { PuzzleDefinition, Room, CellObject, Cell } from '../../../types/puzzleTypes';
import { Plus, Trash2, Paintbrush, Ban, Armchair } from 'lucide-react';

interface StepBoardRoomsProps {
  puzzle: PuzzleDefinition;
  onChange: (updates: Partial<PuzzleDefinition>) => void;
  activeTool: 'room_paint' | 'toggle_block' | 'place_object';
  onSelectTool: (tool: 'room_paint' | 'toggle_block' | 'place_object') => void;
  selectedRoomId: string;
  onSelectRoom: (roomId: string) => void;
  selectedObject: CellObject;
  onSelectObject: (obj: CellObject) => void;
}

export const StepBoardRooms: React.FC<StepBoardRoomsProps> = ({
  puzzle,
  onChange,
  activeTool,
  onSelectTool,
  selectedRoomId,
  onSelectRoom,
  selectedObject,
  onSelectObject,
}) => {
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomColor, setNewRoomColor] = useState('#E0F2FE');
  const [newRoomBorderColor, setNewRoomBorderColor] = useState('#BAE6FD');
  const [newRoomTextColor, setNewRoomTextColor] = useState('#0369A1');

  // Change grid size helper
  const handleGridSizeChange = (newSize: number) => {
    const currentRooms = Object.keys(puzzle.rooms);
    const defaultRoomId = currentRooms[0] || 'room_1';
    const defaultRoomName = puzzle.rooms[defaultRoomId]?.name || 'Room 1';

    const newCells: Cell[][] = [];
    for (let r = 0; r < newSize; r++) {
      const row: Cell[] = [];
      for (let c = 0; c < newSize; c++) {
        if (puzzle.cells[r] && puzzle.cells[r][c]) {
          row.push({ ...puzzle.cells[r][c], row: r, col: c });
        } else {
          row.push({
            row: r,
            col: c,
            occupiable: true,
            roomId: defaultRoomId,
            roomName: defaultRoomName,
            object: 'none',
          });
        }
      }
      newCells.push(row);
    }

    onChange({
      gridRows: newSize,
      gridCols: newSize,
      cells: newCells,
    });
  };

  // Add room helper
  const handleAddRoom = () => {
    if (!newRoomName.trim()) return;
    const roomId = newRoomName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const newRoom: Room = {
      id: roomId,
      name: newRoomName.trim(),
      color: newRoomColor,
      borderColor: newRoomBorderColor,
      textColor: newRoomTextColor,
    };
    onChange({
      rooms: {
        ...puzzle.rooms,
        [roomId]: newRoom,
      },
    });
    setNewRoomName('');
    onSelectRoom(roomId);
  };

  const handleDeleteRoom = (roomId: string) => {
    const nextRooms = { ...puzzle.rooms };
    delete nextRooms[roomId];
    onChange({ rooms: nextRooms });
  };

  const objectTypes: { type: CellObject; label: string }[] = [
    { type: 'desk', label: 'Desk' },
    { type: 'safe', label: 'Safe' },
    { type: 'chair', label: 'Chair' },
    { type: 'couch', label: 'Couch' },
    { type: 'table', label: 'Table' },
    { type: 'plant', label: 'Plant' },
    { type: 'bookshelf', label: 'Bookshelf' },
    { type: 'cabinet', label: 'Cabinet' },
    { type: 'fireplace', label: 'Fireplace' },
    { type: 'bar', label: 'Bar' },
    { type: 'microscope', label: 'Microscope' },
    { type: 'pedestal', label: 'Pedestal' },
    { type: 'carpet', label: 'Carpet/Rug' },
    { type: 'none', label: 'Clear Object' },
  ];

  return (
    <div className="space-y-6">
      {/* Grid Dimension Selector */}
      <div>
        <h3 className="text-sm font-black uppercase tracking-wider text-stone-900 mb-1">
          Grid Size
        </h3>
        <div className="flex gap-2 mt-2">
          {[5, 6, 7, 8, 9].map((size) => (
            <button
              key={size}
              onClick={() => handleGridSizeChange(size)}
              className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold border-2 transition-all ${
                puzzle.gridRows === size
                  ? 'bg-stone-900 text-amber-300 border-stone-900 shadow-sm'
                  : 'bg-white text-stone-700 border-stone-300 hover:border-stone-400'
              }`}
            >
              {size}×{size}
            </button>
          ))}
        </div>
      </div>

      {/* Editor Tool Switcher */}
      <div>
        <h3 className="text-sm font-black uppercase tracking-wider text-stone-900 mb-1">
          Board Painter Tool
        </h3>
        <div className="grid grid-cols-3 gap-2 mt-2">
          <button
            onClick={() => onSelectTool('room_paint')}
            className={`py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider border-2 transition-all ${
              activeTool === 'room_paint'
                ? 'bg-amber-400 text-stone-950 border-amber-500 shadow-sm'
                : 'bg-white text-stone-700 border-stone-300 hover:border-stone-400'
            }`}
          >
            <Paintbrush className="w-4 h-4" />
            <span>Paint Room</span>
          </button>

          <button
            onClick={() => onSelectTool('toggle_block')}
            className={`py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider border-2 transition-all ${
              activeTool === 'toggle_block'
                ? 'bg-red-500 text-white border-red-600 shadow-sm'
                : 'bg-white text-stone-700 border-stone-300 hover:border-stone-400'
            }`}
          >
            <Ban className="w-4 h-4" />
            <span>Block/Obstacle</span>
          </button>

          <button
            onClick={() => onSelectTool('place_object')}
            className={`py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider border-2 transition-all ${
              activeTool === 'place_object'
                ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
                : 'bg-white text-stone-700 border-stone-300 hover:border-stone-400'
            }`}
          >
            <Armchair className="w-4 h-4" />
            <span>Add Object</span>
          </button>
        </div>
      </div>

      {/* Contextual Options for Selected Tool */}
      {activeTool === 'room_paint' && (
        <div className="space-y-4 pt-2 border-t border-stone-200">
          <h4 className="text-xs font-black uppercase tracking-wider text-stone-800">
            Select Room Brush to Paint on Board
          </h4>
          <div className="space-y-2">
            {Object.values(puzzle.rooms).map((r) => (
              <div
                key={r.id}
                onClick={() => onSelectRoom(r.id)}
                className={`p-3 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                  selectedRoomId === r.id
                    ? 'border-amber-500 ring-2 ring-amber-400/40'
                    : 'border-stone-300 hover:border-stone-400'
                }`}
                style={{ backgroundColor: r.color }}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-4 h-4 rounded-full border"
                    style={{ backgroundColor: r.color, borderColor: r.borderColor }}
                  />
                  <span className="text-xs font-bold" style={{ color: r.textColor }}>
                    {r.name}
                  </span>
                </div>
                {Object.keys(puzzle.rooms).length > 2 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteRoom(r.id);
                    }}
                    className="p-1 text-stone-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Add New Room Form */}
          <div className="p-3.5 bg-white border-2 border-dashed border-stone-300 rounded-2xl space-y-3">
            <span className="text-[11px] font-black uppercase tracking-wider text-stone-600 block">
              + Define New Room
            </span>
            <input
              type="text"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              placeholder="e.g. Master Bedroom"
              className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-300 text-xs font-bold text-stone-900"
            />
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] font-bold text-stone-500 block mb-0.5">Bg Tint</label>
                <input
                  type="color"
                  value={newRoomColor}
                  onChange={(e) => setNewRoomColor(e.target.value)}
                  className="w-full h-7 rounded border cursor-pointer"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-stone-500 block mb-0.5">Border</label>
                <input
                  type="color"
                  value={newRoomBorderColor}
                  onChange={(e) => setNewRoomBorderColor(e.target.value)}
                  className="w-full h-7 rounded border cursor-pointer"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-stone-500 block mb-0.5">Text</label>
                <input
                  type="color"
                  value={newRoomTextColor}
                  onChange={(e) => setNewRoomTextColor(e.target.value)}
                  className="w-full h-7 rounded border cursor-pointer"
                />
              </div>
            </div>
            <button
              onClick={handleAddRoom}
              className="w-full py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Room</span>
            </button>
          </div>
        </div>
      )}

      {activeTool === 'place_object' && (
        <div className="space-y-3 pt-2 border-t border-stone-200">
          <h4 className="text-xs font-black uppercase tracking-wider text-stone-800">
            Select Furniture / Object to Stamp
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {objectTypes.map((o) => (
              <button
                key={o.type}
                onClick={() => onSelectObject(o.type)}
                className={`py-2 px-3 rounded-xl text-left text-xs font-bold border-2 transition-all ${
                  selectedObject === o.type
                    ? 'bg-blue-50 text-blue-900 border-blue-500 shadow-xs'
                    : 'bg-white text-stone-700 border-stone-300 hover:border-stone-400'
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {activeTool === 'toggle_block' && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-900 font-semibold">
          Click any cell on the board to toggle between <strong>Occupiable Floor</strong> and <strong>Blocked Obstacle/Wall</strong>.
        </div>
      )}
    </div>
  );
};
