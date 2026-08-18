import React from 'react';
import type { Puzzle } from '../../types/puzzleTypes';
import { Trophy, Clock, RotateCcw, ArrowRight, Home, Sparkles, Lightbulb, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

interface ResultScreenProps {
  puzzle: Puzzle;
  finalTimeSeconds: number;
  attempts: number;
  hintsUsed: number;
  solutionRevealed: boolean;
  isNewBest: boolean;
  onPlayAgain: () => void;
  onBackToCases: () => void;
  onNextCase?: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  puzzle,
  finalTimeSeconds,
  attempts,
  hintsUsed,
  solutionRevealed,
  isNewBest,
  onPlayAgain,
  onBackToCases,
  onNextCase,
}) => {
  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#F4F0E8] text-stone-900 flex flex-col items-center justify-center p-6 selection:bg-amber-300">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-xl bg-[#FAF8F5] border-4 border-stone-800 rounded-3xl shadow-2xl overflow-hidden text-center relative p-8 flex flex-col items-center"
      >
        {/* Top Trophy / Badge */}
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg border-2 mb-4 animate-bounce ${
            solutionRevealed
              ? 'bg-stone-800 text-amber-300 border-stone-700'
              : 'bg-amber-400 text-stone-900 border-amber-500'
          }`}
        >
          <Trophy className="w-9 h-9" />
        </div>

        {/* Status Tag */}
        <div className="flex items-center gap-2 mb-2">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-black uppercase tracking-widest">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>CASE SOLVED</span>
          </div>

          {isNewBest && !solutionRevealed && (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-400 text-stone-950 text-xs font-black uppercase tracking-widest shadow-xs">
              ★ NEW BEST
            </span>
          )}
        </div>

        {/* Case Title */}
        <h1 className="text-3xl font-black tracking-tight text-stone-900 uppercase font-serif mb-1">
          {puzzle.title}
        </h1>
        <p className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-6">
          {puzzle.caseNumber} • DISCOVERY VERIFIED
        </p>

        {/* Solution Revealed Warning if applicable */}
        {solutionRevealed && (
          <div className="w-full mb-6 p-3 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 text-xs font-bold flex items-center justify-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0" />
            <span>Solution was revealed during this attempt. Best solving time record preserved.</span>
          </div>
        )}

        {/* Stats Grid Box */}
        <div className="w-full grid grid-cols-4 gap-3 bg-stone-200/80 border border-stone-300 rounded-2xl p-4 mb-8">
          {/* Time Stat */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-stone-500 text-[10px] font-extrabold uppercase mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span>TIME</span>
            </div>
            <div className="text-lg font-mono font-black text-stone-900">
              {formatTime(finalTimeSeconds)}
            </div>
          </div>

          {/* Difficulty Stat */}
          <div className="flex flex-col items-center border-l border-stone-300/80">
            <div className="text-stone-500 text-[10px] font-extrabold uppercase mb-1">
              DIFFICULTY
            </div>
            <div className="text-xs font-black text-emerald-700 uppercase tracking-wide mt-1">
              {puzzle.difficulty.replace('_', ' ')}
            </div>
          </div>

          {/* Attempts Stat */}
          <div className="flex flex-col items-center border-l border-stone-300/80">
            <div className="text-stone-500 text-[10px] font-extrabold uppercase mb-1">
              ATTEMPTS
            </div>
            <div className="text-lg font-black text-stone-900">
              {attempts}
            </div>
          </div>

          {/* Hints Stat */}
          <div className="flex flex-col items-center border-l border-stone-300/80">
            <div className="flex items-center gap-1 text-stone-500 text-[10px] font-extrabold uppercase mb-1">
              <Lightbulb className="w-3 h-3 text-amber-600" />
              <span>HINTS</span>
            </div>
            <div className="text-lg font-black text-stone-900">
              {hintsUsed}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-3">
          {onNextCase && (
            <button
              onClick={onNextCase}
              className="w-full py-3.5 px-6 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-100 font-black text-xs uppercase tracking-widest shadow-md transition-all flex items-center justify-center gap-2 group"
            >
              <span>NEXT CASE</span>
              <ArrowRight className="w-4 h-4 text-amber-400 transition-transform group-hover:translate-x-1" />
            </button>
          )}

          <div className="flex gap-3">
            <button
              onClick={onPlayAgain}
              className="flex-1 py-3 px-4 rounded-xl bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-900 font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xs"
            >
              <RotateCcw className="w-4 h-4 text-amber-800" />
              <span>PLAY AGAIN</span>
            </button>

            <button
              onClick={onBackToCases}
              className="flex-1 py-3 px-4 rounded-xl bg-stone-200 hover:bg-stone-300 border border-stone-300 text-stone-800 font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xs"
            >
              <Home className="w-4 h-4 text-stone-700" />
              <span>BACK TO CASES</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
