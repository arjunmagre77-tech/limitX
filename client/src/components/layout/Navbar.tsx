import { Link, useLocation } from "wouter";
import { Menu, X, Gamepad2 } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/", label: "HOME" },
    { href: "/tournaments", label: "TOURNAMENTS" },
    { href: "/news", label: "NEWS" },
    { href: "/store", label: "STORE" },
    { href: "/about", label: "ROSTER" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 glass-panel border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <Link href="/">
              <a className="flex items-center gap-2" data-testid="link-home-logo">
                <Gamepad2 className="h-8 w-8 text-primary" />
                <span className="font-display font-bold text-2xl tracking-widest text-white glitch-effect" data-text="LIMITLESS">LIMITLESS</span>
              </a>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {links.map((link) => (
                <Link key={link.href} href={link.href}>
                  <a
                    data-testid={`link-nav-${link.label.toLowerCase()}`}
                    className={`px-3 py-2 text-sm font-display tracking-widest transition-all duration-300 ${
                      location === link.href
                        ? "text-primary neon-text border-b-2 border-primary"
                        : "text-gray-400 hover:text-white hover:text-primary hover:neon-text"
                    }`}
                  >
                    {link.label}
                  </a>
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden md:block">
            <button data-testid="button-join-discord" className="bg-primary/10 border border-primary text-primary font-display tracking-widest px-6 py-2 uppercase text-sm hover:bg-primary hover:text-black transition-all duration-300 neon-border">
              JOIN DISCORD
            </button>
          </div>
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

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden glass-panel border-b border-white/5">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {links.map((link) => (
              <Link key={link.href} href={link.href}>
                <a
                  data-testid={`link-mobile-nav-${link.label.toLowerCase()}`}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-display tracking-widest ${
                    location === link.href
                      ? "text-primary bg-primary/10 border-l-2 border-primary"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
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
