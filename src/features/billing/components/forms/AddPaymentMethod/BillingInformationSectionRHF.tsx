"use client";

import React from "react";
import { Mail, MapPin, Building } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { FormInput } from "@/components/forms";
import { AddPaymentMethodFormData } from "@/features/billing/hooks/useAddPaymentMethodFormRHF";

interface BillingInformationSectionRHFProps {
  isDark: boolean;
}

export const BillingInformationSectionRHF: React.FC<
  BillingInformationSectionRHFProps
> = ({ isDark }) => {
  const { control } = useFormContext<AddPaymentMethodFormData>();

  return (
    <div>
      <h3
        className={`text-base font-bold mb-3 ${
          isDark ? "text-white" : "text-gray-900"
        }`}
      >
        Billing Information
      </h3>

      <div className="space-y-3">
        {/* Email */}
        <FormInput
          control={control}
          name="billingEmail"
          label="Email"
          type="email"
          placeholder="john@example.com"
          icon={<Mail className="w-4 h-4" />}
        />

        {/* Address */}
        <FormInput
          control={control}
          name="billingAddress"
          label="Address"
          placeholder="123 Main Street"
          icon={<MapPin className="w-4 h-4" />}
        />

        {/* City & Zip */}
        <div className="grid grid-cols-2 gap-2">
          <FormInput
            control={control}
            name="billingCity"
            label="City"
            placeholder="New York"
            icon={<Building className="w-4 h-4" />}
          />
          <FormInput
            control={control}
            name="billingZip"
            label="Zip"
            placeholder="10001"
          />
        </div>
      </div>
    </div>
  );
};
