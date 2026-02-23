import { Target, Trophy, Swords, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function About() {
  const roster = [
    { name: "Alex 'Viper' Chen", role: "In-Game Leader (IGL)", mains: "Sniper / Support", stats: { kd: 4.2, wr: "32%" } },
    { name: "Sarah 'Nova' Jones", role: "Fragger", mains: "Assault / Rush", stats: { kd: 5.8, wr: "30%" } },
    { name: "Marcus 'Pulse' Smith", role: "Support", mains: "Medic / Utility", stats: { kd: 2.1, wr: "35%" } },
    { name: "David 'Echo' Kim", role: "Flanker", mains: "Assault / Stealth", stats: { kd: 4.5, wr: "31%" } }
  ];

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Org Intro */}
        <section className="mb-24 relative">
          <div className="absolute top-0 right-0 w-1/2 h-[500px] bg-primary/5 blur-[150px] -z-10 rounded-full"></div>
          <h1 className="text-5xl md:text-7xl font-display font-black text-white uppercase mb-8">
            ABOUT <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">LIMITLESS</span>
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <p className="text-xl text-gray-300 font-sans mb-6 leading-relaxed">
                Founded in 2024, Limitless Esports was born from a desire to elevate mobile gaming to unprecedented heights. We don't just participate in tournaments; we dominate them.
              </p>
              <p className="text-lg text-gray-400 font-sans mb-8 leading-relaxed">
                Our organization manages top-tier competitive rosters, hosts the region's largest Free Fire tournament circuits, and produces premium gaming apparel for our dedicated fanbase.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="border-l-2 border-primary pl-4">
                  <span className="block text-3xl font-display font-bold text-white mb-1">24</span>
                  <span className="text-gray-500 font-sans uppercase tracking-wider text-xs">Major Championships</span>
                </div>
                <div className="border-l-2 border-secondary pl-4">
                  <span className="block text-3xl font-display font-bold text-white mb-1">$450k</span>
                  <span className="text-gray-500 font-sans uppercase tracking-wider text-xs">Total Earnings</span>
                </div>
              </div>
            </div>
            
            <div className="glass-panel p-8 border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 blur-[50px]"></div>
              <h3 className="text-2xl font-display font-bold text-white uppercase mb-6">Management</h3>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                    <span className="font-display font-bold text-xl text-gray-400">EO</span>
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-white text-lg">Elias "Zero" Ortiz</h4>
                    <p className="text-primary font-sans text-sm uppercase tracking-widest">Founder & CEO</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                    <span className="font-display font-bold text-xl text-gray-400">MW</span>
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-white text-lg">Maya "Cipher" Wong</h4>
                    <p className="text-secondary font-sans text-sm uppercase tracking-widest">Head Coach</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Roster Section */}
        <section>
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-display font-bold text-white uppercase flex items-center gap-4">
                <Swords className="text-primary h-8 w-8" />
                Active <span className="text-primary">Roster</span>
              </h2>
              <p className="text-gray-400 mt-2 font-sans">Free Fire Professional Division</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {roster.map((player, i) => (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                key={i} 
                className="group relative glass-panel border border-white/5 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Player Image Placeholder */}
                <div className="h-64 bg-black/40 relative flex items-end justify-center pb-0 border-b border-white/5 overflow-hidden">
                  {/* Silhouette */}
                  <div className="w-4/5 h-5/6 bg-gradient-to-t from-gray-800 to-gray-700 mx-auto rounded-t-[100px] shadow-[inset_0_-20px_50px_rgba(0,0,0,0.5)] transform group-hover:scale-105 transition-transform duration-500 flex items-center justify-center">
                    <Zap className="h-20 w-20 text-black/20" />
                  </div>
                  <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1 border border-white/10">
                    <span className="font-display text-primary tracking-widest text-xs uppercase font-bold">{player.role}</span>
                  </div>
                </div>

                <div className="p-6 relative z-10">
                  <h3 className="text-2xl font-display font-bold text-white uppercase mb-1 group-hover:text-primary transition-colors">{player.name}</h3>
                  <p className="text-gray-400 font-sans text-sm mb-6 flex items-center gap-2">
                    <Target className="h-3 w-3" /> {player.mains}
                  </p>

                  <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                    <div>
                      <span className="block text-gray-500 font-sans uppercase tracking-wider text-[10px] mb-1">K/D Ratio</span>
                      <span className="font-display font-bold text-white text-lg">{player.stats.kd}</span>
                    </div>
                    <div>
                      <span className="block text-gray-500 font-sans uppercase tracking-wider text-[10px] mb-1">Win Rate</span>
                      <span className="font-display font-bold text-white text-lg">{player.stats.wr}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
