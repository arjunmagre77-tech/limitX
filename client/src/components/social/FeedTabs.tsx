import React from "react";
import { Sparkles, Users, TrendingUp } from "lucide-react";

interface FeedTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function FeedTabs({ activeTab, onTabChange }: FeedTabsProps) {
  const tabs = [
    { id: "for-you", label: "For You", icon: Sparkles },
    { id: "following", label: "Following", icon: Users },
    { id: "trending", label: "Trending", icon: TrendingUp },
  ];

  return (
    <div className="flex border-b border-white/10 mb-6 bg-black/40 backdrop-blur-md sticky top-20 z-30">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 py-3 text-xs font-display tracking-widest uppercase font-bold flex items-center justify-center gap-2 border-b-2 transition-all ${
              isActive
                ? "text-primary border-primary neon-text bg-primary/5"
                : "text-gray-400 border-transparent hover:text-white hover:bg-white/5"
            }`}
          >
            <Icon className="w-4 h-4" />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
