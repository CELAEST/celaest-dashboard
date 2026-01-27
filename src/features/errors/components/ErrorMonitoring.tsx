"use client";

import React from "react";
import { motion } from "motion/react";
import { Bell, Download } from "lucide-react";
import { useErrorMonitoring } from "@/features/errors/hooks/useErrorMonitoring";
import { ErrorStats } from "./ErrorStats";
import { ErrorFilters } from "./ErrorFilters";
import { ErrorList } from "./ErrorList";

const ErrorMonitoring: React.FC = () => {
  // We already get theme context inside the hook, but we need isDark here for the header
  // Actually the hook returns isDark.
  const {
    isDark,
    isAdmin,
    selectedSeverity,
    setSelectedSeverity,
    selectedStatus,
    setSelectedStatus,
    searchQuery,
    setSearchQuery,
    expandedError,
    toggleErrorExpansion,
    filteredErrors,
    stats,
  } = useErrorMonitoring();

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-end mb-6"
      >
        <div>
          <h1
            className={`text-3xl font-bold mb-2 tracking-tight ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Error Monitoring System
          </h1>
          <p
            className={`${isDark ? "text-gray-400" : "text-gray-500"} text-sm`}
          >
            Sistema de alerta temprana • Detección proactiva de fallos críticos
          </p>
        </div>

        <div className="flex gap-3">
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 border ${
              isDark
                ? "bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border-cyan-500/30 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                : "bg-white hover:bg-gray-50 text-blue-600 border-gray-200 shadow-sm"
            }`}
          >
            <Bell size={16} />
            Configurar Alertas
          </button>

          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 border ${
              isDark
                ? "bg-white/5 hover:bg-white/10 text-white border-white/10"
                : "bg-white hover:bg-gray-50 text-gray-700 border-gray-200 shadow-sm"
            }`}
          >
            <Download size={16} />
            Exportar Logs
          </button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <ErrorStats stats={stats} />

      {/* Filters */}
      <ErrorFilters
        selectedSeverity={selectedSeverity}
        setSelectedSeverity={setSelectedSeverity}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        resultCount={filteredErrors.length}
      />

      {/* Error Logs List */}
      <ErrorList
        errors={filteredErrors}
        expandedError={expandedError}
        toggleErrorExpansion={toggleErrorExpansion}
        isAdmin={isAdmin}
      />
    </div>
  );
};

export default ErrorMonitoring;
