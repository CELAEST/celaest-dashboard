import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Pulse,
  SquaresFour,
  WarningOctagon,
  MagnifyingGlass,
} from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useTranslations } from "next-intl";
import { useErrorMonitoring } from "@/features/errors/hooks/useErrorMonitoring";
import { ErrorStats } from "./ErrorStats";
import { ErrorList } from "./ErrorList";
import { ErrorAnalytics } from "./ErrorAnalytics";
import { useErrorStore } from "../stores/useErrorStore";

const ErrorMonitoring: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const t = useTranslations("error_monitor");
  const { errorFilters, setErrorFilters } = useErrorStore();
  const [activeTab, setActiveTab] = React.useState<"overview" | "logs">("logs");

  const {
    isAdmin,
    isLoading,
    expandedError,
    toggleErrorExpansion,
    updateTaskStatus,
    filteredErrors,
    hasActiveFilters,
    clearFilters,
    stats,
    platformDistribution,
    searchQuery,
    setSearchQuery,
  } = useErrorMonitoring();

  const tabSwitcher = (
    <div
      className={`w-full sm:w-auto grid grid-cols-2 sm:flex sm:items-center p-0.5 rounded-xl sm:rounded-lg border ${
        isDark
          ? "bg-white/5 border-white/6"
          : "bg-gray-100 border-gray-200"
      }`}
    >
      <button
        type="button"
        onClick={() => setActiveTab("logs")}
        className={`flex-1 sm:flex-none justify-center px-3 py-1.5 sm:py-1 rounded-lg sm:rounded-md text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 transition-all cursor-pointer ${
          activeTab === "logs"
            ? isDark
              ? "bg-white text-black shadow-xs"
              : "bg-white text-gray-900 shadow-xs"
            : isDark
              ? "text-gray-400 hover:text-white"
              : "text-gray-500 hover:text-gray-700"
        }`}
      >
        <Pulse size={12} />
        {t("live_logs")}
      </button>
      <button
        type="button"
        onClick={() => setActiveTab("overview")}
        className={`flex-1 sm:flex-none justify-center px-3 py-1.5 sm:py-1 rounded-lg sm:rounded-md text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 transition-all cursor-pointer ${
          activeTab === "overview"
            ? isDark
              ? "bg-white text-black shadow-xs"
              : "bg-white text-gray-900 shadow-xs"
            : isDark
              ? "text-gray-400 hover:text-white"
              : "text-gray-500 hover:text-gray-700"
        }`}
      >
        <SquaresFour size={12} />
        {t("overview")}
      </button>
    </div>
  );

  return (
    <div className="h-full flex flex-col min-h-0 overflow-hidden font-sans">
      {/* Sleek luxury header — space-saving, pure contrast (CELAEST Obsidian Standard) */}
      <header
        className={`shrink-0 px-3.5 sm:px-6 py-2.5 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 border-b backdrop-blur-xl transition-colors duration-200 ${
          isDark ? "bg-[#09090b]/80 border-white/6" : "bg-white/80 border-gray-200/80"
        }`}
      >
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 border transition-colors ${
              isDark
                ? "bg-white/[0.04] border-white/8 text-white/70"
                : "bg-gray-100 border-gray-200 text-gray-700"
            }`}
          >
            <WarningOctagon size={15} />
          </div>
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <h1
              className={`text-xs sm:text-base font-semibold tracking-tight truncate ${
                isDark ? "text-zinc-100" : "text-gray-900"
              }`}
            >
              {t("error_monitor_title")}
            </h1>
            <span
              className={`text-[9px] sm:text-[11px] font-mono tracking-wider uppercase border-l pl-2 sm:pl-3 truncate ${
                isDark ? "border-white/10 text-white/40" : "border-gray-200 text-gray-400"
              }`}
            >
              {t("error_monitor_subtitle")}
            </span>
          </div>
        </div>

        {/* Tab switcher: Live Logs / Overview */}
        <div className="w-full sm:w-auto">
          {tabSwitcher}
        </div>
      </header>

      {/* Content Area - Maximized */}
      <div className="flex-1 min-h-0 relative p-2 sm:p-4 overflow-hidden flex flex-col">
        <AnimatePresence mode="wait">
          {activeTab === "overview" ? (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="h-full flex flex-col gap-4 overflow-y-auto md:overflow-hidden no-scrollbar"
            >
              {/* Top Row: Core 4 Stats */}
              <ErrorStats stats={stats} />

              {/* Symmetric Analytics Row */}
              <div className="hidden md:block flex-1 min-h-0 overflow-hidden">
                <ErrorAnalytics data={platformDistribution} />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="logs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col gap-2.5 sm:gap-3 min-h-0"
            >
              {/* Controles de Búsqueda y Filtros Unificados (Executive Stream) */}
              <div
                className={`shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 p-2.5 sm:p-3.5 rounded-xl border ${
                  isDark
                    ? "bg-[#080c14]/90 border-white/8"
                    : "bg-white border-gray-200 shadow-xs"
                }`}
              >
                <div className="relative flex-1 sm:max-w-md w-full">
                  <MagnifyingGlass
                    size={14}
                    className={`absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${
                      isDark ? "text-white/40" : "text-gray-400"
                    }`}
                  />
                  <input
                    type="text"
                    placeholder="Buscar errores, código, usuario..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-8.5 ${searchQuery ? "pr-8" : "pr-4"} h-9 rounded-xl text-xs font-mono transition-all outline-none border ${
                      isDark
                        ? "bg-black/40 border-white/10 text-white placeholder:text-white/30 focus:border-white/30"
                        : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-gray-400"
                    }`}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-xs transition-colors cursor-pointer ${
                        isDark ? "text-white/40 hover:text-white hover:bg-white/10" : "text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                      }`}
                      aria-label="Limpiar búsqueda"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="w-full sm:w-auto overflow-x-auto no-scrollbar flex items-center gap-2 py-0.5">
                  {/* Severidad */}
                  <div
                    className={`inline-flex items-center p-0.5 rounded-lg border text-[10px] sm:text-[11px] font-mono shrink-0 ${
                      isDark ? "bg-white/[0.02] border-white/8" : "bg-gray-100 border-gray-200"
                    }`}
                  >
                    {(["all", "critical", "warning"] as const).map((sev) => {
                      const isActive = errorFilters.severity === sev;
                      return (
                        <button
                          key={sev}
                          type="button"
                          onClick={() => setErrorFilters({ ...errorFilters, severity: sev })}
                          className={`px-2 sm:px-2.5 py-1 rounded-md uppercase tracking-wider transition-all cursor-pointer shrink-0 ${
                            isActive
                              ? isDark
                                ? "bg-white/10 text-white font-semibold"
                                : "bg-white text-gray-900 font-semibold shadow-xs"
                              : isDark
                                ? "text-white/40 hover:text-white"
                                : "text-gray-500 hover:text-gray-800"
                          }`}
                        >
                          {sev === "all" ? "Todas" : sev === "critical" ? "Crítico" : "Advertencia"}
                        </button>
                      );
                    })}
                  </div>

                  <div className="w-px h-3.5 bg-white/10 shrink-0" />

                  {/* Estado */}
                  <div
                    className={`inline-flex items-center p-0.5 rounded-lg border text-[10px] sm:text-[11px] font-mono shrink-0 ${
                      isDark ? "bg-white/[0.02] border-white/8" : "bg-gray-100 border-gray-200"
                    }`}
                  >
                    {(["all", "failed", "reviewing", "resolved"] as const).map((st) => {
                      const isActive = errorFilters.status === st;
                      return (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setErrorFilters({ ...errorFilters, status: st })}
                          className={`px-2 sm:px-2.5 py-1 rounded-md uppercase tracking-wider transition-all cursor-pointer shrink-0 ${
                            isActive
                              ? isDark
                                ? "bg-white/10 text-white font-semibold"
                                : "bg-white text-gray-900 font-semibold shadow-xs"
                              : isDark
                                ? "text-white/40 hover:text-white"
                                : "text-gray-500 hover:text-gray-800"
                          }`}
                        >
                          {st === "all" ? "Todos" : st === "failed" ? "Fallido" : st === "reviewing" ? "Revisión" : "Resuelto"}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Stream Table Area - 100% Flex-Height Chain */}
              <div
                className={`flex-1 min-h-0 overflow-hidden rounded-xl sm:rounded-2xl border ${
                  isDark
                    ? "bg-[#080c14]/40 border-white/8"
                    : "bg-white border-gray-200 shadow-sm"
                }`}
              >
                <ErrorList
                  errors={filteredErrors}
                  isLoading={isLoading}
                  hasActiveFilters={hasActiveFilters}
                  expandedError={expandedError}
                  toggleErrorExpansion={toggleErrorExpansion}
                  onStatusUpdate={updateTaskStatus}
                  onClearFilters={clearFilters}
                  isAdmin={isAdmin}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ErrorMonitoring;

