"use client";

import React, { useState, useMemo } from "react";
import { AnimatePresence } from "motion/react";
import { Cube } from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { toast } from "sonner";
import { logger } from "@/lib/logger";
import { ProductDetailModal } from "./ProductDetailModal";
import { Asset } from "../services/assets.service";
import { ProductCardCompact } from "@/features/marketplace/components/ProductCardCompact";
import { MarketplaceProduct } from "@/features/marketplace/types";
import { useAssets } from "../hooks/useAssets";
import { useTranslations } from "next-intl";

interface AssetCustomerCatalogProps {
  assets: Asset[];
  searchQuery?: string;
  filter?: string;
}

export const AssetCustomerCatalog: React.FC<
  AssetCustomerCatalogProps
> = ({
  searchQuery: externalSearchQuery,
  filter: externalFilter,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const t = useTranslations("marketplace");
  const [selectedProduct, setSelectedProduct] = useState<Asset | null>(null);
  const [internalFilter] = useState<string>("all");
  const [internalSearchQuery] = useState("");

  const filter = externalFilter !== undefined ? externalFilter : internalFilter;
  const searchQuery = externalSearchQuery !== undefined ? externalSearchQuery : internalSearchQuery;

  const { assets, isLoading, refresh, downloadAsset } = useAssets();
  const [downloading, setDownloading] = useState<string | null>(null);

  // Use real assets (purchased items)
  const displayAssets = useMemo(() => {
    return assets;
  }, [assets]);

  // Refresh on mount ONLY (sin dependencias para evitar loop infinito)
  React.useEffect(() => {
    refresh();
  }, [refresh]);

  // Check if we need to auto-open an asset modal from a recent purchase
  React.useEffect(() => {
    const openAssetId = sessionStorage.getItem("open_asset_modal_id");
    if (openAssetId && assets && assets.length > 0) {
      const assetToOpen = assets.find((a) => a.id === openAssetId || a.productId === openAssetId);
      if (assetToOpen) {
        setSelectedProduct(assetToOpen);
        sessionStorage.removeItem("open_asset_modal_id");
      }
    }
  }, [assets]);

  const filteredAssets = useMemo(() => {
    return displayAssets.filter((item) => {
      let matchesFilter = filter === "all";

      if (!matchesFilter) {
        matchesFilter =
          item.categoryName === filter || item.categoryId === filter;
      }

      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [displayAssets, filter, searchQuery]);

  const handleAction = async (
    product: Asset,
    type: "download" | "cart" | "docs",
  ) => {
    if (type === "download") {
      setDownloading(product.id);
      try {
        await downloadAsset(product.id, product.slug);
        toast.success(t("download_started"));
      } catch (error: unknown) {
        logger.error("DownloadSimple failed", error);
        toast.error(t("download_failed"));
      } finally {
        setDownloading(null);
      }
    } else if (type === "docs") {
      // Placeholder for docs
      toast.info(t("documentation_soon"));
    }
  };

  return (
    <div className="h-full flex flex-col min-h-0 relative">
      {/* Grid Content — Full Height */}
      <div className="flex-1 min-h-0 relative">
        <div className="absolute inset-0 overflow-y-auto pr-1 pb-6 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            <AnimatePresence mode="popLayout">
              {filteredAssets.map((product, index) => {
                const mappedProduct: MarketplaceProduct = {
                  id: product.productId || product.id,
                  organization_id: product.organizationId || "",
                  slug: product.slug,
                  name: product.name,
                  short_description: product.shortDescription || "",
                  description: product.description || "",
                  base_price: product.price || 0,
                  currency: "USD",
                  category_id: product.categoryId || "",
                  category_name: product.categoryName || product.category || "",
                  rating_avg: product.rating || 0,
                  rating_count: product.reviews || 0,
                  thumbnail_url: product.thumbnail || "",
                  youtube_video_id: product.youtubeVideoId,
                  images: product.thumbnail ? [product.thumbnail] : [],
                  tags: product.tags || [],
                  features: product.features || [],
                  technical_stack: product.technicalStack || [],
                  seller_name: "",
                  version: product.version || "1.0.0",
                  min_plan_tier: product.minPlanTier || 0,
                  created_at: product.createdAt || new Date().toISOString(),
                };
                return (
                  <ProductCardCompact
                    key={product.id}
                    product={mappedProduct}
                    onSelect={() => setSelectedProduct(product)}
                    onViewDetails={() => setSelectedProduct(product)}
                    accessLevel={product.accessType === "subscription" ? "plan" : "owned"}
                    priority={index < 3}
                  />
                );
              })}
            </AnimatePresence>
          </div>

          {!isLoading && filteredAssets.length === 0 && (
            <div className="h-64 flex flex-col items-center justify-center text-center opacity-60">
              <Cube size={40} className="mb-3 text-white/30" />
              <p
                className={`text-sm font-semibold ${isDark ? "text-zinc-200" : "text-gray-900"}`}
              >
                {t("no_items_found")}
              </p>
              <p className="text-xs font-mono text-white/40 mt-1">
                {t("no_items_desc")}
              </p>
            </div>
          )}

          {isLoading && (
            <div className="flex h-64 items-center justify-center">
              <div className="h-7 w-7 animate-spin rounded-full border-2 border-white/20 border-t-white" />
            </div>
          )}
        </div>
      </div>

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAction={handleAction}
          isProcessing={downloading === selectedProduct.id}
        />
      )}
    </div>
  );
};
