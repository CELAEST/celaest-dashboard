"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
  useLayoutEffect,
} from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { Bell, Check, Trash } from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useNotifications } from "../contexts/NotificationContext";
import { NotificationItem } from "./NotificationCenter/NotificationItem";

interface PanelPosition {
  top: number;
  left: number;
  width: number;
  maxHeight: number;
}

const PANEL_GUTTER = 12;
const PANEL_DESIRED_WIDTH = 400;
const PANEL_MAX_HEIGHT = 640;

export const NotificationCenter = React.memo(function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [panelPosition, setPanelPosition] = useState<PanelPosition>({
    top: 0,
    left: 0,
    width: PANEL_DESIRED_WIDTH,
    maxHeight: PANEL_MAX_HEIGHT,
  });

  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const { theme } = useTheme();
  const {
    notifications,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    unreadCount,
  } = useNotifications();

  const isDark = theme === "dark";

  // Portal mount guard: createPortal needs document.body, which is only
  // available client-side. Tracking `mounted` avoids SSR mismatches. The
  // setState-in-effect pattern is the canonical SSR portal idiom, so we
  // silence the rule for this single line.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Compute panel coordinates relative to the bell button, clamped inside
  // the viewport so it can never be clipped by overflow:hidden parents.
  const updatePanelPosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const width = Math.min(PANEL_DESIRED_WIDTH, vw - PANEL_GUTTER * 2);

    // Right-align panel to the bell when there is room; otherwise clamp.
    let left = rect.right - width;
    if (left < PANEL_GUTTER) left = PANEL_GUTTER;
    if (left + width > vw - PANEL_GUTTER) left = vw - PANEL_GUTTER - width;

    const top = rect.bottom + 8;
    const maxHeight = Math.min(PANEL_MAX_HEIGHT, vh - top - PANEL_GUTTER);

    setPanelPosition({ top, left, width, maxHeight });
  }, []);

  useLayoutEffect(() => {
    if (!isOpen) return;
    updatePanelPosition();
    window.addEventListener("resize", updatePanelPosition);
    window.addEventListener("scroll", updatePanelPosition, true);
    return () => {
      window.removeEventListener("resize", updatePanelPosition);
      window.removeEventListener("scroll", updatePanelPosition, true);
    };
  }, [isOpen, updatePanelPosition]);

  // Click-outside considers both the trigger button and the portaled panel.
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        panelRef.current &&
        !panelRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Close on Escape for keyboard users
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen]);

  const bellButtonClassName = useMemo(
    () =>
      `relative flex items-center justify-center transition-all duration-300 cursor-pointer
      ${
        isDark
          ? "text-gray-400 hover:text-cyan-400"
          : "text-gray-500 hover:text-blue-600"
      }`,
    [isDark],
  );

  const panelClassName = useMemo(
    () =>
      `flex flex-col rounded-2xl border shadow-2xl overflow-hidden backdrop-blur-2xl
      ${
        isDark
          ? "bg-zinc-950/95 border-white/10 shadow-black/60"
          : "bg-white border-gray-200 shadow-gray-300/40"
      }`,
    [isDark],
  );

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        onClick={handleToggle}
        className={bellButtonClassName}
        aria-label="Abrir notificaciones"
        aria-expanded={isOpen}
      >
        <Bell className="w-5 h-5" />

        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center
              ${
                isDark
                  ? "bg-linear-to-br from-cyan-400 to-blue-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]"
                  : "bg-linear-to-br from-blue-600 to-indigo-600"
              }`}
          >
            <span className="text-[10px] font-bold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          </motion.div>
        )}
      </button>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <motion.div
                ref={panelRef}
                initial={{ opacity: 0, y: -10, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.97 }}
                transition={{ type: "spring", stiffness: 320, damping: 30 }}
                style={{
                  position: "fixed",
                  top: panelPosition.top,
                  left: panelPosition.left,
                  width: panelPosition.width,
                  maxHeight: panelPosition.maxHeight,
                  zIndex: 9999,
                }}
                className={panelClassName}
              >
                {/* Header */}
                <div
                  className={`px-5 pt-5 pb-4 border-b ${
                    isDark ? "border-white/10" : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3
                      className={`text-lg font-bold tracking-tight ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Notificaciones
                    </h3>
                    {unreadCount > 0 && (
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase
                        ${
                          isDark
                            ? "bg-cyan-500/10 text-cyan-300 ring-1 ring-cyan-400/20"
                            : "bg-blue-50 text-blue-600 ring-1 ring-blue-200"
                        }`}
                      >
                        {unreadCount} nuevas
                      </span>
                    )}
                  </div>

                  {notifications.length > 0 && (
                    <div className="flex gap-2">
                      <button
                        onClick={markAllAsRead}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors
                          ${
                            isDark
                              ? "bg-white/5 text-gray-300 hover:bg-white/10"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                      >
                        <Check className="w-4 h-4" />
                        Marcar todas
                      </button>
                      <button
                        onClick={clearAll}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors
                          ${
                            isDark
                              ? "bg-white/5 text-gray-300 hover:bg-white/10"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                      >
                        <Trash className="w-4 h-4" />
                        Limpiar
                      </button>
                    </div>
                  )}
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-6 py-12 text-center">
                      <div
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4
                        ${isDark ? "bg-white/5" : "bg-gray-100"}`}
                      >
                        <Bell
                          className={`w-8 h-8 ${
                            isDark ? "text-gray-600" : "text-gray-400"
                          }`}
                        />
                      </div>
                      <p
                        className={`font-medium ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        No hay notificaciones
                      </p>
                      <p
                        className={`text-sm mt-1 ${
                          isDark ? "text-gray-500" : "text-gray-500"
                        }`}
                      >
                        Te avisaremos cuando haya novedades
                      </p>
                    </div>
                  ) : (
                    <div
                      className={`divide-y ${
                        isDark ? "divide-white/5" : "divide-gray-100"
                      }`}
                    >
                      <AnimatePresence>
                        {notifications.map((notification) => (
                          <NotificationItem
                            key={notification.id}
                            notification={notification}
                            isDark={isDark}
                            onMarkAsRead={markAsRead}
                            onRemove={removeNotification}
                          />
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
});
