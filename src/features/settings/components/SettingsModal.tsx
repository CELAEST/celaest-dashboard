"use client";

import React, { useEffect } from "react";
import { X } from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useEscapeKey } from "@/features/shared/hooks/useEscapeKey";
import { createPortal } from "react-dom";
import type { SettingsModalProps } from "../types";
import { cn } from "@/lib/utils";

/**
 * Modal for settings dialogs with dark theme.
 */
export function SettingsModal({
  isOpen,
  onClose,
  title,
  children,
  className,
}: SettingsModalProps) {
  const { isDark } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Keyboard accessibility: Esc to close
  useEscapeKey(onClose, isOpen);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-100 flex items-end sm:items-center justify-center p-0 sm:p-4">
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
        className={cn(
          "relative shrink-0 w-full sm:w-112 max-w-full sm:max-w-[95vw] min-w-[320px] sm:min-w-112 overflow-y-auto shadow-2xl transition-all duration-300 animate-in fade-in",
          // Mobile layout (< sm)
          "rounded-t-2xl rounded-b-none border-t border-x border-b-0 p-6 pb-8 max-h-[85vh] slide-in-from-bottom",
          // Desktop layout (>= sm)
          "sm:rounded-2xl sm:border sm:p-6 sm:max-h-[90vh] sm:zoom-in sm:slide-in-from-bottom-0",
          isDark
            ? "bg-[#0a0a0a] border-white/10 shadow-black/50"
            : "bg-white border-gray-200 shadow-gray-400/20",
          className
        )}
      >
        <div className="mx-auto h-1.5 w-12 rounded-full bg-muted-foreground/20 sm:hidden -mt-3 mb-3" />
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
    </div>,
    document.body
  );
}
