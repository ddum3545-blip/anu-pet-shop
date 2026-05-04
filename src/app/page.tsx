"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import useSWR from "swr";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, 
  Menu, 
  Phone, 
  Camera, 
  Diamond,
  Crown,
  Compass,
  Sparkles,
  Leaf,
  Stethoscope,
  Award,
  ChevronDown,
  Palette,
  Check,
  ChevronLeft,
  ChevronRight,
  X
} from "lucide-react";

// --- Theme Data ---
const themes = [
  { name: "Cinematic Noir", bg: "#000000", fg: "#ffffff", gold: "#D4AF37", font: "var(--font-cormorant-garamond), serif", bodyFont: "var(--font-montserrat), sans-serif" },
  { name: "Royal Pista", bg: "#C1D7C3", fg: "#3D2B1F", gold: "#D4AF37", font: "var(--font-cormorant-garamond), serif", bodyFont: "var(--font-montserrat), sans-serif" },
  { name: "Midnight Gold", bg: "#1A1A1A", fg: "#D4AF37", gold: "#D4AF37", font: "var(--font-cinzel), serif", bodyFont: "var(--font-montserrat), sans-serif" },
  { name: "Sand & Stone", bg: "#F5F5DC", fg: "#4A4A4A", gold: "#8B7355", font: "var(--font-montserrat), sans-serif", bodyFont: "var(--font-lato), sans-serif" },
  { name: "Forest Mist", bg: "#2D3E2E", fg: "#C1D7C3", gold: "#E2F3E4", font: "var(--font-playfair), serif", bodyFont: "var(--font-lato), sans-serif" },
  { name: "Ivory Rose", bg: "#FFF5F5", fg: "#8B4367", gold: "#D4AF37", font: "var(--font-playfair), serif", bodyFont: "var(--font-lato), sans-serif" },
  { name: "Ocean Deep", bg: "#002B36", fg: "#268BD2", gold: "#D4AF37", font: "var(--font-montserrat), sans-serif", bodyFont: "var(--font-lato), sans-serif" },
  { name: "Terracotta Sun", bg: "#E2725B", fg: "#3E2723", gold: "#D4AF37", font: "var(--font-cormorant), serif", bodyFont: "var(--font-lato), sans-serif" },
  { name: "Lavender Silk", bg: "#E6E6FA", fg: "#4B0082", gold: "#D4AF37", font: "var(--font-cinzel), serif", bodyFont: "var(--font-montserrat), sans-serif" },
  { name: "Slate Minimal", bg: "#708090", fg: "#F0F8FF", gold: "#D4AF37", font: "var(--font-montserrat), sans-serif", bodyFont: "var(--font-lato), sans-serif" },
  { name: "Champagne Blush", bg: "#F7E7CE", fg: "#5D3A1A", gold: "#D4AF37", font: "var(--font-playfair), serif", bodyFont: "var(--font-lato), sans-serif" },
];

