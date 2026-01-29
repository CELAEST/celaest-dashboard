"use client";

import React, { useState, useMemo } from "react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import dynamic from "next/dynamic";
import { MarketplaceFilterSidebar } from "./MarketplaceFilterSidebar";
import { ProductCardCompact } from "./ProductCardCompact";
import { ProductSkeleton } from "./ProductSkeleton";
import { products } from "../constants/products";
import { Store } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const PurchaseFlow = dynamic(
  () =>
    import("./modals/PurchaseFlow").then((m) => ({ default: m.PurchaseFlow })),
  { loading: () => null },
);
const ProductDetailModal = dynamic(
  () =>
    import("./modals/ProductDetailModal").then((m) => ({
      default: m.ProductDetailModal,
    })),
  { loading: () => null },
);
const LoginModal = dynamic(
  () =>
    import("@/features/auth/components/LoginModal").then((m) => ({
      default: m.LoginModal,
    })),
  { loading: () => null },
);

/**
 * Marketplace Dashboard View (Operativo)
 *
 * This is the OPERATIONAL version of the Marketplace for AUTHENTICATED users.
 * It features:
 * - Zero-Scroll architecture (only internal grid scrolls)
 * - Filter sidebar for efficient navigation
 * - Dense product grid (6 cols on 2xl)
 * - Compact cards optimized for productivity
 *
 * The PUBLIC/MARKETING version is in MarketplaceView.tsx
 */
export function MarketplaceDashboardView() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Modal states
  const [selectedProduct, setSelectedProduct] = useState<
    (typeof products)[0] | null
  >(null);
  const [detailProduct, setDetailProduct] = useState<
    (typeof products)[0] | null
  >(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "all",
  ]);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [priceRange, setPriceRange] = useState<string>("all");

  // Loading state
  const [isLoading] = useState(false);

  // Filter logic
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search filter

      // Rating filter
      if (selectedRating > 0 && (product.rating || 5) < selectedRating) {
        return false;
      }

      return true;
    });
  }, [selectedRating]);

  const handleCategoryChange = (category: string) => {
    if (category === "all") {
      setSelectedCategories(["all"]);
    } else {
      setSelectedCategories((prev) => {
        if (prev.includes(category)) {
          const filtered = prev.filter((c) => c !== category);
          return filtered.length === 0
            ? ["all"]
            : filtered.filter((c) => c !== "all");
        } else {
          return [...prev.filter((c) => c !== "all"), category];
        }
      });
    }
  };

  const handleProductSelect = (product: (typeof products)[0]) => {
    setSelectedProduct(product);
  };

  const clearFilters = () => {
    setSelectedCategories(["all"]);
    setSelectedRating(0);
    setPriceRange("all");
  };

  return (
    <div
      className={`h-full flex flex-col overflow-hidden ${isDark ? "text-white" : "text-gray-900"}`}
    >
      {/* Modals */}
      <PurchaseFlow
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        product={selectedProduct}
      />
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        message="Sign in to purchase this enterprise solution."
      />
      <ProductDetailModal
        product={detailProduct}
        onClose={() => setDetailProduct(null)}
        onPurchase={() => {
          if (detailProduct) {
            setDetailProduct(null);
            handleProductSelect(detailProduct);
          }
        }}
      />

      {/* Main Content - Zero-Scroll Container */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Filter Sidebar - Desktop */}
        <div className="hidden lg:block h-full min-h-0">
          <MarketplaceFilterSidebar
            selectedCategories={selectedCategories}
            onCategoryChange={handleCategoryChange}
            selectedRating={selectedRating}
            onRatingChange={setSelectedRating}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            totalProducts={products.length}
          />
        </div>

        {/* Product Grid - Hybrid Scroll: Fast scrolling + Auto-align on stop */}
        <div
          className="flex-1 overflow-y-auto custom-scrollbar p-5 snap-y snap-mandatory scroll-smooth"
          style={{ scrollPaddingTop: "2rem" }}
        >
          <AnimatePresence mode="wait">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-6">
                {[...Array(12)].map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-full"
              >
                <Store
                  size={48}
                  className={isDark ? "text-gray-700" : "text-gray-300"}
                />
                <p
                  className={`mt-4 text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}
                >
                  No se encontraron productos
                </p>
                <button
                  onClick={clearFilters}
                  className={`mt-2 text-xs ${isDark ? "text-cyan-400" : "text-cyan-600"}`}
                >
                  Limpiar filtros
                </button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-6"
              >
                {filteredProducts.map((product) => (
                  <ProductCardCompact
                    key={product.id}
                    {...product}
                    onSelect={() => handleProductSelect(product)}
                    onViewDetails={() => setDetailProduct(product)}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
