"use client";

import React from "react";
import { motion } from "motion/react";
import { CreditCard } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

interface GatewayControlProps {
  onConfigure: () => void;
  className?: string;
}

export const GatewayControl = React.memo(
  ({ onConfigure, className }: GatewayControlProps) => {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className={`rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-2xl ${
          isDark
            ? "bg-[#09090b] border border-white/10 hover:border-cyan-500/30"
            : "bg-white border border-gray-100 shadow-sm hover:shadow-md"
        } ${className || ""}`}
      >
        <div className="p-6 h-full flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  isDark
                    ? "bg-cyan-500/10 text-cyan-400"
                    : "bg-blue-500/10 text-blue-600"
                }`}
              >
                <CreditCard className="w-5 h-5" />
              </div>
              <h3
                className={`font-bold text-lg tracking-tight ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Gateways
              </h3>
            </div>

            <div className="space-y-3">
              {/* Stripe */}
              <div
                className={`p-4 rounded-xl border transition-all duration-300 hover:scale-[1.02] cursor-pointer group ${
                  isDark
                    ? "bg-[#18181b] border-emerald-500/20 hover:border-emerald-500/50 hover:shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                    : "bg-emerald-50 border-emerald-200"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`font-bold ${
                      isDark ? "text-emerald-400" : "text-gray-900"
                    }`}
                  >
                    Stripe
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span
                      className={`text-[10px] font-black tracking-wider uppercase ${
                        isDark ? "text-emerald-500" : "text-emerald-700"
                      }`}
                    >
                      Active
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 font-mono text-[10px] opacity-60">
                  <div className="w-1.5 h-1.5 bg-current rounded-full" />
                  sk_live_...abc123
                </div>
              </div>

              {/* PayPal */}
              <div
                className={`p-4 rounded-xl border transition-all duration-300 hover:scale-[1.02] cursor-pointer group ${
                  isDark
                    ? "bg-[#18181b] border-white/5 hover:border-white/20"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`font-bold ${
                      isDark
                        ? "text-gray-400 group-hover:text-white transition-colors"
                        : "text-gray-700"
                    }`}
                  >
                    PayPal
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      isDark
                        ? "bg-white/5 text-gray-500 border border-white/5"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    Standby
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[10px] opacity-40">
                  <div className="w-1.5 h-1.5 bg-current rounded-full" />
                  ID: ...xyz789
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={onConfigure}
            className={`w-full py-4 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-lg active:translate-y-px ${
              isDark
                ? "bg-linear-to-r from-cyan-600 to-blue-600 text-white shadow-cyan-900/20 hover:shadow-cyan-500/20"
                : "bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-blue-500/30"
            }`}
          >
            CONFIGURE GATEWAYS
          </button>
        </div>
      </motion.div>
    );
  },
);

GatewayControl.displayName = "GatewayControl";
