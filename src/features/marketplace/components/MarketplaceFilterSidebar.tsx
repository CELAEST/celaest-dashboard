"use client";

import React from "react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import {
  Check,
  CaretDown,
  Star,
  CurrencyDollar,
  Sparkle,
  TrendUp,
  Shield,
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
        className={`px-4 py-5 border-b ${isDark ? "border-white/5 bg-linear-to-b from-white/2 to-transparent" : "border-gray-200/50 bg-linear-to-b from-gray-50/50 to-transparent"}`}
      >
        <div className="flex items-center gap-2.5 mb-2">
          <div
            className={`p-2 rounded-lg ${isDark ? "bg-cyan-500/10" : "bg-cyan-50"}`}
          >
            <Sparkle
              size={14}
              className={isDark ? "text-cyan-400" : "text-cyan-600"}
            />
          </div>
          <h2
            className={`text-sm font-black uppercase tracking-wide ${isDark ? "text-white" : "text-gray-900"}`}
          >
            {t("catalog")}
          </h2>
        </div>
        <p
          className={`text-[10px] font-bold uppercase tracking-widest ml-0.5 ${isDark ? "text-gray-500" : "text-gray-400"}`}
        >
          {t("solutions_available", { count: totalProducts })}
        </p>
      </div>

      {/* Filters Container */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3">
        {/* Categories Section */}
        <div className="space-y-1">
          <motion.button
            onClick={() => toggleSection("categories")}
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 ${
              isDark
                ? "hover:bg-white/5 active:bg-white/3"
                : "hover:bg-gray-50 active:bg-gray-100"
            }`}
          >
            <span
              className={`text-[10px] font-black uppercase tracking-wider ${isDark ? "text-gray-300" : "text-gray-700"}`}
            >
              {t("categories")}
            </span>
            <motion.div
              animate={{
                rotate: collapsedSections.has("categories") ? 0 : 180,
              }}
              transition={{ duration: 0.3 }}
            >
              <CaretDown
                size={12}
                className={isDark ? "text-gray-500" : "text-gray-400"}
              />
            </motion.div>
          </motion.button>

          <AnimatePresence>
            {!collapsedSections.has("categories") && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-0.5 mt-1 overflow-hidden"
              >
                {/* Default "All" option */}
                <motion.button
                  key="all"
                  onClick={() => onCategoryChange("all")}
                  whileHover={{ x: 3, scale: 1.01 }}
                  whileTap={{ scale: 0.97 }}
                  className={`
                    w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200
                    ${
                      selectedCategories.includes("all") ||
                      selectedCategories.length === 0
                        ? isDark
                          ? "bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-lg shadow-cyan-500/5"
                          : "bg-cyan-50 border border-cyan-200 text-cyan-700 shadow-sm"
                        : isDark
                          ? "text-gray-400 hover:bg-white/5 hover:text-white border border-transparent hover:border-white/10"
                          : "text-gray-600 hover:bg-gray-50 border border-transparent hover:border-gray-200"
                    }
                  `}
                >
                  <span className="text-left">{t("all_categories")}</span>
                  {(selectedCategories.includes("all") ||
                    selectedCategories.length === 0) && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    >
                      <Check size={11} className="shrink-0" strokeWidth={3} />
                    </motion.div>
                  )}
                </motion.button>

                {isLoadingCategories ? (
                  <div className="py-4 flex justify-center">
                    <div className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  categories.map((cat) => {
                    const catId = cat.slug || cat.id;
                    const isSelected = selectedCategories.includes(catId);
                    return (
                      <motion.button
                        key={cat.id}
                        onClick={() => onCategoryChange(catId)}
                        whileHover={{ x: 3, scale: 1.01 }}
                        whileTap={{ scale: 0.97 }}
                        className={`
                          w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200
                          ${
                            isSelected
                              ? isDark
                                ? "bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-lg shadow-cyan-500/5"
                                : "bg-cyan-50 border border-cyan-200 text-cyan-700 shadow-sm"
                              : isDark
                                ? "text-gray-400 hover:bg-white/5 hover:text-white border border-transparent hover:border-white/10"
                                : "text-gray-600 hover:bg-gray-50 border border-transparent hover:border-gray-200"
                          }
                        `}
                      >
                        <span className="text-left">{cat.name}</span>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              damping: 30,
                            }}
                          >
                            <Check
                              size={11}
                              className="shrink-0"
                              strokeWidth={3}
                            />
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Rating Funnel Section */}
        <div className="space-y-1">
          <motion.button
            onClick={() => toggleSection("rating")}
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 ${
              isDark
                ? "hover:bg-white/5 active:bg-white/3"
                : "hover:bg-gray-50 active:bg-gray-100"
            }`}
          >
            <span
              className={`text-[11px] font-black uppercase tracking-wider ${isDark ? "text-gray-300" : "text-gray-700"}`}
            >
              {t("rating")}
            </span>
            <motion.div
              animate={{ rotate: collapsedSections.has("rating") ? 0 : 180 }}
              transition={{ duration: 0.3 }}
            >
              <CaretDown
                size={12}
                className={isDark ? "text-gray-500" : "text-gray-400"}
              />
            </motion.div>
          </motion.button>

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
                    <motion.button
                      key={rating}
                      onClick={() => onRatingChange(rating)}
                      whileHover={{ x: 3, scale: 1.01 }}
                      whileTap={{ scale: 0.97 }}
                      className={`
                        w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200
                        ${
                          isSelected
                            ? isDark
                              ? "bg-amber-500/10 border border-amber-500/30 text-amber-400 shadow-lg shadow-amber-500/5"
                              : "bg-amber-50 border border-amber-200 text-amber-700 shadow-sm"
                            : isDark
                              ? "text-gray-400 hover:bg-white/5 hover:text-white border border-transparent hover:border-white/10"
                              : "text-gray-600 hover:bg-gray-50 border border-transparent hover:border-gray-200"
                        }
                      `}
                    >
                      {rating === 0 ? (
                        <span className="text-left">{t("all_ratings")}</span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={11}
                                weight={i < rating ? "fill" : "regular"}
                                className={
                                  i < rating
                                    ? "text-yellow-500"
                                    : isDark
                                      ? "text-gray-600"
                                      : "text-gray-300"
                                }
                              />
                            ))}
                          </div>
                          <span className="text-[10px] text-gray-500">{t("and_above")}</span>
                        </div>
                      )}
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                          }}
                        >
                          <Check size={11} className="shrink-0" strokeWidth={3} />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Price Range Section */}
        <div className="space-y-1">
          <motion.button
            onClick={() => toggleSection("price")}
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 ${
              isDark
                ? "hover:bg-white/5 active:bg-white/3"
                : "hover:bg-gray-50 active:bg-gray-100"
            }`}
          >
            <span
              className={`text-[11px] font-black uppercase tracking-wider ${isDark ? "text-gray-300" : "text-gray-700"}`}
            >
              {t("price_filter")}
            </span>
            <motion.div
              animate={{ rotate: collapsedSections.has("price") ? 0 : 180 }}
              transition={{ duration: 0.3 }}
            >
              <CaretDown
                size={12}
                className={isDark ? "text-gray-500" : "text-gray-400"}
              />
            </motion.div>
          </motion.button>

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
                    <motion.button
                      key={price.id}
                      onClick={() => onPriceRangeChange(price.id)}
                      whileHover={{ x: 3, scale: 1.01 }}
                      whileTap={{ scale: 0.97 }}
                      className={`
                        w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200
                        ${
                          isSelected
                            ? isDark
                              ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-lg shadow-emerald-500/5"
                              : "bg-emerald-50 border border-emerald-200 text-emerald-700 shadow-sm"
                            : isDark
                              ? "text-gray-400 hover:bg-white/5 hover:text-white border border-transparent hover:border-white/10"
                              : "text-gray-600 hover:bg-gray-50 border border-transparent hover:border-gray-200"
                        }
                      `}
                    >
                      <div className="flex items-center gap-2">
                        <CurrencyDollar size={12} className="shrink-0" />
                        <span>{price.label}</span>
                      </div>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                          }}
                        >
                          <Check size={11} className="shrink-0" strokeWidth={3} />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer - Trust Badges */}
      <div
        className={`px-3 py-3 border-t space-y-2 ${isDark ? "border-white/5" : "border-gray-200/50"}`}
      >
        <div
          className={`flex items-center gap-2 px-2 py-1.5 rounded-lg ${isDark ? "bg-emerald-500/5" : "bg-emerald-50/50"}`}
        >
          <Shield size={10} className="text-emerald-500" />
          <span
            className={`text-[9px] font-bold ${isDark ? "text-emerald-400" : "text-emerald-600"}`}
          >
            {t("guarantee_30")}
          </span>
        </div>
        <div
          className={`flex items-center gap-2 px-2 py-1.5 rounded-lg ${isDark ? "bg-amber-500/5" : "bg-amber-50/50"}`}
        >
          <Sparkle size={10} className="text-amber-500" />
          <span
            className={`text-[9px] font-bold ${isDark ? "text-amber-400" : "text-amber-600"}`}
          >
            {t("premium_support")}
          </span>
        </div>
        <div
          className={`flex items-center gap-2 px-2 py-1.5 rounded-lg ${isDark ? "bg-cyan-500/5" : "bg-cyan-50/50"}`}
        >
          <TrendUp size={10} className="text-cyan-500" />
          <span
            className={`text-[9px] font-bold ${isDark ? "text-cyan-400" : "text-cyan-600"}`}
          >
            {t("guaranteed_roi")}
          </span>
        </div>
      </div>
    </div>
  );
}
