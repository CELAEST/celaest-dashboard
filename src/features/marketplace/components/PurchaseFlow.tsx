'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, ShieldCheck, CreditCard, Download, Loader } from 'lucide-react';
import { useTheme } from '@/features/shared/contexts/ThemeContext';
import { Progress } from '@/components/ui/progress';
import { hapticFeedback } from '@/features/shared/utils/sound-effects';
import { SuccessConfetti } from '@/features/shared/components/SuccessConfetti';

interface PurchaseFlowProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    title: string;
    price: string;
    image: string;
  } | null;
}

export const PurchaseFlow: React.FC<PurchaseFlowProps> = ({ isOpen, onClose, product }) => {
  const { theme } = useTheme();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchaseComplete, setPurchaseComplete] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const steps = [
    { number: 1, title: 'Confirmación', icon: <CheckCircle size={18} /> },
    { number: 2, title: 'Pago Seguro', icon: <CreditCard size={18} /> },
    { number: 3, title: 'Activación', icon: <Download size={18} /> }
  ];

  const handlePurchase = () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setStep(3);
      
      // Simulate activation
      setTimeout(() => {
        setPurchaseComplete(true);
        setShowConfetti(true);
        // Haptic feedback on success
        hapticFeedback('medium');
        
        // Hide confetti after animation
        setTimeout(() => setShowConfetti(false), 2000);
      }, 2000);
    }, 3000);
  };

  const resetFlow = () => {
    setStep(1);
    setIsProcessing(false);
    setPurchaseComplete(false);
    setShowConfetti(false);
    onClose();
  };

  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <SuccessConfetti active={showConfetti} />
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={resetFlow}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`
              fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50
              w-[90%] max-w-2xl rounded-3xl overflow-hidden
              ${theme === 'dark' 
                ? 'bg-[#0a0a0a] border border-white/10' 
                : 'bg-white border border-gray-200 shadow-2xl'
              }
            `}
          >
            {/* Close Button */}
            <button
              onClick={resetFlow}
              className={`
                absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-colors
                ${theme === 'dark' 
                  ? 'bg-white/5 hover:bg-white/10 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }
              `}
            >
              <X size={20} />
            </button>

            {/* Progress Steps */}
            <div className={`p-6 border-b ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between max-w-md mx-auto">
                {steps.map((s, index) => (
                  <React.Fragment key={s.number}>
                    <div className="flex flex-col items-center gap-2">
                      <div
                        className={`
                          w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
                          ${step >= s.number
                            ? theme === 'dark'
                              ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(0,255,255,0.4)]'
                              : 'bg-cyan-500 text-white shadow-lg'
                            : theme === 'dark'
                              ? 'bg-white/5 text-gray-500'
                              : 'bg-gray-100 text-gray-400'
                          }
                        `}
                      >
                        {s.icon}
                      </div>
                      <span className={`text-xs font-medium ${step >= s.number ? (theme === 'dark' ? 'text-white' : 'text-gray-900') : 'text-gray-500'}`}>
                        {s.title}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-2 ${step > s.number ? (theme === 'dark' ? 'bg-cyan-500' : 'bg-cyan-500') : (theme === 'dark' ? 'bg-white/10' : 'bg-gray-200')}`} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Step 1: Confirmation */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <h2 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Confirmar Adquisición
                    </h2>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Revisa los detalles antes de continuar
                    </p>
                  </div>

                  <div className={`p-6 rounded-2xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                    <div className="flex items-center gap-4">
                      <img src={product.image} alt={product.title} className="w-20 h-20 rounded-lg object-cover" />
                      <div className="flex-1">
                        <h3 className={`font-semibold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {product.title}
                        </h3>
                        <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}>
                          {product.price}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <ShieldCheck className={`${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} size={18} />
                    <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                      Transacción protegida con cifrado de grado militar
                    </span>
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    className={`
                      w-full py-3 rounded-xl font-medium transition-all
                      ${theme === 'dark'
                        ? 'bg-cyan-500 text-black hover:bg-cyan-400 shadow-[0_0_20px_rgba(0,255,255,0.3)]'
                        : 'bg-gray-900 text-white hover:bg-gray-800 shadow-lg'
                      }
                    `}
                  >
                    Continuar al Pago
                  </button>
                </motion.div>
              )}

              {/* Step 2: Payment */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <h2 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Pago Seguro
                    </h2>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Tu información está completamente protegida
                    </p>
                  </div>

                  {isProcessing ? (
                    <div className="py-12 text-center space-y-4">
                      <Loader className={`mx-auto animate-spin ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`} size={48} />
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Procesando pago seguro...
                      </p>
                      <div className="w-64 mx-auto">
                        <Progress 
                          value={66} 
                          className={`${theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'} h-2`}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          Número de Tarjeta
                        </label>
                        <input
                          type="text"
                          placeholder="•••• •••• •••• ••••"
                          className={`
                            w-full px-4 py-3 rounded-lg border transition-all font-mono
                            ${theme === 'dark'
                              ? 'bg-white/5 border-white/10 text-white focus:border-cyan-500/50'
                              : 'bg-white border-gray-300 text-gray-900 focus:border-cyan-500'
                            }
                          `}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            Vencimiento
                          </label>
                          <input
                            type="text"
                            placeholder="MM/AA"
                            className={`
                              w-full px-4 py-3 rounded-lg border transition-all font-mono
                              ${theme === 'dark'
                                ? 'bg-white/5 border-white/10 text-white focus:border-cyan-500/50'
                                : 'bg-white border-gray-300 text-gray-900 focus:border-cyan-500'
                              }
                            `}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            CVV
                          </label>
                          <input
                            type="text"
                            placeholder="•••"
                            className={`
                              w-full px-4 py-3 rounded-lg border transition-all font-mono
                              ${theme === 'dark'
                                ? 'bg-white/5 border-white/10 text-white focus:border-cyan-500/50'
                                : 'bg-white border-gray-300 text-gray-900 focus:border-cyan-500'
                              }
                            `}
                          />
                        </div>
                      </div>

                      <button
                        onClick={handlePurchase}
                        className={`
                          w-full py-3 rounded-xl font-medium transition-all mt-6
                          ${theme === 'dark'
                            ? 'bg-cyan-500 text-black hover:bg-cyan-400 shadow-[0_0_20px_rgba(0,255,255,0.3)]'
                            : 'bg-gray-900 text-white hover:bg-gray-800 shadow-lg'
                          }
                        `}
                      >
                        Confirmar Pago {product.price}
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Step 3: Activation */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6 text-center py-6"
                >
                  {purchaseComplete ? (
                    <>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', duration: 0.6 }}
                      >
                        <CheckCircle 
                          className={`mx-auto ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} 
                          size={64} 
                        />
                      </motion.div>
                      <div>
                        <h2 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          ¡Completado!
                        </h2>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          Tu activo está listo para usar
                        </p>
                      </div>
                      <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-green-500/10 border border-green-500/20' : 'bg-green-50 border border-green-200'}`}>
                        <p className={`text-sm ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`}>
                          Hemos enviado los detalles de acceso a tu correo
                        </p>
                      </div>
                      <button
                        onClick={resetFlow}
                        className={`
                          w-full py-3 rounded-xl font-medium transition-all
                          ${theme === 'dark'
                            ? 'bg-cyan-500 text-black hover:bg-cyan-400'
                            : 'bg-gray-900 text-white hover:bg-gray-800'
                          }
                        `}
                      >
                        Ir a Mis Activos
                      </button>
                    </>
                  ) : (
                    <>
                      <Loader className={`mx-auto animate-spin ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`} size={48} />
                      <div>
                        <h2 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          Configurando tu Activo
                        </h2>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          Esto solo tomará unos segundos...
                        </p>
                      </div>
                      <Progress value={80} className="w-64 mx-auto" />
                    </>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};