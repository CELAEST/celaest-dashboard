"use client";

import React, { useState } from "react";
import { ArrowCounterClockwise, Warning, X } from "@phosphor-icons/react";
import { motion } from "motion/react";
import { BillingModal } from "./shared/BillingModal";
import { useTranslations } from "next-intl";

interface RefundConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  orderDisplayId: string;
  orderAmount: string;
  isLoading?: boolean;
}

const REFUND_REASONS = [
  { value: "Customer requested", key: "reason_customer_requested" },
  { value: "Duplicate order", key: "reason_duplicate_order" },
  { value: "Product not delivered", key: "reason_product_not_delivered" },
  { value: "Defective product", key: "reason_defective_product" },
  { value: "Wrong item shipped", key: "reason_wrong_item" },
  { value: "Other", key: "reason_other" },
] as const;

export const RefundConfirmModal: React.FC<RefundConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  orderDisplayId,
  orderAmount,
  isLoading = false,
}) => {
  const t = useTranslations("billing");
  const [reason, setReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  const handleConfirm = () => {
    const finalReason = reason === "Other" ? customReason : reason;
    if (!finalReason.trim()) return;
    onConfirm(finalReason);
  };

  const isValid = reason && (reason !== "Other" || customReason.trim());

  return (
    <BillingModal isOpen={isOpen} onClose={onClose} className="max-w-md" showCloseButton={false}>
      {/* Top accent line */}
      <div className="absolute inset-x-0 top-0 h-px z-20 bg-linear-to-r from-transparent via-teal-500/70 to-transparent" />
      {/* Corner glow */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "22rem",
          height: "22rem",
          background: "radial-gradient(circle at top right, rgba(20,184,166,0.06), transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Header */}
      <div className="relative px-8 py-6 border-b border-white/8 flex items-center justify-between overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-linear-to-r from-teal-500/10 via-teal-600/8 to-transparent" />
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
            pointerEvents: "none",
          }}
        />
        <div className="absolute bottom-0 left-0 h-px w-2/5 bg-linear-to-r from-teal-500/50 to-transparent" />

        <div className="relative z-10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-[#111] text-teal-400 border border-white/10 shadow-lg shadow-teal-500/10">
            <Warning size={22} />
          </div>
          <div>
            <h2 className="text-xl font-black italic tracking-tighter text-white uppercase">{t("refund_order")}</h2>
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">{t("refund_undone_warning")}</p>
          </div>
        </div>

        <div className="relative z-10">
          <button onClick={onClose} className="p-2 rounded-full transition-colors text-gray-400 hover:text-white hover:bg-white/10">
            <X size={22} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-6 flex-1 min-h-0 overflow-y-auto space-y-5">
        {/* Order summary */}
        <div className="p-4 rounded-xl bg-white/3 border border-white/5 text-sm text-white/70">
          {t.rich("refund_summary_full", {
            orderDisplayId,
            orderAmount,
            b: (chunks) => <span className="font-bold text-white">{chunks}</span>,
            teal: (chunks) => <span className="font-bold text-teal-400">{chunks}</span>,
          })}
        </div>

        {/* Reason selector */}
        <div className="space-y-3">
          <label className="text-[10px] uppercase font-black tracking-widest text-white/40">{t("refund_reason_label")}</label>
          <div className="grid grid-cols-2 gap-2">
            {REFUND_REASONS.map((r) => (
              <button
                key={r.value}
                onClick={() => setReason(r.value)}
                className={`px-3 py-2.5 rounded-xl text-xs font-medium transition-all border ${
                  reason === r.value
                    ? "bg-teal-500/15 border-teal-500/40 text-teal-400"
                    : "bg-white/3 border-white/10 text-gray-400 hover:border-white/20 hover:text-gray-300"
                }`}
              >
                {t(r.key as keyof typeof t)}
              </button>
            ))}
          </div>

          {reason === "Other" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder={t("refund_reason_placeholder")}
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white text-sm focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20 transition-colors placeholder:text-white/20 resize-none"
              />
            </motion.div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="relative shrink-0 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-teal-500/50 to-transparent" />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "18rem",
            height: "8rem",
            background: "radial-gradient(circle at bottom left, rgba(20,184,166,0.07), transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div className="relative px-8 py-5 flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-3 rounded-2xl bg-white/5 border border-white/10 text-white/60 text-sm font-semibold hover:bg-white/10 transition-colors"
          >
            {t("cancel")}
          </button>
          <button
            onClick={handleConfirm}
            disabled={!isValid || isLoading}
            className={`flex-1 py-3 rounded-2xl bg-linear-to-r from-teal-500 to-teal-600 text-white text-sm font-black uppercase tracking-wide shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:shadow-[0_0_30px_rgba(20,184,166,0.5)] transition-all flex items-center justify-center gap-2 ${
              !isValid || isLoading ? "opacity-40 cursor-not-allowed" : ""
            }`}
          >
            <ArrowCounterClockwise
              size={16}
              className={isLoading ? "animate-spin" : ""}
            />
            {isLoading ? t("processing") : t("confirm_refund")}
          </button>
        </div>
      </div>
    </BillingModal>
  );
};
