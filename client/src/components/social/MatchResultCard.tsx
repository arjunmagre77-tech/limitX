import React from "react";
import { Trophy, Crosshair, Award, DollarSign } from "lucide-react";
import { MatchResultData } from "@shared/schema";

interface MatchResultCardProps {
  data: MatchResultData;
}

export function MatchResultCard({ data }: MatchResultCardProps) {
  return (
    <div className="my-3 glass-panel border border-primary/40 p-4 relative overflow-hidden bg-black/40">
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 blur-xl pointer-events-none"></div>
      <div className="flex justify-between items-center mb-3 border-b border-white/10 pb-2">
        <span className="text-xs font-display text-primary tracking-widest uppercase flex items-center gap-1.5 font-bold">
          <Trophy className="w-4 h-4 text-primary" /> MATCH RESULT
        </span>
        <span className="text-xs font-sans text-gray-300 font-semibold">{data.tournamentName}</span>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="bg-white/5 border border-white/5 p-2">
          <span className="block text-[10px] text-gray-400 font-sans uppercase tracking-wider">Placement</span>
          <span className="text-sm font-display font-bold text-white uppercase">{data.rank}</span>
        </div>
        <div className="bg-white/5 border border-white/5 p-2">
          <span className="block text-[10px] text-gray-400 font-sans uppercase tracking-wider">Squad Kills</span>
          <span className="text-sm font-display font-bold text-primary flex items-center justify-center gap-1">
            <Crosshair className="w-3.5 h-3.5" /> {data.kills}
          </span>
        </div>
        <div className="bg-white/5 border border-white/5 p-2">
          <span className="block text-[10px] text-gray-400 font-sans uppercase tracking-wider">Booyahs</span>
          <span className="text-sm font-display font-bold text-secondary flex items-center justify-center gap-1">
            <Award className="w-3.5 h-3.5" /> {data.booyahs}
          </span>
        </div>
      </div>

      {data.prize && (
        <div className="mt-3 text-right">
          <span className="text-xs text-primary font-display font-bold uppercase inline-flex items-center gap-1 bg-primary/10 border border-primary/30 px-2 py-0.5">
            <DollarSign className="w-3 h-3" /> Prize Won: {data.prize}
          </span>
        </div>
      )}
    </div>
  );
}
