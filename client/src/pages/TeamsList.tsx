import React from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { SocialLayout } from "@/components/social/SocialLayout";
import { VerificationBadge } from "@/components/social/VerificationBadge";
import { FollowButton } from "@/components/social/FollowButton";
import { Team } from "@shared/schema";
import { Shield, Trophy, Users, Loader2 } from "lucide-react";

export default function TeamsList() {
  const { data: teams = [], isLoading } = useQuery<Team[]>({
    queryKey: ["/api/teams"],
  });

  return (
    <SocialLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-display font-black text-white uppercase mb-2 flex items-center gap-2">
          COMPETITIVE <span className="text-primary">TEAMS</span>
        </h1>
        <p className="text-gray-400 font-sans text-sm">Discover professional organizations and community squads on Limitless Social.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teams.map((team) => (
            <div key={team.id} className="glass-panel border border-white/10 p-5 hover:border-primary/50 transition-all flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <img
                    src={team.logo!}
                    alt={team.name}
                    className="w-14 h-14 rounded-sm border border-primary p-0.5 object-cover"
                  />
                  <FollowButton userId="user-org" />
                </div>

                <Link href={`/team/${team.slug}`}>
                  <a className="font-display font-bold text-xl text-white hover:text-primary transition-colors uppercase flex items-center gap-1.5">
                    {team.name}
                    <VerificationBadge type="org" />
                  </a>
                </Link>
                <span className="text-xs font-sans text-gray-500 block mb-3">@{team.slug}</span>
                <p className="text-sm font-sans text-gray-300 line-clamp-2 mb-4">{team.bio}</p>
              </div>

              <div className="border-t border-white/10 pt-3 flex justify-between items-center text-xs font-display text-gray-400">
                <span className="flex items-center gap-1 text-primary"><Trophy className="w-4 h-4" /> {team.championships} Titles</span>
                <span className="flex items-center gap-1 text-secondary"><Users className="w-4 h-4" /> {(team.followersCount || 12400).toLocaleString()} Followers</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </SocialLayout>
  );
}
