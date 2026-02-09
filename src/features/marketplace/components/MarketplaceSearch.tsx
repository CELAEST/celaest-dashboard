"use client";

import React, { forwardRef } from "react";
import { Search, Filter } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { useMarketplaceProducts } from "../hooks/useMarketplaceProducts";

export const MarketplaceSearch = React.memo(
  forwardRef<HTMLDivElement>(function MarketplaceSearch(_, ref) {
    const { theme } = useTheme();
    const { filters, searchWithDebounce, refresh } = useMarketplaceProducts();
    const isDark = theme === "dark";

    const handleSearchClick = () => {
      refresh();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        refresh();
      }
    };

    return (
      <div
        ref={ref}
        className={`
          relative py-4 mb-8
          transition-all duration-300 px-4 md:px-20 lg:px-60
        `}
      >
        <div className="w-full">
          <div
            className={`
              flex items-center gap-3 p-2 rounded-2xl transition-all
              ${
                isDark
                  ? "bg-[#0a0a0a] border border-white/10 shadow-2xl"
                  : "bg-white border border-gray-200 shadow-2xl"
              }
            `}
          >
            <Search
              className={`ml-4 ${isDark ? "text-gray-500" : "text-gray-400"}`}
              size={20}
            />
            <input
              type="text"
              placeholder="¿Qué necesitas automatizar hoy?"
              defaultValue={filters.q || ""}
              onChange={(e) => searchWithDebounce(e.target.value)}
              onKeyDown={handleKeyDown}
              className={`
                flex-1 bg-transparent border-none outline-none text-sm
                ${
                  isDark
                    ? "text-white placeholder-gray-500"
                    : "text-gray-900 placeholder-gray-400"
                }
              `}
            />
            <button
              className={`
                hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all
                ${
                  isDark
                    ? "bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }
              `}
            >
              <Filter size={16} />
              Filtros
            </button>
            <button
              onClick={handleSearchClick}
              className={`
                px-6 py-2.5 rounded-xl font-medium text-sm transition-all
                ${
                  isDark
                    ? "bg-cyan-500 text-black hover:bg-cyan-400"
                    : "bg-gray-900 text-white hover:bg-gray-800"
                }
              `}
            >
              Buscar
            </button>
          </div>
        </div>
      </div>
    );
  }),
);
