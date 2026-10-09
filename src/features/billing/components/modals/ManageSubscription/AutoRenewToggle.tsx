import React from "react";
import { ArrowClockwise } from "@phosphor-icons/react";
import { motion } from "motion/react";
import { useTheme } from "@/features/shared/hooks/useTheme";

interface AutoRenewToggleProps {
  autoRenew: boolean;
  renewalDate: string;
  onToggle?: () => void;
  disabled?: boolean;
}

export const AutoRenewToggle: React.FC<AutoRenewToggleProps> = ({
  autoRenew,
  renewalDate,
  onToggle,
  disabled = false,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.15 }}
      className={`p-4 sm:p-5 rounded-xl border transition-colors ${
        disabled
          ? isDark
            ? "bg-white/[0.01] border-white/4 opacity-50 cursor-not-allowed"
            : "bg-gray-50 border-gray-100 opacity-50 cursor-not-allowed"
          : isDark
            ? "bg-white/[0.02] border-white/6 hover:border-white/12"
            : "bg-white border-gray-200 hover:border-gray-300 shadow-xs"
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border transition-colors ${
              isDark
                ? "bg-white/[0.04] border-white/8 text-white/60"
                : "bg-gray-100 border-gray-200 text-gray-600"
            }`}
          >
            <ArrowClockwise className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div
              className={`text-sm font-semibold tracking-tight ${
                isDark ? "text-zinc-100" : "text-gray-900"
              }`}
            >
              Auto-Renewal
            </div>
            <div
              className={`text-[11px] font-mono truncate ${
                isDark ? "text-white/40" : "text-gray-500"
              }`}
            >
              Automatically renew on {renewalDate}
            </div>
          </div>
        </div>

        <button
          onClick={disabled ? undefined : onToggle}
          disabled={disabled}
          type="button"
          className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 cursor-pointer ${
            disabled
              ? "opacity-50 cursor-not-allowed bg-white/10"
              : autoRenew
                ? isDark
                  ? "bg-white"
                  : "bg-gray-900"
                : isDark
                  ? "bg-white/10 border border-white/10"
                  : "bg-gray-200"
          }`}
        >
          <motion.div
            animate={{ x: autoRenew ? 22 : 2 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className={`w-5 h-5 rounded-full shadow-xs ${
              autoRenew
                ? isDark
                  ? "bg-black"
                  : "bg-white"
                : isDark
                  ? "bg-zinc-400"
                  : "bg-white"
            }`}
          />
        </button>
      </div>
    </motion.div>
  );
};
