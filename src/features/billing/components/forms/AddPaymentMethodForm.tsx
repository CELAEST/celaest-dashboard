import React from "react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { CardInformationSection } from "./AddPaymentMethod/CardInformationSection";
import { BillingInformationSection } from "./AddPaymentMethod/BillingInformationSection";
import { DefaultPaymentToggle } from "./AddPaymentMethod/DefaultPaymentToggle";
import { PaymentFormState, PaymentFormSetters } from "../../types";

interface AddPaymentMethodFormProps {
  formState: PaymentFormState;
  setters: PaymentFormSetters;
  errors: Partial<Record<keyof PaymentFormState, string>>;
  focusedField: string | null;
  setFocusedField: (field: string | null) => void;
  handleCardNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const AddPaymentMethodForm: React.FC<AddPaymentMethodFormProps> = ({
  formState,
  setters,
  errors,
  focusedField,
  setFocusedField,
  handleCardNumberChange,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="p-6 md:w-1/2 md:overflow-y-auto space-y-4">
      <CardInformationSection
        formState={formState}
        setters={setters}
        errors={errors}
        focusedField={focusedField}
        setFocusedField={setFocusedField}
        handleCardNumberChange={handleCardNumberChange}
        isDark={isDark}
      />

      <BillingInformationSection
        formState={formState}
        setters={setters}
        errors={errors}
        focusedField={focusedField}
        setFocusedField={setFocusedField}
        isDark={isDark}
      />

      <DefaultPaymentToggle
        formState={formState}
        setters={setters}
        isDark={isDark}
      />
    </div>
  );
};
