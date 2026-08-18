import React from 'react';
import type { TabFilter } from '../types/case';
import { Folder, Hourglass, CheckCircle2 } from 'lucide-react';

interface CaseTabsProps {
  activeTab: TabFilter;
  onTabChange: (tab: TabFilter) => void;
  counts: {
    all: number;
    inProgress: number;
    completed: number;
  };
}

export const CaseTabs: React.FC<CaseTabsProps> = ({ activeTab, onTabChange, counts }) => {
  const tabs = [
    {
      id: 'all' as TabFilter,
      label: 'ALL CASES',
      count: counts.all,
      icon: Folder,
    },
    {
      id: 'in_progress' as TabFilter,
      label: 'IN PROGRESS',
      count: counts.inProgress,
      icon: Hourglass,
    },
    {
      id: 'completed' as TabFilter,
      label: 'COMPLETED',
      count: counts.completed,
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="flex items-center gap-2 pt-4 px-6 border-b border-stone-300 bg-[#ECE7DE]">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`relative flex items-center gap-2.5 px-5 py-3 rounded-t-xl font-bold text-xs tracking-wider uppercase transition-all duration-200 border-t border-x ${
              isActive
                ? 'bg-stone-900 text-stone-100 border-stone-900 shadow-md z-10 -mb-[1px]'
                : 'bg-stone-200/90 hover:bg-stone-300 text-stone-700 border-stone-300/80 hover:border-stone-400'
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-stone-500'}`} />
            <span>{tab.label}</span>
            <span
              className={`ml-1 px-2 py-0.5 rounded-full text-[11px] font-extrabold ${
                isActive
                  ? 'bg-stone-800 text-amber-300 border border-stone-700'
                  : 'bg-stone-300 text-stone-700'
              }`}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
