import React, { useState } from "react";
import { Link } from "wouter";
import { Heart, MessageSquare, Repeat2, Bookmark, Share2, MoreHorizontal } from "lucide-react";
import { PostWithAuthor, PollData, MatchResultData } from "@shared/schema";
import { VerificationBadge } from "./VerificationBadge";
import { MatchResultCard } from "./MatchResultCard";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface PostCardProps {
  post: PostWithAuthor;
  onPostUpdated?: () => void;
}

export function PostCard({ post }: PostCardProps) {
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [isReposted, setIsReposted] = useState(post.isReposted || false);
  const [repostsCount, setRepostsCount] = useState(post.repostsCount || 0);
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked || false);
  const [poll, setPoll] = useState<PollData | null | undefined>(post.poll);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const prevLiked = isLiked;
    const prevCount = likesCount;

    setIsLiked(!prevLiked);
    setLikesCount(prevLiked ? prevCount - 1 : prevCount + 1);

    try {
      const res = await apiRequest("POST", `/api/posts/${post.id}/like`);
      const data = await res.json();
      setIsLiked(data.isLiked);
      setLikesCount(data.likesCount);
    } catch {
      setIsLiked(prevLiked);
      setLikesCount(prevCount);
    }
  };

  const handleRepost = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const prevReposted = isReposted;
    const prevCount = repostsCount;

    setIsReposted(!prevReposted);
    setRepostsCount(prevReposted ? prevCount - 1 : prevCount + 1);

    try {
      const res = await apiRequest("POST", `/api/posts/${post.id}/repost`);
      const data = await res.json();
      setIsReposted(data.isReposted);
      setRepostsCount(data.repostsCount);
    } catch {
      setIsReposted(prevReposted);
      setRepostsCount(prevCount);
    }
  };

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const prevBookmarked = isBookmarked;
    setIsBookmarked(!prevBookmarked);

    try {
      const res = await apiRequest("POST", `/api/posts/${post.id}/bookmark`);
      const data = await res.json();
      setIsBookmarked(data.isBookmarked);
      toast({
        title: data.isBookmarked ? "Post Saved" : "Bookmark Removed",
        description: data.isBookmarked ? "Saved to your bookmarks tab." : "Removed from your bookmarks.",
      });
    } catch {
      setIsBookmarked(prevBookmarked);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard?.writeText(window.location.origin + `/post/${post.id}`);
    toast({
      title: "Link Copied!",
      description: "Post link copied to clipboard.",
    });
  };

  const handleVotePoll = (index: number) => {
    if (!poll || poll.userVotedIndex !== undefined) return;
    const updatedOptions = [...poll.options];
    updatedOptions[index].votes += 1;
    setPoll({
      ...poll,
      options: updatedOptions,
      totalVotes: poll.totalVotes + 1,
      userVotedIndex: index,
    });
  };

  const formatTimestamp = (dateStr?: string | null) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 3600));
    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const renderFormattedContent = (content: string) => {
    const parts = content.split(/(\s+)/);
    return parts.map((part, idx) => {
      if (part.startsWith("#")) {
        const tag = part.substring(1).replace(/[^\w]/g, "");
        return (
          <Link key={idx} href={`/hashtag/${tag}`}>
            <a onClick={e => e.stopPropagation()} className="text-primary hover:underline font-semibold">
              {part}
            </a>
          </Link>
        );
      } else if (part.startsWith("@")) {
        const username = part.substring(1).replace(/[^\w]/g, "");
        return (
          <Link key={idx} href={`/profile/${username}`}>
            <a onClick={e => e.stopPropagation()} className="text-secondary hover:underline font-semibold">
              {part}
            </a>
          </Link>
        );
      }
      return part;
    });
  };

  return (
    <article className="glass-panel border border-white/10 p-5 hover:border-white/20 transition-all duration-200">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <Link href={`/profile/${post.author.username}`}>
          <a className="flex-shrink-0">
            <img
              src={post.author.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${post.author.username}`}
              alt={post.author.displayName}
              className="w-11 h-11 rounded-full object-cover border border-white/10 hover:border-primary transition-colors"
            />
          </a>
        </Link>

        {/* Content Container */}
        <div className="flex-grow min-w-0">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
              <Link href={`/profile/${post.author.username}`}>
                <a className="font-display font-bold text-white hover:text-primary transition-colors truncate flex items-center">
                  {post.author.displayName}
                  <VerificationBadge type={post.author.verificationType} />
                </a>
              </Link>
              <span className="text-gray-400 text-xs font-sans">@{post.author.username}</span>
              <span className="text-gray-600 text-xs">•</span>
              <span className="text-gray-400 text-xs font-sans">{formatTimestamp(post.createdAt)}</span>

              {post.authorPlayer && (
                <span className="ml-1 text-[10px] font-display text-purple-400 bg-purple-500/10 border border-purple-500/30 px-1.5 py-0.2 uppercase">
                  {post.authorPlayer.role}
                </span>
              )}
            </div>

            <button className="text-gray-400 hover:text-white p-1 rounded-sm">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Post Text */}
          <Link href={`/post/${post.id}`}>
            <a className="block mt-2 text-gray-200 font-sans text-base leading-relaxed break-words">
              {renderFormattedContent(post.content)}
            </a>
          </Link>

          {/* Media Attachments */}
          {post.mediaUrls && post.mediaUrls.length > 0 && (
            <div className="mt-3 rounded-sm overflow-hidden border border-white/10">
              <img
                src={post.mediaUrls[0]}
                alt="Post Media"
                className="w-full max-h-96 object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}

          {/* Match Result Embed */}
          {post.matchResult && <MatchResultCard data={post.matchResult as MatchResultData} />}

          {/* Interactive Poll */}
          {poll && (
            <div className="my-3 glass-panel border border-white/10 p-3 space-y-2">
              <p className="text-xs font-display font-bold text-white mb-2 uppercase">{poll.question}</p>
              {poll.options.map((opt: { id: number; text: string; votes: number }, idx: number) => {
                const percent = poll.totalVotes > 0 ? Math.round((opt.votes / poll.totalVotes) * 100) : 0;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleVotePoll(idx)}
                    disabled={poll.userVotedIndex !== undefined}
                    className="w-full relative overflow-hidden text-left p-2 border border-white/10 bg-white/5 hover:border-primary/50 transition-colors text-xs font-sans flex justify-between items-center"
                  >
                    <div
                      className="absolute inset-y-0 left-0 bg-primary/20 transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    ></div>
                    <span className="relative z-10 text-white font-medium">{opt.text}</span>
                    <span className="relative z-10 text-gray-400 font-display font-bold">{percent}%</span>
                  </button>
                );
              })}
              <p className="text-[10px] text-gray-500 font-sans text-right">{poll.totalVotes} total votes</p>
            </div>
          )}

          {/* Action Bar */}
          <div className="flex items-center justify-between mt-4 border-t border-white/5 pt-3 text-gray-400">
            {/* Comment */}
            <Link href={`/post/${post.id}`}>
              <a className="flex items-center gap-1.5 hover:text-primary text-xs font-display tracking-widest transition-colors">
                <MessageSquare className="w-4 h-4" />
                <span>{post.commentsCount || 0}</span>
              </a>
            </Link>

            {/* Repost */}
            <button
              onClick={handleRepost}
              className={`flex items-center gap-1.5 text-xs font-display tracking-widest transition-colors ${
                isReposted ? "text-primary font-bold" : "hover:text-primary"
              }`}
            >
              <Repeat2 className="w-4 h-4" />
              <span>{repostsCount}</span>
            </button>

            {/* Like */}
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 text-xs font-display tracking-widest transition-colors ${
                isLiked ? "text-red-500 font-bold" : "hover:text-red-500"
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
              <span>{likesCount}</span>
            </button>

            {/* Bookmark */}
            <button
              onClick={handleBookmark}
              className={`flex items-center gap-1.5 text-xs font-display tracking-widest transition-colors ${
                isBookmarked ? "text-secondary font-bold" : "hover:text-secondary"
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
            </button>

            {/* Share */}
            <button onClick={handleShare} className="hover:text-white transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
