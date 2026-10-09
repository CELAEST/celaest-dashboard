"use client";

import React from "react";
import { X, Star, Calendar } from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useEscapeKey } from "@/features/shared/hooks/useEscapeKey";
import { createPortal } from "react-dom";
import { ProductModalTabs } from "./ProductModalTabs";
import { ProductModalSidebar } from "./ProductModalSidebar";
import { useProductDetail } from "../../hooks/useProductDetail";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { LiteYouTube } from "@/features/shared/components/LiteYouTube";
import { MarketplaceProduct } from "../../types";
import { useTranslations } from "next-intl";

interface ProductDetailModalProps {
  initialProduct: MarketplaceProduct;
  onClose: () => void;
  onPurchase?: () => void;
  isOwned?: boolean;
  accessLevel?: "owned" | "plan" | "none";
  onDownload?: () => void;
  onViewLicense?: () => void;
  /**
   * Pestaña con la que se abre el modal. Útil cuando el modal se reabre tras
   * un flujo de login iniciado desde una tab específica (p. ej. "reviews").
   */
  initialTab?: "overview" | "features" | "reviews";
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  initialProduct,
  onClose,
  onPurchase,
  isOwned = false,
  accessLevel,
  onDownload,
  onViewLicense,
  initialTab,
}) => {
  const t = useTranslations("marketplace");
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = React.useState(initialTab ?? "overview");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch full details (rating aggregates etc.). Paginated reviews are loaded
  // separately by TabReviews via useProductReviews.
  const { product: fullProduct, loading } = useProductDetail(initialProduct.slug);

  // Use full details if available, otherwise initial
  const product = fullProduct || initialProduct;

  // Keyboard accessibility: Esc to close
  useEscapeKey(onClose, !!product);

  if (!mounted || !product) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-md animate-modal-backdrop"
      />

      {/* Modal */}
      <div
        className={`
          relative shrink-0 flex flex-col w-full max-h-[92dvh] sm:max-w-4xl lg:max-w-6xl
          rounded-3xl border shadow-[0_32px_96px_-12px_rgba(0,0,0,0.95)] overflow-hidden animate-modal-content
          ${
            theme === "dark"
              ? "bg-[#09090B] border-white/[0.08]"
              : "bg-white border-gray-200"
          }
        `}
      >
        {/* Tokyo Corner Accents (Dark Mode) */}
        {theme === "dark" && (
          <>
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white/20 rounded-tl-sm pointer-events-none z-30" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-white/20 rounded-tr-sm pointer-events-none z-30" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-white/20 rounded-bl-sm pointer-events-none z-30" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white/20 rounded-br-sm pointer-events-none z-30" />
          </>
        )}

        {/* ── HEADER ULTRA-LIMPIO (PLAN PRO RETIRADO PARA EVITAR REDUNDANCIA) ── */}
        <div
          className={`
            shrink-0 px-6 sm:px-8 py-4.5 border-b flex items-center justify-between
            ${
              theme === "dark"
                ? "bg-[#0D0D11] border-white/[0.06]"
                : "bg-gray-50/80 border-gray-200"
            }
          `}
        >
          <div className="flex flex-col gap-1.5 pr-4 min-w-0">
            {/* Floating Micro-Typography Tags (Sin Cajas, Sin Bordes) */}
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-[10px] font-mono tracking-[0.18em] uppercase ${theme === "dark" ? "text-white/40" : "text-gray-500"}`}>
                {product.category_name || t("general")}
              </span>

              {!!product.version && (
                <>
                  <span className={theme === "dark" ? "text-white/20" : "text-gray-300"}>•</span>
                  <span className={`text-[10px] font-mono tracking-wider ${theme === "dark" ? "text-white/40" : "text-gray-500"}`}>
                    {product.version.startsWith("v") ? product.version : `v${product.version}`}
                  </span>
                </>
              )}

              {product.rating_avg >= 4.5 && (
                <>
                  <span className={theme === "dark" ? "text-white/20" : "text-gray-300"}>•</span>
                  <span className={`text-[10px] font-mono tracking-wider uppercase font-medium ${theme === "dark" ? "text-amber-400/90" : "text-amber-600"}`}>
                    {t("popular")}
                  </span>
                </>
              )}
            </div>

            <h2
              className={`text-lg sm:text-xl font-extrabold tracking-tight truncate ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {product.name}
            </h2>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className={`hidden sm:flex items-center gap-2 text-xs font-mono ${theme === "dark" ? "text-white/50" : "text-gray-500"}`}>
              <span className="flex items-center gap-1 text-amber-400">
                <Star size={13} weight="fill" />
                <strong className={theme === "dark" ? "text-white" : "text-gray-900"}>
                  {product.rating_avg > 0 ? product.rating_avg.toFixed(1) : "N/A"}
                </strong>
              </span>
              <span>({product.rating_count} {t("reviews_count")})</span>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar modal"
              className={`
                w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer
                ${
                  theme === "dark"
                    ? "bg-white/[0.04] hover:bg-white/[0.1] text-white/60 hover:text-white border border-white/[0.08]"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-600 border border-gray-200"
                }
              `}
            >
              <X size={18} weight="bold" />
            </button>
          </div>
        </div>

        {/* ── CUERPO SPLIT PANORÁMICO (64% / 36%) ── */}
        <div className="flex-1 overflow-y-auto no-scrollbar grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-white/[0.06]">
          {/* Canvas Izquierdo (64%) */}
          <div
            className={`
              lg:col-span-8 p-6 sm:p-8 flex flex-col gap-6
              ${theme === "dark" ? "bg-[#09090B]" : "bg-white"}
            `}
          >
            {/* Media Display Cinema 16:9 */}
            {product.youtube_video_id ? (
              <div className="w-full rounded-2xl overflow-hidden bg-black aspect-video border border-white/[0.08] shadow-2xl">
                <LiteYouTube
                  videoId={product.youtube_video_id}
                  title={product.name}
                  fallbackImage={product.thumbnail_url || undefined}
                  autoPlay
                />
              </div>
            ) : (
              <div
                className={`relative aspect-video rounded-2xl overflow-hidden bg-black border border-white/[0.08] shadow-2xl ${
                  loading ? "animate-pulse" : ""
                }`}
              >
                <ImageWithFallback
                  src={product.thumbnail_url || ""}
                  alt={product.name}
                  fill
                  className={`object-cover transition-opacity duration-300 ${
                    loading ? "opacity-50" : "opacity-100"
                  }`}
                />
              </div>
            )}

            {/* Tabs / Description (Desktop) */}
            <div className="hidden lg:block w-full">
              <ProductModalTabs
                product={product}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            </div>
          </div>

          {/* Right Column / Command Deck (36%) */}
          <div
            className={`
              lg:col-span-4 p-6 sm:p-7 flex flex-col gap-6
              ${theme === "dark" ? "bg-[#060608]" : "bg-gray-50/50"}
            `}
          >
            <ProductModalSidebar
              product={product}
              onPurchase={onPurchase}
              isOwned={isOwned}
              accessLevel={accessLevel}
              onDownload={onDownload}
              onViewLicense={onViewLicense}
            />

            {/* Tabs / Description (Mobile) */}
            <div className="lg:hidden w-full pt-4 border-t border-white/[0.06]">
              <ProductModalTabs
                product={product}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            </div>
          </div>
        </div>
        </div>
      </div>,
    document.body
  );
};
