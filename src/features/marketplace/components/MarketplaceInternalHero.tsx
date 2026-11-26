"use client";

import React, { useRef, useCallback, useEffect, useState } from "react";
import { Copy, Check, Sparkle } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { useCouponUsage } from "../hooks/useCouponUsage";
import { useMarketplaceCouponStore } from "../store";
import { marketplaceService } from "../services/marketplace.service";
import { useApiAuth } from "@/lib/use-api-auth";
import { useOrgStore } from "@/features/shared/stores/useOrgStore";
import { toast } from "sonner";
import { AnimatePresence, motion } from "motion/react";
import "./MarketplacePublicHero.css";

function GlowLetters({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span className={`comm-glow-letters ${className}`} aria-hidden="true">
      {text.split(" ").map((word, wordIndex, words) => (
        <React.Fragment key={`${word}-${wordIndex}`}>
          <span className="inline-block whitespace-nowrap">
            {Array.from(word).map((char, charIndex) => (
              <span className="comm-glow-letter" key={`${char}-${charIndex}`}>
                {char}
              </span>
            ))}
          </span>
          {wordIndex < words.length - 1 ? " " : null}
        </React.Fragment>
      ))}
    </span>
  );
}

function GlowOutlineLetters({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span className={`comm-glow-outline-letters ${className}`} aria-hidden="true">
      {Array.from(text).map((char, index) => (
        <span className="comm-glow-outline-letter" key={`${char}-${index}`}>
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}

interface MarketplaceInternalHeroProps {
  isLoading?: boolean;
  onTrialClaimed?: () => void;
}

/**
 * MarketplaceInternalHero
 *
 * Commercial banner for the internal / authenticated marketplace view.
 * Sits directly below the header line with zero top margin.
 *
 * Never renders while loading or checking coupon eligibility (`isChecking` /
 * `isLoading`), avoiding any brief flash when the coupon is already used.
 */
export const MarketplaceInternalHero: React.FC<MarketplaceInternalHeroProps> = ({
  isLoading = false,
  onTrialClaimed,
}) => {
  const t = useTranslations("marketplace");
  const { isUsed, isChecking, markCouponAsUsed } = useCouponUsage();
  const { activeCoupon, setCoupon } = useMarketplaceCouponStore();
  const { token } = useApiAuth();
  const orgId = useOrgStore((s) => s.currentOrg?.id ?? null);
  const [claiming, setClaiming] = useState(false);

  const [copied, setCopied] = useState(false);
  const bannerRef = useRef<HTMLDivElement | null>(null);
  const letterRects = useRef<{ el: HTMLElement; x: number; y: number }[]>([]);
  const rafId = useRef<number>(0);
  const pointer = useRef<{ x: number; y: number }>({ x: -9999, y: -9999 });

  const measureLetters = useCallback(() => {
    if (!bannerRef.current) return;
    const els = bannerRef.current.querySelectorAll<HTMLElement>(
      ".comm-glow-letter, .comm-glow-outline-letter"
    );
    letterRects.current = Array.from(els).map((el) => {
      const box = el.getBoundingClientRect();
      return { el, x: box.left + box.width / 2, y: box.top + box.height / 2 };
    });
  }, []);

  useEffect(() => {
    letterRects.current = [];
    const handleResize = () => {
      letterRects.current = [];
    };
    window.addEventListener("resize", handleResize, { passive: true });
    return () => {
      window.removeEventListener("resize", handleResize);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  const paintGlow = useCallback(() => {
    rafId.current = 0;
    const { x, y } = pointer.current;
    if (letterRects.current.length === 0) {
      measureLetters();
    }

    const GLOW_RADIUS = 140;
    for (const { el, x: cx, y: cy } of letterRects.current) {
      const distance = Math.hypot(x - cx, y - cy);
      const falloff = Math.max(0, 1 - distance / GLOW_RADIUS);
      el.style.setProperty("--glow", (falloff * falloff).toFixed(3));
    }
  }, [measureLetters]);

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    pointer.current = { x: e.clientX, y: e.clientY };
    if (bannerRef.current) {
      const rect = bannerRef.current.getBoundingClientRect();
      bannerRef.current.style.setProperty(
        "--mouse-x",
        `${(e.clientX - rect.left).toFixed(1)}px`
      );
      bannerRef.current.style.setProperty(
        "--mouse-y",
        `${(e.clientY - rect.top).toFixed(1)}px`
      );
    }
    if (!rafId.current) {
      rafId.current = requestAnimationFrame(paintGlow);
    }
  };

  const handlePointerLeave = () => {
    pointer.current = { x: -9999, y: -9999 };
    for (const { el } of letterRects.current) {
      el.style.setProperty("--glow", "0");
    }
    if (bannerRef.current) {
      bannerRef.current.style.setProperty("--mouse-x", "-9999px");
      bannerRef.current.style.setProperty("--mouse-y", "-9999px");
    }
  };

  const handleClaimWelcomeTrial = async () => {
    if (claiming) return;
    navigator.clipboard?.writeText?.("WELCOME")?.catch?.(() => {});

    if (!token) {
      setCoupon({
        code: "WELCOME",
        type: "percentage",
        value: 100,
        isTrial: true,
        trialDays: 15,
      });
      setCopied(true);
      toast.success(
        "Cupón WELCOME seleccionado: 15 días gratis de CELAEST Lingua al completar tu acceso.",
      );
      setTimeout(() => setCopied(false), 2400);
      return;
    }

    setClaiming(true);
    try {
      await marketplaceService.claimWelcomeTrial(token, orgId);
      setCopied(true);
      toast.success(
        "¡15 días gratis de CELAEST Lingua activados! Tienes todas las bases y 200 peticiones IA listas.",
      );
      markCouponAsUsed();
      onTrialClaimed?.();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message.toLowerCase() : "";
      if (msg.includes("409") || msg.includes("already") || msg.includes("usado") || msg.includes("utilizaste")) {
        toast.info("Tu prueba gratuita WELCOME ya fue activada anteriormente.");
        markCouponAsUsed();
      } else {
        toast.error("No se pudo activar tu prueba gratuita. Inténtalo de nuevo.");
      }
    } finally {
      setClaiming(false);
    }
  };

  if (isUsed || isChecking || isLoading) {
    return null;
  }

  const kicker =
    t("promo_banner_internal_kicker") || "✦ 15 DÍAS GRATIS DE LINGUA";
  const kickerHint = t("promo_banner_hint") || "PASA EL CURSOR POR LAS LETRAS";
  const title =
    t("promo_banner_internal_title") || "15 Días Gratis de CELAEST Lingua Sin Tarjeta";
  const subtitle =
    t("promo_banner_internal_subtitle") ||
    "Reclama el cupón WELCOME con 1 clic para desbloquear todas las bases de Lingua y 200 peticiones de IA durante 15 días.";
  const couponLabel = t("promo_banner_coupon_label") || "CUPÓN DE BIENVENIDA";
  const isCouponActive =
    activeCoupon?.code === "WELCOME" || activeCoupon?.code === "WELCOM" || activeCoupon?.code === "EARLYBIRD";
  const copyLabel = claiming
    ? "Activando..."
    : copied || isCouponActive
      ? t("promo_banner_internal_applied") || "Prueba Activada"
      : t("promo_banner_internal_apply") || "Activar 15 días gratis";

  return (
    <AnimatePresence>
      <motion.section
        key="marketplace-internal-hero"
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0, transition: { duration: 0.25 } }}
        ref={bannerRef}
        className="comm-commercial-strip select-none shrink-0"
        aria-label={title}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        <div className="w-full px-4 sm:px-6 lg:px-7">
          <div className="comm-commercial-strip-inner w-full min-w-0">
            {/* Left Column: Monumental 15 DÍAS + Reactive Heading */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5 sm:gap-7 w-full min-w-0">
              <div className="flex items-center gap-3 sm:block shrink-0">
                <div className="text-3xl sm:text-5xl font-black shrink-0 flex items-center leading-none whitespace-nowrap">
                  <GlowOutlineLetters text="15 DÍAS" />
                </div>
                <span className="font-mono text-[10px] font-bold tracking-[0.2em] uppercase text-violet-400 sm:hidden">
                  {kicker}
                </span>
              </div>

              <div className="flex flex-col gap-1.5 text-left min-w-0 w-full">
                <div className="hidden sm:flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-violet-400">
                    {kicker}
                  </span>
                  <span className="text-zinc-600 text-xs">·</span>
                  <span className="font-mono text-[10px] text-zinc-500 tracking-[0.16em] uppercase">
                    {kickerHint}
                  </span>
                </div>

                <h2 className="text-[17px] sm:text-xl font-bold tracking-tight text-white leading-snug m-0 break-words">
                  <GlowLetters text={title} />
                </h2>

                <p className="text-[12.5px] sm:text-[13.5px] text-zinc-400 m-0 leading-relaxed max-w-2xl font-light break-words">
                  {subtitle}
                </p>
              </div>
            </div>

            {/* Right Column: Tactile 1-Click Trial Claim Pill */}
            <div className="flex items-center shrink-0 w-full sm:w-auto self-stretch sm:self-center">
              <button
                type="button"
                disabled={claiming}
                onClick={() => void handleClaimWelcomeTrial()}
                className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto bg-white/[0.04] hover:bg-violet-500/[0.08] border border-white/[0.12] hover:border-violet-400/50 hover:shadow-[0_0_20px_rgba(167,139,250,0.2)] px-4 py-2.5 rounded-xl cursor-pointer transition-all duration-200 active:scale-[0.98] disabled:opacity-60"
                title="Activar 15 días gratis de CELAEST Lingua (cupón WELCOME)"
              >
                <div className="flex flex-col items-start gap-0.5">
                  <span className="font-mono text-[9px] text-violet-400 tracking-[0.18em] uppercase font-bold flex items-center gap-1">
                    <Sparkle size={11} className="text-violet-400" />
                    <span>{couponLabel}</span>
                  </span>
                  <span className="font-mono text-sm font-extrabold text-white tracking-[0.16em]">
                    WELCOME
                  </span>
                </div>

                <div className="w-px h-6 bg-white/15 mx-1" />

                {copied || isCouponActive ? (
                  <span className="text-emerald-400 text-xs font-mono font-bold flex items-center gap-1">
                    <Check size={14} weight="bold" />
                    <span>{copyLabel}</span>
                  </span>
                ) : (
                  <span className="text-violet-400 hover:text-violet-300 text-xs font-mono font-medium flex items-center gap-1 transition-colors">
                    <Copy size={14} weight="bold" />
                    <span>{copyLabel}</span>
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.section>
    </AnimatePresence>
  );
};
