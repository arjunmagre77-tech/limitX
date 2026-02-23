import heroBg from "@/assets/images/hero-bg.png";
import news1 from "@/assets/images/news-1.png";
import jersey from "@/assets/images/jersey.png";
import { Link } from "wouter";
import { Trophy, ChevronRight, ShoppingCart, Crosshair } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroBg} 
            alt="Esports Stadium" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-background to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <div className="inline-block px-4 py-1 mb-6 border border-primary/30 bg-primary/10 text-primary font-display tracking-widest text-sm uppercase">
              Free Fire Professional Team
            </div>
            <h1 className="text-6xl md:text-8xl font-display font-black text-white mb-6 uppercase leading-none">
              Beyond <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary glitch-effect" data-text="LIMITS">LIMITS</span>
            </h1>
            <p className="text-xl text-gray-300 font-sans mb-10 max-w-2xl text-lg md:text-xl">
              The premier destination for mobile esports. Compete in our weekly Free Fire tournaments, follow the professional roster, and gear up.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/tournaments">
                <a className="bg-primary text-black font-display font-bold tracking-widest px-8 py-4 uppercase hover:bg-white hover:text-black transition-all duration-300 flex items-center gap-2 group shadow-[0_0_20px_rgba(0,255,0,0.3)]">
                  <Trophy className="h-5 w-5" />
                  Join Tournament
                  <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </Link>
              <Link href="/store">
                <a className="border border-white/20 glass-panel text-white font-display font-bold tracking-widest px-8 py-4 uppercase hover:bg-white/10 transition-all duration-300 flex items-center gap-2">
                  Shop Merch
                </a>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Tournaments Preview */}
      <section className="py-24 relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-display font-bold text-white uppercase flex items-center gap-4">
                <Crosshair className="text-primary h-8 w-8" />
                Active <span className="text-primary">Bounties</span>
              </h2>
              <p className="text-gray-400 mt-2 font-sans">Upcoming Free Fire skirmishes and major tournaments.</p>
            </div>
            <Link href="/tournaments">
              <a className="text-primary hover:text-white font-display tracking-widest uppercase flex items-center gap-1 transition-colors hidden md:flex">
                View All <ChevronRight className="h-4 w-4" />
              </a>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="group relative glass-panel p-6 border border-white/5 hover:border-primary/50 transition-all duration-500 overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-0 bg-primary group-hover:h-full transition-all duration-500"></div>
                <div className="flex justify-between items-start mb-6">
                  <span className="bg-primary/20 text-primary px-3 py-1 text-xs font-display tracking-widest uppercase border border-primary/30">
                    Registration Open
                  </span>
                  <span className="text-gray-400 font-sans text-sm">Tomorrow, 18:00 UTC</span>
                </div>
                <h3 className="text-2xl font-display font-bold text-white mb-2 uppercase">Limitless FF Clash #{i * 12}</h3>
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex flex-col">
                    <span className="text-gray-500 text-xs font-sans uppercase tracking-wider">Prize Pool</span>
                    <span className="text-white font-display font-bold">${i * 500}</span>
                  </div>
                  <div className="w-px h-8 bg-white/10"></div>
                  <div className="flex flex-col">
                    <span className="text-gray-500 text-xs font-sans uppercase tracking-wider">Slots</span>
                    <span className="text-white font-display font-bold">24 / 48</span>
                  </div>
                </div>
                <button className="w-full bg-white/5 hover:bg-primary hover:text-black border border-white/10 hover:border-primary text-white font-display py-3 uppercase tracking-widest transition-all duration-300">
                  Register Squad
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Merch Promo */}
      <section className="py-24 relative overflow-hidden bg-black/50 border-t border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative aspect-square max-w-md mx-auto lg:mx-0"
            >
              <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full"></div>
              <img src={jersey} alt="Pro Jersey" className="relative z-10 w-full h-full object-contain" />
            </motion.div>
            
            <div>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white uppercase mb-6">
                Wear The <span className="text-primary">Colors</span>
              </h2>
              <p className="text-gray-400 font-sans text-lg mb-8">
                The official Limitless Esports Pro Jersey 2026. Engineered for performance, designed for dominance. Features moisture-wicking technology and our signature neon green accents.
              </p>
              <div className="flex items-center gap-6 mb-10">
                <span className="text-3xl font-display font-bold text-white">$65.00</span>
                <span className="bg-secondary/20 text-secondary border border-secondary/30 px-3 py-1 text-sm font-display tracking-widest uppercase">
                  Limited Drop
                </span>
              </div>
              <Link href="/store">
                <a className="inline-flex items-center gap-2 bg-white text-black font-display font-bold tracking-widest px-8 py-4 uppercase hover:bg-primary transition-colors duration-300">
                  <ShoppingCart className="h-5 w-5" />
                  Pre-order Now
                </a>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-display font-bold text-white uppercase mb-12 flex items-center gap-4">
            Intel <span className="text-primary">Feed</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link href="/news/1">
              <a className="group relative block overflow-hidden rounded-sm h-[400px]">
                <img src={news1} alt="News" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8 w-full">
                  <span className="text-primary font-display tracking-widest text-sm mb-3 block uppercase">Roster Update</span>
                  <h3 className="text-3xl font-display font-bold text-white uppercase group-hover:text-primary transition-colors">
                    Limitless secures top Fragger for upcoming season
                  </h3>
                  <p className="text-gray-400 font-sans mt-3 line-clamp-2">
                    In a massive move for the organization, we are proud to announce the signing of the region's top player ahead of the Free Fire World Series qualifiers.
                  </p>
                </div>
              </a>
            </Link>
            
            <div className="flex flex-col gap-8">
              {[1, 2].map((i) => (
                <Link key={i} href={`/news/${i+1}`}>
                  <a className="group flex gap-6 items-center glass-panel p-4 border border-white/5 hover:border-primary/30 transition-colors h-[184px]">
                    <div className="w-1/3 h-full bg-white/5 overflow-hidden">
                      {/* Placeholder for smaller news images */}
                      <div className="w-full h-full bg-gradient-to-br from-gray-800 to-black group-hover:scale-105 transition-transform duration-500"></div>
                    </div>
                    <div className="w-2/3 py-2">
                      <span className="text-secondary font-display tracking-widest text-xs mb-2 block uppercase">Tournament Results</span>
                      <h3 className="text-xl font-display font-bold text-white uppercase group-hover:text-primary transition-colors line-clamp-2">
                        Weekly Skirmish #45 Results: Unstoppable Force takes first
                      </h3>
                      <p className="text-gray-500 font-sans mt-2 text-sm line-clamp-2">
                        A recap of this weekend's intense matches and the current leaderboard standings.
                      </p>
                    </div>
                  </a>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
