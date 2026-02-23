import { Gamepad2, Twitter, Instagram, Youtube, Twitch } from "lucide-react";
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/50 pt-16 pb-8 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link href="/">
              <a className="flex items-center gap-2 mb-4" data-testid="link-footer-logo">
                <Gamepad2 className="h-8 w-8 text-primary" />
                <span className="font-display font-bold text-2xl tracking-widest text-white">LIMITLESS</span>
              </a>
            </Link>
            <p className="text-gray-400 max-w-sm mb-6 font-sans">
              Forging the future of mobile esports. We are Limitless. Compete, watch, and join the revolution.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors" data-testid="link-social-twitter">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors" data-testid="link-social-instagram">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors" data-testid="link-social-youtube">
                <Youtube className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-secondary transition-colors" data-testid="link-social-twitch">
                <Twitch className="h-6 w-6" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-display text-white font-bold tracking-widest mb-4">QUICK LINKS</h3>
            <ul className="space-y-2 font-sans">
              <li><Link href="/tournaments"><a className="text-gray-400 hover:text-primary transition-colors">Tournaments</a></Link></li>
              <li><Link href="/news"><a className="text-gray-400 hover:text-primary transition-colors">News</a></Link></li>
              <li><Link href="/store"><a className="text-gray-400 hover:text-primary transition-colors">Merch Store</a></Link></li>
              <li><Link href="/about"><a className="text-gray-400 hover:text-primary transition-colors">Our Roster</a></Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-white font-bold tracking-widest mb-4">LEGAL</h3>
            <ul className="space-y-2 font-sans">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Rules & Guidelines</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Support</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm font-sans">
            &copy; {new Date().getFullYear()} Limitless Esports. All rights reserved.
          </p>
          <p className="text-gray-600 text-sm mt-2 md:mt-0 font-display tracking-widest text-xs">
            DOMINATE THE LOBBY
          </p>
        </div>
      </div>
    </footer>
  );
}
