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
  const total = subtotal;

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
            className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50"
          />

          {/* Cart Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl z-50 flex flex-col border-l border-black/5"
          >
            {/* Header */}
            <div className="p-6 flex items-center justify-between border-b border-black/5">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <ShoppingBag className="text-gray-900" size={24} /> Tu Carrito
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-2">
                    <ShoppingBag size={32} />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">Tu carrito está vacío</p>
                    <p className="text-sm text-gray-500 mt-2">¡Es hora de añadir cosas lindas!</p>
                  </div>
                  <button 
                    onClick={onClose}
                    className="mt-6 px-6 py-2.5 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                  >
                    Ir a la tienda
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 rounded-xl border border-black/5 bg-gray-50/30 relative group">
                      <button 
                        onClick={() => onRemoveItem(item.id)}
                        className="absolute -top-2 -right-2 bg-white text-gray-400 hover:text-red-500 rounded-full shadow-sm p-1.5 opacity-0 group-hover:opacity-100 transition-opacity border border-black/5"
                      >
                        <X size={14} strokeWidth={2.5} />
                      </button>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-contain rounded-lg bg-white border border-black/5 p-2 mix-blend-multiply"
                      />
                      <div className="flex-1 flex flex-col justify-between py-0.5">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 leading-tight">{item.name}</h3>
                          <p className="text-gray-900 font-bold mt-1.5">${item.price.toFixed(2)}</p>
                        </div>
                        
                        <div className="flex items-center gap-3 bg-white border border-black/5 rounded-md w-max p-1 mt-2">
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-gray-50 rounded text-gray-500 transition-colors disabled:opacity-50"
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={14} strokeWidth={2.5} />
                          </button>
                          <span className="font-semibold text-sm w-4 text-center text-gray-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-gray-50 rounded text-gray-500 transition-colors disabled:opacity-50"
                            disabled={item.quantity >= item.inventory}
                          >
                            <Plus size={14} strokeWidth={2.5} />
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
              <div className="p-6 bg-gray-50 border-t border-black/5">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-base font-semibold text-gray-500">Total a pagar</span>
                  <span className="text-2xl font-bold text-gray-900">
                    ${total.toFixed(2)}
                  </span>
                </div>
                
                <button
                  onClick={onCheckout}
                  className="w-full py-3.5 px-6 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm"
                >
                  <CreditCard size={18} />
                  Pagar Ahora
                </button>
                
                <div className="mt-5 flex items-center justify-center gap-2 text-xs font-medium text-gray-400">
                  <ShieldCheck size={16} className="text-green-600" />
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
