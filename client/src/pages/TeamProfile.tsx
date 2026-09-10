import React from "react";
import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { SocialLayout } from "@/components/social/SocialLayout";
import { VerificationBadge } from "@/components/social/VerificationBadge";
import { FollowButton } from "@/components/social/FollowButton";
import { Team, Player, PostWithAuthor } from "@shared/schema";
import { Trophy, Users, Shield, Globe, Award, Loader2 } from "lucide-react";
import { PostCard } from "@/components/social/PostCard";

export default function TeamProfile() {
  const [, params] = useRoute("/team/:slug");
  const slug = params?.slug || "limitless-esports";

  const { data: team, isLoading } = useQuery<Team>({
    queryKey: [`/api/teams/${slug}`],
  });

  const { data: players = [] } = useQuery<Player[]>({
    queryKey: ["/api/players"],
  });

  const { data: posts = [] } = useQuery<PostWithAuthor[]>({
    queryKey: ["/api/users/limitlessesports/posts"],
  });

  if (isLoading) {
    return (
      <SocialLayout>
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </SocialLayout>
    );
  }

  if (!team) {
    return (
      <SocialLayout>
        <div className="glass-panel p-12 text-center my-10">
          <h2 className="text-2xl font-display font-bold text-white uppercase mb-2">Team Not Found</h2>
          <Link href="/teams">
            <a className="bg-primary text-black font-display font-bold px-6 py-3 uppercase">View Teams</a>
          </Link>
        </div>
      </SocialLayout>
    );
  }

  return (
    <SocialLayout>
      <div className="glass-panel border border-white/10 overflow-hidden mb-6">
        {/* Cover */}
        <div className="h-48 md:h-64 bg-black/60 relative">
          <img src={team.cover!} alt={team.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
        </div>

        {/* Content */}
        <div className="p-6 relative pt-0">
          <div className="flex justify-between items-end -mt-14 mb-4">
            <img
              src={team.logo!}
              alt={team.name}
              className="w-24 h-24 md:w-28 md:h-28 rounded-sm border-2 border-primary bg-black p-1 object-cover"
            />
            <FollowButton userId="user-org" />
          </div>

          <h1 className="text-3xl font-display font-black text-white uppercase flex items-center gap-2">
            {team.name}
            <VerificationBadge type="org" className="w-6 h-6 inline-block" />
          </h1>
          <p className="text-sm font-sans text-gray-400">@{team.slug}</p>
          <p className="text-gray-300 font-sans mt-3 text-base">{team.bio}</p>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 my-6 text-center">
            <div className="glass-panel p-3 border border-white/10">
              <span className="block text-gray-400 font-sans text-xs uppercase tracking-wider">Championships</span>
              <span className="text-2xl font-display font-bold text-primary flex items-center justify-center gap-1">
                <Trophy className="w-5 h-5" /> {team.championships}
              </span>
            </div>
            <div className="glass-panel p-3 border border-white/10">
              <span className="block text-gray-400 font-sans text-xs uppercase tracking-wider">Game Division</span>
              <span className="text-xl font-display font-bold text-white">{team.game}</span>
            </div>
            <div className="glass-panel p-3 border border-white/10">
              <span className="block text-gray-400 font-sans text-xs uppercase tracking-wider">Followers</span>
              <span className="text-xl font-display font-bold text-secondary">{(team.followersCount || 12400).toLocaleString()}</span>
            </div>
          </div>

          {/* Pro Roster Section */}
          <div className="my-8 border-t border-white/10 pt-6">
            <h3 className="text-lg font-display font-bold text-white uppercase mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" /> ACTIVE PRO ROSTER
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {players.map((player) => (
                <Link key={player.id} href={`/profile/${player.username}`}>
                  <a className="glass-panel p-4 border border-white/10 hover:border-primary/50 transition-colors flex items-center gap-3 group">
                    <img
                      src={player.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${player.username}`}
                      alt={player.displayName}
                      className="w-12 h-12 rounded-full object-cover border border-white/10 group-hover:border-primary"
                    />
                    <div className="flex-grow min-w-0">
                      <h4 className="font-display font-bold text-white text-sm group-hover:text-primary transition-colors flex items-center">
                        {player.displayName}
                        <VerificationBadge type="player" />
                      </h4>
                      <p className="text-xs text-purple-400 font-display uppercase">{player.role}</p>
                      <p className="text-[10px] text-gray-400 font-sans">K/D: {player.kd} • Win Rate: {player.winRate}</p>
                    </div>
                  </a>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Team Posts */}
      <h3 className="text-lg font-display font-bold text-white uppercase mb-4">TEAM UPDATES & ANNOUNCEMENTS</h3>
      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </SocialLayout>
  );
}
