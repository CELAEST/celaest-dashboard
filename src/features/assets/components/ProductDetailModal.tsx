import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { useEscapeKey } from "@/features/shared/hooks/useEscapeKey";

import { Asset } from "../hooks/useAssets";
import { ProductModalHeader } from "./product-modal/ProductModalHeader";
import { ProductInfoSection } from "./product-modal/ProductInfoSection";
import { ProductDetailsSection } from "./product-modal/ProductDetailsSection";
import { ProductActionsSection } from "./product-modal/ProductActionsSection";

interface ProductDetailModalProps {
  product: Asset | null;
  onClose: () => void;
  onAction?: (product: Asset, type: "download" | "cart" | "docs") => void;
  isProcessing?: boolean;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAction,
  isProcessing,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Keyboard accessibility: Esc to close
  useEscapeKey(onClose, !!product);

  if (!product) return null;

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
          {/* Header */}
          <ProductModalHeader
            product={product}
            isDark={isDark}
            onClose={onClose}
          />

          {/* Content */}
          <div className="p-8">
            <ProductInfoSection product={product} isDark={isDark} />
            <ProductDetailsSection product={product} isDark={isDark} />
            <ProductActionsSection
              product={product}
              isDark={isDark}
              onAction={(type) => onAction?.(product, type)}
              isProcessing={isProcessing}
            />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
