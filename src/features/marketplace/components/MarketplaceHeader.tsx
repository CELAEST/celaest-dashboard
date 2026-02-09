"use client";

import React from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { useMarketplaceStore } from "../store";

export const MarketplaceHeader: React.FC = () => {
  const { filters, setFilters, search } = useMarketplaceStore();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    search();
  };

  return (
    <div className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl">
          Marketplace <span className="text-blue-500">CELAEST</span>
        </h1>
        <p className="mt-2 text-lg text-white/50">
          Explora soluciones premium diseñadas para potenciar tu organización.
        </p>
      </div>

      <div className="flex w-full max-w-md items-center gap-3">
        <form onSubmit={handleSearch} className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Buscar productos..."
            className="h-12 w-full rounded-xl border border-white/10 bg-black/40 pl-11 pr-4 text-sm text-white placeholder-white/30 backdrop-blur-md transition-all focus:border-blue-500/50 focus:bg-black/60 focus:ring-4 focus:ring-blue-500/10"
            value={filters.q || ""}
            onChange={(e) => setFilters({ q: e.target.value })}
          />
        </form>

        <button className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-black/40 text-white backdrop-blur-md transition-all hover:bg-white/5 active:scale-95">
          <SlidersHorizontal className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};
