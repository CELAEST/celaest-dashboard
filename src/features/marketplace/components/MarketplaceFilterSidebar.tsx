"use client";

import React from "react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import {
  Check,
  ChevronDown,
  Star,
  DollarSign,
  Sparkles,
  TrendingUp,
  Shield,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface MarketplaceFilterSidebarProps {
  selectedCategories: string[];
  onCategoryChange: (category: string) => void;
  selectedRating: number;
  onRatingChange: (rating: number) => void;
  priceRange: string;
  onPriceRangeChange: (range: string) => void;
  totalProducts: number;
}

const CATEGORIES = [
  { id: "all", label: "Todas", count: 0 },
  { id: "saas", label: "SaaS Solutions", count: 12 },
  { id: "tools", label: "Dev Tools", count: 8 },
  { id: "analytics", label: "Analytics", count: 6 },
  { id: "security", label: "Security", count: 5 },
  { id: "automation", label: "Automation", count: 4 },
];

const PRICE_RANGES = [
  { id: "all", label: "Todos los precios" },
  { id: "free", label: "Gratis" },
  { id: "0-50", label: "$1 - $50" },
  { id: "50-200", label: "$50 - $200" },
  { id: "200+", label: "$200+" },
];

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
      <div
        className={`px-4 py-5 border-b ${isDark ? "border-white/5 bg-linear-to-b from-white/2 to-transparent" : "border-gray-200/50 bg-linear-to-b from-gray-50/50 to-transparent"}`}
      >
        <div className="flex items-center gap-2.5 mb-2">
          <div
            className={`p-2 rounded-lg ${isDark ? "bg-cyan-500/10" : "bg-cyan-50"}`}
          >
            <Sparkles
              size={14}
              className={isDark ? "text-cyan-400" : "text-cyan-600"}
            />
          </div>
          <h2
            className={`text-sm font-black uppercase tracking-wide ${isDark ? "text-white" : "text-gray-900"}`}
          >
            Catálogo
          </h2>
        </div>
        <p
          className={`text-[10px] font-bold uppercase tracking-widest ml-0.5 ${isDark ? "text-gray-500" : "text-gray-400"}`}
        >
          {totalProducts} soluciones disponibles
        </p>
      </div>

      {/* Search Bar - Removed */}

      {/* Filters */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3">
        {/* Categories */}
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
              Categorías
            </span>
            <motion.div
              animate={{
                rotate: collapsedSections.has("categories") ? 0 : 180,
              }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown
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
                {CATEGORIES.map((cat) => {
                  const isSelected = selectedCategories.includes(cat.id);
                  return (
                    <motion.button
                      key={cat.id}
                      onClick={() => onCategoryChange(cat.id)}
                      whileHover={{ x: 3, scale: 1.01 }}
                      whileTap={{ scale: 0.97 }}
                      className={`
                        w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-200
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
                      <span className="flex-1 text-left">{cat.label}</span>
                      {cat.count > 0 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className={`px-1.5 py-0.5 rounded-md text-[10px] font-black ${
                            isSelected
                              ? isDark
                                ? "bg-cyan-500/20 text-cyan-300"
                                : "bg-cyan-100 text-cyan-800"
                              : isDark
                                ? "bg-white/5 text-gray-600"
                                : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {cat.count}
                        </motion.span>
                      )}
                    </motion.button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Rating Filter */}
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
              Calificación
            </span>
            <motion.div
              animate={{ rotate: collapsedSections.has("rating") ? 0 : 180 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown
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
                {[5, 4, 3, 0].map((rating) => (
                  <motion.button
                    key={rating}
                    onClick={() => onRatingChange(rating)}
                    whileHover={{ x: 3, scale: 1.01 }}
                    whileTap={{ scale: 0.97 }}
                    className={`
                      w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-200
                      ${
                        selectedRating === rating
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
                      <span>Todas</span>
                    ) : (
                      <>
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={9}
                              className={`${i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-600"}`}
                            />
                          ))}
                        </div>
                        <span className="text-[10px]">& Arriba</span>
                      </>
                    )}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Price Range */}
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
              Precio
            </span>
            <motion.div
              animate={{ rotate: collapsedSections.has("price") ? 0 : 180 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown
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
                {PRICE_RANGES.map((price) => (
                  <button
                    key={price.id}
                    onClick={() => onPriceRangeChange(price.id)}
                    className={`
                      w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] transition-all
                      ${
                        priceRange === price.id
                          ? isDark
                            ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                            : "bg-emerald-50 border border-emerald-200 text-emerald-700"
                          : isDark
                            ? "text-gray-400 hover:bg-white/5 hover:text-white border border-transparent"
                            : "text-gray-600 hover:bg-gray-50 border border-transparent"
                      }
                    `}
                  >
                    <DollarSign size={10} className="shrink-0" />
                    <span>{price.label}</span>
                  </button>
                ))}
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
            Garantía 30 días
          </span>
        </div>
        <div
          className={`flex items-center gap-2 px-2 py-1.5 rounded-lg ${isDark ? "bg-amber-500/5" : "bg-amber-50/50"}`}
        >
          <Sparkles size={10} className="text-amber-500" />
          <span
            className={`text-[9px] font-bold ${isDark ? "text-amber-400" : "text-amber-600"}`}
          >
            Soporte Premium
          </span>
        </div>
        <div
          className={`flex items-center gap-2 px-2 py-1.5 rounded-lg ${isDark ? "bg-cyan-500/5" : "bg-cyan-50/50"}`}
        >
          <TrendingUp size={10} className="text-cyan-500" />
          <span
            className={`text-[9px] font-bold ${isDark ? "text-cyan-400" : "text-cyan-600"}`}
          >
            ROI Garantizado
          </span>
        </div>
      </div>
    </div>
  );
}
