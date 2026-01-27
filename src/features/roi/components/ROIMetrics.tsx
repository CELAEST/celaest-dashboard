"use client";

import React from "react";
import { useROIMetrics } from "@/features/roi/hooks/useROIMetrics";
import { ROIHeader } from "./ROIHeader";
import { ROIMetricsCards } from "./ROIMetricsCards";
import { TimeSavedChart } from "./TimeSavedChart";
import { TaskCompletionChart } from "./TaskCompletionChart";
import { TopTemplates } from "./TopTemplates";
import { ZombieUsers } from "./ZombieUsers";

export const ROIMetrics: React.FC = () => {
  const {
    isAdmin,
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
    weeklyData,
    monthlyData,
  } = useROIMetrics();

  return (
    <div className="space-y-6">
      {/* Header */}
      <ROIHeader
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        filterOptions={filterOptions}
      />

      {/* Metrics Cards */}
      <ROIMetricsCards metrics={metrics} />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TimeSavedChart
          data={weeklyData}
          timeRange={timeRange}
          setTimeRange={setTimeRange}
        />
        <TaskCompletionChart data={monthlyData} />
      </div>

      {/* Bottom Section */}
      {isAdmin && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopTemplates templates={topTemplates} />
          <ZombieUsers users={zombieUsers} />
        </div>
      )}
    </div>
  );
};
