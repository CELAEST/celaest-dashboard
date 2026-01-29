import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, AlertTriangle, ShieldAlert } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { useEscapeKey } from "@/features/shared/hooks/useEscapeKey";
import { Button } from "@/components/ui/button";

interface UserActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  actionType: "danger" | "warning" | "info";
  confirmText?: string;
  cancelText?: string;
}

export const UserActionModal: React.FC<UserActionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  actionType = "danger",
  confirmText = "Confirm",
  cancelText = "Cancel",
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const getColors = () => {
    switch (actionType) {
      case "danger":
        return {
          iconBg: isDark ? "bg-red-500/20" : "bg-red-100",
          iconColor: isDark ? "text-red-400" : "text-red-600",
          buttonBg: isDark
            ? "bg-red-500 hover:bg-red-600"
            : "bg-red-600 hover:bg-red-700",
          buttonText: "text-white",
        };
      case "warning":
        return {
          iconBg: isDark ? "bg-yellow-500/20" : "bg-yellow-100",
          iconColor: isDark ? "text-yellow-400" : "text-yellow-600",
          buttonBg: isDark
            ? "bg-yellow-500 hover:bg-yellow-600"
            : "bg-yellow-600 hover:bg-yellow-700",
          buttonText: "text-white",
        };
      default:
        return {
          iconBg: isDark ? "bg-blue-500/20" : "bg-blue-100",
          iconColor: isDark ? "text-blue-400" : "text-blue-600",
          buttonBg: isDark
            ? "bg-blue-500 hover:bg-blue-600"
            : "bg-blue-600 hover:bg-blue-700",
          buttonText: "text-white",
        };
    }
  };

  const colors = getColors();

  // Keyboard accessibility: Esc to close
  useEscapeKey(onClose, isOpen);

  return (
    <AnimatePresence>
      {isOpen && (
        <React.Fragment>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className={`pointer-events-auto w-full max-w-md overflow-hidden rounded-2xl border shadow-2xl relative ${
                isDark
                  ? "bg-[#0a0a0a]/90 border-white/10"
                  : "bg-white/90 border-white/20"
              } backdrop-blur-xl`}
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-full ${colors.iconBg} shrink-0`}>
                    {actionType === "danger" ? (
                      <AlertTriangle
                        className={`w-6 h-6 ${colors.iconColor}`}
                      />
                    ) : (
                      <ShieldAlert className={`w-6 h-6 ${colors.iconColor}`} />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3
                      className={`text-lg font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
                    >
                      {title}
                    </h3>
                    <p
                      className={`text-sm leading-relaxed ${isDark ? "text-gray-400" : "text-gray-600"}`}
                    >
                      {description}
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className={`p-1 rounded-full transition-colors ${
                      isDark
                        ? "hover:bg-white/10 text-gray-400"
                        : "hover:bg-gray-100 text-gray-500"
                    }`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mt-8 flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className={
                      isDark
                        ? "border-white/10 text-gray-300 hover:bg-white/5"
                        : ""
                    }
                  >
                    {cancelText}
                  </Button>
                  <Button
                    onClick={onConfirm}
                    className={`${colors.buttonBg} ${colors.buttonText} border-none`}
                  >
                    {confirmText}
                  </Button>
                </div>
              </div>

              {/* Decorative gradient line */}
              <div
                className={`h-1 w-full ${
                  actionType === "danger"
                    ? "bg-linear-to-r from-red-500 via-orange-500 to-red-500"
                    : "bg-linear-to-r from-blue-500 via-cyan-500 to-blue-500"
                }`}
              />
            </motion.div>
          </div>
        </React.Fragment>
      )}
    </AnimatePresence>
  );
};
