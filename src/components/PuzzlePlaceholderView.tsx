import React from 'react';
import type { Case } from '../types/case';
import { DIFFICULTY_CONFIG } from '../data/casesData';
import { MapPreview } from './MapPreview';
import { ArrowLeft, Clock, ShieldCheck, Trophy, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface PuzzlePlaceholderViewProps {
  caseData: Case;
  mode: 'play' | 'continue' | 'replay';
  onBack: () => void;
}

export const PuzzlePlaceholderView: React.FC<PuzzlePlaceholderViewProps> = ({
  caseData,
  mode,
  onBack,
}) => {
  const diffConfig = DIFFICULTY_CONFIG[caseData.difficulty];

  const getModeTitle = () => {
    switch (mode) {
      case 'continue':
        return 'RESUMING INVESTIGATION';
      case 'replay':
        return 'NEW ATTEMPT (REPLAY MODE)';
      case 'play':
      default:
        return 'STARTING NEW INVESTIGATION';
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F0E8] text-stone-900 flex flex-col">
      {/* Top Header Bar */}
      <header className="w-full py-4 px-8 bg-stone-900 text-stone-100 flex items-center justify-between border-b border-stone-800 shadow-md">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-400 font-bold text-xs uppercase tracking-wider transition-colors border border-stone-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Case Files</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-stone-800 text-stone-300">
            {caseData.caseNumber}
          </span>
          <span className="text-sm font-black tracking-wide uppercase text-amber-300">
            {caseData.title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span
            className="px-3 py-1 rounded-full text-xs font-black uppercase"
            style={{ backgroundColor: diffConfig.bgColor, color: diffConfig.textColor }}
          >
            {diffConfig.label}
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl mx-auto w-full p-8 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full bg-[#FAF8F5] border-2 border-stone-400 rounded-2xl shadow-xl p-8 flex flex-col items-center text-center relative overflow-hidden"
        >
          {/* Top Banner Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 font-black text-xs uppercase tracking-widest mb-6">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>{getModeTitle()}</span>
          </div>

          {/* Big Header Text */}
          <h1 className="text-3xl font-black tracking-tight text-stone-900 uppercase font-serif mb-2">
            PUZZLE SCREEN — COMING NEXT
          </h1>
          <p className="text-sm font-semibold text-stone-600 max-w-lg mb-8">
            You selected <span className="font-extrabold text-stone-900">{caseData.caseNumber}: {caseData.title}</span>.
            The visual detective puzzle engine & suspect placement grid will load here in the next iteration.
          </p>

          {/* Case Blueprint Card Preview */}
          <div className="w-full max-w-md bg-stone-200 border-2 border-stone-300 rounded-xl overflow-hidden shadow-inner mb-8">
            <div className="h-48 relative">
              <MapPreview roomType={caseData.roomType} />
            </div>

            <div className="p-4 bg-stone-100 border-t border-stone-300 flex items-center justify-between text-xs font-bold text-stone-700">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-stone-500" />
                <span>Est. Time: {caseData.estimatedTime}</span>
              </div>
              {caseData.bestTime && (
                <div className="flex items-center gap-1.5 text-amber-800">
                  <Trophy className="w-4 h-4 text-amber-600" />
                  <span>Best: {caseData.bestTime}</span>
                </div>
              )}
            </div>
          </div>

          {/* Mode Details Box */}
          <div className="w-full max-w-md bg-stone-100/90 border border-stone-300 rounded-xl p-4 text-left text-xs space-y-2 mb-8">
            <div className="flex justify-between border-b border-stone-200 pb-1.5">
              <span className="font-bold text-stone-500 uppercase">Case Status:</span>
              <span className="font-extrabold text-stone-900 uppercase">{caseData.status.replace('_', ' ')}</span>
            </div>
            <div className="flex justify-between border-b border-stone-200 pb-1.5">
              <span className="font-bold text-stone-500 uppercase">Attempt Mode:</span>
              <span className="font-extrabold text-stone-900 uppercase">{mode}</span>
            </div>
            {caseData.attempts && (
              <div className="flex justify-between">
                <span className="font-bold text-stone-500 uppercase">Previous Attempts:</span>
                <span className="font-extrabold text-stone-900">{caseData.attempts}</span>
              </div>
            )}
          </div>

          {/* Back Button */}
          <button
            onClick={onBack}
            className="px-8 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-100 font-black text-xs uppercase tracking-wider shadow-md transition-all flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>RETURN TO CASE LIBRARY</span>
          </button>
        </motion.div>
      </main>
    </div>
  );
};
