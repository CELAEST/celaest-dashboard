"use client";

import React, { useState } from "react";
import {
  CaretDoubleLeft,
  MagnifyingGlass,
  Faders,
  Star,
  CaretUp,
  CaretDown,
  Chats,
  FileText,
  SlackLogo,
  DotsThreeCircle,
  Tag,
  Crown,
  ArrowRight,
} from "@phosphor-icons/react";
import { EstebanzLogo } from "./EstebanzLogo";

export interface IdenticalCatalogSidebarProps {
  onSearch?: (query: string) => void;
  onCategorySelect?: (categoryId: string) => void;
  onRatingSelect?: (ratingId: string) => void;
  onPriceSelect?: (priceId: string) => void;
  onClearFilters?: () => void;
  onRequestCustomSolution?: () => void;
  className?: string;
}

export function IdenticalCatalogSidebar({
  onSearch,
  onCategorySelect,
  onRatingSelect,
  onPriceSelect,
  onClearFilters,
  onRequestCustomSolution,
  className = "",
}: IdenticalCatalogSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todas");
  const [selectedRating, setSelectedRating] = useState("todas");
  const [selectedPrice, setSelectedPrice] = useState("todos");

  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isRatingOpen, setIsRatingOpen] = useState(true);
  const [isPriceOpen, setIsPriceOpen] = useState(true);

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

  return (
    <aside
      className={`w-[290px] sm:w-[310px] shrink-0 bg-[#040811] text-white flex flex-col p-4 sm:p-5 select-none font-sans border-r border-slate-900/80 ${className}`}
    >
      {/* 1. Header with Brand & Collapse */}
      <div className="flex items-center justify-between pb-6">
        <div className="flex items-center gap-2.5">
          <EstebanzLogo size={26} />
          <span className="text-xs sm:text-sm font-bold tracking-[0.24em] text-white">
            ESTEBANZ
          </span>
        </div>
        <button
          type="button"
          aria-label="Colapsar panel"
          className="text-slate-500 hover:text-slate-300 transition-colors p-1 rounded-md"
        >
          <CaretDoubleLeft size={14} weight="bold" />
        </button>
      </div>

      {/* 2. Catalog & Title Section */}
      <div className="pb-4">
        <span className="text-[10px] font-bold tracking-[0.18em] text-slate-500 uppercase block">
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
      <div className="pb-5">
        <div className="relative flex items-center bg-[#091120] border border-slate-800/80 rounded-xl px-3 py-2 focus-within:border-cyan-500/50 transition-colors">
          <MagnifyingGlass size={16} className="text-slate-400 shrink-0 mr-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Buscar automatizaciones..."
            className="w-full bg-transparent text-xs text-white placeholder-slate-500 outline-none"
          />
          <div className="shrink-0 ml-1.5 px-1.5 py-0.5 rounded bg-slate-800/80 border border-slate-700/60 text-[10px] font-mono text-slate-400">
            ⌘ K
          </div>
        </div>
      </div>

      {/* Scrollable Filters Container */}
      <div className="flex-1 overflow-y-auto pr-1 -mr-1 space-y-4 no-scrollbar">
        {/* 4. Filters Header */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <Faders size={16} weight="bold" className="text-white" />
            <span className="text-xs sm:text-sm font-bold text-white">Filtros</span>
          </div>
          <button
            type="button"
            onClick={handleClearAll}
            className="text-[11px] text-slate-500 hover:text-cyan-400 transition-colors cursor-pointer"
          >
            Limpiar todo
          </button>
        </div>

        {/* 5. Section: Categoría */}
        <div className="space-y-1.5">
          <button
            type="button"
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            className="w-full flex items-center justify-between text-xs text-slate-300 hover:text-white py-1 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Star size={13} className="text-slate-400" />
              <span className="font-semibold text-xs text-white">Categoría</span>
            </div>
            {isCategoryOpen ? (
              <CaretUp size={12} className="text-slate-400" />
            ) : (
              <CaretDown size={12} className="text-slate-400" />
            )}
          </button>

          {isCategoryOpen && (
            <div className="space-y-1 pt-0.5">
              {/* Todas (Active Highlighted) */}
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("todas");
                  onCategorySelect?.("todas");
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                  selectedCategory === "todas"
                    ? "bg-[#081e36]/80 border border-cyan-500/40 text-cyan-400"
                    : "hover:bg-slate-900/60 text-slate-300"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full border-2 border-cyan-400 flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 rounded-full bg-cyan-400" />
                  </div>
                  <span className="font-medium text-xs">Todas</span>
                </div>
                <span className="text-xs font-semibold">3</span>
              </button>

              {/* Chats */}
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("chats");
                  onCategorySelect?.("chats");
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                  selectedCategory === "chats"
                    ? "bg-[#081e36]/80 border border-cyan-500/40 text-cyan-400"
                    : "hover:bg-slate-900/60 text-slate-300"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Chats size={16} className="text-slate-400 shrink-0" />
                  <span className="text-xs">Chats</span>
                </div>
                <span className="text-xs text-slate-500">1</span>
              </button>

              {/* Google Sheets */}
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("sheets");
                  onCategorySelect?.("sheets");
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                  selectedCategory === "sheets"
                    ? "bg-[#081e36]/80 border border-cyan-500/40 text-cyan-400"
                    : "hover:bg-slate-900/60 text-slate-300"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FileText size={16} className="text-slate-400 shrink-0" />
                  <span className="text-xs">Google Sheets</span>
                </div>
                <span className="text-xs text-slate-500">2</span>
              </button>

              {/* Slack */}
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("slack");
                  onCategorySelect?.("slack");
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                  selectedCategory === "slack"
                    ? "bg-[#081e36]/80 border border-cyan-500/40 text-cyan-400"
                    : "hover:bg-slate-900/60 text-slate-300"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <SlackLogo size={16} className="text-slate-400 shrink-0" />
                  <span className="text-xs">Slack</span>
                </div>
                <span className="text-xs text-slate-500">0</span>
              </button>

              {/* Otros */}
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("otros");
                  onCategorySelect?.("otros");
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                  selectedCategory === "otros"
                    ? "bg-[#081e36]/80 border border-cyan-500/40 text-cyan-400"
                    : "hover:bg-slate-900/60 text-slate-300"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <DotsThreeCircle size={16} className="text-slate-400 shrink-0" />
                  <span className="text-xs">Otros</span>
                </div>
                <span className="text-xs text-slate-500">0</span>
              </button>
            </div>
          )}
        </div>

        {/* 6. Section: Calificación */}
        <div className="space-y-1.5 pt-1">
          <button
            type="button"
            onClick={() => setIsRatingOpen(!isRatingOpen)}
            className="w-full flex items-center justify-between text-xs text-slate-300 hover:text-white py-1 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Star size={13} className="text-slate-400" />
              <span className="font-semibold text-xs text-white">Calificación</span>
            </div>
            {isRatingOpen ? (
              <CaretUp size={12} className="text-slate-400" />
            ) : (
              <CaretDown size={12} className="text-slate-400" />
            )}
          </button>

          {isRatingOpen && (
            <div className="space-y-1 pt-0.5">
              {/* Todas las calificaciones */}
              <button
                type="button"
                onClick={() => {
                  setSelectedRating("todas");
                  onRatingSelect?.("todas");
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                  selectedRating === "todas"
                    ? "text-cyan-400 font-medium"
                    : "text-slate-300 hover:bg-slate-900/60"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                      selectedRating === "todas"
                        ? "border-2 border-cyan-400"
                        : "border border-slate-700"
                    }`}
                  >
                    {selectedRating === "todas" && (
                      <div className="w-2 h-2 rounded-full bg-cyan-400" />
                    )}
                  </div>
                  <span className="text-xs">Todas las calificaciones</span>
                </div>
                <span className="text-xs text-slate-500">3</span>
              </button>

              {/* 5 estrellas */}
              <button
                type="button"
                onClick={() => {
                  setSelectedRating("5");
                  onRatingSelect?.("5");
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                  selectedRating === "5"
                    ? "text-cyan-400 font-medium"
                    : "text-slate-300 hover:bg-slate-900/60"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                      selectedRating === "5"
                        ? "border-2 border-cyan-400"
                        : "border border-slate-700"
                    }`}
                  >
                    {selectedRating === "5" && (
                      <div className="w-2 h-2 rounded-full bg-cyan-400" />
                    )}
                  </div>
                  <Star size={13} weight="fill" className="text-amber-400 shrink-0" />
                  <span className="text-xs">5 estrellas</span>
                </div>
                <span className="text-xs text-slate-500">3</span>
              </button>

              {/* 4+ estrellas */}
              <button
                type="button"
                onClick={() => {
                  setSelectedRating("4");
                  onRatingSelect?.("4");
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                  selectedRating === "4"
                    ? "text-cyan-400 font-medium"
                    : "text-slate-300 hover:bg-slate-900/60"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                      selectedRating === "4"
                        ? "border-2 border-cyan-400"
                        : "border border-slate-700"
                    }`}
                  >
                    {selectedRating === "4" && (
                      <div className="w-2 h-2 rounded-full bg-cyan-400" />
                    )}
                  </div>
                  <Star size={13} weight="fill" className="text-amber-400 shrink-0" />
                  <span className="text-xs">4+ estrellas</span>
                </div>
                <span className="text-xs text-slate-500">3</span>
              </button>

              {/* 3+ estrellas */}
              <button
                type="button"
                onClick={() => {
                  setSelectedRating("3");
                  onRatingSelect?.("3");
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                  selectedRating === "3"
                    ? "text-cyan-400 font-medium"
                    : "text-slate-300 hover:bg-slate-900/60"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                      selectedRating === "3"
                        ? "border-2 border-cyan-400"
                        : "border border-slate-700"
                    }`}
                  >
                    {selectedRating === "3" && (
                      <div className="w-2 h-2 rounded-full bg-cyan-400" />
                    )}
                  </div>
                  <Star size={13} weight="fill" className="text-amber-400 shrink-0" />
                  <span className="text-xs">3+ estrellas</span>
                </div>
                <span className="text-xs text-slate-500">3</span>
              </button>
            </div>
          )}
        </div>

        {/* 7. Section: Precio */}
        <div className="space-y-1.5 pt-1">
          <button
            type="button"
            onClick={() => setIsPriceOpen(!isPriceOpen)}
            className="w-full flex items-center justify-between text-xs text-slate-300 hover:text-white py-1 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Tag size={13} className="text-slate-400" />
              <span className="font-semibold text-xs text-white">Precio</span>
            </div>
            {isPriceOpen ? (
              <CaretUp size={12} className="text-slate-400" />
            ) : (
              <CaretDown size={12} className="text-slate-400" />
            )}
          </button>

          {isPriceOpen && (
            <div className="space-y-1 pt-0.5">
              {/* Todos */}
              <button
                type="button"
                onClick={() => {
                  setSelectedPrice("todos");
                  onPriceSelect?.("todos");
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                  selectedPrice === "todos"
                    ? "text-cyan-400 font-medium"
                    : "text-slate-300 hover:bg-slate-900/60"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                      selectedPrice === "todos"
                        ? "border-2 border-cyan-400"
                        : "border border-slate-700"
                    }`}
                  >
                    {selectedPrice === "todos" && (
                      <div className="w-2 h-2 rounded-full bg-cyan-400" />
                    )}
                  </div>
                  <span className="text-xs">Todos</span>
                </div>
                <span className="text-xs text-slate-500">3</span>
              </button>

              {/* Gratis */}
              <button
                type="button"
                onClick={() => {
                  setSelectedPrice("gratis");
                  onPriceSelect?.("gratis");
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                  selectedPrice === "gratis"
                    ? "text-cyan-400 font-medium"
                    : "text-slate-300 hover:bg-slate-900/60"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                      selectedPrice === "gratis"
                        ? "border-2 border-cyan-400"
                        : "border border-slate-700"
                    }`}
                  >
                    {selectedPrice === "gratis" && (
                      <div className="w-2 h-2 rounded-full bg-cyan-400" />
                    )}
                  </div>
                  <span className="text-xs">Gratis</span>
                </div>
                <span className="text-xs text-slate-500">0</span>
              </button>

              {/* $1 - $50 */}
              <button
                type="button"
                onClick={() => {
                  setSelectedPrice("1-50");
                  onPriceSelect?.("1-50");
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                  selectedPrice === "1-50"
                    ? "text-cyan-400 font-medium"
                    : "text-slate-300 hover:bg-slate-900/60"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                      selectedPrice === "1-50"
                        ? "border-2 border-cyan-400"
                        : "border border-slate-700"
                    }`}
                  >
                    {selectedPrice === "1-50" && (
                      <div className="w-2 h-2 rounded-full bg-cyan-400" />
                    )}
                  </div>
                  <span className="text-xs">$1 – $50</span>
                </div>
                <span className="text-xs text-slate-500">1</span>
              </button>

              {/* $50 - $200 */}
              <button
                type="button"
                onClick={() => {
                  setSelectedPrice("50-200");
                  onPriceSelect?.("50-200");
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                  selectedPrice === "50-200"
                    ? "text-cyan-400 font-medium"
                    : "text-slate-300 hover:bg-slate-900/60"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                      selectedPrice === "50-200"
                        ? "border-2 border-cyan-400"
                        : "border border-slate-700"
                    }`}
                  >
                    {selectedPrice === "50-200" && (
                      <div className="w-2 h-2 rounded-full bg-cyan-400" />
                    )}
                  </div>
                  <span className="text-xs">$50 – $200</span>
                </div>
                <span className="text-xs text-slate-500">1</span>
              </button>

              {/* $200+ */}
              <button
                type="button"
                onClick={() => {
                  setSelectedPrice("200+");
                  onPriceSelect?.("200+");
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                  selectedPrice === "200+"
                    ? "text-cyan-400 font-medium"
                    : "text-slate-300 hover:bg-slate-900/60"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                      selectedPrice === "200+"
                        ? "border-2 border-cyan-400"
                        : "border border-slate-700"
                    }`}
                  >
                    {selectedPrice === "200+" && (
                      <div className="w-2 h-2 rounded-full bg-cyan-400" />
                    )}
                  </div>
                  <span className="text-xs">$200+</span>
                </div>
                <span className="text-xs text-slate-500">1</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 8. Bottom CTA Card */}
      <div className="pt-3">
        <div className="rounded-2xl border border-slate-800/80 bg-linear-to-br from-[#0c1424] via-[#070e1b] to-[#05162a] p-4 relative overflow-hidden shadow-lg">
          {/* Subtle cyan glow in bottom right corner */}
          <div className="absolute -bottom-8 -right-8 w-28 h-28 bg-cyan-500/15 blur-2xl rounded-full pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-24 h-16 bg-linear-to-tl from-cyan-500/10 to-transparent pointer-events-none" />

          {/* Crown badge */}
          <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/90">
            <Crown size={16} weight="bold" />
          </div>

          {/* Copy */}
          <h2 className="text-xs font-semibold text-white mt-3">
            ¿Necesitas algo personalizado?
          </h2>
          <p className="text-[11px] text-slate-400 mt-1 leading-snug">
            Creamos automatizaciones a medida para tu equipo.
          </p>

          {/* Action Link */}
          <button
            type="button"
            onClick={onRequestCustomSolution}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors inline-flex items-center gap-1.5 mt-2.5 group cursor-pointer"
          >
            <span>Solicitar una solución</span>
            <ArrowRight
              size={12}
              weight="bold"
              className="group-hover:translate-x-0.5 transition-transform"
            />
          </button>
        </div>
      </div>
    </aside>
  );
}
