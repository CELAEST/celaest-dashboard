"use client";

import React from "react";
import { CreditCard, User, Check } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { motion } from "motion/react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AddPaymentMethodFormData } from "@/features/billing/hooks/useAddPaymentMethodFormRHF";
import { formatCardNumber } from "@/lib/validation/schemas/billing";

interface CardInformationSectionRHFProps {
  isDark: boolean;
}

export const CardInformationSectionRHF: React.FC<
  CardInformationSectionRHFProps
> = ({ isDark }) => {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext<AddPaymentMethodFormData>();
  const cardNumber = watch("cardNumber");
  const isValid = !errors.cardNumber && cardNumber?.length >= 13;

  return (
    <div>
      <h3
        className={`text-base font-bold mb-3 ${
          isDark ? "text-white" : "text-gray-900"
        }`}
      >
        Card Information
      </h3>

      {/* Card Number - Custom Controller for Formatting */}
      <div className="mb-3">
        <FormField
          control={control}
          name="cardNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Card Number</FormLabel>
              <FormControl>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    {...field}
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    autoFocus
                    className="pl-10 pr-10 font-mono h-11 rounded-xl"
                    onChange={(e) => {
                      const formatted = formatCardNumber(e.target.value);
                      field.onChange(formatted);
                    }}
                  />
                  {/* Validation Check */}
                  {isValid && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      <Check className="w-4 h-4 text-emerald-500" />
                    </motion.div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Card Name */}
      <div className="mb-3">
        <FormField
          control={control}
          name="cardName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cardholder Name</FormLabel>
              <FormControl>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="JOHN DOE"
                    className="uppercase pl-10 h-11 rounded-xl"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Expiry & CVV */}
      <div className="grid grid-cols-3 gap-2">
        <FormField
          control={control}
          name="expiryMonth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Month</FormLabel>
              <FormControl>
                <Input
                  placeholder="MM"
                  className="font-mono text-center h-11 rounded-xl"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="expiryYear"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Year</FormLabel>
              <FormControl>
                <Input
                  placeholder="YY"
                  className="font-mono text-center h-11 rounded-xl"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="cvv"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CVV</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="•••"
                  className="font-mono text-center h-11 rounded-xl"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
