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
    <div className="h-full flex flex-col min-h-0">
      {/* Dashboard Header - Standardized Rhythm */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 shrink-0">
        <div>
          <h1
            className={`text-4xl font-black mb-2 tracking-tighter italic uppercase ${isDark ? "text-white" : "text-gray-900"}`}
          >
            Command Center
          </h1>
          <p
            className={`${isDark ? "text-gray-400" : "text-gray-500"} text-sm font-medium flex items-center gap-2`}
          >
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            System Status:{" "}
            <span className="text-emerald-500 font-black uppercase">
              OPTIMAL
            </span>{" "}
            <span className="opacity-20">|</span>
            <span className="font-mono opacity-80">{localTime}</span>
          </p>
        </div>

        <button
          onClick={handleRunDiagnostics}
          disabled={isDiagnosticsRunning}
          className={`group relative px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-3 transition-all duration-500 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden ${
            isDark
              ? "bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.2)]"
              : "bg-black text-white shadow-xl shadow-black/20"
          }`}
        >
          <div className="absolute inset-0 bg-linear-to-r from-cyan-400/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          <Zap
            size={14}
            className={`${isDiagnosticsRunning ? "animate-spin text-cyan-400" : "group-hover:text-cyan-400"}`}
          />
          {isDiagnosticsRunning
            ? "Running Diagnostics..."
            : "Execute Diagnostics"}
        </button>
      </div>

      {/* Main Scrollable Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 pb-16 space-y-8">
        {/* Stats Section - Bento Style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="TOTAL REVENUE"
            value="$128,492"
            trend="12.5%"
            trendUp={true}
            icon={<Activity size={20} />}
            delay={0.1}
            gradient="from-cyan-400 to-blue-500"
          />
          <StatCard
            title="GLOBAL ORDERS"
            value="1,482"
            trend="3.2%"
            trendUp={true}
            icon={<Box size={20} />}
            delay={0.2}
            gradient="from-blue-500 to-indigo-500"
          />
          <StatCard
            title="ACTIVE SCRIPTS"
            value="24/24"
            trend="Running"
            trendUp={true}
            icon={<Server size={20} />}
            delay={0.3}
            gradient="from-emerald-400 to-teal-500"
          />
          <StatCard
            title="NET PROFIT"
            value="$42,300"
            trend="1.8%"
            trendUp={false}
            icon={<Zap size={20} />}
            delay={0.4}
            gradient="from-orange-400 to-red-500"
          />
        </div>

        {/* Mid-Grid Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Charts Area - Hero Bento */}
          <div
            className={`lg:col-span-2 group relative backdrop-blur-3xl border rounded-[2.5rem] p-8 transition-all duration-500 ${
              isDark
                ? "bg-black/40 border-white/5 hover:border-white/10 shadow-2xl hover:shadow-cyan-500/5"
                : "bg-white border-gray-100 shadow-xl shadow-gray-200/50"
            }`}
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3
                  className={`text-xl font-black uppercase tracking-tighter italic ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  Revenue Analytics
                </h3>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">
                  Live data feed • v1.0.4
                </p>
              </div>
              <div className="flex gap-2">
                {["24H", "7D", "30D"].map((period) => (
                  <button
                    key={period}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black tracking-widest uppercase transition-all ${
                      period === "24H"
                        ? isDark
                          ? "bg-white text-black"
                          : "bg-black text-white"
                        : isDark
                          ? "bg-white/5 text-gray-500 hover:text-white"
                          : "bg-gray-100 text-gray-500 hover:text-black"
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-[300px]">
              <SalesChart />
            </div>
          </div>

          {/* System Health Area */}
          <div
            className={`backdrop-blur-3xl border rounded-[2.5rem] p-8 transition-all duration-500 ${
              isDark
                ? "bg-black/40 border-white/5 hover:border-white/10 shadow-2xl hover:shadow-cyan-500/5"
                : "bg-white border-gray-100 shadow-xl shadow-gray-200/50"
            }`}
          >
            <div className="flex items-center gap-4 mb-8">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? "bg-cyan-500/10" : "bg-cyan-50"}`}
              >
                <Server size={18} className="text-cyan-400" />
              </div>
              <div>
                <h3
                  className={`text-lg font-black uppercase tracking-tighter italic ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  Node Health
                </h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                  Global Cluster
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {systemHealth.map((item, i) => (
                <div key={i} className="group">
                  <div className="flex justify-between items-end text-sm mb-2">
                    <span
                      className={`text-[10px] font-black uppercase tracking-widest transition-colors ${
                        isDark
                          ? "text-gray-500 group-hover:text-cyan-400"
                          : "text-gray-500 group-hover:text-blue-600"
                      }`}
                    >
                      {item.name}
                    </span>
                    <span className="text-emerald-400 font-mono text-xs font-bold">
                      {item.uptime}%
                    </span>
                  </div>
                  <div
                    className={`h-2 w-full rounded-full overflow-hidden ${isDark ? "bg-white/5" : "bg-gray-100"}`}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.uptime}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className="h-full bg-linear-to-r from-cyan-600 to-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.3)]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Global Notifications Section */}
        <div className="group relative">
          <NotificationShowcase />
        </div>

        {/* Critical Operations Data */}
        <div
          className={`backdrop-blur-3xl border rounded-[2.5rem] p-8 transition-all duration-500 ${
            isDark
              ? "bg-black/40 border-white/5 hover:border-white/10 shadow-2xl"
              : "bg-white border-gray-100 shadow-xl shadow-gray-200/50"
          }`}
        >
          <div className="flex items-center justify-between mb-8">
            <h3
              className={`text-xl font-black uppercase tracking-tighter italic ${isDark ? "text-white" : "text-gray-900"}`}
            >
              Active Transactions
            </h3>
            <button
              className={`text-[10px] font-black uppercase tracking-widest underline decoration-2 underline-offset-4 transition-colors ${
                isDark
                  ? "text-cyan-400 hover:text-cyan-300"
                  : "text-blue-600 hover:text-blue-700"
              }`}
            >
              View Archive
            </button>
          </div>
          <div className="overflow-hidden">
            <OrdersTable />
          </div>
        </div>
      </div>
    </div>
  );
});

DashboardView.displayName = "DashboardView";
