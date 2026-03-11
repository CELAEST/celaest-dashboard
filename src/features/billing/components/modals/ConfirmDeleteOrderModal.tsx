"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { Warning, Trash } from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useEscapeKey } from "@/features/shared/hooks/useEscapeKey";

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEscapeKey(onClose, isOpen);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.7)",
              backdropFilter: "blur(4px)",
            }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
            style={{
              position: "relative",
              zIndex: 10,
              width: "100%",
              maxWidth: "28rem",
              margin: "0 1rem",
              borderRadius: "1rem",
              overflow: "hidden",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
              background: isDark ? "#0c0c0c" : "#ffffff",
              border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e5e7eb",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Red top glow accent */}
            <div
              className={`absolute inset-x-0 top-0 h-px ${
                isDark
                  ? "bg-gradient-to-r from-transparent via-red-500/60 to-transparent"
                  : "bg-gradient-to-r from-transparent via-red-400/40 to-transparent"
              }`}
            />

            {/* Content */}
            <div className="p-8 flex flex-col items-stretch text-center space-y-6">
              {/* Icon */}
              <div className="relative mx-auto">
                <div
                  className={`absolute inset-0 rounded-full animate-ping opacity-20 ${
                    isDark ? "bg-red-500" : "bg-red-600"
                  }`}
                />
                <div
                  className={`relative p-4 rounded-2xl shadow-xl ${
                    isDark
                      ? "bg-gradient-to-br from-red-500/20 to-red-900/20 border border-red-500/30 text-red-500"
                      : "bg-red-50 border border-red-100 text-red-600"
                  }`}
                >
                  <Warning size={40} weight="fill" />
                </div>
              </div>

              <div className="w-full space-y-2">
                <h2
                  className={`text-2xl font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Delete Order?
                </h2>
                <p
                  className={`text-sm leading-relaxed ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  You are about to permanently delete order{" "}
                  <span
                    className={`font-mono font-bold px-1.5 py-0.5 rounded ${
                      isDark
                        ? "bg-white/10 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
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
                  autoFocus
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
                      ? "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400"
                      : "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400"
                  }`}
                >
                  <Trash size={18} />
                  Delete Forever
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
