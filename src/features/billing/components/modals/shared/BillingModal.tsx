"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { useEscapeKey } from "@/features/shared/hooks/useEscapeKey";

interface BillingModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string; // For overriding max-width etc.
  showCloseButton?: boolean;
}

export const BillingModal = React.memo(
  ({
    isOpen,
    onClose,
    children,
    className = "",
    showCloseButton = true,
  }: BillingModalProps) => {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      const timer = setTimeout(() => setMounted(true), 0);
      return () => clearTimeout(timer);
    }, []);

    // Keyboard accessibility: Esc to close
    useEscapeKey(onClose, isOpen);

    // Lock body scroll
    useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
      return () => {
        document.body.style.overflow = "";
      };
    }, [isOpen]);

    if (!mounted) return null;

    return createPortal(
      <AnimatePresence>
        {isOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center" // Ensure high z-index and positioning
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            // Focus self on mount to catch keys immediately
            ref={(node) => node?.focus()}
            style={{ outline: "none" }} // Hide focus ring
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={onClose}
            />

            {/* Modal Container */}
            <div className="relative z-10 w-full flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                className={`w-full relative pointer-events-auto rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col ${
                  isDark
                    ? "bg-[#0a0a0a] border border-white/10 shadow-cyan-900/20"
                    : "bg-white border border-gray-200 shadow-xl"
                } ${className}`}
                onClick={(e) => e.stopPropagation()}
              >
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className={`absolute right-4 top-4 z-50 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 hover:rotate-90 hover:scale-110 ${
                      isDark
                        ? "bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <X size={18} />
                  </button>
                )}
                {children}
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>,
      document.body,
    );
  },
);

BillingModal.displayName = "BillingModal";
