"use client";

import React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  DownloadSimple,
  PencilSimple,
  ClockCounterClockwise,
  Copy,
  Eye,
  Trash,
} from "@phosphor-icons/react";
import { Asset } from "../services/assets.service";

export interface AssetMenuState {
  id: string;
  x: number;
  y: number;
  align: "top" | "bottom";
}

interface AssetActionMenuProps {
  menuState: AssetMenuState | null;
  asset: Asset | null;
  isDark: boolean;
  onClose: () => void;
  onDownload?: (asset: Asset) => void;
  onEdit: (asset: Asset) => void;
  onManageReleases?: (asset: Asset) => void;
  onDuplicate: (asset: Asset) => void;
  onPreview?: (asset: Asset) => void;
  onDelete: (id: string) => void;
}

export const AssetActionMenu: React.FC<AssetActionMenuProps> = ({
  menuState,
  asset,
  isDark,
  onClose,
  onDownload,
  onEdit,
  onManageReleases,
  onDuplicate,
  onPreview,
  onDelete,
}) => {
  if (typeof window === "undefined" || !asset) return null;

  const isOpen = !!menuState;
  const align = menuState?.align ?? "top";

  const items = [
    { icon: DownloadSimple, label: "Download Secure", action: () => onDownload?.(asset) },
    { icon: PencilSimple, label: "Edit Asset", action: () => onEdit(asset) },
    { icon: ClockCounterClockwise, label: "Manage Releases", action: () => onManageReleases?.(asset) },
    { icon: Copy, label: "Duplicate", action: () => onDuplicate(asset) },
    { icon: Eye, label: "Preview", action: () => onPreview?.(asset) },
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
              <button
                onClick={() => { onDelete(asset.id); onClose(); }}
                className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg transition-colors w-full text-left ${
                  isDark
                    ? "hover:bg-red-500/10 text-red-400"
                    : "hover:bg-red-50 text-red-600"
                }`}
              >
                <Trash size={14} weight="duotone" />
                Archive
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
};
