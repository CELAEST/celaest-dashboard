"use client";

import React from "react";
import { motion } from "motion/react";
import { DollarSign } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

interface RevenueCardProps {
  totalRevenue: number;
  paidInvoices: number;
  refundedFunds: number;
  className?: string;
}

export const RevenueCard = React.memo(
  ({
    totalRevenue,
    paidInvoices,
    refundedFunds,
    className,
  }: RevenueCardProps) => {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden rounded-3xl transition-all duration-300 hover:shadow-2xl group h-full ${
          isDark
            ? "bg-[#09090b] border border-white/10 hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]"
            : "bg-white border border-gray-100 shadow-xl hover:border-blue-500/30"
        } ${className || ""}`}
      >
        {/* Ambient Background Glow */}
        <div
          className={`absolute top-0 right-0 w-64 h-64 bg-linear-to-br from-cyan-500/10 to-transparent blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
        />

        {/* MICRO-BENTO GRID: 3 Interlocking Tiles */}
        <div className="relative h-full p-4 grid grid-rows-[1.5fr_1fr] gap-3">
          {/* TILE 1: HERO REVENUE (Top / Dominant) */}
          <div
            className={`rounded-2xl p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden transition-all duration-300 group-hover:bg-white/5 ${
              isDark
                ? "bg-white/2 border border-white/5"
                : "bg-gray-50/50 border border-gray-100"
            }`}
          >
            {/* Header Row: Icon and Badge */}
            <div className="flex items-start justify-between z-10 shrink-0">
              <div
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center ${
                  isDark
                    ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                    : "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                }`}
              >
                <DollarSign className="w-4 h-4" strokeWidth={2.5} />
              </div>
              <div
                className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest border ${
                  isDark
                    ? "bg-emerald-500/5 text-emerald-400 border-emerald-500/20"
                    : "bg-emerald-50 text-emerald-700 border-emerald-200"
                }`}
              >
                All Time
              </div>
            </div>

            {/* Content Row: Label and Value */}
            <div className="relative z-10 mt-auto pt-2">
              <div
                className={`text-[9px] font-black uppercase tracking-widest opacity-60 mb-1 ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Total Revenue
              </div>
              <div
                className={`text-3xl sm:text-4xl lg:text-4xl font-black tracking-tighter tabular-nums transition-all duration-300 truncate ${
                  isDark
                    ? "text-white group-hover:text-cyan-50"
                    : "text-gray-900"
                }`}
              >
                <span className="inline-block">
                  ${totalRevenue.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Decor */}
            <div
              className={`absolute -bottom-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-10 pointer-events-none ${isDark ? "bg-cyan-500" : "bg-blue-500"}`}
            />
          </div>

          {/* ROW 2: THE TWINS (Paid & Refunds) */}
          <div className="grid grid-cols-2 gap-3 min-h-0">
            {/* TILE 2: PAID (Emerald Glass) */}
            <div
              className={`rounded-2xl p-4 flex flex-col justify-center relative overflow-hidden transition-all duration-300 group-hover:scale-[1.02] ${
                isDark
                  ? "bg-linear-to-br from-emerald-500/10 to-transparent border border-emerald-500/10"
                  : "bg-emerald-50/50 border border-emerald-100"
              }`}
            >
              <div
                className={`text-[9px] font-black uppercase tracking-wider mb-1 opacity-70 ${
                  isDark ? "text-emerald-200" : "text-emerald-700"
                }`}
              >
                Paid
              </div>
              <div
                className={`text-xl lg:text-2xl font-bold tabular-nums ${
                  isDark ? "text-emerald-400" : "text-emerald-600"
                }`}
              >
                {paidInvoices}
              </div>
            </div>

            {/* TILE 3: REFUNDS (Orange Glass) */}
            <div
              className={`rounded-2xl p-4 flex flex-col justify-center relative overflow-hidden transition-all duration-300 group-hover:scale-[1.02] ${
                isDark
                  ? "bg-linear-to-br from-orange-500/10 to-transparent border border-orange-500/10"
                  : "bg-orange-50/50 border border-orange-100"
              }`}
            >
              <div
                className={`text-[9px] font-black uppercase tracking-wider mb-1 opacity-70 ${
                  isDark ? "text-orange-200" : "text-orange-700"
                }`}
              >
                Refunds
              </div>
              <div
                className={`text-xl lg:text-2xl font-bold tabular-nums ${
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
