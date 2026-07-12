import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, X } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  onSuccess: () => void;
}

export function CheckoutModal({ isOpen, onClose, total, onSuccess }: CheckoutModalProps) {
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate secure payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      
      // Close and clear cart after success
      setTimeout(() => {
        onSuccess();
      }, 2500);
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!isProcessing && !isSuccess ? onClose : undefined}
            className="absolute inset-0 bg-akari-brown/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-white/60"
          >
            {isSuccess ? (
              <div className="p-10 text-center flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                >
                  <CheckCircle size={80} className="text-akari-green mb-6" />
                </motion.div>
                <h3 className="text-2xl font-extrabold text-akari-brown mb-2">¡Pago Exitoso!</h3>
                <p className="text-gray-500 font-medium">
                  Gracias por tu compra. Te enviaremos un correo con los detalles.
                </p>
              </div>
            ) : (
              <>
                <div className="bg-akari-cream p-6 border-b border-akari-orange-light flex justify-between items-center">
                  <h3 className="text-xl font-bold text-akari-brown">Pasarela Segura</h3>
                  <button onClick={onClose} disabled={isProcessing} className="text-gray-400 hover:text-akari-brown">
                    <X size={24} />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div className="bg-akari-green/10 p-4 rounded-xl mb-6">
                    <p className="text-sm font-semibold text-akari-green-dark">Total a pagar</p>
                    <p className="text-3xl font-extrabold text-akari-green-outline">${total.toFixed(2)}</p>
                  </div>

                  <div className="space-y-3">
                    <input required type="text" placeholder="Nombre en la tarjeta" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-akari-orange focus:border-transparent font-medium" />
                    <input required type="text" placeholder="Número de tarjeta" maxLength={19} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-akari-orange focus:border-transparent font-medium" />
                    <div className="flex gap-3">
                      <input required type="text" placeholder="MM/AA" maxLength={5} className="w-1/2 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-akari-orange focus:border-transparent font-medium" />
                      <input required type="text" placeholder="CVC" maxLength={4} className="w-1/2 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-akari-orange focus:border-transparent font-medium" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full mt-6 py-4 bg-akari-orange text-white rounded-xl font-bold text-lg hover:bg-akari-orange/90 transition-colors disabled:opacity-70 flex justify-center items-center"
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Procesando...
                      </span>
                    ) : (
                      'Confirmar Pago'
                    )}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
