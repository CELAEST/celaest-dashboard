"use client";

import React from "react";
import { motion } from "motion/react";
import { AlertCircle } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

interface AlertsCardProps {
  pendingRefunds: number;
  failedPayments: number;
  className?: string;
}

export const AlertsCard = React.memo(
  ({ pendingRefunds, failedPayments, className }: AlertsCardProps) => {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className={`rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-2xl ${
          isDark
            ? "bg-[#09090b] border border-white/10 hover:border-orange-500/30"
            : "bg-white border border-gray-100 shadow-sm hover:shadow-md"
        } ${className || ""}`}
      >
        <div className="p-6 h-full flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  isDark
                    ? "bg-orange-500/10 text-orange-400"
                    : "bg-orange-100 text-orange-600"
                }`}
              >
                <AlertCircle className="w-5 h-5" />
              </div>
              <h3
                className={`font-bold text-lg tracking-tight ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Critical Alerts
              </h3>
            </div>

            <div className="space-y-3">
              {/* Pending Refunds */}
              <div
                className={`p-4 rounded-xl border transition-all duration-300 hover:scale-[1.02] cursor-pointer group ${
                  isDark
                    ? "bg-[#18181b] border-orange-500/20 hover:border-orange-500/50 hover:shadow-[0_0_15px_rgba(249,115,22,0.1)]"
                    : "bg-orange-50 border-orange-200"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div
                      className={`font-bold text-xs uppercase tracking-wider mb-1 ${
                        isDark ? "text-orange-500" : "text-orange-700"
                      }`}
                    >
                      Pending Refunds
                    </div>
                    <div
                      className={`text-[10px] font-mono leading-relaxed ${
                        isDark
                          ? "text-gray-400 group-hover:text-gray-300"
                          : "text-gray-500"
                      }`}
                    >
                      Requires approval
                    </div>
                  </div>
                  <div
                    className={`text-3xl font-black tabular-nums transition-colors ${
                      isDark
                        ? "text-white group-hover:text-orange-400"
                        : "text-gray-900 group-hover:text-orange-600"
                    }`}
                  >
                    {pendingRefunds}
                  </div>
                </div>
              </div>

              {/* Failed Payments */}
              <div
                className={`p-4 rounded-xl border transition-all duration-300 hover:scale-[1.02] cursor-pointer group ${
                  isDark
                    ? "bg-[#18181b] border-red-500/20 hover:border-red-500/50 hover:shadow-[0_0_15px_rgba(239,68,68,0.1)]"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div
                      className={`font-bold text-xs uppercase tracking-wider mb-1 ${
                        isDark ? "text-red-500" : "text-red-700"
                      }`}
                    >
                      Failed Payments
                    </div>
                    <div
                      className={`text-[10px] font-mono leading-relaxed ${
                        isDark
                          ? "text-gray-400 group-hover:text-gray-300"
                          : "text-gray-500"
                      }`}
                    >
                      Rec. Intervention
                    </div>
                  </div>
                  <div
                    className={`text-3xl font-black tabular-nums transition-colors ${
                      isDark
                        ? "text-white group-hover:text-red-400"
                        : "text-gray-900 group-hover:text-red-600"
                    }`}
                  >
                    {failedPayments}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`w-full py-4 rounded-xl font-bold text-sm tracking-wide text-center border transition-all border-dashed ${
              isDark
                ? "border-white/10 text-gray-500 hover:border-white/20 hover:text-white hover:bg-white/5"
                : "border-gray-200 text-gray-400 hover:border-gray-400 hover:text-gray-600"
            }`}
          >
            VIEW ALL LOGS
          </div>
        </div>
      </motion.div>
    );
  },
);

AlertsCard.displayName = "AlertsCard";
