import React, { useState } from "react";
import { UserPlus, UserCheck } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface FollowButtonProps {
  userId: string;
  initialFollowing?: boolean;
  onToggle?: (isFollowing: boolean) => void;
  className?: string;
}

export function FollowButton({ userId, initialFollowing = false, onToggle, className = "" }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLoading) return;

    const nextState = !isFollowing;
    setIsFollowing(nextState);
    setIsLoading(true);

    try {
      const res = await apiRequest("POST", `/api/users/${userId}/follow`);
      const data = await res.json();
      setIsFollowing(data.isFollowing);
      if (onToggle) onToggle(data.isFollowing);
    } catch {
      setIsFollowing(!nextState);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`font-display tracking-widest text-xs uppercase font-bold py-1.5 px-4 transition-all duration-200 flex items-center justify-center gap-1.5 ${
        isFollowing
          ? "border border-white/20 text-gray-300 bg-white/5 hover:border-red-500 hover:text-red-500"
          : "bg-primary text-black hover:bg-white hover:text-black border border-primary neon-border"
      } ${className}`}
    >
      {isFollowing ? (
        <>
          <UserCheck className="w-3.5 h-3.5" /> Following
        </>
      ) : (
        <>
          <UserPlus className="w-3.5 h-3.5" /> Follow
        </>
      )}
    </button>
  );
}
