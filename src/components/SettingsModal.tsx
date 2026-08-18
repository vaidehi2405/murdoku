import React, { useState } from 'react';
import { X, Volume2, VolumeX, Eye, Moon, Sun, RotateCcw, Wrench } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetProgress: () => void;
  onOpenAdmin?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onResetProgress,
  onOpenAdmin,
}) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [themeMode, setThemeMode] = useState<'parchment' | 'dark'>('parchment');

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
            className="relative w-full max-w-md bg-[#FAF8F5] border-2 border-stone-400 rounded-2xl shadow-2xl overflow-hidden z-10"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-stone-900 text-stone-100">
              <h2 className="text-lg font-black tracking-wide uppercase">SETTINGS</h2>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-stone-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Settings Options */}
            <div className="p-6 space-y-5 text-stone-800 text-sm">
              {/* Sound Toggle */}
              <div className="flex items-center justify-between py-2 border-b border-stone-200">
                <div className="flex items-center gap-2.5">
                  {soundEnabled ? (
                    <Volume2 className="w-5 h-5 text-amber-700" />
                  ) : (
                    <VolumeX className="w-5 h-5 text-stone-400" />
                  )}
                  <div>
                    <div className="font-extrabold text-stone-900">Sound Effects</div>
                    <div className="text-xs text-stone-500">Play audio cues for clues & placement</div>
                  </div>
                </div>
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`w-12 h-6 rounded-full transition-colors relative flex items-center p-1 ${
                    soundEnabled ? 'bg-amber-700' : 'bg-stone-300'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      soundEnabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Theme Preference */}
              <div className="flex items-center justify-between py-2 border-b border-stone-200">
                <div className="flex items-center gap-2.5">
                  {themeMode === 'parchment' ? (
                    <Sun className="w-5 h-5 text-amber-600" />
                  ) : (
                    <Moon className="w-5 h-5 text-purple-600" />
                  )}
                  <div>
                    <div className="font-extrabold text-stone-900">Interface Theme</div>
                    <div className="text-xs text-stone-500">Parchment Warmth / Dark Bureau</div>
                  </div>
                </div>
                <div className="flex gap-1 bg-stone-200 p-1 rounded-lg">
                  <button
                    onClick={() => setThemeMode('parchment')}
                    className={`px-2.5 py-1 rounded text-xs font-bold ${
                      themeMode === 'parchment'
                        ? 'bg-stone-900 text-white'
                        : 'text-stone-700 hover:text-stone-900'
                    }`}
                  >
                    Parchment
                  </button>
                  <button
                    onClick={() => setThemeMode('dark')}
                    className={`px-2.5 py-1 rounded text-xs font-bold ${
                      themeMode === 'dark'
                        ? 'bg-stone-900 text-white'
                        : 'text-stone-700 hover:text-stone-900'
                    }`}
                  >
                    Dark
                  </button>
                </div>
              </div>

              {/* High Contrast */}
              <div className="flex items-center justify-between py-2 border-b border-stone-200">
                <div className="flex items-center gap-2.5">
                  <Eye className="w-5 h-5 text-blue-700" />
                  <div>
                    <div className="font-extrabold text-stone-900">High Contrast Map Grid</div>
                    <div className="text-xs text-stone-500">Sharpen line borders for grid tiles</div>
                  </div>
                </div>
                <button
                  onClick={() => setHighContrast(!highContrast)}
                  className={`w-12 h-6 rounded-full transition-colors relative flex items-center p-1 ${
                    highContrast ? 'bg-blue-700' : 'bg-stone-300'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      highContrast ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Developer Studio Link */}
              {onOpenAdmin && (
                <div className="py-2 border-b border-stone-200">
                  <button
                    onClick={() => {
                      onClose();
                      onOpenAdmin();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-black uppercase tracking-wider transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Wrench className="w-4 h-4 text-amber-700" />
                      <span>Puzzle Authoring Studio (/admin/puzzles)</span>
                    </div>
                    <span>→</span>
                  </button>
                </div>
              )}

              {/* Reset Data */}
              <div className="pt-1">
                <button
                  onClick={onResetProgress}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-300 font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset Local Demo Data
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-stone-200/80 border-t border-stone-300 flex justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-100 font-bold text-xs uppercase tracking-wider transition-colors shadow-xs"
              >
                SAVE & CLOSE
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
