"use client";

import React from "react";
import {
  ShoppingCart,
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

  const getPlanTextColor = (tier?: number) => {
    switch (tier) {
      case 1:
        return "text-sky-400";
      case 2:
        return "text-violet-400";
      case 3:
        return "text-amber-400";
      default:
        return theme === "dark" ? "text-[#A1A1AA]" : "text-gray-500";
    }
  };

  const getPlanLabel = (tier?: number) => {
    switch (tier) {
      case 1:
        return t("tier_basic");
      case 2:
        return "Plan Pro";
      case 3:
        return t("tier_enterprise");
      default:
        return t("all_plans");
    }
  };

  const planColorClass = getPlanTextColor(product.min_plan_tier);
  const planLabel = getPlanLabel(product.min_plan_tier);

  return (
    <div className="lg:sticky lg:top-6 space-y-4">
      {/* Price Card / Ownership Card */}
      <div
        className={`
          p-5 sm:p-6 rounded-2xl border relative overflow-hidden shadow-xl flex flex-col gap-4
          ${
            theme === "dark"
              ? "bg-[#0D0D11] border-white/[0.08]"
              : "bg-white border-gray-200"
          }
        `}
      >
        {/* Subtle accent highlight in dark mode */}
        {theme === "dark" && (
          <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
        )}

        {hasAccess ? (
          /* Owned / Plan State */
          <>
            {isPlan ? (
              <div className="flex items-center gap-2 text-violet-400">
                <Sparkle weight="fill" className="size-5 shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider font-mono">
                  {t("included_in_plan")}
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle weight="fill" className="size-5 shrink-0" />
                  <span className="text-xs font-bold uppercase tracking-wider font-mono">
                    {t("acquired")}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-white/50 tracking-wider uppercase">
                  Licencia Activa
                </span>
              </div>
            )}

            {isPlan && (
              <p className={`text-xs leading-relaxed font-sans ${theme === "dark" ? "text-white/60" : "text-gray-600"}`}>
                Este módulo está habilitado sin costo adicional en tu suscripción corporativa activa.
              </p>
            )}

            <div className="flex flex-col gap-2 pt-1">
              {!!product.version && (
                <button
                  type="button"
                  onClick={onDownload}
                  className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 active:scale-[0.99] transition-all cursor-pointer shadow-md bg-white hover:bg-neutral-200 text-black"
                >
                  <DownloadSimple weight="bold" className="size-4" />
                  <span>
                    {t("download")}{" "}
                    {product.version.startsWith("v")
                      ? product.version
                      : `v${product.version}`}
                  </span>
                </button>
              )}

              {!isPlan && effectiveAccess === "owned" && (
                <button
                  type="button"
                  onClick={() => onViewLicense?.()}
                  className={`
                    w-full py-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer
                    ${
                      theme === "dark"
                        ? "bg-[#141418] hover:bg-[#1C1C22] text-white/80 border border-white/[0.08]"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200"
                    }
                  `}
                >
                  <Key className="size-3.5" />
                  <span>{t("view_license")}</span>
                </button>
              )}
            </div>
          </>
        ) : (
          /* Not Owned State */
          <>
            {/* ── AQUÍ Y ÚNICAMENTE AQUÍ SE MUESTRA PLAN PRO (1 SOLA VEZ EN TODO EL MODAL, SOLO COLOR DE TEXTO) ── */}
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-mono uppercase tracking-[0.18em] ${theme === "dark" ? "text-white/40" : "text-gray-500"}`}>
                Licencia Comercial
              </span>
              <span className={`text-[10px] font-mono tracking-wider uppercase font-semibold ${planColorClass}`}>
                {planLabel}
              </span>
            </div>

            <div className="flex flex-col">
              {activeCoupon && (
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`text-xs line-through font-mono ${theme === "dark" ? "text-white/30" : "text-gray-400"}`}>
                    {formattedOriginalPrice}
                  </span>
                  {/* Floating text - Sin Cajas, Sin Bordes */}
                  <span className="text-[10px] font-mono tracking-wider uppercase font-semibold text-emerald-400">
                    {t("coupon_applied")} {activeCoupon.type === "percentage" ? `(-${activeCoupon.value}%)` : ""}
                  </span>
                </div>
              )}

              <div className="flex items-baseline gap-1.5">
                <span className={`text-3xl sm:text-4xl font-extrabold tracking-tight font-sans ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  {formattedFinalPrice}
                </span>
                <span className={`text-xs ${theme === "dark" ? "text-white/40" : "text-gray-500"}`}>
                  {product.currency}
                </span>
              </div>
            </div>

            {/* Primary Action Button (Platino Monocromático Puro) */}
            <button
              type="button"
              onClick={onPurchase}
              className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 active:scale-[0.99] transition-all cursor-pointer shadow-md bg-white hover:bg-neutral-200 text-black"
            >
              <ShoppingCart weight="bold" className="size-4" />
              <span>{t("buy_now")}</span>
            </button>
          </>
        )}
      </div>

      {/* Info Card (Sin Repetir Plan Pro - Reemplazado por Licenciamiento Comercial) */}
      <div
        className={`
          p-4 sm:p-5 rounded-2xl border flex flex-col gap-3
          ${
            theme === "dark"
              ? "bg-[#0D0D11] border-white/[0.06]"
              : "bg-white border-gray-200"
          }
        `}
      >
        <span
          className={`text-[10px] font-mono uppercase tracking-[0.18em] font-semibold ${
            theme === "dark" ? "text-white/40" : "text-gray-500"
          }`}
        >
          {t("product_info")}
        </span>
        <div className="space-y-2.5 text-xs">
          {[
            {
              label: t("author"),
              value: product.seller_name || t("anonymous"),
              isMono: false,
            },
            {
              label: t("category"),
              value: product.category_name || t("general"),
              isMono: false,
            },
            {
              label: t("version"),
              value: product.version
                ? product.version.startsWith("v")
                  ? product.version
                  : `v${product.version}`
                : "N/A",
              isMono: true,
            },
            {
              label: t("published"),
              value: new Date(product.created_at).toLocaleDateString(),
              isMono: true,
            },
            {
              label: "Licenciamiento",
              value: "Comercial Perpetua",
              isMono: true,
            },
          ].map((item) => (
            <div key={item.label} className="flex justify-between items-center">
              <span
                className={theme === "dark" ? "text-white/50" : "text-gray-500"}
              >
                {item.label}
              </span>
              <span
                className={`font-medium ${
                  item.isMono ? "font-mono" : ""
                } ${theme === "dark" ? "text-white" : "text-gray-900"}`}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Micro-Footer Notice */}
      <div className={`text-[10px] text-center font-mono ${theme === "dark" ? "text-white/30" : "text-gray-400"}`}>
        Entrega digital inmediata • Soporte directo del autor
      </div>
    </div>
  );
};
