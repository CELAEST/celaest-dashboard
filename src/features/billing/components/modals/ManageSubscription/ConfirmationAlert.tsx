import React from "react";
import { Warning } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "@/features/shared/hooks/useTheme";

interface ConfirmationAlertProps {
  isVisible: boolean;
  type: "warning" | "danger";
  title: string;
  message: React.ReactNode;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationAlert: React.FC<ConfirmationAlertProps> = ({
  isVisible,
  type,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.2 }}
          className={`rounded-2xl p-5 border ${
            type === "danger"
              ? isDark
                ? "bg-red-500/[0.05] border-red-500/20"
                : "bg-red-50/70 border-red-200"
              : isDark
                ? "bg-amber-500/[0.05] border-amber-500/20"
                : "bg-amber-50/70 border-amber-200"
          }`}
        >
          <div className="flex items-start gap-3.5 mb-5">
            <div
              className={`p-2 rounded-xl shrink-0 ${
                type === "danger"
                  ? isDark
                    ? "bg-red-500/15 text-red-400"
                    : "bg-red-100 text-red-600"
                  : isDark
                    ? "bg-amber-500/15 text-amber-400"
                    : "bg-amber-100 text-amber-600"
              }`}
            >
              <Warning className="w-5 h-5" />
            </div>
            <div>
              <div
                className={`text-sm font-semibold tracking-tight mb-1 ${
                  isDark ? "text-zinc-100" : "text-gray-900"
                }`}
              >
                {title}
              </div>
              <div
                className={`text-xs leading-relaxed ${
                  isDark ? "text-zinc-400" : "text-gray-600"
                }`}
              >
                {message}
              </div>
            </div>
          </div>
          <div className="flex gap-2.5 justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-xl text-xs font-mono font-medium text-white/70 hover:text-white bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] transition-colors cursor-pointer"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider transition-colors cursor-pointer shadow-xs ${
                type === "danger"
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-amber-400 text-black hover:bg-amber-300"
              }`}
            >
              {confirmText}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
