import React from "react";
import { Globe, Edit2, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { TaxRate } from "../../../types";

interface TaxRateListProps {
  taxRates: TaxRate[];
  setEditingId: (id: string | null) => void;
  handleDeleteTaxRate: (id: string) => void;
  handleToggleActive: (id: string) => void;
}

export const TaxRateList: React.FC<TaxRateListProps> = ({
  taxRates,
  setEditingId,
  handleDeleteTaxRate,
  handleToggleActive,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="space-y-3">
      {/* Grid Header */}
      <div className="hidden md:grid grid-cols-[1.5fr_80px_100px_80px_120px_90px] gap-4 px-4 pb-1">
        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
          Country/Region
        </div>
        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">
          Code
        </div>
        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">
          Tax Rate
        </div>
        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">
          Type
        </div>
        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">
          Status
        </div>
        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider text-right">
          Actions
        </div>
      </div>

      {taxRates.map((rate, index) => (
        <motion.div
          key={rate.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.3 }}
          whileHover={{ scale: 1.01, y: -2 }}
          className={`group rounded-2xl p-4 transition-all duration-300 ${
            isDark
              ? "bg-black/40 backdrop-blur-xl border border-white/10 hover:border-purple-500/30"
              : "bg-white/60 border border-gray-200 hover:border-purple-500/30 shadow-sm"
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-[1.5fr_80px_100px_80px_120px_90px] gap-4 items-center">
            {/* Country */}
            <div className="min-w-0">
              <div
                className={`text-[10px] font-bold mb-1 md:hidden ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`}
              >
                COUNTRY/REGION
              </div>
              <div
                className={`text-sm sm:text-base font-bold truncate ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {rate.country}
              </div>
            </div>

            {/* Code */}
            <div className="flex flex-col md:items-center">
              <div
                className={`text-[10px] font-bold mb-1 md:hidden ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`}
              >
                CODE
              </div>
              <div
                className={`px-2.5 py-1 rounded-lg font-mono font-bold text-xs inline-flex items-center justify-center ${
                  isDark
                    ? "bg-purple-500/10 border border-purple-500/20 text-purple-400"
                    : "bg-purple-500/10 border border-purple-500/20 text-purple-600"
                }`}
              >
                {rate.code}
              </div>
            </div>

            {/* Rate */}
            <div className="flex flex-col md:items-center">
              <div
                className={`text-[10px] font-bold mb-1 md:hidden ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`}
              >
                TAX RATE
              </div>
              <div
                className={`text-xl sm:text-2xl font-black ${
                  isDark ? "text-cyan-400" : "text-blue-600"
                }`}
              >
                {rate.rate}%
              </div>
            </div>

            {/* Type */}
            <div className="flex flex-col md:items-center">
              <div
                className={`text-[10px] font-bold mb-1 md:hidden ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`}
              >
                TYPE
              </div>
              <div
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                  isDark
                    ? "bg-white/5 text-gray-400"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {rate.vatType}
              </div>
            </div>

            {/* Status */}
            <div className="flex flex-col md:items-center">
              <div
                className={`text-[10px] font-bold mb-1 md:hidden ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`}
              >
                STATUS
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleToggleActive(rate.id)}
                className={`w-full md:w-auto px-3 py-1 rounded-lg text-[10px] font-bold transition-all duration-300 ${
                  rate.isActive
                    ? isDark
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 shadow-lg shadow-emerald-500/5"
                      : "bg-emerald-500/10 text-emerald-600 border border-emerald-200 hover:bg-emerald-500/20"
                    : isDark
                      ? "bg-gray-500/10 text-gray-400 border border-gray-500/20 hover:bg-gray-500/20"
                      : "bg-gray-500/10 text-gray-600 border border-gray-200 hover:bg-gray-500/20"
                }`}
              >
                {rate.isActive ? "ACTIVE" : "INACTIVE"}
              </motion.button>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 md:opacity-0 group-hover:opacity-100 transition-all duration-300">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setEditingId(rate.id)}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  isDark
                    ? "bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20"
                    : "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border border-blue-500/20"
                }`}
              >
                <Edit2 className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleDeleteTaxRate(rate.id)}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  isDark
                    ? "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20"
                    : "bg-red-500/10 text-red-600 hover:bg-red-500/20 border border-red-500/20"
                }`}
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Empty State */}
      {taxRates.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-center py-12 ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          <Globe className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <div className="text-base font-semibold mb-2">
            No tax rates configured
          </div>
          <div className="text-xs">Add your first tax rate to get started</div>
        </motion.div>
      )}
    </div>
  );
};
