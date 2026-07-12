import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';
import { X } from 'lucide-react';

interface ProductDetailsModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export function ProductDetailsModal({ product, isOpen, onClose, onAddToCart }: ProductDetailsModalProps) {
  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-akari-brown/40 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden border border-white/60"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-white/50 hover:bg-white text-gray-500 rounded-full transition-colors shadow-sm"
            >
              <X size={24} />
            </button>

            {/* Product Image */}
            <div className="w-full md:w-1/2 p-6 md:p-8 flex items-center justify-center bg-white/50 border-r border-white/40">
              <div className="aspect-square w-full relative">
                <img src={product.image} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
              </div>
            </div>

            {/* Product Info Section */}
            <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-akari-brown leading-tight">{product.name}</h2>
                  <p className="text-xl font-bold text-akari-green mt-2">${product.price.toFixed(2)}</p>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
                
                <div className="pt-6">
                  <button
                    onClick={() => {
                      onAddToCart(product);
                      onClose();
                    }}
                    disabled={product.inventory === 0}
                    className="w-full py-4 bg-akari-green text-white rounded-xl font-bold text-lg hover:bg-akari-green-dark transition-colors disabled:opacity-50 shadow-lg shadow-akari-green/20"
                  >
                    {product.inventory === 0 ? 'Agotado' : 'Agregar al carrito'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
