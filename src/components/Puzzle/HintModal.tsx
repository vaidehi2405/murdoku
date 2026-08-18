import React from 'react';
import type { Hint } from '../../types/puzzleTypes';
import { Lightbulb, X, ArrowRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HintModalProps {
  isOpen: boolean;
  hints: Hint[];
  activeHintIndex: number;
  onNextHint: () => void;
  onClose: () => void;
}

export const HintModal: React.FC<HintModalProps> = ({
  isOpen,
  hints,
  activeHintIndex,
  onNextHint,
  onClose,
}) => {
  if (!isOpen || hints.length === 0) return null;

  const currentHint = hints[Math.min(activeHintIndex, hints.length - 1)];
  const isLastHint = activeHintIndex >= hints.length - 1;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md bg-[#FAF8F5] border-2 border-amber-500 rounded-2xl shadow-2xl overflow-hidden z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 bg-amber-500 text-stone-950 font-black">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-stone-950" />
              <span className="text-sm tracking-wide uppercase">
                HINT {currentHint.level} OF {hints.length}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-amber-600/30 text-stone-950 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Hint Content */}
          <div className="p-6">
            <h4 className="font-extrabold text-stone-900 text-base mb-2">
              {currentHint.title}
            </h4>
            <p className="text-stone-700 text-xs leading-relaxed font-medium mb-6 bg-amber-50/80 p-3.5 rounded-xl border border-amber-200">
              "{currentHint.text}"
            </p>

            {currentHint.targetCellCoords && currentHint.targetCellCoords.length > 0 && (
              <div className="text-[11px] font-bold text-amber-800 flex items-center gap-1.5 mb-4">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                <span>Target Cells Highlighted: ({currentHint.targetCellCoords.join('), (')})</span>
              </div>
            )}

            {/* Buttons Row */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 px-4 rounded-xl bg-stone-200 hover:bg-stone-300 border border-stone-300 text-stone-800 font-bold text-xs uppercase tracking-wider transition-colors"
              >
                CLOSE
              </button>

              {!isLastHint ? (
                <button
                  onClick={onNextHint}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-xs uppercase tracking-wider shadow-md transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>NEXT HINT</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-800 font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-1">
                  <Check className="w-4 h-4" />
                  <span>ALL HINTS REVEALED</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
