"use client";

import React from "react";
import { motion } from "motion/react";
import { Trash, WarningCircle } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { useSwipeDownToClose } from "@/features/shared/hooks/useSwipeDownToClose";

interface ConfirmArchiveModalProps {
  isOpen: boolean;
  assetName: string;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmArchiveModal: React.FC<ConfirmArchiveModalProps> = ({
  isOpen,
  assetName,
  isDeleting,
  onConfirm,
  onCancel,
}) => {
  const t = useTranslations("marketplace");

  const {
    sheetRef,
    handlePillRef,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePillClick,
  } = useSwipeDownToClose({
    onClose: () => {
      if (!isDeleting) onCancel();
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-hidden">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => !isDeleting && onCancel()}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />

      {/* Card */}
      <div
        ref={sheetRef}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full sm:max-w-sm rounded-t-[26px] sm:rounded-3xl border-t sm:border border-white/10 bg-[#0A0A0A] overflow-hidden shadow-2xl animate-modal-content"
        style={{ willChange: "transform", backfaceVisibility: "hidden" }}
      >
        {/* Mobile Drag Indicator (Lingua Standard with Swipe-to-Close) */}
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onClick={handlePillClick}
          className="sm:hidden w-full flex items-center justify-center pt-3 pb-2 shrink-0 bg-[#0D0D11] select-none cursor-grab active:cursor-grabbing touch-none"
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

        {/* Top accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "1px",
            background:
              "linear-gradient(to right, transparent, rgba(239,68,68,0.6), transparent)",
            zIndex: 20,
          }}
        />

        {/* Corner glow */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "16rem",
            height: "16rem",
            background:
              "radial-gradient(circle at top right, rgba(239,68,68,0.07), transparent 70%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* Header */}
        <div className="relative p-5 sm:p-6 flex items-start gap-3.5">
          <div
            style={{
              flexShrink: 0,
              width: "2.5rem",
              height: "2.5rem",
              borderRadius: "0.75rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.2)",
              color: "rgb(248,113,113)",
            }}
          >
            <WarningCircle size={20} weight="duotone" />
          </div>
          <div>
            <h3
              style={{
                fontSize: "0.875rem",
                fontWeight: 900,
                fontStyle: "italic",
                letterSpacing: "-0.025em",
                color: "white",
                textTransform: "uppercase",
                margin: 0,
              }}
            >
              {t("archive_asset_title")}
            </h3>
            <p
              style={{
                marginTop: "0.25rem",
                fontSize: "0.75rem",
                color: "rgba(255,255,255,0.5)",
                lineHeight: 1.6,
              }}
            >
              {t("archive_asset_confirm", { name: assetName })}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            height: "1px",
            background: "rgba(255,255,255,0.06)",
            margin: "0 1.5rem",
          }}
        />

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 p-4 sm:p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2.5 min-h-[44px] text-xs font-semibold rounded-xl border border-white/10 text-white/60 hover:text-white transition-colors cursor-pointer disabled:opacity-40"
          >
            {t("cancel_btn")}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex items-center gap-1.5 px-4 py-2.5 min-h-[44px] text-xs font-bold rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25 transition-colors cursor-pointer disabled:opacity-40"
          >
            <Trash size={13} weight="bold" />
            {isDeleting ? t("archiving") : t("yes_archive")}
          </button>
        </div>
      </div>
    </div>
  );
};
