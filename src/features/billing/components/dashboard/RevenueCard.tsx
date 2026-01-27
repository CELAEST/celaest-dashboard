"use client";

import React from "react";
import { motion } from "motion/react";
import { DollarSign } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

interface RevenueCardProps {
  totalRevenue: number;
  paidInvoices: number;
  refundedFunds: number;
}

export const RevenueCard = React.memo(
  ({ totalRevenue, paidInvoices, refundedFunds }: RevenueCardProps) => {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`lg:col-span-2 relative overflow-hidden rounded-3xl transition-all duration-500 hover:shadow-2xl ${
          isDark
            ? "bg-linear-to-br from-cyan-500/20 via-blue-500/20 to-indigo-500/20 backdrop-blur-xl border border-cyan-500/30"
            : "bg-linear-to-br from-cyan-500/10 via-blue-500/10 to-indigo-500/10 border border-cyan-500/30 shadow-xl"
        }`}
      >
        {/* Floating Background Effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-48 h-48 rounded-full ${
                isDark ? "bg-cyan-400/10" : "bg-blue-500/10"
              }`}
              style={{
                left: `${20 + i * 30}%`,
                top: `${10 + i * 20}%`,
                filter: "blur(40px)",
              }}
              animate={{
                y: [0, -30, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 5 + i,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            />
          ))}
        </div>

        <div className="relative p-8">
          <div className="flex items-start justify-between mb-6">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                isDark
                  ? "bg-linear-to-br from-cyan-400 to-blue-500"
                  : "bg-linear-to-br from-blue-500 to-indigo-600"
              } shadow-lg`}
            >
              <DollarSign className="w-8 h-8 text-white" strokeWidth={2.5} />
            </div>
            <div
              className={`px-4 py-2 rounded-xl font-bold text-xs ${
                isDark
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-emerald-500/20 text-emerald-600 border border-emerald-500/30"
              }`}
            >
              ALL TIME
            </div>
          </div>

          <div
            className={`text-xs font-semibold tracking-wider mb-3 ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            TOTAL REVENUE
          </div>
          <div
            className={`text-6xl font-bold tracking-tight mb-4 ${
              isDark
                ? "bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"
                : "bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
            }`}
          >
            ${totalRevenue.toLocaleString()}
          </div>

          {/* Sub-metrics */}
          <div
            className={`pt-6 mt-6 border-t flex items-center gap-8 ${
              isDark ? "border-white/10" : "border-gray-200"
            }`}
          >
            <div>
              <div
                className={`text-xs mb-1 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Paid Invoices
              </div>
              <div
                className={`text-2xl font-bold ${
                  isDark ? "text-emerald-400" : "text-emerald-600"
                }`}
              >
                {paidInvoices}
              </div>
            </div>
            <div>
              <div
                className={`text-xs mb-1 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Refunded Funds
              </div>
              <div
                className={`text-2xl font-bold ${
                  isDark ? "text-orange-400" : "text-orange-600"
                }`}
              >
                -${refundedFunds.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  },
);

RevenueCard.displayName = "RevenueCard";
