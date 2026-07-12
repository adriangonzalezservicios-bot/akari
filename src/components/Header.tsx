import React, { useState } from 'react';
import { ShoppingCart, Menu, X, User, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  cartItemCount: number;
  onOpenCart: () => void;
  logoUrl?: string;
}

export function Header({ cartItemCount, onOpenCart, logoUrl }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/60 backdrop-blur-md border-b border-white/30 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
            {logoUrl ? (
              <img src={logoUrl} alt="Akari Logo" className="h-20 object-contain" />
            ) : (
              <div className="text-2xl font-extrabold text-akari-green-outline tracking-tight flex items-center gap-2">
                <span className="text-akari-orange text-3xl">🦊</span> AKARI
              </div>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-akari-brown font-semibold hover:text-akari-green transition-colors">Inicio</a>
            <a href="#shop" className="text-akari-brown font-semibold hover:text-akari-green transition-colors">Tienda</a>
            <a href="#featured" className="text-akari-brown font-semibold hover:text-akari-green transition-colors">Destacados</a>
            <a href="#about" className="text-akari-brown font-semibold hover:text-akari-green transition-colors">Nosotros</a>
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-5">
            <button className="text-akari-brown hover:text-akari-orange transition-colors">
              <Search size={22} strokeWidth={2.5} />
            </button>
            <button className="text-akari-brown hover:text-akari-orange transition-colors hidden sm:block">
              <User size={22} strokeWidth={2.5} />
            </button>
            <button 
              className="relative text-akari-brown hover:text-akari-orange transition-colors group"
              onClick={onOpenCart}
            >
              <ShoppingCart size={24} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-akari-orange text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-akari-cream">
                  {cartItemCount}
                </span>
              )}
            </button>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-akari-brown hover:text-akari-green"
              >
                {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/70 backdrop-blur-md border-b border-white/30 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-4 space-y-1">
              <a href="#" className="block px-3 py-2 rounded-md text-base font-semibold text-akari-brown hover:text-akari-green hover:bg-akari-cream">Inicio</a>
              <a href="#shop" className="block px-3 py-2 rounded-md text-base font-semibold text-akari-brown hover:text-akari-green hover:bg-akari-cream">Tienda</a>
              <a href="#featured" className="block px-3 py-2 rounded-md text-base font-semibold text-akari-brown hover:text-akari-green hover:bg-akari-cream">Destacados</a>
              <a href="#about" className="block px-3 py-2 rounded-md text-base font-semibold text-akari-brown hover:text-akari-green hover:bg-akari-cream">Nosotros</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
