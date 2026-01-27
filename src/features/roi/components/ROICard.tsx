import React from "react";
import { motion } from "motion/react";
import { TrendingUp, DollarSign } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

export const ROICard = React.memo(() => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`lg:col-span-2 rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl ${
        isDark
          ? "bg-black/40 backdrop-blur-xl border border-white/10"
          : "bg-white border border-gray-200 shadow-sm"
      }`}
    >
      <div className="p-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isDark ? "bg-cyan-400" : "bg-blue-500"
              }`}
            />
            <h3
              className={`text-xl font-bold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Return on Investment
            </h3>
          </div>
        </div>

        {/* ROI Metrics */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <div
              className={`text-xs font-semibold tracking-wider mb-2 ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Total Time Saved
            </div>
            <div
              className={`text-5xl font-bold tracking-tight mb-1 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              1,240
              <span
                className={`text-2xl ml-1 ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`}
              >
                hrs
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-semibold text-emerald-500">
                +12% vs last month
              </span>
            </div>
          </div>

          <div>
            <div
              className={`text-xs font-semibold tracking-wider mb-2 ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Est. Revenue Generated
            </div>
            <div
              className={`text-5xl font-bold tracking-tight mb-1 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              $842
              <span
                className={`text-2xl ml-1 ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`}
              >
                .5K
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <DollarSign className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-semibold text-emerald-500">
                +45% projected
              </span>
            </div>
          </div>
        </div>

        {/* 3D Visualization Area */}
        <div className="relative">
          <div
            className={`text-xs font-semibold tracking-wider mb-4 ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Software Execution Frequency
          </div>

          <div
            className={`relative h-48 rounded-2xl overflow-hidden ${
              isDark
                ? "bg-linear-to-br from-cyan-500/5 to-blue-500/5"
                : "bg-linear-to-br from-blue-500/5 to-indigo-500/5"
            }`}
          >
            {/* Metric Trend Visualization */}
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <div className="w-full h-full flex flex-col justify-end">
                {/* Graph Title */}
                <div className="absolute top-6 left-6 z-10">
                  <div
                    className={`text-xs font-bold tracking-widest uppercase mb-1 ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Efficiency Trend
                  </div>
                  <div
                    className={`text-2xl font-bold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    +24.8%
                  </div>
                </div>

                {/* SVG Chart */}
                <div className="relative w-full h-32">
                  <svg
                    className="w-full h-full overflow-visible"
                    viewBox="0 0 100 50"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient
                        id="trendGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor={isDark ? "#22d3ee" : "#3b82f6"} // Cyan/Blue top
                          stopOpacity="0.5"
                        />
                        <stop
                          offset="100%"
                          stopColor={isDark ? "#22d3ee" : "#3b82f6"}
                          stopOpacity="0"
                        />
                      </linearGradient>
                    </defs>

                    {/* Fill Area */}
                    <motion.path
                      d="M0 50 L0 35 Q20 30 40 38 T80 20 T100 10 L100 50 Z"
                      fill="url(#trendGradient)"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1 }}
                    />

                    {/* Stroke Line */}
                    <motion.path
                      d="M0 35 Q20 30 40 38 T80 20 T100 10"
                      fill="none"
                      stroke={isDark ? "#22d3ee" : "#3b82f6"}
                      strokeWidth="2"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

ROICard.displayName = "ROICard";
