import React from 'react';
import { X, Search, CheckCircle2, Compass, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
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
            className="relative w-full max-w-lg bg-[#FAF8F5] border-2 border-stone-400 rounded-2xl shadow-2xl overflow-hidden z-10"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-stone-900 text-stone-100">
              <div className="flex items-center gap-2.5">
                <Search className="w-5 h-5 text-amber-400" />
                <h2 className="text-lg font-black tracking-wide uppercase">HOW TO PLAY</h2>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-stone-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4 text-stone-800 text-sm">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center font-black flex-shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-extrabold text-stone-900 flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-amber-700" /> Select a Case File
                  </h4>
                  <p className="text-stone-600 text-xs mt-1">
                    Choose from available cases in the Case Library based on difficulty, estimated time, and completion status.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center font-black flex-shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-extrabold text-stone-900 flex items-center gap-1.5">
                    <Search className="w-4 h-4 text-emerald-700" /> Analyze Room Clues
                  </h4>
                  <p className="text-stone-600 text-xs mt-1">
                    Examine witness testimonies, item locations, movement constraints, and floor plan layouts to piece together suspect positions.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 border border-blue-300 text-blue-800 flex items-center justify-center font-black flex-shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-extrabold text-stone-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-700" /> Solve & Verify
                  </h4>
                  <p className="text-stone-600 text-xs mt-1">
                    Place suspects onto their correct room grid squares. Once all clues are satisfied, submit your solution to complete the case!
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <div className="w-8 h-8 rounded-lg bg-purple-100 border border-purple-300 text-purple-800 flex items-center justify-center font-black flex-shrink-0">
                  4
                </div>
                <div>
                  <h4 className="font-extrabold text-stone-900 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-purple-700" /> Beat Your Best Time
                  </h4>
                  <p className="text-stone-600 text-xs mt-1">
                    Replay completed cases to optimize your solution time and improve your attempt record.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-stone-200/80 border-t border-stone-300 flex justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-100 font-bold text-xs uppercase tracking-wider transition-colors shadow-xs"
              >
                GOT IT
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
