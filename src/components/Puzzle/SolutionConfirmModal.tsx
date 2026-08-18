import React from 'react';
import { Eye, X, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SolutionConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const SolutionConfirmModal: React.FC<SolutionConfirmModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
          className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md bg-[#FAF8F5] border-2 border-red-500 rounded-2xl shadow-2xl overflow-hidden z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 bg-red-800 text-white font-black">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-amber-300" />
              <span className="text-sm tracking-wide uppercase">REVEAL SOLUTION?</span>
            </div>
            <button
              onClick={onCancel}
              className="p-1 rounded-lg hover:bg-red-700 text-stone-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex gap-3 mb-4 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-900 text-xs font-semibold">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Are you sure you want to see the solution? Your current progress will be preserved, but this attempt will be marked as <strong className="font-extrabold uppercase">Solution Revealed</strong> and will not record a genuine solving best time.
              </p>
            </div>

            {/* Buttons Row */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={onCancel}
                className="flex-1 py-2.5 px-4 rounded-xl bg-stone-200 hover:bg-stone-300 border border-stone-300 text-stone-800 font-bold text-xs uppercase tracking-wider transition-colors"
              >
                CANCEL
              </button>

              <button
                onClick={onConfirm}
                className="flex-1 py-2.5 px-4 rounded-xl bg-red-700 hover:bg-red-800 text-white font-black text-xs uppercase tracking-wider shadow-md transition-colors"
              >
                REVEAL SOLUTION
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
