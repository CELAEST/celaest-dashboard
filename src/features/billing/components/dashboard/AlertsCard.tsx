"use client";

import React from "react";
import { motion } from "motion/react";
import { AlertCircle } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

interface AlertsCardProps {
  pendingRefunds: number;
  failedPayments: number;
}

export const AlertsCard = React.memo(
  ({ pendingRefunds, failedPayments }: AlertsCardProps) => {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className={`rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl ${
          isDark
            ? "bg-black/40 backdrop-blur-xl border border-white/10"
            : "bg-white border border-gray-200 shadow-sm"
        }`}
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <AlertCircle className="w-5 h-5 text-orange-500" />
            <h3
              className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
            >
              Critical Alerts
            </h3>
          </div>

          <div className="space-y-4">
            {/* Pending Refunds */}
            <div
              className={`p-4 rounded-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
                isDark
                  ? "bg-linear-to-r from-orange-500/10 to-yellow-500/10 border border-orange-500/20"
                  : "bg-linear-to-r from-orange-500/5 to-yellow-500/5 border border-orange-500/20"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div
                    className={`font-semibold mb-1 ${
                      isDark ? "text-orange-400" : "text-orange-600"
                    }`}
                  >
                    Pending Refunds
                  </div>
                  <div
                    className={`text-xs ${
                      isDark ? "text-orange-400/70" : "text-orange-600/70"
                    }`}
                  >
                    {pendingRefunds} requests awaiting approval
                  </div>
                </div>
                <div
                  className={`text-3xl font-bold ${
                    isDark ? "text-orange-400" : "text-orange-600"
                  }`}
                >
                  {pendingRefunds}
                </div>
              </div>
            </div>

            {/* Failed Payments */}
            <div
              className={`p-4 rounded-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
                isDark
                  ? "bg-linear-to-r from-red-500/10 to-pink-500/10 border border-red-500/20"
                  : "bg-linear-to-r from-red-500/5 to-pink-500/5 border border-red-500/20"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div
                    className={`font-semibold mb-1 ${
                      isDark ? "text-red-400" : "text-red-600"
                    }`}
                  >
                    Failed Recurring Payments
                  </div>
                  <div
                    className={`text-xs ${
                      isDark ? "text-red-400/70" : "text-red-600/70"
                    }`}
                  >
                    Customers requiring intervention
                  </div>
                </div>
                <div
                  className={`text-3xl font-bold ${
                    isDark ? "text-red-400" : "text-red-600"
                  }`}
                >
                  {failedPayments}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  },
);

AlertsCard.displayName = "AlertsCard";
