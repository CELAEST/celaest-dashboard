"use client";

import { CreditCard } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { BillingModal } from "./shared/BillingModal";
import { PaymentMethod } from "../../types";
import { useEditPaymentMethodForm } from "../../hooks/useEditPaymentMethodForm";
import { CreditCardPreview } from "../ui/CreditCardPreview";
import { EditPaymentMethodForm } from "../forms/EditPaymentMethodForm";

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
  isDark,
}: {
  method: PaymentMethod;
  onClose: () => void;
  onSave: (method: PaymentMethod) => void;
  isDark: boolean;
}) => {
  const {
    formState,
    setters,
    errors,
    focusedField,
    setFocusedField,
    handleSave,
  } = useEditPaymentMethodForm(method, onClose, onSave);

  return (
    <>
      <div className="relative p-6 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-4">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
              isDark
                ? "bg-linear-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 shadow-lg shadow-cyan-500/20"
                : "bg-linear-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30 shadow-lg shadow-blue-500/20"
            }`}
          >
            <CreditCard
              className={`w-8 h-8 ${isDark ? "text-cyan-400" : "text-blue-600"}`}
            />
          </div>
          <div>
            <h2
              className={`text-2xl font-bold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Edit Payment Method
            </h2>
            <p
              className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}
            >
              Update details for your {method.type.toUpperCase()} card
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden max-h-[85vh]">
        {/* Left Column: Preview */}
        <CreditCardPreview
          cardName={formState.cardName}
          expiryMonth={formState.expiryMonth}
          expiryYear={formState.expiryYear}
          cardType={method.type}
          focusedField={focusedField}
          last4={method.last4}
        />

        {/* Right Column: Edit Form */}
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
    </>
  );
};

export function EditPaymentMethodModal({
  isOpen,
  onClose,
  onSave,
  method,
}: EditPaymentMethodModalProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <BillingModal isOpen={isOpen} onClose={onClose} className="max-w-4xl">
      {method && (
        <EditPaymentMethodContent
          method={method}
          onClose={onClose}
          onSave={onSave}
          isDark={isDark}
        />
      )}
    </BillingModal>
  );
}
