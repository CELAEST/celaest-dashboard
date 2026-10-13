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
import { useSwipeDownToClose } from "@/features/shared/hooks/useSwipeDownToClose";

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

  const {
    sheetRef,
    bodyRef,
    handlePillRef,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleBodyTouchStart,
    handleBodyTouchMove,
    handleBodyTouchEnd,
    handlePillClick,
  } = useSwipeDownToClose({ onClose: resetFlow });

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
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={resetFlow}
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Modal Container: Lingua Standard Golden Ratio (520px) & Pure Obsidian */}
          <div
            ref={sheetRef}
            onClick={(e) => e.stopPropagation()}
            style={{ willChange: "transform", backfaceVisibility: "hidden" }}
            className="relative z-10 flex flex-col w-full sm:max-w-[520px] max-h-[92dvh] sm:max-h-[88vh] rounded-t-[26px] sm:rounded-3xl overflow-hidden bg-[#09090B] border-t sm:border border-white/[0.08] shadow-[0_32px_96px_-12px_rgba(0,0,0,0.95)] animate-modal-content"
          >
            {/* Mobile Drag Indicator (Lingua Standard with Swipe-to-Close) */}
            <div
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onClick={handlePillClick}
              className="sm:hidden w-full flex items-center justify-center pt-2.5 pb-1 shrink-0 bg-[#0D0D11] select-none cursor-grab active:cursor-grabbing touch-none"
              title="Desliza hacia abajo para cerrar"
              role="button"
              tabIndex={0}
              aria-label="Deslizar hacia abajo para cerrar"
            >
              <div
                ref={handlePillRef}
                className="w-10 h-1.5 rounded-full bg-white/20 hover:bg-white/35 transition-all duration-150"
              />
            </div>

            {/* Tokyo Corner Accents (Dark Mode Desktop Only) */}
            <div className="hidden sm:block pointer-events-none">
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white/10 rounded-tl-sm z-30" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-white/10 rounded-tr-sm z-30" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-white/10 rounded-bl-sm z-30" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white/10 rounded-br-sm z-30" />
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                resetFlow();
              }}
              onTouchEnd={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              className="absolute top-3 sm:top-4 right-3 sm:right-4 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center bg-white/[0.04] hover:bg-white/[0.08] text-white/60 hover:text-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Stepper Header (Drag-enabled on Mobile) */}
            <div
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className="shrink-0 px-4 sm:px-12 pt-3.5 sm:pt-7 pb-3 sm:pb-4.5 border-b border-white/[0.06] bg-[#0D0D11] select-none cursor-grab active:cursor-grabbing touch-none"
            >
              <div className="flex items-start justify-between w-full max-w-[340px] sm:max-w-[380px] mx-auto relative">
                {/* Conector 1: Entre Paso 1 y Paso 2 */}
                <div
                  className="absolute top-[18px] sm:top-[21px] h-0.5 bg-white/[0.08] z-0 overflow-hidden rounded-full pointer-events-none"
                  style={{
                    left: "calc(36px + 16px)",
                    right: "calc(50% + 16px)",
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

                {/* Conector 2: Entre Paso 2 y Paso 3 */}
                <div
                  className="absolute top-[18px] sm:top-[21px] h-0.5 bg-white/[0.08] z-0 overflow-hidden rounded-full pointer-events-none"
                  style={{
                    left: "calc(50% + 16px)",
                    right: "calc(36px + 16px)",
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
                      className="flex flex-col items-center gap-1.5 sm:gap-2.5 relative z-10 w-[78px] sm:w-[92px]"
                    >
                      <div
                        className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-200 text-xs font-semibold ${
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
                        className={`text-[10px] sm:text-xs transition-colors text-center truncate w-full ${
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
            <div
              ref={bodyRef}
              onTouchStart={handleBodyTouchStart}
              onTouchMove={handleBodyTouchMove}
              onTouchEnd={handleBodyTouchEnd}
              className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-7 space-y-4 sm:space-y-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]"
            >
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
          </div>
        </div>
        </>
      )}
    </AnimatePresence>
  );
};
