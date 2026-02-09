import React from "react";
import { Lock, Download, ShoppingCart, ExternalLink } from "lucide-react";
import { Asset } from "../../hooks/useAssets";

interface ProductActionsSectionProps {
  product: Asset;
  isDark: boolean;
  onAction?: (type: "download" | "cart" | "docs") => void;
  isProcessing?: boolean;
}

export const ProductActionsSection: React.FC<ProductActionsSectionProps> = ({
  product,
  isDark,
  onAction,
  isProcessing,
}) => {
  return (
    <>
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
                Download access and private documentation will be available
                after payment confirmation.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        {product.isPurchased ? (
          <>
            {product.external_url ? (
              <a
                href={product.external_url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex-1 py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                  isDark
                    ? "bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/20"
                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                }`}
              >
                <ExternalLink size={18} />
                Open Resource
              </a>
            ) : (
              <button
                onClick={() => onAction?.("download")}
                disabled={isProcessing}
                className={`flex-1 py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                  isDark
                    ? "bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/20 text-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm text-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                }`}
              >
                {isProcessing ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <Download size={18} />
                )}
                {isProcessing ? "Downloading..." : "Download Asset"}
              </button>
            )}
            <button
              onClick={() => onAction?.("docs")}
              className={`px-6 py-4 rounded-xl font-bold text-sm transition-all text-center cursor-pointer ${
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
              onClick={() => onAction?.("cart")}
              className={`flex-1 py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                isDark
                  ? "bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/20 text-center cursor-pointer"
                  : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm text-center cursor-pointer"
              }`}
            >
              <ShoppingCart size={18} />
              Add to Cart - ${product.price}
            </button>
          </>
        )}
      </div>
    </>
  );
};
