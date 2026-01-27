import React from "react";
import { motion } from "motion/react";
import { Zap, TrendingUp, CheckCircle, Sparkles } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { ManageSubscriptionModal } from "./modals/ManageSubscriptionModal";
import { UpgradePlanModal } from "./modals/UpgradePlanModal";

export const SubscriptionManager: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = React.useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = React.useState(false);

  const usedLicenses = 3;
  const totalLicenses = 5;
  const licensePercentage = (usedLicenses / totalLicenses) * 100;

  const usedApiCalls = 47800;
  const totalApiCalls = 100000;
  const apiPercentage = (usedApiCalls / totalApiCalls) * 100;

  return (
    <>
      <div
        className={`relative w-full rounded-3xl transition-all duration-500 hover:shadow-2xl overflow-hidden ${
          isDark
            ? "bg-linear-to-br from-cyan-900/40 via-blue-900/20 to-indigo-900/40 backdrop-blur-2xl border border-cyan-500/20"
            : "bg-linear-to-br from-blue-50 to-indigo-50 border border-blue-200 shadow-xl"
        }`}
      >
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div
            className={`absolute inset-0 ${isDark ? "bg-cyan-500/10" : "bg-blue-400/5"}`}
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, ${isDark ? "rgba(6,182,212,0.15)" : "rgba(59,130,246,0.15)"} 1px, transparent 0)`,
              backgroundSize: "24px 24px",
            }}
          />
        </div>

        {/* Shine Effect Overlay */}
        <div className="absolute inset-0 bg-linear-to-tr from-white/5 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        <div className="relative p-6 sm:p-8 flex flex-col h-full">
          {/* Badge Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-bold text-xs tracking-wide shadow-sm ${
                isDark
                  ? "bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 shadow-cyan-900/20"
                  : "bg-blue-100 border border-blue-200 text-blue-700"
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>ACTIVE PLAN</span>
            </div>
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-xs tracking-wide shadow-sm ${
                isDark
                  ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-emerald-900/20"
                  : "bg-emerald-100 border border-emerald-200 text-emerald-700"
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              ACTIVE
            </div>
          </div>

          {/* Plan Details */}
          <div className="mb-8">
            <div
              className={`text-sm font-bold tracking-widest uppercase mb-3 ${
                isDark ? "text-cyan-200/70" : "text-blue-600/80"
              }`}
            >
              Billed Monthly
            </div>
            <h2
              className={`text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4 ${
                isDark
                  ? "text-transparent bg-clip-text bg-linear-to-r from-white via-cyan-100 to-blue-200 drop-shadow-sm"
                  : "text-slate-900"
              }`}
            >
              Premium Tier
            </h2>
            <div className="flex items-baseline gap-2">
              <span
                className={`text-4xl sm:text-5xl font-black ${
                  isDark
                    ? "text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                    : "text-blue-600"
                }`}
              >
                $299
              </span>
              <span
                className={`text-lg sm:text-xl font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}
              >
                /mo
              </span>
            </div>
          </div>

          {/* Usage Metrics */}
          <div className="space-y-8 mb-8 grow">
            {/* Active Licenses */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`text-sm font-semibold flex items-center gap-2 ${
                    isDark ? "text-slate-200" : "text-slate-700"
                  }`}
                >
                  <CheckCircle
                    className={`w-4 h-4 ${isDark ? "text-emerald-400" : "text-emerald-500"}`}
                  />
                  Active Licenses
                </span>
                <span
                  className={`text-sm font-bold ${
                    isDark ? "text-cyan-300" : "text-blue-600"
                  }`}
                >
                  {usedLicenses}{" "}
                  <span className="text-slate-500">/ {totalLicenses}</span>
                </span>
              </div>
              <div
                className={`h-4 rounded-full overflow-hidden p-1 ${
                  isDark
                    ? "bg-slate-900/50 box-inner shadow-inner"
                    : "bg-slate-100 shadow-inner"
                }`}
              >
                <motion.div
                  className="h-full bg-linear-to-r from-cyan-500 to-blue-600 rounded-full relative"
                  initial={{ width: 0 }}
                  animate={{ width: `${licensePercentage}%` }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  style={{
                    boxShadow: isDark ? "0 0 12px rgba(6,182,212,0.5)" : "none",
                  }}
                >
                  {/* Shimmer on bar */}
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent w-full -translate-x-full animate-[shimmer_2s_infinite]" />
                </motion.div>
              </div>
              <div
                className={`text-xs mt-2 font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}
              >
                {totalLicenses - usedLicenses} licenses available
              </div>
            </div>

            {/* API Calls */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`text-sm font-semibold flex items-center gap-2 ${
                    isDark ? "text-slate-200" : "text-slate-700"
                  }`}
                >
                  <TrendingUp
                    className={`w-4 h-4 ${isDark ? "text-emerald-400" : "text-emerald-500"}`}
                  />
                  API Calls
                </span>
                <span
                  className={`text-sm font-bold ${
                    isDark ? "text-cyan-300" : "text-blue-600"
                  }`}
                >
                  {usedApiCalls.toLocaleString()}
                </span>
              </div>
              <div
                className={`h-4 rounded-full overflow-hidden p-1 ${
                  isDark
                    ? "bg-slate-900/50 shadow-inner"
                    : "bg-slate-100 shadow-inner"
                }`}
              >
                <motion.div
                  className="h-full bg-linear-to-r from-emerald-400 to-teal-500 rounded-full relative"
                  initial={{ width: 0 }}
                  animate={{ width: `${apiPercentage}%` }}
                  transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
                  style={{
                    boxShadow: isDark
                      ? "0 0 12px rgba(52,211,153,0.5)"
                      : "none",
                  }}
                >
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent w-full -translate-x-full animate-[shimmer_2s_infinite]" />
                </motion.div>
              </div>
              <div
                className={`text-xs mt-2 font-medium flex justify-between ${isDark ? "text-slate-400" : "text-slate-500"}`}
              >
                <span>
                  {(totalApiCalls - usedApiCalls).toLocaleString()} remaining
                </span>
                <span>Cap: {totalApiCalls.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-auto">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsUpgradeModalOpen(true)}
              className={`relative overflow-hidden flex-1 py-3.5 px-6 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 group ${
                isDark
                  ? "bg-linear-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] border border-cyan-400/20"
                  : "bg-linear-to-r from-blue-600 to-indigo-700 text-white shadow-lg hover:shadow-xl shadow-blue-500/30"
              }`}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" />
                UPGRADE PLAN
              </span>
              {/* Button Shine Animation */}
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsManageModalOpen(true)}
              className={`px-6 py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 ${
                isDark
                  ? "bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
              }`}
            >
              Manage
            </motion.button>
          </div>
        </div>
      </div>

      <ManageSubscriptionModal
        isOpen={isManageModalOpen}
        onClose={() => setIsManageModalOpen(false)}
      />

      <UpgradePlanModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />
    </>
  );
};
