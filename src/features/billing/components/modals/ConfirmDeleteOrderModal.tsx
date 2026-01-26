import { Trash2, AlertOctagon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { createPortal } from "react-dom";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

interface ConfirmDeleteOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  orderId: string;
}

export function ConfirmDeleteOrderModal({
  isOpen,
  onClose,
  onConfirm,
  orderId,
}: ConfirmDeleteOrderModalProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Ensure portal target exists
  if (typeof document === "undefined") return null;

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-99999"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-100000 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotateX: 15 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.9, rotateX: -15 }}
              transition={{ type: "spring", duration: 0.6, bounce: 0.4 }}
              className={`w-full max-w-md pointer-events-auto rounded-3xl shadow-2xl overflow-hidden relative ${
                isDark ? "bg-[#0a0a0a]" : "bg-white"
              }`}
            >
              {/* Red Gradient Glow Border Effect */}
              <div
                className={`absolute inset-0 p-px rounded-3xl pointer-events-none opacity-50 ${
                  isDark
                    ? "bg-linear-to-b from-red-500/50 to-transparent"
                    : "bg-linear-to-b from-red-500/30 to-transparent"
                }`}
              />

              {/* Content */}
              <div className="p-8 flex flex-col items-center text-center space-y-6 relative z-10">
                {/* Icon Container with Pulse */}
                <div className="relative">
                  <div
                    className={`absolute inset-0 rounded-full animate-ping opacity-20 ${
                      isDark ? "bg-red-500" : "bg-red-600"
                    }`}
                  />
                  <div
                    className={`relative p-4 rounded-2xl shadow-xl ${
                      isDark
                        ? "bg-linear-to-br from-red-500/20 to-red-900/20 border border-red-500/30 text-red-500"
                        : "bg-red-50 border border-red-100 text-red-600"
                    }`}
                  >
                    <AlertOctagon size={40} strokeWidth={1.5} />
                  </div>
                </div>

                <div className="space-y-2">
                  <h2
                    className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
                  >
                    Delete Order?
                  </h2>
                  <p
                    className={`text-sm leading-relaxed ${isDark ? "text-gray-400" : "text-gray-600"}`}
                  >
                    You are about to permanently delete order{" "}
                    <span
                      className={`font-mono font-bold px-1.5 py-0.5 rounded ${isDark ? "bg-white/10 text-white" : "bg-gray-100 text-gray-900"}`}
                    >
                      {orderId}
                    </span>
                    .
                    <br />
                    This action is irreversible.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full pt-2">
                  <button
                    onClick={onClose}
                    className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all active:scale-95 ${
                      isDark
                        ? "bg-white/5 hover:bg-white/10 text-gray-300 border border-white/5"
                        : "bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200"
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={onConfirm}
                    className={`px-4 py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-red-500/25 hover:scale-105 active:scale-95 ${
                      isDark
                        ? "bg-linear-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400"
                        : "bg-linear-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400"
                    }`}
                  >
                    <Trash2 size={18} />
                    Delete Forever
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
