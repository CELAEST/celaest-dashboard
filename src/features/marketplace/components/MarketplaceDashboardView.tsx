"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import dynamic from "next/dynamic";
import { MarketplaceFilterSidebar } from "./MarketplaceFilterSidebar";
import { ProductCardCompact } from "./ProductCardCompact";
import { ProductSkeleton } from "./ProductSkeleton";
import { useMarketplaceProducts } from "../hooks/useMarketplaceProducts";
import { MarketplaceProduct } from "../types";
import {
  consumeAuthIntent,
  MarketplaceAuthIntentTab,
} from "../utils/authIntent";
import { Storefront } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "motion/react";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { useOrgStore } from "@/features/shared/stores/useOrgStore";
import { useCheckoutReturn } from "../hooks/useCheckoutReturn";
import { useAssets } from "@/features/assets/hooks/useAssets";
import { useBilling } from "@/features/billing/hooks/useBilling";
import { LicenseModal } from "./modals/LicenseModal";
import { toast } from "sonner";
import { CouponFAB } from "./CouponFAB";
import { useTranslations } from "next-intl";

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
 * - Funnel sidebar for efficient navigation
 * - Dense product grid (6 cols on 2xl)
 * - Compact cards optimized for productivity
 */
export function MarketplaceDashboardView() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { isAuthenticated } = useAuthStore();
  const { currentOrg, isLoading: isOrgsLoading } = useOrgStore();
  const tMarketplace = useTranslations("marketplace");

  // Data from Storefront
  const {
    products,
    loading: isLoading,
    total,
    filters,
    updateFilters,
    reset,
  } = useMarketplaceProducts();

  const {
    assets,
    inventory,
    isLoading: isAssetsLoading,
    refresh: refreshAssets,
    downloadAsset,
  } = useAssets();

  const { plan, isLoading: isBillingLoading } = useBilling();

  // Helper: determine product access level
  const checkAccess = (prod: MarketplaceProduct): "owned" | "plan" | "none" => {
    if (!prod) return "none";

    // 1. Personal Assets — filter by current org so that products purchased in
    // one organization don't bleed into another workspace's marketplace view.
    // Plan virtual assets (accessType === "subscription") belong to the user regardless of workspace, 
    // but the backend assigns them the seller's organization ID.
    const matchedAsset = assets.find(
      (a) =>
        a.status === "active" &&
        (a.productId === prod.id || a.slug === prod.slug) &&
        (!currentOrg || a.organizationId === currentOrg.id || a.accessType === "subscription"),
    );
    if (matchedAsset) {
      // If the asset was granted via subscription/plan, show "En Plan" not "Adquirido"
      if (matchedAsset.accessType === "subscription") return "plan";
      return "owned";
    }

    // 2. Plan Check (Is it included in the current active tier?)
    // We ALWAYS allow this to show "En Plan", even in CELAEST, so they see their plan works.
    if (plan && prod.min_plan_tier > 0 && plan.tier >= prod.min_plan_tier) {
      return "plan";
    }

    // 3. Organization Inventory (B2B sharing)
    // EXCEPTION: In CELAEST context, we ignore organization inventory for the UI button.
    // This allows Super Admins (owners of CELAEST) to still test the purchase flow
    // for products that are NOT included in their current plan.
    const isCelaest = currentOrg?.slug === "celaest-official" || currentOrg?.slug === "celaest" || currentOrg?.slug?.toLowerCase().includes("celaest");
    if (!isCelaest) {
      const inInventory = inventory?.some(
        (a) => a.productId === prod.id || a.slug === prod.slug,
      );
      if (inInventory) return "owned";
    }

    return "none";
  };

  // Modal states
  const {
    selectedProduct,
    setSelectedProduct,
    purchaseFlowStep,
    setPurchaseFlowStep,
  } = useCheckoutReturn(products, isLoading);

  const [detailProduct, setDetailProduct] = useState<MarketplaceProduct | null>(
    null,
  );
  const [detailInitialTab, setDetailInitialTab] =
    useState<MarketplaceAuthIntentTab | undefined>(undefined);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showLicenseModal, setShowLicenseModal] = useState(false);
  const [selectedLicenseId, setSelectedLicenseId] = useState<string | null>(
    null,
  );

  // RBAC validation:
  // 1. In CELAEST, everyone can purchase (personal context)
  // 2. In Standard Orgs, only Owner/SuperAdmin/Admin can purchase
  const isCelaest =
    !currentOrg ||
    currentOrg?.slug === "celaest-official" ||
    currentOrg?.slug === "celaest";
  const canPurchase =
    isCelaest ||
    currentOrg?.role === "owner" ||
    currentOrg?.role === "super_admin" ||
    currentOrg?.role === "admin";

  const getDisabledReason = (
    prod: MarketplaceProduct,
    accessLevel: string,
  ): string | undefined => {
    // 1. Si ya tienen acceso o está en plan (Herencia B2B), no deshabilitamos el botón,
    // sino que cambiará a "Adquirido" o "En Plan" en la UI de la tarjeta.
    if (accessLevel !== "none") return undefined;

    // 2. Prevención de recomprar exactamente su mismo plan actual
    if (plan && prod.min_plan_tier > 0 && plan.tier === prod.min_plan_tier) {
      return tMarketplace("current_plan");
    }

    // 3. RBAC & B2B Flow: Si no lo tiene y no es dueño/admin, orientarlo a solicitarlo.
    // EXCEPCIÓN: En CELAEST (HQ), cualquier rol puede comprar porque es contexto PERSONAL.
    if (!canPurchase && !isCelaest) {
      return tMarketplace("owners_only");
    }

    return undefined;
  };

  const isPaidPlan = plan && plan.tier > 0;
  const isCelaestContext =
    currentOrg?.slug === "celaest-official" || currentOrg?.slug === "celaest";

  // Ocultar banners de CELAEST si ya tiene un plan en la org actual o si no es el contexto adecuado
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const shouldHideCta = isPaidPlan && !isCelaestContext;

  // Handlers para filtros - Conectados al store
  const handleCategoryChange = (category: string) => {
    // Si la categoría es "all", limpiamos el filtro (undefined o "")
    if (category === "all") {
      updateFilters({ category: "" });
    } else {
      // El sidebar maneja multi-selección localmente, pero el API por ahora soporta una categoría
      // Adaptamos para soportar la selección simple del API por ahora
      updateFilters({ category });
    }
  };

  // Rating filter is applied client-side because the backend SearchFilter
  // doesn't expose a min_rating field. We persist the selection in local
  // state and filter the rendered list before mapping.
  const [selectedRating, setSelectedRating] = useState<number>(0);

  const handleRatingChange = (rating: number) => {
    setSelectedRating(rating);
    // Optional: when the user picks a rating tier, also bias the sort toward
    // the best-rated items so the visible cards stay relevant.
    if (rating > 0) {
      updateFilters({ sort: "rating" });
    }
  };

  // Derive the active price range id from the store filters so the sidebar
  // reflects the real state instead of being hardcoded to "all".
  const activePriceRange: string = (() => {
    const { min_price: min, max_price: max } = filters;
    if (min === undefined && max === undefined) return "all";
    if (min === 0 && max === 0) return "free";
    if (min === 0 && max === 50) return "0-50";
    if (min === 50 && max === 200) return "50-200";
    if (min === 200 && max === undefined) return "200+";
    return "all";
  })();

  const handlePriceRangeChange = (range: string) => {
    // range format: "all" | "free" | "0-50" | "50-200" | "200+"
    if (range === "all") {
      updateFilters({ min_price: undefined, max_price: undefined });
      return;
    }
    if (range === "free") {
      updateFilters({ min_price: 0, max_price: 0 });
      return;
    }
    if (range.includes("+")) {
      const min = parseInt(range.replace("+", ""));
      updateFilters({ min_price: min, max_price: undefined });
      return;
    }
    const [min, max] = range.split("-").map(Number);
    updateFilters({ min_price: min, max_price: max });
  };

  const handlePurchaseAction = () => {
    // En público, adquirir redirige a login (_product reservado para futuro uso)
    setShowLoginModal(true);
  };

  const handleProductSelect = (product: MarketplaceProduct) => {
    if (!isAuthenticated) {
      sessionStorage.setItem("pending_purchase_modal_id", product.id);
      handlePurchaseAction();
      return;
    }

    // If org state is loading (e.g. post-workspace-removal transition), wait
    if (isOrgsLoading && !currentOrg) {
      toast.info(tMarketplace("loading_org_session"));
      return;
    }

    // Safety check in case the button wasn't disabled correctly
    const access = checkAccess(product);
    const reason = getDisabledReason(product, access);
    if (reason && reason !== tMarketplace("current_plan")) {
      toast.error(reason);
      return;
    }

    setPurchaseFlowStep(1); // Reset to start
    setSelectedProduct(product);
  };

  const clearFilters = () => {
    reset();
  };

  useEffect(() => {
    if (isAuthenticated && products.length > 0 && !isOrgsLoading && currentOrg && !isAssetsLoading && !isBillingLoading) {
      // 1) Preferimos el intent rico (productId + tab) si lo dejó el flujo
      //    público (p. ej. "Iniciar sesión para dejar tu reseña").
      const intent = consumeAuthIntent();
      const pendingId =
        intent?.productId ??
        sessionStorage.getItem("pending_purchase_modal_id");
      if (pendingId) {
        sessionStorage.removeItem("pending_purchase_modal_id");
        const product = products.find((p) => p.id === pendingId);
        if (product) {
          const access = checkAccess(product);
          // Si veníamos desde una tab específica (p. ej. "reviews"), siempre
          // abrimos el modal de detalle — incluso sin acceso — para que el
          // usuario aterrice exactamente en el lugar donde dejó la acción.
          if (intent?.tab) {
            setDetailInitialTab(intent.tab);
            setDetailProduct(product);
          } else if (access !== "none") {
            setDetailInitialTab(undefined);
            setDetailProduct(product);
          } else {
            handleProductSelect(product);
          }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, products, isOrgsLoading, currentOrg, isAssetsLoading, isBillingLoading]);

  return (
    <div
      className={`h-full flex flex-col overflow-hidden ${isDark ? "text-white" : "text-gray-900"}`}
    >
      {/* Modals - Necesitan adaptadores si sus props son incompatibles, pero intentaremos pasarlos directo
          o mapeados si es necesario. Por ahora asumimos compatibilidad parcial o mapeo en el componente */}
      {selectedProduct && (
        <PurchaseFlow
          key={`${selectedProduct.id}-${purchaseFlowStep}`} // Force remount if step or product changes
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          product={{
            id: selectedProduct.id,
            title: selectedProduct.name,
            base_price: selectedProduct.base_price,
            currency: selectedProduct.currency,
            image: selectedProduct.thumbnail_url,
          }}
          initialStep={purchaseFlowStep}
          onSuccess={() => {
            refreshAssets();
            toast.success(tMarketplace("product_acquired"));
          }}
        />
      )}

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        message={tMarketplace("sign_in_to_purchase")}
      />

      {detailProduct && (
        <ProductDetailModal
          initialProduct={detailProduct}
          initialTab={detailInitialTab}
          onClose={() => {
            setDetailProduct(null);
            setDetailInitialTab(undefined);
          }}
          isOwned={checkAccess(detailProduct) !== "none"}
          accessLevel={checkAccess(detailProduct)}
          onDownload={() => {
            const asset = assets.find(
              (a) =>
                (a.productId === detailProduct.id ||
                  a.slug === detailProduct.slug) &&
                (!currentOrg || a.organizationId === currentOrg.id || a.accessType === "subscription"),
            );
            if (asset) {
              downloadAsset(asset.id, detailProduct.slug);
              return;
            }

            // Check Inventory (Owner)
            const invItem = inventory?.find(
              (a) =>
                a.productId === detailProduct.id ||
                a.slug === detailProduct.slug,
            );
            if (invItem) {
              // Owner Bypass: Use ProductID as AssetID for backend resolution
              downloadAsset(detailProduct.id, detailProduct.slug);
              return;
            }

            // Plan-granted: backend handles via GetPlanGrantedAsset fallback
            // Pass product ID — backend resolves it as a product lookup, not asset lookup
            if (checkAccess(detailProduct) === "plan") {
              downloadAsset(detailProduct.id, detailProduct.slug);
              return;
            }

            toast.error(tMarketplace("no_download_permission"));
          }}
          onViewLicense={() => {
            if (!detailProduct) return;

            // Normalize current ID/Slug for comparison
            const prodId = detailProduct.id;
            const prodSlug = detailProduct.slug;

            // 1. Priority: Check purchased assets (Customer view — real license)
            const asset = assets.find(
              (a) =>
                (a.productId === prodId || a.slug === prodSlug) &&
                (!currentOrg || a.organizationId === currentOrg.id),
            );

            if (asset) {
              if (asset.license_id) {
                setSelectedLicenseId(asset.license_id);
                setShowLicenseModal(true);
              } else {
                toast.info(tMarketplace("no_license_required"));
              }
              return;
            }

            // 2. Fallback: Check inventory (Developer/Owner preview)
            const invItem = inventory?.find(
              (a) => a.productId === prodId || a.slug === prodSlug,
            );

            if (invItem) {
              setSelectedLicenseId("OWNER_PREVIEW");
              setShowLicenseModal(true);
              return;
            }

            // 3. Fallback: Neither found
            toast.error(tMarketplace("no_ownership_found"));
          }}
          onPurchase={() => {
            if (detailProduct) {
              setDetailProduct(null);
              setPurchaseFlowStep(1); // Reset to start
              handleProductSelect(detailProduct);
            }
          }}
        />
      )}

      {/* LicenseModal al final para asegurar precedencia en el stack si es necesario */}
      <LicenseModal
        isOpen={showLicenseModal}
        onClose={() => setShowLicenseModal(false)}
        licenseId={selectedLicenseId}
        productName={detailProduct?.name}
      />

      {/* Main Content - Zero-Scroll Container */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Funnel Sidebar - Desktop */}
        <div className="hidden lg:block h-full min-h-0">
          <MarketplaceFilterSidebar
            selectedCategories={filters.category ? [filters.category] : ["all"]}
            onCategoryChange={handleCategoryChange}
            selectedRating={selectedRating}
            onRatingChange={handleRatingChange}
            priceRange={activePriceRange}
            onPriceRangeChange={handlePriceRangeChange}
            totalProducts={total}
          />
        </div>

        {/* Product Grid - Natural Scroll */}
        <div
          className="flex-1 overflow-y-auto custom-scrollbar p-5"
        >
          <AnimatePresence mode="wait">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-6">
                {[...Array(12)].map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            ) : (() => {
              // Client-side rating filter: rating === 0 means "all"; otherwise
              // we keep products whose average rating is at least the picked
              // tier so the grid mirrors what the sidebar says.
              const visibleProducts =
                selectedRating > 0
                  ? products.filter((p) => (p.rating_avg ?? 0) >= selectedRating)
                  : products;
              return visibleProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-full w-full"
              >
                <Storefront
                  size={48}
                  className={isDark ? "text-gray-700" : "text-gray-300"}
                />
                <p
                  className={`mt-4 text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}
                >
                  {tMarketplace("no_products_found")}
                </p>
                <button
                  onClick={clearFilters}
                  className={`mt-2 text-xs ${isDark ? "text-cyan-400" : "text-cyan-600"}`}
                >
                  {tMarketplace("clear_filters")}
                </button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-6 w-full"
              >
                {visibleProducts.map((product) => {
                  const access = checkAccess(product);
                  return (
                    <ProductCardCompact
                      key={product.id}
                      product={product}
                      onSelect={() => handleProductSelect(product)}
                      onViewDetails={() => setDetailProduct(product)}
                      accessLevel={access}
                      disabledReason={getDisabledReason(product, access)}
                    />
                  );
                })}
              </motion.div>
              );
            })()}
          </AnimatePresence>
        </div>
      </div>

      {/* Coupon Floating Action Button */}
      <CouponFAB />
    </div>
  );
}
