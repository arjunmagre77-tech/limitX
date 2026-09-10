import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SocialLayout } from "@/components/social/SocialLayout";
import { PostCard } from "@/components/social/PostCard";
import { TrendingCard, SuggestedUsers } from "@/components/social/TrendingCard";
import { Search, Flame, Trophy, Users, Gamepad2, Loader2 } from "lucide-react";
import { User, Team, Player, PostWithAuthor } from "@shared/schema";
import { Link } from "wouter";

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: exploreData, isLoading: isExploreLoading } = useQuery<{
    tags: { tag: string; count: number }[];
    suggestedUsers: User[];
    teams: Team[];
    players: Player[];
  }>({
    queryKey: ["/api/explore"],
  });

  const { data: searchResults, isLoading: isSearching } = useQuery<{
    users: User[];
    posts: PostWithAuthor[];
    teams: Team[];
    players: Player[];
  }>({
    queryKey: ["/api/search", searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) return { users: [], posts: [], teams: [], players: [] };
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery.trim())}`);
      return res.json();
    },
    enabled: searchQuery.trim().length > 0,
  });

  return (
    <SocialLayout>
      {/* Search Input Bar */}
      <div className="relative mb-6">
        <Search className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search gamers, teams, posts, or #hashtags..."
          className="w-full bg-white/5 border border-white/10 pl-12 pr-4 py-3 text-white font-sans placeholder-gray-500 focus:outline-none focus:border-primary text-sm glass-panel"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-4 top-3 text-xs text-gray-400 hover:text-white"
          >
            Clear
          </button>
        )}
      </div>

      {/* If Searching */}
      {searchQuery.trim() ? (
        <div className="space-y-6">
          <h2 className="text-xl font-display font-bold text-white uppercase">Search Results for "{searchQuery}"</h2>

          {isSearching ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Matching Posts */}
              {searchResults?.posts && searchResults.posts.length > 0 && (
                <div>
                  <h3 className="text-sm font-display text-primary uppercase font-bold mb-3">Posts</h3>
                  <div className="space-y-4">
                    {searchResults.posts.map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </div>
                </div>
              )}

              {/* Matching Users */}
              {searchResults?.users && searchResults.users.length > 0 && (
                <div>
                  <h3 className="text-sm font-display text-secondary uppercase font-bold mb-3">Gamers & Accounts</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {searchResults.users.map((u) => (
                      <Link key={u.id} href={`/profile/${u.username}`}>
                        <a className="glass-panel p-3 border border-white/10 flex items-center gap-3 hover:border-primary">
                          <img src={u.avatar!} alt={u.displayName} className="w-10 h-10 rounded-full object-cover" />
                          <div>
                            <h4 className="font-display font-bold text-white text-sm">{u.displayName}</h4>
                            <p className="text-xs text-gray-400 font-sans">@{u.username}</p>
                          </div>
                        </a>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {searchResults?.posts.length === 0 && searchResults?.users.length === 0 && (
                <div className="glass-panel p-8 text-center">
                  <p className="text-gray-400 font-sans text-sm">No results found for "{searchQuery}". Try searching for #FreeFire, @viper, or Limitless.</p>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Default Explore Feed */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-display font-black text-white uppercase flex items-center gap-2">
              DISCOVER <span className="text-primary">ESPORTS</span>
            </h1>
          </div>

          <TrendingCard hashtags={exploreData?.tags || []} />
          <SuggestedUsers users={exploreData?.suggestedUsers || []} />

          {/* Featured Tournaments Widget */}
          <div className="glass-panel border border-primary/30 p-5">
            <h3 className="text-sm font-display font-bold text-white uppercase mb-3 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-primary" /> FEATURED COMMUNITY CIRCUIT
            </h3>
            <div className="flex justify-between items-center border-t border-white/10 pt-3">
              <div>
                <h4 className="font-display font-bold text-white text-base">Limitless FF Clash #48</h4>
                <p className="text-xs font-sans text-gray-400">Prize: $1,000 • Mode: Squad (4v4)</p>
              </div>
              <Link href="/tournaments">
                <a className="bg-primary/20 text-primary border border-primary font-display font-bold text-xs px-4 py-2 uppercase hover:bg-primary hover:text-black">
                  Register
                </a>
              </Link>
            </div>
          </div>
        </div>
      )}
    </SocialLayout>
  );
}
