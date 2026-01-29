"use client";

import React from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { ChevronDown } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface FormSelectProps<T extends FieldValues> {
  /** RHF control object */
  control: Control<T>;
  /** Field name matching schema */
  name: Path<T>;
  /** Label text */
  label?: string;
  /** Select options */
  options: SelectOption[];
  /** Placeholder (first option) */
  placeholder?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Additional className */
  className?: string;
  /** Show as required */
  required?: boolean;
}

/**
 * FormSelect - Simple select component for React Hook Form.
 *
 * NOTE: For complex multi-select or searchable dropdowns,
 * use a dedicated component in the feature, not this base component.
 */
export function FormSelect<T extends FieldValues>({
  control,
  name,
  label,
  options,
  placeholder = "Select...",
  disabled = false,
  className = "",
  required = false,
}: FormSelectProps<T>) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => {
        const selectId = `form-select-${name}`;
        const errorId = `${selectId}-error`;

        return (
          <div className={`w-full ${className}`}>
            {/* Label */}
            {label && (
              <label
                htmlFor={selectId}
                className={`block text-sm font-medium mb-1.5 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}

            {/* Select Container */}
            <div className="relative">
              <select
                {...field}
                id={selectId}
                disabled={disabled}
                aria-invalid={!!error}
                aria-describedby={error ? errorId : undefined}
                className={`
                  w-full px-3 py-2.5 pr-10 rounded-xl border text-sm appearance-none cursor-pointer
                  transition-all duration-200
                  focus:outline-none focus:ring-2
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${
                    error
                      ? isDark
                        ? "border-red-500/50 focus:ring-red-500/30 bg-red-500/5"
                        : "border-red-400 focus:ring-red-500/30 bg-red-50"
                      : isDark
                        ? "border-white/10 bg-white/5 text-white focus:ring-cyan-500/50 focus:border-cyan-500/50"
                        : "border-gray-200 bg-white text-gray-900 focus:ring-blue-500/50 focus:border-blue-500/50"
                  }
                  ${!field.value ? (isDark ? "text-gray-500" : "text-gray-400") : ""}
                `}
                value={field.value ?? ""}
              >
                <option value="" disabled>
                  {placeholder}
                </option>
                {options.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                  >
                    {option.label}
                  </option>
                ))}
              </select>

              {/* Dropdown Arrow */}
              <ChevronDown
                className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`}
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
