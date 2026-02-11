"use client";

import React from "react";
import { motion } from "motion/react";
import { CreditCard } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

import { PaymentGateway } from "../../types";

interface GatewayControlProps {
  onConfigure: () => void;
  gateways: PaymentGateway[];
  className?: string;
}

export const GatewayControl = React.memo(
  ({ onConfigure, gateways, className }: GatewayControlProps) => {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const getStatusColor = (status: string) => {
      switch (status) {
        case "active":
          return isDark ? "emerald" : "emerald";
        case "standby":
          return isDark ? "yellow" : "yellow";
        default:
          return isDark ? "gray" : "gray";
      }
    };

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
              {gateways.slice(0, 2).map((gateway) => {
                const color = getStatusColor(gateway.status);
                const isActive = gateway.status === "active";
                return (
                  <div
                    key={gateway.id}
                    className={`p-4 rounded-xl border transition-all duration-300 hover:scale-[1.02] cursor-pointer group ${
                      isDark
                        ? `bg-[#18181b] border-${color}-500/20 hover:border-${color}-500/50 hover:shadow-[0_0_15px_rgba(16,185,129,0.1)]`
                        : `bg-${color}-50 border-${color}-200`
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`font-bold ${
                          isDark ? `text-${color}-400` : "text-gray-900"
                        }`}
                      >
                        {gateway.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          {isActive && (
                            <span
                              className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-${color}-400 opacity-75`}
                            ></span>
                          )}
                          <span
                            className={`relative inline-flex rounded-full h-2 w-2 bg-${color}-500`}
                          ></span>
                        </span>
                        <span
                          className={`text-[10px] font-black tracking-wider uppercase ${
                            isDark ? `text-${color}-500` : `text-${color}-700`
                          }`}
                        >
                          {gateway.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-[10px] opacity-60">
                      <div className="w-1.5 h-1.5 bg-current rounded-full" />
                      {gateway.id === "stripe"
                        ? "sk_live_...xxxxxx"
                        : "ID: ...yyyyyy"}
                    </div>
                  </div>
                );
              })}
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
