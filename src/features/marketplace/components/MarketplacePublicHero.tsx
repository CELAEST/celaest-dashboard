"use client";

import React, { useRef, useCallback, useEffect, useState } from "react";
import { Copy, Check } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import "./MarketplacePublicHero.css";

/* Helper: splits string into individual hover-reactive letter spans (Landing Hero Physics) */
function GlowLetters({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span className={`comm-glow-letters ${className}`} aria-hidden="true">
      {Array.from(text).map((char, index) => (
        <span className="comm-glow-letter" key={`${char}-${index}`}>
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}

/* Helper: splits outlined text into individual stroke-reactive spans */
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

/**
 * MarketplacePublicHero: B4 M-Series Proximity Glow Promotional Banner
 *
 * Replaces the redundant marketing hero with an elite, high-conversion
 * promotional banner featuring Landing Hero proximity physics, monumental 30%
 * outline typography, letter-by-letter hover luminescence, and zero vertical bloat.
 */
export const MarketplacePublicHero: React.FC = () => {
  const t = useTranslations("marketplace");
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

    const GLOW_RADIUS = 140; // Euclidean proximity radius
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

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText("WELCOME");
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const kicker = t("promo_banner_kicker") || "✦ BENEFICIO EXCLUSIVO DE BIENVENIDA";
  const kickerHint = t("promo_banner_hint") || "PASA EL CURSOR POR LAS LETRAS";
  const title = t("promo_banner_title") || "100% de Descuento de Bienvenida en tu Primer Despliegue";
  const subtitle =
    t("promo_banner_subtitle") ||
    "Aplica el cupón WELCOME en el checkout y activa cualquier solución de inteligencia artificial con 100% de bonificación.";
  const couponLabel = t("promo_banner_coupon_label") || "CUPÓN DE BIENVENIDA";
  const copyLabel = t("promo_banner_copy") || "Copiar";
  const copiedLabel = t("promo_banner_copied") || "Copiado";

  return (
    <section
      ref={bannerRef}
      className="comm-commercial-strip select-none"
      aria-label={title}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div className="max-w-[85rem] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="comm-commercial-strip-inner">
          {/* Left Column: Monumental 100% + Reactive Heading */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-7">
            <div className="text-5xl sm:text-6xl font-black shrink-0 flex items-center leading-none">
              <GlowOutlineLetters text="100%" />
            </div>

            <div className="flex flex-col gap-1.5 text-left">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-violet-400">
                  {kicker}
                </span>
                <span className="text-zinc-600 text-xs hidden sm:inline">·</span>
                <span className="font-mono text-[10px] text-zinc-500 tracking-[0.16em] uppercase hidden sm:inline">
                  {kickerHint}
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white leading-snug m-0">
                <GlowLetters text={title} />
              </h2>

              <p className="text-xs sm:text-[13.5px] text-zinc-400 m-0 leading-relaxed max-w-2xl font-light">
                {subtitle}
              </p>
            </div>
          </div>

          {/* Right Column: Tactile Copy Pill */}
          <div className="flex items-center shrink-0 self-start sm:self-center">
            <button
              type="button"
              onClick={handleCopyCoupon}
              className="flex items-center gap-3 bg-white/[0.04] hover:bg-violet-500/[0.08] border border-white/[0.12] hover:border-violet-400/50 hover:shadow-[0_0_20px_rgba(167,139,250,0.2)] px-4 py-2.5 rounded-xl cursor-pointer transition-all duration-200 active:scale-[0.98]"
              title="Copiar cupón de descuento"
            >
              <div className="flex flex-col items-start gap-0.5">
                <span className="font-mono text-[9px] text-violet-400 tracking-[0.18em] uppercase font-bold">
                  {couponLabel}
                </span>
                <span className="font-mono text-sm font-extrabold text-white tracking-[0.16em]">
                  WELCOME
                </span>
              </div>

              <div className="w-px h-6 bg-white/15 mx-1" />

              {copied ? (
                <span className="text-emerald-400 text-xs font-mono font-bold flex items-center gap-1">
                  <Check size={14} weight="bold" />
                  <span>{copiedLabel}</span>
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
    </section>
  );
};
