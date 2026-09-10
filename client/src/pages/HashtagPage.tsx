import React from "react";
import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { SocialLayout } from "@/components/social/SocialLayout";
import { PostCard } from "@/components/social/PostCard";
import { PostWithAuthor } from "@shared/schema";
import { Hash, ArrowLeft, Loader2 } from "lucide-react";

export default function HashtagPage() {
  const [, params] = useRoute("/hashtag/:tag");
  const tag = params?.tag || "FreeFire";

  const { data: posts = [], isLoading } = useQuery<PostWithAuthor[]>({
    queryKey: [`/api/hashtags/${tag}`],
  });

  return (
    <SocialLayout>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/explore">
          <a className="p-2 text-gray-400 hover:text-white glass-panel border border-white/10">
            <ArrowLeft className="w-4 h-4" />
          </a>
        </Link>
        <div>
          <h1 className="text-2xl font-display font-black text-white uppercase flex items-center gap-1">
            <Hash className="w-6 h-6 text-primary" /> {tag}
          </h1>
          <p className="text-xs text-gray-400 font-sans">{posts.length} posts about #{tag}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="glass-panel p-12 text-center my-6">
          <p className="text-gray-400 font-sans text-sm">No posts tagged with #{tag} yet.</p>
        </div>
      )}
    </SocialLayout>
  );
}
