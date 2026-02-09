"use client";

import React from "react";
import { ShoppingCart, Shield, CheckCircle, Download, Key } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { MarketplaceProduct } from "../../types";
import { formatCurrency } from "@/lib/utils";

interface ProductModalSidebarProps {
  product: MarketplaceProduct;
  onPurchase?: () => void;
  isOwned?: boolean;
  onDownload?: () => void;
  onViewLicense?: () => void;
}

export const ProductModalSidebar: React.FC<ProductModalSidebarProps> = ({
  product,
  onPurchase,
  isOwned = false,
  onDownload,
  onViewLicense,
}) => {
  const { theme } = useTheme();

  const formattedPrice = formatCurrency(product.base_price, product.currency);

  return (
    <div className="sticky top-24 space-y-4">
      {/* Price Card / Ownership Card */}
      <div
        className={`
          p-6 rounded-2xl border
          ${
            isOwned
              ? theme === "dark"
                ? "bg-linear-to-br from-emerald-900/20 to-green-900/20 border-emerald-500/20"
                : "bg-linear-to-br from-emerald-50 to-green-50 border-emerald-200"
              : theme === "dark"
                ? "bg-linear-to-br from-blue-900/20 to-indigo-900/20 border-blue-500/20"
                : "bg-linear-to-br from-blue-50 to-indigo-50 border-blue-200"
          }
        `}
      >
        {isOwned ? (
          /* Owned State */
          <>
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle
                className={`size-6 ${theme === "dark" ? "text-emerald-400" : "text-emerald-600"}`}
              />
              <span
                className={`
                  text-xl font-bold
                  ${theme === "dark" ? "text-emerald-400" : "text-emerald-700"}
                `}
              >
                ADQUIRIDO
              </span>
            </div>
            <button
              onClick={onDownload}
              className={`
                w-full h-12 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all mb-3
                ${
                  theme === "dark"
                    ? "bg-linear-to-r from-emerald-400 to-green-400 text-black hover:shadow-lg hover:scale-[1.02]"
                    : "bg-linear-to-r from-emerald-600 to-green-600 text-white hover:shadow-lg hover:scale-[1.02]"
                }
              `}
            >
              <Download className="size-5" />
              Descargar
            </button>
            {onViewLicense && (
              <button
                onClick={onViewLicense}
                className={`
                  w-full h-10 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all
                  ${
                    theme === "dark"
                      ? "bg-white/10 border border-white/20 text-white hover:bg-white/20"
                      : "bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gray-200"
                  }
                `}
              >
                <Key className="size-4" />
                Ver Licencia
              </button>
            )}
          </>
        ) : (
          /* Not Owned State */
          <>
            <div className="mb-4">
              <span
                className={`
                  text-4xl font-bold bg-linear-to-r bg-clip-text text-transparent
                  ${
                    theme === "dark"
                      ? "from-cyan-400 to-blue-400"
                      : "from-blue-600 to-indigo-600"
                  }
                `}
              >
                {formattedPrice}
              </span>
            </div>
            <button
              onClick={onPurchase}
              className={`
                w-full h-12 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all mb-3
                ${
                  theme === "dark"
                    ? "bg-linear-to-r from-cyan-400 to-blue-400 text-black hover:shadow-lg hover:scale-[1.02]"
                    : "bg-linear-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:scale-[1.02]"
                }
              `}
            >
              <ShoppingCart className="size-5" />
              Comprar Ahora
            </button>
          </>
        )}
      </div>

      {/* Info Card */}
      <div
        className={`
          p-6 rounded-2xl border
          ${theme === "dark" ? "bg-white/5 border-white/10" : "bg-white border-gray-200"}
        `}
      >
        <h4
          className={`font-semibold mb-4 ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          Product Info
        </h4>
        <div className="space-y-3 text-sm">
          {[
            {
              label: "Author",
              value: product.seller_name || "Unknown Seller",
            },
            { label: "Category", value: product.category_name || "General" },
            {
              label: "Published",
              value: new Date(product.created_at).toLocaleDateString(),
            },
          ].map((item) => (
            <div key={item.label} className="flex justify-between">
              <span
                className={theme === "dark" ? "text-gray-400" : "text-gray-600"}
              >
                {item.label}
              </span>
              <span
                className={`font-medium ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Guarantee Badge */}
      <div
        className={`
          p-4 rounded-2xl border
          ${
            theme === "dark"
              ? "bg-emerald-500/10 border-emerald-500/20"
              : "bg-emerald-50 border-emerald-200"
          }
        `}
      >
        <div className="flex items-start gap-3">
          <Shield
            className={`size-6 shrink-0 ${
              theme === "dark" ? "text-emerald-400" : "text-emerald-600"
            }`}
          />
          <div>
            <h4
              className={`font-semibold text-sm mb-1 ${
                theme === "dark" ? "text-emerald-400" : "text-emerald-900"
              }`}
            >
              Garantía de 30 Días
            </h4>
            <p
              className={`text-xs ${
                theme === "dark" ? "text-emerald-400/80" : "text-emerald-700"
              }`}
            >
              Pruébalo sin riesgo. Reembolso completo si no estás satisfecho.
            </p>
          </div>
        </div>
      </div>

      {/* Tags Section */}
      {product.tags && product.tags.length > 0 && (
        <div
          className={`
            p-6 rounded-2xl border
            ${theme === "dark" ? "bg-white/5 border-white/10" : "bg-white border-gray-200"}
          `}
        >
          <h4
            className={`font-semibold mb-4 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Categorías y Tags
          </h4>
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className={`
                  px-2.5 py-1 rounded-lg text-xs font-bold border transform transition-all hover:scale-105 cursor-default
                  ${
                    theme === "dark"
                      ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
                      : "bg-cyan-50 border-cyan-200 text-cyan-700"
                  }
                `}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
