"use client";

import React from "react";
import { Envelope, MapPin, Building } from "@phosphor-icons/react";
import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
        <FormField
          control={control}
          name="billingEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <div className="relative">
                  <Envelope className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    className="pl-10 h-11 rounded-xl"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Address */}
        <FormField
          control={control}
          name="billingAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="123 Main Street"
                    className="pl-10 h-11 rounded-xl"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* City & Zip */}
        <div className="grid grid-cols-2 gap-2">
          <FormField
            control={control}
            name="billingCity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="New York"
                      className="pl-10 h-11 rounded-xl"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="billingZip"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zip</FormLabel>
                <FormControl>
                  <Input
                    placeholder="10001"
                    className="h-11 rounded-xl"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};
