"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, X, Check } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

const themes = [
  { id: 'luxury-gold', name: 'Luxury Gold', color: '#d4af37', bg: '#050505' },
  { id: 'nature-green', name: 'Nature Green', color: '#4caf50', bg: '#0d1a0d' },
  { id: 'modern-minimal', name: 'Modern Minimal', color: '#000000', bg: '#ffffff' },
  { id: 'playful-blue', name: 'Playful Blue', color: '#3b82f6', bg: '#f0f7ff' },
] as const;

const ThemeSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <div className="fixed bottom-10 left-10 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-16 left-0 glass p-4 rounded-2xl min-w-[200px] shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4 px-2">
              <span className="text-xs font-bold uppercase tracking-widest opacity-50">Select Theme</span>
              <button onClick={() => setIsOpen(false)} className="opacity-50 hover:opacity-100 transition-opacity">
                <X size={14} />
              </button>
            </div>
            <div className="space-y-2">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setTheme(t.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all group ${
                    theme === t.id ? 'bg-white/10' : 'hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full border border-white/20" 
                      style={{ backgroundColor: t.color }}
                    />
                    <span className={`text-sm font-medium ${theme === t.id ? 'text-white' : 'opacity-70 group-hover:opacity-100'}`}>
                      {t.name}
                    </span>
                  </div>
                  {theme === t.id && <Check size={14} className="text-white" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 glass rounded-full flex items-center justify-center shadow-xl group hover:border-white/20 transition-all"
      >
        <Wand2 
          size={20} 
          className={`transition-all duration-500 ${isOpen ? 'rotate-45 text-white' : 'text-gold'}`} 
          style={{ color: !isOpen ? 'var(--accent)' : 'white' }}
        />
      </motion.button>
    </div>
  );
};

export default ThemeSwitcher;
