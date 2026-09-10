import React from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { SocialLayout } from "@/components/social/SocialLayout";
import { VerificationBadge } from "@/components/social/VerificationBadge";
import { FollowButton } from "@/components/social/FollowButton";
import { Player } from "@shared/schema";
import { Gamepad2, Trophy, Target, Crosshair, Loader2 } from "lucide-react";

export default function PlayersList() {
  const { data: players = [], isLoading } = useQuery<Player[]>({
    queryKey: ["/api/players"],
  });

  return (
    <SocialLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-display font-black text-white uppercase mb-2 flex items-center gap-2">
          PRO <span className="text-primary">PLAYERS</span> & COMPETITORS
        </h1>
        <p className="text-gray-400 font-sans text-sm">Discover top Free Fire fraggers, IGLs, and supports on Limitless Social.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {players.map((player) => (
            <div key={player.id} className="glass-panel border border-white/10 p-5 hover:border-primary/50 transition-all flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <img
                    src={player.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${player.username}`}
                    alt={player.displayName}
                    className="w-14 h-14 rounded-full border border-purple-500 p-0.5 object-cover"
                  />
                  <FollowButton userId={`user-${player.username}`} />
                </div>

                <Link href={`/profile/${player.username}`}>
                  <a className="font-display font-bold text-lg text-white hover:text-primary transition-colors uppercase flex items-center gap-1">
                    {player.displayName}
                    <VerificationBadge type="player" />
                  </a>
                </Link>
                <span className="text-xs font-sans text-purple-400 font-display uppercase tracking-widest block mb-2">{player.role}</span>
                <span className="text-xs font-sans text-gray-400 block mb-4">Team: {player.teamName}</span>
              </div>

              <div className="border-t border-white/10 pt-3 grid grid-cols-2 gap-2 text-center text-xs font-display">
                <div className="bg-white/5 p-1.5 border border-white/5">
                  <span className="block text-[10px] text-gray-500 font-sans">K/D RATIO</span>
                  <span className="text-white font-bold text-sm">{player.kd}</span>
                </div>
                <div className="bg-white/5 p-1.5 border border-white/5">
                  <span className="block text-[10px] text-gray-500 font-sans">WIN RATE</span>
                  <span className="text-primary font-bold text-sm">{player.winRate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </SocialLayout>
  );
}
