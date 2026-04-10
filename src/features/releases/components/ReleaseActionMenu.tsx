"use client";

import React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { PencilSimple, Archive, FileText } from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { Version } from "../types";

export interface ReleaseMenuState {
  id: string;
  x: number;
  y: number;
  align: "top" | "bottom";
}

interface ReleaseActionMenuProps {
  menuState: ReleaseMenuState | null;
  version: Version | null;
  onClose: () => void;
  onEdit: (version: Version) => void;
  onViewDetails: (version: Version) => void;
  onDeprecate: (id: string) => void;
}

export const ReleaseActionMenu: React.FC<ReleaseActionMenuProps> = ({
  menuState,
  version,
  onClose,
  onEdit,
  onViewDetails,
  onDeprecate,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  if (typeof window === "undefined" || !version) return null;

  const isOpen = !!menuState;
  const align = menuState?.align ?? "top";

  const items = [
    { icon: PencilSimple, label: "Edit Changelog", action: () => onEdit(version) },
    { icon: FileText, label: "View Details", action: () => onViewDetails(version) },
  ];

  return createPortal(
    <AnimatePresence>
      {isOpen && menuState && (
        <>
          <div className="fixed inset-0 z-99999" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: align === "top" ? -8 : 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: align === "top" ? -8 : 8 }}
            transition={{ duration: 0.15 }}
            style={{
              position: "fixed",
              left: menuState.x - 180,
              ...(align === "top"
                ? { top: menuState.y }
                : { bottom: menuState.y }),
              zIndex: 100000,
            }}
            className={`w-48 rounded-xl shadow-2xl border overflow-hidden ${
              isDark
                ? "bg-[#0a0a0a]/95 backdrop-blur-xl border-white/10"
                : "bg-white/95 backdrop-blur-xl border-white/20"
            }`}
          >
            <div className="p-1.5 flex flex-col gap-0.5">
              {items.map((item) => (
                <button
                  key={item.label}
                  onClick={() => { item.action(); onClose(); }}
                  className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg transition-colors w-full text-left ${
                    isDark
                      ? "hover:bg-white/10 text-gray-300"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <item.icon size={14} weight="duotone" />
                  {item.label}
                </button>
              ))}
              {version.status !== "deprecated" && (
                <button
                  onClick={() => { onDeprecate(version.id); onClose(); }}
                  className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg transition-colors w-full text-left ${
                    isDark
                      ? "hover:bg-red-500/10 text-red-400"
                      : "hover:bg-red-50 text-red-600"
                  }`}
                >
                  <Archive size={14} weight="duotone" />
                  Mark Deprecated
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
};
