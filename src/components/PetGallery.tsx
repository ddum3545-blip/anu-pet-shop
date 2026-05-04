"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import useSWR from "swr";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, Folder, ChevronRight, Diamond, Sparkles, Quote } from "lucide-react";
import cloudinaryAssets from "../../cloudinary_assets.json";
import { breedDescriptions } from "../data/breedDescriptions";

const getOptimizedUrl = (url: string | null | undefined) => {
  if (!url || typeof url !== 'string' || !url.includes('cloudinary.com')) return url || "";
  // Use f_auto, q_auto, dpr_auto for maximum performance as requested
  if (url.includes('/upload/')) {
    return url.replace('/upload/', '/upload/f_auto,q_auto,dpr_auto/');
  }
  return url;
};

interface PetGalleryProps {
  category: string;
  onBreedClick?: (breed: any) => void;
  onClose: () => void;
}

const PetGallery = ({ category = "", onBreedClick, onClose }: PetGalleryProps) => {
  const [navigationStack, setNavigationStack] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Parse the hierarchy from cloudinary_assets.json
  const hierarchy = useMemo(() => {
    const tree: any = { _images: [], _mainImage: null };
    if (!category || typeof category !== 'string' || !category.trim()) return tree;
    const categoryLower = category.toLowerCase();

    Object.entries(cloudinaryAssets).forEach(([path, data]: [string, any]) => {
      const parts = path.split('/');
      // parts[0] is Category, parts[1] is Breed, parts[2] is Sub-breed or File, parts[3] is File
      if (parts[0].toLowerCase() === categoryLower) {
        let current = tree;
        // Skip the category part for the tree structure
        for (let i = 1; i < parts.length; i++) {
          const part = parts[i];
          const isFile = i === parts.length - 1;

          if (isFile) {
            if (!current._images) current._images = [];
            current._images.push(data.cloudinary_url);
            // Use the first image as representative if not already set
            if (!current._mainImage) current._mainImage = data.cloudinary_url;
          } else {
            if (!current[part]) current[part] = {};
            current = current[part];
          }
        }
      }
    });
    return tree;
  }, [category]);

  // Determine current items to show based on navigationStack
  const currentViewData = useMemo(() => {
    let current = hierarchy;
    for (const step of navigationStack) {
      if (current && current[step]) {
        current = current[step];
      }
    }

    if (!current) return { subFolders: [], images: [] };

    const subFolders = Object.keys(current).filter(key => key !== '_images' && key !== '_mainImage');
    const images = current._images || [];

    return {
      subFolders: subFolders.map(name => ({
        name,
        mainImage: current[name]?._mainImage || (current[name]?._images ? current[name]._images[0] : null)
      })),
      images
    };
  }, [hierarchy, navigationStack]);

  useEffect(() => {
    setIsLoading(true);
    // Reset stack when category changes
    setNavigationStack([]);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [category]);

  const handleFolderClick = (folderName: string) => {
    setNavigationStack(prev => [...prev, folderName]);
  };

  const handleBack = () => {
    if (navigationStack.length > 0) {
      setNavigationStack(prev => prev.slice(0, -1));
    } else {
      onClose();
    }
  };

  const currentTitle = navigationStack.length > 0 
    ? (navigationStack[navigationStack.length - 1] || "")
    : (category || "");

  const currentPath = (category && category.trim()) ? [category, ...navigationStack].join('/') : (navigationStack.length > 0 ? navigationStack.join('/') : "");
  // Fallback check for currentDescription to ensure it's driven by folder path Step 2
  const currentDescription = breedDescriptions[currentPath] || breedDescriptions[currentTitle] || "";

  // Skeleton Loader for images/folders
  const SkeletonGrid = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="flex flex-col gap-6 animate-pulse">
          <div className="aspect-[4/5] rounded-[40px] bg-gold/5 border border-gold/10" />
          <div className="h-8 w-2/3 bg-gold/10 rounded-full mx-auto" />
        </div>
      ))}
    </div>
  );

  if ((!category || !category.trim()) && navigationStack.length === 0) return null;

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative w-full min-h-screen bg-[#050505] py-20 px-4 md:px-10 z-40 overflow-y-auto"
    >
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-gold/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-gold/5 blur-[120px] rounded-full" />
      </div>

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-16 relative z-10">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-6">
            <motion.button 
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBack}
              className="p-4 rounded-2xl glass-dark border border-gold/20 text-gold hover:bg-gold/10 transition-all group"
            >
              <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
            </motion.button>
            <div className="flex flex-col">
              <motion.h2 
                key={currentTitle}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-4xl md:text-6xl font-black tracking-[0.2em] gold-glitter uppercase" 
                style={{ fontFamily: 'var(--font-cinzel), serif' }}
              >
                {currentTitle}
              </motion.h2>
              <div className="flex items-center gap-3 text-[10px] tracking-[0.4em] text-gold/40 uppercase mt-3 font-bold">
                <span className="hover:text-gold cursor-pointer transition-colors" onClick={() => setNavigationStack([])}>Archive</span>
                <ChevronRight size={10} className="opacity-30" />
                <span className={`hover:text-gold cursor-pointer transition-colors ${navigationStack.length === 0 ? 'text-gold' : ''}`} onClick={() => setNavigationStack([])}>{(category && category.trim()) || "Archive"}</span>
                {navigationStack.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <ChevronRight size={10} className="opacity-30" />
                    <span 
                      className={`hover:text-gold cursor-pointer transition-colors ${idx === navigationStack.length - 1 ? 'text-gold border-b border-gold/30 pb-0.5' : ''}`}
                      onClick={() => setNavigationStack(prev => prev.slice(0, idx + 1))}
                    >
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.05, rotate: 90 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="p-4 rounded-2xl glass-dark border border-gold/20 text-gold hover:bg-gold/10 transition-all"
          >
            <X size={24} />
          </motion.button>
        </div>

        {/* Breed Artistic Description */}
        <AnimatePresence mode="wait">
          {currentDescription && (
            <motion.div
              key={`desc-${currentPath}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-3xl mx-auto text-center relative py-8 px-12 rounded-[40px] glass-dark border border-[var(--accent)]/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden group mb-12"
            >
              {/* Decorative Glow */}
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-[var(--accent)]/10 blur-[80px] rounded-full group-hover:bg-[var(--accent)]/20 transition-colors duration-1000" />
              <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[var(--accent)]/10 blur-[80px] rounded-full group-hover:bg-[var(--accent)]/20 transition-colors duration-1000" />
              
              <div className="relative z-10 flex flex-col items-center gap-6">
                <Quote size={32} className="text-[var(--accent)]/20" />
                
                <h3 
                  className="text-3xl md:text-5xl text-[var(--foreground)] font-medium tracking-wide italic"
                  style={{ fontFamily: 'var(--font-playfair), serif' }}
                >
                  {currentTitle}
                </h3>
                
                <p 
                  className="text-[var(--accent)]/70 text-lg md:text-xl leading-relaxed font-light tracking-widest max-w-2xl"
                  style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
                >
                  {currentDescription}
                </p>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-[1px] bg-[var(--accent)]/20" />
                  <Diamond size={10} className="text-[var(--accent)]/40 animate-pulse" />
                  <div className="w-12 h-[1px] bg-[var(--accent)]/20" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content Grid */}
      <div className="max-w-7xl mx-auto relative z-10">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-12"
            >
              <SkeletonGrid />
            </motion.div>
          ) : (
            <motion.div 
              key={navigationStack.join('-')}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12"
            >
              {/* Render Folders (Breeds/Sub-breeds) */}
              {currentViewData.subFolders.map((folder: any, idx: number) => (
                <motion.div
                  key={folder.name}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.8 }}
                  whileHover={{ y: -15 }}
                  className="flex flex-col gap-6 group cursor-pointer"
                  onClick={() => handleFolderClick(folder.name)}
                >
                  {folder.mainImage ? (
                    <div className="relative aspect-[4/5] rounded-[40px] overflow-hidden border border-gold/10 glass-dark group-hover:border-gold/50 transition-all duration-700 shadow-[0_30px_60px_rgba(0,0,0,0.8)]">
                      <Image 
                        src={getOptimizedUrl(folder.mainImage)} 
                        alt={folder.name || "Folder"}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[0.3] group-hover:grayscale-0"
                        loading="lazy"
                      />
                      {/* Premium Overlays */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-700" />
                      <div className="absolute inset-0 border-[1px] border-white/5 rounded-[40px] pointer-events-none" />
                      
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700 scale-90 group-hover:scale-100">
                        <div className="bg-black/40 backdrop-blur-xl p-6 rounded-3xl border border-gold/30 shadow-2xl">
                          <Folder size={40} className="text-gold" />
                        </div>
                      </div>

                      {/* Folder Label */}
                      <div className="absolute bottom-8 left-8 right-8">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-[1px] bg-gold/50 group-hover:w-12 transition-all duration-700" />
                          <span className="text-gold text-[10px] tracking-[0.4em] font-black uppercase">Collection</span>
                        </div>
                        <h3 className="text-2xl font-black tracking-[0.1em] text-white group-hover:text-gold transition-colors uppercase truncate" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                          {folder.name}
                        </h3>
                      </div>
                    </div>
                  ) : (
                    <div className="relative aspect-[4/5] rounded-[40px] overflow-hidden border border-gold/10 glass-dark group-hover:border-gold/50 transition-all duration-700 shadow-[0_30px_60px_rgba(0,0,0,0.8)] bg-gold/5 flex flex-col items-center justify-center gap-4">
                      <Folder size={64} className="text-gold/20" />
                      <h3 className="text-xl font-black tracking-[0.1em] text-gold/40 uppercase text-center px-4" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                        {folder.name}
                      </h3>
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Render Final Images */}
              {currentViewData.images.map((img: string, idx: number) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05, duration: 0.5 }}
                  whileHover={{ y: -10 }}
                  className="relative aspect-square rounded-[32px] overflow-hidden border border-gold/10 glass-dark cursor-pointer group hover:border-gold/40 transition-all shadow-2xl"
                  onClick={() => onBreedClick && onBreedClick({
                    breed: currentTitle,
                    mainImage: img,
                    images: currentViewData.images
                  })}
                >
                  {img ? (
                    <Image 
                      src={getOptimizedUrl(img)} 
                      alt={`${currentTitle} ${idx + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-1000 group-hover:scale-110"
                      loading="lazy"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gold/5">
                      <Diamond size={32} className="text-gold/20" />
                    </div>
                  )}
                  
                  {/* Folder-style Image UI */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-[2px]" />
                  
                  <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                    <div className="bg-gold/20 backdrop-blur-md p-3 rounded-2xl border border-gold/40">
                      <Sparkles size={20} className="text-gold" />
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-8 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-[1px] bg-gold/60" />
                        <span className="text-gold text-[9px] tracking-[0.5em] font-black uppercase">Specimen</span>
                      </div>
                      <span className="text-white text-lg font-bold tracking-[0.2em] uppercase">
                        {currentTitle} <span className="text-gold/50 font-light">#{String(idx + 1).padStart(2, '0')}</span>
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Navigation Hint */}
      {currentViewData.images.length > 0 && !isLoading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-20 text-center"
        >
          <p className="text-gold/30 text-[10px] tracking-[0.8em] uppercase font-bold">
            End of Collection
          </p>
        </motion.div>
      )}
    </motion.section>
  );
};

export default PetGallery;
