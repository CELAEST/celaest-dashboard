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
          relative shrink-0 flex flex-col w-full max-h-[95dvh] sm:max-h-[90dvh] sm:max-w-3xl lg:max-w-6xl
          rounded-[24px] sm:rounded-[32px] border sm:shadow-2xl overflow-hidden animate-modal-content
          ${
            theme === "dark"
              ? "bg-[#050505] sm:bg-[#050505]/95 border-white/10"
              : "bg-white border-gray-200"
          }
        `}
      >
          {/* Header */}
          <div
            className={`
            shrink-0 flex items-start justify-between border-b p-4 sm:p-6
            ${
              theme === "dark"
                ? "bg-transparent border-white/10"
                : "bg-transparent border-gray-200"
            }
          `}
          >
            <div className="flex-1 pr-4">
              <div className="flex flex-wrap items-center gap-1.5 md:gap-2 mb-2">
                <span
                  className={`
                  px-2.5 py-0.5 md:px-3 md:py-1 rounded-lg text-[10px] md:text-xs font-bold border
                  ${
                    theme === "dark"
                      ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                      : "bg-blue-50 border-blue-200 text-blue-700"
                  }
                `}
                >
                  {product.category_name || t("general")}
                </span>

                {/* Secondary Tags in Header */}
                {(product.tags || []).slice(0, 2).map((tag, i) => (
                  <span
                    key={`${tag}-${i}`}
                    className={`
                      px-1.5 py-0.5 md:px-2 md:py-0.5 rounded-md text-[9px] md:text-[10px] font-medium border uppercase tracking-wider
                      ${
                        theme === "dark"
                          ? "bg-white/5 border-white/10 text-gray-400"
                          : "bg-gray-50 border-gray-200 text-gray-500"
                      }
                    `}
                  >
                    {tag}
                  </span>
                ))}

                {product.rating_avg >= 4.5 && (
                  <span
                    className={`
                    px-2.5 py-0.5 md:px-3 md:py-1 rounded-lg text-[10px] md:text-xs font-bold border-0
                    ${
                      theme === "dark"
                        ? "bg-linear-to-r from-cyan-400 to-blue-400 text-black"
                        : "bg-linear-to-r from-blue-600 to-indigo-600 text-white"
                    }
                  `}
                  >
                    {t("popular")}
                  </span>
                )}
              </div>
              <h2
                className={`text-xl md:text-2xl font-bold mb-1.5 md:mb-2 line-clamp-2 md:line-clamp-none ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {product.name}
              </h2>
              <div
                className={`flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                <div className="flex items-center gap-1">
                  <Star className="size-3.5 md:size-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">
                    {product.rating_avg > 0
                      ? product.rating_avg.toFixed(1)
                      : "N/A"}
                  </span>
                  <span>({product.rating_count} {t("reviews_count")})</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="size-3.5 md:size-4" />
                  <span>
                    {t("published")}{" "}
                    {new Date(product.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`
                p-2 rounded-xl transition-colors shrink-0
                ${
                  theme === "dark"
                    ? "bg-white/5 hover:bg-white/10 text-gray-300"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                }
              `}
            >
              <X className="size-5 md:size-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto scroll-smooth">
            <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 p-4 sm:p-6 pb-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Product preview */}
                {product.youtube_video_id ? (
                  <div className="w-full rounded-[16px] sm:rounded-2xl overflow-hidden bg-black aspect-video ring-1 ring-white/5">
                    <LiteYouTube
                      videoId={product.youtube_video_id}
                      title={product.name}
                      fallbackImage={product.thumbnail_url || undefined}
                      autoPlay
                    />
                  </div>
                ) : (
                  <div
                    className={`relative aspect-video rounded-[16px] sm:rounded-2xl overflow-hidden bg-[#111] dark:bg-[#111] ring-1 ring-white/5 ${loading ? "animate-pulse" : ""}`}
                  >
                  <ImageWithFallback
                    src={product.thumbnail_url || ""}
                    alt={product.name}
                    fill
                    className={`object-cover transition-opacity duration-300 ${loading ? "opacity-50" : "opacity-100"}`}
                  />
                </div>
              )}

              {/* Sidebar structurally grouped for mobile under video */}
              <div className="lg:hidden w-full pt-2 pb-2">
                <ProductModalSidebar
                  product={product}
                  onPurchase={onPurchase}
                  isOwned={isOwned}
                  accessLevel={accessLevel}
                  onDownload={onDownload}
                  onViewLicense={onViewLicense}
                />
              </div>

              <div className="w-full">
                <ProductModalTabs
                  product={product}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />
              </div>
            </div>

            {/* Sidebar (Desktop) */}
            <div className="hidden lg:block lg:col-span-1">
              <ProductModalSidebar
                product={product}
                onPurchase={onPurchase}
                isOwned={isOwned}
                accessLevel={accessLevel}
                onDownload={onDownload}
                onViewLicense={onViewLicense}
              />
            </div>
          </div>
          </div>
        </div>
      </div>,
    document.body
  );
};
