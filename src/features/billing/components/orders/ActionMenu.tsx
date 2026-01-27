"use client";

import React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { Eye, Download, Archive, Trash2, Edit } from "lucide-react";

interface ActionMenuProps {
  isOpen: boolean;
  position: { x: number; y: number };
  align?: "top" | "bottom";
  onClose: () => void;
  onAction: (action: string) => void;
  isDark: boolean;
}

export const ActionMenu = ({
  isOpen,
  position,
  align = "top",
  onClose,
  onAction,
  isDark,
}: ActionMenuProps) => {
  if (typeof window === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-99999" onClick={onClose} />
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
              y: align === "top" ? -10 : 10,
            }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: align === "top" ? -10 : 10,
            }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed",
              left: position.x - 180,
              ...(align === "top"
                ? { top: position.y }
                : { bottom: position.y }),
            }}
            className={`z-100000 w-48 rounded-xl shadow-2xl border overflow-hidden ${
              isDark
                ? "bg-[#0a0a0a]/90 backdrop-blur-xl border-white/10"
                : "bg-white/90 backdrop-blur-xl border-white/20"
            }`}
          >
            <div className="p-1.5 flex flex-col gap-0.5">
              {[
                {
                  icon: Eye,
                  label: "View Details",
                  action: "view",
                  color: isDark ? "text-gray-300" : "text-gray-700",
                },
                {
                  icon: Download,
                  label: "Download Invoice",
                  action: "download",
                  color: isDark ? "text-gray-300" : "text-gray-700",
                },
                {
                  icon: Edit,
                  label: "Edit Order",
                  action: "edit",
                  color: isDark ? "text-gray-300" : "text-gray-700",
                },
                {
                  icon: Archive,
                  label: "Archive",
                  action: "archive",
                  color: isDark ? "text-gray-300" : "text-gray-700",
                },
                {
                  icon: Trash2,
                  label: "Delete",
                  action: "delete",
                  color: "text-red-500",
                },
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={() => {
                    onAction(item.action);
                    onClose();
                  }}
                  className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                    isDark
                      ? `hover:bg-white/10 ${item.color}`
                      : `hover:bg-gray-100 ${item.color}`
                  }`}
                >
                  <item.icon size={14} />
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
};
