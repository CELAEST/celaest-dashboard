"use client";

import React from "react";
import { Eye, ArrowRight, Star, Play } from "@phosphor-icons/react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { MarketplaceProduct } from "../types";
import { formatCurrency } from "@/lib/utils";
import { useMarketplaceCouponStore } from "../store";
import { useTranslations } from "next-intl";
import { useGeoPricing } from "@/features/billing/providers/GeoPricingProvider";

interface ProductCardCompactProps {
  product: MarketplaceProduct;
  onSelect: () => void;
  onViewDetails?: () => void;
  isOwned?: boolean;
  accessLevel?: "owned" | "plan" | "none";
  disabledReason?: string;
  priority?: boolean;
}

const TIER_THEMES = {
  "Starter+": {
    textColor: "text-sky-400",
    borderColor: "border-sky-400/30",
  },
  "Pro Tier": {
    textColor: "text-violet-400",
    borderColor: "border-violet-400/30",
  },
  Enterprise: {
    textColor: "text-amber-400",
    borderColor: "border-amber-400/30",
  },
};

/**
 * ProductCardCompact (Card #2 Confirmed Architecture)
 *
 * Implements the approved Card #2 standard:
 * - Plus Jakarta Sans + JetBrains Mono engineering typography
 * - Eased Scrim (76px) gradient eliminating the bottom image cut line
 * - 4 photo corner metrics: Category (top-left), Tier (top-right), Price with USD (bottom-left)
 * - Vertically aligned reviews and bold reactive checks in tier theme color
 * - Dual button footer (Detalles + Adquirir)
 */
