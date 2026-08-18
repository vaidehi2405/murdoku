import React from 'react';
import { HelpCircle, Settings, Search, ShieldAlert } from 'lucide-react';

interface HeaderProps {
  onOpenHowToPlay: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenHowToPlay, onOpenSettings }) => {
  return (
    <header className="w-full flex items-center justify-between py-4 px-6 bg-[#FAF7F0] border-b border-stone-300/80 shadow-xs">
      {/* Left Branding / Title */}
      <div className="flex items-center gap-3">
        {/* Detective Badge Icon */}
        <div className="relative w-11 h-11 rounded-full bg-stone-900 text-stone-100 flex items-center justify-center shadow-md border border-stone-700">
          <Search className="w-5 h-5 text-amber-400" />
          <ShieldAlert className="w-3.5 h-3.5 text-stone-300 absolute bottom-1 right-1" />
        </div>

        <div>
          <h1 className="text-2xl font-black tracking-tight text-stone-900 uppercase font-serif flex items-center gap-2">
            CASE FILES
          </h1>
          <p className="text-xs font-semibold text-stone-600 italic tracking-wide">
            Solve the case. Find the truth.
          </p>
        </div>
      </div>

      {/* Right Action Buttons */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={onOpenHowToPlay}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-stone-200/80 hover:bg-stone-300/80 border border-stone-300 text-stone-800 text-xs font-bold transition-colors shadow-xs"
        >
          <HelpCircle className="w-4 h-4 text-stone-700" />
          <span>How to Play</span>
        </button>

        <button
          onClick={onOpenSettings}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-stone-200/80 hover:bg-stone-300/80 border border-stone-300 text-stone-800 text-xs font-bold transition-colors shadow-xs"
        >
          <Settings className="w-4 h-4 text-stone-700" />
          <span>Settings</span>
        </button>
      </div>
    </header>
  );
};
