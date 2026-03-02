"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { CardInformationSectionRHF } from "./AddPaymentMethod/CardInformationSectionRHF";
import { BillingInformationSectionRHF } from "./AddPaymentMethod/BillingInformationSectionRHF";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

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
          <FormField
            control={control}
            name="isDefault"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4 border rounded-xl dark:border-white/10">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-normal cursor-pointer text-sm">
                    Set as default payment method
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />
        </div>

        {/* Hidden submit button to allow Enter key submission if needed */}
        <button type="submit" className="hidden" />
      </div>
    </div>
  );
};
