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
      className={`relative overflow-hidden rounded-3xl transition-all duration-500 hover:shadow-2xl ${
        isDark
          ? "bg-linear-to-br from-purple-500/20 via-cyan-500/10 to-blue-500/20 backdrop-blur-xl border border-purple-500/30"
          : "bg-linear-to-br from-purple-500/10 via-cyan-500/5 to-blue-500/10 border border-purple-500/30 shadow-xl"
      }`}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-32 h-32 rounded-full ${
              isDark ? "bg-cyan-400" : "bg-purple-500"
            }`}
            style={{
              left: `${i * 25}%`,
              top: `${Math.sin(i) * 50 + 25}%`,
              filter: "blur(60px)",
            }}
            animate={{
              y: [0, -20, 0],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      <div className="relative p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2
              className={`text-2xl font-bold mb-2 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Global Billing Control Center
            </h2>
            <p
              className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
            >
              Real-time financial metrics and payment gateway administration
            </p>
          </div>
          <div
            className={`px-6 py-2.5 rounded-xl font-bold text-sm ${
              isDark
                ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                : "bg-purple-500/20 text-purple-600 border border-purple-500/30"
            }`}
          >
            👑 SUPER ADMIN
          </div>
        </div>
      </div>
    </motion.div>
  );
};
