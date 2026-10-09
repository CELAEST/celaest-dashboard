"use client";

import React from "react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import {
  Check,
  CaretDown,
  Star,
  CurrencyDollar,
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "motion/react";
import { useCategories } from "@/features/assets/hooks/useCategories";
import { useTranslations } from "next-intl";

interface MarketplaceFilterSidebarProps {
  selectedCategories: string[];
  onCategoryChange: (category: string) => void;
  selectedRating: number;
  onRatingChange: (rating: number) => void;
  priceRange: string;
  onPriceRangeChange: (range: string) => void;
  totalProducts: number;
}

export function MarketplaceFilterSidebar({
  selectedCategories,
  onCategoryChange,
  selectedRating,
  onRatingChange,
  priceRange,
  onPriceRangeChange,
  totalProducts,
}: MarketplaceFilterSidebarProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [collapsedSections, setCollapsedSections] = React.useState<Set<string>>(
    new Set(),
  );
  const { categories, isLoading: isLoadingCategories } = useCategories(true);
  const t = useTranslations("marketplace");

  const PRICE_RANGES = [
    { id: "all", label: t("all_prices") },
    { id: "free", label: t("free") },
    { id: "0-50", label: "$1 - $50" },
    { id: "50-200", label: "$50 - $200" },
    { id: "200+", label: "$200+" },
  ];

  const toggleSection = (section: string) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  return (
    <div
      className={`w-56 h-full shrink-0 flex flex-col border-r ${isDark ? "border-white/5" : "border-gray-200/50"}`}
    >
      {/* Header */}
      <div
        className={`px-4 py-4 border-b ${isDark ? "border-white/5" : "border-gray-200/50"}`}
      >
        <div className="mb-1">
          <h2
            className={`text-xs font-mono font-bold uppercase tracking-[0.16em] ${isDark ? "text-white/90" : "text-gray-900"}`}
          >
            {t("catalog")}
          </h2>
        </div>
        <p
          className={`text-[10px] font-mono tracking-wider ${isDark ? "text-white/40" : "text-gray-400"}`}
        >
          {t("solutions_available", { count: totalProducts })}
        </p>
      </div>

      {/* Filters Container */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-4">
        {/* Categories Section */}
        <div className="space-y-1">
          <button
            onClick={() => toggleSection("categories")}
            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg transition-colors duration-150 cursor-pointer ${
              isDark
                ? "hover:bg-white/[0.03] text-white/50 hover:text-white/80"
                : "hover:bg-gray-50 text-gray-600 hover:text-gray-900"
            }`}
          >
            <span className="text-[10px] font-mono uppercase tracking-[0.15em]">
              {t("categories")}
            </span>
            <CaretDown
              size={12}
              className={`transition-transform duration-200 ${
                collapsedSections.has("categories") ? "" : "rotate-180"
              } ${isDark ? "text-white/30" : "text-gray-400"}`}
            />
          </button>

          <AnimatePresence>
            {!collapsedSections.has("categories") && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-0.5 mt-1 overflow-hidden"
              >
                {/* Default "All" option */}
                <button
                  key="all"
                  onClick={() => onCategoryChange("all")}
                  className={`
                    group relative overflow-hidden w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all duration-200 cursor-pointer text-left border
                    ${
                      selectedCategories.includes("all") ||
                      selectedCategories.length === 0
                        ? isDark
                          ? "bg-zinc-800/40 border-white/8 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] text-zinc-100 font-semibold"
                          : "bg-white border-black/6 shadow-sm text-zinc-900 font-semibold"
                        : isDark
                          ? "border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40 hover:border-white/8 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                          : "border-transparent text-zinc-500 hover:text-zinc-900 hover:bg-white hover:border-black/6 hover:shadow-xs"
                    }
                  `}
                >
                  {(selectedCategories.includes("all") ||
                    selectedCategories.length === 0) &&
                    isDark && (
                      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/4 to-transparent w-[200%] animate-sheen pointer-events-none" />
                    )}
                  <span className="truncate relative z-10">{t("all_categories")}</span>
                  {(selectedCategories.includes("all") ||
                    selectedCategories.length === 0) && (
                    <Check
                      size={12}
                      className={isDark ? "text-zinc-200 shrink-0 relative z-10" : "text-zinc-900 shrink-0 relative z-10"}
                      strokeWidth={2.5}
                    />
                  )}
                </button>

                {isLoadingCategories ? (
                  <div className="py-4 flex justify-center">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  </div>
                ) : (
                  categories.map((cat) => {
                    const catId = cat.slug || cat.id;
                    const isSelected = selectedCategories.includes(catId);
                    return (
                      <button
                        key={cat.id}
                        onClick={() => onCategoryChange(catId)}
                        className={`
                          group relative overflow-hidden w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all duration-200 cursor-pointer text-left border
                          ${
                            isSelected
                              ? isDark
                                ? "bg-zinc-800/40 border-white/8 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] text-zinc-100 font-semibold"
                                : "bg-white border-black/6 shadow-sm text-zinc-900 font-semibold"
                              : isDark
                                ? "border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40 hover:border-white/8 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                                : "border-transparent text-zinc-500 hover:text-zinc-900 hover:bg-white hover:border-black/6 hover:shadow-xs"
                          }
                        `}
                      >
                        {isSelected && isDark && (
                          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/4 to-transparent w-[200%] animate-sheen pointer-events-none" />
                        )}
                        <span className="truncate relative z-10">{cat.name}</span>
                        {isSelected && (
                          <Check
                            size={12}
                            className={isDark ? "text-zinc-200 shrink-0 relative z-10" : "text-zinc-900 shrink-0 relative z-10"}
                            strokeWidth={2.5}
                          />
                        )}
                      </button>
                    );
                  })
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Rating Funnel Section */}
        <div className="space-y-1">
          <button
            onClick={() => toggleSection("rating")}
            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg transition-colors duration-150 cursor-pointer ${
              isDark
                ? "hover:bg-white/[0.03] text-white/50 hover:text-white/80"
                : "hover:bg-gray-50 text-gray-600 hover:text-gray-900"
            }`}
          >
            <span className="text-[10px] font-mono uppercase tracking-[0.15em]">
              {t("rating")}
            </span>
            <CaretDown
              size={12}
              className={`transition-transform duration-200 ${
                collapsedSections.has("rating") ? "" : "rotate-180"
              } ${isDark ? "text-white/30" : "text-gray-400"}`}
            />
          </button>

          <AnimatePresence>
            {!collapsedSections.has("rating") && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-0.5 mt-1 overflow-hidden"
              >
                {[5, 4, 3, 0].map((rating) => {
                  const isSelected = selectedRating === rating;
                  return (
                    <button
                      key={rating}
                      onClick={() => onRatingChange(rating)}
                      className={`
                        group relative overflow-hidden w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all duration-200 cursor-pointer text-left border
                        ${
                          isSelected
                            ? isDark
                              ? "bg-zinc-800/40 border-white/8 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] text-zinc-100 font-semibold"
                              : "bg-white border-black/6 shadow-sm text-zinc-900 font-semibold"
                            : isDark
                              ? "border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40 hover:border-white/8 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                              : "border-transparent text-zinc-500 hover:text-zinc-900 hover:bg-white hover:border-black/6 hover:shadow-xs"
                        }
                      `}
                    >
                      {isSelected && isDark && (
                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/4 to-transparent w-[200%] animate-sheen pointer-events-none" />
                      )}
                      {rating === 0 ? (
                        <span className="truncate relative z-10">{t("all_ratings")}</span>
                      ) : (
                        <div className="flex items-center gap-2 relative z-10">
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={11}
                                weight={i < rating ? "fill" : "regular"}
                                className={
                                  i < rating
                                    ? "text-amber-400/90"
                                    : isDark
                                      ? "text-white/15"
                                      : "text-gray-300"
                                }
                              />
                            ))}
                          </div>
                          <span
                            className={`text-[10px] ${
                              isSelected
                                ? isDark
                                  ? "text-zinc-300"
                                  : "text-zinc-700"
                                : isDark
                                  ? "text-zinc-500"
                                  : "text-gray-500"
                            }`}
                          >
                            {t("and_above")}
                          </span>
                        </div>
                      )}
                      {isSelected && (
                        <Check
                          size={12}
                          className={isDark ? "text-zinc-200 shrink-0 relative z-10" : "text-zinc-900 shrink-0 relative z-10"}
                          strokeWidth={2.5}
                        />
                      )}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Price Range Section */}
        <div className="space-y-1">
          <button
            onClick={() => toggleSection("price")}
            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg transition-colors duration-150 cursor-pointer ${
              isDark
                ? "hover:bg-white/[0.03] text-white/50 hover:text-white/80"
                : "hover:bg-gray-50 text-gray-600 hover:text-gray-900"
            }`}
          >
            <span className="text-[10px] font-mono uppercase tracking-[0.15em]">
              {t("price_filter")}
            </span>
            <CaretDown
              size={12}
              className={`transition-transform duration-200 ${
                collapsedSections.has("price") ? "" : "rotate-180"
              } ${isDark ? "text-white/30" : "text-gray-400"}`}
            />
          </button>

          <AnimatePresence>
            {!collapsedSections.has("price") && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-0.5 mt-1 overflow-hidden"
              >
                {PRICE_RANGES.map((price) => {
                  const isSelected = priceRange === price.id;
                  return (
                    <button
                      key={price.id}
                      onClick={() => onPriceRangeChange(price.id)}
                      className={`
                        group relative overflow-hidden w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all duration-200 cursor-pointer text-left border
                        ${
                          isSelected
                            ? isDark
                              ? "bg-zinc-800/40 border-white/8 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] text-zinc-100 font-semibold"
                              : "bg-white border-black/6 shadow-sm text-zinc-900 font-semibold"
                            : isDark
                              ? "border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40 hover:border-white/8 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                              : "border-transparent text-zinc-500 hover:text-zinc-900 hover:bg-white hover:border-black/6 hover:shadow-xs"
                        }
                      `}
                    >
                      {isSelected && isDark && (
                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/4 to-transparent w-[200%] animate-sheen pointer-events-none" />
                      )}
                      <div className="flex items-center gap-2 relative z-10">
                        <CurrencyDollar
                          size={12}
                          className={`shrink-0 ${
                            isSelected
                              ? isDark
                                ? "text-zinc-200"
                                : "text-zinc-900"
                              : isDark
                                ? "text-zinc-500"
                                : "text-gray-400"
                          }`}
                        />
                        <span className="truncate">{price.label}</span>
                      </div>
                      {isSelected && (
                        <Check
                          size={12}
                          className={isDark ? "text-zinc-200 shrink-0 relative z-10" : "text-zinc-900 shrink-0 relative z-10"}
                          strokeWidth={2.5}
                        />
                      )}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
