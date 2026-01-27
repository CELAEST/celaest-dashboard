"use client";

import React from "react";
import { motion } from "motion/react";
import { CreditCard, CheckCircle } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

interface GatewayControlProps {
  onConfigure: () => void;
}

export const GatewayControl = React.memo(
  ({ onConfigure }: GatewayControlProps) => {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className={`rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl ${
          isDark
            ? "bg-black/40 backdrop-blur-xl border border-white/10"
            : "bg-white border border-gray-200 shadow-sm"
        }`}
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <CreditCard
              className={`w-5 h-5 ${isDark ? "text-cyan-400" : "text-blue-600"}`}
            />
            <h3
              className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
            >
              Payment Gateway Control
            </h3>
          </div>

          <div className="space-y-4">
            {/* Stripe */}
            <div
              className={`p-4 rounded-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
                isDark
                  ? "bg-emerald-500/5 border border-emerald-500/20"
                  : "bg-emerald-500/5 border border-emerald-500/20"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`font-semibold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Stripe Gateway
                </span>
                <span
                  className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 ${
                    isDark
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-emerald-500/20 text-emerald-600"
                  }`}
                >
                  <CheckCircle className="w-3 h-3" />
                  ACTIVE
                </span>
              </div>
              <p
                className={`text-xs font-mono ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`}
              >
                API Key: sk_live_**********************abc123
              </p>
            </div>

            {/* PayPal */}
            <div
              className={`p-4 rounded-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
                isDark
                  ? "bg-white/5 border border-white/10"
                  : "bg-gray-50 border border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`font-semibold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  PayPal Gateway
                </span>
                <span
                  className={`px-3 py-1 rounded-lg text-xs font-bold ${
                    isDark
                      ? "bg-gray-500/20 text-gray-400"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  STANDBY
                </span>
              </div>
              <p
                className={`text-xs font-mono ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`}
              >
                Client ID: **********************xyz789
              </p>
            </div>
          </div>

          <button
            onClick={onConfigure}
            className={`w-full mt-4 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] ${
              isDark
                ? "bg-linear-to-r from-cyan-400 to-blue-500 text-white shadow-lg shadow-cyan-500/30"
                : "bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
            }`}
          >
            Configure Payment Gateways
          </button>
        </div>
      </motion.div>
    );
  },
);

GatewayControl.displayName = "GatewayControl";
