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
    <div className="h-full w-full flex flex-col min-h-0">
      {/* Header - Fixed */}
      <div className="shrink-0 mb-6 flex items-center justify-between">
        <div>
          <h1
            className={`text-4xl font-black tracking-tighter italic uppercase mb-2 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Operations & Telemetry
          </h1>
          <p
            className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            REAL-TIME MONITORING //{" "}
            <span className="text-emerald-500 font-bold animate-pulse">
              ACTIVE
            </span>
          </p>
        </div>
        <div
          className={`px-6 py-2 rounded-xl font-bold uppercase tracking-wider text-xs transition-all duration-300 flex items-center gap-2 ${
            isDark
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-500/10"
              : "bg-emerald-50 text-emerald-600 border border-emerald-500/10 shadow-lg shadow-emerald-500/5"
          }`}
        >
          <Activity className="w-4 h-4 animate-pulse" />
          Global Network Status:{" "}
          <span className="text-emerald-500">HEALTHY</span>
        </div>
      </div>

      {/* Main Content - Scroll Area Trigger */}
      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 pb-16 space-y-6 min-h-0">
          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 shrink-0">
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
      </div>
    </div>
  );
};
