"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Diamond, User, Bot, ChevronRight } from "lucide-react";

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const FAQS = [
  { q: "Shop timings?", a: "We are open from 10:00 AM to 9:00 PM every day, including Sundays." },
  { q: "Best food for Golden Retriever?", a: "For Golden Retrievers, we highly recommend Royal Canin Golden Retriever Adult or Arden Grange Large Breed. Both provide optimal joint support and coat health." },
  { q: "Do you have Persian Cats?", a: "Yes, we specialize in premium Persian bloodlines, including Doll-face and Semi-doll face varieties. Check our Gallery section!" },
  { q: "Shipping available?", a: "We provide specialized pet-safe transportation within the city. For food and essentials, we offer PAN-India shipping." },
  { q: "Vet consultation?", a: "Yes, we have in-house veterinary experts available for consultations from 4 PM to 7 PM, Monday to Saturday." },
  { q: "Puppy prices?", a: "Prices vary based on breed and lineage. Please visit us for a detailed consultation or call our concierge at +91 98765 43210." },
  { q: "Kitten food?", a: "We stock Whiskas Junior, Me-O Kitten, and Royal Canin Mother & Babycat for the best start for your feline friends." },
  { q: "Exotic birds available?", a: "We have a curated selection of Macaws, African Greys, and Sun Conures. All our birds are ethically sourced and health-certified." },
];

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Welcome to ANU PET SHOP Concierge. How may I assist you with your premium pet needs today?", sender: 'bot', timestamp: new Date() }
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { id: Date.now(), text, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputValue("");

    // Simulate bot thinking
    setTimeout(() => {
      const response = findResponse(text);
      const botMsg: Message = { id: Date.now() + 1, text: response, sender: 'bot', timestamp: new Date() };
      setMessages(prev => [...prev, botMsg]);
    }, 600);
  };

  const findResponse = (query: string) => {
    const q = query.toLowerCase();
    const match = FAQS.find(f => q.includes(f.q.toLowerCase().replace('?', '')) || f.q.toLowerCase().includes(q));
    return match ? match.a : "That's a great question. For specific details on that, I recommend speaking with our boutique manager directly at +91 98765 43210. Would you like to know about our shop timings or current pet collections?";
  };

  return (
    <div className="fixed bottom-10 right-10 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-20 right-0 w-[400px] h-[600px] bg-[var(--background)] backdrop-blur-2xl border border-[var(--accent)]/30 rounded-[32px] shadow-[0_20px_80px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden transition-colors duration-1000"
          >
            {/* Header */}
            <div className="p-6 border-b border-[var(--accent)]/10 bg-[var(--accent)]/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[var(--accent)]/10 border border-[var(--accent)]/30 flex items-center justify-center relative">
                  <Bot size={24} className="text-[var(--accent)]" />
                  <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[var(--background)]" />
                </div>
                <div>
                  <h3 className="text-[var(--foreground)] font-bold tracking-wide">ANU Concierge</h3>
                  <p className="text-[var(--accent)]/50 text-[10px] tracking-widest uppercase font-bold">Always Online</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-[var(--foreground)]/30 hover:text-[var(--foreground)] transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 gold-scrollbar">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, x: msg.sender === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'user' ? 'bg-[var(--accent)]/20' : 'bg-[var(--foreground)]/5 border border-[var(--card-border)]'}`}>
                      {msg.sender === 'user' ? <User size={14} className="text-[var(--accent)]" /> : <Bot size={14} className="text-[var(--accent)]" />}
                    </div>
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.sender === 'user' ? 'bg-[var(--accent)] text-[var(--background)] font-medium rounded-tr-none' : 'bg-[var(--foreground)]/5 border border-[var(--card-border)] text-[var(--foreground)]/80 rounded-tl-none'}`}>
                      {msg.text}
                    </div>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="px-6 py-4 flex gap-2 overflow-x-auto no-scrollbar border-t border-[var(--accent)]/5">
              {FAQS.slice(0, 4).map((faq, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(faq.q)}
                  className="whitespace-nowrap px-4 py-2 rounded-full bg-[var(--foreground)]/5 border border-[var(--card-border)] text-[var(--foreground)]/40 text-[10px] tracking-wider uppercase font-bold hover:border-[var(--accent)]/30 hover:text-[var(--accent)] transition-all"
                >
                  {faq.q}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-6 border-t border-[var(--accent)]/10 bg-[var(--accent)]/5">
              <div className="relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend(inputValue)}
                  placeholder="Type your message..."
                  className="w-full bg-[var(--background)]/50 border border-[var(--accent)]/20 rounded-2xl py-4 pl-6 pr-14 text-[var(--foreground)] placeholder:text-[var(--foreground)]/20 focus:outline-none focus:border-[var(--accent)]/50 transition-all"
                />
                <button
                  onClick={() => handleSend(inputValue)}
                  className="absolute right-2 top-2 bottom-2 w-10 bg-[var(--accent)] rounded-xl flex items-center justify-center text-[var(--background)] hover:scale-105 transition-transform"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-full bg-[var(--accent)] shadow-[0_10px_40px_var(--accent-glow)] flex items-center justify-center text-[var(--background)] relative group transition-colors duration-1000"
      >
        <div className="absolute inset-0 rounded-full animate-ping bg-[var(--accent)]/30 group-hover:hidden" />
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </motion.button>
    </div>
  );
};

export default AIChatbot;
