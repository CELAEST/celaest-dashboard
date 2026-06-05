"use client";

import React from "react";
import { Check, ShoppingCart, Star, Eye, Lightning, ArrowRight } from "@phosphor-icons/react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { useTheme } from "@/features/shared/hooks/useTheme";
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
}

export const ProductCardCompact = React.memo(function ProductCardCompact({
  product,
  onSelect,
  onViewDetails,
  isOwned = false,
  accessLevel,
  disabledReason,
}: ProductCardCompactProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { activeCoupon } = useMarketplaceCouponStore();
  const t = useTranslations("marketplace");
  const tCommon = useTranslations("common");
  const { pricing, formatPrice } = useGeoPricing();

  // Resolve effective access: prefer accessLevel prop, fallback to isOwned
  const effectiveAccess = accessLevel ?? (isOwned ? "owned" : "none");
  const hasAccess = effectiveAccess === "owned" || effectiveAccess === "plan";

  // Mapeo seguro de propiedades
  const {
    name: title,
    short_description: description,
    thumbnail_url: imageUrl,
    rating_avg: rating = 0,
    rating_count: reviews = 0,
    base_price,
    currency,
  } = product;

  const image = imageUrl || null;

  // Features reales o fallback si están vacíos (con conversión segura a array)
  let displayFeatures: string[] = ["Instant Delivery", "Secure Payment", "24/7 Support"];
  if (Array.isArray(product.features) && product.features.length > 0) {
    displayFeatures = product.features.map(String);
  } else if (typeof product.features === "string" && (product.features as string).trim()) {
    displayFeatures = (product.features as string).split(",").map(s => s.trim());
  } else if (Array.isArray(product.tags) && product.tags.length > 0) {
    displayFeatures = product.tags.map(String);
  } else if (typeof product.tags === "string" && (product.tags as string).trim()) {
    displayFeatures = (product.tags as string).split(",").map(s => s.trim());
  }

  // Geo-pricing: resolve localized price for this product (NO PPP discount, only exchange rate)
  const isGeoPriced = !!(pricing && pricing.country_code && pricing.country_code !== "US");
  const localBasePrice = isGeoPriced
    ? base_price * (pricing?.exchange_rate ?? 1)
    : base_price;

  // Fixed-amount coupons are denominated in USD; scale to local currency.
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

  const formattedLocalBase = isGeoPriced ? formatPrice(localBasePrice) : formatCurrency(base_price, currency);
  const formattedFinalPrice = isGeoPriced ? formatPrice(finalPrice) : formatCurrency(finalPrice, currency);

  // Badge derivado (ej. si tiene rating alto)
  const badge = rating >= 4.5 ? "BESTSELLER" : undefined;

  return (
    <div
      className={`
        group relative rounded-4xl overflow-hidden transition-all duration-700 flex flex-col h-full snap-start animate-card-entrance
        ${
          isDark
            ? "bg-[#0c0c0c] border border-white/5 hover:border-cyan-500/20 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]"
            : "bg-white border border-gray-100/50 hover:border-cyan-500/30 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.06)] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)]"
        }
      `}
    >
      {/* Visual Header / Image Container - Compact for viewport fit */}
      <div
        className={`relative w-full overflow-hidden ${onViewDetails ? "cursor-pointer" : ""}`}
        style={{ aspectRatio: "16/11" }}
        onClick={(e) => {
          if (onViewDetails) {
            e.stopPropagation();
            onViewDetails();
          }
        }}
      >
        {/* Animated Background Image */}
        <div
          className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-115"
        >
          <ImageWithFallback
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        </div>

        {/* Dynamic Overlays */}
        <div
          className="absolute inset-0 transition-opacity duration-500 bg-black/40 group-hover:bg-black/45"
        />

        <div
          className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent"
        />

        {/* Centered Play Video Button - Visible on mobile/touch, Hover effect on desktop */}
        {product.youtube_video_id && (
          <div
            className="absolute inset-0 z-30 flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] opacity-100 scale-100 md:opacity-0 md:scale-75 md:pointer-events-none md:group-hover:opacity-100 md:group-hover:scale-100 md:group-hover:pointer-events-auto"
          >
            <div
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full hover:bg-white shadow-[0_10px_30px_rgba(0,0,0,0.5),0_0_20px_rgba(255,255,255,0.2)] md:hover:shadow-[0_15px_40px_rgba(0,0,0,0.6),0_0_25px_rgba(34,211,238,0.4)] flex items-center justify-center transition-all duration-300 transform md:hover:scale-110 md:active:scale-95 group/play cursor-pointer bg-white/70 backdrop-blur-sm md:bg-white/95"
            >
              {/* Custom aligned play triangle */}
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-7 h-7 sm:w-8 sm:h-8 text-[#0a192f] translate-x-0.5 transition-transform duration-300 md:group-hover/play:scale-105"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}

        {/* Floating Badges
         * Cuando el producto es BESTSELLER ocultamos la categoría para evitar
         * apilar dos chips en la esquina superior izquierda — el badge ya
         * comunica jerarquía suficiente y la categoría está visible en el
         * detalle. Si no hay badge, mostramos la categoría como contexto.
         */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5">
          {badge ? (
            <div className="px-2 py-0.5 rounded-full bg-cyan-500 text-white text-[8px] font-black uppercase tracking-widest shadow-lg shadow-cyan-500/30 flex items-center gap-1">
              <Lightning size={8} fill="currentColor" />
              {badge}
            </div>
          ) : (
            product.category_name && (
              <div
                className={`px-2 py-0.5 rounded-full backdrop-blur-md border text-[8px] font-black uppercase tracking-widest flex items-center gap-1 ${
                  isDark
                    ? "bg-black/40 border-white/10 text-gray-300"
                    : "bg-white/60 border-gray-200 text-gray-600 shadow-sm"
                }`}
              >
                {product.category_name}
              </div>
            )
          )}
        </div>

        {/* Plan tier badge — top right */}
        {(() => {
          const tierMap: Record<number, { label: string; cls: string }> = {
            0: { label: t("all_plans"), cls: "bg-black/20 border-white/20 text-gray-200" },
            1: { label: "Basic+", cls: "bg-emerald-700/40 border-emerald-800/30 text-emerald-200" },
            2: { label: "Pro", cls: "bg-violet-500/60 border-violet-500/60 text-violet-200" },
            3: { label: "Enterprise", cls: "bg-amber400/60 border-amber-400/30 text-amber-200" },
          };
          const tier = tierMap[product.min_plan_tier] ?? { label: t("private"), cls: "bg-red-900/60 border-red-400/30 text-red-200" };
          return (
            <div className="absolute top-3 right-3 z-20">
              <div className={`px-2 py-0.5 rounded-full backdrop-blur-md border text-[8px] font-black uppercase tracking-widest ${tier.cls}`}>
                {tier.label}
              </div>
            </div>
          );
        })()}

        {/* Price Tag or Access Badge - Compact */}
        <div className="absolute bottom-3 left-3 z-20">
          {hasAccess ? (
            <div className="flex flex-col">
              <span className="text-white/60 text-[8px] font-bold uppercase tracking-widest mb-0.5">
                {tCommon("status")}
              </span>
              <span className="text-sm font-black tracking-widest uppercase text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
                {effectiveAccess === "plan" ? t("plan_badge") : t("owned_badge")}
              </span>
            </div>
          ) : (
            <div className="flex flex-col">
              <span className="text-white/60 text-[8px] font-bold uppercase tracking-widest mb-0.5">
                {tCommon("price")}
              </span>
              <div className="flex flex-col items-start leading-[1.1]">
                {activeCoupon && (
                  <span className="text-white/60 text-xs font-medium line-through">
                    {formattedLocalBase}
                  </span>
                )}
                <span
                  className={`text-xl font-black tracking-tight drop-shadow-2xl ${activeCoupon ? "text-emerald-400" : "text-white"}`}
                >
                  {formattedFinalPrice}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Floating Quick Action */}
        <div
          className="absolute bottom-3 right-3 z-20 transition-all duration-300 transform translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
        >
          <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white">
            <ArrowRight size={16} />
          </div>
        </div>
      </div>

      {/* Content Section - More spacious for premium feel */}
      <div className="flex flex-1 flex-col space-y-4 p-5 sm:p-6 lg:p-7">
        {/* Header: Title & Info */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={13}
                    weight="fill"
                    className={
                      i < Math.floor(rating)
                        ? "text-amber-400"
                        : isDark
                          ? "text-white/15"
                          : "text-gray-300"
                    }
                  />
                ))}
              </div>
              <span
                className={`text-[11px] sm:text-xs font-black uppercase tracking-widest ${isDark ? "text-gray-500" : "text-gray-400"}`}
              >
                {reviews} {tCommon("reviews")}
              </span>
            </div>
          </div>

          <h3
            className={`text-xl font-black leading-[1.15] tracking-tight line-clamp-2 lg:text-[1.35rem] ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {title}
          </h3>
        </div>

        {/* Description - More readable */}
        <p
            className={`text-xs sm:text-sm leading-relaxed line-clamp-2 lg:text-[0.925rem] ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {description}
        </p>

        {/* Professional Feature Set - Spaced out */}
        <div className="grid grid-cols-2 gap-2.5 py-1">
          {displayFeatures.slice(0, 4).map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-4.5 h-4.5 rounded-full bg-cyan-500/10 flex items-center justify-center shrink-0">
                <Check size={12} className="text-cyan-500" strokeWidth={3} />
              </div>
              <span
                className={`text-[11px] sm:text-xs font-bold leading-snug line-clamp-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}
              >
                {feature}
              </span>
            </div>
          ))}
        </div>

        {/* Action Center - Spacier and larger buttons */}
        <div className="pt-4 mt-auto">
          {hasAccess ? (
            <button
              onClick={onViewDetails}
              className={`w-full py-3 rounded-xl font-black text-[11px] sm:text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 border-2 transition-all duration-200 hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98] ${
                effectiveAccess === "plan"
                  ? isDark
                    ? "bg-violet-500/10 border-violet-500/20 text-violet-400 hover:bg-violet-500/20"
                    : "bg-violet-50 border-violet-200 text-violet-600 hover:bg-violet-100"
                  : isDark
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20"
                    : "bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100"
              }`}
            >
              {t("view_details")}
              <ArrowRight size={15} strokeWidth={3} />
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-3.5">
              <button
                onClick={onViewDetails}
                className={`py-3 rounded-xl font-black text-[11px] sm:text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 border-2 transition-all duration-200 hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98] ${
                  isDark
                    ? "bg-white/5 border-white/5 text-gray-300 hover:bg-white/10 hover:border-white/10 hover:text-white"
                    : "bg-gray-50 border-gray-100 text-gray-600 hover:bg-gray-100 hover:border-gray-200 hover:text-gray-900"
                }`}
              >
                <Eye size={15} strokeWidth={3} />
                {tCommon("explore")}
              </button>

              <button
                onClick={!disabledReason ? onSelect : undefined}
                title={disabledReason}
                className={`py-3 rounded-xl font-black text-[11px] sm:text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all duration-200 ${
                  !disabledReason ? "hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98]" : ""
                } ${
                  disabledReason
                    ? "bg-gray-200 text-gray-400 border border-gray-300 cursor-not-allowed dark:bg-zinc-800 dark:text-gray-500 dark:border-zinc-700"
                    : isDark
                      ? "bg-cyan-500 text-black hover:bg-cyan-400 shadow-xl shadow-cyan-500/20"
                      : "bg-gray-900 text-white hover:bg-gray-800 shadow-xl shadow-gray-900/20"
                }`}
              >
                {disabledReason ? (
                  <>
                    <Check size={15} strokeWidth={3} />
                    {disabledReason}
                  </>
                ) : (
                  <>
                    <ShoppingCart size={15} strokeWidth={3} />
                    {t("acquire")}
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
