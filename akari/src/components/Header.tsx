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
    <header className="sticky top-0 z-40 w-full bg-white border-b border-black/5 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
            {logoUrl ? (
              <img src={logoUrl} alt="Akari Logo" className="h-12 object-contain" />
            ) : (
              <div className="text-xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
                <span className="text-akari-orange text-2xl">🦊</span> AKARI
              </div>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Inicio</a>
            <a href="#shop" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Tienda</a>
            <a href="#featured" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Destacados</a>
            <a href="#about" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Nosotros</a>
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-5">
            <button className="text-gray-500 hover:text-gray-900 transition-colors">
              <Search size={20} strokeWidth={2} />
            </button>
            <button className="text-gray-500 hover:text-gray-900 transition-colors hidden sm:block">
              <User size={20} strokeWidth={2} />
            </button>
            <button 
              className="relative text-gray-500 hover:text-gray-900 transition-colors group"
              onClick={onOpenCart}
            >
              <ShoppingCart size={20} strokeWidth={2} className="group-hover:scale-110 transition-transform" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-akari-orange text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center ring-2 ring-white">
                  {cartItemCount}
                </span>
              )}
            </button>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-500 hover:text-gray-900"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
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
            className="md:hidden bg-white border-b border-black/5 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-4 space-y-1">
              <a href="#" className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Inicio</a>
              <a href="#shop" className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Tienda</a>
              <a href="#featured" className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Destacados</a>
              <a href="#about" className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Nosotros</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
