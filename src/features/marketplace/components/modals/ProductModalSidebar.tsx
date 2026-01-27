"use client";

import React from "react";
import { ShoppingCart, ExternalLink, Shield } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

interface Product {
  price: string;
  demoUrl?: string;
  author?: string;
  category?: string;
  downloads?: number;
  lastUpdated?: string;
}

interface ProductModalSidebarProps {
  product: Product;
  onPurchase?: () => void;
}

export const ProductModalSidebar: React.FC<ProductModalSidebarProps> = ({
  product,
  onPurchase,
}) => {
  const { theme } = useTheme();

  return (
    <div className="sticky top-24 space-y-4">
      {/* Price Card */}
      <div
        className={`
          p-6 rounded-2xl border
          ${
            theme === "dark"
              ? "bg-linear-to-br from-blue-900/20 to-indigo-900/20 border-blue-500/20"
              : "bg-linear-to-br from-blue-50 to-indigo-50 border-blue-200"
          }
        `}
      >
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
            {product.price}
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
        {product.demoUrl && (
          <button
            className={`
              w-full h-12 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all border
              ${
                theme === "dark"
                  ? "bg-transparent border-white/20 text-white hover:bg-white/5"
                  : "bg-white border-gray-200 text-gray-900 hover:bg-gray-50"
              }
            `}
          >
            <ExternalLink className="size-5" />
            Probar Demo
          </button>
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
              value: product.author || "CELAEST Team",
            },
            { label: "Category", value: product.category || "Excel" },
            {
              label: "Downloads",
              value: (product.downloads || 1543).toLocaleString(),
            },
            {
              label: "Last Update",
              value: product.lastUpdated || "14/1/2025",
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
    </div>
  );
};
