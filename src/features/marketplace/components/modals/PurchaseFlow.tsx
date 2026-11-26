"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "@phosphor-icons/react";
import { SuccessConfetti } from "@/features/shared/components/SuccessConfetti";
import { useMarketplaceCouponStore } from "@/features/marketplace/store";
import { useCouponUsage } from "@/features/marketplace/hooks/useCouponUsage";
import { toast } from "sonner";
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
  const tCommon = useTranslations("common");
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
    mpBrickData,
    closeMpBrick,
    token,
    orgId,
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
  const {
    isUsed: isWelcomeCouponUsed,
    isChecking: isCheckingWelcomeCoupon,
    markCouponAsUsed,
  } = useCouponUsage();
  const { pricing, formatPrice } = useGeoPricing();

  // Geo-pricing (PPP + exchange rate aligned with backend CalculateLocalPrice)
  const isGeoPriced = !!(pricing && pricing.country_code && pricing.country_code !== "US");
  const basePrice = product?.base_price ?? 0;
  const exchangeRate = pricing?.exchange_rate ?? 1;
  const pppFactor = pricing?.ppp_factor ?? 1;
  const isZeroDecimal = pricing?.currency?.is_zero_decimal ?? false;
  const roundLocal = (v: number) =>
    isZeroDecimal ? Math.round(v) : Math.round(v * 100) / 100;
  const localBasePrice = isGeoPriced
    ? roundLocal(basePrice * pppFactor * exchangeRate)
    : basePrice;

  // Fixed-amount coupons are denominated in USD; scale to local currency.
  let finalPrice = localBasePrice;
  let discountAmountValue = 0;
  let discountPercentage = 0;

  if (activeCoupon && product) {
    if (activeCoupon.type === "percentage") {
      discountPercentage = activeCoupon.value;
      discountAmountValue = isGeoPriced
        ? roundLocal(localBasePrice * (activeCoupon.value / 100))
        : localBasePrice * (activeCoupon.value / 100);
      finalPrice = localBasePrice - discountAmountValue;
    } else if (activeCoupon.type === "fixed_amount") {
      const localDiscount = isGeoPriced
        ? roundLocal(activeCoupon.value * pppFactor * exchangeRate)
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
    { number: 1, code: "01", title: t("confirmation_step") },
    { number: 2, code: "02", title: tCommon("payment") },
    { number: 3, code: "03", title: t("activation_step") },
  ];

  return (
    <>
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

          {/* Modal Container: Single Unified Obsidian Sheet (440px PC / Bottom-Sheet Mobile) */}
          <div
            ref={sheetRef}
            onClick={(e) => e.stopPropagation()}
            style={{ willChange: "transform", backfaceVisibility: "hidden" }}
            className="relative z-10 flex flex-col w-full sm:max-w-[440px] max-h-[92dvh] sm:max-h-[88vh] rounded-t-[22px] sm:rounded-[18px] overflow-hidden bg-[#09090b] border-t sm:border border-white/[0.09] shadow-[0_24px_64px_rgba(0,0,0,0.75)] animate-modal-content"
          >
            {/* Mobile Drag Indicator (Swipe-to-Close preserved) */}
            <div
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onClick={handlePillClick}
              className="sm:hidden w-full flex items-center justify-center pt-2.5 pb-1 shrink-0 bg-[#09090b] select-none cursor-grab active:cursor-grabbing touch-none"
              title="Desliza hacia abajo para cerrar"
              role="button"
              tabIndex={0}
              aria-label="Deslizar hacia abajo para cerrar"
            >
              <div
                ref={handlePillRef}
                className="w-[34px] h-1 rounded-full bg-white/[0.16] hover:bg-white/30 transition-all duration-150"
              />
            </div>

            {/* Unified Optical-Centered Stepper Header */}
            <div
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className="relative shrink-0 flex items-center justify-center px-10 sm:px-11 py-3.5 border-b border-white/[0.07] bg-[#09090b] select-none cursor-grab active:cursor-grabbing touch-none"
            >
              <nav
                className="flex items-center justify-center gap-1.5 sm:gap-2.5"
                aria-label={t("confirmation_step")}
              >
                {steps.map((s, idx) => {
                  const isCompleted = step > s.number;
                  const isActive = step === s.number;
                  return (
                    <React.Fragment key={s.number}>
                      <span
                        aria-current={isActive ? "step" : undefined}
                        className={`inline-flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-medium whitespace-nowrap transition-colors ${
                          isActive
                            ? "text-[#f4f4f5]"
                            : isCompleted
                              ? "text-[#a1a1aa]"
                              : "text-[#52525b]"
                        }`}
                      >
                        <span
                          className={`font-mono text-[10px] sm:text-[10.5px] ${
                            isActive ? "text-[#c4b5fd]" : "opacity-70"
                          }`}
                        >
                          {s.code}
                        </span>
                        <span>{s.title}</span>
                      </span>

                      {idx < steps.length - 1 && (
                        <span
                          className="w-2.5 sm:w-4 h-px bg-white/10 shrink-0"
                          aria-hidden="true"
                        />
                      )}
                    </React.Fragment>
                  );
                })}
              </nav>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  resetFlow();
                }}
                onTouchEnd={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                aria-label={tCommon("close")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-lg flex items-center justify-center text-[#71717a] hover:text-[#f4f4f5] hover:bg-white/[0.06] transition-colors cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            {/* Content Body */}
            <div
              ref={bodyRef}
              onTouchStart={handleBodyTouchStart}
              onTouchMove={handleBodyTouchMove}
              onTouchEnd={handleBodyTouchEnd}
              className="flex-1 min-h-0 overflow-y-auto p-5 space-y-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]"
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
                    const clean = code.trim().toUpperCase();
                    const isWelcome = clean === "WELCOME" || clean === "WELCOM";
                    const isLingua = (product?.title || "").toLowerCase().includes("lingua");
                    if (isWelcome && (isWelcomeCouponUsed || isCheckingWelcomeCoupon)) {
                      toast.error(t("invalid_coupon"));
                      return;
                    }
                    setCoupon({
                      code: isWelcome ? "WELCOME" : code,
                      type: "percentage",
                      value: isWelcome && isLingua ? 100 : isWelcome ? 25 : 20,
                      ...(isWelcome && isLingua ? { isTrial: true, trialDays: 15 } : {}),
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
                  mpBrickData={mpBrickData}
                  token={token}
                  orgId={orgId}
                  onMpBack={() => {
                    closeMpBrick();
                    resetFlow();
                  }}
                  onMpApproved={() => {
                    markCouponAsUsed();
                    clearCoupon();
                    closeMpBrick();
                    onSuccess?.();
                    resetFlow();
                  }}
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
    </>
  );
};
