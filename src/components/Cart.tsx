import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem } from '../types';
import { X, Minus, Plus, ShoppingBag, CreditCard, ShieldCheck } from 'lucide-react';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, newQuantity: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
}

export function Cart({ isOpen, onClose, items, onUpdateQuantity, onRemoveItem, onCheckout }: CartProps) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal; // Add tax/shipping here if needed

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-akari-brown/40 backdrop-blur-sm z-50"
          />

          {/* Cart Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white/80 backdrop-blur-xl shadow-2xl z-50 flex flex-col border-l border-white/40"
          >
            {/* Header */}
            <div className="p-6 flex items-center justify-between border-b border-white/40">
              <h2 className="text-2xl font-bold text-akari-brown flex items-center gap-2">
                <ShoppingBag className="text-akari-orange" /> Tu Carrito
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-akari-brown hover:bg-akari-cream rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-24 h-24 bg-akari-cream rounded-full flex items-center justify-center text-akari-orange opacity-50">
                    <ShoppingBag size={48} />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-akari-brown">Tu carrito está vacío</p>
                    <p className="text-sm text-gray-500 mt-1">¡Es hora de añadir cosas lindas!</p>
                  </div>
                  <button 
                    onClick={onClose}
                    className="mt-4 px-6 py-2 bg-akari-green text-white rounded-full font-bold hover:bg-akari-green-dark transition-colors"
                  >
                    Ir a la tienda
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 bg-white/50 backdrop-blur-sm p-3 rounded-2xl border border-white/60 shadow-sm relative group">
                      <button 
                        onClick={() => onRemoveItem(item.id)}
                        className="absolute -top-2 -right-2 bg-white text-gray-400 hover:text-red-500 rounded-full shadow-md p-1 opacity-0 group-hover:opacity-100 transition-opacity border border-gray-100"
                      >
                        <X size={16} strokeWidth={3} />
                      </button>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-xl bg-akari-cream"
                      />
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <h3 className="font-bold text-akari-brown text-sm line-clamp-2 leading-tight">{item.name}</h3>
                          <p className="text-akari-green-outline font-extrabold mt-1">${item.price.toFixed(2)}</p>
                        </div>
                        
                        <div className="flex items-center gap-3 bg-akari-cream rounded-lg w-max p-1">
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-white rounded-md text-akari-brown transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={14} strokeWidth={3} />
                          </button>
                          <span className="font-bold text-sm w-4 text-center text-akari-brown">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-white rounded-md text-akari-brown transition-colors"
                            disabled={item.quantity >= item.inventory} // Respect inventory
                          >
                            <Plus size={14} strokeWidth={3} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 bg-akari-cream/50 border-t border-akari-orange-light">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-semibold text-akari-brown">Total a pagar</span>
                  <span className="text-2xl font-extrabold text-akari-green-outline">
                    ${total.toFixed(2)}
                  </span>
                </div>
                
                <button
                  onClick={onCheckout}
                  className="w-full py-4 px-6 bg-akari-green text-white rounded-2xl font-bold text-lg hover:bg-akari-green-dark transition-all transform active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-akari-green/20"
                >
                  <CreditCard size={20} />
                  Pagar Ahora
                </button>
                
                <div className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold text-gray-500">
                  <ShieldCheck size={16} className="text-akari-green" />
                  <span>Pago 100% seguro y encriptado</span>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
