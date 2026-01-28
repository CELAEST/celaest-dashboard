"use client";

import React from "react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import dynamic from "next/dynamic";
import { MarketplaceHero } from "@/features/marketplace/components/MarketplaceHero";

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
import { MarketplaceSearch } from "@/features/marketplace/components/MarketplaceSearch";
import { MarketplaceGrid } from "@/features/marketplace/components/MarketplaceGrid";
import { VideoDemoSection } from "@/features/marketplace/components/VideoDemoSection";

import { useMarketplaceLogic } from "@/features/marketplace/hooks/useMarketplaceLogic";

export const MarketplaceView: React.FC = () => {
  const { theme } = useTheme();

  const {
    selectedProduct,
    setSelectedProduct,
    isLoading,
    showLoginModal,
    setShowLoginModal,
    detailProduct,
    setDetailProduct,
    isLoadingMore,
    visibleCount,
    searchContainerRef,
    productsGridRef,
    loadMoreRef,
    handleProductSelect,
    handleScrollToCatalog,
    filteredProducts,
    visibleProducts,
  } = useMarketplaceLogic();

  const isDark = theme === "dark";

  return (
    <div
      className={`
        min-h-screen rounded-2xl transition-all duration-500
        ${isDark ? "bg-[#000000]" : "bg-white"}
      `}
    >
      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .catalog-scroll::-webkit-scrollbar {
          width: 1px;
        }
        .catalog-scroll::-webkit-scrollbar-track {
          background: ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"};
          border-radius: 3px;
        }
        .catalog-scroll::-webkit-scrollbar-thumb {
          background: ${isDark ? "rgba(0,255,255,0.3)" : "rgba(0,0,0,0.2)"};
          border-radius: 3px;
        }
        .catalog-scroll::-webkit-scrollbar-thumb:hover {
          background: ${isDark ? "rgba(0,255,255,0.5)" : "rgba(0,0,0,0.3)"};
        }
        .catalog-scroll {
          scrollbar-width: thin;
          scrollbar-color: ${isDark
            ? "rgba(0,255,255,0.3) rgba(255,255,255,0.05)"
            : "rgba(0,0,0,0.2) rgba(0,0,0,0.05)"};
        }
      `}</style>

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

      {/* Main Content */}
      <MarketplaceHero ref={null} onScrollToCatalog={handleScrollToCatalog} />

      <MarketplaceSearch ref={searchContainerRef} />

      <MarketplaceGrid
        ref={productsGridRef}
        products={visibleProducts}
        isLoading={isLoading}
        isLoadingMore={isLoadingMore}
        visibleCount={visibleCount}
        totalFiltered={filteredProducts.length}
        onProductSelect={handleProductSelect}
        onViewDetails={setDetailProduct}
        loadMoreRef={loadMoreRef}
      />

      <VideoDemoSection />
    </div>
  );
};
