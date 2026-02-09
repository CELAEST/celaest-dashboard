"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import dynamic from "next/dynamic";
import { MarketplaceFilterSidebar } from "./MarketplaceFilterSidebar";
import { ProductCardCompact } from "./ProductCardCompact";
import { ProductSkeleton } from "./ProductSkeleton";
import { useMarketplaceProducts } from "../hooks/useMarketplaceProducts";
import { MarketplaceProduct } from "../types";
import { Store } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { useAssets } from "@/features/assets/hooks/useAssets";
import { LicenseModal } from "./modals/LicenseModal";
import { toast } from "sonner";

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
 */
export function MarketplaceDashboardView() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { isAuthenticated } = useAuthStore();

  // Data from Store
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
    refresh: refreshAssets,
    downloadAsset,
  } = useAssets();

  // Helper check for ownership (Purchased OR Created/Inventory)
  const checkIsOwned = (prod: MarketplaceProduct) => {
    if (!prod) return false;
    const inAssets = assets.some(
      (a) => a.productId === prod.id || a.slug === prod.slug,
    );
    const inInventory = inventory?.some(
      (a) => a.productId === prod.id || a.slug === prod.slug,
    );
    return inAssets || inInventory;
  };

  // Modal states
  const searchParams = useSearchParams();
  const [selectedProduct, setSelectedProduct] =
    useState<MarketplaceProduct | null>(null);
  const [detailProduct, setDetailProduct] = useState<MarketplaceProduct | null>(
    null,
  );
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [purchaseFlowStep, setPurchaseFlowStep] = useState(1);
  const [showLicenseModal, setShowLicenseModal] = useState(false);
  const [selectedLicenseId, setSelectedLicenseId] = useState<string | null>(
    null,
  );

  // Detect Stripe Success Return - Guided Activation Flow
  useEffect(() => {
    const isSuccess = searchParams.get("success") === "true";
    const productIdFromUrl = searchParams.get("product_id");

    if (isSuccess && !selectedProduct) {
      console.log(
        "[Marketplace] Stripe return detected. Success: true, ID:",
        productIdFromUrl,
      );

      // 1. Try to find the real product
      const foundProduct = products.find((p) => p.id === productIdFromUrl);

      if (foundProduct) {
        // Use setTimeout to avoid synchronous state update within effect
        setTimeout(() => {
          setPurchaseFlowStep(3);
          setSelectedProduct(foundProduct);
          // Clear URL
          const url = new URL(window.location.href);
          url.searchParams.delete("success");
          url.searchParams.delete("product_id");
          window.history.replaceState({}, "", url.toString());
        }, 0);
      } else if (!isLoading && products.length > 0) {
        // Fallback: If we have products but didn't find the ID, or ID is missing,
        // we still want to open the modal to show something to the user.
        setTimeout(() => {
          setPurchaseFlowStep(3);
          setSelectedProduct({
            id: productIdFromUrl || "pending",
            organization_id: "",
            slug: "pending-activation",
            name: "Tu Solución Profesional",
            short_description: "Activación en proceso",
            description: "Preparando tu entorno...",
            base_price: 0,
            currency: "USD",
            category_id: "",
            category_name: "Activation",
            rating_avg: 5,
            rating_count: 0,
            thumbnail_url:
              "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&fm=webp",
            images: [],
            tags: [],
            features: [],
            technical_stack: [],
            seller_name: "CELAEST",
            created_at: new Date().toISOString(),
          });
        }, 0);
      }
    }
  }, [searchParams, products, isLoading, selectedProduct]);

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

  const handleRatingChange = (rating: number) => {
    // El API no tiene filtro de rating explícito en SearchFilter, pero podemos sortear o filtrar en cliente
    // Por ahora lo ignoramos o lo usamos para sort si implementamos sort by rating
    if (rating > 0) {
      updateFilters({ sort: "rating" });
    }
  };

  const handlePriceRangeChange = (range: string) => {
    // range format: "0-50", "50-100", "100+"
    if (range === "all") {
      updateFilters({ min_price: undefined, max_price: undefined });
      return;
    }

    if (range.includes("+")) {
      const min = parseInt(range.replace("+", ""));
      updateFilters({ min_price: min, max_price: undefined });
    } else {
      const [min, max] = range.split("-").map(Number);
      updateFilters({ min_price: min, max_price: max });
    }
  };

  const handlePurchaseAction = () => {
    // En público, adquirir redirige a login (_product reservado para futuro uso)
    setShowLoginModal(true);
  };

  const handleProductSelect = (product: MarketplaceProduct) => {
    if (!isAuthenticated) {
      handlePurchaseAction();
      return;
    }
    setPurchaseFlowStep(1); // Reset to start
    setSelectedProduct(product);
  };

  const clearFilters = () => {
    reset();
  };

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
            price: selectedProduct.base_price.toString(),
            image: selectedProduct.thumbnail_url,
          }}
          initialStep={purchaseFlowStep}
          onSuccess={() => {
            refreshAssets(true);
            toast.success("Producto adquirido correctamente");
          }}
        />
      )}

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        message="Sign in to purchase this enterprise solution."
      />

      {detailProduct && (
        <ProductDetailModal
          initialProduct={detailProduct}
          onClose={() => setDetailProduct(null)}
          isOwned={checkIsOwned(detailProduct)}
          onDownload={() => {
            const asset = assets.find(
              (a) =>
                a.productId === detailProduct.id ||
                a.slug === detailProduct.slug,
            );
            if (asset) {
              downloadAsset(asset.id, detailProduct.slug);
            }
          }}
          onViewLicense={() => {
            if (!detailProduct) return;

            console.log(
              "[Marketplace] Opening license for:",
              detailProduct.slug,
            );

            // Normalize current ID/Slug for comparison
            const prodId = detailProduct.id;
            const prodSlug = detailProduct.slug;

            // 1. Priority: Check inventory (Developer/Owner view)
            // If the user is the owner/developer, they always get the preview key
            const invItem = inventory?.find(
              (a) => a.productId === prodId || a.slug === prodSlug,
            );

            if (invItem) {
              console.log(
                "[Marketplace] User is Owner/Developer. Using OWNER_PREVIEW for:",
                prodId,
              );
              setSelectedLicenseId("OWNER_PREVIEW");
              setShowLicenseModal(true);
              return;
            }

            // 2. Check purchased assets (Customer view)
            const asset = assets.find(
              (a) => a.productId === prodId || a.slug === prodSlug,
            );

            if (asset) {
              if (asset.license_id) {
                console.log(
                  "[Marketplace] Found license_id in asset:",
                  asset.license_id,
                );
                setSelectedLicenseId(asset.license_id);
                setShowLicenseModal(true);
              } else {
                console.warn(
                  "[Marketplace] Asset found but NO license_id:",
                  asset,
                );
                toast.info("Este producto no requiere clave de licencia.");
              }
              return;
            }

            // 3. Fallback: Neither found
            console.error(
              "[Marketplace] Product NOT found in assets OR inventory. Prods in assets:",
              assets.length,
              "Prods in inventory:",
              inventory?.length,
            );
            toast.error(
              "No se encontró información de propiedad para este producto.",
            );
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
        {/* Filter Sidebar - Desktop */}
        <div className="hidden lg:block h-full min-h-0">
          <MarketplaceFilterSidebar
            selectedCategories={filters.category ? [filters.category] : ["all"]}
            onCategoryChange={handleCategoryChange}
            selectedRating={0} // TODO: Map store filter to UI state if needed
            onRatingChange={handleRatingChange}
            priceRange="all" // TODO: Map store filter to UI state if needed
            onPriceRangeChange={handlePriceRangeChange}
            totalProducts={total}
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
            ) : products.length === 0 ? (
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
                {products.map((product) => (
                  <ProductCardCompact
                    key={product.id}
                    product={product}
                    onSelect={() => handleProductSelect(product)}
                    onViewDetails={() => setDetailProduct(product)}
                    isOwned={checkIsOwned(product)}
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
