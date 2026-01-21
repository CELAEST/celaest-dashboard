import React from "react";
import { motion } from "motion/react";
import {
  FileText,
  Archive,
  PackageCheck,
  Layers,
  TrendingUp,
} from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

export const AssetMetrics: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const metrics = [
    {
      label: "Active Templates",
      value: 24,
      icon: PackageCheck,
      color: "emerald",
      trend: "+3 this week",
    },
    {
      label: "Draft Assets",
      value: 7,
      icon: FileText,
      color: "yellow",
      trend: "In progress",
    },
    {
      label: "Archived",
      value: 12,
      icon: Archive,
      color: "gray",
      trend: "Legacy versions",
    },
    {
      label: "Total Versions",
      value: 68,
      icon: Layers,
      color: "blue",
      trend: "All time",
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> =
      {
        emerald: {
          bg: isDark ? "bg-emerald-500/10" : "bg-emerald-50",
          text: isDark ? "text-emerald-400" : "text-emerald-600",
          border: isDark ? "border-emerald-500/20" : "border-emerald-200",
        },
        yellow: {
          bg: isDark ? "bg-yellow-500/10" : "bg-yellow-50",
          text: isDark ? "text-yellow-400" : "text-yellow-600",
          border: isDark ? "border-yellow-500/20" : "border-yellow-200",
        },
        gray: {
          bg: isDark ? "bg-gray-500/10" : "bg-gray-100",
          text: isDark ? "text-gray-400" : "text-gray-600",
          border: isDark ? "border-gray-500/20" : "border-gray-200",
        },
        blue: {
          bg: isDark ? "bg-blue-500/10" : "bg-blue-50",
          text: isDark ? "text-blue-400" : "text-blue-600",
          border: isDark ? "border-blue-500/20" : "border-blue-200",
        },
      };
    return colors[color];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => {
        const colors = getColorClasses(metric.color);
        const Icon = metric.icon;

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`rounded-2xl border p-5 ${
              isDark
                ? "bg-linear-to-br from-[#0a0a0a]/80 to-gray-900/50 border-white/10"
                : "bg-white border-gray-200 shadow-sm"
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${colors.bg}`}>
                <Icon size={20} className={colors.text} />
              </div>
            </div>
            <div>
              <p
                className={`text-xs font-semibold mb-2 uppercase tracking-wide ${
                  isDark ? "text-gray-500" : "text-gray-600"
                }`}
              >
                {metric.label}
              </p>
              <div
                className={`text-3xl font-bold mb-2 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {metric.value}
              </div>
              <p
                className={`text-xs ${
                  isDark ? "text-gray-500" : "text-gray-600"
                }`}
              >
                {metric.trend}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
