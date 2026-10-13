"use client";

import React, { useState } from "react";
import {
  CaretDoubleLeft,
  MagnifyingGlass,
  Sliders,
  Star,
  Chats,
  FileText,
  SlackLogo,
  DotsThreeCircle,
  Crown,
  ArrowRight,
  Check,
  ArrowsClockwise,
} from "@phosphor-icons/react";
import { EstebanzLogo } from "./EstebanzLogo";

export interface TacticalCatalogSidebarProps {
  onSearch?: (query: string) => void;
  onCategorySelect?: (categoryId: string) => void;
  onRatingSelect?: (ratingId: string) => void;
  onPriceSelect?: (priceId: string) => void;
  onClearFilters?: () => void;
  onRequestCustomSolution?: () => void;
  className?: string;
}

export function TacticalCatalogSidebar({
  onSearch,
  onCategorySelect,
  onRatingSelect,
  onPriceSelect,
  onClearFilters,
  onRequestCustomSolution,
  className = "",
}: TacticalCatalogSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todas");
  const [selectedRating, setSelectedRating] = useState("todas");
  const [selectedPrice, setSelectedPrice] = useState("todos");

  const categories = [
    { id: "todas", label: "Todas", count: 3, dotColor: "bg-cyan-400" },
    { id: "chats", label: "Chats", count: 1, icon: Chats, dotColor: "bg-indigo-400" },
    { id: "sheets", label: "Google Sheets", count: 2, icon: FileText, dotColor: "bg-emerald-400" },
    { id: "slack", label: "Slack", count: 0, icon: SlackLogo, dotColor: "bg-amber-400" },
    { id: "otros", label: "Otros", count: 0, icon: DotsThreeCircle, dotColor: "bg-slate-400" },
  ];

  const ratings = [
    { id: "todas", label: "Todas", count: 3 },
    { id: "5", label: "5.0", count: 3, stars: 5 },
    { id: "4", label: "4.0+", count: 3, stars: 4 },
    { id: "3", label: "3.0+", count: 3, stars: 3 },
  ];

  const pricePresets = [
    { id: "todos", label: "Todos" },
    { id: "gratis", label: "Gratis" },
    { id: "1-50", label: "$1-50" },
    { id: "50-200", label: "$50-200" },
    { id: "200+", label: "$200+" },
  ];

  const handleReset = () => {
    setSearchQuery("");
    setSelectedCategory("todas");
    setSelectedRating("todas");
    setSelectedPrice("todos");
    onClearFilters?.();
  };

  return (
    <aside
      className={`w-[290px] sm:w-[310px] shrink-0 bg-[#02050b] text-white flex flex-col p-4 select-none font-mono border-r border-slate-800/90 ${className}`}
    >
      {/* 1. Header with Brand & Status */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-900">
        <div className="flex items-center gap-2">
          <EstebanzLogo size={24} />
          <div className="flex flex-col">
            <span className="text-xs font-bold tracking-[0.2em] text-white font-sans">
              ESTEBANZ
            </span>
            <span className="text-[9px] text-cyan-400/90 font-mono tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping inline-block" />
              SYSTEM.ACTIVE
            </span>
          </div>
        </div>
        <button
          type="button"
          aria-label="Colapsar"
          className="p-1.5 rounded-md text-slate-500 hover:text-slate-300 hover:bg-slate-900 transition-colors"
        >
          <CaretDoubleLeft size={13} weight="bold" />
        </button>
      </div>

      {/* 2. Catalog Title Area */}
      <div className="py-3.5">
        <div className="text-[9px] font-bold tracking-widest text-slate-500 uppercase">
          {"// CATALOG_V2"}
        </div>
        <h1 className="text-lg font-bold tracking-tight text-white font-sans mt-0.5">
          Automatizaciones
        </h1>
        <p className="text-[11px] text-slate-400 font-sans mt-1 leading-normal">
          Encuentra la solución perfecta para tu flujo de trabajo.
        </p>
      </div>

      {/* 3. Search Bar with Cyber look */}
      <div className="pb-3.5">
        <div className="relative flex items-center bg-[#070e1b] border border-slate-800 rounded-lg px-2.5 py-2 focus-within:border-cyan-500/70 transition-colors">
          <MagnifyingGlass size={14} className="text-slate-500 shrink-0 mr-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              onSearch?.(e.target.value);
            }}
            placeholder="Buscar..."
            className="w-full bg-transparent text-xs text-white placeholder-slate-600 outline-none font-sans"
          />
          <span className="shrink-0 text-[10px] text-slate-500 bg-slate-900 border border-slate-800 px-1 py-0.5 rounded font-mono">
            /
          </span>
        </div>
      </div>

      {/* Filters Area */}
      <div className="flex-1 overflow-y-auto pr-1 -mr-1 space-y-4 no-scrollbar">
        {/* Filter Title Bar */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5">
            <Sliders size={14} className="text-cyan-400" />
            <span className="text-xs font-bold text-slate-300 font-sans tracking-wide">
              FILTROS ACTIVOS
            </span>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="text-[10px] text-slate-500 hover:text-cyan-300 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <ArrowsClockwise size={11} />
            <span>Reset</span>
          </button>
        </div>

        {/* Section: Categorías */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase block">
            [01] Categoría
          </span>
          <div className="space-y-1 pt-0.5">
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
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-sans transition-all cursor-pointer ${
                    isSelected
                      ? "bg-cyan-950/60 border border-cyan-500/50 text-cyan-300 font-semibold"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${cat.dotColor} shrink-0`} />
                    {Icon && <Icon size={14} className="text-slate-500 shrink-0" />}
                    <span>{cat.label}</span>
                  </div>
                  <span className="text-[11px] font-mono opacity-70">
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section: Calificación */}
        <div className="space-y-1 pt-1">
          <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase block">
            [02] Calificación
          </span>
          <div className="grid grid-cols-2 gap-1.5 pt-0.5 font-sans">
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
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                    isSelected
                      ? "bg-cyan-950/70 border border-cyan-500/50 text-cyan-300"
                      : "bg-[#060c18] border border-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    {rate.stars ? (
                      <Star size={11} weight="fill" className="text-amber-400 shrink-0" />
                    ) : (
                      <Check size={11} className="text-cyan-400 shrink-0" />
                    )}
                    <span>{rate.label}</span>
                  </div>
                  <span className="text-[10px] text-slate-600 font-mono">
                    {rate.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section: Precio Presets */}
        <div className="space-y-1 pt-1">
          <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase block">
            [03] Rango de Precio
          </span>
          <div className="flex flex-wrap gap-1 pt-0.5 font-sans">
            {pricePresets.map((price) => {
              const isSelected = selectedPrice === price.id;
              return (
                <button
                  key={price.id}
                  type="button"
                  onClick={() => {
                    setSelectedPrice(price.id);
                    onPriceSelect?.(price.id);
                  }}
                  className={`px-2 py-1 rounded-md text-[11px] font-mono transition-all cursor-pointer ${
                    isSelected
                      ? "bg-cyan-400 text-slate-950 font-bold shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                      : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  {price.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 8. Bottom CTA Card */}
      <div className="pt-3">
        <div className="rounded-xl border border-slate-800 bg-[#060c18] p-3 relative overflow-hidden font-sans">
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-cyan-950/80 border border-cyan-800/60 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
              <Crown size={15} weight="bold" />
            </div>
            <div>
              <h2 className="text-xs font-semibold text-white">
                ¿Algo personalizado?
              </h2>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                Automatizaciones a medida para tu equipo.
              </p>
              <button
                type="button"
                onClick={onRequestCustomSolution}
                className="text-[11px] font-medium text-cyan-400 hover:text-cyan-300 transition-colors inline-flex items-center gap-1 mt-2 cursor-pointer font-mono"
              >
                <span>&gt; Solicitar solución</span>
                <ArrowRight size={10} weight="bold" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
