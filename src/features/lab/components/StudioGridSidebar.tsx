"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  CaretDoubleLeft,
  MagnifyingGlass,
  Faders,
  Star,
  CaretDown,
  Chats,
  FileText,
  SlackLogo,
  CirclesFour,
  Tag,
  Crown,
  ArrowRight,
  Sparkle,
  X,
  Lightning,
} from "@phosphor-icons/react";
import { EstebanzLogo } from "./EstebanzLogo";

export interface StudioGridSidebarProps {
  onSearch?: (query: string) => void;
  onCategorySelect?: (categoryId: string) => void;
  onRatingSelect?: (ratingId: string) => void;
  onPriceSelect?: (priceId: string) => void;
  onClearFilters?: () => void;
  onRequestCustomSolution?: () => void;
  className?: string;
}

export function StudioGridSidebar({
  onSearch,
  onCategorySelect,
  onRatingSelect,
  onPriceSelect,
  onClearFilters,
  onRequestCustomSolution,
  className = "",
}: StudioGridSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todas");
  const [selectedRating, setSelectedRating] = useState("todas");
  const [selectedPrice, setSelectedPrice] = useState("todos");

  const [isRatingOpen, setIsRatingOpen] = useState(true);
  const [isPriceOpen, setIsPriceOpen] = useState(true);

  // Large Visual Tiles for Categories
  const categories = [
    {
      id: "todas",
      label: "Todas",
      count: 3,
      icon: Sparkle,
      colSpan: "col-span-2",
      accent: "from-cyan-500/20 to-blue-600/10",
      activeBorder: "border-cyan-400",
      iconColor: "text-cyan-400",
      glow: "shadow-[0_0_20px_rgba(34,211,238,0.25)]",
    },
    {
      id: "chats",
      label: "Chats",
      count: 1,
      icon: Chats,
      colSpan: "col-span-1",
      accent: "from-sky-500/15 to-indigo-600/10",
      activeBorder: "border-sky-400",
      iconColor: "text-sky-400",
      glow: "shadow-[0_0_15px_rgba(56,189,248,0.2)]",
    },
    {
      id: "sheets",
      label: "Google Sheets",
      count: 2,
      icon: FileText,
      colSpan: "col-span-1",
      accent: "from-emerald-500/15 to-teal-600/10",
      activeBorder: "border-emerald-400",
      iconColor: "text-emerald-400",
      glow: "shadow-[0_0_15px_rgba(52,211,153,0.2)]",
    },
    {
      id: "slack",
      label: "Slack",
      count: 0,
      icon: SlackLogo,
      colSpan: "col-span-1",
      accent: "from-amber-500/15 to-rose-600/10",
      activeBorder: "border-amber-400",
      iconColor: "text-amber-400",
      glow: "shadow-[0_0_15px_rgba(251,191,36,0.2)]",
    },
    {
      id: "otros",
      label: "Otros",
      count: 0,
      icon: CirclesFour,
      colSpan: "col-span-1",
      accent: "from-violet-500/15 to-fuchsia-600/10",
      activeBorder: "border-violet-400",
      iconColor: "text-violet-400",
      glow: "shadow-[0_0_15px_rgba(167,139,250,0.2)]",
    },
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

  return (
    <aside
      className={`w-[310px] sm:w-[330px] shrink-0 bg-[#02050e] text-white flex flex-col p-4 sm:p-5 select-none font-sans border-r border-slate-800/80 shadow-2xl relative overflow-hidden ${className}`}
    >
      {/* 1. Header with Brand & Collapse */}
      <div className="flex items-center justify-between pb-5 border-b border-slate-900/90">
        <div className="flex items-center gap-2.5 group cursor-pointer">
          <EstebanzLogo size={28} />
          <span className="text-xs sm:text-sm font-bold tracking-[0.25em] text-white">
            ESTEBANZ
          </span>
        </div>
        <button
          type="button"
          aria-label="Colapsar panel"
          className="text-slate-500 hover:text-white p-1 rounded-md transition-colors"
        >
          <CaretDoubleLeft size={14} weight="bold" />
        </button>
      </div>

      {/* 2. Catalog Title Area */}
      <div className="py-4">
        <span className="text-[10px] font-bold tracking-[0.2em] text-cyan-400 uppercase block">
          CATÁLOGO OFICIAL
        </span>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-0.5">
          Automatizaciones
        </h1>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
          Encuentra la solución perfecta para tu flujo de trabajo.
        </p>
      </div>

      {/* 3. Search Bar */}
      <div className="pb-4">
        <div className="relative flex items-center bg-[#070d1a] border border-slate-800/90 rounded-xl px-3 py-2.5 focus-within:border-cyan-500/60 transition-colors">
          <MagnifyingGlass size={16} className="text-slate-400 shrink-0 mr-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              onSearch?.(e.target.value);
            }}
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
      <div className="flex-1 overflow-y-auto pr-1 -mr-1 space-y-4 no-scrollbar">
        {/* Filters Top Bar */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <Faders size={16} weight="bold" className="text-cyan-400" />
            <span className="text-xs sm:text-sm font-bold text-white">Filtros</span>
          </div>
          <button
            type="button"
            onClick={handleClearAll}
            className="text-[11px] text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
          >
            Limpiar todo
          </button>
        </div>

        {/* 5. VISUAL GRID OF CATEGORIES (Grandes Iconos de 26-28px en Tiles interactivos) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-300 py-0.5">
            <div className="flex items-center gap-2">
              <Star size={13} className="text-cyan-400" />
              <span className="font-semibold text-xs text-white">Categoría</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Selección Rápida</span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
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
                  className={`group relative ${cat.colSpan} p-3 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? `bg-linear-to-br ${cat.accent} ${cat.activeBorder} ${cat.glow}`
                      : "bg-[#060c18] border-slate-800/80 hover:border-slate-700 hover:bg-[#081224]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* LARGE ICON (26px) */}
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform ${
                        isSelected
                          ? "bg-slate-950/60 scale-105 shadow-inner"
                          : "bg-slate-900/80 group-hover:scale-105"
                      }`}
                    >
                      <Icon size={24} weight={isSelected ? "fill" : "regular"} className={isSelected ? cat.iconColor : "text-slate-400"} />
                    </div>

                    <div className="flex flex-col text-left">
                      <span className={`text-xs font-bold leading-tight ${isSelected ? "text-white" : "text-slate-300"}`}>
                        {cat.label}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {cat.count} disp.
                      </span>
                    </div>
                  </div>

                  {/* Corner Selected Indicator */}
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,1)] shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 6. Section: Calificación */}
        <div className="space-y-1.5 pt-2">
          <button
            type="button"
            onClick={() => setIsRatingOpen(!isRatingOpen)}
            className="w-full flex items-center justify-between text-xs text-slate-300 hover:text-white py-1 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Star size={13} className="text-amber-400" />
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
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                        isSelected
                          ? "bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-medium"
                          : "text-slate-300 hover:bg-slate-900/60"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                            isSelected
                              ? "border-2 border-cyan-400 bg-cyan-950"
                              : "border border-slate-700 bg-slate-900/50"
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
                      <span className="text-xs text-slate-500 font-mono">{rate.count}</span>
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
              <Tag size={13} className="text-cyan-400" />
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
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                        isSelected
                          ? "bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-medium"
                          : "text-slate-300 hover:bg-slate-900/60"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                            isSelected
                              ? "border-2 border-cyan-400 bg-cyan-950"
                              : "border border-slate-700 bg-slate-900/50"
                          }`}
                        >
                          {isSelected && (
                            <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.9)]" />
                          )}
                        </div>
                        <span className="text-xs">{price.label}</span>
                      </div>
                      <span className="text-xs text-slate-500 font-mono">{price.count}</span>
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 8. REDESIGNED HORIZONTAL LUXURY HERO CTA (Medallón de Corona 52px con gran presencia visual) */}
      <div className="pt-3">
        <div className="rounded-2xl border border-slate-800 bg-linear-to-b from-[#081326] via-[#050c18] to-[#030710] p-4 relative overflow-hidden shadow-2xl group">
          {/* Cyan/amber dual glow aura */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/15 blur-2xl rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/10 blur-xl rounded-full pointer-events-none" />

          <div className="relative z-10 flex items-start gap-3.5">
            {/* 52px OVERSIZED LUXURY CROWN MEDALLION */}
            <div className="relative shrink-0">
              <div className="absolute inset-0 bg-cyan-400/25 blur-lg rounded-2xl animate-pulse" />
              <div className="relative w-13 h-13 rounded-2xl bg-linear-to-br from-cyan-400/20 via-cyan-900/40 to-slate-950 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-[0_0_24px_rgba(34,211,238,0.4)]">
                <Crown size={28} weight="fill" className="text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.9)]" />
              </div>
            </div>

            {/* Content Column */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 text-cyan-400 text-[10px] font-bold tracking-wider uppercase font-mono mb-1">
                <Lightning size={12} weight="fill" />
                <span>SOLUCIÓN A MEDIDA</span>
              </div>
              <h2 className="text-xs font-bold text-white tracking-tight leading-snug">
                ¿Necesitas algo personalizado?
              </h2>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Creamos automatizaciones exactas para tu flujo.
              </p>
            </div>
          </div>

          {/* Direct Action Button */}
          <button
            type="button"
            onClick={onRequestCustomSolution}
            className="w-full mt-3.5 px-3 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 hover:text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer group/btn"
          >
            <span>Solicitar una solución</span>
            <ArrowRight size={13} weight="bold" className="group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </aside>
  );
}
