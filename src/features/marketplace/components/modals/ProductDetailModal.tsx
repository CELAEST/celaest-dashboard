"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Star, Download, Calendar } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { ProductModalTabs } from "./ProductModalTabs";
import { ProductModalSidebar } from "./ProductModalSidebar";

interface Product {
  id: number;
  title: string;
  description: string;
  price: string;
  image: string;
  features: string[];
  badge?: string;
  rating?: number;
  reviews?: number;
  category?: string;
  author?: string;
  downloads?: number;
  lastUpdated?: string;
  stack?: string[];
  tags?: string[];
  videoUrl?: string;
  demoUrl?: string;
}

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onPurchase?: () => void;
  relatedProducts?: Product[];
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onPurchase,
}) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = React.useState("overview");

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
              <div className="flex items-center gap-3 mb-2">
                <span
                  className={`
                  px-3 py-1 rounded-lg text-xs font-medium border
                  ${
                    theme === "dark"
                      ? "bg-white/5 border-white/10 text-gray-300"
                      : "bg-gray-100 border-gray-200 text-gray-700"
                  }
                `}
                >
                  {product.category || "Excel"}
                </span>
                {product.badge && (
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
                    {product.badge}
                  </span>
                )}
              </div>
              <h2
                className={`text-2xl font-bold mb-2 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {product.title}
              </h2>
              <div
                className={`flex items-center gap-4 text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                <div className="flex items-center gap-1">
                  <Star className="size-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{product.rating || 4.8}</span>
                  <span>({product.reviews || 127} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Download className="size-4" />
                  <span>
                    {(product.downloads || 1543).toLocaleString()} downloads
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="size-4" />
                  <span>Updated {product.lastUpdated || "14/1/2025"}</span>
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
              {/* Video/Demo */}
              {product.videoUrl && (
                <div className="aspect-video rounded-2xl overflow-hidden bg-gray-900">
                  <iframe
                    src={product.videoUrl}
                    className="w-full h-full"
                    allowFullScreen
                    title={product.title}
                  />
                </div>
              )}

              <ProductModalTabs
                product={product}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <ProductModalSidebar product={product} onPurchase={onPurchase} />
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
