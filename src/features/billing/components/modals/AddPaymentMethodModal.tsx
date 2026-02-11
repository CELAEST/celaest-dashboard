"use client";

import React from "react";
import { CreditCard, Check, Lock } from "lucide-react";
import { motion } from "motion/react";
import { FormProvider } from "react-hook-form";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { BillingModal } from "./shared/BillingModal";
import { useAddPaymentMethodFormRHF } from "../../hooks/useAddPaymentMethodFormRHF";

import { ConnectedCreditCardPreview } from "../payment-methods/ConnectedCreditCardPreview";
import { AddPaymentMethodFormRHF } from "../forms/AddPaymentMethodFormRHF";

interface AddPaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddPaymentMethodModal({
  isOpen,
  onClose,
}: AddPaymentMethodModalProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Initialize RHF hook
  const { form, handleSubmit, isSubmitting } =
    useAddPaymentMethodFormRHF(onClose);

  // Removed direct watchers to prevent full modal re-renders
  // const cardNumber = form.watch("cardNumber");
  // ...

  return (
    <BillingModal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-4xl max-h-[85vh]"
    >
      <FormProvider {...form}>
        {/* Header */}
        <div className="relative p-6 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", duration: 0.8, bounce: 0.5 }}
              className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                isDark
                  ? "bg-linear-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 shadow-lg shadow-cyan-500/20"
                  : "bg-linear-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30 shadow-lg shadow-blue-500/20"
              }`}
            >
              <CreditCard
                className={`w-8 h-8 ${isDark ? "text-cyan-400" : "text-blue-600"}`}
              />
            </motion.div>
            <div>
              <h2
                className={`text-2xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Add Payment Method
              </h2>
              <p
                className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}
              >
                Securely add a new credit or debit card
              </p>
            </div>
          </div>
        </div>

        {/* Content - Split Layout */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Column - Card Preview (Optimized) */}
          <ConnectedCreditCardPreview />

          {/* Right Column - Form */}
          <AddPaymentMethodFormRHF />
        </div>

        {/* Footer */}
        <div
          className={`p-4 border-t shrink-0 ${
            isDark
              ? "border-white/10 bg-black/20"
              : "border-gray-200 bg-gray-50/50"
          }`}
        >
          <div className="flex items-center justify-between">
            <div
              className={`text-xs flex items-center gap-1 ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              <Lock className="w-3 h-3" />
              Your payment is encrypted and secure
            </div>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                type="button"
                className={`px-5 py-2 rounded-xl font-semibold text-sm transition-all duration-300 ${
                  isDark
                    ? "bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10"
                    : "bg-gray-100 border border-gray-200 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit} // This triggers RHF submit
                disabled={isSubmitting}
                className={`px-6 py-2 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${
                  isDark
                    ? "bg-linear-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50"
                    : "bg-linear-to-r from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50"
                } ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Check className="w-4 h-4" /> Save Method
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </FormProvider>
    </BillingModal>
  );
}
