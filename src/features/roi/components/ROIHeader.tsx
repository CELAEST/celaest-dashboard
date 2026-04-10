import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { CaretDown, Check, DownloadSimple, ArrowClockwise } from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { PageBanner } from "@/components/layout/PageLayout";

interface ROIHeaderProps {
  isFilterOpen: boolean;
  setIsFilterOpen: (isOpen: boolean) => void;
  selectedFilter: string;
  setSelectedFilter: (filter: string) => void;
  filterOptions: { value: string; label: string }[];
  activeTab: "overview" | "insights";
  setActiveTab: (tab: "overview" | "insights") => void;
  onRefresh: () => void;
  onExport: () => void;
  isLoading: boolean;
  isSuperAdmin: boolean;
}

export const ROIHeader = React.memo(
  ({
    isFilterOpen,
    setIsFilterOpen,
    selectedFilter,
    setSelectedFilter,
    filterOptions,
    activeTab,
    setActiveTab,
    onRefresh,
    onExport,
    isLoading,
    isSuperAdmin,
  }: ROIHeaderProps) => {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
      <div className="shrink-0 flex flex-col">
        <PageBanner
          title={isSuperAdmin ? "ROI Analytics - Global View" : "ROI Analytics - My Analytics"}
          subtitle="Métricas agregadas • Detectando tendencias"
          actions={
            <div className="flex items-center gap-2">
              {/* TAB SWITCHER */}
              <div
                className={`flex items-center p-1 rounded-xl border shadow-inner ${
                  isDark
                    ? "bg-black/40 backdrop-blur-xl border-white/10"
                    : "bg-gray-100 border-gray-200"
                }`}
              >
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all duration-200 ${
                    activeTab === "overview"
                      ? isDark
                        ? "bg-white/10 text-white shadow-sm ring-1 ring-white/10"
                        : "bg-white text-gray-900 shadow-sm ring-1 ring-black/5"
                      : isDark
                        ? "text-gray-400 hover:text-white hover:bg-white/5"
                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  Overview
                </button>
                {isSuperAdmin && (
                  <button
                    onClick={() => setActiveTab("insights")}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all duration-200 ${
                      activeTab === "insights"
                        ? isDark
                          ? "bg-white/10 text-white shadow-sm ring-1 ring-white/10"
                          : "bg-white text-gray-900 shadow-sm ring-1 ring-black/5"
                        : isDark
                          ? "text-gray-400 hover:text-white hover:bg-white/5"
                          : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    Deep Insights
                  </button>
                )}
              </div>

              {/* TIME FILTER DROPDOWN */}
              <div className="relative">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 outline-none border ${
                    isDark
                      ? "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20"
                      : "bg-white border-gray-200 text-gray-700 hover:border-gray-300 shadow-sm"
                  }`}
                  aria-haspopup="true"
                  aria-expanded={isFilterOpen}
                  aria-label="Filtrar por periodo de tiempo"
                >
                  <span>
                    {filterOptions.find((opt) => opt.value === selectedFilter)?.label}
                  </span>
                  <CaretDown
                    size={14}
                    className={`transition-transform duration-200 ${
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
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className={`absolute right-0 top-full mt-2 w-48 rounded-xl border shadow-xl overflow-hidden z-50 ${
                          isDark
                            ? "bg-black/90 border-white/10 backdrop-blur-xl"
                            : "bg-white border-gray-200 shadow-lg"
                        }`}
                        role="menu"
                      >
                        <div className="p-1 flex flex-col">
                          {filterOptions.map((option) => (
                            <button
                              key={option.value}
                              onClick={() => {
                                setSelectedFilter(option.value);
                                setIsFilterOpen(false);
                              }}
                              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
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
                                <Check size={13} />
                              )}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* REFRESH */}
              <button
                onClick={onRefresh}
                className={`p-1.5 rounded-xl transition-all duration-200 border ${
                  isDark
                    ? "bg-white/5 border-white/8 hover:bg-white/10 hover:border-white/20 text-gray-400 hover:text-white"
                    : "bg-white border-gray-200 hover:border-gray-300 text-gray-500 hover:text-gray-900 shadow-sm"
                }`}
                aria-label="Refrescar datos"
                disabled={isLoading}
              >
                <ArrowClockwise
                  size={16}
                  className={isLoading ? "animate-spin" : ""}
                />
              </button>

              {/* EXPORT */}
              <button
                onClick={onExport}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                  isDark
                    ? "bg-linear-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25 hover:shadow-cyan-500/40"
                    : "bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 hover:shadow-blue-500/35"
                }`}
                aria-label="Exportar reporte de analítica"
              >
                <DownloadSimple size={15} weight="bold" />
                Exportar Reporte
              </button>
            </div>
          }
        />
      </div>
    );
  },
);

ROIHeader.displayName = "ROIHeader";
