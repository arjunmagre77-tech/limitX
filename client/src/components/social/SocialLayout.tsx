import React from "react";
import { Link, useLocation } from "wouter";
import {
  Home,
  Compass,
  Trophy,
  Users,
  Gamepad2,
  Newspaper,
  Bookmark,
  Bell,
  MessageSquare,
  ShoppingBag,
  User as UserIcon,
  Flame,
  Plus
} from "lucide-react";
import { TrendingCard, SuggestedUsers } from "./TrendingCard";
import { StreakCard, PointsBadge } from "./PointsBadge";
import { MobileBottomNav } from "./MobileBottomNav";
import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";

interface SocialLayoutProps {
  children: React.ReactNode;
  activeTab?: string;
  hideSidebar?: boolean;
}

export function SocialLayout({ children, hideSidebar = false }: SocialLayoutProps) {
  const [location] = useLocation();

  const { data: currentUser } = useQuery<User>({
    queryKey: ["/api/auth/me"],
  });

  const { data: exploreData } = useQuery<{
    tags: { tag: string; count: number }[];
    suggestedUsers: User[];
  }>({
    queryKey: ["/api/explore"],
  });

  const navLinks = [
    { href: "/feed", label: "HOME", icon: Home },
    { href: "/explore", label: "EXPLORE", icon: Compass },
    { href: "/tournaments", label: "MATCHES", icon: Trophy },
    { href: "/teams", label: "TEAMS", icon: Users },
    { href: "/players", label: "PLAYERS", icon: Gamepad2 },
    { href: "/news", label: "NEWS", icon: Newspaper },
    { href: "/bookmarks", label: "BOOKMARKS", icon: Bookmark },
    { href: "/notifications", label: "ALERTS", icon: Bell },
    { href: "/messages", label: "MESSAGES", icon: MessageSquare },
    { href: "/store", label: "STORE", icon: ShoppingBag },
    { href: `/profile/${currentUser?.username || "guest_player"}`, label: "PROFILE", icon: UserIcon },
  ];

  return (
    <div className="min-h-screen bg-background pt-20 pb-20 md:pb-12 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-6">

          {/* Left Column Navigation (Desktop & Tablet) */}
          <aside className="hidden md:block md:col-span-1 lg:col-span-3 sticky top-24 h-[calc(100vh-100px)] overflow-y-auto hide-scrollbar">
            <div className="glass-panel border border-white/10 p-4 space-y-4">
              {currentUser && (
                <div className="border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <img
                      src={currentUser.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${currentUser.username}`}
                      alt={currentUser.displayName}
                      className="w-10 h-10 rounded-full border border-primary object-cover"
                    />
                    <div className="min-w-0">
                      <h4 className="font-display font-bold text-sm text-white truncate">{currentUser.displayName}</h4>
                      <p className="text-xs text-gray-400 font-sans truncate">@{currentUser.username}</p>
                    </div>
                  </div>
                  <PointsBadge points={currentUser.points} levelTitle={currentUser.levelTitle} className="w-full justify-center" />
                </div>
              )}

              <nav className="space-y-1 font-display tracking-widest text-xs uppercase">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = location === link.href;
                  return (
                    <Link key={link.href} href={link.href}>
                      <a
                        className={`flex items-center gap-3 px-3 py-2.5 transition-all ${
                          isActive
                            ? "text-primary bg-primary/10 border-l-2 border-primary font-bold neon-text"
                            : "text-gray-400 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{link.label}</span>
                      </a>
                    </Link>
                  );
                })}
              </nav>

              <div className="pt-2">
                <Link href="/feed">
                  <a className="w-full bg-primary text-black font-display font-bold uppercase tracking-widest text-xs py-3 text-center block hover:bg-white transition-colors neon-border">
                    <Plus className="w-4 h-4 inline-block mr-1" /> CREATE POST
                  </a>
                </Link>
              </div>
            </div>
          </aside>

          {/* Center Main Feed Column */}
          <main className={`col-span-1 ${hideSidebar ? 'md:col-span-3 lg:col-span-9' : 'md:col-span-3 lg:col-span-6'}`}>
            {children}
          </main>

          {/* Right Column Widgets (Desktop only) */}
          {!hideSidebar && (
            <aside className="hidden lg:block lg:col-span-3 sticky top-24 h-[calc(100vh-100px)] overflow-y-auto hide-scrollbar space-y-6">
              <StreakCard streakDays={currentUser?.streakDays || 14} />
              <TrendingCard hashtags={exploreData?.tags || []} />
              <SuggestedUsers users={exploreData?.suggestedUsers || []} />
            </aside>
          )}

        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}
