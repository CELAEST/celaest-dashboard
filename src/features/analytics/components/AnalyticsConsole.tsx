"use client";

import React from "react";
import { Activity } from "lucide-react";
import { ROICard } from "@/features/roi/components/ROICard";
import { SystemUptime } from "./console/SystemUptime";
import { ResourceAllocation } from "./console/ResourceAllocation";
import { EventLogs } from "./console/EventLogs";
import { useAnalytics } from "@/features/analytics/hooks/useAnalytics";

export const AnalyticsConsole: React.FC = () => {
  const { isDark } = useAnalytics();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className={`text-4xl font-bold tracking-tight mb-2 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Operations & Telemetry
          </h1>
          <p
            className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            REAL-TIME MONITORING //{" "}
            <span className="text-emerald-500 font-semibold animate-pulse">
              ACTIVE
            </span>
          </p>
        </div>
        <div
          className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
            isDark
              ? "bg-linear-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/30"
              : "bg-linear-to-r from-emerald-500/10 to-teal-500/10 text-emerald-600 border border-emerald-500/20"
          }`}
        >
          <Activity className="w-5 h-5 animate-pulse" />
          Global Network Status: <span className="font-bold">HEALTHY</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ROI Card - Large */}
        <ROICard />

        {/* System Uptime & Resources */}
        <div className="space-y-6">
          <SystemUptime />
          <ResourceAllocation />
        </div>
      </div>

      {/* Event Logs */}
      <EventLogs />
    </div>
  );
};
