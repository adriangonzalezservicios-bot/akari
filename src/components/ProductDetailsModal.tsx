import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';
import { X, ShieldCheck } from 'lucide-react';

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
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden border border-black/5"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-white hover:bg-gray-50 text-gray-400 rounded-full transition-colors shadow-sm border border-black/5"
            >
              <X size={20} strokeWidth={2.5} />
            </button>

            {/* Product Image */}
            <div className="w-full md:w-1/2 p-10 flex items-center justify-center bg-gray-50/50">
              <div className="aspect-square w-full relative">
                <img src={product.image} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
              </div>
            </div>

            {/* Product Info Section */}
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center border-l border-black/5">
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">
                    {product.category}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">{product.name}</h2>
                  <p className="text-2xl font-bold text-gray-900 mt-4">${product.price.toFixed(2)}</p>
                  <p className="text-sm font-medium text-gray-500 mt-1">12 cuotas sin interés de ${(product.price/12).toFixed(2)}</p>
                </div>

                <div className="w-12 h-1 bg-gray-200 rounded-full"></div>

                <p className="text-gray-600 text-sm md:text-base leading-relaxed font-medium">{product.description}</p>
                
                <div className="pt-6">
                  <button
                    onClick={() => {
                      onAddToCart(product);
                      onClose();
                    }}
                    disabled={product.inventory === 0}
                    className={`w-full py-4 rounded-xl font-bold text-base transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm ${
                      product.inventory === 0 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}
                  >
                    {product.inventory === 0 ? 'Agotado' : 'Agregar al carrito'}
                  </button>
                </div>
                
                <div className="flex items-center gap-2 text-xs font-medium text-gray-400 pt-2">
                  <ShieldCheck size={16} className="text-green-600" />
                  <span>Garantía oficial y devoluciones gratis</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
