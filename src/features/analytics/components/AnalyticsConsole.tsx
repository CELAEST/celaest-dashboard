"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Pulse } from "@phosphor-icons/react";
import { ROICard } from "@/features/roi/components/ROICard";
import { SystemUptime } from "./console/SystemUptime";
import { ResourceAllocation } from "./console/ResourceAllocation";
import { EventLogs } from "./console/EventLogs";
import { useAnalytics } from "@/features/analytics/hooks/useAnalytics";
import { useRole } from "@/features/auth/hooks/useAuthorization";
import { PageBanner } from "@/components/layout/PageLayout";

export const AnalyticsConsole: React.FC = () => {
  // ── Single subscription point ─────────────────────────────────────────────
  // useAnalytics() is called ONCE here and data is passed down as props.
  // Previously each sub-component (SystemUptime, ResourceAllocation, EventLogs)
  // called useAnalytics() independently → 5 concurrent subscribers to the same
  // query keys → re-render cascade on every invalidation + extra reconciliation.
  const { isDark, stats, usage, eventLogs } = useAnalytics();
  const { isSuperAdmin } = useRole();
  const [activeTab, setActiveTab] = React.useState<"command" | "terminal">(
    "command",
  );

  return (
    <div className="h-full w-full flex flex-col min-h-0 overflow-hidden bg-transparent">
      {/* Header - Fixed */}
      <PageBanner
          title={isSuperAdmin ? "Operations & Telemetry" : "My Analytics"}
          subtitle={isSuperAdmin ? "Command Deck // Live Feed" : "Panel // Live Feed"}
          actions={
            <div className="flex items-center gap-3">
              {isSuperAdmin && (
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
              )}
              <div
                className={`px-4 py-2 rounded-xl font-bold uppercase tracking-wider text-[10px] transition-all duration-300 flex items-center gap-2 ${
                  isDark
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-emerald-50 text-emerald-600 border border-emerald-500/10"
                }`}
              >
                <Pulse className="w-3 h-3 animate-pulse" />
                Network: <span className="text-emerald-500">OPTIMAL</span>
              </div>
            </div>
          }
      />

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 relative px-3 pb-3">
        <AnimatePresence mode="wait">
          {activeTab === "command" || !isSuperAdmin ? (
            <motion.div
              key="command"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className={`h-full ${isSuperAdmin ? "grid grid-cols-1 lg:grid-cols-3 gap-6" : "flex flex-col gap-6"}`}
            >
              {/* ROI Card */}
              <div className={`${isSuperAdmin ? "lg:col-span-2" : ""} h-full min-h-0`}>
                <ROICard />
              </div>

              {/* Operations Stack - Only for super_admin */}
              {isSuperAdmin && (
                <div className="flex flex-col gap-6 h-full min-h-0">
                  <SystemUptime className="flex-1" isDark={isDark} stats={stats} />
                  <ResourceAllocation className="flex-1" isDark={isDark} usage={usage} />
                </div>
              )}
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
              <EventLogs isDark={isDark} eventLogs={eventLogs} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
