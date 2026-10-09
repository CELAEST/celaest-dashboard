"use client";

import React from "react";
import { CreditCard, Check, Lock, X } from "@phosphor-icons/react";
import { FormProvider } from "react-hook-form";
import { BillingModal } from "./shared/BillingModal";
import { useAddPaymentMethodFormRHF } from "../../hooks/useAddPaymentMethodFormRHF";

import { ConnectedCreditCardPreview } from "../payment-methods/ConnectedCreditCardPreview";
import { AddPaymentMethodFormRHF } from "../forms/AddPaymentMethodFormRHF";
import { useTranslations } from "next-intl";

interface AddPaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddPaymentMethodModal({
  isOpen,
  onClose,
}: AddPaymentMethodModalProps) {
  const t = useTranslations("billing");
  const { form, handleSubmit, isSubmitting } =
    useAddPaymentMethodFormRHF(onClose);

  return (
    <BillingModal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-4xl max-h-[85vh] bg-[#09090b]/95 border-white/10 backdrop-blur-2xl"
      showCloseButton={false}
    >
      <FormProvider {...form}>
        {/* Header */}
        <div className="relative px-6 py-5 border-b border-white/8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-white/[0.04] text-white/80 border border-white/8">
              <CreditCard size={18} />
            </div>
            <div>
              <h2 className="text-base font-semibold tracking-tight text-zinc-100">
                {t("add_payment_method")}
              </h2>
              <p className="text-[10px] font-mono uppercase tracking-wider text-white/40">
                {t("add_payment_method_desc")}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-white/8 bg-white/[0.02] text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content - Split Layout */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
          <ConnectedCreditCardPreview />
          <AddPaymentMethodFormRHF />
        </div>

        {/* Footer */}
        <div className="relative shrink-0 border-t border-white/8 bg-[#09090b]/40 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-white/40">
            <Lock size={12} />
            <span className="text-[10px] font-mono uppercase tracking-wider">
              {t("encrypted_secure")}
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              type="button"
              className="px-4 py-2 rounded-xl text-xs font-mono font-medium text-white/70 hover:text-white bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] transition-colors cursor-pointer"
            >
              {t("cancel")}
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider bg-white text-black hover:bg-zinc-200 transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer ${
                isSubmitting ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? (
                <div className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <Check size={14} weight="bold" />
                  <span>{t("save_method")}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </FormProvider>
    </BillingModal>
  );
}
