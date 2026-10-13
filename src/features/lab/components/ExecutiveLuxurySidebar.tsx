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
} from "@phosphor-icons/react";
import { EstebanzLogo } from "./EstebanzLogo";

export interface ExecutiveLuxurySidebarProps {
  onSearch?: (query: string) => void;
  onCategorySelect?: (categoryId: string) => void;
  onRatingSelect?: (ratingId: string) => void;
  onPriceSelect?: (priceId: string) => void;
  onClearFilters?: () => void;
  onRequestCustomSolution?: () => void;
  className?: string;
}

export function ExecutiveLuxurySidebar({
  onSearch,
  onCategorySelect,
  onRatingSelect,
  onPriceSelect,
  onClearFilters,
  onRequestCustomSolution,
  className = "",
}: ExecutiveLuxurySidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todas");
  const [selectedRating, setSelectedRating] = useState("todas");
  const [selectedPrice, setSelectedPrice] = useState("todos");

  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isRatingOpen, setIsRatingOpen] = useState(true);
  const [isPriceOpen, setIsPriceOpen] = useState(true);

  // Categories with large icons and dedicated palette accents
  const categories = [
    {
      id: "todas",
      label: "Todas",
      count: 3,
      icon: Sparkle,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10 border-cyan-500/30",
      activeGlow: "shadow-[0_0_16px_rgba(34,211,238,0.25)]",
    },
    {
      id: "chats",
      label: "Chats",
      count: 1,
      icon: Chats,
      color: "text-sky-400",
      bg: "bg-sky-500/10 border-sky-500/20",
      activeGlow: "shadow-[0_0_16px_rgba(56,189,248,0.25)]",
    },
    {
      id: "sheets",
      label: "Google Sheets",
      count: 2,
      icon: FileText,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20",
      activeGlow: "shadow-[0_0_16px_rgba(52,211,153,0.25)]",
    },
    {
      id: "slack",
      label: "Slack",
      count: 0,
      icon: SlackLogo,
      color: "text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/20",
      activeGlow: "shadow-[0_0_16px_rgba(251,191,36,0.25)]",
    },
    {
      id: "otros",
      label: "Otros",
      count: 0,
      icon: CirclesFour,
      color: "text-violet-400",
      bg: "bg-violet-500/10 border-violet-500/20",
      activeGlow: "shadow-[0_0_16px_rgba(167,139,250,0.25)]",
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
      className={`w-[310px] sm:w-[330px] shrink-0 bg-[#030610]/95 backdrop-blur-2xl text-white flex flex-col p-4 sm:p-5 select-none font-sans border-r border-slate-800/80 shadow-2xl relative overflow-hidden ${className}`}
    >
      {/* Ambient background glows */}
      <div className="absolute -top-20 -left-20 w-52 h-52 bg-cyan-500/10 blur-[80px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-0 w-60 h-60 bg-blue-600/10 blur-[90px] pointer-events-none rounded-full" />

      {/* 1. Header with Brand & Collapse */}
      <div className="flex items-center justify-between pb-5 relative z-10">
        <div className="flex items-center gap-3 group cursor-pointer">
          <EstebanzLogo size={28} className="group-hover:scale-105 transition-transform" />
          <div className="flex flex-col">
            <span className="text-xs sm:text-sm font-bold tracking-[0.25em] text-white">
              ESTEBANZ
            </span>
            <span className="text-[9px] font-mono tracking-wider text-cyan-400/80">
              CATALOG SUITE
            </span>
          </div>
        </div>
        <button
          type="button"
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

      {/* 3. Search Bar */}
      <div className="pb-4 relative z-10">
        <div className="relative flex items-center bg-[#070e1c] border border-slate-800 rounded-xl px-3 py-2.5 focus-within:border-cyan-400/60 focus-within:shadow-[0_0_15px_rgba(34,211,238,0.15)] transition-all">
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
      <div className="flex-1 overflow-y-auto pr-1 -mr-1 space-y-4 no-scrollbar relative z-10">
        {/* Filter Bar */}
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

        {/* 5. Section: Categorías (Con ICONOS GRANDES 38px) */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            className="w-full flex items-center justify-between text-xs text-slate-300 hover:text-white py-1 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Star size={13} className="text-cyan-400" />
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
                className="space-y-1.5 overflow-hidden"
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
                      className={`relative w-full flex items-center justify-between p-2 rounded-xl text-xs transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? `bg-[#081e36]/90 border border-cyan-500/40 text-cyan-300 font-medium ${cat.activeGlow}`
                          : "text-slate-300 hover:text-white hover:bg-slate-900/60 border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* LARGE ICON CONTAINER (38px) */}
                        <div
                          className={`w-9.5 h-9.5 rounded-xl border flex items-center justify-center shrink-0 transition-transform ${
                            isSelected
                              ? `${cat.bg} scale-105 shadow-md`
                              : "bg-slate-900/80 border-slate-800 text-slate-400"
                          }`}
                        >
                          <Icon size={22} weight={isSelected ? "duotone" : "regular"} className={isSelected ? cat.color : "text-slate-400"} />
                        </div>

                        <div className="flex flex-col text-left">
                          <span className={`text-xs font-semibold ${isSelected ? "text-white" : "text-slate-300"}`}>
                            {cat.label}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {cat.count === 1 ? "1 automatización" : `${cat.count} automatizaciones`}
                          </span>
                        </div>
                      </div>

                      {/* Right Indicator (Radio + Badge) */}
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-md font-mono font-semibold ${
                            isSelected
                              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                              : cat.count > 0
                              ? "text-slate-400 bg-slate-800/60"
                              : "text-slate-600"
                          }`}
                        >
                          {cat.count}
                        </span>
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
                      </div>
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
                          ? "bg-[#081e36]/70 border border-cyan-500/30 text-cyan-300 font-medium"
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
                          ? "bg-[#081e36]/70 border border-cyan-500/30 text-cyan-300 font-medium"
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

      {/* 8. REDESIGNED LUXURY CONCIERGE CTA CARD (Icono grande 48px, botón de alto impacto, composición equilibrada) */}
      <div className="pt-3 relative z-10">
        <div className="rounded-2xl border border-cyan-500/30 bg-linear-to-b from-[#0a182c] via-[#06101f] to-[#030914] p-4 relative overflow-hidden shadow-2xl group">
          {/* Ambient lighting mesh */}
          <div className="absolute -top-6 -right-6 w-28 h-28 bg-cyan-400/20 blur-2xl rounded-full pointer-events-none group-hover:scale-125 transition-transform duration-700" />
          <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-blue-600/15 blur-2xl rounded-full pointer-events-none" />

          {/* Top Row: Large 48px illuminated Icon + Pro Badge */}
          <div className="flex items-center justify-between">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-400/30 blur-md rounded-2xl" />
              <div className="relative w-12 h-12 rounded-2xl bg-linear-to-br from-cyan-400/20 via-cyan-500/10 to-transparent border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.35)]">
                <Crown size={26} weight="duotone" className="drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-[10px] font-bold text-cyan-300 tracking-wider uppercase font-mono">
                CONCIERGE
              </span>
            </div>
          </div>

          {/* Headline & Body Copy */}
          <div className="mt-3.5 space-y-1">
            <h2 className="text-sm font-bold text-white tracking-tight leading-snug">
              ¿Necesitas algo personalizado?
            </h2>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Diseñamos automatizaciones de nivel enterprise adaptadas a los flujos únicos de tu equipo.
            </p>
          </div>

          {/* High-Impact Interactive Button (Replaces the raw link) */}
          <button
            type="button"
            onClick={onRequestCustomSolution}
            className="w-full mt-3.5 px-3.5 py-2.5 rounded-xl bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center justify-between shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all duration-200 group/btn cursor-pointer"
          >
            <span className="tracking-wide">Solicitar una solución</span>
            <div className="w-6 h-6 rounded-lg bg-slate-950/20 flex items-center justify-center group-hover/btn:translate-x-0.5 transition-transform">
              <ArrowRight size={13} weight="bold" />
            </div>
          </button>
        </div>
      </div>
    </aside>
  );
}
