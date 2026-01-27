"use client";

import React from "react";
import { motion } from "motion/react";
import { Activity, Zap, Server, Box } from "lucide-react";
import { StatCard } from "@/features/shared/components/StatCard";
import { SalesChart } from "@/features/analytics/components/Charts";
import { OrdersTable } from "@/features/billing/components/OrdersTable";
import { NotificationShowcase } from "@/features/shared/components/NotificationShowcase";
import { useDashboard } from "@/features/analytics/hooks/useDashboard";

export const DashboardView: React.FC = React.memo(() => {
  const {
    isDark,
    isDiagnosticsRunning,
    handleRunDiagnostics,
    systemHealth,
    localTime,
  } = useDashboard();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      {/* Dashboard Header */}
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h1
            className={`text-4xl font-bold mb-2 tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}
          >
            Command Center
          </h1>
          <p
            className={`${isDark ? "text-gray-400" : "text-gray-500"} text-sm`}
          >
            System Status:{" "}
            <span className="text-emerald-500 font-semibold shadow-[0_0_10px_rgba(16,185,129,0.3)]">
              OPTIMAL
            </span>{" "}
            • Local Time:{" "}
            <span className="font-mono opacity-80">{localTime}</span>
          </p>
        </div>

        <button
          onClick={handleRunDiagnostics}
          disabled={isDiagnosticsRunning}
          className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
            isDark
              ? "bg-linear-to-r from-cyan-400 to-blue-500 text-white shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70"
              : "bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50"
          }`}
        >
          <Zap
            size={18}
            className={isDiagnosticsRunning ? "animate-pulse" : ""}
          />
          {isDiagnosticsRunning ? "DIAGNOSTICANDO..." : "Run Diagnostics"}
        </button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="TOTAL REVENUE"
          value="$128,492"
          trend="12.5%"
          trendUp={true}
          icon={<Activity size={24} />}
          delay={0.1}
          gradient="from-cyan-400 to-blue-500"
        />
        <StatCard
          title="GLOBAL ORDERS"
          value="1,482"
          trend="3.2%"
          trendUp={true}
          icon={<Box size={24} />}
          delay={0.2}
          gradient="from-blue-500 to-indigo-500"
        />
        <StatCard
          title="ACTIVE SCRIPTS"
          value="24/24"
          trend="Running"
          trendUp={true}
          icon={<Server size={24} />}
          delay={0.3}
          gradient="from-emerald-400 to-teal-500"
        />
        <StatCard
          title="NET PROFIT"
          value="$42,300"
          trend="1.8%"
          trendUp={false}
          icon={<Zap size={24} />}
          delay={0.4}
          gradient="from-orange-400 to-red-500"
        />
      </div>

      <div className="mb-8">
        <NotificationShowcase />
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div
          className={`lg:col-span-2 backdrop-blur-xl border rounded-2xl p-6 min-h-[400px] ${
            isDark
              ? "bg-[#0a0a0a]/60 border-white/5"
              : "bg-white border-gray-200 shadow-sm"
          }`}
        >
          <SalesChart />
        </div>

        {/* Health Stats */}
        <div
          className={`backdrop-blur-xl border rounded-2xl p-6 ${
            isDark
              ? "bg-[#0a0a0a]/60 border-white/5"
              : "bg-white border-gray-200 shadow-sm"
          }`}
        >
          <h3
            className={`${isDark ? "text-white" : "text-gray-900"} font-medium mb-4 flex items-center gap-2`}
          >
            <Server size={18} className="text-cyan-400" />
            System Health
          </h3>
          <div className="space-y-6">
            {systemHealth.map((item, i) => (
              <div key={i} className="group">
                <div className="flex justify-between text-sm mb-1">
                  <span
                    className={`${
                      isDark
                        ? "text-gray-400 group-hover:text-cyan-400"
                        : "text-gray-500 group-hover:text-blue-600"
                    } transition-colors`}
                  >
                    {item.name}
                  </span>
                  <span className="text-green-400 font-mono text-xs">
                    {item.uptime}%
                  </span>
                </div>
                <div
                  className={`h-1.5 w-full rounded-full overflow-hidden ${isDark ? "bg-white/5" : "bg-gray-100"}`}
                >
                  <div
                    className="h-full bg-linear-to-r from-cyan-600 to-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee]"
                    style={{ width: `${item.uptime}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Table Section */}
        <div
          className={`lg:col-span-3 backdrop-blur-xl border rounded-2xl p-6 ${
            isDark
              ? "bg-[#0a0a0a]/60 border-white/5"
              : "bg-white border-gray-200 shadow-sm"
          }`}
        >
          <OrdersTable />
        </div>
      </div>
    </motion.div>
  );
});

DashboardView.displayName = "DashboardView";
