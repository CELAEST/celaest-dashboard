"use client";

import React from "react";
import {
  ShoppingCart,
  Shield,
  CheckCircle,
  DownloadSimple,
  Key,
  Sparkle,
} from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { MarketplaceProduct } from "../../types";
import { formatCurrency } from "@/lib/utils";
import { useMarketplaceCouponStore } from "../../store";
import { useTranslations } from "next-intl";
import { useGeoPricing } from "@/features/billing/providers/GeoPricingProvider";

interface ProductModalSidebarProps {
  product: MarketplaceProduct;
  onPurchase?: () => void;
  isOwned?: boolean;
  accessLevel?: "owned" | "plan" | "none";
  onDownload?: () => void;
  onViewLicense?: () => void;
}

export const ProductModalSidebar: React.FC<ProductModalSidebarProps> = ({
  product,
  onPurchase,
  isOwned = false,
  accessLevel,
  onDownload,
  onViewLicense,
}) => {
  const t = useTranslations("marketplace");
  const { theme } = useTheme();

  // Resolve effective access
  const effectiveAccess = accessLevel ?? (isOwned ? "owned" : "none");
  const hasAccess = effectiveAccess === "owned" || effectiveAccess === "plan";
  const isPlan = effectiveAccess === "plan";

  const { activeCoupon } = useMarketplaceCouponStore();
  const { pricing, formatPrice } = useGeoPricing();

  // Geo-pricing (NO PPP discount for products, only exchange rate)
  const isGeoPriced = !!(pricing && pricing.country_code && pricing.country_code !== "US");
  const localBasePrice = isGeoPriced
    ? product.base_price * (pricing?.exchange_rate ?? 1)
    : product.base_price;

  // Fixed-amount coupons are denominated in USD; scale to local currency.
  const exchangeRate = pricing?.exchange_rate ?? 1;
  let finalPrice = localBasePrice;
  if (activeCoupon) {
    if (activeCoupon.type === "percentage") {
      finalPrice = localBasePrice * (1 - activeCoupon.value / 100);
    } else if (activeCoupon.type === "fixed_amount") {
      const localDiscount = isGeoPriced
        ? activeCoupon.value * exchangeRate
        : activeCoupon.value;
      finalPrice = Math.max(0, localBasePrice - localDiscount);
    }
  }

  const formattedOriginalPrice = isGeoPriced
    ? formatPrice(localBasePrice)
    : formatCurrency(product.base_price, product.currency);
  const formattedFinalPrice = isGeoPriced
    ? formatPrice(finalPrice)
    : formatCurrency(finalPrice, product.currency);

  return (
    <div className="lg:sticky lg:top-6 space-y-4">
      {/* Price Card / Ownership Card */}
      <div
        className={`
          p-6 rounded-2xl border
          ${
            hasAccess
              ? isPlan
                ? theme === "dark"
                  ? "bg-linear-to-br from-violet-900/20 to-purple-900/20 border-violet-500/20"
                  : "bg-linear-to-br from-violet-50 to-purple-50 border-violet-200"
                : theme === "dark"
                  ? "bg-linear-to-br from-emerald-900/20 to-green-900/20 border-emerald-500/20"
                  : "bg-linear-to-br from-emerald-50 to-green-50 border-emerald-200"
              : theme === "dark"
                ? "bg-linear-to-br from-blue-900/20 to-indigo-900/20 border-blue-500/20"
                : "bg-linear-to-br from-blue-50 to-indigo-50 border-blue-200"
          }
        `}
      >
        {hasAccess ? (
          /* Owned / Plan State */
          <>
            <div className="flex items-center gap-2 mb-4">
              {isPlan ? (
                <Sparkle
                  className={`size-6 ${theme === "dark" ? "text-violet-400" : "text-violet-600"}`}
                />
              ) : (
                <CheckCircle
                  className={`size-6 ${theme === "dark" ? "text-emerald-400" : "text-emerald-600"}`}
                />
              )}
              <span
                className={`
                  text-xl font-bold
                  ${
                    isPlan
                      ? theme === "dark"
                        ? "text-violet-400"
                        : "text-violet-700"
                      : theme === "dark"
                        ? "text-emerald-400"
                        : "text-emerald-700"
                  }
                `}
              >
                {isPlan ? t("included_in_plan") : t("acquired")}
              </span>
            </div>
            {!!product.version && (
              <button
                onClick={onDownload}
                className={`
                  w-full h-12 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all mb-3
                  ${
                    isPlan
                      ? theme === "dark"
                        ? "bg-linear-to-r from-violet-400 to-purple-400 text-black hover:shadow-lg hover:scale-[1.02]"
                        : "bg-linear-to-r from-violet-600 to-purple-600 text-white hover:shadow-lg hover:scale-[1.02]"
                      : theme === "dark"
                        ? "bg-linear-to-r from-emerald-400 to-green-400 text-black hover:shadow-lg hover:scale-[1.02]"
                        : "bg-linear-to-r from-emerald-600 to-green-600 text-white hover:shadow-lg hover:scale-[1.02]"
                  }
                `}
              >
                <DownloadSimple className="size-5" />
                {t("download")}
              </button>
            )}
            {!isPlan && effectiveAccess === "owned" && (
              <button
                onClick={() => onViewLicense?.()}
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
                {t("view_license")}
              </button>
            )}
          </>
        ) : (
          /* Not Owned State */
          <>
            <div className="mb-4">
              <div className="flex flex-col gap-1 items-start">
                {activeCoupon && (
                  <span className="text-sm line-through text-gray-400 font-medium">
                    {formattedOriginalPrice}
                  </span>
                )}
                <span
                  className={`
                    text-4xl font-bold bg-linear-to-r bg-clip-text text-transparent
                    ${
                      activeCoupon
                        ? "from-emerald-400 to-green-500"
                        : theme === "dark"
                          ? "from-cyan-400 to-blue-400"
                          : "from-blue-600 to-indigo-600"
                    }
                  `}
                >
                  {formattedFinalPrice}
                </span>
                {activeCoupon && (
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full uppercase tracking-wider mt-1">
                    {t("coupon_applied")}
                  </span>
                )}
              </div>
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
              {t("buy_now")}
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
          {t("product_info")}
        </h4>
        <div className="space-y-3 text-sm">
          {[
            {
              label: t("author"),
              value: product.seller_name || t("anonymous"),
            },
            { label: t("category"), value: product.category_name || t("general") },
            {
              label: t("version"),
              value: product.version
                ? product.version.startsWith("v")
                  ? product.version
                  : `v${product.version}`
                : "N/A",
            },
            {
              label: t("published"),
              value: new Date(product.created_at).toLocaleDateString(),
            },
            {
              label: t("min_plan"),
              value:
                product.min_plan_tier === 0
                  ? t("all_plans")
                  : product.min_plan_tier === 1
                    ? t("basic")
                    : product.min_plan_tier === 2
                      ? t("pro")
                      : product.min_plan_tier === 3
                        ? t("enterprise")
                        : t("private"),
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
              {t("guarantee_title")}
            </h4>
            <p
              className={`text-xs ${
                theme === "dark" ? "text-emerald-400/80" : "text-emerald-700"
              }`}
            >
              {t("guarantee_desc")}
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
            {t("categories_and_tags")}
          </h4>
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag, i) => (
              <span
                key={`${tag}-${i}`}
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
