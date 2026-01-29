"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { CardInformationSectionRHF } from "./AddPaymentMethod/CardInformationSectionRHF";
import { BillingInformationSectionRHF } from "./AddPaymentMethod/BillingInformationSectionRHF";
import { FormCheckbox } from "@/components/forms";

/**
 * AddPaymentMethodFormRHF - Pure presentation component.
 * Relies on parent FormProvider for state.
 */
export const AddPaymentMethodFormRHF: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { control } = useFormContext();

  return (
    <div className="p-6 md:w-1/2 md:overflow-y-auto space-y-6">
      <div className="space-y-6">
        <CardInformationSectionRHF isDark={isDark} />

        <div className="w-full h-px bg-gray-200 dark:bg-white/10" />

        <BillingInformationSectionRHF isDark={isDark} />

        <div className="pt-2">
          <FormCheckbox
            control={control}
            name="isDefault"
            label="Set as default payment method"
            variant="switch"
          />
        </div>

        {/* Hidden submit button to allow Enter key submission if needed */}
        <button type="submit" className="hidden" />
      </div>
    </div>
  );
};
