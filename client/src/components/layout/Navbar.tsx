import { Link, useLocation } from "wouter";
import { Menu, X, Gamepad2, Bell, Plus, User } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { User as UserType } from "@shared/schema";
import { PointsBadge } from "@/components/social/PointsBadge";

export function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const { data: currentUser } = useQuery<UserType>({
    queryKey: ["/api/auth/me"],
  });

  const links = [
    { href: "/feed", label: "FEED" },
    { href: "/explore", label: "EXPLORE" },
    { href: "/tournaments", label: "MATCHES" },
    { href: "/teams", label: "TEAMS" },
    { href: "/players", label: "PLAYERS" },
    { href: "/news", label: "NEWS" },
    { href: "/store", label: "STORE" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 glass-panel border-b border-white/10 bg-black/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-4">
            <Link href="/feed">
              <a className="flex items-center gap-2" data-testid="link-home-logo">
                <Gamepad2 className="h-8 w-8 text-primary" />
                <span className="font-display font-bold text-2xl tracking-widest text-white glitch-effect" data-text="LIMITLESS">LIMITLESS</span>
              </a>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:block">
            <div className="flex items-baseline space-x-6">
              {links.map((link) => (
                <Link key={link.href} href={link.href}>
                  <a
                    data-testid={`link-nav-${link.label.toLowerCase()}`}
                    className={`px-2 py-1 text-xs font-display tracking-widest uppercase transition-all duration-200 ${
                      location === link.href
                        ? "text-primary neon-text border-b-2 border-primary font-bold"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </a>
                </Link>
              ))}
            </div>
          </div>

          {/* Right Action Bar */}
          <div className="hidden md:flex items-center gap-4">
            {currentUser && (
              <PointsBadge points={currentUser.points} levelTitle={currentUser.levelTitle} />
            )}

            <Link href="/notifications">
              <a className="p-2 text-gray-400 hover:text-primary transition-colors relative" title="Notifications">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full animate-ping"></span>
              </a>
            </Link>

            <Link href="/feed">
              <a className="bg-primary text-black font-display font-bold tracking-widest px-4 py-2 uppercase text-xs hover:bg-white transition-colors flex items-center gap-1 neon-border">
                <Plus className="w-4 h-4" /> POST
              </a>
            </Link>

            <Link href={`/profile/${currentUser?.username || "guest_player"}`}>
              <a className="flex items-center gap-2 border border-white/10 p-1 rounded-sm hover:border-primary transition-colors">
                <img
                  src={currentUser?.avatar || "https://api.dicebear.com/7.x/bottts/svg?seed=challenger"}
                  alt="User"
                  className="w-7 h-7 rounded-full object-cover"
                />
              </a>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/5 focus:outline-none"
              data-testid="button-mobile-menu"
            >
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass-panel border-b border-white/10 bg-black/90">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {links.map((link) => (
              <Link key={link.href} href={link.href}>
                <a
                  data-testid={`link-mobile-nav-${link.label.toLowerCase()}`}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 text-sm font-display tracking-widest uppercase ${
                    location === link.href
                      ? "text-primary bg-primary/10 border-l-2 border-primary"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  {link.label}
                </a>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

