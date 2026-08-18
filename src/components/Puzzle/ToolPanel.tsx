import React from 'react';
import type { ActiveTool } from '../../types/puzzleTypes';
import {
  MapPin,
  Pencil,
  XCircle,
  Eraser,
  Undo2,
  RotateCcw,
  CheckCircle,
  Lightbulb,
  Eye,
} from 'lucide-react';

interface ToolPanelProps {
  activeTool: ActiveTool;
  onSelectTool: (tool: ActiveTool) => void;
  onUndo: () => void;
  canUndo: boolean;
  onReset: () => void;
  onSubmit: () => void;
  onOpenHint: () => void;
  onOpenSolutionModal: () => void;
  placedCount: number;
  totalSuspects: number;
  hintsUsedCount: number;
  totalHints: number;
  isReadOnly?: boolean;
}

export const ToolPanel: React.FC<ToolPanelProps> = ({
  activeTool,
  onSelectTool,
  onUndo,
  canUndo,
  onReset,
  onSubmit,
  onOpenHint,
  onOpenSolutionModal,
  placedCount,
  totalSuspects,
  hintsUsedCount,
  totalHints,
  isReadOnly = false,
}) => {
  const isSubmitDisabled = isReadOnly || placedCount < totalSuspects;

  const tools: { id: ActiveTool; label: string; desc: string; icon: React.ElementType }[] = [
    {
      id: 'place',
      label: 'PLACE',
      desc: 'Set suspect location',
      icon: MapPin,
    },
    {
      id: 'note',
      label: 'NOTE',
      desc: 'Add suspect initial note',
      icon: Pencil,
    },
    {
      id: 'eliminate',
      label: 'ELIMINATE (X)',
      desc: 'Mark cell impossible',
      icon: XCircle,
    },
    {
      id: 'erase',
      label: 'ERASER',
      desc: 'Clear cell contents',
      icon: Eraser,
    },
  ];

  return (
    <div className="w-72 flex flex-col bg-[#ECE7DE] border-l border-stone-300 overflow-hidden h-full">
      {/* Panel Header */}
      <div className="py-3 px-4 bg-[#E0D9CB] border-b border-stone-300 flex items-center justify-between">
        <h3 className="text-xs font-black tracking-wider uppercase text-stone-900">
          GAME TOOLS
        </h3>
        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded bg-stone-300 text-stone-800">
          {placedCount} / {totalSuspects} Placed
        </span>
      </div>

      {/* Tool Selection Section */}
      <div className="p-4 space-y-2 border-b border-stone-300">
        <div className="text-[11px] font-extrabold text-stone-500 uppercase tracking-widest mb-1">
          INTERACTION MODE
        </div>

        {tools.map((t) => {
          const Icon = t.icon;
          const isActive = activeTool === t.id;
          return (
            <button
              key={t.id}
              disabled={isReadOnly}
              onClick={() => onSelectTool(t.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                isReadOnly
                  ? 'bg-stone-200 border-stone-300 text-stone-400 cursor-not-allowed'
                  : isActive
                  ? 'bg-stone-900 text-stone-100 border-stone-900 shadow-md ring-2 ring-amber-400/40'
                  : 'bg-[#FAF8F5] hover:bg-white text-stone-800 border-stone-300 shadow-xs'
              }`}
            >
              <div
                className={`p-2 rounded-lg ${
                  isActive ? 'bg-stone-800 text-amber-400' : 'bg-stone-200 text-stone-700'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <div className="font-extrabold text-xs tracking-wide uppercase">{t.label}</div>
                <div
                  className={`text-[11px] font-medium ${
                    isActive ? 'text-stone-300' : 'text-stone-500'
                  }`}
                >
                  {t.desc}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Assistance & Solution Actions */}
      <div className="p-4 space-y-2 border-b border-stone-300 bg-[#E8E2D5]">
        <div className="text-[11px] font-extrabold text-stone-500 uppercase tracking-widest mb-1">
          ASSISTANCE & SOLUTION
        </div>

        {/* HINT BUTTON */}
        <button
          onClick={onOpenHint}
          className="w-full flex items-center justify-between p-2.5 rounded-xl border border-amber-400/80 bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs transition-colors shadow-xs"
        >
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-700" />
            <span className="uppercase tracking-wider font-extrabold">HINT ({hintsUsedCount}/{totalHints})</span>
          </div>
          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-300/80 text-amber-900">
            VIEW
          </span>
        </button>

        {/* VIEW SOLUTION BUTTON */}
        <button
          onClick={onOpenSolutionModal}
          className="w-full flex items-center justify-between p-2.5 rounded-xl border border-stone-400 bg-stone-200 hover:bg-stone-300 text-stone-900 font-bold text-xs transition-colors shadow-xs"
        >
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-stone-700" />
            <span className="uppercase tracking-wider font-extrabold">VIEW SOLUTION</span>
          </div>
          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-stone-300 text-stone-800">
            REVEAL
          </span>
        </button>
      </div>

      {/* Actions (Undo & Reset) */}
      <div className="p-4 space-y-2 border-b border-stone-300">
        <div className="text-[11px] font-extrabold text-stone-500 uppercase tracking-widest mb-1">
          ACTIONS
        </div>

        <button
          onClick={onUndo}
          disabled={!canUndo || isReadOnly}
          className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg border font-bold text-xs uppercase tracking-wider transition-all ${
            canUndo && !isReadOnly
              ? 'bg-[#FAF8F5] hover:bg-white border-stone-300 text-stone-800 shadow-xs'
              : 'bg-stone-200 border-stone-300 text-stone-400 cursor-not-allowed'
          }`}
        >
          <Undo2 className="w-4 h-4" />
          <span>UNDO ACTION</span>
        </button>

        <button
          onClick={onReset}
          disabled={isReadOnly}
          className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-stone-300 font-bold text-xs uppercase tracking-wider transition-all ${
            isReadOnly
              ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
              : 'bg-stone-200/80 hover:bg-stone-300/80 text-stone-700'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          <span>RESET BOARD</span>
        </button>
      </div>

      {/* Submit Button Section */}
      <div className="mt-auto p-4 bg-[#E0D9CB] border-t border-stone-300">
        <button
          onClick={onSubmit}
          disabled={isSubmitDisabled}
          className={`w-full py-3.5 px-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-md transition-all flex items-center justify-center gap-2 ${
            isSubmitDisabled
              ? 'bg-stone-400 text-stone-200 cursor-not-allowed shadow-none'
              : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-lg animate-pulse'
          }`}
        >
          <CheckCircle className="w-4 h-4" />
          <span>SUBMIT SOLUTION</span>
        </button>
        {isSubmitDisabled && !isReadOnly && (
          <p className="text-[11px] font-semibold text-stone-500 text-center mt-2">
            Place all {totalSuspects} suspects to enable submission.
          </p>
        )}
      </div>
    </div>
  );
};
