"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useMarketplaceCouponStore } from "../store";
import { couponsService } from "@/features/coupons/services/coupons.service";
import { useApiAuth } from "@/lib/use-api-auth";
import { Tag, X, CheckCircle, CircleNotch, Lightning } from "@phosphor-icons/react";
import { settingsApi } from "@/features/settings/api/settings.api";
import dynamic from "next/dynamic";

const UpgradePlanModal = dynamic(
  () => import("@/features/billing/components/modals/UpgradePlanModal").then((mod) => mod.UpgradePlanModal),
  { ssr: false }
);
import { useLocalProductPrice } from "@/features/billing/hooks/useLocalProductPrice";
import { motion, AnimatePresence } from "motion/react";
import { useTranslations } from "next-intl";

interface CouponFABProps {
  onRequireLogin?: () => void;
}

export function CouponFAB({ onRequireLogin }: CouponFABProps = {}) {
  const { activeCoupon, setCoupon, clearCoupon } = useMarketplaceCouponStore();
  const { token, orgId } = useApiAuth();
  const t = useTranslations("marketplace");

  const [isOpen, setIsOpen] = useState(false);
  const [isPlansOpen, setIsPlansOpen] = useState(false);
  const [isPlanHovered, setIsPlanHovered] = useState(false);
  const [isCouponHovered, setIsCouponHovered] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const searchParams = useSearchParams();
  const requiresLogin = !token || !orgId;

  const requestLoginOrRun = (action: () => void) => {
    if (requiresLogin && onRequireLogin) {
      onRequireLogin();
      return;
    }

    action();
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isOpen &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Silently load and re-validate the active coupon when the user enters the marketplace
  useEffect(() => {
    if (!token || !orgId) return;

    // Do not attempt to auto-load from DB if we just completed a successful checkout.
    // The checkout return hook is actively clearing the coupon in the background,
    // and querying the DB now might grab the old stale coupon before the DB transaction finishes.
    const isSuccess = searchParams.get("success") === "true";
    if (isSuccess) return;

    const loadAndValidate = async () => {
      try {
        let currentCoupon = activeCoupon;

        // 1. If not in memory, try loading from db preferences
        if (!currentCoupon) {
          const res = await settingsApi.getPreferences(token);
          if (res.preferences?.raw) {
            try {
              const prefs = JSON.parse(res.preferences.raw);
              if (prefs.marketplace_active_coupon) {
                currentCoupon = prefs.marketplace_active_coupon;
              }
            } catch {
              // Ignore JSON parse errors
            }
          }
        }

        // 2. Validate current coupon
        if (currentCoupon) {
          const result = await couponsService.validateCoupon(
            currentCoupon.code,
            token,
            orgId,
          );

          if (result.valid && result.coupon) {
            setCoupon({
              code: currentCoupon.code,
              type: result.coupon.discount_type as
                | "percentage"
                | "fixed_amount",
              value: result.coupon.discount_value as number,
            });
          } else {
            // Invalid/Expired: clear from memory and DB
            clearCoupon();
            await settingsApi.updatePreferences(
              { marketplace_active_coupon: null },
              token,
            );
          }
        }
      } catch (err) {
        console.error("Auto-validation of DB coupon failed:", err);
      }
    };

    // We only want to run this once on mount/auth, not on every activeCoupon change
    loadAndValidate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, orgId, searchParams]);

  const handleApply = async () => {
    if (!code.trim() || !token || !orgId) return;

    setLoading(true);
    setError(null);
    try {
      const result = await couponsService.validateCoupon(
        code.trim(),
        token,
        orgId,
      );

      if (
        result.valid &&
        result.coupon &&
        result.coupon.discount_type &&
        result.coupon.discount_value !== undefined
      ) {
        const couponData = {
          code: code.trim(),
          type: result.coupon.discount_type as "percentage" | "fixed_amount",
          value: result.coupon.discount_value,
        };
        setCoupon(couponData);
        // Persist to DB
        await settingsApi.updatePreferences(
          { marketplace_active_coupon: couponData },
          token,
        );

        setIsOpen(false);
        setCode("");
      } else {
        setError(result.reason || t("invalid_coupon"));
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : t("validate_failed"),
      );
    } finally {
      setLoading(false);
    }
  };

  const { format: formatLocalPrice, isGeoPriced } = useLocalProductPrice();
  const currentSavingsText = activeCoupon
    ? activeCoupon.type === "percentage"
      ? t("off", { value: `${activeCoupon.value}%` })
      : t("off", {
          value: isGeoPriced
            ? formatLocalPrice(activeCoupon.value)
            : `$${activeCoupon.value}`,
        })
    : "";

  return (
    <>
      <div ref={containerRef} className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2.5">
        {/* Popover Bubble for Coupons (Obsidian Enterprise Standard) */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.15 } }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="mb-1 w-84 bg-[#09090B] border border-white/[0.08] rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.95)] overflow-hidden origin-bottom-right font-jakarta relative"
            >
              {/* 4 Tokyo architectural corner ticks */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20 pointer-events-none" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/20 pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20 pointer-events-none" />

              {/* Header */}
              <div className="px-4 py-3.5 border-b border-white/[0.06] flex items-center justify-between bg-white/[0.015]">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#141418] border border-white/[0.06] flex items-center justify-center">
                    <Tag className="w-3.5 h-3.5 text-emerald-400" weight="bold" />
                  </div>
                  <div>
                    <span className="block text-[9px] font-mono uppercase tracking-[0.18em] text-white/40 leading-none mb-1">
                      MÓDULO DE PROMOCIÓN
                    </span>
                    <h3 className="text-xs font-bold text-white tracking-tight leading-none">
                      {t("apply_coupon")}
                    </h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-6 h-6 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white/50 hover:text-white transition-colors flex items-center justify-center cursor-pointer"
                  aria-label="Cerrar"
                >
                  <X className="w-3.5 h-3.5" weight="bold" />
                </button>
              </div>

              <div className="p-4 flex flex-col gap-3">
                {activeCoupon ? (
                  <div className="flex flex-col gap-3">
                    {/* Tarjeta Limpia de Cupón Activo (Zero Bolitas, Zero Redundancia) */}
                    <div className="p-4 rounded-xl bg-[#0D0D11] border border-white/[0.06] flex items-center justify-between">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-white/40">
                          {t("active_code")}
                        </span>
                        <span className="text-sm font-bold font-mono tracking-widest text-white">
                          {activeCoupon.code}
                        </span>
                      </div>
                      <div className="text-right flex flex-col items-end gap-0.5">
                        <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-white/40">
                          {t("discount")}
                        </span>
                        <span className="text-sm font-bold font-mono text-emerald-400">
                          {activeCoupon.type === "percentage" ? `-${activeCoupon.value}%` : `-${currentSavingsText}`}
                        </span>
                      </div>
                    </div>

                    {/* Botón de Remoción Minimalista */}
                    <button
                      type="button"
                      onClick={async () => {
                        clearCoupon();
                        if (token) {
                          await settingsApi.updatePreferences(
                            { marketplace_active_coupon: null },
                            token,
                          );
                        }
                        setIsOpen(false);
                      }}
                      className="w-full py-2.5 rounded-xl bg-[#141418] hover:bg-[#1A1A20] border border-white/[0.06] hover:border-red-500/25 text-white/60 hover:text-red-400 text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer font-jakarta"
                    >
                      <X size={12} weight="bold" />
                      <span>{t("remove_coupon")}</span>
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono uppercase tracking-[0.16em] text-white/50">
                        {t("coupon_code")}
                      </label>
                      <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                        placeholder={t("coupon_placeholder")}
                        className="w-full bg-[#0D0D11] border border-white/[0.08] focus:border-white/25 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/25 focus:outline-none uppercase font-mono tracking-wider transition-colors"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            void handleApply();
                          }
                        }}
                      />
                      {error && (
                        <p className="text-[11px] text-red-400 mt-0.5 font-jakarta flex items-center gap-1">
                          {error}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => void handleApply()}
                      disabled={!code.trim() || loading}
                      className="w-full py-2.5 bg-white hover:bg-neutral-200 text-black text-xs font-bold uppercase tracking-wider rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all flex justify-center items-center h-9 shadow-md cursor-pointer font-jakarta active:scale-[0.99]"
                    >
                      {loading ? (
                        <CircleNotch className="w-4 h-4 animate-spin text-black" />
                      ) : (
                        t("apply_code")
                      )}
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── BOTONES FLOTANTES APILADOS (COLAPSADOS 44px CON ÍCONO 100% CENTRADO) ── */}
        <div className="flex flex-col items-end gap-2.5">
          {/* 1. Botón Superior: Planes & Upgrade */}
          <motion.button
            layout
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            onMouseEnter={() => setIsPlanHovered(true)}
            onMouseLeave={() => setIsPlanHovered(false)}
            onClick={() => requestLoginOrRun(() => setIsPlansOpen(true))}
            className={`h-11 rounded-full bg-[#0B0B0F]/95 backdrop-blur-2xl border border-white/[0.12] hover:border-amber-400/40 shadow-[0_12px_36px_rgba(0,0,0,0.8)] flex items-center overflow-hidden transition-all duration-300 cursor-pointer ${
              isPlanHovered
                ? "w-auto pr-4 pl-0 bg-[#0E0E14]"
                : "w-11 justify-center p-0"
            }`}
          >
            {/* Contenedor Rígido de Ícono 100% Centrado (44px × 44px) */}
            <div className="w-11 h-11 flex items-center justify-center shrink-0">
              <Lightning size={18} weight="fill" className="text-amber-400" />
            </div>

            {isPlanHovered && (
              <motion.span
                initial={{ opacity: 0, x: 4 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xs font-semibold text-white whitespace-nowrap pr-1 -ml-1"
              >
                {t("view_plans")}
              </motion.span>
            )}
          </motion.button>

          {/* 2. Botón Inferior: Canjear Cupón */}
          <motion.button
            layout
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            onMouseEnter={() => setIsCouponHovered(true)}
            onMouseLeave={() => setIsCouponHovered(false)}
            onClick={() => requestLoginOrRun(() => setIsOpen(!isOpen))}
            className={`h-11 rounded-full bg-[#0B0B0F]/95 backdrop-blur-2xl border shadow-[0_12px_36px_rgba(0,0,0,0.8)] flex items-center overflow-hidden transition-all duration-300 cursor-pointer ${
              activeCoupon
                ? "border-emerald-400/30 text-white bg-[#0B0B0F]/95 hover:border-emerald-400/50"
                : "border-white/[0.12] hover:border-white/30 text-white"
            } ${
              isCouponHovered || isOpen
                ? "w-auto pr-4 pl-0 bg-[#0E0E14]"
                : "w-11 justify-center p-0"
            }`}
          >
            {/* Contenedor Rígido de Ícono 100% Centrado (44px × 44px) */}
            <div className="w-11 h-11 flex items-center justify-center shrink-0">
              <Tag
                size={18}
                weight="bold"
                className={activeCoupon ? "text-emerald-400" : "text-white/80"}
              />
            </div>

            {(isCouponHovered || isOpen) && (
              <motion.div
                initial={{ opacity: 0, x: 4 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 whitespace-nowrap pr-2 -ml-1"
              >
                <span className="text-xs font-mono font-bold text-white tracking-wider">
                  {activeCoupon ? activeCoupon.code : t("have_coupon")}
                </span>
                {activeCoupon && (
                  <span className="text-[10px] font-mono font-semibold text-emerald-400">
                    {activeCoupon.type === "percentage" ? `-${activeCoupon.value}%` : ""}
                  </span>
                )}
                {activeCoupon && (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      clearCoupon();
                      if (token) {
                        void settingsApi.updatePreferences(
                          { marketplace_active_coupon: null },
                          token,
                        );
                      }
                      setIsOpen(false);
                    }}
                    className="hover:text-red-400 p-0.5 transition-colors ml-0.5 text-white/40 hover:text-red-400 cursor-pointer"
                    title={t("remove_coupon")}
                  >
                    <X size={12} weight="bold" />
                  </span>
                )}
              </motion.div>
            )}
          </motion.button>
        </div>
      </div>

      {isPlansOpen && (
        <UpgradePlanModal
          isOpen={isPlansOpen}
          onClose={() => setIsPlansOpen(false)}
        />
      )}
    </>
  );
}
