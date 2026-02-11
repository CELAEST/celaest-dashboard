"use client";

import React from "react";
import { motion } from "motion/react";
import { Globe } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { TaxRate } from "../../types";

interface TaxRatesCardProps {
  rates: TaxRate[];
  onManage: () => void;
  className?: string;
}

export const TaxRatesCard = React.memo(
  ({ rates, onManage, className }: TaxRatesCardProps) => {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className={`rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-2xl ${
          isDark
            ? "bg-[#09090b] border border-white/10 hover:border-blue-500/30"
            : "bg-white border border-gray-100 shadow-sm hover:shadow-md"
        } ${className || ""}`}
      >
        <div className="p-6 h-full flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  isDark
                    ? "bg-blue-500/10 text-blue-400"
                    : "bg-blue-100 text-blue-600"
                }`}
              >
                <Globe className="w-5 h-5" />
              </div>
              <h3
                className={`font-bold text-lg tracking-tight ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Tax Rates
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {rates.map((tax, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  className={`p-3 rounded-xl border transition-all duration-300 cursor-pointer text-center group ${
                    isDark
                      ? "bg-[#18181b] border-white/5 hover:border-cyan-500/50 hover:bg-cyan-950/20"
                      : "bg-gray-50 border-gray-200 hover:border-blue-500"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span
                      className={`font-bold text-sm ${
                        isDark
                          ? "text-gray-400 group-hover:text-white"
                          : "text-gray-700"
                      }`}
                    >
                      {tax.code}
                    </span>
                  </div>
                  <div
                    className={`text-2xl font-black tabular-nums mb-1 ${
                      isDark
                        ? "text-white group-hover:text-cyan-400"
                        : "text-blue-600"
                    }`}
                  >
                    {tax.rate}
                  </div>
                  <div className="text-[10px] uppercase font-bold tracking-widest opacity-40">
                    {tax.vatType}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <button
            onClick={onManage}
            className={`w-full py-4 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-lg active:translate-y-px ${
              isDark
                ? "bg-[#18181b] border border-white/10 text-gray-300 hover:bg-white/5 hover:text-white hover:border-white/20"
                : "bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            MANAGE RATES
          </button>
        </div>
      </motion.div>
    );
  },
);

TaxRatesCard.displayName = "TaxRatesCard";
