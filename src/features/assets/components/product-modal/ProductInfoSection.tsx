import React from "react";
import { Check, Star, Download } from "lucide-react";
import { Asset } from "../../hooks/useAssets";

interface ProductInfoSectionProps {
  product: Asset;
  isDark: boolean;
}

export const ProductInfoSection: React.FC<ProductInfoSectionProps> = ({
  product,
  isDark,
}) => {
  return (
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
            className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
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
            className={`text-sm ${isDark ? "text-gray-500" : "text-gray-600"}`}
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
            className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            {product.downloads.toLocaleString()} downloads
          </span>
        </div>
      </div>
    </div>
  );
};
