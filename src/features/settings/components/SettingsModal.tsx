"use client";

import React, { useEffect, useCallback } from "react";
import { X } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import type { SettingsModalProps } from "../types";

/**
 * Modal for settings dialogs with dark theme.
 */
export function SettingsModal({
  isOpen,
  onClose,
  title,
  children,
}: SettingsModalProps) {
  const { isDark } = useTheme();

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleEscape);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 backdrop-blur-sm transition-all duration-500 ${
          isDark ? "bg-black/80" : "bg-gray-900/40"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div
        className={`relative rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl transition-all duration-300 animate-in fade-in zoom-in ${
          isDark
            ? "bg-[#0a0a0a] border border-white/10 shadow-black/50"
            : "bg-white border border-gray-200 shadow-gray-400/20"
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <h3
            className={`text-xl font-bold tracking-tight ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {title}
          </h3>
          <button
            onClick={onClose}
            className={`transition-colors p-1 rounded-lg ${
              isDark
                ? "text-gray-500 hover:text-white hover:bg-white/5"
                : "text-gray-400 hover:text-gray-900 hover:bg-gray-100"
            }`}
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
