import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { useErrorMonitoring } from "@/features/errors/hooks/useErrorMonitoring";
import { ErrorStats } from "./ErrorStats";
import { ErrorList } from "./ErrorList";
import { ErrorAnalytics } from "./ErrorAnalytics";

const ErrorMonitoring: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [activeTab, setActiveTab] = React.useState<"overview" | "logs">("logs");

  const {
    isAdmin,
    expandedError,
    toggleErrorExpansion,
    updateTaskStatus,
    filteredErrors,
    stats,
    platformDistribution,
  } = useErrorMonitoring();

  return (
    <div className="h-full flex flex-col gap-4 p-4 min-h-0 overflow-hidden">
      {/* Simplified Header - Titles and Tabs only */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="shrink-0 flex justify-between items-center"
      >
        <div>
          <h1
            className={`text-2xl font-bold tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}
          >
            Monitor de Errores
          </h1>
          <p
            className={`${isDark ? "text-gray-400" : "text-gray-500"} text-xs font-black uppercase tracking-widest`}
          >
            Live Mission Control
          </p>
        </div>

        <div
          className={`flex p-1 rounded-lg border ${isDark ? "bg-white/5 border-white/10" : "bg-gray-100 border-gray-200"}`}
        >
          <button
            onClick={() => setActiveTab("logs")}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === "logs" ? (isDark ? "bg-white/10 text-white shadow-sm" : "bg-white text-gray-900 shadow-sm") : isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"}`}
          >
            Live Logs
          </button>
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === "overview" ? (isDark ? "bg-white/10 text-white shadow-sm" : "bg-white text-gray-900 shadow-sm") : isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"}`}
          >
            Overview
          </button>
        </div>
      </motion.div>

      {/* Content Area - Maximized */}
      <div className="flex-1 min-h-0 relative">
        <AnimatePresence mode="wait">
          {activeTab === "overview" ? (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="h-full flex flex-col gap-5 overflow-hidden"
            >
              {/* Top Row: Core 4 Stats */}
              <ErrorStats stats={stats} />

              {/* Symmetric Analytics Row */}
              <ErrorAnalytics data={platformDistribution} />
            </motion.div>
          ) : (
            <motion.div
              key="logs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full"
            >
              {/* Error Logs List - 100% Height gain from removed local filters */}
              <div className="h-full overflow-hidden rounded-2xl border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-black/20 backdrop-blur-sm">
                <ErrorList
                  errors={filteredErrors}
                  expandedError={expandedError}
                  toggleErrorExpansion={toggleErrorExpansion}
                  onStatusUpdate={updateTaskStatus}
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
