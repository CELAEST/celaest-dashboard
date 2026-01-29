"use client";

import React from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { motion } from "motion/react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { Check } from "lucide-react";

export interface FormCheckboxProps<T extends FieldValues> {
  /** RHF control object */
  control: Control<T>;
  /** Field name matching schema */
  name: Path<T>;
  /** Label text */
  label?: string;
  /** Description text */
  description?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Additional className */
  className?: string;
  /** Variant: checkbox or switch */
  variant?: "checkbox" | "switch";
}

/**
 * FormCheckbox - Checkbox or Switch component for React Hook Form.
 */
export function FormCheckbox<T extends FieldValues>({
  control,
  name,
  label,
  description,
  disabled = false,
  className = "",
  variant = "checkbox",
}: FormCheckboxProps<T>) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange } }) => (
        <div className={`flex items-start gap-3 ${className}`}>
          {/* Input Control */}
          <div className="relative flex items-center h-6">
            {variant === "switch" ? (
              // SWITCH VARIANT
              <button
                type="button"
                role="switch"
                aria-checked={value}
                disabled={disabled}
                onClick={() => !disabled && onChange(!value)}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  value
                    ? isDark
                      ? "bg-cyan-500 focus:ring-cyan-500"
                      : "bg-blue-600 focus:ring-blue-600"
                    : isDark
                      ? "bg-gray-700 focus:ring-gray-600"
                      : "bg-gray-200 focus:ring-gray-300"
                } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              >
                <motion.span
                  layout
                  className={`block w-4 h-4 rounded-full bg-white shadow-lg transform transition-transform duration-200 ${
                    value ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            ) : (
              // CHECKBOX VARIANT
              <button
                type="button"
                role="checkbox"
                aria-checked={value}
                disabled={disabled}
                onClick={() => !disabled && onChange(!value)}
                className={`flex items-center justify-center w-5 h-5 rounded border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  value
                    ? isDark
                      ? "bg-cyan-500 border-cyan-500 text-black focus:ring-cyan-500"
                      : "bg-blue-600 border-blue-600 text-white focus:ring-blue-600"
                    : isDark
                      ? "bg-transparent border-gray-600 focus:ring-gray-600 hover:border-gray-500"
                      : "bg-white border-gray-300 focus:ring-gray-300 hover:border-gray-400"
                } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              >
                <motion.div
                  initial={false}
                  animate={{ scale: value ? 1 : 0, opacity: value ? 1 : 0 }}
                  transition={{ duration: 0.1 }}
                >
                  <Check size={14} strokeWidth={3} />
                </motion.div>
              </button>
            )}
          </div>

          {/* Label & Description */}
          {(label || description) && (
            <div
              className={`flex flex-col cursor-pointer ${
                disabled ? "opacity-50" : ""
              }`}
              onClick={() => !disabled && onChange(!value)}
            >
              {label && (
                <span
                  className={`text-sm font-medium leading-6 ${
                    isDark ? "text-gray-200" : "text-gray-900"
                  }`}
                >
                  {label}
                </span>
              )}
              {description && (
                <span
                  className={`text-xs ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {description}
                </span>
              )}
            </div>
          )}
        </div>
      )}
    />
  );
}
