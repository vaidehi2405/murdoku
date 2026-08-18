import React from 'react';
import type { SolutionExplanation } from '../../types/puzzleTypes';
import { BookOpen, CheckCircle2, ShieldCheck } from 'lucide-react';

interface SolutionExplanationPanelProps {
  explanation: SolutionExplanation;
}

export const SolutionExplanationPanel: React.FC<SolutionExplanationPanelProps> = ({ explanation }) => {
  return (
    <div className="w-full max-w-[620px] p-5 bg-stone-900 text-stone-100 border-2 border-amber-500/90 rounded-2xl shadow-2xl">
      <div className="flex items-center gap-2 mb-3 border-b border-stone-800 pb-2.5">
        <BookOpen className="w-4 h-4 text-amber-400" />
        <h4 className="text-xs font-black tracking-widest uppercase text-amber-300">
          THE SOLUTION REASONING
        </h4>
      </div>

      <p className="text-xs text-stone-300 font-semibold italic mb-3.5">
        {explanation.summary}
      </p>

      <div className="space-y-2.5 mb-4">
        {explanation.steps.map((step, idx) => (
          <div key={idx} className="flex items-start gap-2 text-[11px] text-stone-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <span className="leading-snug">{step}</span>
          </div>
        ))}
      </div>

      {/* Explicit End Badge */}
      <div className="pt-3 border-t border-stone-800 flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
        <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">
          — END OF REASONING —
        </span>
      </div>
    </div>
  );
};
