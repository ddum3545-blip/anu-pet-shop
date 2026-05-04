"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import Image from "next/image";

const getOptimizedUrl = (url: string) => {
  if (!url || !url.includes('cloudinary.com')) return url;
  if (url.includes('/upload/')) {
    return url.replace('/upload/', '/upload/f_auto,q_auto,dpr_auto/');
  }
  return url;
};

const BreedDetailsSection = ({ breed, onClose }: any) => {
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying || !breed.images || breed.images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentImageIdx(prev => (prev + 1) % breed.images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [breed.images, isAutoPlaying]);

  const nextImage = () => {
    setIsAutoPlaying(false);
    setCurrentImageIdx(prev => (prev + 1) % breed.images.length);
  };

  const prevImage = () => {
    setIsAutoPlaying(false);
    setCurrentImageIdx(prev => (prev - 1 + breed.images.length) % breed.images.length);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 w-full h-screen flex items-center justify-center bg-black/95 backdrop-blur-3xl p-6 md:p-12 z-[300] overflow-y-auto"
    >
      <button 
        onClick={onClose}
        className="fixed top-10 right-10 p-4 rounded-full glass-dark border-2 border-gold text-gold hover:bg-gold hover:text-black transition-all z-[310] shadow-[0_0_30px_rgba(212,175,55,0.5)] group"
      >
        <X size={32} className="group-hover:rotate-90 transition-transform duration-300" />
      </button>

      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 items-start py-10 md:py-20">
        {/* Left Side: Main Image */}
        <div className="lg:col-span-7 relative group">
          <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative aspect-[4/5] rounded-[3rem] overflow-hidden border-2 border-gold/30 shadow-[0_0_50px_rgba(212,175,55,0.2)]"
            >
              <div className="absolute inset-0 bg-gold/5 animate-pulse" />
              <Image 
                src={getOptimizedUrl(breed.images[currentImageIdx])} 
                alt={breed.breed} 
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 800px"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            
            <div className="absolute bottom-10 left-10">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-7xl font-serif text-white mb-2"
              >
                {breed.breed}
              </motion.h2>
              <div className="h-1 w-32 bg-gold" />
            </div>
          </motion.div>
        </div>

        {/* Right Side: Description & Slideshow */}
        <div className="lg:col-span-5 flex flex-col justify-center min-h-full">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-12"
          >
            <div className="space-y-6">
              <h3 className="text-gold text-sm tracking-[0.3em] uppercase font-medium">Description</h3>
              <div className="relative">
                <span className="absolute -left-6 top-0 text-6xl text-gold/20 font-serif">"</span>
                <p className="text-xl md:text-2xl text-white/90 font-light leading-relaxed italic pl-2">
                  {breed.description}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-gold text-sm tracking-[0.3em] uppercase font-medium">Collection Gallery</h3>
              <div className="grid grid-cols-4 gap-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                {breed.images.map((img: string, idx: number) => (
                  <motion.div
                      key={idx}
                      whileHover={{ scale: 1.1, y: -5 }}
                      onClick={() => {
                        setCurrentImageIdx(idx);
                        setIsAutoPlaying(false);
                      }}
                      className={`relative aspect-square rounded-2xl overflow-hidden cursor-pointer border-2 transition-all duration-500 ${
                        currentImageIdx === idx 
                          ? 'border-gold shadow-[0_0_25px_rgba(212,175,55,0.6)] z-10' 
                          : 'border-gold/10 grayscale hover:grayscale-0 hover:border-gold/40'
                      }`}
                    >
                      <div className="absolute inset-0 bg-gold/5 animate-pulse" />
                      <Image 
                        src={getOptimizedUrl(img)} 
                        alt={`${breed.breed} ${idx}`} 
                        fill
                        sizes="150px"
                        loading="lazy"
                        className="object-cover"
                      />
                    {currentImageIdx === idx && (
                      <div className="absolute inset-0 border-2 border-gold animate-pulse" />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default BreedDetailsSection;
