import React from 'react';
import type { CaseStatus } from '../types/case';
import { Lock } from 'lucide-react';

interface StatusBadgeProps {
  status: CaseStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'new':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-black tracking-wider uppercase bg-[#1B5E20] text-[#E8F5E9] shadow-sm border border-[#2E7D32]">
          NEW
        </span>
      );
    case 'in_progress':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-black tracking-wider uppercase bg-[#E65100] text-[#FFF3E0] shadow-sm border border-[#EF6C00]">
          IN PROGRESS
        </span>
      );
    case 'completed':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-black tracking-wider uppercase bg-[#004D40] text-[#E0F2F1] shadow-sm border border-[#00695C]">
          SOLVED
        </span>
      );
    case 'locked':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-black tracking-wider uppercase bg-[#212121] text-[#E0E0E0] shadow-sm border border-[#424242]">
          <Lock className="w-3 h-3" />
          LOCKED
        </span>
      );
    default:
      return null;
  }
};
