"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, CheckCircle, CreditCard, DownloadSimple, Check } from "@phosphor-icons/react";
import { SuccessConfetti } from "@/features/shared/components/SuccessConfetti";
import { useMarketplaceCouponStore } from "@/features/marketplace/store";
import { formatCurrency } from "@/lib/utils";
import { usePurchaseFlow } from "@/features/marketplace/hooks/usePurchaseFlow";
import { ConfirmationStep } from "./purchase-steps/ConfirmationStep";
import { PaymentStep } from "./purchase-steps/PaymentStep";
import { ActivationStep } from "./purchase-steps/ActivationStep";
import { useDashboardRouter } from "@/features/control-center/hooks/useDashboardRouter";
import { useTranslations } from "next-intl";
import { useGeoPricing } from "@/features/billing/providers/GeoPricingProvider";

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
  const t = useTranslations("marketplace");
  const { navigateTo } = useDashboardRouter();
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

  const { activeCoupon, setCoupon, clearCoupon } = useMarketplaceCouponStore();
  const { pricing, formatPrice } = useGeoPricing();

  // Geo-pricing (NO PPP discount for products, only exchange rate)
  const isGeoPriced = !!(pricing && pricing.country_code && pricing.country_code !== "US");
  const basePrice = product?.base_price ?? 0;
  const localBasePrice = isGeoPriced
    ? basePrice * (pricing?.exchange_rate ?? 1)
    : basePrice;

  // Fixed-amount coupons are denominated in USD; scale to local currency.
  const exchangeRate = pricing?.exchange_rate ?? 1;
  let finalPrice = localBasePrice;
  let discountAmountValue = 0;
  let discountPercentage = 0;

  if (activeCoupon && product) {
    if (activeCoupon.type === "percentage") {
      discountPercentage = activeCoupon.value;
      discountAmountValue = localBasePrice * (activeCoupon.value / 100);
      finalPrice = localBasePrice - discountAmountValue;
    } else if (activeCoupon.type === "fixed_amount") {
      const localDiscount = isGeoPriced
        ? activeCoupon.value * exchangeRate
        : activeCoupon.value;
      discountAmountValue = localDiscount;
      discountPercentage = localBasePrice > 0 ? Math.round((localDiscount / localBasePrice) * 100) : 0;
      finalPrice = Math.max(0, localBasePrice - localDiscount);
    }
  }

  // Original price for strikethrough — shown in local currency when geo-priced
  const formattedOriginalPrice = product
    ? (isGeoPriced ? formatPrice(localBasePrice) : formatCurrency(product.base_price, product.currency))
    : "";
  const formattedFinalPrice = product
    ? (isGeoPriced ? formatPrice(finalPrice) : formatCurrency(finalPrice, product.currency))
    : "";
  const formattedDiscountAmount = discountAmountValue > 0
    ? (isGeoPriced ? formatPrice(discountAmountValue) : formatCurrency(discountAmountValue, product?.currency ?? "USD"))
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
    { number: 1, title: t("confirmation_step"), icon: <CheckCircle size={18} weight="bold" /> },
    { number: 2, title: t("secure_payment"), icon: <CreditCard size={18} weight="bold" /> },
    { number: 3, title: t("activation_step"), icon: <DownloadSimple size={18} weight="bold" /> },
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
            className="fixed inset-0 bg-black/85 backdrop-blur-md z-50"
          />

          {/* Modal Container: Lingua Standard Golden Ratio (520px) & Pure Obsidian */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2 }}
            style={{ width: "100%", maxWidth: "520px" }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 flex flex-col w-[calc(100%-2rem)] max-w-[520px] max-h-[92dvh] rounded-3xl overflow-hidden bg-[#09090B] border border-white/[0.08] shadow-[0_32px_96px_-12px_rgba(0,0,0,0.95)]"
          >
            {/* Tokyo Corner Accents */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white/10 rounded-tl-sm pointer-events-none z-30" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-white/10 rounded-tr-sm pointer-events-none z-30" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-white/10 rounded-bl-sm pointer-events-none z-30" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white/10 rounded-br-sm pointer-events-none z-30" />

            {/* Close Button */}
            <button
              type="button"
              onClick={resetFlow}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full flex items-center justify-center bg-white/[0.04] hover:bg-white/[0.08] text-white/60 hover:text-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Stepper Header (100% Centrado, simétrico, línea no cruza por debajo de los círculos) */}
            <div className="shrink-0 px-8 sm:px-12 pt-7 pb-4.5 border-b border-white/[0.06] bg-[#0D0D11]">
              <div className="flex items-start justify-between w-full max-w-[380px] mx-auto relative">
                {/* Conector 1: Entre Paso 1 y Paso 2 (Nunca pasa por debajo de ningún círculo) */}
                <div
                  className="absolute top-[21px] h-0.5 bg-white/[0.08] z-0 overflow-hidden rounded-full pointer-events-none"
                  style={{
                    left: "calc(46px + 24px)",
                    right: "calc(50% + 24px)",
                  }}
                >
                  <div
                    className="h-full transition-all duration-300"
                    style={{
                      width: step >= 2 ? "100%" : "0%",
                      backgroundColor: "#FFFFFF",
                    }}
                  />
                </div>

                {/* Conector 2: Entre Paso 2 y Paso 3 (Nunca pasa por debajo de ningún círculo) */}
                <div
                  className="absolute top-[21px] h-0.5 bg-white/[0.08] z-0 overflow-hidden rounded-full pointer-events-none"
                  style={{
                    left: "calc(50% + 24px)",
                    right: "calc(46px + 24px)",
                  }}
                >
                  <div
                    className="h-full transition-all duration-300"
                    style={{
                      width: step >= 3 ? "100%" : "0%",
                      backgroundColor: "#FFFFFF",
                    }}
                  />
                </div>

                {steps.map((s) => {
                  const isCompleted = step > s.number;
                  const isActive = step === s.number;
                  return (
                    <div
                      key={s.number}
                      className="flex flex-col items-center gap-2.5 relative z-10"
                      style={{ width: "92px" }}
                    >
                      <div
                        className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 text-xs font-semibold ${
                          isActive
                            ? "bg-white text-black shadow-md"
                            : isCompleted
                              ? "bg-white/10 text-white border border-white/25"
                              : "bg-[#121319] text-white/30 border border-white/[0.08]"
                        }`}
                      >
                        {isCompleted ? <Check size={16} weight="bold" /> : s.icon}
                      </div>

                      <span
                        className={`text-[11px] sm:text-xs transition-colors text-center truncate w-full ${
                          isActive
                            ? "text-white font-semibold"
                            : isCompleted
                              ? "text-white/60"
                              : "text-white/30"
                        }`}
                      >
                        {s.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-7 space-y-6">
              {step === 1 && product && (
                <ConfirmationStep
                  product={{ title: product.title, image: product.image }}
                  originalPrice={formattedOriginalPrice}
                  finalPrice={formattedFinalPrice}
                  hasCoupon={!!activeCoupon}
                  couponCode={activeCoupon?.code}
                  discountAmount={formattedDiscountAmount}
                  discountPercentage={discountPercentage || 20}
                  onRemoveCoupon={clearCoupon}
                  onApplyCoupon={(code) => {
                    setCoupon({
                      code,
                      type: "percentage",
                      value: 20,
                    });
                  }}
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
                  onGoToAssets={() => {
                    if (product) {
                      navigateTo("catalog");
                      sessionStorage.setItem("open_asset_modal_id", product.id);
                    }
                    resetFlow();
                  }}
                />
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
