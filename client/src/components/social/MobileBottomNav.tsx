import React from "react";
import { Link, useLocation } from "wouter";
import { Home, Compass, PlusSquare, Bell, User } from "lucide-react";

export function MobileBottomNav() {
  const [location] = useLocation();

  const navItems = [
    { href: "/feed", label: "Home", icon: Home },
    { href: "/explore", label: "Explore", icon: Compass },
    { href: "/feed", label: "Create", icon: PlusSquare, isCreate: true },
    { href: "/notifications", label: "Alerts", icon: Bell },
    { href: "/profile/guest_player", label: "Profile", icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-panel border-t border-white/10 bg-black/90 backdrop-blur-xl px-2 py-1">
      <div className="flex items-center justify-around h-14">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;

          if (item.isCreate) {
            return (
              <Link key={item.label} href={item.href}>
                <a className="flex items-center justify-center -mt-5 bg-primary text-black w-12 h-12 rounded-full font-bold shadow-[0_0_15px_rgba(0,255,0,0.5)] border-2 border-black">
                  <Icon className="w-6 h-6 text-black" />
                </a>
              </Link>
            );
          }

          return (
            <Link key={item.label} href={item.href}>
              <a className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
                isActive ? "text-primary neon-text" : "text-gray-400 hover:text-white"
              }`}>
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-display uppercase tracking-widest mt-0.5">{item.label}</span>
              </a>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
