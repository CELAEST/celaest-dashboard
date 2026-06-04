import React, { useCallback, useState } from "react";
import { MarketplacePublicHero } from "./MarketplacePublicHero";
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
      // Persistimos el intent rico para que el dashboard reabra el modal.
      setAuthIntent({ productId: product.id, tab: "overview" });
    }
    setShowLoginModal(true);
  };

  const handleRequestLogin = useCallback((intent: MarketplaceAuthIntent) => {
    setAuthIntent(intent);
    // Mantenemos el sessionStorage legacy para no romper otros flujos.
    sessionStorage.setItem("pending_purchase_modal_id", intent.productId);
    setShowLoginModal(true);
  }, []);

  return (
    <AuthPromptProvider onRequestLogin={handleRequestLogin}>
      <div className="flex flex-col min-h-screen">
        <MarketplacePublicHero />

        <div
          className="bg-black px-5 pb-4 pt-7 sm:px-8 lg:px-10"
          id="marketplace-catalog"
        >
          <div className="mx-auto mb-5 flex max-w-7xl items-start justify-between gap-4">
            <div>
              <h2
                className={`text-xl font-black sm:text-2xl ${
                  isDark ? "text-white" : "text-gray-950"
                }`}
              >
                {t("available_solutions")}
              </h2>
              <p
                className={`mt-1 text-xs sm:text-sm ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {t("every_product_includes")}
              </p>
            </div>
            <div
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${
                isDark
                  ? "border border-blue-500/25 bg-blue-500/10 text-cyan-300"
                  : "border border-blue-200 bg-blue-50 text-blue-700"
              }`}
            >
              {t("products_count", { count: products.length })}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {isLoading ? (
              <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {[...Array(6)].map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="mx-auto max-w-7xl rounded-3xl border border-dashed border-white/10 bg-white/5 py-20 text-center">
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
              <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
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
        <CouponFAB onRequireLogin={() => setShowLoginModal(true)} />
      </div>
    </AuthPromptProvider>
  );
}
