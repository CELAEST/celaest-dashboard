"use client";

import React from "react";
import { Warning, Trash, X } from "@phosphor-icons/react";
import { BillingModal } from "./shared/BillingModal";

interface ConfirmDeleteOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  orderId: string;
}

export function ConfirmDeleteOrderModal({
  isOpen,
  onClose,
  onConfirm,
  orderId,
}: ConfirmDeleteOrderModalProps) {
  return (
    <BillingModal isOpen={isOpen} onClose={onClose} className="max-w-[448px] w-[448px] min-w-[448px] shrink-0" showCloseButton={false}>
      {/* Top accent line — RED for destructive */}
      <div className="absolute inset-x-0 top-0 h-px z-20 bg-linear-to-r from-transparent via-red-500/70 to-transparent" />
      {/* Corner glow — RED */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "22rem",
          height: "22rem",
          background: "radial-gradient(circle at top right, rgba(239,68,68,0.06), transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Header */}
      <div className="relative px-8 py-6 border-b border-white/8 flex items-center justify-between overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-linear-to-r from-red-500/10 via-red-600/8 to-transparent" />
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
            pointerEvents: "none",
          }}
        />
        <div className="absolute bottom-0 left-0 h-px w-2/5 bg-linear-to-r from-red-500/50 to-transparent" />

        <div className="relative z-10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-[#111] text-red-400 border border-white/10 shadow-lg shadow-red-500/10">
            <Warning size={22} weight="fill" />
          </div>
          <div>
            <h2 className="text-xl font-black italic tracking-tighter text-white uppercase">Delete Order</h2>
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">Irreversible action</p>
          </div>
        </div>

        <div className="relative z-10">
          <button onClick={onClose} className="p-2 rounded-full transition-colors text-gray-400 hover:text-white hover:bg-white/10">
            <X size={22} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-6">
        <p className="text-sm text-white/60 leading-relaxed">
          You are about to permanently delete order{" "}
          <span className="font-mono font-bold px-1.5 py-0.5 rounded bg-white/10 text-white">
            {orderId}
          </span>.
          <br />
          This action is irreversible.
        </p>
      </div>

      {/* Footer — RED for destructive */}
      <div className="relative shrink-0 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-red-500/50 to-transparent" />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "18rem",
            height: "8rem",
            background: "radial-gradient(circle at bottom left, rgba(239,68,68,0.07), transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div className="relative px-8 py-5 flex gap-3">
          <button
            onClick={onClose}
            autoFocus
            className="flex-1 py-3 rounded-2xl bg-white/5 border border-white/10 text-white/60 text-sm font-semibold hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-2xl bg-linear-to-r from-red-600 to-red-500 text-white text-sm font-black uppercase tracking-wide shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] transition-all flex items-center justify-center gap-2"
          >
            <Trash size={16} />
            Delete Forever
          </button>
        </div>
      </div>
    </BillingModal>
  );
}