const ThemeSelector = ({ currentTheme, onThemeChange }: any) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100]">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="glass-dark px-6 py-3 rounded-full flex items-center gap-3 border border-gold/20 text-gold hover:border-gold/50 transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.1)]"
      >
        <Palette size={16} />
        <span className="text-[10px] tracking-[0.2em] uppercase font-sans">{currentTheme.name}</span>
        <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full mt-4 left-1/2 -translate-x-1/2 glass-dark p-4 rounded-2xl border border-gold/10 min-w-[240px] shadow-2xl overflow-hidden grid gap-2"
          >
            {themes.map((theme) => (
              <button
                key={theme.name}
                onClick={() => {
                  onThemeChange(theme);
                  setIsOpen(false);
                }}
                className="group flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full border border-gold/20" style={{ background: theme.bg }} />
                  <span className={`text-[11px] tracking-widest uppercase font-sans ${currentTheme.name === theme.name ? 'text-gold' : 'text-gold/50'}`}>
                    {theme.name}
                  </span>
                </div>
                {currentTheme.name === theme.name && <Check size={12} className="text-gold" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const GlitterLogo = () => (
  <div className="text-center mb-12 relative pt-8">
    <motion.h1 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-7xl md:text-8xl font-black tracking-[0.4em] gold-glitter uppercase py-4"
      style={{ fontFamily: 'var(--font-cinzel), serif' }}
    >
      ANU PET SHOP
    </motion.h1>
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
      <div className="flare-effect top-1/4 left-1/4" />
      <div className="flare-effect top-3/4 left-2/3" />
      <div className="flare-effect top-1/2 left-[15%]" />
      <div className="flare-effect top-1/3 left-[85%]" />
    </div>
  </div>
);

const ProductItem = ({ icon: Icon, title, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay }}
    className="flex items-center gap-4 group cursor-pointer"
  >
    <div className="p-3 rounded-xl bg-white/5 border border-white/10 group-hover:border-gold/50 transition-all duration-300">
      <Icon size={18} className="text-gold" />
    </div>
    <span className="text-sm font-bold tracking-widest uppercase opacity-70 group-hover:opacity-100 transition-opacity">
      {title}
    </span>
  </motion.div>
);

const PetGallery = dynamic(() => import("@/components/PetGallery"), {
  loading: () => <div className="min-h-screen bg-black flex items-center justify-center"><Diamond className="text-gold animate-pulse" size={64} /></div>,
  ssr: false
});

const BreedDetailsSection = dynamic(() => import("@/components/BreedDetailsSection"), {
  ssr: false
});

const PetEssentialsStore = dynamic(() => import("@/components/PetEssentialsStore"), {
  loading: () => <div className="py-20 bg-black flex items-center justify-center"><Diamond className="text-gold animate-pulse" size={48} /></div>,
  ssr: false
});

const PetShowroom = dynamic(() => import("@/components/PetShowroom"), {
  loading: () => <div className="py-20 bg-black flex items-center justify-center"><Diamond className="text-gold animate-pulse" size={48} /></div>,
  ssr: false
});

const PremiumFooter = dynamic(() => import("@/components/PremiumFooter"), {
  ssr: false
});

const AIChatbot = dynamic(() => import("@/components/AIChatbot"), {
  ssr: false
});

const ThemeSwitcher = dynamic(() => import("@/components/ThemeSwitcher"), {
  ssr: false
});

const fetcher = (url: string) => fetch(url).then(res => res.json());

const VideoHero = ({ theme, isShifted }: { theme: any, isShifted: boolean }) => (
  <motion.div 
    animate={{ 
      y: isShifted ? -200 : 0,
      scale: isShifted ? 0.9 : 1,
      opacity: isShifted ? 0.5 : 1
    }}
    transition={{ duration: 1, ease: "easeInOut" }}
    className="relative w-full max-w-[85vw] aspect-video mx-auto mt-4 rounded-[40px] overflow-hidden shadow-2xl group z-20"
    style={{ 
      boxShadow: `0 0 80px ${theme.gold}40, inset 0 0 40px ${theme.gold}20`,
      border: `3px solid ${theme.gold}60`
    }}
  >
    <video 
      autoPlay 
      muted 
      loop 
      playsInline
      className="w-full h-full object-cover"
    >
      <source src="https://res.cloudinary.com/dvyuplyck/video/upload/f_auto,q_auto:best/Pets/Entry Video/Perfect Vid" type="video/mp4" />
    </video>

    {/* Premium Overlay for blending */}
    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />
    <div className="absolute inset-0 ring-1 ring-inset ring-white/20 rounded-[40px] pointer-events-none" />
    
    {/* Subtle Glow Border matching Glitter Logo */}
    <div className="absolute inset-0 rounded-[40px] pointer-events-none" 
      style={{ 
        boxShadow: `inset 0 0 20px ${theme.gold}30, 0 0 30px ${theme.gold}20`,
        border: `1px solid ${theme.gold}40`
      }} 
    />
  </motion.div>
);

const LeftNavigation = ({ onCategoryClick }: { onCategoryClick: (category: string) => void }) => (
  <motion.div 
    initial={{ x: -100, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    className="w-80 bg-black/5 backdrop-blur-3xl rounded-r-[40px] p-10 h-[85vh] flex flex-col gap-12 shadow-[0_0_50px_rgba(0,0,0,0.8)] border-r border-white/5 my-auto z-30"
  >
    <div className="mb-4">
      <h3 className="text-4xl font-black tracking-tighter gold-glitter mb-2" style={{ fontFamily: 'var(--font-cinzel), serif' }}>ANU</h3>
      <p className="text-sm tracking-[0.5em] opacity-70 uppercase font-black text-white drop-shadow-md">Pet Shop</p>
    </div>

    <nav className="flex flex-col gap-12">
      <div>
        <h4 className="text-sm font-black tracking-[0.4em] opacity-50 uppercase mb-6 leading-[2] border-b border-white/5 pb-2">AVAILABLE PETS</h4>
        <ul className="flex flex-col gap-5">
          {['Dog', 'Cat', 'Exotic Birds', 'Guinea Pig', 'Hamster'].map((item) => (
            <li 
              key={item} 
              onClick={() => onCategoryClick(item)}
              className="text-2xl font-bold tracking-widest cursor-pointer transition-all duration-300 hover:text-gold hover:translate-x-3 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] text-white/80"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="text-sm font-black tracking-[0.4em] opacity-50 uppercase mb-6 leading-[2] border-b border-white/5 pb-2">FEATURED</h4>
        <div className="space-y-4">
          <ProductItem icon={Leaf} title="Organic Treats" delay={0.6} />
          <ProductItem icon={Stethoscope} title="Vet Consultation" delay={0.7} />
        </div>
      </div>
    </nav>
  </motion.div>
);

const RightNavigation = ({ onCategoryClick }: { onCategoryClick: (category: string) => void }) => {
  const categories = useMemo(() => [
    { name: 'DOGS', folder: 'Dog', image: 'https://res.cloudinary.com/dvyuplyck/image/upload/f_auto,q_auto:best,dpr_auto,w_400/v1777213283/ANU_PET_SHOP/Navigation_Icons/temp_Dogs_nokend.webp' },
    { name: 'CATS', folder: 'Cat', image: 'https://res.cloudinary.com/dvyuplyck/image/upload/f_auto,q_auto:best,dpr_auto,w_400/v1777213289/ANU_PET_SHOP/Navigation_Icons/temp_Cats_tceok8.webp' },
    { name: 'EXOTIC BIRDS', folder: 'Exotic Birds', image: 'https://res.cloudinary.com/dvyuplyck/image/upload/f_auto,q_auto:best,dpr_auto,w_400/v1777213298/ANU_PET_SHOP/Navigation_Icons/temp_Exotic_Birds_yrcrtf.webp' },
    { name: 'GUINEA PIGS', folder: 'Guinea Pig', image: 'https://res.cloudinary.com/dvyuplyck/image/upload/f_auto,q_auto:best,dpr_auto,w_400/v1777213305/ANU_PET_SHOP/Navigation_Icons/temp_Guinea_Pig_pbifwl.webp' },
    { name: 'HAMSTERS', folder: 'Hamster', image: 'https://res.cloudinary.com/dvyuplyck/image/upload/f_auto,q_auto:best,dpr_auto,w_400/v1777213324/ANU_PET_SHOP/Navigation_Icons/temp_Hamster_lrjn40.webp' },
  ], []);

  return (
    <motion.div 
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-96 bg-black/5 backdrop-blur-3xl rounded-l-[40px] p-8 h-[85vh] flex flex-col gap-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] border-l border-white/5 my-auto z-30 overflow-y-auto gold-scrollbar scroll-smooth"
    >
      <div>
        <h4 className="text-[10px] font-black tracking-[0.5em] opacity-40 uppercase mb-12 border-b border-white/5 pb-2 text-right">PET INVENTORY</h4>
        <div className="flex flex-col gap-16 items-end pr-2">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.name}
              className="relative group cursor-pointer"
              whileHover="hover"
              initial="initial"
              onClick={() => onCategoryClick(cat.folder)}
            >
              {/* Image Card */}
              <motion.div
                variants={{
                  initial: { scale: 1, zIndex: 1 },
                  hover: { scale: 1.05, zIndex: 50 }
                }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                className="w-48 h-48 rounded-3xl overflow-hidden border border-gold/40 glass-dark shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative"
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="200px"
                  priority={idx < 5}
                  loading={idx < 5 ? "eager" : "lazy"}
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Frosted Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              </motion.div>

              {/* Category Name */}
              <motion.div
                variants={{
                  initial: { opacity: 0, y: 10 },
                  hover: { opacity: 1, y: 0 }
                }}
                className="absolute -bottom-8 right-0 text-right w-full"
              >
                <span className="text-[12px] font-bold tracking-[0.4em] text-gold uppercase drop-shadow-glow">
                  {cat.name}
                </span>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default function Home() {
  const [currentTheme, setCurrentTheme] = useState(themes[0]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBreed, setSelectedBreed] = useState<any | null>(null);
  const [hasMounted, setHasMounted] = useState(false);
  const orbitRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setTimeout(() => {
      orbitRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  useEffect(() => {
    if (!hasMounted) return;
    const root = document.documentElement;
    root.style.setProperty("--background", currentTheme.bg);
    root.style.setProperty("--foreground", currentTheme.fg);
    root.style.setProperty("--gold", currentTheme.gold);
    root.style.setProperty("--secondary", currentTheme.fg);
    root.style.setProperty("--font-primary", currentTheme.font);
    root.style.setProperty("--font-body", currentTheme.bodyFont);
  }, [currentTheme, hasMounted]);

  if (!hasMounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gold mb-4">Loading...</h1>
          <Diamond className="text-gold animate-pulse mx-auto" size={64} />
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen selection:bg-gold/20 relative transition-colors duration-1000 bg-black">
      {/* Subtle Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]" />
      
      <ThemeSelector currentTheme={currentTheme} onThemeChange={setCurrentTheme} />
      
      {/* HERO SECTION */}
      <section className="relative h-screen flex justify-between px-12 z-10 overflow-hidden">
        <LeftNavigation onCategoryClick={handleCategoryClick} />
        
        <div className="flex-1 flex flex-col items-center justify-center p-8 mx-12">
          <GlitterLogo />
          
          <div className="w-full flex-1 flex items-center justify-center">
            <VideoHero theme={currentTheme} isShifted={!!selectedCategory} />
          </div>
        </div>

        <RightNavigation onCategoryClick={handleCategoryClick} />

        {/* Bouncing Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            repeatType: "reverse",
            ease: "easeInOut"
          }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 cursor-pointer z-50 flex flex-col items-center gap-2"
          onClick={() => {
            window.scrollTo({
              top: window.innerHeight,
              behavior: 'smooth'
            });
          }}
        >
          <span className="text-[10px] tracking-[0.4em] uppercase text-gold/40 font-black">Explore</span>
          <ChevronDown className="text-gold" size={24} />
        </motion.div>
      </section>

      {/* Pet Gallery Container */}
      <AnimatePresence>
        {selectedCategory && (
          <div ref={orbitRef} className="bg-black min-h-screen">
            <PetGallery 
              category={selectedCategory} 
              onBreedClick={(breed: any) => {
                setSelectedBreed(breed);
              }}
              onClose={() => setSelectedCategory(null)}
            />
          </div>
        )}
      </AnimatePresence>

      {/* NEW CINEMATIC SECTIONS INFRASTRUCTURE */}
      <section className="min-h-screen bg-black relative flex items-center justify-center border-t border-white/5">
        <div className="text-center">
          <h2 className="text-4xl font-black tracking-[0.3em] gold-glitter uppercase" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
            The Heritage
          </h2>
        </div>
      </section>

      <section className="min-h-screen bg-black relative flex items-center justify-center border-t border-white/5">
        <div className="text-center">
          <h2 className="text-4xl font-black tracking-[0.3em] gold-glitter uppercase" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
            Pure Bloodlines
          </h2>
        </div>
      </section>

      <section className="min-h-screen bg-black relative flex items-center justify-center border-t border-white/5">
        <div className="text-center">
          <h2 className="text-4xl font-black tracking-[0.3em] gold-glitter uppercase" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
            Luxury Care
          </h2>
        </div>
      </section>

      <section className="min-h-screen bg-black relative flex items-center justify-center border-t border-white/5">
        <div className="text-center">
          <h2 className="text-4xl font-black tracking-[0.3em] gold-glitter uppercase" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
            Exclusive Club
          </h2>
        </div>
      </section>

      {/* Details Section */}
      <AnimatePresence>
        {selectedBreed && (
          <BreedDetailsSection 
            breed={selectedBreed} 
            onClose={() => {
              setSelectedBreed(null);
              if (['Guinea Pig', 'Hamster'].includes(selectedCategory || '')) {
                setSelectedCategory(null);
              }
            }}
          />
        )}
      </AnimatePresence>

      {/* Pet Showroom */}
      <PetShowroom />

      {/* Pet Essentials Store */}
      <PetEssentialsStore />

      {/* Premium Footer */}
      <PremiumFooter />

      {/* AI Chatbot */}
      <AIChatbot />

      {/* Theme Switcher */}
      <ThemeSwitcher />

      {/* Minimal Footer Removed or moved inside PremiumFooter */}
      {/* Premium Footer Elements */}
      <div className="fixed bottom-10 left-10 flex gap-6 z-40">
        <ShoppingBag className="text-gold cursor-pointer hover:scale-110 transition-transform" />
        <Menu className="text-gold cursor-pointer hover:scale-110 transition-transform" />
      </div>
      
      <div className="fixed bottom-10 right-10 flex flex-col items-end gap-2 z-40">
        <div className="flex gap-4 mb-2">
          <Phone size={20} className="text-gold" />
          <Camera size={20} className="text-gold" />
        </div>
        <p className="text-[10px] tracking-[0.4em] uppercase opacity-40">Luxury Pet Experience</p>
      </div>
    </main>
  );
}
