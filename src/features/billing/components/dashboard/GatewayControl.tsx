"use client";

import React from "react";
import { motion } from "motion/react";
import { CreditCard } from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";

import { PaymentGateway } from "../../types";

interface GatewayControlProps {
  onConfigure: () => void;
  gateways: PaymentGateway[];
  className?: string;
}

const GATEWAY_STATUS_STYLES: Record<
  string,
  {
    darkCard: string;
    lightCard: string;
    darkTitle: string;
    dot: string;
    darkBadge: string;
    lightBadge: string;
  }
> = {
  active: {
    darkCard:
      "bg-[#18181b] border-emerald-500/20 hover:border-emerald-500/50 hover:shadow-[0_0_15px_rgba(16,185,129,0.1)]",
    lightCard: "bg-emerald-50 border-emerald-200",
    darkTitle: "text-emerald-400",
    dot: "bg-emerald-500",
    darkBadge: "text-emerald-500",
    lightBadge: "text-emerald-700",
  },
  standby: {
    darkCard: "bg-[#18181b] border-amber-500/20 hover:border-amber-500/50",
    lightCard: "bg-amber-50 border-amber-200",
    darkTitle: "text-amber-400",
    dot: "bg-amber-500",
    darkBadge: "text-amber-500",
    lightBadge: "text-amber-700",
  },
  disabled: {
    darkCard: "bg-[#18181b] border-white/10 hover:border-white/20",
    lightCard: "bg-gray-50 border-gray-200",
    darkTitle: "text-gray-400",
    dot: "bg-gray-500",
    darkBadge: "text-gray-400",
    lightBadge: "text-gray-600",
  },
};

function getGatewaySubtitle(id: string): string {
  switch (id) {
    case "creem":
      return "International · USD / EUR (MoR)";
    case "mercadopago":
      return "Colombia / LATAM · COP / PSE / Nequi";
    case "stripe":
      return "Disabled (STRIPE_ENABLED=false)";
    default:
      return `Gateway: ${id}`;
  }
}

export const GatewayControl = React.memo(
  ({ onConfigure, gateways, className }: GatewayControlProps) => {
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
              {gateways.map((gateway) => {
                const styles =
                  GATEWAY_STATUS_STYLES[gateway.status] ??
                  GATEWAY_STATUS_STYLES.disabled;
                const isActive = gateway.status === "active";
                return (
                  <div
                    key={gateway.id}
                    className={`p-4 rounded-xl border transition-all duration-300 hover:scale-[1.02] cursor-pointer group ${
                      isDark ? styles.darkCard : styles.lightCard
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`font-bold ${
                          isDark ? styles.darkTitle : "text-gray-900"
                        }`}
                      >
                        {gateway.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          {isActive && (
                            <span
                              className={`animate-ping absolute inline-flex h-full w-full rounded-full ${styles.dot} opacity-75`}
                            ></span>
                          )}
                          <span
                            className={`relative inline-flex rounded-full h-2 w-2 ${styles.dot}`}
                          ></span>
                        </span>
                        <span
                          className={`text-[10px] font-black tracking-wider uppercase ${
                            isDark ? styles.darkBadge : styles.lightBadge
                          }`}
                        >
                          {gateway.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-[10px] opacity-60">
                      <div className="w-1.5 h-1.5 bg-current rounded-full" />
                      {getGatewaySubtitle(gateway.id)}
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
