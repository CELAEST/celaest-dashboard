import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useEscapeKey } from "@/features/shared/hooks/useEscapeKey";
import {
  X,
  Star,
  DownloadSimple,
  ShoppingCart,
  ArrowSquareOut,
  Check,
  Warning,
  Calendar,
  ShieldCheck,
  Lock,
  CircleNotch,
} from "@phosphor-icons/react";
import { Asset } from "../services/assets.service";
import { AssetTypeIcon } from "./shared/AssetTypeIcon";
import { getAssetTypeLabel } from "../utils/assetUtils";
import { useLocalProductPrice } from "@/features/billing/hooks/useLocalProductPrice";
import { useTranslations } from "next-intl";

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
  const { format: formatLocalPrice } = useLocalProductPrice();
  const t = useTranslations("assets");

  useEscapeKey(onClose, !!product);

  if (!product) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-md"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 16 }}
          transition={{ type: "spring", duration: 0.35, bounce: 0.1 }}
          className={`relative w-full max-w-4xl max-h-[90vh] rounded-3xl border shadow-[0_32px_96px_-12px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col ${
            isDark
              ? "bg-[#09090b] border-white/[0.08]"
              : "bg-white border-zinc-200"
          }`}
        >
          {/* Tokyo Corner Accents (Dark Mode) */}
          {isDark && (
            <>
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white/20 rounded-tl-sm pointer-events-none z-30" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-white/20 rounded-tr-sm pointer-events-none z-30" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-white/20 rounded-bl-sm pointer-events-none z-30" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white/20 rounded-br-sm pointer-events-none z-30" />
            </>
          )}

          {/* Header */}
          <div
            className={`relative px-6 sm:px-8 py-5 flex justify-between items-center shrink-0 border-b ${
              isDark
                ? "bg-[#0D0D11] border-white/[0.06]"
                : "bg-zinc-50 border-zinc-200"
            }`}
          >
            {/* Left: icon badge + title + pills */}
            <div className="relative z-10 flex gap-4 items-center min-w-0">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border shadow-xs ${
                  isDark
                    ? "bg-white/[0.04] text-zinc-100 border-white/10"
                    : "bg-white text-zinc-900 border-zinc-200"
                }`}
              >
                <AssetTypeIcon type={product.type} size={20} />
              </div>
              <div className="min-w-0">
                <h2
                  className={`text-xl sm:text-2xl font-bold tracking-tight truncate ${
                    isDark ? "text-white" : "text-zinc-900"
                  }`}
                >
                  {product.name}
                </h2>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span
                    className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                      isDark
                        ? "bg-white/[0.05] border-white/10 text-white/70"
                        : "bg-zinc-100 border-zinc-200 text-zinc-700"
                    }`}
                  >
                    {getAssetTypeLabel(product.type)}
                  </span>
                  <span
                    className={`font-mono text-[10px] tracking-wider px-2 py-0.5 rounded-md border ${
                      isDark
                        ? "bg-white/[0.03] border-white/8 text-white/50"
                        : "bg-zinc-100 border-zinc-200 text-zinc-500"
                    }`}
                  >
                    v{product.version}
                  </span>
                  {product.isPurchased && (
                    <span
                      className={`inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-md border ${
                        product.accessType === "subscription"
                          ? isDark
                            ? "bg-violet-500/10 text-violet-400 border-violet-500/20"
                            : "bg-violet-50 text-violet-700 border-violet-200"
                          : isDark
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200"
                      }`}
                    >
                      <Check size={9} weight="bold" />
                      {product.accessType === "subscription" ? t("plan") : t("owned")}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Close button */}
            <div className="relative z-10 shrink-0">
              <button
                onClick={onClose}
                aria-label="Close"
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
                  isDark
                    ? "text-white/40 hover:text-white hover:bg-white/5"
                    : "text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100"
                }`}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="relative z-10 flex-1 overflow-y-auto min-h-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
              {/* Main column: image + content */}
              <div
                className={`col-span-1 lg:col-span-2 flex flex-col gap-6 p-6 sm:p-7 border-b lg:border-b-0 lg:border-r ${
                  isDark ? "border-white/[0.06]" : "border-zinc-200"
                }`}
              >
                {/* Image */}
                <div
                  className={`w-full aspect-video rounded-2xl overflow-hidden border ${
                    isDark
                      ? "bg-black/40 border-white/10 shadow-inner"
                      : "bg-zinc-100 border-zinc-200 shadow-inner"
                  }`}
                >
                  {product.thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.thumbnail}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center opacity-20">
                      <AssetTypeIcon type={product.type} size={56} />
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <p
                    className={`text-[10px] font-mono tracking-[0.18em] uppercase font-semibold mb-2 ${
                      isDark ? "text-white/40" : "text-zinc-500"
                    }`}
                  >
                    {t("about_asset")}
                  </p>
                  <p
                    className={`text-sm leading-relaxed ${
                      isDark ? "text-zinc-300" : "text-zinc-600"
                    }`}
                  >
                    {product.description || (
                      <em className={isDark ? "text-zinc-600" : "text-zinc-400"}>
                        {t("no_description")}
                      </em>
                    )}
                  </p>
                </div>

                {/* Features */}
                {product.features?.length > 0 && (
                  <>
                    <div
                      className={`h-px ${
                        isDark ? "bg-white/[0.06]" : "bg-zinc-200"
                      }`}
                    />
                    <div>
                      <p
                        className={`text-[10px] font-mono tracking-[0.18em] uppercase font-semibold mb-3 ${
                          isDark ? "text-white/40" : "text-zinc-500"
                        }`}
                      >
                        {t("key_features")}
                      </p>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {product.features.map((f: string, i: number) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <div
                              className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 mt-0.5 border ${
                                isDark
                                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                  : "bg-emerald-50 text-emerald-600 border-emerald-200"
                              }`}
                            >
                              <Check size={9} weight="bold" />
                            </div>
                            <span
                              className={`text-xs leading-relaxed ${
                                isDark ? "text-zinc-300" : "text-zinc-700"
                              }`}
                            >
                              {f}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}

                {/* Requirements */}
                {product.requirements?.length > 0 && (
                  <>
                    <div
                      className={`h-px ${
                        isDark ? "bg-white/[0.06]" : "bg-zinc-200"
                      }`}
                    />
                    <div>
                      <p
                        className={`text-[10px] font-mono tracking-[0.18em] uppercase font-semibold mb-3 ${
                          isDark ? "text-white/40" : "text-zinc-500"
                        }`}
                      >
                        {t("requirements")}
                      </p>
                      <ul className="flex flex-col gap-2">
                        {product.requirements.map((r: string, i: number) => (
                          <li key={i} className="flex items-start gap-2">
                            <Warning
                              size={13}
                              className={`mt-0.5 shrink-0 ${
                                isDark ? "text-amber-400/80" : "text-amber-600"
                              }`}
                            />
                            <span
                              className={`text-xs font-mono leading-relaxed ${
                                isDark ? "text-zinc-400" : "text-zinc-600"
                              }`}
                            >
                              {r}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </div>

              {/* Sidebar: price + stats + actions */}
              <div
                className={`col-span-1 flex flex-col justify-between gap-6 p-6 sm:p-7 ${
                  isDark ? "bg-[#0D0D11]/60" : "bg-zinc-50/60"
                }`}
              >
                <div className="flex flex-col gap-5">
                  {/* Price */}
                  <div>
                    <p
                      className={`text-[10px] font-mono tracking-[0.18em] uppercase font-semibold mb-1 ${
                        isDark ? "text-white/40" : "text-zinc-500"
                      }`}
                    >
                      {t("price")}
                    </p>
                    <p
                      className={`text-3xl font-bold font-mono tracking-tight ${
                        isDark ? "text-white" : "text-zinc-900"
                      }`}
                    >
                      {formatLocalPrice(product.price)}
                    </p>
                  </div>

                  {/* Stats */}
                  <div
                    className={`rounded-2xl border overflow-hidden shadow-xs divide-y ${
                      isDark
                        ? "bg-[#09090B] border-white/[0.08] divide-white/[0.06]"
                        : "bg-white border-zinc-200 divide-zinc-100"
                    }`}
                  >
                    <div className="flex items-center justify-between px-3.5 py-3">
                      <span
                        className={`text-[10px] font-mono uppercase tracking-[0.14em] font-semibold ${
                          isDark ? "text-white/40" : "text-zinc-500"
                        }`}
                      >
                        {t("rating")}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <Star
                          size={12}
                          weight="fill"
                          className="text-amber-400"
                        />
                        <span
                          className={`text-xs font-bold tabular-nums ${
                            isDark ? "text-white" : "text-zinc-900"
                          }`}
                        >
                          {product.rating}
                        </span>
                        <span
                          className={`text-[10px] font-mono tabular-nums ${
                            isDark ? "text-white/40" : "text-zinc-400"
                          }`}
                        >
                          ({product.reviews})
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between px-3.5 py-3">
                      <span
                        className={`text-[10px] font-mono uppercase tracking-[0.14em] font-semibold ${
                          isDark ? "text-white/40" : "text-zinc-500"
                        }`}
                      >
                        {t("downloads")}
                      </span>
                      <span
                        className={`text-xs font-bold font-mono tabular-nums ${
                          isDark ? "text-white" : "text-zinc-900"
                        }`}
                      >
                        {product.downloads.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between px-3.5 py-3">
                      <span
                        className={`text-[10px] font-mono uppercase tracking-[0.14em] font-semibold ${
                          isDark ? "text-white/40" : "text-zinc-500"
                        }`}
                      >
                        {t("category")}
                      </span>
                      <span
                        className={`text-[10px] font-mono uppercase tracking-wider font-semibold ${
                          isDark ? "text-white/80" : "text-zinc-800"
                        }`}
                      >
                        {product.category}
                      </span>
                    </div>
                  </div>

                  {/* Trust badges */}
                  <div className="flex flex-col gap-2 pt-1">
                    <div className="flex items-center gap-2">
                      <ShieldCheck
                        size={14}
                        weight="fill"
                        className="text-emerald-500 shrink-0"
                      />
                      <span
                        className={`text-[11px] font-mono uppercase tracking-wider font-semibold ${
                          isDark ? "text-emerald-400" : "text-emerald-600"
                        }`}
                      >
                        {t("verified_asset")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar
                        size={14}
                        className={`shrink-0 ${
                          isDark ? "text-white/40" : "text-zinc-400"
                        }`}
                      />
                      <span
                        className={`text-[11px] font-mono tracking-wider ${
                          isDark ? "text-white/40" : "text-zinc-500"
                        }`}
                      >
                        {new Date(product.updatedAt).toLocaleDateString(
                          "en-US",
                          { year: "numeric", month: "short", day: "numeric" },
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Lock notice */}
                  {!product.isPurchased && (
                    <div
                      className={`px-3 py-2.5 rounded-xl border text-[11px] font-mono leading-relaxed flex items-start gap-2 ${
                        isDark
                          ? "bg-amber-500/5 border-amber-500/20 text-amber-300"
                          : "bg-amber-50 border-amber-200 text-amber-800"
                      }`}
                    >
                      <Lock size={12} className="mt-0.5 shrink-0" />
                      {t("purchase_required")}
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex flex-col gap-2.5 pt-2">
                  {product.isPurchased ? (
                    <>
                      {product.external_url ? (
                        <a
                          href={product.external_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider font-mono flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md bg-white hover:bg-neutral-200 text-black active:scale-[0.99]"
                        >
                          <ArrowSquareOut size={14} weight="bold" />
                          {t("open_resource")}
                        </a>
                      ) : (
                        <button
                          onClick={() => onAction?.(product, "download")}
                          disabled={isProcessing}
                          className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider font-mono flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md bg-white hover:bg-neutral-200 text-black active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isProcessing ? (
                            <CircleNotch size={14} className="animate-spin text-black" />
                          ) : (
                            <DownloadSimple size={14} weight="bold" />
                          )}
                          {isProcessing
                            ? t("downloading")
                            : product.accessType === "subscription"
                              ? t("download_plan")
                              : t("download")}
                        </button>
                      )}
                      <button
                        onClick={() => onAction?.(product, "docs")}
                        className={`w-full py-2.5 rounded-xl text-xs font-medium font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          isDark
                            ? "bg-[#141418] hover:bg-[#1C1C22] text-white/80 border border-white/[0.08]"
                            : "bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200"
                        }`}
                      >
                        {t("documentation")}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => onAction?.(product, "cart")}
                      className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider font-mono flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md bg-white hover:bg-neutral-200 text-black active:scale-[0.99]"
                    >
                      <ShoppingCart size={14} weight="bold" />
                      {t("add_to_cart")} — {formatLocalPrice(product.price)}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
