import React from "react";
import { motion } from "motion/react";
import { Filter, Search } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { SettingsSelect } from "@/features/settings/components/SettingsSelect";
import {
  ErrorSeverity,
  ErrorStatus,
} from "@/features/errors/hooks/useErrorMonitoring";

interface ErrorFiltersProps {
  selectedSeverity: ErrorSeverity | "all";
  setSelectedSeverity: (severity: ErrorSeverity | "all") => void;
  selectedStatus: ErrorStatus | "all";
  setSelectedStatus: (status: ErrorStatus | "all") => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  resultCount: number;
}

export const ErrorFilters = React.memo(
  ({
    selectedSeverity,
    setSelectedSeverity,
    selectedStatus,
    setSelectedStatus,
    searchQuery,
    setSearchQuery,
    resultCount,
  }: ErrorFiltersProps) => {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className={`backdrop-blur-xl border rounded-2xl p-6 space-y-4 relative z-20 ${
          isDark
            ? "bg-[#0a0a0a]/60 border-white/5"
            : "bg-white border-gray-200 shadow-sm"
        }`}
      >
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Filter
              size={16}
              className={isDark ? "text-gray-400" : "text-gray-500"}
            />
            <span
              className={`text-sm font-medium ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Filtros Activos
            </span>
          </div>
          <span
            className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}
          >
            {resultCount} resultado
            {resultCount !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <SettingsSelect
              options={[
                { value: "all", label: "Todas las Severidades" },
                { value: "critical", label: "Crítico" },
                { value: "warning", label: "Warning" },
                { value: "info", label: "Info" },
              ]}
              value={selectedSeverity}
              onChange={(val: string) =>
                setSelectedSeverity(val as ErrorSeverity | "all")
              }
              placeholder="Severidad"
            />
          </div>

          <div className="relative">
            <SettingsSelect
              options={[
                { value: "all", label: "Todos los Estados" },
                { value: "new", label: "Nuevo" },
                { value: "reviewing", label: "En Revisión" },
                { value: "resolved", label: "Resuelto" },
                { value: "ignored", label: "Ignorado" },
              ]}
              value={selectedStatus}
              onChange={(val: string) =>
                setSelectedStatus(val as ErrorStatus | "all")
              }
              placeholder="Estado"
            />
          </div>

          <div className="relative group h-full">
            <Search
              size={16}
              className={`absolute left-4 top-[1.15rem] transition-colors z-10 ${
                isDark
                  ? "text-gray-500 group-focus-within:text-cyan-400"
                  : "text-gray-400 group-focus-within:text-cyan-500"
              }`}
            />
            <input
              type="text"
              placeholder="Buscar por código..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full h-full pl-11 pr-4 py-3 rounded-xl text-md border outline-none transition-all duration-300 ${
                isDark
                  ? "bg-[#0d0d0d] border-white/10 text-white placeholder-gray-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50"
                  : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50"
              }`}
            />
          </div>
        </div>
      </motion.div>
    );
  },
);

ErrorFilters.displayName = "ErrorFilters";
