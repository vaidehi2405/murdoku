import React from 'react';
import { DIFFICULTY_CONFIG } from '../data/casesData';
import type { Difficulty } from '../types/case';

export const DeskFooter: React.FC = () => {
  const difficulties: Difficulty[] = ['very_easy', 'easy', 'medium', 'hard', 'expert'];

  return (
    <footer className="w-full mt-10 pt-6 pb-8 border-t border-stone-300 bg-[#E8E2D5] relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Sticky Note Detective Quote */}
        <div className="relative bg-[#FFFDE7] border border-[#FFF59D] shadow-sm rounded-lg p-3 max-w-xs transform -rotate-1 hover:rotate-0 transition-transform">
          {/* Paperclip graphic */}
          <div className="absolute -top-3 left-4 w-3 h-6 border-2 border-stone-400 rounded-full" />
          <p className="text-xs font-serif italic text-stone-800 font-bold leading-tight pl-2">
            "Every clue matters.<br />Every detail counts."
          </p>
          {/* Fingerprint decorative motif */}
          <div className="absolute bottom-1 right-2 opacity-15">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
              <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
            </svg>
          </div>
        </div>

        {/* Difficulty Legend */}
        <div className="flex items-center gap-5 flex-wrap justify-center">
          {difficulties.map((diffKey) => {
            const config = DIFFICULTY_CONFIG[diffKey];
            return (
              <div key={diffKey} className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full shadow-xs inline-block"
                  style={{ backgroundColor: config.color }}
                />
                <span className="text-xs font-bold text-stone-700 uppercase tracking-wide">
                  {config.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Brand Copyright / Decorative Note */}
        <div className="text-right text-xs font-semibold text-stone-500">
          CASE FILES &copy; 2026 Visual Logic Detective
        </div>
      </div>
    </footer>
  );
};
