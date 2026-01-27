import React from "react";
import { AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

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
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className={`rounded-2xl p-6 ring-2 ${
            type === "danger"
              ? isDark
                ? "ring-red-500/20 bg-red-500/10 border border-red-500/30 shadow-2xl shadow-red-500/10"
                : "ring-red-500/20 bg-red-50/50 border border-red-200 shadow-xl"
              : isDark
                ? "ring-orange-500/20 bg-orange-500/10 border border-orange-500/30 shadow-2xl shadow-orange-500/10"
                : "ring-orange-500/20 bg-orange-50/50 border border-orange-200 shadow-xl"
          }`}
        >
          <div className="flex items-start gap-4 mb-6">
            <div
              className={`p-3 rounded-xl ${
                type === "danger" ? "bg-red-500/20" : "bg-orange-500/20"
              }`}
            >
              <AlertTriangle
                className={`w-6 h-6 ${
                  type === "danger" ? "text-red-500" : "text-orange-500"
                }`}
              />
            </div>
            <div>
              <div
                className={`text-lg font-black mb-2 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {title}
              </div>
              <div
                className={`text-xs leading-relaxed ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {message}
              </div>
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onCancel}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                isDark
                  ? "bg-white/5 border border-white/10 text-white hover:bg-white/10"
                  : "bg-gray-100 border border-gray-200 text-gray-900 hover:bg-gray-200"
              }`}
            >
              {cancelText}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onConfirm}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 shadow-xl ${
                type === "danger"
                  ? "bg-red-600 text-white hover:bg-red-500 shadow-red-600/20"
                  : "bg-orange-600 text-white hover:bg-orange-500 shadow-orange-600/20"
              }`}
            >
              {confirmText}
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
