"use client";

import React from "react";
import { motion } from "motion/react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

export const FinancialHeader: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden rounded-3xl transition-all duration-300 group ${
        isDark
          ? "bg-[#09090b] border border-white/10 hover:border-purple-500/30 hover:shadow-[0_0_30px_rgba(168,85,247,0.1)]"
          : "bg-white border border-gray-100 shadow-xl"
      }`}
    >
      <div className="relative p-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div
                className={`w-2 h-8 rounded-full ${
                  isDark ? "bg-purple-500" : "bg-purple-600"
                }`}
              />
              <h2
                className={`text-3xl font-black tracking-tight ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                FINANCIAL COMMAND
              </h2>
            </div>
            <p
              className={`text-sm font-mono tracking-wide ml-5 ${
                isDark ? "text-gray-500" : "text-gray-500"
              }`}
            >
              {/* // REAL-TIME SYSTEM MONITORING */}
            </p>
          </div>
          <div
            className={`px-6 py-3 rounded-xl font-bold text-xs tracking-widest uppercase border transition-all duration-300 ${
              isDark
                ? "bg-[#18181b] text-purple-400 border-purple-500/20 group-hover:bg-purple-500/10 group-hover:border-purple-500/50"
                : "bg-purple-50 text-purple-700 border-purple-200"
            }`}
          >
            <span className="mr-2">👑</span>
            Super Admin Access
          </div>
        </div>
      </div>
    </motion.div>
  );
};
