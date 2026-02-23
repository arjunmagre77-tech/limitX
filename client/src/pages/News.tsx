import news1 from "@/assets/images/news-1.png";
import { Clock, ArrowRight } from "lucide-react";

export default function News() {
  const newsItems = [
    {
      id: 1,
      category: "Roster",
      title: "Limitless secures top Fragger for upcoming season",
      excerpt: "In a massive move for the organization, we are proud to announce the signing of the region's top player ahead of the Free Fire World Series qualifiers. This addition bolsters our offensive capabilities significantly.",
      date: "2 Hours Ago",
      featured: true
    },
    {
      id: 2,
      category: "Tournaments",
      title: "Weekly Skirmish #45 Results",
      excerpt: "Unstoppable Force takes first place in a nail-biting 7-game series. Check out the full breakdown and VODs.",
      date: "Oct 18, 2026",
      featured: false
    },
    {
      id: 3,
      category: "Merch",
      title: "2026 Pro Jersey Pre-orders Open",
      excerpt: "The wait is over. The official 2026 Pro Jersey is now available for pre-order in our store.",
      date: "Oct 15, 2026",
      featured: false
    },
    {
      id: 4,
      category: "Community",
      title: "New Discord Scrim Server Launched",
      excerpt: "Looking for practice? Join our dedicated scrim server to find teams and run games nightly.",
      date: "Oct 10, 2026",
      featured: false
    },
    {
      id: 5,
      category: "Game Update",
      title: "Patch OB41 Meta Analysis",
      excerpt: "Our coach breaks down the latest Free Fire patch and how it shifts the competitive weapon meta.",
      date: "Oct 05, 2026",
      featured: false
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl md:text-7xl font-display font-black text-white uppercase mb-12">
          LATEST <span className="text-primary">INTEL</span>
        </h1>

        {/* Featured News */}
        <div className="mb-16">
          <div className="relative rounded-sm overflow-hidden h-[500px] border border-white/10 group cursor-pointer">
            <img 
              src={news1} 
              alt="Featured News" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
            
            <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full max-w-4xl">
              <div className="flex items-center gap-4 mb-4">
                <span className="bg-primary text-black font-display tracking-widest text-xs px-3 py-1 uppercase font-bold">
                  {newsItems[0].category}
                </span>
                <span className="text-gray-300 font-sans text-sm flex items-center gap-1">
                  <Clock className="h-4 w-4" /> {newsItems[0].date}
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white uppercase mb-4 leading-tight group-hover:text-primary transition-colors">
                {newsItems[0].title}
              </h2>
              <p className="text-gray-300 font-sans text-lg mb-6 max-w-2xl">
                {newsItems[0].excerpt}
              </p>
              <div className="inline-flex items-center gap-2 text-white font-display tracking-widest uppercase text-sm border-b border-primary pb-1 group-hover:text-primary transition-colors">
                Read Full Report <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsItems.slice(1).map((item) => (
            <div key={item.id} className="glass-panel border border-white/5 hover:border-primary/30 transition-all group flex flex-col h-full cursor-pointer">
              <div className="h-48 bg-white/5 relative overflow-hidden">
                {/* Placeholders for other images */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black group-hover:scale-105 transition-transform duration-500"></div>
                <div className="absolute top-4 left-4">
                  <span className="bg-secondary/80 backdrop-blur-sm text-white font-display tracking-widest text-[10px] px-2 py-1 uppercase">
                    {item.category}
                  </span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <span className="text-gray-400 font-sans text-xs flex items-center gap-1 mb-3">
                  <Clock className="h-3 w-3" /> {item.date}
                </span>
                <h3 className="text-2xl font-display font-bold text-white uppercase mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-gray-400 font-sans text-sm line-clamp-3 mb-6 flex-grow">
                  {item.excerpt}
                </p>
                <div className="text-primary font-display tracking-widest text-xs uppercase flex items-center gap-1">
                  Read Article <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination mock */}
        <div className="mt-16 flex justify-center gap-2">
          <button className="w-10 h-10 flex items-center justify-center border border-primary text-primary font-display font-bold bg-primary/10">1</button>
          <button className="w-10 h-10 flex items-center justify-center border border-white/10 text-gray-400 hover:text-white hover:border-white/30 font-display">2</button>
          <button className="w-10 h-10 flex items-center justify-center border border-white/10 text-gray-400 hover:text-white hover:border-white/30 font-display">3</button>
          <span className="w-10 h-10 flex items-center justify-center text-gray-400">...</span>
        </div>
      </div>
    </div>
  );
}
