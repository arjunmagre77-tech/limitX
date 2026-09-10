import React, { useState } from "react";
import { Link } from "wouter";
import { Send } from "lucide-react";
import { Comment, User } from "@shared/schema";
import { VerificationBadge } from "./VerificationBadge";
import { apiRequest } from "@/lib/queryClient";

interface CommentWithAuthor extends Comment {
  author: User;
}

interface CommentSectionProps {
  postId: string;
  comments: CommentWithAuthor[];
  onCommentAdded?: () => void;
}

export function CommentSection({ postId, comments, onCommentAdded }: CommentSectionProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await apiRequest("POST", `/api/posts/${postId}/comments`, { content: content.trim() });
      setContent("");
      if (onCommentAdded) onCommentAdded();
    } catch (err) {
      console.error("Failed to add comment", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Comment Input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Post your reply..."
          className="flex-grow bg-white/5 border border-white/10 px-3 py-2 text-sm text-white font-sans placeholder-gray-500 focus:outline-none focus:border-primary"
        />
        <button
          type="submit"
          disabled={!content.trim() || isSubmitting}
          className="bg-primary/20 text-primary border border-primary font-display uppercase tracking-widest text-xs px-4 py-2 hover:bg-primary hover:text-black transition-colors disabled:opacity-40"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* Comment List */}
      <div className="space-y-3">
        {comments.map((comment) => (
          <div key={comment.id} className="flex items-start gap-3 p-3 bg-white/5 border border-white/5">
            <Link href={`/profile/${comment.author.username}`}>
              <a>
                <img
                  src={comment.author.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${comment.author.username}`}
                  alt={comment.author.displayName}
                  className="w-8 h-8 rounded-full object-cover border border-white/10"
                />
              </a>
            </Link>
            <div className="flex-grow min-w-0">
              <div className="flex items-center gap-1.5">
                <Link href={`/profile/${comment.author.username}`}>
                  <a className="font-display font-bold text-xs text-white hover:text-primary transition-colors flex items-center">
                    {comment.author.displayName}
                    <VerificationBadge type={comment.author.verificationType} />
                  </a>
                </Link>
                <span className="text-[10px] text-gray-500 font-sans">@{comment.author.username}</span>
              </div>
              <p className="text-sm text-gray-300 font-sans mt-1">{comment.content}</p>
            </div>
          </div>
        ))}

        {comments.length === 0 && (
          <p className="text-xs text-gray-500 font-sans text-center py-2">No replies yet. Be the first to reply!</p>
        )}
      </div>
    </div>
  );
}
