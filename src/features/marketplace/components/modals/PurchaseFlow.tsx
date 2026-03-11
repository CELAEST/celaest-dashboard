"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, CheckCircle, CreditCard, DownloadSimple, Check } from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { SuccessConfetti } from "@/features/shared/components/SuccessConfetti";
import { useMarketplaceCouponStore } from "@/features/marketplace/store";
import { formatCurrency } from "@/lib/utils";
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
    base_price: number;
    currency: string;
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
    isProcessing,
    purchaseComplete,
    showConfetti,
    progress,
    statusMessage,
    handlePurchase,
    resetFlow,
  } = usePurchaseFlow(onClose, initialStep, onSuccess);

  const { activeCoupon } = useMarketplaceCouponStore();

  let finalPrice = product?.base_price ?? 0;
  if (activeCoupon && product) {
    if (activeCoupon.type === "percentage") {
      finalPrice = product.base_price * (1 - activeCoupon.value / 100);
    } else if (activeCoupon.type === "fixed_amount") {
      finalPrice = Math.max(0, product.base_price - activeCoupon.value);
    }
  }

  const formattedOriginalPrice = product
    ? formatCurrency(product.base_price, product.currency)
    : "";
  const formattedFinalPrice = product
    ? formatCurrency(finalPrice, product.currency)
    : "";

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") resetFlow();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, resetFlow]);

  const steps = [
    { number: 1, title: "Confirmación", icon: <CheckCircle size={20} weight="bold" /> },
    { number: 2, title: "Pago Seguro", icon: <CreditCard size={20} weight="bold" /> },
    { number: 3, title: "Activación", icon: <DownloadSimple size={20} weight="bold" /> },
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
            <div className={`px-16 sm:px-20 pt-10 pb-8 ${theme === "dark" ? "bg-gradient-to-b from-white/[0.03] to-transparent" : "bg-gradient-to-b from-gray-50/80 to-transparent"}`}>
              {/* Row: circle — line — circle — line — circle */}
              <div className="flex items-center justify-center">
                {steps.map((s, index) => {
                  const isCompleted = step > s.number;
                  const isActive = step === s.number;
                  return (
                    <React.Fragment key={s.number}>
                      {/* Circle */}
                      <div className="relative flex-shrink-0">
                        {isActive && (
                          <div className={`absolute inset-0 -m-2 rounded-full ${
                            theme === "dark"
                              ? "bg-cyan-500/15 blur-xl"
                              : "bg-cyan-400/10 blur-xl"
                          }`} />
                        )}
                        <div
                          className={`
                            relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
                            ${
                              isCompleted
                                ? theme === "dark"
                                  ? "bg-cyan-500 text-black"
                                  : "bg-cyan-500 text-white shadow-md shadow-cyan-500/20"
                                : isActive
                                  ? theme === "dark"
                                    ? "bg-cyan-500 text-black shadow-[0_0_30px_rgba(0,255,255,0.35)]"
                                    : "bg-cyan-500 text-white shadow-xl shadow-cyan-500/30"
                                  : theme === "dark"
                                    ? "bg-white/[0.08] text-gray-500 ring-1 ring-white/20"
                                    : "bg-gray-100 text-gray-400 ring-1 ring-gray-300"
                            }
                          `}
                        >
                          {isCompleted ? <Check size={20} weight="bold" /> : s.icon}
                        </div>
                      </div>
                      {/* Connector line */}
                      {index < steps.length - 1 && (
                        <div
                          className={`flex-1 h-[2px] mx-3 sm:mx-5 transition-all duration-500 ${
                            step > s.number
                              ? "bg-cyan-400"
                              : theme === "dark"
                                ? "bg-white/15"
                                : "bg-gray-300"
                          }`}
                        />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Labels row — separate from circles for clean alignment */}
              <div className="flex items-start justify-between mt-4" style={{ paddingLeft: 0, paddingRight: 0 }}>
                {steps.map((s, index) => {
                  const isCompleted = step > s.number;
                  const isActive = step === s.number;
                  return (
                    <span
                      key={`label-${s.number}`}
                      className={`text-xs font-semibold transition-colors duration-300 ${
                        index === 0 ? "text-left" : index === steps.length - 1 ? "text-right" : "text-center"
                      } ${
                        isCompleted
                          ? theme === "dark"
                            ? "text-cyan-400"
                            : "text-cyan-600"
                          : isActive
                            ? theme === "dark"
                              ? "text-white"
                              : "text-gray-900"
                            : theme === "dark"
                              ? "text-gray-500"
                              : "text-gray-400"
                      }`}
                      style={{ flex: 1 }}
                    >
                      {s.title}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Divider */}
            <div className={`h-px ${theme === "dark" ? "bg-white/[0.08]" : "bg-gray-200"}`} />

            {/* Content */}
            <div className="p-8">
              {step === 1 && product && (
                <ConfirmationStep
                  product={{ title: product.title, image: product.image }}
                  originalPrice={formattedOriginalPrice}
                  finalPrice={formattedFinalPrice}
                  hasCoupon={!!activeCoupon}
                  onContinue={() => handlePurchase(product.id)}
                />
              )}

              {step === 2 && product && (
                <PaymentStep
                  finalPrice={formattedFinalPrice}
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
