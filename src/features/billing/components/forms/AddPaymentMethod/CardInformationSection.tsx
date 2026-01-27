import React from "react";
import { motion } from "motion/react";
import { CreditCard, User, Check } from "lucide-react";
import { PaymentFormState, PaymentFormSetters } from "../../../types";

interface CardInformationSectionProps {
  formState: PaymentFormState;
  setters: PaymentFormSetters;
  errors: Partial<Record<keyof PaymentFormState, string>>;
  focusedField: string | null;
  setFocusedField: (field: string | null) => void;
  handleCardNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isDark: boolean;
}

export const CardInformationSection: React.FC<CardInformationSectionProps> = ({
  formState,
  setters,
  errors,
  focusedField,
  setFocusedField,
  handleCardNumberChange,
  isDark,
}) => {
  return (
    <div>
      <h3
        className={`text-base font-bold mb-3 ${
          isDark ? "text-white" : "text-gray-900"
        }`}
      >
        Card Information
      </h3>

      {/* Card Number */}
      <div className="mb-3">
        <label
          className={`block text-xs font-semibold mb-2 ${
            isDark ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Card Number
        </label>
        <div className="relative">
          <CreditCard
            className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${
              focusedField === "cardNumber"
                ? isDark
                  ? "text-cyan-400"
                  : "text-blue-600"
                : isDark
                  ? "text-gray-500"
                  : "text-gray-400"
            }`}
          />
          <motion.input
            whileFocus={{ scale: 1.01 }}
            autoFocus
            type="text"
            value={formState.cardNumber}
            onChange={handleCardNumberChange}
            onFocus={() => setFocusedField("cardNumber")}
            onBlur={() => setFocusedField(null)}
            placeholder="1234 5678 9012 3456"
            className={`w-full pl-10 pr-10 py-2.5 rounded-xl font-mono text-sm transition-all duration-300 ${
              errors.cardNumber
                ? "border-2 border-red-500"
                : focusedField === "cardNumber"
                  ? isDark
                    ? "bg-black/60 border-2 border-cyan-500/50 text-white placeholder-gray-500 shadow-lg shadow-cyan-500/20"
                    : "bg-white border-2 border-blue-500 text-gray-900 placeholder-gray-400 shadow-lg shadow-blue-500/20"
                  : isDark
                    ? "bg-black/40 border border-white/10 text-white placeholder-gray-500"
                    : "bg-white border border-gray-300 text-gray-900 placeholder-gray-400"
            }`}
          />
          {formState.cardNumber && !errors.cardNumber && (
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
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-red-500 mt-1"
          >
            {errors.cardNumber}
          </motion.div>
        )}
      </div>

      {/* Card Name */}
      <div className="mb-3">
        <label
          className={`block text-xs font-semibold mb-2 ${
            isDark ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Cardholder Name
        </label>
        <div className="relative">
          <User
            className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${
              focusedField === "cardName"
                ? isDark
                  ? "text-cyan-400"
                  : "text-blue-600"
                : isDark
                  ? "text-gray-500"
                  : "text-gray-400"
            }`}
          />
          <motion.input
            whileFocus={{ scale: 1.01 }}
            type="text"
            value={formState.cardName}
            onChange={(e) => setters.setCardName(e.target.value.toUpperCase())}
            onFocus={() => setFocusedField("cardName")}
            onBlur={() => setFocusedField(null)}
            placeholder="JOHN DOE"
            className={`w-full pl-10 pr-10 py-2.5 rounded-xl text-sm transition-all duration-300 ${
              errors.cardName
                ? "border-2 border-red-500"
                : focusedField === "cardName"
                  ? isDark
                    ? "bg-black/60 border-2 border-cyan-500/50 text-white placeholder-gray-500 shadow-lg shadow-cyan-500/20"
                    : "bg-white border-2 border-blue-500 text-gray-900 placeholder-gray-400 shadow-lg shadow-blue-500/20"
                  : isDark
                    ? "bg-black/40 border border-white/10 text-white placeholder-gray-500"
                    : "bg-white border border-gray-300 text-gray-900 placeholder-gray-400"
            }`}
          />
        </div>
      </div>

      {/* Expiry & CVV */}
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label
            className={`block text-xs font-semibold mb-2 ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Month
          </label>
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="text"
            value={formState.expiryMonth}
            onChange={(e) =>
              setters.setExpiryMonth(
                e.target.value.replace(/\D/g, "").substring(0, 2),
              )
            }
            onFocus={() => setFocusedField("expiryMonth")}
            onBlur={() => setFocusedField(null)}
            placeholder="MM"
            className={`w-full px-3 py-2.5 rounded-xl font-mono text-center text-sm transition-all duration-300 ${
              errors.expiryMonth
                ? "border-2 border-red-500"
                : focusedField === "expiryMonth"
                  ? isDark
                    ? "bg-black/60 border-2 border-cyan-500/50 text-white placeholder-gray-500"
                    : "bg-white border-2 border-blue-500 text-gray-900 placeholder-gray-400"
                  : isDark
                    ? "bg-black/40 border border-white/10 text-white placeholder-gray-500"
                    : "bg-white border border-gray-300 text-gray-900 placeholder-gray-400"
            }`}
          />
        </div>
        <div>
          <label
            className={`block text-xs font-semibold mb-2 ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Year
          </label>
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="text"
            value={formState.expiryYear}
            onChange={(e) =>
              setters.setExpiryYear(
                e.target.value.replace(/\D/g, "").substring(0, 2),
              )
            }
            onFocus={() => setFocusedField("expiryYear")}
            onBlur={() => setFocusedField(null)}
            placeholder="YY"
            className={`w-full px-3 py-2.5 rounded-xl font-mono text-center text-sm transition-all duration-300 ${
              errors.expiryYear
                ? "border-2 border-red-500"
                : focusedField === "expiryYear"
                  ? isDark
                    ? "bg-black/60 border-2 border-cyan-500/50 text-white placeholder-gray-500"
                    : "bg-white border-2 border-blue-500 text-gray-900 placeholder-gray-400"
                  : isDark
                    ? "bg-black/40 border border-white/10 text-white placeholder-gray-500"
                    : "bg-white border border-gray-300 text-gray-900 placeholder-gray-400"
            }`}
          />
        </div>
        <div>
          <label
            className={`block text-xs font-semibold mb-2 ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            CVV
          </label>
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="password"
            value={formState.cvv}
            onChange={(e) =>
              setters.setCvv(e.target.value.replace(/\D/g, "").substring(0, 4))
            }
            onFocus={() => setFocusedField("cvv")}
            onBlur={() => setFocusedField(null)}
            placeholder="•••"
            className={`w-full px-3 py-2.5 rounded-xl font-mono text-center text-sm transition-all duration-300 ${
              errors.cvv
                ? "border-2 border-red-500"
                : focusedField === "cvv"
                  ? isDark
                    ? "bg-black/60 border-2 border-cyan-500/50 text-white placeholder-gray-500"
                    : "bg-white border-2 border-blue-500 text-gray-900 placeholder-gray-400"
                  : isDark
                    ? "bg-black/40 border border-white/10 text-white placeholder-gray-500"
                    : "bg-white border border-gray-300 text-gray-900 placeholder-gray-400"
            }`}
          />
        </div>
      </div>
    </div>
  );
};
