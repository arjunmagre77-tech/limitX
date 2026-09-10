import React from "react";
import { Link } from "wouter";
import { Heart, MessageSquare, Repeat2, UserPlus, Trophy } from "lucide-react";
import { Notification, User, Post } from "@shared/schema";
import { VerificationBadge } from "./VerificationBadge";

interface NotificationItemProps {
  notification: Notification & { sender: User; post?: Post };
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const getIcon = () => {
    switch (notification.type) {
      case "like":
        return <Heart className="w-4 h-4 text-red-500 fill-current" />;
      case "comment":
        return <MessageSquare className="w-4 h-4 text-primary" />;
      case "repost":
        return <Repeat2 className="w-4 h-4 text-secondary" />;
      case "follow":
        return <UserPlus className="w-4 h-4 text-blue-400" />;
      case "tournament":
        return <Trophy className="w-4 h-4 text-amber-400" />;
      default:
        return <Heart className="w-4 h-4 text-primary" />;
    }
  };

  const getActionText = () => {
    switch (notification.type) {
      case "like":
        return "liked your post";
      case "comment":
        return "replied to your post";
      case "repost":
        return "reposted your post";
      case "follow":
        return "started following you";
      case "tournament":
        return "announced a new tournament match";
      default:
        return "interacted with you";
    }
  };

  return (
    <div className={`p-4 border-b border-white/10 glass-panel flex items-start gap-3 transition-colors ${!notification.read ? 'bg-primary/5 border-l-2 border-l-primary' : ''}`}>
      <div className="mt-1">{getIcon()}</div>

      <div className="flex-grow min-w-0">
        <div className="flex items-center gap-2">
          <Link href={`/profile/${notification.sender.username}`}>
            <a className="flex items-center gap-1.5 font-display font-bold text-sm text-white hover:text-primary transition-colors">
              <img
                src={notification.sender.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${notification.sender.username}`}
                alt={notification.sender.displayName}
                className="w-6 h-6 rounded-full object-cover"
              />
              {notification.sender.displayName}
              <VerificationBadge type={notification.sender.verificationType} />
            </a>
          </Link>
          <span className="text-xs text-gray-400 font-sans">{getActionText()}</span>
        </div>

        {notification.post && (
          <Link href={`/post/${notification.post.id}`}>
            <a className="block mt-1 text-xs text-gray-400 font-sans bg-white/5 p-2 rounded-sm border border-white/5 line-clamp-2 hover:border-primary/40">
              "{notification.post.content}"
            </a>
          </Link>
        )}
      </div>
    </div>
  );
}
