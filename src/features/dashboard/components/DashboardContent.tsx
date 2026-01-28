"use client";

import React from "react";
import { Activity, Zap, Server, Box } from "lucide-react";
import dynamic from "next/dynamic";

// Static imports for dashboard main view components
import { StatCard } from "@/features/shared/components/StatCard";
import { OrdersTable } from "@/features/billing/components/OrdersTable";

import { useTheme } from "@/features/shared/hooks/useTheme";

// Skeleton for Chart
const ChartSkeleton = () => (
  <div className="h-[300px] w-full animate-pulse bg-gray-200/10 dark:bg-white/5 rounded-lg" />
);

// Dynamic import for RevenueChart
const RevenueChart = dynamic(
  () =>
    import("@/features/analytics/components/RevenueChart").then((m) => ({
      default: m.RevenueChart,
    })),
  { ssr: false, loading: () => <ChartSkeleton /> },
);

export const DashboardContent = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="p-1">
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h1
            className={`text-3xl font-bold mb-2 tracking-tight ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Command Center
          </h1>
          <p
            className={`${isDark ? "text-gray-400" : "text-gray-500"} text-sm`}
          >
            System Status:{" "}
            <span className="text-cyan-400 font-mono">OPTIMAL</span> • Local
            Time: <span className="font-mono opacity-80">14:32:01</span>
          </p>
        </div>

        <div className="flex gap-3">
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 border ${
              isDark
                ? "bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border-cyan-500/30 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                : "bg-white hover:bg-gray-50 text-blue-600 border-gray-200 shadow-sm"
            }`}
          >
            <Zap size={16} />
            Run Diagnostics
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Revenue"
          value="$128,492"
          trend="12.5%"
          trendUp={true}
          icon={<Activity size={24} />}
          delay={0.1}
        />
        <StatCard
          title="Global Orders"
          value="1,482"
          trend="3.2%"
          trendUp={true}
          icon={<Box size={24} />}
          delay={0.2}
          hologramImage="https://images.unsplash.com/photo-1751475252133-3db30b9814b5?crop=entropy&cs=tinysrgb&fit=max&fm=webp&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXR1cmlzdGljJTIwM2QlMjBob2xvZ3JhbSUyMGdsb2JlJTIwY3liZXJ8ZW58MXx8fHwxNzY4NTc2ODc4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
        />
        <StatCard
          title="Active Scripts"
          value="24/24"
          trend="Running"
          trendUp={true}
          icon={<Server size={24} />}
          delay={0.3}
          hologramImage="https://images.unsplash.com/photo-1674352889408-52792b1a3b23?crop=entropy&cs=tinysrgb&fit=max&fm=webp&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMDNkJTIwbWljcm9jaGlwJTIwZ2xvd2luZyUyMHR1cnF1b2lzZXxlbnwxfHx8fDE3Njg1NzY4Nzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
        />
        <StatCard
          title="Net Profit"
          value="$42,300"
          trend="1.8%"
          trendUp={false}
          icon={<Zap size={24} />}
          delay={0.4}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div
          className={`lg:col-span-2 backdrop-blur-xl border rounded-2xl p-6 min-h-[400px] ${
            isDark
              ? "bg-[#0a0a0a]/60 border-white/5"
              : "bg-white border-gray-200 shadow-sm"
          }`}
        >
          <RevenueChart />
        </div>

        <div
          className={`backdrop-blur-xl border rounded-2xl p-6 ${
            isDark
              ? "bg-[#0a0a0a]/60 border-white/5"
              : "bg-white border-gray-200 shadow-sm"
          }`}
        >
          <h3
            className={`${
              isDark ? "text-white" : "text-gray-900"
            } font-medium mb-4 flex items-center gap-2`}
          >
            <Server size={18} className="text-cyan-400" />
            System Health
          </h3>
          <div className="space-y-6">
            {[
              "Main Database",
              "API Gateway",
              "CDN Node US-East",
              "Payment Processor",
            ].map((item, i) => (
              <div key={i} className="group">
                <div className="flex justify-between text-sm mb-1">
                  <span
                    className={`${
                      isDark
                        ? "text-gray-400 group-hover:text-cyan-400"
                        : "text-gray-500 group-hover:text-blue-600"
                    } transition-colors`}
                  >
                    {item}
                  </span>
                  <span className="text-green-400 font-mono text-xs">
                    99.{8 + i}%
                  </span>
                </div>
                <div
                  className={`h-1.5 w-full rounded-full overflow-hidden ${
                    isDark ? "bg-white/5" : "bg-gray-100"
                  }`}
                >
                  <div
                    className="h-full bg-linear-to-r from-cyan-600 to-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee]"
                    style={{ width: `${95 + i}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

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
    </div>
  );
};
