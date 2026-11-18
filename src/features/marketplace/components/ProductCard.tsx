"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ShieldCheck, ArrowRight, Play } from "@phosphor-icons/react";
import { MarketplaceProduct } from "../types";
import { HeroBackgroundVideo } from "./studio-card/HeroBackgroundVideo";
import { resolveStudioMedia } from "./studio-card/catalogCardHelpers";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useMarketplaceCouponStore } from "../store";
import { useTranslations } from "next-intl";
import { useGeoPricing } from "@/features/billing/providers/GeoPricingProvider";

interface ProductCardProps {
  product: MarketplaceProduct;
  onClick?: () => void;
  disableNavigation?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onClick,
  disableNavigation = false,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const t = useTranslations("marketplace");
  const { activeCoupon } = useMarketplaceCouponStore();
  const { pricing, formatPrice } = useGeoPricing();
  const studioMedia = resolveStudioMedia(product);

  // Geo-pricing: resolve localized price (PPP + exchange rate)
  const isGeoPriced = !!(pricing && pricing.country_code && pricing.country_code !== "US");
  const exchangeRate = pricing?.exchange_rate ?? 1;
  const pppFactor = pricing?.ppp_factor ?? 1;
  const isZeroDecimal = pricing?.currency?.is_zero_decimal ?? false;
  const roundLocal = (v: number) =>
    isZeroDecimal ? Math.round(v) : Math.round(v * 100) / 100;
  const localBasePrice = isGeoPriced
    ? roundLocal(product.base_price * pppFactor * exchangeRate)
    : product.base_price;

  let finalPrice = localBasePrice;
  if (activeCoupon) {
    if (activeCoupon.type === "percentage") {
      finalPrice = isGeoPriced
        ? roundLocal(localBasePrice * (1 - activeCoupon.value / 100))
        : localBasePrice * (1 - activeCoupon.value / 100);
    } else if (activeCoupon.type === "fixed_amount") {
      const localDiscount = isGeoPriced
        ? roundLocal(activeCoupon.value * pppFactor * exchangeRate)
        : activeCoupon.value;
      finalPrice = Math.max(0, localBasePrice - localDiscount);
    }
  }

  const handleClick = (e?: React.MouseEvent) => {
    if (disableNavigation && e) {
      e.preventDefault();
    }
    if (onClick) onClick();
  };

  const Content = (
    <motion.div
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md transition-all hover:border-blue-500/30 hover:bg-black/60 cursor-pointer h-full"
      onClick={disableNavigation ? handleClick : undefined}
    >
      {/* Imagen del Producto */}
      <div className="relative aspect-video w-full overflow-hidden bg-white/5">
        <Image
          src={studioMedia.imageSrc || "/placeholder-product.jpg"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {studioMedia.hasVideo && (
          <HeroBackgroundVideo
            youtubeVideoId={studioMedia.youtubeVideoId}
            videoSrc={studioMedia.videoSrc}
            title={product.name}
            active={isHovered}
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        {studioMedia.hasVideo && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-black/45 text-white backdrop-blur-md shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:border-white/60">
              <Play size={20} weight="fill" className="translate-x-[1.5px]" />
            </span>
          </div>
        )}

        {/* Rating Badge */}
        {product.rating_count > 0 && product.rating_avg > 0 && (
          <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-xs font-medium text-blue-400 backdrop-blur-md border border-white/10">
            <Star className="h-3 w-3 fill-current" />
            {product.rating_avg.toFixed(1)}
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500/80">
            {product.category_name}
          </span>
          {product.rating_count > 50 && (
            <Badge
              variant="outline"
              className="h-5 gap-1 border-emerald-500/30 bg-emerald-500/10 px-1.5 text-[10px] text-emerald-400"
            >
              <ShieldCheck className="h-3 w-3" />
              {t("verified")}
            </Badge>
          )}
        </div>

        <h3 className="mb-2 line-clamp-1 text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
          {product.name}
        </h3>

        <p className="mb-4 line-clamp-2 text-sm text-white/60">
          {product.short_description}
        </p>

        <div className="mt-auto flex items-center justify-between pt-2 border-t border-white/5">
          <div className="flex flex-col">
            <span className="text-xs text-white/40 font-medium">{t("starting_from")}</span>
            <div className="flex items-center gap-2">
              {activeCoupon && (
                <span className="text-sm line-through text-white/40 font-medium">
                  {isGeoPriced
                    ? formatPrice(localBasePrice)
                    : formatCurrency(product.base_price, product.currency)}
                </span>
              )}
              <span className="text-xl font-bold text-white tracking-tight">
                {isGeoPriced ? formatPrice(finalPrice) : formatCurrency(finalPrice, product.currency)}
              </span>
            </div>
          </div>

          <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-900/40 transition-all hover:bg-blue-500 hover:scale-105 active:scale-95 group/btn">
            <ArrowRight className="h-5 w-5 transition-transform group-hover/btn:translate-x-0.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );

  if (disableNavigation) {
    return Content;
  }

  return (
    <Link href={`/marketplace/products/${product.slug}`} onClick={handleClick}>
      {Content}
    </Link>
  );
};
