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

  useEscapeKey(onClose, !!product);

  if (!product) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 16 }}
          transition={{ type: "spring", duration: 0.35, bounce: 0.1 }}
          className="relative w-full max-w-4xl rounded-2xl overflow-hidden flex flex-col"
          style={{
            maxHeight: "88vh",
            background: isDark ? "#0a0a0a" : "#ffffff",
            boxShadow: isDark
              ? "0 30px 80px -10px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.08), 0 0 100px -15px rgba(6,182,212,0.15)"
              : "0 30px 60px -12px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.08)",
          }}
        >
          {/* Top accent line */}
          <div
            className={`absolute inset-x-0 top-0 h-px z-20 ${
              isDark
                ? "bg-linear-to-r from-transparent via-cyan-500/70 to-transparent"
                : "bg-linear-to-r from-transparent via-blue-400/50 to-transparent"
            }`}
          />
          {/* Corner glow */}
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "22rem",
              height: "22rem",
              background: isDark
                ? "radial-gradient(circle at top right, rgba(6,182,212,0.06), transparent 70%)"
                : "radial-gradient(circle at top right, rgba(59,130,246,0.06), transparent 70%)",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />
          {/* Bottom ambient light */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "28rem",
              background: isDark
                ? "radial-gradient(ellipse 85% 50% at 50% 100%, rgba(6,182,212,0.08), rgba(99,102,241,0.04) 55%, transparent 80%)"
                : "radial-gradient(ellipse 85% 50% at 50% 100%, rgba(59,130,246,0.06), transparent 80%)",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />
          {/* Header */}
          <div
            className="relative px-8 py-6 flex justify-between items-start overflow-hidden shrink-0"
            style={{
              borderBottom: isDark
                ? "1px solid rgba(255,255,255,0.07)"
                : "1px solid rgba(0,0,0,0.08)",
            }}
          >
            {/* Gradient wash */}
            <div
              className={`absolute inset-0 ${
                isDark
                  ? "bg-linear-to-r from-cyan-500/10 via-teal-600/8 to-transparent"
                  : "bg-linear-to-r from-cyan-50 via-blue-50/60 to-transparent"
              }`}
            />
            {/* Grid dots */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: isDark
                  ? "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)"
                  : "radial-gradient(circle, rgba(0,0,0,0.03) 1px, transparent 1px)",
                backgroundSize: "20px 20px",
                pointerEvents: "none",
              }}
            />
            {/* Accent line inferior izquierda */}
            <div
              className={`absolute bottom-0 left-0 h-px w-2/5 ${
                isDark
                  ? "bg-linear-to-r from-cyan-500/50 to-transparent"
                  : "bg-linear-to-r from-cyan-400/30 to-transparent"
              }`}
            />

            {/* Left: icon badge + title + pills */}
            <div className="relative z-10 flex gap-4 items-start">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shrink-0 ${
                  isDark
                    ? "bg-[#111] text-cyan-400 border border-white/10 shadow-cyan-500/10"
                    : "bg-white text-cyan-600 border border-cyan-100 shadow-cyan-200/40"
                }`}
              >
                <AssetTypeIcon type={product.type} size={22} />
              </div>
              <div className="min-w-0">
                <h2
                  className={`text-2xl font-bold leading-tight truncate ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {product.name}
                </h2>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span
                    className={`text-sm font-medium px-2 py-0.5 rounded-full ${
                      isDark ? "bg-white/8 text-gray-300" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {getAssetTypeLabel(product.type)}
                  </span>
                  <span
                    className={`font-mono text-[10px] px-2 py-0.5 rounded-full border ${
                      isDark
                        ? "bg-white/5 border-white/10 text-gray-400"
                        : "bg-gray-100 border-gray-200 text-gray-500"
                    }`}
                  >
                    v{product.version}
                  </span>
                  {product.isPurchased && (
                    <span
                      className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        product.accessType === "subscription"
                          ? isDark
                            ? "bg-violet-500/15 text-violet-400 border-violet-500/20"
                            : "bg-violet-100 text-violet-700 border-violet-200"
                          : isDark
                            ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"
                            : "bg-emerald-100 text-emerald-700 border-emerald-200"
                      }`}
                    >
                      <Check size={9} weight="bold" />
                      {product.accessType === "subscription" ? "Plan" : "Owned"}
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                <p
                  className={`text-[10px] font-bold uppercase tracking-widest hidden ${
                    isDark ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  {getAssetTypeLabel(product.type)}
                </p>
                </div>
              </div>
            </div>

            {/* Close button */}
            <div className="relative z-10">
              <button
                onClick={onClose}
                aria-label="Close"
                className={`p-2 rounded-full transition-colors ${
                  isDark
                    ? "hover:bg-white/10 text-gray-400 hover:text-white"
                    : "hover:bg-black/5 text-gray-500 hover:text-gray-900"
                }`}
              >
                <X size={22} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="relative z-10 flex-1 overflow-y-auto">
            <div className="grid grid-cols-3 gap-0">

              {/* Main column: image + content */}
              <div className="col-span-2 flex flex-col gap-5 p-6 border-r border-white/8">

                {/* Image */}
                <div
                  className={`w-full aspect-video rounded-xl overflow-hidden border ${
                    isDark ? "bg-white/3 border-white/8" : "bg-gray-100 border-gray-200"
                  }`}
                >
                  {product.thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={product.thumbnail} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center opacity-20">
                      <AssetTypeIcon type={product.type} size={56} />
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                    About this asset
                  </p>
                  <p className={`text-sm leading-relaxed ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                    {product.description || (
                      <em className={isDark ? "text-gray-600" : "text-gray-400"}>No description provided.</em>
                    )}
                  </p>
                </div>

                {/* Features */}
                {product.features?.length > 0 && (
                  <>
                    <div className={`h-px ${isDark ? "bg-white/5" : "bg-gray-100"}`} />
                    <div>
                      <p className={`text-[10px] font-bold uppercase tracking-widest mb-3 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                        Key Features
                      </p>
                      <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
                        {product.features.map((f: string, i: number) => (
                          <li key={i} className="flex items-start gap-2">
                            <div className={`mt-0.5 p-0.5 rounded shrink-0 ${isDark ? "bg-cyan-500/10" : "bg-blue-50"}`}>
                              <Check size={10} weight="bold" className={isDark ? "text-cyan-400" : "text-blue-600"} />
                            </div>
                            <span className={`text-xs leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}

                {/* Requirements */}
                {product.requirements?.length > 0 && (
                  <>
                    <div className={`h-px ${isDark ? "bg-white/5" : "bg-gray-100"}`} />
                    <div>
                      <p className={`text-[10px] font-bold uppercase tracking-widest mb-3 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                        Requirements
                      </p>
                      <ul className="flex flex-col gap-2">
                        {product.requirements.map((r: string, i: number) => (
                          <li key={i} className="flex items-start gap-2">
                            <Warning size={13} className={`mt-0.5 shrink-0 ${isDark ? "text-gray-600" : "text-gray-400"}`} />
                            <span className={`text-xs leading-relaxed ${isDark ? "text-gray-400" : "text-gray-600"}`}>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </div>

              {/* Sidebar: price + stats + actions */}
              <div className={`col-span-1 flex flex-col gap-5 p-5 ${isDark ? "" : ""}`}>

                {/* Price */}
                <div>
                  <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                    Price
                  </p>
                  <p className={`text-3xl font-black italic tracking-tighter ${isDark ? "text-white" : "text-gray-900"}`}>
                    ${product.price}
                  </p>
                </div>

                {/* Stats */}
                <div className={`rounded-xl border overflow-hidden divide-y ${isDark ? "bg-white/3 border-white/8 divide-white/5" : "bg-gray-50 border-gray-100 divide-gray-100"}`}>
                  <div className="flex items-center justify-between px-3 py-2.5">
                    <span className={`text-[10px] uppercase font-bold tracking-widest ${isDark ? "text-gray-500" : "text-gray-400"}`}>Rating</span>
                    <div className="flex items-center gap-1">
                      <Star size={11} weight="fill" className="text-amber-400" />
                      <span className={`text-xs font-bold tabular-nums ${isDark ? "text-white" : "text-gray-900"}`}>{product.rating}</span>
                      <span className={`text-[10px] tabular-nums ${isDark ? "text-gray-600" : "text-gray-400"}`}>({product.reviews})</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between px-3 py-2.5">
                    <span className={`text-[10px] uppercase font-bold tracking-widest ${isDark ? "text-gray-500" : "text-gray-400"}`}>Downloads</span>
                    <span className={`text-xs font-bold tabular-nums ${isDark ? "text-white" : "text-gray-900"}`}>{product.downloads.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between px-3 py-2.5">
                    <span className={`text-[10px] uppercase font-bold tracking-widest ${isDark ? "text-gray-500" : "text-gray-400"}`}>Category</span>
                    <span className={`text-[10px] font-bold ${isDark ? "text-cyan-400" : "text-blue-600"}`}>{product.category}</span>
                  </div>
                </div>

                {/* Trust badges */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={13} weight="fill" className="text-emerald-500 shrink-0" />
                    <span className={`text-[11px] font-semibold ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>Verified Asset</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={13} className={`shrink-0 ${isDark ? "text-gray-600" : "text-gray-400"}`} />
                    <span className={`text-[11px] ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                      {new Date(product.updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                    </span>
                  </div>
                </div>

                {/* Lock notice */}
                {!product.isPurchased && (
                  <div className={`px-3 py-2.5 rounded-xl border text-[10px] leading-relaxed flex items-start gap-2 ${isDark ? "bg-orange-500/5 border-orange-500/15 text-orange-400" : "bg-orange-50 border-orange-200 text-orange-700"}`}>
                    <Lock size={11} className="mt-px shrink-0" />
                    Purchase required to download this asset.
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex flex-col gap-2.5">
                  {product.isPurchased ? (
                    <>
                      {product.external_url ? (
                        <a
                          href={product.external_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${isDark ? "bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/20" : "bg-blue-600 text-white hover:bg-blue-700"}`}
                        >
                          <ArrowSquareOut size={14} />
                          Open Resource
                        </a>
                      ) : (
                        <button
                          onClick={() => onAction?.(product, "download")}
                          disabled={isProcessing}
                          className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${isDark ? "bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/20" : "bg-blue-600 text-white hover:bg-blue-700"}`}
                        >
                          {isProcessing ? <CircleNotch size={14} className="animate-spin" /> : <DownloadSimple size={14} weight="bold" />}
                          {isProcessing ? "Downloading..." : product.accessType === "subscription" ? "Download (Plan)" : "Download"}
                        </button>
                      )}
                      <button
                        onClick={() => onAction?.(product, "docs")}
                        className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${isDark ? "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/8" : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"}`}
                      >
                        Documentation
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => onAction?.(product, "cart")}
                      className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${isDark ? "bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/20" : "bg-blue-600 text-white hover:bg-blue-700"}`}
                    >
                      <ShoppingCart size={14} />
                      Add to Cart — ${product.price}
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
