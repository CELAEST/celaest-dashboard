"use client";

import React, { forwardRef } from "react";
import { ProductCardPremium } from "@/features/marketplace/components/ProductCardPremium";
import { ProductSkeleton } from "@/features/marketplace/components/ProductSkeleton";
import { products } from "@/features/marketplace/constants/products";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

interface MarketplaceGridProps {
  products: typeof products;
  isLoading: boolean;
  isLoadingMore: boolean;
  visibleCount: number;
  totalFiltered: number;
  onProductSelect: (product: (typeof products)[0]) => void;
  onViewDetails: (product: (typeof products)[0]) => void;
  loadMoreRef: React.RefObject<HTMLDivElement | null>;
}

export const MarketplaceGrid = React.memo(
  forwardRef<HTMLDivElement, MarketplaceGridProps>(function MarketplaceGrid(
    {
      products: visibleProducts,
      isLoading,
      isLoadingMore,
      visibleCount,
      totalFiltered,
      onProductSelect,
      onViewDetails,
      loadMoreRef,
    },
    ref,
  ) {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
      <div className="px-8" ref={ref}>
        <div className="w-full">
          {/* Section Header */}
          <div className="flex items-center justify-between py-6">
            <div>
              <h2
                className={`text-3xl font-bold mb-2 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Soluciones Disponibles
              </h2>
              <p
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Cada producto incluye garantía de 30 días y soporte premium
              </p>
            </div>
            <div
              className={`text-xs px-3 py-1.5 rounded-full ${
                isDark
                  ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                  : "bg-cyan-50 text-cyan-700 border border-cyan-200"
              }`}
            >
              {totalFiltered} productos
            </div>
          </div>

          {/* Product Grid - Global Scroll */}
          <div className="rounded-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 pb-6">
              {isLoading ? (
                <>
                  {[...Array(4)].map((_, i) => (
                    <ProductSkeleton key={i} />
                  ))}
                </>
              ) : (
                visibleProducts.map((product) => (
                  <ProductCardPremium
                    key={product.id}
                    {...product}
                    onSelect={() => onProductSelect(product)}
                    onViewDetails={() => onViewDetails(product)}
                  />
                ))
              )}
            </div>

            {/* Infinite Scroll Sentinel & Loader */}
            <div
              ref={loadMoreRef as React.RefObject<HTMLDivElement>}
              className="h-20 flex items-center justify-center"
            >
              {isLoadingMore && visibleCount < totalFiltered && (
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full border-2 border-t-transparent animate-spin ${
                      isDark ? "border-cyan-500" : "border-gray-900"
                    }`}
                  />
                  <span
                    className={`text-xs ${
                      isDark ? "text-cyan-500" : "text-gray-600"
                    }`}
                  >
                    Cargando más soluciones...
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }),
);
