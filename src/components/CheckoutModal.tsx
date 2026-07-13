import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CreditCard, CheckCircle, Building } from 'lucide-react';
import { SiteSettings } from '../types';

interface CheckoutModalProps {
  settings: SiteSettings;
  isOpen: boolean;
  onClose: () => void;
  total: number;
  onSuccess: () => void;
}

export function CheckoutModal({ settings, isOpen, onClose, total, onSuccess }: CheckoutModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mercadopago' | 'transfer'>('card');

  const hasMercadoPago = !!settings.mercadopagoToken;
  const hasTransfer = !!settings.mercadopagoAlias;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      
      // Auto close after success
      setTimeout(() => {
        onSuccess();
        setIsSuccess(false);
        setPaymentMethod('card');
      }, 3000);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!isProcessing ? onClose : undefined}
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-black/5 max-h-[90vh] overflow-y-auto"
          >
            {isSuccess ? (
              <div className="p-12 text-center flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                >
                  <CheckCircle size={80} className="text-gray-900 mb-6" />
                </motion.div>
                <h3 className="text-2xl font-extrabold text-gray-900 mb-2">
                  {paymentMethod === 'transfer' ? '¡Orden Recibida!' : '¡Pago Exitoso!'}
                </h3>
                <p className="text-gray-500 font-medium">
                  {paymentMethod === 'transfer' 
                    ? 'Por favor, realiza la transferencia. Nos comunicaremos para validar tu pago.' 
                    : 'Gracias por tu compra. Te enviaremos un correo con los detalles.'}
                </p>
              </div>
            ) : (
              <>
                <div className="bg-gray-50 p-6 border-b border-black/5 flex justify-between items-center sticky top-0 z-10">
                  <h3 className="text-xl font-bold text-gray-900">Finalizar Compra</h3>
                  <button onClick={onClose} disabled={isProcessing} className="text-gray-400 hover:text-gray-900 transition-colors">
                    <X size={24} />
                  </button>
                </div>
                
                <div className="p-6">
                  <div className="bg-gray-50 p-5 rounded-2xl mb-6 border border-black/5">
                    <p className="text-sm font-semibold text-gray-500">Total a pagar</p>
                    <p className="text-3xl font-bold text-gray-900">${total.toFixed(2)}</p>
                  </div>

                  <div className="mb-6 space-y-3">
                    <h4 className="font-semibold text-sm text-gray-900 uppercase tracking-wider">Método de pago</h4>
                    <div className="grid grid-cols-1 gap-3">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${paymentMethod === 'card' ? 'border-gray-900 bg-white' : 'border-black/5 hover:border-black/10 bg-gray-50/50'}`}
                      >
                        <CreditCard size={20} className={paymentMethod === 'card' ? 'text-gray-900' : 'text-gray-400'} />
                        <span className={`font-semibold ${paymentMethod === 'card' ? 'text-gray-900' : 'text-gray-500'}`}>Tarjeta de crédito o débito</span>
                      </button>
                      
                      {hasMercadoPago && (
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('mercadopago')}
                          className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${paymentMethod === 'mercadopago' ? 'border-gray-900 bg-white' : 'border-black/5 hover:border-black/10 bg-gray-50/50'}`}
                        >
                          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">MP</div>
                          <span className={`font-semibold ${paymentMethod === 'mercadopago' ? 'text-gray-900' : 'text-gray-500'}`}>Mercado Pago</span>
                        </button>
                      )}
                      
                      {hasTransfer && (
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('transfer')}
                          className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${paymentMethod === 'transfer' ? 'border-gray-900 bg-white' : 'border-black/5 hover:border-black/10 bg-gray-50/50'}`}
                        >
                          <Building size={20} className={paymentMethod === 'transfer' ? 'text-gray-900' : 'text-gray-400'} />
                          <span className={`font-semibold ${paymentMethod === 'transfer' ? 'text-gray-900' : 'text-gray-500'}`}>Transferencia (Alias/CBU)</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {paymentMethod === 'card' && (
                      <div className="space-y-4">
                        <input required type="text" placeholder="Nombre en la tarjeta" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-medium bg-gray-50 focus:bg-white transition-colors" />
                        <input required type="text" placeholder="Número de tarjeta" maxLength={19} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-medium bg-gray-50 focus:bg-white transition-colors" />
                        <div className="flex gap-4">
                          <input required type="text" placeholder="MM/AA" maxLength={5} className="w-1/2 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-medium bg-gray-50 focus:bg-white transition-colors" />
                          <input required type="text" placeholder="CVC" maxLength={4} className="w-1/2 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-medium bg-gray-50 focus:bg-white transition-colors" />
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'mercadopago' && (
                      <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-center text-sm text-blue-800 font-medium">
                        Serás redirigido a Mercado Pago para completar tu compra de forma segura una vez que confirmes el pago.
                      </div>
                    )}

                    {paymentMethod === 'transfer' && (
                      <div className="bg-gray-50 border border-gray-100 p-5 rounded-xl text-sm text-gray-700">
                        <p className="mb-3 font-semibold text-gray-900">Datos para la transferencia:</p>
                        <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-between shadow-sm">
                          <span className="font-mono text-gray-900 font-bold text-lg tracking-wide">{settings?.mercadopagoAlias}</span>
                        </div>
                        <p className="mt-4 text-xs text-gray-500 font-medium">Realiza la transferencia por el total y luego confirma haciendo clic en el botón inferior.</p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold text-base hover:bg-gray-800 transition-colors disabled:opacity-70 flex justify-center items-center mt-8 active:scale-[0.98]"
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
                        paymentMethod === 'transfer' ? 'He realizado la transferencia' : 'Confirmar Pago'
                      )}
                    </button>
                  </form>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
