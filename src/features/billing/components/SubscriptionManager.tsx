import React from "react";
import { motion } from "motion/react";
import { Zap, TrendingUp, CheckCircle } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

export const SubscriptionManager: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const usedLicenses = 3;
  const totalLicenses = 5;
  const licensePercentage = (usedLicenses / totalLicenses) * 100;

  const usedApiCalls = 47800;
  const totalApiCalls = 100000;
  const apiPercentage = (usedApiCalls / totalApiCalls) * 100;

  return (
    <div
      className={`relative overflow-hidden rounded-3xl transition-all duration-500 hover:shadow-2xl ${
        isDark
          ? "bg-linear-to-br from-cyan-500/20 via-blue-500/20 to-indigo-500/20 backdrop-blur-xl border border-cyan-500/30"
          : "bg-linear-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-blue-500/30 shadow-xl"
      }`}
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className={`absolute inset-0 ${isDark ? "bg-cyan-400" : "bg-blue-500"}`}
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)`,
          }}
        />
      </div>

      <div className="relative p-8">
        {/* Badge */}
        <div className="flex items-center justify-between mb-6">
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm ${
              isDark
                ? "bg-cyan-400/20 border border-cyan-400/30 text-cyan-300"
                : "bg-blue-500/20 border border-blue-500/30 text-blue-700"
            }`}
          >
            <Zap className="w-4 h-4" />
            ACTIVE PLAN
          </div>
          <div
            className={`px-4 py-2 rounded-xl font-bold text-sm ${
              isDark
                ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-400"
                : "bg-emerald-500/20 border border-emerald-500/30 text-emerald-600"
            }`}
          >
            ACTIVE
          </div>
        </div>

        {/* Plan Details */}
        <div className="mb-8">
          <div
            className={`text-sm font-semibold tracking-wider mb-2 ${
              isDark ? "text-cyan-300" : "text-blue-700"
            }`}
          >
            BILLED MONTHLY
          </div>
          <h2
            className={`text-5xl font-bold tracking-tight mb-2 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Premium Tier
          </h2>
          <div className="flex items-baseline gap-2">
            <span
              className={`text-5xl font-bold ${
                isDark ? "text-cyan-400" : "text-blue-600"
              }`}
            >
              $299
            </span>
            <span
              className={`text-xl ${isDark ? "text-gray-400" : "text-gray-600"}`}
            >
              /mo
            </span>
          </div>
        </div>

        {/* Usage Metrics */}
        <div className="space-y-6 mb-6">
          {/* Active Licenses */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span
                className={`text-sm font-semibold flex items-center gap-2 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                Active Licenses
              </span>
              <span
                className={`text-sm font-bold ${
                  isDark ? "text-cyan-400" : "text-blue-600"
                }`}
              >
                {usedLicenses} / {totalLicenses}
              </span>
            </div>
            <div
              className={`h-3 rounded-full overflow-hidden ${
                isDark ? "bg-black/20" : "bg-white/50"
              }`}
            >
              <motion.div
                className="h-full bg-linear-to-r from-cyan-400 to-blue-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${licensePercentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <div
              className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}
            >
              {totalLicenses - usedLicenses} licenses available
            </div>
          </div>

          {/* API Calls */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span
                className={`text-sm font-semibold flex items-center gap-2 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                API Calls (This Month)
              </span>
              <span
                className={`text-sm font-bold ${
                  isDark ? "text-cyan-400" : "text-blue-600"
                }`}
              >
                {usedApiCalls.toLocaleString()} /{" "}
                {totalApiCalls.toLocaleString()}
              </span>
            </div>
            <div
              className={`h-3 rounded-full overflow-hidden ${
                isDark ? "bg-black/20" : "bg-white/50"
              }`}
            >
              <motion.div
                className="h-full bg-linear-to-r from-emerald-400 to-teal-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${apiPercentage}%` }}
                transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              />
            </div>
            <div
              className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}
            >
              {(totalApiCalls - usedApiCalls).toLocaleString()} calls remaining
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
              isDark
                ? "bg-linear-to-r from-cyan-400 to-blue-500 text-white shadow-lg shadow-cyan-500/50"
                : "bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
            }`}
          >
            Upgrade Plan
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              isDark
                ? "bg-white/10 border border-white/20 text-white hover:bg-white/20"
                : "bg-white/50 border border-gray-300 text-gray-900 hover:bg-white"
            }`}
          >
            Manage
          </motion.button>
        </div>
      </div>
    </div>
  );
};
