"use client";

import React, { useCallback, useState } from "react";
import { MarketplacePublicHero } from "./MarketplacePublicHero";
import { ProductCardCompact } from "./ProductCardCompact";
import { MarketplaceProduct } from "../types";
import { useMarketplaceProducts } from "../hooks/useMarketplaceProducts";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { MagnifyingGlass, ArrowCounterClockwise } from "@phosphor-icons/react";
import dynamic from "next/dynamic";
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
  const tCommon = useTranslations("common");
  const { isDark } = useTheme();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [detailProduct, setDetailProduct] = useState<MarketplaceProduct | null>(
    null,
  );

  // Data from Storefront
  const {
    products,
    loading: isLoading,
    reset,
    error: marketplaceError,
    refresh: refreshMarketplace,
  } = useMarketplaceProducts();

  const [selectedTier, setSelectedTier] = useState<string>("all");

  const PLAN_TIERS = React.useMemo(
    () => [
      { id: "all", label: tCommon("all") },
      { id: "Starter+", label: "Starter+" },
      { id: "Pro Tier", label: "Pro Tier" },
      { id: "Enterprise", label: "Enterprise" },
    ],
    [tCommon],
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
          className="bg-black px-4 pb-24 sm:pb-16 pt-3 sm:pt-4 sm:px-6 lg:px-8"
          id="marketplace-catalog"
        >
          <div className="mx-auto mb-6 flex flex-col items-center sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4 text-center sm:text-left">
            <div className="flex items-baseline justify-center sm:justify-start gap-2.5">
              <h2
                className={`text-xl sm:text-2xl font-bold tracking-tight ${
                  isDark ? "text-white" : "text-zinc-900"
                }`}
              >
                {t("available_solutions")}
              </h2>
              <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.18em] uppercase text-white/40 font-semibold">
                ({visibleProducts.length})
              </span>
            </div>

            {/* Plan Tier Filters (Centrado en mobile, sin cortes) */}
            <div className="w-full sm:w-auto flex justify-center">
              <div
                className={`inline-flex items-center gap-0.5 sm:gap-1 p-1 rounded-xl border max-w-full overflow-x-auto no-scrollbar touch-pan-x overscroll-x-contain ${
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
                      className={`whitespace-nowrap shrink-0 px-3 sm:px-3.5 py-1.5 rounded-lg font-mono text-[11px] font-semibold tracking-wider transition-all cursor-pointer active:scale-[0.97] flex items-center justify-center ${
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
            </div>
          </div>

          {isLoading ? (
            <div className="mx-auto grid max-w-392 grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 xl:grid-cols-3">
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
          ) : marketplaceError && visibleProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[320px] sm:min-h-[380px] w-full max-w-md mx-auto p-6 sm:p-12 text-center">
              <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/8 flex items-center justify-center text-white/40 mb-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl">
                <ArrowCounterClockwise size={24} weight="duotone" className="text-white/40" />
              </div>
              <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-white/40 mb-1 font-semibold">
                Catálogo
              </span>
              <h3 className="text-base font-bold text-white tracking-tight font-jakarta">
                Error al sincronizar el catálogo
              </h3>
              <p className="text-xs text-white/40 max-w-xs mx-auto mt-1.5 leading-relaxed font-sans">
                {marketplaceError || "No se pudo conectar con el catálogo en este momento."}
              </p>
              <button
                type="button"
                onClick={() => refreshMarketplace()}
                className="mt-5 w-full sm:w-auto px-5 py-2.5 sm:py-2 min-h-[44px] sm:min-h-0 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider text-white/80 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 transition-all cursor-pointer shadow-xs active:scale-95 flex items-center justify-center gap-2"
              >
                <ArrowCounterClockwise size={13} weight="bold" />
                <span>Reintentar conexión</span>
              </button>
            </div>
          ) : visibleProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[320px] sm:min-h-[380px] w-full max-w-md mx-auto p-6 sm:p-12 text-center">
              <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/8 flex items-center justify-center text-white/40 mb-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl">
                <MagnifyingGlass size={24} weight="duotone" className="text-white/40" />
              </div>
              <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-white/40 mb-1 font-semibold">
                Catálogo
              </span>
              <h3 className="text-base font-bold text-white tracking-tight font-jakarta">
                {t("no_products_found")}
              </h3>
              <p className="text-xs text-white/40 max-w-xs mx-auto mt-1.5 leading-relaxed font-sans">
                No hay productos que coincidan con los criterios seleccionados. Prueba a restablecer los filtros para explorar el catálogo completo.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedTier("all");
                  reset();
                  refreshMarketplace();
                }}
                className="mt-5 w-full sm:w-auto px-5 py-2.5 sm:py-2 min-h-[44px] sm:min-h-0 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider text-white/80 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 transition-all cursor-pointer shadow-xs active:scale-95 flex items-center justify-center gap-2"
              >
                <ArrowCounterClockwise size={13} weight="bold" />
                <span>{t("clear_filters")}</span>
              </button>
            </div>
          ) : (
            <div className="mx-auto grid max-w-392 grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 xl:grid-cols-3">
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
