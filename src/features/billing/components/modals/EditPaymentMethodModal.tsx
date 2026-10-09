"use client";

import { CreditCard, X, FloppyDisk } from "@phosphor-icons/react";
import { BillingModal } from "./shared/BillingModal";
import { PaymentMethod } from "../../types";
import { useEditPaymentMethodForm } from "../../hooks/useEditPaymentMethodForm";
import { CreditCardPreview } from "../ui/CreditCardPreview";
import { EditPaymentMethodForm } from "../forms/EditPaymentMethodForm";
import { useTranslations } from "next-intl";

interface EditPaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (method: PaymentMethod) => void;
  method: PaymentMethod | null;
}

const EditPaymentMethodContent = ({
  method,
  onClose,
  onSave,
}: {
  method: PaymentMethod;
  onClose: () => void;
  onSave: (method: PaymentMethod) => void;
}) => {
  const {
    formState,
    setters,
    errors,
    focusedField,
    setFocusedField,
    handleSave,
  } = useEditPaymentMethodForm(method, onClose, onSave);
  const t = useTranslations("billing");

  return (
    <>
      {/* Header */}
      <div className="relative px-6 py-5 border-b border-white/8 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-white/[0.04] text-white/80 border border-white/8">
            <CreditCard size={18} />
          </div>
          <div>
            <h2 className="text-base font-semibold tracking-tight text-zinc-100">
              {t("edit_payment_method")}
            </h2>
            <p className="text-[10px] font-mono uppercase tracking-wider text-white/40">
              {t("edit_payment_method_desc", { methodType: method.type.toUpperCase() })}
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

      {/* Content */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden max-h-[85vh] min-h-0">
        <CreditCardPreview
          cardName={formState.cardName}
          expiryMonth={formState.expiryMonth}
          expiryYear={formState.expiryYear}
          cardType={method.type}
          focusedField={focusedField}
          last4={method.last4}
        />
        <EditPaymentMethodForm
          formState={formState}
          setters={setters}
          errors={errors}
          focusedField={focusedField}
          setFocusedField={setFocusedField}
          handleSave={handleSave}
          onClose={onClose}
        />
      </div>

      {/* Footer */}
      <div className="relative shrink-0 border-t border-white/8 bg-[#09090b]/40 px-6 py-4 flex items-center justify-end gap-2.5">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-xl text-xs font-mono font-medium text-white/70 hover:text-white bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] transition-colors cursor-pointer"
        >
          {t("cancel")}
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider bg-white text-black hover:bg-zinc-200 transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
        >
          <FloppyDisk size={14} weight="bold" />
          <span>{t("save_changes")}</span>
        </button>
      </div>
    </>
  );
};

export function EditPaymentMethodModal({
  isOpen,
  onClose,
  onSave,
  method,
}: EditPaymentMethodModalProps) {
  return (
    <BillingModal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-4xl bg-[#09090b]/95 border-white/10 backdrop-blur-2xl"
      showCloseButton={false}
    >
      {method && (
        <EditPaymentMethodContent
          method={method}
          onClose={onClose}
          onSave={onSave}
        />
      )}
    </BillingModal>
  );
}
