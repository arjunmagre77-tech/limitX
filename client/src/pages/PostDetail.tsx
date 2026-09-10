import React from "react";
import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { SocialLayout } from "@/components/social/SocialLayout";
import { PostCard } from "@/components/social/PostCard";
import { CommentSection } from "@/components/social/CommentSection";
import { PostWithAuthor, Comment, User } from "@shared/schema";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function PostDetail() {
  const [, params] = useRoute("/post/:id");
  const postId = params?.id;

  const { data: post, isLoading: isPostLoading, refetch } = useQuery<PostWithAuthor>({
    queryKey: [`/api/posts/${postId}`],
    enabled: !!postId,
  });

  const { data: comments = [], refetch: refetchComments } = useQuery<(Comment & { author: User })[]>({
    queryKey: [`/api/posts/${postId}/comments`],
    enabled: !!postId,
  });

  if (isPostLoading) {
    return (
      <SocialLayout>
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </SocialLayout>
    );
  }

  if (!post) {
    return (
      <SocialLayout>
        <div className="glass-panel p-12 text-center my-10">
          <h2 className="text-2xl font-display font-bold text-white uppercase mb-2">Post Not Found</h2>
          <Link href="/feed">
            <a className="bg-primary text-black font-display font-bold px-6 py-3 uppercase">Back to Feed</a>
          </Link>
        </div>
      </SocialLayout>
    );
  }

  return (
    <SocialLayout>
      <div className="flex items-center gap-3 mb-4">
        <Link href="/feed">
          <a className="p-2 text-gray-400 hover:text-white glass-panel border border-white/10">
            <ArrowLeft className="w-4 h-4" />
          </a>
        </Link>
        <h1 className="text-xl font-display font-bold text-white uppercase">ESPORTS POST</h1>
      </div>

      <PostCard post={post} onPostUpdated={() => refetch()} />

      <div className="glass-panel border border-white/10 p-5 mt-4">
        <h3 className="text-sm font-display font-bold text-white uppercase mb-4 border-b border-white/10 pb-2">
          REPLIES & DISCUSSION ({comments.length})
        </h3>

        <CommentSection
          postId={post.id}
          comments={comments}
          onCommentAdded={() => {
            refetchComments();
            refetch();
          }}
        />
      </div>
    </SocialLayout>
  );
}
