import React, { useState } from "react";
import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { SocialLayout } from "@/components/social/SocialLayout";
import { VerificationBadge } from "@/components/social/VerificationBadge";
import { FollowButton } from "@/components/social/FollowButton";
import { PostCard } from "@/components/social/PostCard";
import { PointsBadge, StreakCard } from "@/components/social/PointsBadge";
import { User, PostWithAuthor, Player } from "@shared/schema";
import { Trophy, Crosshair, Target, Calendar, MapPin, Loader2 } from "lucide-react";

export default function Profile() {
  const [, params] = useRoute("/profile/:username");
  const username = params?.username || "guest_player";
  const [activeTab, setActiveTab] = useState("posts");

  const { data: user, isLoading: isUserLoading } = useQuery<User & { isFollowing?: boolean }>({
    queryKey: [`/api/users/${username}`],
  });

  const { data: player } = useQuery<Player>({
    queryKey: [`/api/players/${username}`],
    enabled: !!user,
  });

  const { data: userPosts = [], isLoading: isPostsLoading, refetch } = useQuery<PostWithAuthor[]>({
    queryKey: [`/api/users/${username}/posts`],
    enabled: !!user,
  });

  if (isUserLoading) {
    return (
      <SocialLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-xs font-display text-gray-400 mt-2 uppercase tracking-widest">Loading profile...</p>
        </div>
      </SocialLayout>
    );
  }

  if (!user) {
    return (
      <SocialLayout>
        <div className="glass-panel p-12 text-center my-10">
          <h2 className="text-2xl font-display font-bold text-white uppercase mb-2">Gamer Not Found</h2>
          <p className="text-gray-400 font-sans mb-6">The user @{username} does not exist or has moved.</p>
          <Link href="/feed">
            <a className="bg-primary text-black font-display font-bold px-6 py-3 uppercase">Back to Feed</a>
          </Link>
        </div>
      </SocialLayout>
    );
  }

  return (
    <SocialLayout>
      <div className="glass-panel border border-white/10 overflow-hidden mb-6">
        {/* Cover Photo */}
        <div className="h-44 md:h-56 bg-black/60 relative">
          <img
            src={user.coverImage || "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80"}
            alt="Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
        </div>

        {/* Profile Header Bar */}
        <div className="p-6 relative pt-0">
          <div className="flex flex-wrap justify-between items-end gap-4 -mt-16 mb-4">
            <div className="relative">
              <img
                src={user.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${user.username}`}
                alt={user.displayName}
                className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-background object-cover bg-background shadow-xl"
              />
            </div>

            <div className="flex items-center gap-3">
              <FollowButton userId={user.id} initialFollowing={user.isFollowing} />
            </div>
          </div>

          {/* Identity & Bio */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-display font-black text-white uppercase flex items-center gap-2">
              {user.displayName}
              <VerificationBadge type={user.verificationType} className="w-5 h-5 inline-block" />
            </h1>
            <p className="text-sm font-sans text-gray-400">@{user.username}</p>

            <p className="text-gray-200 font-sans mt-3 text-base leading-relaxed max-w-2xl">{user.bio}</p>

            <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-400 font-sans">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-primary" /> Joined {user.createdAt ? new Date(user.createdAt).getFullYear() : '2024'}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-secondary" /> Global Region
              </span>
            </div>

            <div className="mt-4 flex items-center gap-4">
              <PointsBadge points={user.points} levelTitle={user.levelTitle} />
              <span className="text-xs font-display text-orange-400 uppercase font-bold">🔥 {user.streakDays} Day Streak</span>
            </div>
          </div>

          {/* Esports Stats Card (if player) */}
          {player && (
            <div className="glass-panel border border-primary/40 p-4 my-6 bg-black/40">
              <div className="flex justify-between items-center mb-3 border-b border-white/10 pb-2">
                <span className="text-xs font-display text-primary uppercase font-bold flex items-center gap-1.5">
                  <Trophy className="w-4 h-4" /> PRO PLAYER STATS — {player.role}
                </span>
                <span className="text-xs font-sans text-secondary font-bold">{player.teamName}</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                <div className="bg-white/5 p-2 border border-white/5">
                  <span className="block text-[10px] text-gray-400 uppercase tracking-wider font-sans">K/D Ratio</span>
                  <span className="text-xl font-display font-bold text-white">{player.kd}</span>
                </div>
                <div className="bg-white/5 p-2 border border-white/5">
                  <span className="block text-[10px] text-gray-400 uppercase tracking-wider font-sans">Win Rate</span>
                  <span className="text-xl font-display font-bold text-primary">{player.winRate}</span>
                </div>
                <div className="bg-white/5 p-2 border border-white/5">
                  <span className="block text-[10px] text-gray-400 uppercase tracking-wider font-sans">Matches</span>
                  <span className="text-xl font-display font-bold text-white">{player.matches}</span>
                </div>
                <div className="bg-white/5 p-2 border border-white/5">
                  <span className="block text-[10px] text-gray-400 uppercase tracking-wider font-sans">Total Kills</span>
                  <span className="text-xl font-display font-bold text-secondary">{player.kills}</span>
                </div>
              </div>
            </div>
          )}

          {/* Followers / Following Counters */}
          <div className="flex gap-6 border-t border-white/10 pt-4 text-sm font-sans">
            <div>
              <span className="font-display font-bold text-white mr-1">1.2K</span>
              <span className="text-gray-400 text-xs uppercase tracking-wider font-display">Following</span>
            </div>
            <div>
              <span className="font-display font-bold text-white mr-1">14.8K</span>
              <span className="text-gray-400 text-xs uppercase tracking-wider font-display">Followers</span>
            </div>
          </div>
        </div>

        {/* Profile Feed Tabs */}
        <div className="flex border-t border-white/10 bg-black/40">
          {["posts", "replies", "media", "likes"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-xs font-display tracking-widest uppercase font-bold border-b-2 transition-all ${
                activeTab === tab
                  ? "text-primary border-primary neon-text bg-primary/5"
                  : "text-gray-400 border-transparent hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* User Posts List */}
      {isPostsLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </div>
      ) : userPosts.length > 0 ? (
        <div className="space-y-4">
          {userPosts.map((post) => (
            <PostCard key={post.id} post={post} onPostUpdated={() => refetch()} />
          ))}
        </div>
      ) : (
        <div className="glass-panel p-8 text-center my-4">
          <p className="text-sm font-sans text-gray-400">No posts in this section yet.</p>
        </div>
      )}
    </SocialLayout>
  );
}
