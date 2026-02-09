"use client";

import React, { useState, useMemo } from "react";
import { AnimatePresence } from "motion/react";
import { Search, Code, Box, Music, Zap } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { toast } from "sonner";
import { ProductDetailModal } from "./ProductDetailModal";
import { Asset } from "../services/assets.service";
import { MarketplaceCard } from "./MarketplaceCard";
import { useAssets } from "../hooks/useAssets";

interface AssetCustomerCatalogProps {
  assets: Asset[];
}

export const AssetCustomerCatalog: React.FC<
  AssetCustomerCatalogProps
> = ({}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [selectedProduct, setSelectedProduct] = useState<Asset | null>(null);
  const [filter, setFilter] = useState<
    "all" | "3d" | "script" | "audio" | "template"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { assets, isLoading, refresh, downloadAsset } = useAssets();
  const [downloading, setDownloading] = useState<string | null>(null);

  // Use real assets (purchased items)
  const displayAssets = useMemo(() => {
    return assets;
  }, [assets]);

  // Refresh on mount to ensure fresh data
  React.useEffect(() => {
    refresh();
  }, [refresh]);

  const filteredAssets = useMemo(() => {
    return displayAssets.filter((item) => {
      // Map filter keys to AssetTypes
      // Filter keys: "all" | "3d" | "script" | "audio" | "template"
      // AssetTypes: "excel" | "script" | "google-sheet" | "software" | "plugin" | "theme" | "template" | "asset" | "service"

      let matchesFilter = filter === "all";

      if (!matchesFilter) {
        if (filter === "3d") {
          matchesFilter =
            item.type === "asset" || item.display_type === "3d-model"; // Assuming 'asset' or specific display_type
        } else if (filter === "script") {
          matchesFilter = item.type === "script" || item.type === "plugin";
        } else if (filter === "audio") {
          // We don't have an explicit audio type in AssetType yet, might be under 'asset'
          matchesFilter =
            item.type === "asset" && item.display_type === "audio";
        } else if (filter === "template") {
          matchesFilter =
            item.type === "template" ||
            item.type === "theme" ||
            item.type === "excel" ||
            item.type === "google-sheet";
        }
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
        toast.success("Download started");
      } catch (error) {
        console.error("Download failed", error);
        toast.error("Download failed");
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
      {/* Search & Filter Header */}
      <div className="shrink-0 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className={`relative group w-full md:w-96`}>
          <div
            className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${isDark ? "text-gray-500 group-focus-within:text-cyan-400" : "text-gray-400 group-focus-within:text-blue-500"} transition-colors`}
          >
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search marketplace..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none transition-all ${
              isDark
                ? "bg-black/20 border-white/10 focus:border-cyan-500/50 focus:bg-white/5 text-white placeholder-gray-600"
                : "bg-white border-gray-200 focus:border-blue-500 ring-4 ring-transparent focus:ring-blue-500/10 text-gray-900"
            }`}
          />
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {[
            { id: "all", label: "All Assets" },
            { id: "script", label: "Software & Agents", icon: Code }, // Was Scripts
            { id: "template", label: "Templates & Prompts", icon: Zap }, // Was Templates
            { id: "3d", label: "3D & Visuals", icon: Box }, // Was 3D Models
            { id: "audio", label: "Audio & Voice", icon: Music }, // Was Audio
          ].map((chip) => {
            const Icon = chip.icon;
            const isActive = filter === chip.id;
            return (
              <button
                key={chip.id}
                onClick={() =>
                  setFilter(
                    chip.id as "all" | "3d" | "script" | "audio" | "template",
                  )
                }
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
                {Icon && <Icon size={14} />}
                {chip.label}
              </button>
            );
          })}
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
              <Box size={48} className="mb-4 text-gray-500" />
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
