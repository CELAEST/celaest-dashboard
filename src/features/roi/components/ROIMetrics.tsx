"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { useROIMetrics } from "@/features/roi/hooks/useROIMetrics";
import { ROIHeader } from "./ROIHeader";
import { ROISummaryCards } from "./ROISummaryCards";
import { TimeSavedChart } from "./TimeSavedChart";
import { TaskCompletionChart } from "./TaskCompletionChart";
import { TopTemplates } from "./TopTemplates";
import { ZombieUsers } from "./ZombieUsers";

export const ROIMetrics: React.FC = () => {
  const {
    timeRange,
    setTimeRange,
    isFilterOpen,
    setIsFilterOpen,
    selectedFilter,
    setSelectedFilter,
    filterOptions,
    metrics,
    topTemplates,
    zombieUsers,
    timeSavedData,
    monthlyData,
    refresh,
    isLoading,
    exportReport,
    isSuperAdmin,
  } = useROIMetrics();

  const [activeTab, setActiveTab] = React.useState<"overview" | "insights">(
    "overview",
  );

  return (
    <div className="h-full flex flex-col overflow-hidden min-h-0">
      {/* Header (Fixed) */}
      <ROIHeader
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        filterOptions={filterOptions}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onRefresh={refresh}
        onExport={exportReport}
        isLoading={isLoading}
        isSuperAdmin={isSuperAdmin}
      />

      {/* Content Area */}
      <div className="flex-1 min-h-0 relative px-3 pb-3">
        <AnimatePresence mode="wait">
          {activeTab === "overview" ? (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="h-full flex flex-col gap-4"
            >
              {/* Metrics Cards - Compact Row */}
              <div className="shrink-0">
                <ROISummaryCards metrics={metrics} />
              </div>

              {/* Charts Section - Fills remaining space */}
              <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-4">
                <TimeSavedChart
                  data={timeSavedData}
                  timeRange={timeRange}
                  setTimeRange={setTimeRange}
                />
                <TaskCompletionChart data={monthlyData} />
              </div>
            </motion.div>
          ) : isSuperAdmin ? (
            <motion.div
              key="insights"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="h-full grid grid-cols-1 lg:grid-cols-2 gap-4"
            >
              {/* Admin Insights - Split 50/50 */}
              <div className="h-full min-h-0 overflow-hidden">
                <TopTemplates templates={topTemplates} />
              </div>
              <div className="h-full min-h-0 overflow-hidden">
                <ZombieUsers users={zombieUsers} />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
};
