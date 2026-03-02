"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { createPortal } from "react-dom";
import { RotateCcw, AlertTriangle, X } from "lucide-react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useEscapeKey } from "@/features/shared/hooks/useEscapeKey";

interface RefundConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  orderDisplayId: string;
  orderAmount: string;
  isLoading?: boolean;
}

const REFUND_REASONS = [
  "Customer requested",
  "Duplicate order",
  "Product not delivered",
  "Defective product",
  "Wrong item shipped",
  "Other",
] as const;

export const RefundConfirmModal: React.FC<RefundConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  orderDisplayId,
  orderAmount,
  isLoading = false,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [reason, setReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEscapeKey(onClose, isOpen);

  const handleConfirm = () => {
    const finalReason = reason === "Other" ? customReason : reason;
    if (!finalReason.trim()) return;
    onConfirm(finalReason);
  };

  const isValid = reason && (reason !== "Other" || customReason.trim());

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
            className={`relative z-10 w-full max-w-md mx-4 rounded-2xl overflow-hidden shadow-2xl ${
              isDark
                ? "bg-[#0c0c0c] border border-white/10"
                : "bg-white border border-gray-200"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className={`absolute right-3 top-3 z-10 w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:rotate-90 ${
                isDark
                  ? "hover:bg-white/10 text-gray-500 hover:text-white"
                  : "hover:bg-gray-100 text-gray-400 hover:text-gray-700"
              }`}
            >
              <X size={16} />
            </button>

            {/* Header */}
            <div
              className={`p-6 pb-4 border-b ${isDark ? "border-white/5" : "border-gray-100"}`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`p-2.5 rounded-xl ${
                    isDark
                      ? "bg-amber-500/10 border border-amber-500/20"
                      : "bg-amber-50 border border-amber-200"
                  }`}
                >
                  <AlertTriangle size={20} className="text-amber-500" />
                </div>
                <div>
                  <h3
                    className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-900"}`}
                  >
                    Refund Order
                  </h3>
                  <p
                    className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}
                  >
                    This action cannot be undone
                  </p>
                </div>
              </div>

              <div
                className={`mt-3 p-3 rounded-xl text-sm ${
                  isDark
                    ? "bg-white/5 text-gray-300"
                    : "bg-gray-50 text-gray-600"
                }`}
              >
                Order <span className="font-bold">{orderDisplayId}</span> — Full
                refund of{" "}
                <span className="font-bold text-amber-500">{orderAmount}</span>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <label
                className={`block text-sm font-semibold ${isDark ? "text-gray-300" : "text-gray-700"}`}
              >
                Refund Reason
              </label>

              <div className="grid grid-cols-2 gap-2">
                {REFUND_REASONS.map((r) => (
                  <button
                    key={r}
                    onClick={() => setReason(r)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium transition-all border ${
                      reason === r
                        ? isDark
                          ? "bg-amber-500/15 border-amber-500/40 text-amber-400"
                          : "bg-amber-50 border-amber-300 text-amber-700"
                        : isDark
                          ? "bg-white/3 border-white/10 text-gray-400 hover:border-white/20 hover:text-gray-300"
                          : "bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              {reason === "Other" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <textarea
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    placeholder="Describe the reason for this refund..."
                    rows={3}
                    className={`w-full px-4 py-3 rounded-xl text-sm resize-none border focus:outline-none focus:ring-2 ${
                      isDark
                        ? "bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:ring-amber-500/30"
                        : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:ring-amber-500/30"
                    }`}
                  />
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div
              className={`px-6 py-4 border-t flex justify-end gap-3 ${
                isDark ? "border-white/5" : "border-gray-100"
              }`}
            >
              <button
                onClick={onClose}
                disabled={isLoading}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  isDark
                    ? "text-gray-400 hover:text-white hover:bg-white/5"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={!isValid || isLoading}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold text-white flex items-center gap-2 transition-all shadow-lg hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 ${
                  isDark
                    ? "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-amber-500/20"
                    : "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-amber-500/20"
                }`}
              >
                <RotateCcw
                  size={16}
                  className={isLoading ? "animate-spin" : ""}
                />
                {isLoading ? "Processing..." : "Confirm Refund"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
};
