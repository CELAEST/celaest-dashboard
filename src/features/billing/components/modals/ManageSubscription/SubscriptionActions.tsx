import React from "react";
import { PauseCircle, XCircle, CaretDown } from "@phosphor-icons/react";
import { motion } from "motion/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useTranslations } from "next-intl";

interface SubscriptionActionsProps {
  showPauseConfirm: boolean;
  showCancelConfirm: boolean;
  onTogglePause?: () => void;
  onToggleCancel?: () => void;
  disabled?: boolean;
}

export const SubscriptionActions: React.FC<SubscriptionActionsProps> = ({
  showPauseConfirm,
  showCancelConfirm,
  onTogglePause,
  onToggleCancel,
  disabled = false,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const t = useTranslations("billing");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {/* Pause Subscription */}
      <motion.button
        type="button"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        onClick={disabled ? undefined : onTogglePause}
        className={`p-3.5 rounded-xl border transition-colors group cursor-pointer text-left ${
          disabled
            ? "bg-white/[0.01] border-white/4 opacity-50 cursor-not-allowed"
            : showPauseConfirm
              ? isDark
                ? "bg-amber-500/10 border-amber-500/30"
                : "bg-amber-50 border-amber-300"
              : isDark
                ? "bg-white/[0.02] border-white/6 hover:border-amber-500/20 hover:bg-white/[0.035]"
                : "bg-white border-gray-200 hover:border-gray-300 shadow-xs"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border transition-colors ${
                isDark
                  ? "bg-white/[0.03] border-white/6 text-amber-400"
                  : "bg-amber-50 border-amber-200 text-amber-600"
              }`}
            >
              <PauseCircle className="w-4 h-4" />
            </div>
            <div>
              <div
                className={`font-semibold text-xs ${
                  isDark ? "text-zinc-100" : "text-gray-900"
                }`}
              >
                {t("pause_subscription")}
              </div>
              <div
                className={`text-[10px] font-mono ${
                  isDark ? "text-white/40" : "text-gray-500"
                }`}
              >
                {t("temporarily_pause_billing")}
              </div>
            </div>
          </div>
          <CaretDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              isDark ? "text-white/40" : "text-gray-400"
            } ${showPauseConfirm ? "rotate-180" : ""}`}
          />
        </div>
      </motion.button>

      {/* Cancel Subscription */}
      <motion.button
        type="button"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.25 }}
        onClick={disabled ? undefined : onToggleCancel}
        className={`p-3.5 rounded-xl border transition-colors group cursor-pointer text-left ${
          disabled
            ? "bg-white/[0.01] border-white/4 opacity-50 cursor-not-allowed"
            : showCancelConfirm
              ? isDark
                ? "bg-red-500/10 border-red-500/30"
                : "bg-red-50 border-red-300"
              : isDark
                ? "bg-white/[0.02] border-white/6 hover:border-red-500/20 hover:bg-white/[0.035]"
                : "bg-white border-gray-200 hover:border-gray-300 shadow-xs"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border transition-colors ${
                isDark
                  ? "bg-white/[0.03] border-white/6 text-red-400"
                  : "bg-red-50 border-red-200 text-red-600"
              }`}
            >
              <XCircle className="w-4 h-4" />
            </div>
            <div>
              <div
                className={`font-semibold text-xs ${
                  isDark ? "text-zinc-100" : "text-gray-900"
                }`}
              >
                {t("cancel_subscription")}
              </div>
              <div
                className={`text-[10px] font-mono ${
                  isDark ? "text-white/40" : "text-gray-500"
                }`}
              >
                {t("end_your_subscription")}
              </div>
            </div>
          </div>
          <CaretDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              isDark ? "text-white/40" : "text-gray-400"
            } ${showCancelConfirm ? "rotate-180" : ""}`}
          />
        </div>
      </motion.button>
    </div>
  );
};
