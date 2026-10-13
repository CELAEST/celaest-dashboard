"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { X } from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useEscapeKey } from "@/features/shared/hooks/useEscapeKey";
import { useSwipeDownToClose } from "@/features/shared/hooks/useSwipeDownToClose";
import { cn } from "@/lib/utils";

interface BillingModalContextType {
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchMove: (e: React.TouchEvent) => void;
  handleTouchEnd: () => void;
  handlePointerDown: (e: React.PointerEvent) => void;
  handlePointerMove: (e: React.PointerEvent) => void;
  handlePointerUp: () => void;
  bodyRef: React.RefObject<HTMLDivElement | null>;
  handleBodyTouchStart: (e: React.TouchEvent) => void;
  handleBodyTouchMove: (e: React.TouchEvent) => void;
  handleBodyTouchEnd: () => void;
}

export const BillingModalContext = React.createContext<BillingModalContextType | null>(null);

export const useBillingModalSwipe = () => React.useContext(BillingModalContext);

interface BillingModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string; // For overriding max-width etc.
  showCloseButton?: boolean;
  transparent?: boolean;
  showGrabHandle?: boolean;
}

export const BillingModal = React.memo(
  ({
    isOpen,
    onClose,
    children,
    className = "",
    showCloseButton = true,
    transparent = false,
    showGrabHandle = true,
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

    // Mobile Swipe-down-to-close with velocity & top-pull detection
    const {
      sheetRef,
      bodyRef,
      handlePillRef,
      handleTouchStart,
      handleTouchMove,
      handleTouchEnd,
      handlePointerDown,
      handlePointerMove,
      handlePointerUp,
      handleBodyTouchStart,
      handleBodyTouchMove,
      handleBodyTouchEnd,
      handlePillClick,
    } = useSwipeDownToClose({ onClose });

    if (!mounted) return null;

    const shouldShowGrab = showGrabHandle && !className?.includes("bg-transparent");

    return createPortal(
      <AnimatePresence>
        {isOpen && (
          <div
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-hidden"
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            ref={(node) => node?.focus()}
            style={{ outline: "none" }}
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={onClose}
            />

            {/* Modal Container: Lingua Mobile Bottom Sheet & Obsidian Luxury */}
            <div className="relative z-10 w-full flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none">
              <div
                ref={sheetRef}
                onClick={(e) => e.stopPropagation()}
                style={{ willChange: "transform", backfaceVisibility: "hidden" }}
                className={cn(
                  "w-full min-w-0 sm:min-w-112 max-w-4xl relative shrink-0 pointer-events-auto rounded-t-[26px] sm:rounded-3xl overflow-hidden shadow-2xl max-h-[92dvh] sm:max-h-[94vh] flex flex-col border-t sm:border border-white/[0.08] animate-modal-content",
                  isDark
                    ? "bg-[#09090b] shadow-2xl shadow-black/90"
                    : "bg-white border-gray-200 shadow-xl",
                  className
                )}
              >
                {/* Mobile Drag Handle Indicator (Lingua Standard) */}
                {shouldShowGrab && (
                  <div
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onClick={handlePillClick}
                    className="sm:hidden w-full flex items-center justify-center pt-2.5 pb-1 shrink-0 bg-[#0D0D11] select-none cursor-grab active:cursor-grabbing touch-none"
                    title="Desliza hacia abajo para cerrar"
                    role="button"
                    tabIndex={0}
                    aria-label="Deslizar hacia abajo para cerrar"
                  >
                    <div
                      ref={handlePillRef}
                      className="w-10 h-1.5 rounded-full bg-white/20 hover:bg-white/35 transition-all duration-150"
                    />
                  </div>
                )}

                {/* Tokyo Corner Accents (Dark Mode Desktop Only) */}
                <div className="hidden sm:block pointer-events-none">
                  <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white/10 rounded-tl-sm z-30" />
                  <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-white/10 rounded-tr-sm z-30" />
                  <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-white/10 rounded-bl-sm z-30" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white/10 rounded-br-sm z-30" />
                </div>

                {showCloseButton && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onClose();
                    }}
                    onTouchEnd={(e) => e.stopPropagation()}
                    onPointerDown={(e) => e.stopPropagation()}
                    aria-label="Cerrar modal"
                    className={`absolute right-4 top-4 z-50 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 hover:rotate-90 hover:scale-110 cursor-pointer ${
                      isDark
                        ? "bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <X size={18} />
                  </button>
                )}

                <BillingModalContext.Provider
                  value={{
                    handleTouchStart,
                    handleTouchMove,
                    handleTouchEnd,
                    handlePointerDown,
                    handlePointerMove,
                    handlePointerUp,
                    bodyRef,
                    handleBodyTouchStart,
                    handleBodyTouchMove,
                    handleBodyTouchEnd,
                  }}
                >
                  {children}
                </BillingModalContext.Provider>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>,
      document.body,
    );
  },
);

BillingModal.displayName = "BillingModal";