export const ProductCardCompact = React.memo(function ProductCardCompact({
  product,
  onSelect,
  onViewDetails,
  isOwned = false,
  accessLevel,
  disabledReason,
  priority = false,
}: ProductCardCompactProps) {
  const { activeCoupon } = useMarketplaceCouponStore();
  const t = useTranslations("marketplace");
  const { pricing, formatPrice } = useGeoPricing();

  const effectiveAccess = accessLevel ?? (isOwned ? "owned" : "none");
  const hasAccess = effectiveAccess === "owned" || effectiveAccess === "plan";

  const {
    name: title,
    short_description: description,
    thumbnail_url: imageUrl,
    rating_avg: rating = 5.0,
    rating_count: reviews = 24,
    base_price,
    currency = "USD",
    category_name: category = "Automatización",
  } = product;

  // Derive official tier from min_plan_tier
  const tierName: "Starter+" | "Pro Tier" | "Enterprise" =
    product.min_plan_tier >= 3
      ? "Enterprise"
      : product.min_plan_tier === 2
        ? "Pro Tier"
        : "Starter+";

  const theme = TIER_THEMES[tierName];

  // Features list
  let displayFeatures: string[] = [
    "Enrutamiento dinámico asistido por IA Mesh",
    "Webhooks bidireccionales de baja latencia",
    "Aislamiento multi-tenant con cifrado AES-256",
  ];
  if (Array.isArray(product.features) && product.features.length > 0) {
    displayFeatures = product.features.slice(0, 3).map(String);
  } else if (typeof product.features === "string" && (product.features as string).trim()) {
    displayFeatures = (product.features as string).split(",").slice(0, 3).map((s) => s.trim());
  } else if (Array.isArray(product.tags) && product.tags.length > 0) {
    displayFeatures = product.tags.slice(0, 3).map(String);
  }

  // Geo-pricing & coupons
  const isGeoPriced = !!(pricing && pricing.country_code && pricing.country_code !== "US");
  const localBasePrice = isGeoPriced
    ? base_price * (pricing?.exchange_rate ?? 1)
    : base_price;

  const exchangeRate = pricing?.exchange_rate ?? 1;
  let finalPrice = localBasePrice;
  if (activeCoupon) {
    if (activeCoupon.type === "percentage") {
      finalPrice = localBasePrice * (1 - activeCoupon.value / 100);
    } else if (activeCoupon.type === "fixed_amount") {
      const localDiscount = isGeoPriced
        ? activeCoupon.value * exchangeRate
        : activeCoupon.value;
      finalPrice = Math.max(0, localBasePrice - localDiscount);
    }
  }

  const formattedFinalPrice = isGeoPriced
    ? formatPrice(finalPrice)
    : formatCurrency(finalPrice, currency);

  const formattedOriginalPrice = isGeoPriced
    ? formatPrice(localBasePrice)
    : formatCurrency(base_price, currency);

  const hasDiscount = Boolean(activeCoupon && base_price > 0 && finalPrice < localBasePrice);

  const discountBadgeText = activeCoupon
    ? activeCoupon.type === "percentage"
      ? `-${activeCoupon.value}%`
      : `-${isGeoPriced ? formatPrice(activeCoupon.value * exchangeRate) : formatCurrency(activeCoupon.value, currency)}`
    : "";

  // Badge
  const badge = rating >= 4.9 ? "BESTSELLER" : rating >= 4.7 ? "POPULAR" : undefined;

  // Secondary CTA text
  const buttonText = hasAccess
    ? effectiveAccess === "plan"
      ? t("in_plan")
      : t("acquired")
    : disabledReason || t("acquire");

  return (
    <article className="group rounded-2xl overflow-hidden flex flex-col justify-between transition-colors duration-200 bg-[#09090b] border border-white/[0.06] hover:border-white/[0.14] font-jakarta select-none">
      {/* ── HEADER VISUAL CON DEGRADADO EASED SCRIM (SIN LÍNEA) ── */}
      <div
        className="relative w-full aspect-16/10 overflow-hidden bg-[#09090b] cursor-pointer"
        onClick={onViewDetails}
      >
        <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-103">
          <ImageWithFallback
            src={imageUrl || null}
            alt={title}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        </div>

        {/* Sombra sutil superior para legibilidad de Categoría y Tier */}
        <div
          className="absolute inset-x-0 top-0 h-14 pointer-events-none z-[2]"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0, 0, 0, 0.72) 0%, rgba(0, 0, 0, 0.45) 35%, rgba(0, 0, 0, 0.15) 70%, rgba(0, 0, 0, 0) 100%)",
          }}
        />

        {/* Eased Scrim Inferior (88px): disolución no lineal hacia #09090b */}
        <div
          className="absolute inset-x-0 -bottom-[1px] h-[88px] pointer-events-none z-[5]"
          style={{
            background:
              "linear-gradient(to top, #09090b 0%, rgba(9, 9, 11, 0.98) 15%, rgba(9, 9, 11, 0.90) 30%, rgba(9, 9, 11, 0.74) 48%, rgba(9, 9, 11, 0.50) 65%, rgba(9, 9, 11, 0.25) 80%, rgba(9, 9, 11, 0.08) 92%, rgba(9, 9, 11, 0) 100%)",
          }}
        />

        {/* Punta 1 (Arriba Izquierda): Categoría en JetBrains Mono */}
        <div className="absolute top-3 left-4 z-10 font-jetbrains text-[9px] font-bold tracking-widest uppercase text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
          {category}
        </div>

        {/* Punta 2 (Arriba Derecha): Plan en JetBrains Mono */}
        <div
          className={`absolute top-3 right-4 z-10 font-jetbrains text-[9px] font-bold tracking-widest uppercase ${theme.textColor} drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]`}
        >
          {tierName}
        </div>

        {/* PRECIO EN LA PARTE INFERIOR DE LA FOTO (ESTILO 2: CON TAG %) */}
        <div className="absolute bottom-2.5 left-4 z-10 flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-jetbrains text-white/75 text-[8px] font-bold uppercase tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
              PRECIO
            </span>
            {hasDiscount && (
              <span className="font-mono text-[9px] font-bold text-emerald-400 uppercase tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                {discountBadgeText}
              </span>
            )}
          </div>
          {hasDiscount ? (
            <>
              <span className="font-jetbrains text-[11px] font-semibold text-white/50 line-through tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] -mb-0.5">
                {formattedOriginalPrice}
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-jetbrains text-2xl font-black tracking-tight text-emerald-400 drop-shadow-[0_2px_10px_rgba(16,185,129,0.4)]">
                  {formattedFinalPrice}
                </span>
                {!isGeoPriced && (
                  <span className="font-jetbrains text-[10px] font-bold uppercase tracking-wider text-emerald-400/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                    {currency}
                  </span>
                )}
                <span className="font-jetbrains text-[10px] text-emerald-400/80 drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                  / mes
                </span>
              </div>
            </>
          ) : (
            <div className="flex items-baseline gap-1.5">
              <span className="font-jetbrains text-2xl font-black tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                {base_price === 0 ? "Gratis" : (finalPrice === 0 ? "Gratis" : formattedFinalPrice)}
              </span>
              {base_price > 0 && finalPrice > 0 && (
                <>
                  <span className="font-jetbrains text-[10px] font-bold uppercase tracking-wider text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                    {currency}
                  </span>
                  <span className="font-jetbrains text-[10px] text-white/70 drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                    / mes
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Botón de Video sutil (solo en hover) */}
        {product.youtube_video_id && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails?.();
            }}
            className="absolute inset-0 m-auto w-11 h-11 rounded-full bg-white/95 text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-xl hover:scale-105 z-20"
            title="Ver video demo"
          >
            <Play size={15} weight="fill" className="translate-x-0.5 text-black" />
          </button>
        )}
      </div>

      {/* ── CUERPO EN PLUS JAKARTA SANS ── */}
      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div>
          {/* Rating con estrella dorada y conteo perfectamente centrado */}
          <div className="flex items-center justify-between pb-1.5 border-b border-white/[0.03]">
            <span className="font-jetbrains text-[10px] font-medium text-[#666666] uppercase tracking-wider">
              {badge ? `★ ${badge}` : "Catálogo Oficial"}
            </span>
            <div className="flex items-center gap-1.5 text-amber-400">
              <Star size={11} weight="fill" className="text-amber-400 shrink-0" />
              <span className="font-jetbrains text-white font-bold text-[11px] leading-none">
                {rating.toFixed(1)}
              </span>
              <span className="font-jetbrains text-[#71717A] text-[10px] leading-none">
                ({reviews})
              </span>
            </div>
          </div>

          {/* Nombre del Asset en Plus Jakarta Sans ExtraBold */}
          <h3
            onClick={onViewDetails}
            className="font-jakarta text-[1.05rem] font-extrabold text-white tracking-tight leading-snug mt-2 group-hover:text-white transition-colors cursor-pointer"
          >
            {title}
          </h3>

          {/* Descripción breve */}
          <p className="font-jakarta text-xs text-[#8C8C8C] mt-2 line-clamp-2 leading-relaxed">
            {description}
          </p>

          {/* 3 Líneas de Especificaciones con Check Reactivo Bold */}
          <div className="mt-4 pt-2 border-t border-white/[0.04] divide-y divide-white/[0.03]">
            {displayFeatures.map((f, i) => (
              <div
                key={i}
                className="py-2 flex items-center justify-between text-xs text-[#A1A1AA] group-hover:text-white transition-colors font-jakarta"
              >
                <span className="truncate pr-2 font-normal">{f}</span>
                <span className={`font-jetbrains text-xs shrink-0 font-bold ${theme.textColor}`}>
                  ✓
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── PIE DESPEJADO: BOTONERA DUAL DIRECTA ── */}
        <div className="pt-3 border-t border-white/[0.04]">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onViewDetails}
              className="py-2.5 rounded-xl text-xs font-semibold text-white/75 hover:text-white bg-[#141418] hover:bg-[#1C1C22] border border-white/[0.06] hover:border-white/15 transition-all flex items-center justify-center gap-1.5 cursor-pointer font-jakarta"
            >
              <Eye size={13} weight="bold" />
              <span>{t("view_details")}</span>
            </button>

            <button
              type="button"
              onClick={onSelect}
              disabled={hasAccess || !!disabledReason}
              className="py-2.5 rounded-xl text-xs font-bold bg-white hover:bg-neutral-200 text-black active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md font-jakarta disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>{buttonText}</span>
              <ArrowRight size={13} weight="bold" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
});
