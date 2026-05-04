"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Star, Diamond, Loader2 } from "lucide-react";
import { supabase } from "@/supabaseClient";
import { samplePetFood } from "@/seedData";

const PetEssentialsStore = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const seedPetFood = async () => {
    try {
      const { data: existingFood, error: fetchError } = await supabase.from("pet_food").select("*");
      if (fetchError) {
        console.log("Using local sample pet food (Supabase fetch failed)");
        return samplePetFood;
      }
      
      if (existingFood && existingFood.length > 0) {
        return existingFood;
      }
      
      console.log("Using local sample pet food");
      return samplePetFood;
    } catch (error) {
      console.log("Using local sample pet food");
      return samplePetFood;
    }
  };

  useEffect(() => {
    const fetchAndSeedPetFood = async () => {
      try {
        const data = await seedPetFood();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching pet food products:", error);
        setProducts(samplePetFood);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAndSeedPetFood();
  }, []);

  if (isLoading) {
    return (
      <section className="py-24 bg-[var(--background)] relative overflow-hidden transition-colors duration-1000">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--accent)]/30 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 md:px-10 relative z-10 flex items-center justify-center min-h-[500px]">
          <Loader2 className="text-[var(--accent)] animate-spin" size={48} />
        </div>
      </section>
    );
  }
  return (
    <section className="py-24 bg-[var(--background)] relative overflow-hidden transition-colors duration-1000">
      {/* Decorative background */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--accent)]/30 to-transparent" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[var(--accent)]/5 blur-[120px] rounded-full" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[var(--accent)]/5 blur-[120px] rounded-full" />

      <div className="max-w-7xl mx-auto px-4 md:px-10 relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-px bg-[var(--accent)]/30" />
              <Diamond size={12} className="text-[var(--accent)] animate-pulse" />
              <div className="w-12 h-px bg-[var(--accent)]/30" />
            </div>
            <h2 
              className="text-5xl md:text-7xl text-[var(--foreground)] font-medium tracking-tight"
              style={{ fontFamily: 'var(--font-playfair), serif' }}
            >
              Premium Pet Nutrition
            </h2>
            <p className="text-[var(--accent)]/50 text-[10px] tracking-[0.6em] uppercase font-bold mt-4">
              The Curated Collection of Excellence
            </p>
          </motion.div>
        </div>

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <Diamond className="text-[var(--accent)]/30 mb-8" size={64} />
            <h3 className="text-2xl font-bold text-[var(--accent)] mb-4">
              No Items Available
            </h3>
            <p className="text-[var(--foreground)]/50 text-sm tracking-wide max-w-md">
              Our curated collection is being prepared. Check back soon for premium pet nutrition products.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {products.map((product, idx) => {
              const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`Hi Anu Pet Shop, I am interested in the ${product.breed} ${product.name}. Is it available at your Nagpur store?`)}`;
              
              return (
                <motion.div
                  key={product.id || idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="group relative"
                >
                  <div className="relative aspect-[4/5] rounded-[40px] overflow-hidden border border-[var(--accent)]/10 glass-dark group-hover:border-[var(--accent)]/40 transition-all duration-700 shadow-2xl">
                    {/* 35% OFF Badge */}
                    {product.discount > 0 && (
                      <div className="absolute top-6 left-6 z-10">
                        <span className="px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.4em] bg-gradient-to-r from-red-500 to-orange-500 text-white">
                          {product.discount}% OFF
                        </span>
                      </div>
                    )}

                    {/* Product Image */}
                    <img
                      src={product.image_url || "https://via.placeholder.com/400x500?text=No+Image"}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[0.2] group-hover:grayscale-0 shadow-xl"
                    />
                    
                    {/* Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-700" />
                    
                    {/* Product Info */}
                    <div className="absolute inset-0 p-10 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-[var(--accent)] text-[9px] tracking-[0.4em] font-black uppercase opacity-60">
                            {product.breed || "Pet Food"}
                          </span>
                          <h3 className="text-2xl font-bold text-white tracking-wide uppercase">
                            {product.name}
                          </h3>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-[var(--accent)]/40 text-[9px] tracking-widest uppercase mb-1">Price</span>
                            <span className="text-2xl font-black text-[var(--accent)]">
                              ₹{Number(product.price).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {product.availability && (
                          <span className="text-xs text-green-400 font-bold uppercase tracking-widest">
                            In Stock
                          </span>
                        )}

                        <motion.a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="mt-4 w-full py-4 rounded-2xl bg-[var(--accent)] border border-[var(--accent)] text-black text-[10px] tracking-[0.4em] font-black uppercase hover:bg-[var(--accent)]/90 transition-all duration-500 flex items-center justify-center gap-3 group/btn"
                        >
                          <MessageCircle size={14} className="group-hover/btn:scale-110 transition-transform" />
                          Enquire on WhatsApp
                        </motion.a>
                      </div>
                    </div>
                  </div>

                  {/* Decorative Glow on Hover */}
                  <div className="absolute inset-0 bg-[var(--accent)]/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -z-10 pointer-events-none" />
                </motion.div>
              );
            })}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-24 text-center"
        >
          <p className="text-[var(--accent)]/20 text-[10px] tracking-[0.8em] uppercase font-bold">
            Curating Luxury Nutrition Since 2026
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default PetEssentialsStore;
