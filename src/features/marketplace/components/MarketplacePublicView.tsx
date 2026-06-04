import React, { useCallback, useState } from "react";
import { MarketplacePublicHero } from "./MarketplacePublicHero";
import { MarketplaceSearch } from "./MarketplaceSearch";
import { ProductCardCompact } from "./ProductCardCompact";
import { VideoDemoSection } from "./VideoDemoSection";
import { ProductSkeleton } from "./ProductSkeleton";
import { CouponFAB } from "./CouponFAB";
import { useMarketplaceProducts } from "../hooks/useMarketplaceProducts";
import { MarketplaceProduct } from "../types";
import { Storefront } from "@phosphor-icons/react";
import { AnimatePresence } from "motion/react";
import dynamic from "next/dynamic";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useTranslations } from "next-intl";
import { AuthPromptProvider } from "../context/AuthPromptContext";
import { setAuthIntent, MarketplaceAuthIntent } from "../utils/authIntent";

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
  const t = useTranslations("marketplace");
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [detailProduct, setDetailProduct] = useState<MarketplaceProduct | null>(
    null,
  );

  // Data from Storefront
  const { products, loading: isLoading, reset } = useMarketplaceProducts();

  const handleViewDetails = (product: MarketplaceProduct) => {
    setDetailProduct(product);
  };

  const handlePurchaseAction = (product?: MarketplaceProduct) => {
    if (product) {
      sessionStorage.setItem("pending_purchase_modal_id", product.id);
      // También persistimos el intent rico (con tab "overview") para que el
      // dashboard reabra el modal en la misma posición.
      setAuthIntent({ productId: product.id, tab: "overview" });
    }
    // En público, adquirir redirige a login
    setShowLoginModal(true);
  };

  // Disparado por componentes hijos (p. ej. el form de reseñas dentro del
  // ProductDetailModal). Persiste el intent + abre el login global.
  const handleRequestLogin = useCallback((intent: MarketplaceAuthIntent) => {
    setAuthIntent(intent);
    // Mantenemos el sessionStorage legacy para no romper otros flujos.
    sessionStorage.setItem("pending_purchase_modal_id", intent.productId);
    setShowLoginModal(true);
  }, []);

  return (
    <AuthPromptProvider onRequestLogin={handleRequestLogin}>
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <MarketplacePublicHero />

      {/* MagnifyingGlass Section - Restored Original Position */}
      <MarketplaceSearch />

      {/* Products Section */}
      <div className="px-6 pb-4" id="marketplace-catalog">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 px-4 md:px-8">
          <div>
            <h2
              className={`text-2xl md:text-3xl font-bold mb-1 md:mb-2 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {t("available_solutions")}
            </h2>
            <p
              className={`text-xs md:text-sm ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {t("every_product_includes")}
            </p>
          </div>
          <div
            className={`text-xs px-3 py-1.5 rounded-full inline-flex self-start ${
              isDark
                ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                : "bg-cyan-50 text-cyan-700 border border-cyan-200"
            }`}
          >
            {t("products_count", { count: products.length })}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6 px-4 md:px-8">
              {[...Array(6)].map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10 mx-8">
              <Storefront className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-500">
                {t("no_products_found")}
              </h3>
              <button
                onClick={reset}
                className="text-cyan-500 mt-2 hover:underline"
              >
                {t("clear_filters")}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6 px-4 md:px-8">
              {products.map((product) => (
                <ProductCardCompact
                  key={product.id}
                  product={product}
                  onSelect={() => handlePurchaseAction(product)}
                  onViewDetails={() => handleViewDetails(product)}
                  accessLevel="none"
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
        message={t("login_to_acquire")}
      />

      {detailProduct && (
        <ProductDetailModal
          initialProduct={detailProduct}
          onClose={() => setDetailProduct(null)}
          onPurchase={() => {
            // Logic for purchase inside modal -> Force Login
            handlePurchaseAction(detailProduct);
            setDetailProduct(null);
          }}
        />
      )}

      {/* Floating Action Button for Coupons */}
      <CouponFAB />
    </div>
    </AuthPromptProvider>
  );
}
