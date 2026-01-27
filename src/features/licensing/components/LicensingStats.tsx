"use client";

import React from "react";
import { motion } from "motion/react";
import { Key, CheckCircle, AlertTriangle, TrendingUp } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { Analytics, Collision } from "@/features/licensing/constants/mock-data";

interface LicensingStatsProps {
  analytics: Analytics | null;
  collisions: Collision[];
}

export const LicensingStats: React.FC<LicensingStatsProps> = ({
  analytics,
  collisions,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  if (!analytics) return null;

  const stats = [
    {
      label: "Total Licenses",
      value: analytics.total,
      icon: Key,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Active Now",
      value: analytics.active,
      icon: CheckCircle,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      label: "IP Collisions",
      value: collisions.length,
      icon: AlertTriangle,
      color: "text-red-500",
      bg: "bg-red-500/10",
    },
    {
      label: "Success Rate",
      value: `${analytics.validationSuccessRate}%`,
      icon: TrendingUp,
      color: "text-cyan-500",
      bg: "bg-cyan-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className={`p-6 rounded-2xl border backdrop-blur-sm ${
            isDark
              ? "bg-white/5 border-white/5 hover:bg-white/10"
              : "bg-white border-gray-100 hover:border-gray-200"
          } transition-colors`}
        >
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            {i === 3 && (
              <div
                className={`text-xs font-bold px-2 py-1 rounded-full ${
                  isDark
                    ? "bg-green-500/20 text-green-400"
                    : "bg-green-100 text-green-700"
                }`}
              >
                +2.4%
              </div>
            )}
          </div>
          <div
            className={`text-3xl font-bold mb-1 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {stat.value}
          </div>
          <div
            className={`text-sm font-medium ${
              isDark ? "text-gray-500" : "text-gray-500"
            }`}
          >
            {stat.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
};
