import React from "react";
import { useQuery } from "@tanstack/react-query";
import { SocialLayout } from "@/components/social/SocialLayout";
import { PostCard } from "@/components/social/PostCard";
import { PostWithAuthor } from "@shared/schema";
import { Bookmark, Loader2 } from "lucide-react";

export default function Bookmarks() {
  const { data: bookmarks = [], isLoading, refetch } = useQuery<PostWithAuthor[]>({
    queryKey: ["/api/bookmarks"],
  });

  return (
    <SocialLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-black text-white uppercase flex items-center gap-2">
          SAVED <span className="text-secondary">BOOKMARKS</span>
        </h1>
        <span className="text-xs font-display text-gray-400 uppercase">{bookmarks.length} saved</span>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : bookmarks.length > 0 ? (
        <div className="space-y-4">
          {bookmarks.map((post) => (
            <PostCard key={post.id} post={post} onPostUpdated={() => refetch()} />
          ))}
        </div>
      ) : (
        <div className="glass-panel p-12 text-center my-6">
          <Bookmark className="w-10 h-10 text-gray-600 mx-auto mb-3" />
          <h3 className="text-lg font-display font-bold text-white uppercase mb-1">No saved posts</h3>
          <p className="text-gray-400 font-sans text-sm">Save posts you want to revisit by clicking the bookmark icon on any post!</p>
        </div>
      )}
    </SocialLayout>
  );
}
