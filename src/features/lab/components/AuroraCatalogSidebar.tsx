"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  CaretDoubleLeft,
  CaretDoubleRight,
  MagnifyingGlass,
  Faders,
  Star,
  CaretDown,
  Chats,
  FileText,
  SlackLogo,
  DotsThreeCircle,
  Tag,
  Crown,
  ArrowRight,
  X,
  Sparkle,
} from "@phosphor-icons/react";
import { EstebanzLogo } from "./EstebanzLogo";

export interface AuroraCatalogSidebarProps {
  onSearch?: (query: string) => void;
  onCategorySelect?: (categoryId: string) => void;
  onRatingSelect?: (ratingId: string) => void;
  onPriceSelect?: (priceId: string) => void;
  onClearFilters?: () => void;
  onRequestCustomSolution?: () => void;
  className?: string;
}

export function AuroraCatalogSidebar({
  onSearch,
  onCategorySelect,
  onRatingSelect,
  onPriceSelect,
  onClearFilters,
  onRequestCustomSolution,
  className = "",
}: AuroraCatalogSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todas");
  const [selectedRating, setSelectedRating] = useState("todas");
  const [selectedPrice, setSelectedPrice] = useState("todos");

  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isRatingOpen, setIsRatingOpen] = useState(true);
  const [isPriceOpen, setIsPriceOpen] = useState(true);

  const categories = [
    { id: "todas", label: "Todas", count: 3, icon: Sparkle },
    { id: "chats", label: "Chats", count: 1, icon: Chats },
    { id: "sheets", label: "Google Sheets", count: 2, icon: FileText },
    { id: "slack", label: "Slack", count: 0, icon: SlackLogo },
    { id: "otros", label: "Otros", count: 0, icon: DotsThreeCircle },
  ];

  const ratings = [
    { id: "todas", label: "Todas las calificaciones", count: 3, stars: 0 },
    { id: "5", label: "5 estrellas", count: 3, stars: 5 },
    { id: "4", label: "4+ estrellas", count: 3, stars: 4 },
    { id: "3", label: "3+ estrellas", count: 3, stars: 3 },
  ];

  const prices = [
    { id: "todos", label: "Todos", count: 3 },
    { id: "gratis", label: "Gratis", count: 0 },
    { id: "1-50", label: "$1 – $50", count: 1 },
    { id: "50-200", label: "$50 – $200", count: 1 },
    { id: "200+", label: "$200+", count: 1 },
  ];

  const handleClearAll = () => {
    setSearchQuery("");
    setSelectedCategory("todas");
    setSelectedRating("todas");
    setSelectedPrice("todos");
    onClearFilters?.();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch?.(e.target.value);
  };

  if (isCollapsed) {
    return (
      <aside
        className={`w-16 shrink-0 bg-[#040811]/90 backdrop-blur-2xl border-r border-slate-800/80 p-3 flex flex-col items-center justify-between text-white transition-all duration-300 ${className}`}
      >
        <div className="flex flex-col items-center gap-5">
          <EstebanzLogo size={28} />
          <button
            type="button"
            onClick={() => setIsCollapsed(false)}
            aria-label="Expandir panel"
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-cyan-500/20 border border-slate-800 hover:border-cyan-500/40 text-slate-400 hover:text-cyan-300 transition-all cursor-pointer"
          >
            <CaretDoubleRight size={14} weight="bold" />
          </button>
        </div>
        <div className="p-2 rounded-xl bg-cyan-950/40 border border-cyan-800/40 text-cyan-400">
          <Crown size={18} weight="bold" />
        </div>
      </aside>
    );
  }

  return (
    <aside
      className={`w-[300px] sm:w-[320px] shrink-0 bg-[#040812]/95 backdrop-blur-2xl text-white flex flex-col p-4 sm:p-5 select-none font-sans border-r border-slate-800/70 shadow-2xl relative overflow-hidden ${className}`}
    >
      {/* Aurora Ambient Glow Layer */}
      <div className="absolute -top-24 -left-24 w-60 h-60 bg-cyan-600/10 blur-[80px] pointer-events-none rounded-full" />
      <div className="absolute top-1/2 -right-24 w-60 h-60 bg-blue-600/10 blur-[90px] pointer-events-none rounded-full" />

      {/* 1. Header with Brand & Collapse */}
      <div className="flex items-center justify-between pb-5 relative z-10">
        <div className="flex items-center gap-2.5 group cursor-pointer">
          <EstebanzLogo size={28} className="group-hover:scale-105 transition-transform" />
          <span className="text-xs sm:text-sm font-bold tracking-[0.24em] text-white">
            ESTEBANZ
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsCollapsed(true)}
          aria-label="Colapsar panel"
          className="text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all p-1.5 rounded-lg cursor-pointer"
        >
          <CaretDoubleLeft size={14} weight="bold" />
        </button>
      </div>

      {/* 2. Catalog Title Area */}
      <div className="pb-4 relative z-10">
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-[9px] font-bold tracking-[0.16em] text-cyan-300 uppercase">
            CATÁLOGO
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
          Automatizaciones
        </h1>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
          Encuentra la solución perfecta para tu flujo de trabajo.
        </p>
      </div>

      {/* 3. Search Bar with Glass effect */}
      <div className="pb-4 relative z-10">
        <div className="relative flex items-center bg-[#081224]/80 border border-slate-800 rounded-xl px-3 py-2.5 focus-within:border-cyan-400/60 focus-within:shadow-[0_0_15px_rgba(34,211,238,0.15)] transition-all">
          <MagnifyingGlass size={16} className="text-slate-400 shrink-0 mr-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Buscar automatizaciones..."
            className="w-full bg-transparent text-xs text-white placeholder-slate-500 outline-none"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                onSearch?.("");
              }}
              className="text-slate-400 hover:text-white p-0.5"
            >
              <X size={12} weight="bold" />
            </button>
          ) : (
            <div className="shrink-0 ml-1.5 px-1.5 py-0.5 rounded bg-slate-800/80 border border-slate-700/60 text-[10px] font-mono text-slate-400">
              ⌘ K
            </div>
          )}
        </div>
      </div>

      {/* Scrollable Filters Container */}
      <div className="flex-1 overflow-y-auto pr-1 -mr-1 space-y-4 no-scrollbar relative z-10">
        {/* 4. Filter Bar */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <Faders size={16} weight="bold" className="text-cyan-400" />
            <span className="text-xs sm:text-sm font-bold text-white">Filtros</span>
          </div>
          <button
            type="button"
            onClick={handleClearAll}
            className="text-[11px] text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer px-1 py-0.5 rounded hover:bg-cyan-500/10"
          >
            Limpiar todo
          </button>
        </div>

        {/* 5. Section: Categoría */}
        <div className="space-y-1.5">
          <button
            type="button"
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            className="w-full flex items-center justify-between text-xs text-slate-300 hover:text-white py-1 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Star size={13} className="text-cyan-400/80" />
              <span className="font-semibold text-xs text-white">Categoría</span>
            </div>
            <motion.div
              animate={{ rotate: isCategoryOpen ? 0 : 180 }}
              transition={{ duration: 0.2 }}
            >
              <CaretDown size={12} className="text-slate-400" />
            </motion.div>
          </button>

          <AnimatePresence initial={false}>
            {isCategoryOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-1 overflow-hidden"
              >
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        onCategorySelect?.(cat.id);
                      }}
                      className={`relative w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? "text-cyan-300 font-medium"
                          : "text-slate-300 hover:text-white hover:bg-slate-900/60"
                      }`}
                    >
                      {/* Active Indicator Background */}
                      {isSelected && (
                        <motion.div
                          layoutId="aurora-cat-indicator"
                          className="absolute inset-0 bg-linear-to-r from-cyan-950/80 to-[#0c243e]/80 border border-cyan-500/40 rounded-xl shadow-[0_0_12px_rgba(34,211,238,0.15)]"
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}

                      <div className="relative z-10 flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                            isSelected
                              ? "border-2 border-cyan-400 bg-cyan-950"
                              : "border border-slate-700 bg-slate-900/60"
                          }`}
                        >
                          {isSelected && (
                            <motion.div
                              layoutId="aurora-radio-dot"
                              className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.9)]"
                            />
                          )}
                        </div>
                        {cat.id !== "todas" && (
                          <Icon size={15} className={isSelected ? "text-cyan-300" : "text-slate-400"} />
                        )}
                        <span className="text-xs">{cat.label}</span>
                      </div>

                      <span
                        className={`relative z-10 text-xs px-1.5 py-0.5 rounded-md font-semibold transition-colors ${
                          isSelected
                            ? "bg-cyan-500/20 text-cyan-300"
                            : cat.count > 0
                            ? "text-slate-400 bg-slate-800/40"
                            : "text-slate-600"
                        }`}
                      >
                        {cat.count}
                      </span>
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 6. Section: Calificación */}
        <div className="space-y-1.5 pt-1">
          <button
            type="button"
            onClick={() => setIsRatingOpen(!isRatingOpen)}
            className="w-full flex items-center justify-between text-xs text-slate-300 hover:text-white py-1 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Star size={13} className="text-amber-400/90" />
              <span className="font-semibold text-xs text-white">Calificación</span>
            </div>
            <motion.div
              animate={{ rotate: isRatingOpen ? 0 : 180 }}
              transition={{ duration: 0.2 }}
            >
              <CaretDown size={12} className="text-slate-400" />
            </motion.div>
          </button>

          <AnimatePresence initial={false}>
            {isRatingOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-1 overflow-hidden"
              >
                {ratings.map((rate) => {
                  const isSelected = selectedRating === rate.id;
                  return (
                    <button
                      key={rate.id}
                      type="button"
                      onClick={() => {
                        setSelectedRating(rate.id);
                        onRatingSelect?.(rate.id);
                      }}
                      className={`relative w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? "text-cyan-300 font-medium"
                          : "text-slate-300 hover:text-white hover:bg-slate-900/60"
                      }`}
                    >
                      {isSelected && (
                        <motion.div
                          layoutId="aurora-rate-indicator"
                          className="absolute inset-0 bg-linear-to-r from-cyan-950/60 to-[#0c243e]/60 border border-cyan-500/30 rounded-xl"
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}

                      <div className="relative z-10 flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                            isSelected
                              ? "border-2 border-cyan-400 bg-cyan-950"
                              : "border border-slate-700 bg-slate-900/60"
                          }`}
                        >
                          {isSelected && (
                            <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.9)]" />
                          )}
                        </div>
                        {rate.stars > 0 && (
                          <Star size={13} weight="fill" className="text-amber-400 shrink-0" />
                        )}
                        <span className="text-xs">{rate.label}</span>
                      </div>

                      <span
                        className={`relative z-10 text-xs px-1.5 py-0.5 rounded-md font-semibold transition-colors ${
                          isSelected
                            ? "bg-cyan-500/20 text-cyan-300"
                            : "text-slate-500"
                        }`}
                      >
                        {rate.count}
                      </span>
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 7. Section: Precio */}
        <div className="space-y-1.5 pt-1">
          <button
            type="button"
            onClick={() => setIsPriceOpen(!isPriceOpen)}
            className="w-full flex items-center justify-between text-xs text-slate-300 hover:text-white py-1 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Tag size={13} className="text-cyan-400/80" />
              <span className="font-semibold text-xs text-white">Precio</span>
            </div>
            <motion.div
              animate={{ rotate: isPriceOpen ? 0 : 180 }}
              transition={{ duration: 0.2 }}
            >
              <CaretDown size={12} className="text-slate-400" />
            </motion.div>
          </button>

          <AnimatePresence initial={false}>
            {isPriceOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-1 overflow-hidden"
              >
                {prices.map((price) => {
                  const isSelected = selectedPrice === price.id;
                  return (
                    <button
                      key={price.id}
                      type="button"
                      onClick={() => {
                        setSelectedPrice(price.id);
                        onPriceSelect?.(price.id);
                      }}
                      className={`relative w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? "text-cyan-300 font-medium"
                          : "text-slate-300 hover:text-white hover:bg-slate-900/60"
                      }`}
                    >
                      {isSelected && (
                        <motion.div
                          layoutId="aurora-price-indicator"
                          className="absolute inset-0 bg-linear-to-r from-cyan-950/60 to-[#0c243e]/60 border border-cyan-500/30 rounded-xl"
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}

                      <div className="relative z-10 flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                            isSelected
                              ? "border-2 border-cyan-400 bg-cyan-950"
                              : "border border-slate-700 bg-slate-900/60"
                          }`}
                        >
                          {isSelected && (
                            <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.9)]" />
                          )}
                        </div>
                        <span className="text-xs">{price.label}</span>
                      </div>

                      <span
                        className={`relative z-10 text-xs px-1.5 py-0.5 rounded-md font-semibold transition-colors ${
                          isSelected
                            ? "bg-cyan-500/20 text-cyan-300"
                            : price.count > 0
                            ? "text-slate-400"
                            : "text-slate-600"
                        }`}
                      >
                        {price.count}
                      </span>
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 8. Bottom CTA Card with Iridescent Shine */}
      <div className="pt-3 relative z-10">
        <motion.div
          whileHover={{ y: -2, scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="rounded-2xl border border-cyan-500/25 bg-linear-to-br from-[#0c182c] via-[#07101e] to-[#041a33] p-4 relative overflow-hidden shadow-xl group"
        >
          {/* Cyan Glow & Radial Aura */}
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-cyan-500/25 blur-2xl rounded-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />
          <div className="absolute top-0 right-0 w-36 h-24 bg-linear-to-bl from-cyan-400/10 via-transparent to-transparent pointer-events-none" />

          {/* Top row with Crown Icon */}
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.3)]">
              <Crown size={17} weight="bold" />
            </div>
            <span className="text-[10px] font-bold text-cyan-400 tracking-wider uppercase px-2 py-0.5 rounded-full bg-cyan-950/70 border border-cyan-800/60">
              PRO
            </span>
          </div>

          {/* Copy */}
          <h2 className="text-xs font-bold text-white mt-3 group-hover:text-cyan-200 transition-colors">
            ¿Necesitas algo personalizado?
          </h2>
          <p className="text-[11px] text-slate-400 mt-1 leading-snug">
            Creamos automatizaciones a medida para tu equipo.
          </p>

          {/* Action Link */}
          <button
            type="button"
            onClick={onRequestCustomSolution}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors inline-flex items-center gap-1.5 mt-3 group/link cursor-pointer"
          >
            <span>Solicitar una solución</span>
            <ArrowRight
              size={12}
              weight="bold"
              className="group-hover/link:translate-x-1 transition-transform"
            />
          </button>
        </motion.div>
      </div>
    </aside>
  );
}
