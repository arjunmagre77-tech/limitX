import React from "react";
import { Coins, Flame } from "lucide-react";

interface PointsBadgeProps {
  points?: number;
  levelTitle?: string;
  className?: string;
}

export function PointsBadge({ points = 0, levelTitle = "Rookie", className = "" }: PointsBadgeProps) {
  return (
    <div className={`inline-flex items-center gap-2 bg-primary/10 border border-primary/40 px-3 py-1 text-xs font-display text-primary tracking-wider uppercase ${className}`}>
      <Coins className="w-3.5 h-3.5 text-primary animate-pulse" />
      <span>{points.toLocaleString()} LP</span>
      <span className="text-gray-400 font-sans text-[10px]">({levelTitle})</span>
    </div>
  );
}

interface StreakCardProps {
  streakDays?: number;
}

export function StreakCard({ streakDays = 1 }: StreakCardProps) {
  return (
    <div className="glass-panel p-4 border border-orange-500/30 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-orange-500/20 border border-orange-500/40 rounded-full flex items-center justify-center">
          <Flame className="w-6 h-6 text-orange-500 animate-bounce" />
        </div>
        <div>
          <h4 className="font-display font-bold text-white uppercase text-sm">{streakDays} DAY STREAK</h4>
          <p className="text-xs text-gray-400 font-sans">Active consecutive daily login!</p>
        </div>
      </div>
      <span className="text-xs font-display text-orange-400 font-bold bg-orange-500/10 border border-orange-500/30 px-2 py-1 uppercase">+10 LP / Day</span>
    </div>
  );
}
