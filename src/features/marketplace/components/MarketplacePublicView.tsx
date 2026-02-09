import React, { useState } from "react";
import { MarketplacePublicHero } from "./MarketplacePublicHero";
import { MarketplaceSearch } from "./MarketplaceSearch";
import { ProductCardPremium } from "./ProductCardPremium";
import { VideoDemoSection } from "./VideoDemoSection";
import { ProductSkeleton } from "./ProductSkeleton";
import { useMarketplaceProducts } from "../hooks/useMarketplaceProducts";
import { MarketplaceProduct } from "../types";
import { Store } from "lucide-react";
import { AnimatePresence } from "motion/react";
import dynamic from "next/dynamic";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

const LoginModal = dynamic(
  () =>
    import("@/features/auth/components/LoginModal").then((m) => ({
      default: m.LoginModal,
    })),
  { loading: () => null },
);

const ProductDetailModal = dynamic(
  () =>
    import("./modals/ProductDetailModal").then((m) => ({
      default: m.ProductDetailModal,
    })),
  { loading: () => null },
);

export function MarketplacePublicView() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [detailProduct, setDetailProduct] = useState<MarketplaceProduct | null>(
    null,
  );

  // Data from Store
  const { products, loading: isLoading, reset } = useMarketplaceProducts();

  const handleViewDetails = (product: MarketplaceProduct) => {
    setDetailProduct(product);
  };

  const handlePurchaseAction = () => {
    // En público, adquirir redirige a login
    setShowLoginModal(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <MarketplacePublicHero />

      {/* Search Section - Restored Original Position */}
      <MarketplaceSearch />

      {/* Products Section */}
      <div className="px-6 pb-4" id="marketplace-catalog">
        <div className="flex items-center justify-between mb-8 px-8">
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
            {products.length} productos
          </div>
        </div>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 px-8">
              {[...Array(6)].map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10 mx-8">
              <Store className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-500">
                No se encontraron productos
              </h3>
              <button
                onClick={reset}
                className="text-cyan-500 mt-2 hover:underline"
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 px-8">
              {products.map((product) => (
                <ProductCardPremium
                  key={product.id}
                  product={product}
                  onSelect={() => handlePurchaseAction()}
                  onViewDetails={() => handleViewDetails(product)}
                />
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Video Demo Section (Includes Testimonials & TrustBadges) */}
      <VideoDemoSection />

      {/* Modals */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        message="Inicia sesión para adquirir soluciones premium."
      />

      {detailProduct && (
        <ProductDetailModal
          initialProduct={detailProduct}
          onClose={() => setDetailProduct(null)}
          onPurchase={() => {
            // Logic for purchase inside modal -> Force Login
            setDetailProduct(null);
            setShowLoginModal(true);
          }}
        />
      )}
    </div>
  );
}
