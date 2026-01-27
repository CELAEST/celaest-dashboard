"use client";

import React from "react";
import { motion } from "motion/react";
import { Globe } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { TaxRate } from "../../types";

interface TaxRatesCardProps {
  rates: TaxRate[];
  onManage: () => void;
}

export const TaxRatesCard = React.memo(
  ({ rates, onManage }: TaxRatesCardProps) => {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className={`rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl ${
          isDark
            ? "bg-black/40 backdrop-blur-xl border border-white/10"
            : "bg-white border border-gray-200 shadow-sm"
        }`}
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Globe
              className={`w-5 h-5 ${isDark ? "text-cyan-400" : "text-blue-600"}`}
            />
            <h3
              className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
            >
              Tax Rate Configuration by Country
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {rates.map((tax, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.02 }}
                className={`p-4 rounded-xl transition-all duration-300 cursor-pointer ${
                  isDark
                    ? "bg-white/5 border border-white/10 hover:border-cyan-500/30"
                    : "bg-gray-50 border border-gray-200 hover:border-blue-500/30"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`font-semibold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {tax.country}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      isDark
                        ? "bg-white/10 text-gray-400"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {tax.code}
                  </span>
                </div>
                <div
                  className={`text-2xl font-bold ${
                    isDark ? "text-cyan-400" : "text-blue-600"
                  }`}
                >
                  {tax.rate}
                </div>
                <div
                  className={`text-xs mt-1 ${
                    isDark ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  VAT/IVA
                </div>
              </motion.div>
            ))}
          </div>

          <button
            onClick={onManage}
            className={`w-full mt-4 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] ${
              isDark
                ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20"
                : "bg-blue-500/10 text-blue-600 border border-blue-500/20 hover:bg-blue-500/20"
            }`}
          >
            Manage Tax Rates
          </button>
        </div>
      </motion.div>
    );
  },
);

TaxRatesCard.displayName = "TaxRatesCard";
