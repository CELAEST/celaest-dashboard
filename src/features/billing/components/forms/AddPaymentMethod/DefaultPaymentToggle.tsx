import React from "react";
import { motion } from "motion/react";
import { PaymentFormState, PaymentFormSetters } from "../../../types";

interface DefaultPaymentToggleProps {
  formState: PaymentFormState;
  setters: PaymentFormSetters;
  isDark: boolean;
}

export const DefaultPaymentToggle: React.FC<DefaultPaymentToggleProps> = ({
  formState,
  setters,
  isDark,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className={`p-3 rounded-xl flex items-center justify-between ${
        isDark
          ? "bg-black/40 backdrop-blur-xl border border-white/10"
          : "bg-gray-50 border border-gray-200"
      }`}
    >
      <div
        className={`text-xs font-semibold ${
          isDark ? "text-white" : "text-gray-900"
        }`}
      >
        Set as default payment method
      </div>
      <button
        onClick={() => setters.setSetAsDefault(!formState.setAsDefault)}
        className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
          formState.setAsDefault
            ? isDark
              ? "bg-linear-to-r from-cyan-400 to-blue-500 shadow-lg shadow-cyan-500/50"
              : "bg-linear-to-r from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30"
            : isDark
              ? "bg-gray-700"
              : "bg-gray-300"
        }`}
      >
        <motion.div
          animate={{ x: formState.setAsDefault ? 24 : 4 }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
          }}
          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg"
        />
      </button>
    </motion.div>
  );
};
