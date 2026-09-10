import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SocialLayout } from "@/components/social/SocialLayout";
import { FeedTabs } from "@/components/social/FeedTabs";
import { PostComposer } from "@/components/social/PostComposer";
import { PostCard } from "@/components/social/PostCard";
import { PostWithAuthor } from "@shared/schema";
import { Loader2, RefreshCw } from "lucide-react";

export default function Feed() {
  const [activeTab, setActiveTab] = useState("for-you");

  const { data: posts = [], isLoading, refetch, isRefetching } = useQuery<PostWithAuthor[]>({
    queryKey: ["/api/feed", activeTab],
    queryFn: async () => {
      const res = await fetch(`/api/feed?tab=${activeTab}`);
      if (!res.ok) throw new Error("Failed to fetch feed");
      return res.json();
    },
  });

  return (
    <SocialLayout activeTab="feed">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-2">
        <h1 className="text-2xl font-display font-black text-white uppercase flex items-center gap-2">
          COMMUNITY <span className="text-primary neon-text">FEED</span>
        </h1>

        <button
          onClick={() => refetch()}
          disabled={isRefetching}
          className="text-gray-400 hover:text-primary p-2 transition-colors"
          title="Refresh Feed"
        >
          <RefreshCw className={`w-4 h-4 ${isRefetching ? 'animate-spin text-primary' : ''}`} />
        </button>
      </div>

      {/* Tabs */}
      <FeedTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Post Composer */}
      <PostComposer onPostCreated={() => refetch()} />

      {/* Feed Posts Stream */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-xs font-display text-gray-400 uppercase tracking-widest">Loading esports feed...</p>
        </div>
      ) : posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onPostUpdated={() => refetch()} />
          ))}
        </div>
      ) : (
        <div className="glass-panel border border-white/10 p-12 text-center my-6">
          <h3 className="text-lg font-display font-bold text-white uppercase mb-2">Your feed is quiet</h3>
          <p className="text-gray-400 font-sans text-sm mb-6 max-w-md mx-auto">
            {activeTab === 'following'
              ? "You aren't following anyone yet. Explore suggested players and teams to see their posts!"
              : "No posts found in this tab. Be the first to share an esports update or match scorecard!"}
          </p>
        </div>
      )}
    </SocialLayout>
  );
}
