"use client";

import React, { useState, useMemo } from "react";
import { AnimatePresence } from "motion/react";
import { MagnifyingGlass, Cube } from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { toast } from "sonner";
import { logger } from "@/lib/logger";
import { ProductDetailModal } from "./ProductDetailModal";
import { Asset } from "../services/assets.service";
import { MarketplaceCard } from "./MarketplaceCard";
import { useAssets } from "../hooks/useAssets";
import { useCategories } from "../hooks/useCategories";

interface AssetCustomerCatalogProps {
  assets: Asset[];
}

export const AssetCustomerCatalog: React.FC<
  AssetCustomerCatalogProps
> = ({}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [selectedProduct, setSelectedProduct] = useState<Asset | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { assets, isLoading, refresh, downloadAsset } = useAssets();
  const { categories, isLoading: isLoadingCategories } = useCategories(true);
  const [downloading, setDownloading] = useState<string | null>(null);

  // Use real assets (purchased items)
  const displayAssets = useMemo(() => {
    return assets;
  }, [assets]);

  // Refresh on mount ONLY (sin dependencias para evitar loop infinito)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => {
    refresh();
  }, []);

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
        // En el catálogo de clientes, los items tienen categoryName o categoryId
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
        toast.success("DownloadSimple started");
      } catch (error: unknown) {
        logger.error("DownloadSimple failed", error);
        toast.error("DownloadSimple failed");
      } finally {
        setDownloading(null);
      }
    } else if (type === "docs") {
      // Placeholder for docs
      toast.info("Documentation coming soon");
    }
  };

  return (
    <div className="h-full flex flex-col min-h-0 relative">
      {/* MagnifyingGlass & Funnel Header */}
      <div className="shrink-0 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* MagnifyingGlass Bar */}
        <div className={`relative group w-full md:w-96`}>
          <div
            className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${isDark ? "text-gray-500 group-focus-within:text-cyan-400" : "text-gray-400 group-focus-within:text-blue-500"} transition-colors`}
          >
            <MagnifyingGlass size={18} />
          </div>
          <input
            type="text"
            placeholder="MagnifyingGlass assets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none transition-all ${
              isDark
                ? "bg-black/20 border-white/10 focus:border-cyan-500/50 focus:bg-white/5 text-white placeholder-gray-600"
                : "bg-white border-gray-200 focus:border-blue-500 ring-4 ring-transparent focus:ring-blue-500/10 text-gray-900"
            }`}
          />
        </div>

        {/* Funnel Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          <button
            key="all"
            onClick={() => setFilter("all")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border ${
              filter === "all"
                ? isDark
                  ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                  : "bg-blue-600 text-white border-blue-600 shadow-md"
                : isDark
                  ? "bg-white/5 text-gray-400 border-white/5 hover:bg-white/10 hover:text-white"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            All Assets
          </button>

          {isLoadingCategories ? (
            <div className="px-4 py-2">
              <div className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            categories.map((cat) => {
              const isActive = filter === cat.name;
              return (
                <button
                  key={cat.id}
                  onClick={() => setFilter(cat.name)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border ${
                    isActive
                      ? isDark
                        ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                        : "bg-blue-600 text-white border-blue-600 shadow-md"
                      : isDark
                        ? "bg-white/5 text-gray-400 border-white/5 hover:bg-white/10 hover:text-white"
                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {cat.name}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Grid Content */}
      <div className="flex-1 min-h-0 relative">
        <div className="absolute inset-0 overflow-y-auto pr-2 pb-20 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredAssets.map((product, index) => (
                <MarketplaceCard
                  key={product.id}
                  product={product}
                  isDark={isDark}
                  index={index}
                  onViewDetails={(p) => setSelectedProduct(p)}
                />
              ))}
            </AnimatePresence>
          </div>

          {!isLoading && filteredAssets.length === 0 && (
            <div className="h-64 flex flex-col items-center justify-center text-center opacity-50">
              <Cube size={48} className="mb-4 text-gray-500" />
              <p
                className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-900"}`}
              >
                No items found
              </p>
              <p className="text-sm text-gray-500">
                You haven&apos;t purchased any assets yet, or they don&apos;t
                match your search.
              </p>
            </div>
          )}

          {isLoading && (
            <div className="flex h-64 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-current border-t-transparent text-cyan-500" />
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
