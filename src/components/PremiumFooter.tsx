"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Instagram, Facebook, Twitter, Diamond } from "lucide-react";

const PremiumFooter = () => {
  return (
    <footer className="bg-[var(--background)] pt-24 pb-12 relative overflow-hidden border-t border-[var(--card-border)] transition-colors duration-1000">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--accent)]/20 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 md:px-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Brand Column */}
          <div className="col-span-1 lg:col-span-1">
            <div className="mb-8">
              <h3 className="text-4xl font-black tracking-tighter gold-glitter mb-2" style={{ fontFamily: 'var(--font-cinzel), serif' }}>ANU</h3>
              <p className="text-sm tracking-[0.5em] opacity-70 uppercase font-black text-[var(--foreground)]">Pet Shop</p>
            </div>
            <p className="text-[var(--foreground)]/40 text-sm leading-relaxed mb-8 max-w-xs">
              Curating the world's most exquisite bloodlines and premium nutrition for your distinguished companions.
            </p>
            <div className="flex gap-6">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ y: -5, color: "var(--accent)" }}
                  className="text-[var(--foreground)]/30 transition-colors"
                >
                  <Icon size={20} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[var(--accent)] text-[10px] tracking-[0.4em] font-black uppercase mb-8">Navigation</h4>
            <ul className="flex flex-col gap-4">
              {['The Heritage', 'Pet Gallery', 'Nutrition Store', 'Luxury Care'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-[var(--foreground)]/50 hover:text-[var(--accent)] text-sm transition-colors duration-300">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-span-1 lg:col-span-2">
            <h4 className="text-[var(--accent)] text-[10px] tracking-[0.4em] font-black uppercase mb-8">Establishment</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex gap-4">
                <div className="p-3 rounded-xl bg-[var(--foreground)]/5 border border-[var(--card-border)] h-fit">
                  <MapPin size={18} className="text-[var(--accent)]" />
                </div>
                <div>
                  <p className="text-[var(--foreground)] font-medium mb-1">Visit Us</p>
                  <p className="text-[var(--foreground)]/40 text-sm leading-relaxed">
                    ANU PET SHOP,<br />
                    Elite Plaza, MG Road,<br />
                    Mumbai, Maharashtra 400001
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-6">
                <div className="flex gap-4">
                  <div className="p-3 rounded-xl bg-[var(--foreground)]/5 border border-[var(--card-border)] h-fit">
                    <Phone size={18} className="text-[var(--accent)]" />
                  </div>
                  <div>
                    <p className="text-[var(--foreground)] font-medium mb-1">Inquiries</p>
                    <p className="text-[var(--foreground)]/40 text-sm">+91 98765 43210</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="p-3 rounded-xl bg-[var(--foreground)]/5 border border-[var(--card-border)] h-fit">
                    <Mail size={18} className="text-[var(--accent)]" />
                  </div>
                  <div>
                    <p className="text-[var(--foreground)] font-medium mb-1">Concierge</p>
                    <p className="text-[var(--foreground)]/40 text-sm">info@anupetshop.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-[var(--card-border)] flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[var(--foreground)]/20 text-[10px] tracking-[0.4em] uppercase font-bold">
            &copy; 2026 ANU PET SHOP. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-4">
            <Diamond size={10} className="text-[var(--accent)]/20" />
            <span className="text-[var(--foreground)]/20 text-[10px] tracking-[0.4em] uppercase font-bold">Handcrafted for Excellence</span>
            <Diamond size={10} className="text-[var(--accent)]/20" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PremiumFooter;
