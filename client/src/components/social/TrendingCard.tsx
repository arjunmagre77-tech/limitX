import React from "react";
import { Link } from "wouter";
import { TrendingUp, Users, Flame } from "lucide-react";
import { User } from "@shared/schema";
import { VerificationBadge } from "./VerificationBadge";
import { FollowButton } from "./FollowButton";

interface TrendingCardProps {
  hashtags: { tag: string; count: number }[];
}

export function TrendingCard({ hashtags }: TrendingCardProps) {
  return (
    <div className="glass-panel border border-white/10 p-5 mb-6">
      <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-white/10 pb-2">
        <TrendingUp className="w-4 h-4 text-primary" /> ESPORTS TRENDING
      </h3>

      <div className="space-y-3">
        {hashtags.slice(0, 5).map((item, idx) => (
          <Link key={idx} href={`/hashtag/${item.tag}`}>
            <a className="block group p-2 hover:bg-white/5 transition-colors border-l-2 border-transparent hover:border-primary">
              <span className="text-[10px] font-sans text-gray-500 uppercase tracking-wider block">Trending in Free Fire</span>
              <span className="text-sm font-display font-bold text-white group-hover:text-primary transition-colors">
                #{item.tag}
              </span>
              <span className="text-xs font-sans text-gray-400 block mt-0.5">{item.count} community posts</span>
            </a>
          </Link>
        ))}

        {hashtags.length === 0 && (
          <p className="text-xs text-gray-500 font-sans">No trending tags yet.</p>
        )}
      </div>
    </div>
  );
}

interface SuggestedUsersProps {
  users: User[];
}

export function SuggestedUsers({ users }: SuggestedUsersProps) {
  return (
    <div className="glass-panel border border-white/10 p-5">
      <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-white/10 pb-2">
        <Users className="w-4 h-4 text-secondary" /> SUGGESTED GAMERS
      </h3>

      <div className="space-y-3">
        {users.slice(0, 4).map((user) => (
          <div key={user.id} className="flex items-center justify-between gap-2">
            <Link href={`/profile/${user.username}`}>
              <a className="flex items-center gap-2.5 min-w-0 group">
                <img
                  src={user.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${user.username}`}
                  alt={user.displayName}
                  className="w-9 h-9 rounded-full object-cover border border-white/10 group-hover:border-primary transition-colors flex-shrink-0"
                />
                <div className="min-w-0">
                  <span className="font-display font-bold text-xs text-white group-hover:text-primary transition-colors truncate flex items-center">
                    {user.displayName}
                    <VerificationBadge type={user.verificationType} />
                  </span>
                  <span className="text-[10px] text-gray-400 font-sans truncate block">@{user.username}</span>
                </div>
              </a>
            </Link>

            <FollowButton userId={user.id} />
          </div>
        ))}
      </div>
    </div>
  );
}
