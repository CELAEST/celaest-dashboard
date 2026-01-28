"use client";

import React from "react";
import { motion } from "motion/react";
import { Star, Download, ChevronRight, Lock } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { AssetTypeIcon } from "./shared/AssetTypeIcon";
import { getAssetTypeLabel } from "../utils/assetUtils";
import { Asset } from "../hooks/useAssets";

interface MarketplaceCardProps {
  product: Asset; // Expecting Asset or MockAsset
  isDark: boolean;
  onViewDetails: (product: Asset) => void;
  index: number;
}

export const MarketplaceCard: React.FC<MarketplaceCardProps> = ({
  product,
  isDark,
  onViewDetails,
  index,
}) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.05 }}
      className={`group rounded-2xl border overflow-hidden transition-all hover:shadow-xl flex flex-col h-full ${
        isDark
          ? "bg-linear-to-br from-[#0a0a0a]/80 to-gray-900/50 border-white/10 hover:border-cyan-500/30"
          : "bg-white border-gray-200 hover:border-blue-300 shadow-sm"
      }`}
    >
      {/* Thumbnail */}
      <div className="relative h-48 overflow-hidden shrink-0">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
          style={{
            backgroundImage: `url(${product.thumbnail || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070"})`,
            maskImage:
              "linear-gradient(to bottom, black 50%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 50%, transparent 100%)",
          }}
        />
        <div
          className={`absolute inset-0 bg-linear-to-t ${
            isDark
              ? "from-gray-900 via-gray-900/60 to-transparent"
              : "from-black/60 to-transparent"
          }`}
        />

        {/* Type Badge */}
        <div className="absolute top-4 left-4">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg backdrop-blur-md ${
              isDark
                ? "bg-black/60 border border-white/20"
                : "bg-white/90 border border-gray-200"
            }`}
          >
            <AssetTypeIcon type={product.type} size={20} />
            <span
              className={`text-xs font-semibold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {getAssetTypeLabel(product.type)}
            </span>
          </div>
        </div>

        {/* Purchased Badge */}
        {product.isPurchased && (
          <div className="absolute top-4 right-4">
            <div
              className={`px-3 py-1.5 rounded-lg backdrop-blur-md ${
                isDark
                  ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-400"
                  : "bg-emerald-500/90 border border-emerald-600 text-white"
              }`}
            >
              <span className="text-xs font-bold">OWNED</span>
            </div>
          </div>
        )}

        {/* Price */}
        <div className="absolute bottom-4 left-4">
          <div
            className={`text-3xl font-bold ${
              isDark ? "text-white" : "text-white"
            }`}
          >
            ${product.price}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <div className="mb-3">
          <h3
            className={`text-lg font-bold mb-1 line-clamp-1 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {product.name}
          </h3>
          <p
            className={`text-xs ${isDark ? "text-gray-500" : "text-gray-600"}`}
          >
            {product.category}
          </p>
        </div>

        <p
          className={`text-sm mb-4 line-clamp-2 ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {product.description}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-4 pb-4 border-b border-white/5 mt-auto">
          <div className="flex items-center gap-1">
            <Star size={14} className="text-yellow-500 fill-yellow-500" />
            <span
              className={`text-sm font-semibold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {product.rating || "4.5"}
            </span>
            <span
              className={`text-xs ${
                isDark ? "text-gray-500" : "text-gray-600"
              }`}
            >
              ({product.reviews || 0})
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Download
              size={14}
              className={isDark ? "text-gray-500" : "text-gray-400"}
            />
            <span
              className={`text-sm ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {product.downloads || 0}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => onViewDetails(product)}
          className={`w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
            product.isPurchased
              ? isDark
                ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20"
                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
              : isDark
                ? "bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/20"
                : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
          }`}
        >
          {product.isPurchased ? (
            <>
              View Details
              <ChevronRight size={16} />
            </>
          ) : (
            <>
              View Details
              <Lock size={14} />
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};
