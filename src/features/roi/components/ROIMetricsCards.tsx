import React from "react";
import { motion } from "motion/react";
import { TrendingUp, LucideIcon } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

interface Metric {
  icon: LucideIcon;
  label: string;
  value: string;
  subtext: string;
  change: string;
  positive: boolean;
}

interface ROIMetricsCardsProps {
  metrics: Metric[];
}

export const ROIMetricsCards = React.memo(
  ({ metrics }: ROIMetricsCardsProps) => {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {metrics.map((metric, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`group relative overflow-hidden rounded-2xl p-6 transition-all duration-500 hover:scale-105 cursor-pointer ${
              isDark
                ? "bg-black/40 backdrop-blur-xl border border-white/10 hover:border-white/20"
                : "bg-white border border-gray-200 shadow-sm hover:shadow-xl"
            }`}
          >
            {/* Glow Effect */}
            <div
              className={`absolute -inset-1 bg-linear-to-br from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`}
            />

            <div className="relative">
              {/* Icon */}
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ${
                    isDark
                      ? "bg-linear-to-br from-cyan-400/20 to-blue-500/20 text-cyan-400 shadow-lg shadow-cyan-500/30"
                      : "bg-linear-to-br from-blue-500/20 to-indigo-500/20 text-blue-600"
                  }`}
                >
                  <metric.icon className="w-6 h-6" strokeWidth={2.5} />
                </div>
                <div
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${
                    isDark
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-emerald-500/10 text-emerald-600"
                  }`}
                >
                  <TrendingUp className="w-3 h-3" />
                  {metric.change}
                </div>
              </div>

              {/* Content */}
              <div
                className={`text-xs font-semibold tracking-wider mb-2 ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {metric.label}
              </div>
              <div
                className={`text-4xl font-bold tracking-tight mb-2 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {metric.value}
              </div>
              <div
                className={`text-xs ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`}
              >
                {metric.subtext}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  },
);

ROIMetricsCards.displayName = "ROIMetricsCards";
