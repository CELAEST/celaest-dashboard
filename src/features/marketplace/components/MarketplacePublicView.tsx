"use client";

import React, { useCallback, useState } from "react";
import { MarketplacePublicHero } from "./MarketplacePublicHero";
import { ProductCardCompact } from "./ProductCardCompact";
import { useMarketplaceProducts } from "../hooks/useMarketplaceProducts";
import { MarketplaceProduct } from "../types";
import { Storefront } from "@phosphor-icons/react";
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
  { ssr: false },
);

const ProductDetailModal = dynamic(
  () =>
    import("./modals/ProductDetailModal").then((m) => ({
      default: m.ProductDetailModal,
    })),
  { ssr: false },
);

export function MarketplacePublicView() {
  const t = useTranslations("marketplace");
  const { isDark } = useTheme();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [detailProduct, setDetailProduct] = useState<MarketplaceProduct | null>(
    null,
  );

  // Data from Storefront
  const { products, loading: isLoading, reset } = useMarketplaceProducts();

  const [selectedTier, setSelectedTier] = useState<string>("all");

  const PLAN_TIERS = React.useMemo(
    () => [
      { id: "all", label: t("all_plans") },
      { id: "Starter+", label: "Starter+" },
      { id: "Pro Tier", label: "Pro Tier" },
      { id: "Enterprise", label: "Enterprise" },
    ],
    [t],
  );

  const visibleProducts = React.useMemo(() => {
    return products.filter((p) => {
      if (selectedTier === "all") return true;
      const tierName =
        p.min_plan_tier >= 3
          ? "Enterprise"
          : p.min_plan_tier === 2
            ? "Pro Tier"
            : "Starter+";
      return tierName === selectedTier;
    });
  }, [products, selectedTier]);

  const handleViewDetails = (product: MarketplaceProduct) => {
    setDetailProduct(product);
  };

  const handlePurchaseAction = (product?: MarketplaceProduct) => {
    if (product) {
      sessionStorage.setItem("pending_purchase_modal_id", product.id);
      // Persistimos el intent para que el dashboard reabra el modal tras autenticación
      setAuthIntent({ productId: product.id, tab: "overview" });
    }
    setShowLoginModal(true);
  };

  const handleRequestLogin = useCallback((intent: MarketplaceAuthIntent) => {
    setAuthIntent(intent);
    sessionStorage.setItem("pending_purchase_modal_id", intent.productId);
    setShowLoginModal(true);
  }, []);

  return (
    <AuthPromptProvider onRequestLogin={handleRequestLogin}>
      <div className="flex flex-col min-h-screen bg-black">
        <MarketplacePublicHero />

        <div
          className="bg-black px-4 pb-16 pt-4 sm:px-6 lg:px-8"
          id="marketplace-catalog"
        >
          <div className="mx-auto mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2
                className={`text-xl font-bold sm:text-2xl tracking-tight ${
                  isDark ? "text-white" : "text-zinc-900"
                }`}
              >
                {t("available_solutions")}
              </h2>
            </div>

            {/* Plan Tier Filters + Count */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div
                className={`inline-flex items-center p-1 rounded-xl border ${
                  isDark
                    ? "bg-[#09090b] border-white/[0.08]"
                    : "bg-zinc-100 border-zinc-200"
                }`}
                role="tablist"
                aria-label={t("filter_by_plan")}
              >
                {PLAN_TIERS.map((tier) => {
                  const isSelected = selectedTier === tier.id;
                  return (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setSelectedTier(tier.id)}
                      className={`px-3 py-1.5 rounded-lg font-mono text-[11px] font-semibold tracking-wider transition-all cursor-pointer ${
                        isSelected
                          ? isDark
                            ? "bg-white/10 text-white shadow-xs"
                            : "bg-white text-zinc-900 shadow-xs"
                          : isDark
                            ? "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                            : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50"
                      }`}
                    >
                      {tier.label}
                    </button>
                  );
                })}
              </div>

              <div
                className={`shrink-0 rounded-xl px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] font-semibold border ${
                  isDark
                    ? "border-white/[0.08] bg-white/[0.03] text-zinc-300"
                    : "border-zinc-200 bg-zinc-100 text-zinc-700"
                }`}
              >
                {t("products_count", { count: visibleProducts.length })}
              </div>
            </div>
          </div>

          {isLoading && products.length === 0 ? (
            <div className="mx-auto grid max-w-392 grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-[#09090b] border border-white/[0.06] aspect-16/10 animate-pulse flex flex-col justify-end p-5"
                >
                  <div className="h-4 w-1/3 bg-white/[0.05] rounded mb-2" />
                  <div className="h-3 w-2/3 bg-white/[0.03] rounded" />
                </div>
              ))}
            </div>
          ) : visibleProducts.length === 0 ? (
            <div className="mx-auto max-w-392 rounded-3xl border border-dashed border-white/10 bg-white/[0.02] py-20 text-center">
              <Storefront className="mx-auto h-12 w-12 text-zinc-500 mb-4" />
              <h3 className="text-base font-semibold text-zinc-400">
                {t("no_products_found")}
              </h3>
              <button
                onClick={() => {
                  setSelectedTier("all");
                  reset();
                }}
                className="mt-3 px-4 py-2 rounded-xl text-xs font-semibold bg-white text-black hover:bg-zinc-200 transition-all cursor-pointer font-mono uppercase tracking-wider"
              >
                {t("clear_filters")}
              </button>
            </div>
          ) : (
            <div className="mx-auto grid max-w-392 grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {visibleProducts.map((product, index) => (
                <ProductCardCompact
                  key={product.id}
                  product={product}
                  onSelect={() => handlePurchaseAction(product)}
                  onViewDetails={() => handleViewDetails(product)}
                  accessLevel="none"
                  priority={index < 3}
                />
              ))}
            </div>
          )}
        </div>

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
              handlePurchaseAction(detailProduct);
              setDetailProduct(null);
            }}
          />
        )}
      </div>
    </AuthPromptProvider>
  );
}
