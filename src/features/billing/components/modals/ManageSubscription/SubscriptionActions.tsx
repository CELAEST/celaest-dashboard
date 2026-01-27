import React from "react";
import { PauseCircle, XCircle, ArrowDownCircle } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

interface SubscriptionActionsProps {
  showPauseConfirm: boolean;
  showCancelConfirm: boolean;
  onTogglePause: () => void;
  onToggleCancel: () => void;
}

export const SubscriptionActions: React.FC<SubscriptionActionsProps> = ({
  showPauseConfirm,
  showCancelConfirm,
  onTogglePause,
  onToggleCancel,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {/* Pause Subscription */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={onTogglePause}
        className={`p-4 rounded-xl transition-all duration-300 group ${
          isDark
            ? "bg-orange-500/10 border border-orange-500/20 hover:bg-orange-500/20 hover:border-orange-500/40"
            : "bg-orange-500/10 border border-orange-500/20 hover:bg-orange-500/20 hover:border-orange-500/40 shadow-sm"
        } ${showPauseConfirm ? "ring-2 ring-orange-500/50" : ""}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-left">
            <PauseCircle className="w-5 h-5 text-orange-500" />
            <div>
              <div
                className={`font-bold text-sm ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Pause Subscription
              </div>
              <div
                className={`text-[10px] ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Temporarily pause billing
              </div>
            </div>
          </div>
          <ArrowDownCircle
            className={`w-4 h-4 text-orange-400 transition-transform duration-300 ${
              showPauseConfirm
                ? "rotate-180"
                : "opacity-0 group-hover:opacity-100"
            }`}
          />
        </div>
      </motion.button>

      {/* Cancel Subscription */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={onToggleCancel}
        className={`p-4 rounded-xl transition-all duration-300 group ${
          isDark
            ? "bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40"
            : "bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40 shadow-sm"
        } ${showCancelConfirm ? "ring-2 ring-red-500/50" : ""}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-left">
            <XCircle className="w-5 h-5 text-red-500" />
            <div>
              <div
                className={`font-bold text-sm ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Cancel Subscription
              </div>
              <div
                className={`text-[10px] ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                End your subscription
              </div>
            </div>
          </div>
          <ArrowDownCircle
            className={`w-4 h-4 text-red-400 transition-transform duration-300 ${
              showCancelConfirm
                ? "rotate-180"
                : "opacity-0 group-hover:opacity-100"
            }`}
          />
        </div>
      </motion.button>
    </div>
  );
};
