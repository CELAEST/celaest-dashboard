"use client";

import React from "react";
import { CreditCard, Check, Lock, X } from "@phosphor-icons/react";
import { FormProvider } from "react-hook-form";
import { BillingModal } from "./shared/BillingModal";
import { useAddPaymentMethodFormRHF } from "../../hooks/useAddPaymentMethodFormRHF";

import { ConnectedCreditCardPreview } from "../payment-methods/ConnectedCreditCardPreview";
import { AddPaymentMethodFormRHF } from "../forms/AddPaymentMethodFormRHF";

interface AddPaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddPaymentMethodModal({
  isOpen,
  onClose,
}: AddPaymentMethodModalProps) {
  const { form, handleSubmit, isSubmitting } =
    useAddPaymentMethodFormRHF(onClose);

  return (
    <BillingModal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-4xl max-h-[85vh]"
      showCloseButton={false}
    >
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

      <FormProvider {...form}>
        {/* Header */}
        <div className="relative px-8 py-6 border-b border-white/8 flex items-center justify-between overflow-hidden shrink-0">
          {/* Gradient wash */}
          <div className="absolute inset-0 bg-linear-to-r from-teal-500/10 via-teal-600/8 to-transparent" />
          {/* Grid dots */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
              pointerEvents: "none",
            }}
          />
          {/* Bottom accent line */}
          <div className="absolute bottom-0 left-0 h-px w-2/5 bg-linear-to-r from-teal-500/50 to-transparent" />

          <div className="relative z-10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-[#111] text-teal-400 border border-white/10 shadow-lg shadow-teal-500/10">
              <CreditCard size={22} />
            </div>
            <div>
              <h2 className="text-xl font-black italic tracking-tighter text-white uppercase">Add Payment Method</h2>
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">Securely add a new card</p>
            </div>
          </div>

          <div className="relative z-10">
            <button onClick={onClose} className="p-2 rounded-full transition-colors text-gray-400 hover:text-white hover:bg-white/10">
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Content - Split Layout */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          <ConnectedCreditCardPreview />
          <AddPaymentMethodFormRHF />
        </div>

        {/* Footer */}
        <div className="relative shrink-0 overflow-hidden">
          {/* Top accent */}
          <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-teal-500/50 to-transparent" />
          {/* Bottom glow */}
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
          <div className="relative px-8 py-5 flex items-center justify-between">
            <div className="flex items-center gap-1 text-white/30">
              <Lock size={12} />
              <span className="text-[10px] font-mono uppercase tracking-[0.15em]">Encrypted & secure</span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                type="button"
                className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-white/60 text-sm font-semibold hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`px-6 py-3 rounded-2xl bg-linear-to-r from-teal-500 to-teal-600 text-white text-sm font-black uppercase tracking-wide shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:shadow-[0_0_30px_rgba(20,184,166,0.5)] transition-all flex items-center gap-2 ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Check size={16} />
                    Save Method
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </FormProvider>
    </BillingModal>
  );
}
