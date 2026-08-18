import React from 'react';
import type { Case } from '../types/case';
import { DIFFICULTY_CONFIG } from '../data/casesData';
import { MapPreview } from './MapPreview';
import { StatusBadge } from './StatusBadge';
import { Clock, Trophy, RotateCcw, ArrowRight, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

interface CaseCardProps {
  caseData: Case;
  onSelectCase: (caseData: Case, mode: 'play' | 'continue' | 'replay') => void;
}

export const CaseCard: React.FC<CaseCardProps> = ({ caseData, onSelectCase }) => {
  const diffConfig = DIFFICULTY_CONFIG[caseData.difficulty];
  const isLocked = caseData.status === 'locked';

  const handleButtonClick = () => {
    if (isLocked) return;
    if (caseData.status === 'in_progress') {
      onSelectCase(caseData, 'continue');
    } else if (caseData.status === 'completed') {
      onSelectCase(caseData, 'replay');
    } else {
      onSelectCase(caseData, 'play');
    }
  };

  return (
    <motion.div
      whileHover={isLocked ? {} : { y: -4, transition: { duration: 0.2 } }}
      className={`relative flex flex-col rounded-xl border bg-white shadow-md transition-shadow duration-200 overflow-hidden ${
        isLocked
          ? 'border-stone-300 bg-stone-100 opacity-75 cursor-not-allowed shadow-none'
          : 'border-stone-300/80 hover:shadow-xl hover:border-stone-400 cursor-pointer'
      }`}
    >
      {/* Top Map Preview Container */}
      <div className="relative w-full h-44 bg-stone-200 border-b border-stone-200 overflow-hidden">
        <MapPreview roomType={caseData.roomType} isLocked={isLocked} />

        {/* Status Badge Overlay */}
        <div className="absolute top-2.5 left-2.5 z-10">
          <StatusBadge status={caseData.status} />
        </div>

        {/* Lock Overlay Icon when Locked */}
        {isLocked && (
          <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-[1px] flex items-center justify-center z-10">
            <div className="w-14 h-14 rounded-full bg-stone-900/80 border-2 border-stone-400 flex items-center justify-center text-stone-100 shadow-lg">
              <Lock className="w-7 h-7" />
            </div>
          </div>
        )}
      </div>

      {/* Card Content Section */}
      <div className="flex flex-col flex-1 p-4 bg-[#FAF8F5]">
        {/* Case Number */}
        <div className="text-[11px] font-bold tracking-wider text-stone-500 uppercase mb-1">
          {caseData.caseNumber}
        </div>

        {/* Case Title */}
        <h3 className="text-base font-extrabold text-stone-900 line-clamp-1 mb-3 leading-snug">
          {caseData.title}
        </h3>

        {/* Difficulty & Time Row */}
        <div className="flex items-center justify-between text-xs mb-3 text-stone-600">
          {/* Difficulty Dot + Text */}
          <div className="flex items-center gap-1.5 font-bold">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block"
              style={{ backgroundColor: diffConfig.color }}
            />
            <span className="tracking-wide uppercase" style={{ color: diffConfig.textColor }}>
              {diffConfig.label}
            </span>
          </div>

          {/* Time indicator depending on status */}
          <div className="flex items-center gap-1 text-stone-600 font-medium">
            {caseData.status === 'in_progress' ? (
              <>
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>{caseData.elapsedTime || '~6-10 min'}</span>
              </>
            ) : (
              <>
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                <span>{caseData.estimatedTime || '~5 min'}</span>
              </>
            )}
          </div>
        </div>

        {/* Solved Stat / In Progress Stat Details (if completed or in progress) */}
        {caseData.status === 'completed' && (
          <div className="flex items-center justify-between text-xs px-2.5 py-1.5 rounded-md bg-stone-200/60 border border-stone-300/70 mb-3 text-stone-700 font-medium">
            <div className="flex items-center gap-1.5 font-semibold text-stone-900">
              <Trophy className="w-3.5 h-3.5 text-amber-600" />
              <span>{caseData.bestTime}</span>
            </div>
            <div className="text-stone-500 text-[11px]">
              {caseData.attempts} {caseData.attempts === 1 ? 'attempt' : 'attempts'}
            </div>
          </div>
        )}

        {caseData.status === 'in_progress' && (
          <div className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md bg-amber-50 border border-amber-200 mb-3 text-amber-800 font-semibold">
            <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            <span>{caseData.elapsedTime} elapsed</span>
          </div>
        )}

        {/* Spacer to align buttons at bottom */}
        <div className="mt-auto pt-1" />

        {/* Contextual CTA Button */}
        {isLocked ? (
          <button
            disabled
            className="w-full py-2.5 px-4 rounded-lg font-bold text-xs tracking-wider uppercase bg-stone-300 text-stone-500 cursor-not-allowed flex items-center justify-center gap-1.5"
          >
            LOCKED <Lock className="w-3.5 h-3.5" />
          </button>
        ) : caseData.status === 'in_progress' ? (
          <button
            onClick={handleButtonClick}
            className="w-full py-2.5 px-4 rounded-lg font-bold text-xs tracking-wider uppercase bg-[#C55A11] hover:bg-[#A84A0C] text-white shadow-sm transition-colors flex items-center justify-center gap-2 group"
          >
            <span>CONTINUE</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        ) : caseData.status === 'completed' ? (
          <button
            onClick={handleButtonClick}
            className="w-full py-2.5 px-4 rounded-lg font-bold text-xs tracking-wider uppercase bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            <span>PLAY AGAIN</span>
            <RotateCcw className="w-3.5 h-3.5 text-amber-800" />
          </button>
        ) : (
          <button
            onClick={handleButtonClick}
            style={{
              backgroundColor: diffConfig.btnBg,
              color: diffConfig.btnText,
            }}
            className="w-full py-2.5 px-4 rounded-lg font-bold text-xs tracking-wider uppercase shadow-sm transition-opacity hover:opacity-90 flex items-center justify-center gap-2 group"
          >
            <span>PLAY CASE</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        )}
      </div>
    </motion.div>
  );
};
