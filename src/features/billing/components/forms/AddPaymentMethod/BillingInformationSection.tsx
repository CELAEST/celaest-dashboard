import React from "react";
import { motion } from "motion/react";
import { Mail, MapPin, Building } from "lucide-react";
import { PaymentFormState, PaymentFormSetters } from "../../../types";

interface BillingInformationSectionProps {
  formState: PaymentFormState;
  setters: PaymentFormSetters;
  errors: Partial<Record<keyof PaymentFormState, string>>;
  focusedField: string | null;
  setFocusedField: (field: string | null) => void;
  isDark: boolean;
}

export const BillingInformationSection: React.FC<
  BillingInformationSectionProps
> = ({ formState, setters, errors, focusedField, setFocusedField, isDark }) => {
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
        <div>
          <label
            className={`block text-xs font-semibold mb-2 ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Email
          </label>
          <div className="relative">
            <Mail
              className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${
                focusedField === "billingEmail"
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
              type="email"
              value={formState.billingEmail}
              onChange={(e) => setters.setBillingEmail(e.target.value)}
              onFocus={() => setFocusedField("billingEmail")}
              onBlur={() => setFocusedField(null)}
              placeholder="john@example.com"
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm transition-all duration-300 ${
                errors.billingEmail
                  ? "border-2 border-red-500"
                  : focusedField === "billingEmail"
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

        {/* Address */}
        <div>
          <label
            className={`block text-xs font-semibold mb-2 ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Address
          </label>
          <div className="relative">
            <MapPin
              className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${
                focusedField === "billingAddress"
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
              value={formState.billingAddress}
              onChange={(e) => setters.setBillingAddress(e.target.value)}
              onFocus={() => setFocusedField("billingAddress")}
              onBlur={() => setFocusedField(null)}
              placeholder="123 Main Street"
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm transition-all duration-300 ${
                errors.billingAddress
                  ? "border-2 border-red-500"
                  : focusedField === "billingAddress"
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

        {/* City & Zip */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label
              className={`block text-xs font-semibold mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              City
            </label>
            <div className="relative">
              <Building
                className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${
                  focusedField === "billingCity"
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
                value={formState.billingCity}
                onChange={(e) => setters.setBillingCity(e.target.value)}
                onFocus={() => setFocusedField("billingCity")}
                onBlur={() => setFocusedField(null)}
                placeholder="New York"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm transition-all duration-300 ${
                  errors.billingCity
                    ? "border-2 border-red-500"
                    : focusedField === "billingCity"
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
          <div>
            <label
              className={`block text-xs font-semibold mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Zip
            </label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="text"
              value={formState.billingZip}
              onChange={(e) => setters.setBillingZip(e.target.value)}
              onFocus={() => setFocusedField("billingZip")}
              onBlur={() => setFocusedField(null)}
              placeholder="10001"
              className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-300 ${
                errors.billingZip
                  ? "border-2 border-red-500"
                  : focusedField === "billingZip"
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
    </div>
  );
};
