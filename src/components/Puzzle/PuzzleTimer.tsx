import React, { useEffect } from 'react';
import { Clock } from 'lucide-react';

interface PuzzleTimerProps {
  seconds: number;
  isRunning: boolean;
  onTick: () => void;
}

export const PuzzleTimer: React.FC<PuzzleTimerProps> = ({ seconds, isRunning, onTick }) => {
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      onTick();
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, onTick]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-stone-800 border border-stone-700 text-amber-400 font-mono font-bold text-sm shadow-xs">
      <Clock className="w-4 h-4 text-amber-400" />
      <span>{formatTime(seconds)}</span>
    </div>
  );
};
