import jersey from "@/assets/images/jersey.png";
import { ShoppingCart, Star } from "lucide-react";

export default function Store() {
  const products = [
    {
      id: 1,
      name: "Limitless Pro Jersey 2026",
      price: "$65.00",
      image: jersey,
      category: "Apparel",
      badge: "Pre-order"
    },
    {
      id: 2,
      name: "Neon Nights Hoodie",
      price: "$85.00",
      image: null,
      category: "Apparel",
      badge: "Bestseller"
    },
    {
      id: 3,
      name: "Limitless Dad Hat",
      price: "$30.00",
      image: null,
      category: "Headwear",
      badge: null
    },
    {
      id: 4,
      name: "Pro Gaming Sleeve",
      price: "$25.00",
      image: null,
      category: "Accessories",
      badge: null
    },
    {
      id: 5,
      name: "Oversized 'Glitch' Tee",
      price: "$40.00",
      image: null,
      category: "Apparel",
      badge: "New"
    },
    {
      id: 6,
      name: "Limitless Lanyard",
      price: "$15.00",
      image: null,
      category: "Accessories",
      badge: null
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-white/10 pb-8">
          <div>
            <h1 className="text-5xl md:text-7xl font-display font-black text-white uppercase mb-4">
              THE <span className="text-primary">ARMORY</span>
            </h1>
            <p className="text-xl text-gray-400 font-sans max-w-2xl">
              Official Limitless Esports merchandise. Gear up with the same apparel worn by our professional roster.
            </p>
          </div>
          <div className="mt-8 md:mt-0 flex gap-4">
            <button className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 text-white font-display tracking-widest text-sm hover:bg-white/10 transition-colors">
              <ShoppingCart className="h-4 w-4" /> 
              CART (0)
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-4 hide-scrollbar">
          {["All", "Apparel", "Headwear", "Accessories", "Collectibles"].map((filter, i) => (
            <button 
              key={filter}
              className={`whitespace-nowrap font-display tracking-widest uppercase px-6 py-2 border ${i === 0 ? 'bg-primary/10 text-primary border-primary' : 'bg-transparent text-gray-400 border-white/10 hover:border-white/30 hover:text-white'}`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id} className="group relative">
              <div className="aspect-[4/5] glass-panel border border-white/5 mb-4 relative overflow-hidden flex items-center justify-center p-8 bg-black/40 group-hover:border-primary/50 transition-colors">
                {product.badge && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className={`font-display tracking-widest text-[10px] px-2 py-1 uppercase font-bold text-black ${product.badge === 'Pre-order' ? 'bg-secondary' : 'bg-primary'}`}>
                      {product.badge}
                    </span>
                  </div>
                )}
                
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <div className="text-gray-600 font-display opacity-20 transform -rotate-45 text-4xl font-bold">IMAGE PENDING</div>
                )}

                <div className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="bg-primary text-black font-display font-bold uppercase tracking-widest px-6 py-3 flex items-center gap-2 hover:bg-white transition-colors">
                    <ShoppingCart className="h-4 w-4" /> Add to Cart
                  </button>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-display font-bold text-white uppercase text-lg">{product.name}</h3>
                  <span className="font-sans text-primary font-medium">{product.price}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-sans text-sm">{product.category}</span>
                  <div className="flex items-center text-secondary">
                    <Star className="h-3 w-3 fill-current" />
                    <Star className="h-3 w-3 fill-current" />
                    <Star className="h-3 w-3 fill-current" />
                    <Star className="h-3 w-3 fill-current" />
                    <Star className="h-3 w-3 fill-current" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
