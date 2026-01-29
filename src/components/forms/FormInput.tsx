"use client";

import React from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

export interface FormInputProps<T extends FieldValues> {
  /** RHF control object */
  control: Control<T>;
  /** Field name matching schema */
  name: Path<T>;
  /** Label text (optional - use for accessibility) */
  label?: string;
  /** Input type */
  type?: "text" | "email" | "password" | "number" | "tel" | "url";
  /** Placeholder text */
  placeholder?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Auto focus on mount */
  autoFocus?: boolean;
  /** Additional className */
  className?: string;
  /** Icon to show on the left */
  icon?: React.ReactNode;
  /** Show as required */
  required?: boolean;
  /** Minimum value (for numbers) */
  min?: number | string;
  /** Maximum value (for numbers) */
  max?: number | string;
}

/**
 * FormInput - A "dumb" presentational input component for React Hook Form.
 *
 * Features:
 * - Auto-registers with RHF via Controller
 * - Dark/light theme support
 * - Error display
 * - Accessibility (aria-labels, describedby)
 * - Focus ring animation
 *
 * Usage:
 * ```tsx
 * <FormInput
 *   control={control}
 *   name="email"
 *   label="Email Address"
 *   type="email"
 *   placeholder="you@example.com"
 *   autoFocus
 * />
 * ```
 */
export function FormInput<T extends FieldValues>({
  control,
  name,
  label,
  type = "text",
  placeholder,
  disabled = false,
  autoFocus = false,
  className = "",
  icon,
  required = false,
  min,
  max,
}: FormInputProps<T>) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => {
        const inputId = `form-input-${name}`;
        const errorId = `${inputId}-error`;

        return (
          <div className={`w-full ${className}`}>
            {/* Label */}
            {label && (
              <label
                htmlFor={inputId}
                className={`block text-sm font-medium mb-1.5 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}

            {/* Input Container */}
            <div className="relative">
              {/* Icon */}
              {icon && (
                <div
                  className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                    isDark ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  {icon}
                </div>
              )}

              {/* Input */}
              <input
                {...field}
                id={inputId}
                type={type}
                placeholder={placeholder}
                disabled={disabled}
                autoFocus={autoFocus}
                min={min}
                max={max}
                aria-invalid={!!error}
                aria-describedby={error ? errorId : undefined}
                className={`
                  w-full px-3 py-2.5 rounded-xl border text-sm
                  transition-all duration-200
                  focus:outline-none focus:ring-2
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${icon ? "pl-10" : ""}
                  ${
                    error
                      ? isDark
                        ? "border-red-500/50 focus:ring-red-500/30 bg-red-500/5"
                        : "border-red-400 focus:ring-red-500/30 bg-red-50"
                      : isDark
                        ? "border-white/10 bg-white/5 text-white placeholder:text-gray-500 focus:ring-cyan-500/50 focus:border-cyan-500/50"
                        : "border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:ring-blue-500/50 focus:border-blue-500/50"
                  }
                `}
                value={field.value ?? ""}
                onChange={(e) => {
                  const value =
                    type === "number"
                      ? e.target.value === ""
                        ? ""
                        : Number(e.target.value)
                      : e.target.value;
                  field.onChange(value);
                }}
              />
            </div>

            {/* Error Message */}
            {error && (
              <p
                id={errorId}
                role="alert"
                className={`mt-1 text-xs font-medium ${
                  isDark ? "text-red-400" : "text-red-500"
                }`}
              >
                {error.message}
              </p>
            )}
          </div>
        );
      }}
    />
  );
}
