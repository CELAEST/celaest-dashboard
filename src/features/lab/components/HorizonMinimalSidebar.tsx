"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  CaretDoubleLeft,
  MagnifyingGlass,
  SlidersHorizontal,
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
  ShieldCheck,
} from "@phosphor-icons/react";
import { EstebanzLogo } from "./EstebanzLogo";

export interface HorizonMinimalSidebarProps {
  onSearch?: (query: string) => void;
  onCategorySelect?: (categoryId: string) => void;
  onRatingSelect?: (ratingId: string) => void;
  onPriceSelect?: (priceId: string) => void;
  onClearFilters?: () => void;
  onRequestCustomSolution?: () => void;
  className?: string;
}

export function HorizonMinimalSidebar({
  onSearch,
  onCategorySelect,
  onRatingSelect,
  onPriceSelect,
  onClearFilters,
  onRequestCustomSolution,
  className = "",
}: HorizonMinimalSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todas");
  const [selectedRating, setSelectedRating] = useState("todas");
  const [selectedPrice, setSelectedPrice] = useState("todos");

  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isRatingOpen, setIsRatingOpen] = useState(true);
  const [isPriceOpen, setIsPriceOpen] = useState(true);

  // Large elegant category icons
  const categories = [
    { id: "todas", label: "Todas las soluciones", count: 3, icon: Sparkle },
    { id: "chats", label: "Chats & Asistentes", count: 1, icon: Chats },
    { id: "sheets", label: "Google Sheets & Docs", count: 2, icon: FileText },
    { id: "slack", label: "Slack & Canales", count: 0, icon: SlackLogo },
    { id: "otros", label: "Otras integraciones", count: 0, icon: CirclesFour },
  ];

  const ratings = [
    { id: "todas", label: "Todas las calificaciones", count: 3, stars: 0 },
    { id: "5", label: "5 estrellas", count: 3, stars: 5 },
    { id: "4", label: "4+ estrellas", count: 3, stars: 4 },
    { id: "3", label: "3+ estrellas", count: 3, stars: 3 },
  ];

  const prices = [
    { id: "todos", label: "Todos los rangos", count: 3 },
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
      className={`w-[310px] sm:w-[330px] shrink-0 bg-[#05070e] text-white flex flex-col p-4 sm:p-5 select-none font-sans border-r border-slate-800/80 shadow-2xl relative overflow-hidden ${className}`}
    >
      {/* 1. Header with Brand & Collapse */}
      <div className="flex items-center justify-between pb-5 border-b border-slate-900/80">
        <div className="flex items-center gap-2.5">
          <EstebanzLogo size={28} />
          <span className="text-xs sm:text-sm font-bold tracking-[0.22em] text-white">
            ESTEBANZ
          </span>
        </div>
        <button
          type="button"
          aria-label="Colapsar"
          className="text-slate-500 hover:text-white p-1 rounded-md transition-colors"
        >
          <CaretDoubleLeft size={14} weight="bold" />
        </button>
      </div>

      {/* 2. Catalog Title Area */}
      <div className="py-4">
        <span className="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase block">
          CATÁLOGO
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
        <div className="relative flex items-center bg-[#090d18] border border-slate-800 rounded-xl px-3 py-2.5 focus-within:border-cyan-500/60 transition-colors">
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
            <SlidersHorizontal size={15} weight="bold" className="text-cyan-400" />
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

        {/* 5. Section: Categorías (Con Iconos Grandes 26px y contenedores de 36px) */}
        <div className="space-y-1.5">
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
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? "bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-medium shadow-[0_0_12px_rgba(34,211,238,0.15)]"
                          : "text-slate-300 hover:text-white hover:bg-slate-900/50 border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* LARGE ICON (24-26px) IN SQUIRCLE */}
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                            isSelected
                              ? "bg-cyan-500/20 border-cyan-400/40 text-cyan-300"
                              : "bg-slate-900/80 border-slate-800 text-slate-400"
                          }`}
                        >
                          <Icon size={20} weight={isSelected ? "duotone" : "regular"} />
                        </div>
                        <span className="text-xs">{cat.label}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-md font-mono ${
                            isSelected
                              ? "bg-cyan-500/20 text-cyan-300 font-bold"
                              : "text-slate-500"
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

      {/* 8. REDESIGNED BESPOKE CONCIERGE BANNER (Icono 48px con marco armónico que cuadra 100% con el layout) */}
      <div className="pt-3">
        <div className="rounded-2xl border border-slate-800/90 bg-linear-to-b from-[#091426] via-[#050d1a] to-[#020610] p-4 relative overflow-hidden shadow-xl">
          <div className="flex items-center gap-3.5">
            {/* 48px Illuminated Crown Icon */}
            <div className="relative shrink-0">
              <div className="absolute inset-0 bg-cyan-400/20 blur-md rounded-2xl" />
              <div className="relative w-12 h-12 rounded-2xl bg-cyan-950/60 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-md">
                <Crown size={24} weight="duotone" className="drop-shadow-[0_0_8px_rgba(34,211,238,0.7)]" />
              </div>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1 text-[10px] font-bold text-cyan-400 uppercase tracking-wider font-mono">
                <ShieldCheck size={12} weight="bold" />
                <span>SOLUCIÓN VIP</span>
              </div>
              <h2 className="text-xs font-bold text-white mt-0.5 truncate">
                ¿Automatización a medida?
              </h2>
              <p className="text-[10px] text-slate-400 leading-tight mt-0.5">
                Construida para tu equipo.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onRequestCustomSolution}
            className="w-full mt-3 px-3 py-2 rounded-xl bg-linear-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-cyan-500/20 transition-all cursor-pointer group"
          >
            <span>Solicitar propuesta</span>
            <ArrowRight size={12} weight="bold" className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </aside>
  );
}
