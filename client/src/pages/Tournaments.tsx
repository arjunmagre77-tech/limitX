import { Trophy, Users, ShieldAlert, Crosshair, Map, Calendar, Medal } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Tournaments() {
  const [activeTab, setActiveTab] = useState("upcoming");

  const tournaments = [
    {
      id: 1,
      title: "Limitless FF Clash #48",
      date: "Oct 24, 2026",
      time: "18:00 UTC",
      prize: "$1,000",
      mode: "Squad (4v4)",
      map: "Bermuda / Purgatory",
      slots: "45/48",
      status: "registering"
    },
    {
      id: 2,
      title: "Neon Nights Showdown",
      date: "Nov 02, 2026",
      time: "20:00 UTC",
      prize: "$2,500",
      mode: "Duo (2v2)",
      map: "Kalahari",
      slots: "12/64",
      status: "upcoming"
    },
    {
      id: 3,
      title: "Pro League Qualifiers",
      date: "Nov 15, 2026",
      time: "17:00 UTC",
      prize: "$10,000",
      mode: "Squad (4v4)",
      map: "All Maps",
      slots: "Invitation Only",
      status: "upcoming"
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-5xl md:text-7xl font-display font-black text-white uppercase mb-4">
            PROVING <span className="text-primary">GROUNDS</span>
          </h1>
          <p className="text-xl text-gray-400 font-sans max-w-3xl">
            Test your skills in our premium Free Fire tournaments. Fair play, huge prize pools, and the best competition in the region.
          </p>
        </div>

        {/* Stats/Info Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[
            { icon: Trophy, label: "Total Prize Paid", value: "$125K+" },
            { icon: Users, label: "Active Players", value: "14,500+" },
            { icon: Crosshair, label: "Tournaments Hosted", value: "240+" },
            { icon: ShieldAlert, label: "Anti-Cheat", value: "Strict" }
          ].map((stat, i) => (
            <div key={i} className="glass-panel p-6 border border-white/5 flex flex-col items-center text-center">
              <stat.icon className="h-8 w-8 text-primary mb-4" />
              <span className="text-3xl font-display font-bold text-white mb-1">{stat.value}</span>
              <span className="text-gray-500 font-sans uppercase tracking-wider text-sm">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Tournament List */}
        <div className="space-y-6">
          <div className="flex gap-4 border-b border-white/10 pb-4 mb-8">
            <button 
              onClick={() => setActiveTab("upcoming")}
              className={`font-display tracking-widest uppercase px-4 py-2 transition-all ${activeTab === 'upcoming' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-white'}`}
            >
              Upcoming
            </button>
            <button 
              onClick={() => setActiveTab("past")}
              className={`font-display tracking-widest uppercase px-4 py-2 transition-all ${activeTab === 'past' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-white'}`}
            >
              Past Results
            </button>
          </div>

          <div className="space-y-4">
            {tournaments.map((t, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                key={t.id} 
                className="glass-panel border border-white/10 p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-primary/40 transition-colors"
              >
                <div className="flex-1 w-full">
                  <div className="flex items-center gap-3 mb-2">
                    {t.status === 'registering' ? (
                      <span className="bg-primary/20 text-primary border border-primary/30 px-2 py-1 text-xs font-display uppercase tracking-widest animate-pulse">Live Reg</span>
                    ) : (
                      <span className="bg-white/10 text-gray-300 border border-white/20 px-2 py-1 text-xs font-display uppercase tracking-widest">Upcoming</span>
                    )}
                    <span className="text-gray-400 text-sm font-sans flex items-center gap-1">
                      <Calendar className="h-4 w-4" /> {t.date} • {t.time}
                    </span>
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white uppercase">{t.title}</h3>
                </div>

                <div className="flex flex-wrap md:flex-nowrap gap-6 md:gap-12 flex-1 justify-start md:justify-center w-full">
                  <div>
                    <span className="block text-gray-500 text-xs font-sans uppercase tracking-wider mb-1">Mode</span>
                    <span className="flex items-center gap-1 text-white font-sans"><Users className="h-4 w-4 text-primary" /> {t.mode}</span>
                  </div>
                  <div>
                    <span className="block text-gray-500 text-xs font-sans uppercase tracking-wider mb-1">Map</span>
                    <span className="flex items-center gap-1 text-white font-sans"><Map className="h-4 w-4 text-primary" /> {t.map}</span>
                  </div>
                  <div>
                    <span className="block text-gray-500 text-xs font-sans uppercase tracking-wider mb-1">Prize</span>
                    <span className="flex items-center gap-1 text-white font-sans"><Medal className="h-4 w-4 text-primary" /> {t.prize}</span>
                  </div>
                </div>

                <div className="w-full md:w-auto text-right">
                  <div className="text-gray-400 text-sm font-sans mb-3">{t.slots} Slots Filled</div>
                  <button className="w-full md:w-auto bg-primary/10 text-primary border border-primary hover:bg-primary hover:text-black font-display px-8 py-3 uppercase tracking-widest transition-all neon-border">
                    {t.status === 'registering' ? 'Register Now' : 'Details'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
