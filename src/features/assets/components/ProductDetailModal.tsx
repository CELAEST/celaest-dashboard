"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  FileSpreadsheet,
  Code,
  Globe,
  Download,
  Lock,
  Star,
  Check,
  AlertCircle,
  ShoppingCart,
} from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

interface Product {
  id: string;
  name: string;
  type: "excel" | "script" | "google-sheet";
  category: string;
  price: number;
  rating: number;
  reviews: number;
  downloads: number;
  description: string;
  features: string[];
  requirements: string[];
  thumbnail: string;
  isPurchased: boolean;
}

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  if (!product) return null;

  const getTypeIcon = (type: Product["type"]) => {
    switch (type) {
      case "excel":
        return <FileSpreadsheet size={24} className="text-emerald-500" />;
      case "script":
        return <Code size={24} className="text-blue-500" />;
      case "google-sheet":
        return <Globe size={24} className="text-orange-500" />;
    }
  };

  const getTypeLabel = (type: Product["type"]) => {
    switch (type) {
      case "excel":
        return "Excel Macro";
      case "script":
        return "Script/Code";
      case "google-sheet":
        return "Google Sheet";
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border ${
            isDark ? "bg-gray-900 border-white/10" : "bg-white border-gray-200"
          }`}
        >
          {/* Header with Image */}
          <div className="relative h-64 overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${product.thumbnail})` }}
            />
            <div
              className={`absolute inset-0 bg-linear-to-t ${
                isDark
                  ? "from-gray-900 to-transparent"
                  : "from-white to-transparent"
              }`}
            />

            <button
              onClick={onClose}
              className={`absolute top-6 right-6 p-2 rounded-lg backdrop-blur-md transition-colors ${
                isDark
                  ? "bg-black/60 hover:bg-black/80 text-white border border-white/20"
                  : "bg-white/90 hover:bg-white text-gray-900 border border-gray-200"
              }`}
            >
              <X size={24} />
            </button>

            {/* Type Badge */}
            <div className="absolute top-6 left-6">
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-md ${
                  isDark
                    ? "bg-black/60 border border-white/20"
                    : "bg-white/90 border border-gray-200"
                }`}
              >
                {getTypeIcon(product.type)}
                <span
                  className={`text-sm font-semibold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {getTypeLabel(product.type)}
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Title & Category */}
            <div className="mb-6">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h2
                    className={`text-3xl font-bold mb-2 ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {product.name}
                  </h2>
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {product.category}
                  </p>
                </div>
                <div className="text-right">
                  <div
                    className={`text-4xl font-bold mb-1 ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    ${product.price}
                  </div>
                  {product.isPurchased && (
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
                        isDark
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      <Check size={12} />
                      PURCHASED
                    </span>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Star size={16} className="text-yellow-500 fill-yellow-500" />
                  <span
                    className={`text-sm font-bold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {product.rating}
                  </span>
                  <span
                    className={`text-sm ${
                      isDark ? "text-gray-500" : "text-gray-600"
                    }`}
                  >
                    ({product.reviews} reviews)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Download
                    size={16}
                    className={isDark ? "text-gray-500" : "text-gray-400"}
                  />
                  <span
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {product.downloads.toLocaleString()} downloads
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3
                className={`text-lg font-bold mb-3 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Description
              </h3>
              <p
                className={`text-sm leading-relaxed ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {product.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Features */}
              <div>
                <h3
                  className={`text-lg font-bold mb-4 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Key Features
                </h3>
                <ul className="space-y-3">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div
                        className={`mt-0.5 p-1 rounded ${
                          isDark ? "bg-cyan-500/10" : "bg-blue-50"
                        }`}
                      >
                        <Check
                          size={14}
                          className={isDark ? "text-cyan-400" : "text-blue-600"}
                        />
                      </div>
                      <span
                        className={`text-sm ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Requirements */}
              <div>
                <h3
                  className={`text-lg font-bold mb-4 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Requirements
                </h3>
                <ul className="space-y-3">
                  {product.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <AlertCircle
                        size={16}
                        className={`mt-0.5 shrink-0 ${
                          isDark ? "text-gray-500" : "text-gray-400"
                        }`}
                      />
                      <span
                        className={`text-sm ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {requirement}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Access Notice (if not purchased) */}
            {!product.isPurchased && (
              <div
                className={`p-5 rounded-xl border mb-6 ${
                  isDark
                    ? "bg-orange-500/5 border-orange-500/20"
                    : "bg-orange-50 border-orange-200"
                }`}
              >
                <div className="flex gap-3">
                  <Lock
                    size={20}
                    className={`shrink-0 ${
                      isDark ? "text-orange-400" : "text-orange-600"
                    }`}
                  />
                  <div>
                    <p
                      className={`text-sm font-semibold mb-1 ${
                        isDark ? "text-orange-400" : "text-orange-700"
                      }`}
                    >
                      Purchase Required
                    </p>
                    <p
                      className={`text-xs ${
                        isDark ? "text-orange-400/80" : "text-orange-600/80"
                      }`}
                    >
                      Download access and private documentation will be
                      available after payment confirmation.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              {product.isPurchased ? (
                <>
                  <button
                    className={`flex-1 py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                      isDark
                        ? "bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/20"
                        : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                    }`}
                  >
                    <Download size={18} />
                    Download Asset
                  </button>
                  <button
                    className={`px-6 py-4 rounded-xl font-bold text-sm transition-all ${
                      isDark
                        ? "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                    }`}
                  >
                    Documentation
                  </button>
                </>
              ) : (
                <>
                  <button
                    className={`flex-1 py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                      isDark
                        ? "bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/20"
                        : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                    }`}
                  >
                    <ShoppingCart size={18} />
                    Add to Cart - ${product.price}
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
