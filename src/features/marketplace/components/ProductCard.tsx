"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ShieldCheck, ArrowRight } from "lucide-react";
import { MarketplaceProduct } from "../types";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

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
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md transition-all hover:border-blue-500/30 hover:bg-black/60 cursor-pointer h-full"
      onClick={disableNavigation ? handleClick : undefined}
    >
      {/* Imagen del Producto */}
      <div className="relative aspect-video w-full overflow-hidden bg-white/5">
        <Image
          src={product.thumbnail_url || "/placeholder-product.jpg"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Rating Badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-xs font-medium text-blue-400 backdrop-blur-md border border-white/10">
          <Star className="h-3 w-3 fill-current" />
          {product.rating_avg.toFixed(1)}
        </div>
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
              Verificado
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
            <span className="text-xs text-white/40 font-medium">Desde</span>
            <span className="text-xl font-bold text-white tracking-tight">
              {formatCurrency(product.base_price, product.currency)}
            </span>
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
