"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Activity } from "lucide-react";
import { ROICard } from "@/features/roi/components/ROICard";
import { SystemUptime } from "./console/SystemUptime";
import { ResourceAllocation } from "./console/ResourceAllocation";
import { EventLogs } from "./console/EventLogs";
import { useAnalytics } from "@/features/analytics/hooks/useAnalytics";

export const AnalyticsConsole: React.FC = () => {
  const { isDark } = useAnalytics();
  const [activeTab, setActiveTab] = React.useState<"command" | "terminal">(
    "command",
  );

  return (
    <div className="h-full w-full flex flex-col min-h-0 overflow-hidden p-6 bg-transparent">
      {/* Header - Fixed */}
      <div className="shrink-0 mb-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1
              className={`text-3xl lg:text-4xl font-black tracking-tighter italic uppercase mb-1 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Operations & Telemetry
            </h1>
            <p
              className={`text-xs font-medium tracking-widest ${isDark ? "text-gray-400" : "text-gray-600"}`}
            >
              COMMAND DECK //{" "}
              <span className="text-emerald-500 font-bold animate-pulse">
                LIVE FEED
              </span>
            </p>
          </div>
          <div
            className={`px-4 py-2 rounded-xl font-bold uppercase tracking-wider text-[10px] transition-all duration-300 flex items-center gap-2 ${
              isDark
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "bg-emerald-50 text-emerald-600 border border-emerald-500/10"
            }`}
          >
            <Activity className="w-3 h-3 animate-pulse" />
            Network: <span className="text-emerald-500">OPTIMAL</span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center p-1 rounded-full ${isDark ? "bg-white/5 border border-white/5" : "bg-gray-100 border border-gray-200"}`}
          >
            <button
              onClick={() => setActiveTab("command")}
              className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === "command"
                  ? isDark
                    ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20"
                    : "bg-white text-gray-900 shadow-sm"
                  : isDark
                    ? "text-gray-500 hover:text-gray-300"
                    : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Command Center
            </button>
            <button
              onClick={() => setActiveTab("terminal")}
              className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === "terminal"
                  ? isDark
                    ? "bg-purple-500 text-white shadow-lg shadow-purple-500/20"
                    : "bg-white text-gray-900 shadow-sm"
                  : isDark
                    ? "text-gray-500 hover:text-gray-300"
                    : "text-gray-500 hover:text-gray-700"
              }`}
            >
              System Terminal
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area - One View Per Tab (Zero Scroll) */}
      <div className="flex-1 min-h-0 relative">
        <AnimatePresence mode="wait">
          {activeTab === "command" ? (
            <motion.div
              key="command"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="h-full grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* ROI Card - Occupies 2 Columns and stretches full height */}
              <div className="lg:col-span-2 h-full min-h-0">
                <ROICard />
              </div>

              {/* Operations Stack - Occupies 1 Column */}
              <div className="flex flex-col gap-6 h-full min-h-0">
                <SystemUptime className="flex-1" />
                <ResourceAllocation className="flex-1" />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="terminal"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="h-full w-full"
            >
              <EventLogs />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
