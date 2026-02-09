"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Star, Calendar } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { useEscapeKey } from "@/features/shared/hooks/useEscapeKey";
import { ProductModalTabs } from "./ProductModalTabs";
import { ProductModalSidebar } from "./ProductModalSidebar";
import { MarketplaceProduct } from "../../types";
import { useProductDetail } from "../../hooks/useProductDetail";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";

interface ProductDetailModalProps {
  initialProduct: MarketplaceProduct;
  onClose: () => void;
  onPurchase?: () => void;
  isOwned?: boolean;
  onDownload?: () => void;
  onViewLicense?: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  initialProduct,
  onClose,
  onPurchase,
  isOwned = false,
  onDownload,
  onViewLicense,
}) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = React.useState("overview");

  // Fetch full details (reviews, etc.)
  const {
    product: fullProduct,
    reviews,
    loading,
  } = useProductDetail(initialProduct.slug);

  // Use full details if available, otherwise initial
  const product = fullProduct || initialProduct;

  // Keyboard accessibility: Esc to close
  useEscapeKey(onClose, !!product);

  if (!product) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className={`
            relative w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-3xl border shadow-2xl
            ${
              theme === "dark"
                ? "bg-black/90 backdrop-blur-xl border-white/10"
                : "bg-white border-gray-200"
            }
          `}
        >
          {/* Header */}
          <div
            className={`
            sticky top-0 z-10 p-6 flex items-start justify-between border-b
            ${
              theme === "dark"
                ? "bg-black/90 backdrop-blur-xl border-white/10"
                : "bg-white border-gray-200"
            }
          `}
          >
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span
                  className={`
                  px-3 py-1 rounded-lg text-xs font-bold border
                  ${
                    theme === "dark"
                      ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                      : "bg-blue-50 border-blue-200 text-blue-700"
                  }
                `}
                >
                  {product.category_name || "General"}
                </span>

                {/* Secondary Tags in Header */}
                {(product.tags || []).slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className={`
                      px-2 py-0.5 rounded-md text-[10px] font-medium border uppercase tracking-wider
                      ${
                        theme === "dark"
                          ? "bg-white/5 border-white/10 text-gray-400"
                          : "bg-gray-50 border-gray-200 text-gray-500"
                      }
                    `}
                  >
                    {tag}
                  </span>
                ))}

                {product.rating_avg >= 4.5 && (
                  <span
                    className={`
                    px-3 py-1 rounded-lg text-xs font-bold border-0
                    ${
                      theme === "dark"
                        ? "bg-linear-to-r from-cyan-400 to-blue-400 text-black"
                        : "bg-linear-to-r from-blue-600 to-indigo-600 text-white"
                    }
                  `}
                  >
                    POPULAR
                  </span>
                )}
              </div>
              <h2
                className={`text-2xl font-bold mb-2 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {product.name}
              </h2>
              <div
                className={`flex items-center gap-4 text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                <div className="flex items-center gap-1">
                  <Star className="size-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">
                    {product.rating_avg > 0
                      ? product.rating_avg.toFixed(1)
                      : "N/A"}
                  </span>
                  <span>({product.rating_count} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="size-4" />
                  <span>
                    Published{" "}
                    {new Date(product.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`
                p-2 rounded-xl transition-colors
                ${
                  theme === "dark"
                    ? "hover:bg-white/10 text-gray-400"
                    : "hover:bg-gray-100 text-gray-600"
                }
              `}
            >
              <X className="size-6" />
            </button>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 p-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Product Image */}
              <div
                className={`relative aspect-video rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-900 ${loading ? "animate-pulse" : ""}`}
              >
                <ImageWithFallback
                  src={product.thumbnail_url || ""}
                  alt={product.name}
                  fill
                  className={`object-cover transition-opacity duration-300 ${loading ? "opacity-50" : "opacity-100"}`}
                />
              </div>

              <ProductModalTabs
                product={product}
                reviews={reviews}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <ProductModalSidebar
                product={product}
                onPurchase={onPurchase}
                isOwned={isOwned}
                onDownload={onDownload}
                onViewLicense={onViewLicense}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
