import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Check, Download } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

interface ROIHeaderProps {
  isFilterOpen: boolean;
  setIsFilterOpen: (isOpen: boolean) => void;
  selectedFilter: string;
  setSelectedFilter: (filter: string) => void;
  filterOptions: { value: string; label: string }[];
}

export const ROIHeader = React.memo(
  ({
    isFilterOpen,
    setIsFilterOpen,
    selectedFilter,
    setSelectedFilter,
    filterOptions,
  }: ROIHeaderProps) => {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
      <div className="flex items-center justify-between">
        <div>
          <h1
            className={`text-4xl font-bold tracking-tight mb-2 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            ROI Analytics - Global View
          </h1>
          <p
            className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            Métricas agregadas de todos los usuarios • Detectando tendencias de
            uso
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all duration-300 outline-none ${
                isDark
                  ? "bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20"
                  : "bg-blue-500/10 border border-blue-500/20 text-blue-600 hover:bg-blue-500/20"
              }`}
              aria-haspopup="true"
              aria-expanded={isFilterOpen}
              aria-label="Filtrar por periodo de tiempo"
            >
              <span>
                {
                  filterOptions.find((opt) => opt.value === selectedFilter)
                    ?.label
                }
              </span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-300 ${
                  isFilterOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {isFilterOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsFilterOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={`absolute right-0 top-full mt-2 w-56 rounded-xl border shadow-xl overflow-hidden z-50 ${
                      isDark
                        ? "bg-black/90 border-cyan-500/20 backdrop-blur-xl"
                        : "bg-white border-blue-100"
                    }`}
                    role="menu"
                  >
                    <div className="p-1.5 flex flex-col gap-0.5">
                      {filterOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSelectedFilter(option.value);
                            setIsFilterOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                            selectedFilter === option.value
                              ? isDark
                                ? "bg-cyan-500/10 text-cyan-400"
                                : "bg-blue-50 text-blue-600"
                              : isDark
                                ? "text-gray-400 hover:bg-white/5 hover:text-white"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          }`}
                          role="menuitem"
                        >
                          {option.label}
                          {selectedFilter === option.value && (
                            <Check className="w-4 h-4" />
                          )}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
          <button
            className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-2 ${
              isDark
                ? "bg-linear-to-r from-cyan-400 to-blue-500 text-white shadow-lg shadow-cyan-500/50"
                : "bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
            }`}
            aria-label="Exportar reporte de analítica"
          >
            <Download className="w-4 h-4" />
            Exportar Reporte
          </button>
        </div>
      </div>
    );
  },
);

ROIHeader.displayName = "ROIHeader";
