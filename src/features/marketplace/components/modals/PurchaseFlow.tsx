"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, CheckCircle, CreditCard, Download } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { SuccessConfetti } from "@/features/shared/components/SuccessConfetti";
import { usePurchaseFlow } from "@/features/marketplace/hooks/usePurchaseFlow";
import { ConfirmationStep } from "./purchase-steps/ConfirmationStep";
import { PaymentStep } from "./purchase-steps/PaymentStep";
import { ActivationStep } from "./purchase-steps/ActivationStep";

interface PurchaseFlowProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    title: string;
    price: string;
    image: string;
  } | null;
  initialStep?: number;
  onSuccess?: () => void;
}

export const PurchaseFlow: React.FC<PurchaseFlowProps> = ({
  isOpen,
  onClose,
  product,
  initialStep = 1,
  onSuccess,
}) => {
  const { theme } = useTheme();
  const {
    step,
    setStep,
    isProcessing,
    purchaseComplete,
    showConfetti,
    progress,
    statusMessage,
    handlePurchase,
    resetFlow,
  } = usePurchaseFlow(onClose, initialStep, onSuccess);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") resetFlow();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, resetFlow]);

  const steps = [
    { number: 1, title: "Confirmación", icon: <CheckCircle size={18} /> },
    { number: 2, title: "Pago Seguro", icon: <CreditCard size={18} /> },
    { number: 3, title: "Activación", icon: <Download size={18} /> },
  ];

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
              ${
                theme === "dark"
                  ? "bg-[#0a0a0a] border border-white/10"
                  : "bg-white border border-gray-200 shadow-2xl"
              }
            `}
          >
            {/* Close Button */}
            <button
              onClick={resetFlow}
              className={`
                absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-colors
                ${
                  theme === "dark"
                    ? "bg-white/5 hover:bg-white/10 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                }
              `}
            >
              <X size={20} />
            </button>

            {/* Progress Steps */}
            <div
              className={`p-6 border-b ${theme === "dark" ? "border-white/10" : "border-gray-200"}`}
            >
              {/* Steps UI remains here as it's part of the layout */}
              <div className="flex items-center justify-between max-w-md mx-auto">
                {steps.map((s, index) => (
                  <React.Fragment key={s.number}>
                    <div className="flex flex-col items-center gap-2">
                      <div
                        className={`
                          w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
                          ${
                            step >= s.number
                              ? theme === "dark"
                                ? "bg-cyan-500 text-black shadow-[0_0_20px_rgba(0,255,255,0.4)]"
                                : "bg-cyan-500 text-white shadow-lg"
                              : theme === "dark"
                                ? "bg-white/5 text-gray-500"
                                : "bg-gray-100 text-gray-400"
                          }
                        `}
                      >
                        {s.icon}
                      </div>
                      <span
                        className={`text-xs font-medium ${step >= s.number ? (theme === "dark" ? "text-white" : "text-gray-900") : "text-gray-500"}`}
                      >
                        {s.title}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`flex-1 h-0.5 mx-2 ${step > s.number ? (theme === "dark" ? "bg-cyan-500" : "bg-cyan-500") : theme === "dark" ? "bg-white/10" : "bg-gray-200"}`}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {step === 1 && product && (
                <ConfirmationStep
                  product={product}
                  onContinue={() => setStep(2)}
                />
              )}

              {step === 2 && product && (
                <PaymentStep
                  productPrice={product.price}
                  isProcessing={isProcessing}
                  progress={progress}
                  onPurchase={() => handlePurchase(product.id)}
                />
              )}

              {step === 3 && (
                <ActivationStep
                  purchaseComplete={purchaseComplete}
                  progress={progress}
                  statusMessage={statusMessage}
                  onReset={resetFlow}
                />
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
