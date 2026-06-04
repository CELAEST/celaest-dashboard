"use client";

import React from "react";
import { motion } from "motion/react";
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
  const [isHovered, setIsHovered] = React.useState(false);
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

  // Features reales o fallback si están vacíos
  const displayFeatures =
    product.features && product.features.length > 0
      ? product.features
      : product.tags && product.tags.length > 0
        ? product.tags
        : ["Instant Delivery", "Secure Payment", "24/7 Support"];

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
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`
        group relative rounded-4xl overflow-hidden transition-all duration-700 flex flex-col h-full snap-start
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
        style={{ aspectRatio: "4/3" }}
        onClick={(e) => {
          if (onViewDetails) {
            e.stopPropagation();
            onViewDetails();
          }
        }}
      >
        {/* Animated Background Image */}
        <motion.div
          animate={{
            scale: isHovered ? 1.15 : 1,
          }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <ImageWithFallback
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        </motion.div>

        {/* Dynamic Overlays */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${
            isHovered ? "bg-black/45" : "bg-black/40"
          }`}
        />

        <div
          className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent"
        />

        {/* Centered Play Video Button - Visible on mobile/touch, Hover effect on desktop */}
        {product.youtube_video_id && (
          <div
            className={`absolute inset-0 z-30 flex items-center justify-center transition-all duration-500 ease-[0.22,1,0.36,1] ${
              isHovered ? "opacity-100 scale-100" : "opacity-100 scale-75 md:opacity-0 pointer-events-none md:pointer-events-auto"
            }`}
          >
            <div
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/90 md:bg-white/95 hover:bg-white shadow-[0_10px_30px_rgba(0,0,0,0.5),0_0_20px_rgba(255,255,255,0.2)] md:hover:shadow-[0_15px_40px_rgba(0,0,0,0.6),0_0_25px_rgba(34,211,238,0.4)] flex items-center justify-center transition-all duration-300 transform md:hover:scale-110 md:active:scale-95 group/play cursor-pointer
                ${!isHovered ? "backdrop-blur-sm bg-white/70" : ""}
              `}
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

        {/* Price Tag - Compact */}
        <div className="absolute bottom-3 left-3 z-20">
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
        </div>

        {/* Floating Quick Action */}
        <motion.div
          animate={{ x: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
          className="absolute bottom-3 right-3 z-20"
        >
          <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white">
            <ArrowRight size={16} />
          </div>
        </motion.div>
      </div>

      {/* Content Section - Compact for viewport fit */}
      <div className="p-4 flex-1 flex flex-col space-y-3">
        {/* Header: Title & Info */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={11}
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
                className={`text-[9px] font-black uppercase tracking-widest ${isDark ? "text-gray-500" : "text-gray-400"}`}
              >
                {reviews} {tCommon("reviews")}
              </span>
            </div>
          </div>

          <h3
            className={`text-lg font-black leading-[1.1] tracking-tighter line-clamp-2 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {title}
          </h3>
        </div>

        {/* Description - Compact */}
        <p
          className={`text-xs leading-relaxed line-clamp-2 ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {description}
        </p>

        {/* Professional Feature Set - Compact */}
        <div className="grid grid-cols-2 gap-2 py-1">
          {displayFeatures.slice(0, 4).map((feature, index) => (
            <div key={index} className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-full bg-cyan-500/10 flex items-center justify-center shrink-0">
                <Check size={10} className="text-cyan-500" strokeWidth={3} />
              </div>
              <span
                className={`text-[10px] font-bold leading-snug line-clamp-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}
              >
                {feature}
              </span>
            </div>
          ))}
        </div>

        {/* Action Center - Compact buttons */}
        <div className="pt-3 mt-auto grid grid-cols-2 gap-3">
          <motion.button
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onViewDetails}
            className={`py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-1.5 border-2 transition-all ${
              isDark
                ? "bg-white/5 border-white/5 text-gray-300 hover:bg-white/10 hover:border-white/10 hover:text-white"
                : "bg-gray-50 border-gray-100 text-gray-600 hover:bg-gray-100 hover:border-gray-200 hover:text-gray-900"
            }`}
          >
            <Eye size={14} strokeWidth={3} />
            {tCommon("explore")}
          </motion.button>

          <motion.button
            whileHover={
              !hasAccess && !disabledReason ? { y: -4, scale: 1.02 } : {}
            }
            whileTap={!hasAccess && !disabledReason ? { scale: 0.98 } : {}}
            onClick={!hasAccess && !disabledReason ? onSelect : undefined}
            title={disabledReason}
            className={`py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all ${
              disabledReason
                ? "bg-gray-200 text-gray-400 border border-gray-300 cursor-not-allowed dark:bg-zinc-800 dark:text-gray-500 dark:border-zinc-700"
                : hasAccess
                  ? effectiveAccess === "plan"
                    ? isDark
                      ? "bg-violet-500/10 text-violet-400 border border-violet-500/20 cursor-default"
                      : "bg-violet-50 text-violet-600 border border-violet-200 cursor-default"
                    : isDark
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-default"
                      : "bg-emerald-50 text-emerald-600 border border-emerald-200 cursor-default"
                  : isDark
                    ? "bg-cyan-500 text-black hover:bg-cyan-400 shadow-xl shadow-cyan-500/20"
                    : "bg-gray-900 text-white hover:bg-gray-800 shadow-xl shadow-gray-900/20"
            }`}
          >
            {disabledReason ? (
              <>
                <Check size={14} strokeWidth={3} />
                {disabledReason}
              </>
            ) : hasAccess ? (
              effectiveAccess === "plan" ? (
                <>
                  <Check size={14} strokeWidth={3} />
                  {t("in_plan")}
                </>
              ) : (
                <>
                  <Check size={14} strokeWidth={3} />
                  {t("acquired")}
                </>
              )
            ) : (
              <>
                <ShoppingCart size={14} strokeWidth={3} />
                {t("acquire")}
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
});
