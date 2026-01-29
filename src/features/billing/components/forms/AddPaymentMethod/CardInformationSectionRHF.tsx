"use client";

import React from "react";
import { CreditCard, User, Check } from "lucide-react";
import { useFormContext, Controller } from "react-hook-form";
import { motion } from "motion/react";
import { FormInput } from "@/components/forms";
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
        <label
          className={`block text-sm font-medium mb-1.5 ${
            isDark ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Card Number
        </label>
        <div className="relative">
          <CreditCard
            className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
              isDark ? "text-gray-500" : "text-gray-400"
            }`}
          />
          <Controller
            control={control}
            name="cardNumber"
            render={({ field, fieldState: { error } }) => (
              <input
                {...field}
                type="text"
                placeholder="1234 5678 9012 3456"
                autoFocus
                className={`w-full pl-10 pr-10 py-2.5 rounded-xl border font-mono text-sm transition-all duration-200 focus:outline-none focus:ring-2 ${
                  error
                    ? isDark
                      ? "border-red-500/50 focus:ring-red-500/30 bg-red-500/5"
                      : "border-red-400 focus:ring-red-500/30 bg-red-50"
                    : isDark
                      ? "border-white/10 bg-white/5 text-white placeholder:text-gray-500 focus:ring-cyan-500/50 focus:border-cyan-500/50"
                      : "border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:ring-blue-500/50 focus:border-blue-500/50"
                }`}
                onChange={(e) => {
                  // Custom formatting logic
                  const formatted = formatCardNumber(e.target.value);
                  field.onChange(formatted);
                }}
              />
            )}
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
        {errors.cardNumber && (
          <p
            className={`mt-1 text-xs font-medium ${isDark ? "text-red-400" : "text-red-500"}`}
          >
            {errors.cardNumber.message}
          </p>
        )}
      </div>

      {/* Card Name */}
      <div className="mb-3">
        <FormInput
          control={control}
          name="cardName"
          label="Cardholder Name"
          placeholder="JOHN DOE"
          icon={<User className="w-4 h-4" />}
          className="uppercase"
        />
      </div>

      {/* Expiry & CVV */}
      <div className="grid grid-cols-3 gap-2">
        <FormInput
          control={control}
          name="expiryMonth"
          label="Month"
          placeholder="MM"
          className="font-mono text-center"
        />
        <FormInput
          control={control}
          name="expiryYear"
          label="Year"
          placeholder="YY"
          className="font-mono text-center"
        />
        <FormInput
          control={control}
          name="cvv"
          label="CVV"
          type="password"
          placeholder="•••"
          className="font-mono text-center"
        />
      </div>
    </div>
  );
};
