import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Pulse, SquaresFour, ShieldWarning } from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useTranslations } from "next-intl";
import { useErrorMonitoring } from "@/features/errors/hooks/useErrorMonitoring";
import { ErrorStats } from "./ErrorStats";
import { ErrorList } from "./ErrorList";
import { ErrorAnalytics } from "./ErrorAnalytics";
import { PageBanner } from "@/components/layout/PageLayout";
import { HeaderFilterPill } from "@/features/shared/components/Header/HeaderFilterPill";
import { useErrorStore } from "../stores/useErrorStore";

const ErrorMonitoring: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const t = useTranslations("error_monitor");
  const tHeader = useTranslations("header");
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
  } = useErrorMonitoring();

  const tabSwitcher = (
    <div
      className={`flex items-center p-0.5 rounded-lg ${
        isDark
          ? "bg-white/5 border border-white/5"
          : "bg-gray-100 border border-gray-200"
      }`}
    >
      <button
        onClick={() => setActiveTab("logs")}
        className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 transition-all ${
          activeTab === "logs"
            ? isDark
              ? "bg-cyan-500/15 text-cyan-400"
              : "bg-white text-blue-600 shadow-sm"
            : isDark
              ? "text-gray-500 hover:text-gray-300"
              : "text-gray-500 hover:text-gray-700"
        }`}
      >
        <Pulse size={12} />
        {t("live_logs")}
      </button>
      <button
        onClick={() => setActiveTab("overview")}
        className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 transition-all ${
          activeTab === "overview"
            ? isDark
              ? "bg-purple-500/15 text-purple-400"
              : "bg-white text-purple-600 shadow-sm"
            : isDark
              ? "text-gray-500 hover:text-gray-300"
              : "text-gray-500 hover:text-gray-700"
        }`}
      >
        <SquaresFour size={12} />
        {t("overview")}
      </button>
    </div>
  );

  return (
    <div className="h-full flex flex-col min-h-0 overflow-hidden">
      <PageBanner
        title={t("error_monitor_title")}
        subtitle={t("error_monitor_subtitle")}
        titleAside={
          <div className="flex justify-start overflow-x-auto w-full max-w-full pb-1 -mb-1 no-scrollbar">
            {tabSwitcher}
          </div>
        }
      />

      {/* Content Area - Maximized */}
      <div className="flex-1 min-h-0 relative px-3 pb-3">
        <AnimatePresence mode="wait">
          {activeTab === "overview" ? (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="h-full flex flex-col gap-4 overflow-y-auto md:overflow-hidden custom-scrollbar"
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
              className="h-full flex flex-col gap-3"
            >
              {/* Mobile Filter Controls */}
              <div className="flex md:hidden items-center gap-2 overflow-x-auto pb-1 -mb-1 no-scrollbar shrink-0">
                <HeaderFilterPill
                  icon={ShieldWarning}
                  options={[
                    { value: "all", label: tHeader("all_severity") },
                    { value: "critical", label: tHeader("critical") },
                    { value: "warning", label: tHeader("warning") },
                  ]}
                  value={errorFilters.severity}
                  onChange={(val) =>
                    setErrorFilters({ ...errorFilters, severity: val })
                  }
                />
                <HeaderFilterPill
                  icon={Pulse}
                  options={[
                    { value: "all", label: tHeader("all_status") },
                    { value: "failed", label: tHeader("failed") },
                    { value: "reviewing", label: tHeader("reviewing") },
                    { value: "resolved", label: tHeader("resolved") },
                    { value: "ignored", label: tHeader("ignored") },
                  ]}
                  value={errorFilters.status}
                  onChange={(val) =>
                    setErrorFilters({ ...errorFilters, status: val })
                  }
                />
              </div>

              {/* Error Logs List - 100% Height gain from removed local filters */}
              <div className="flex-1 min-h-0 overflow-hidden rounded-2xl border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-black/20 backdrop-blur-sm">
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
