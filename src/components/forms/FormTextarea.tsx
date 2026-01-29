"use client";

import React, { useRef, useEffect } from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

export interface FormTextareaProps<T extends FieldValues> {
  /** RHF control object */
  control: Control<T>;
  /** Field name matching schema */
  name: Path<T>;
  /** Label text */
  label?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Auto focus on mount */
  autoFocus?: boolean;
  /** Additional className */
  className?: string;
  /** Minimum rows */
  minRows?: number;
  /** Maximum rows (for auto-resize limit) */
  maxRows?: number;
  /** Auto-resize based on content */
  autoResize?: boolean;
  /** Show as required */
  required?: boolean;
}

/**
 * FormTextarea - Textarea component for React Hook Form with auto-resize.
 */
export function FormTextarea<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  disabled = false,
  autoFocus = false,
  className = "",
  minRows = 3,
  maxRows = 10,
  autoResize = true,
  required = false,
}: FormTextareaProps<T>) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize handler
  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea || !autoResize) return;

    textarea.style.height = "auto";
    const lineHeight = 24; // Approximate line height
    const minHeight = minRows * lineHeight;
    const maxHeight = maxRows * lineHeight;
    const scrollHeight = textarea.scrollHeight;

    textarea.style.height = `${Math.min(Math.max(scrollHeight, minHeight), maxHeight)}px`;
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => {
        const textareaId = `form-textarea-${name}`;
        const errorId = `${textareaId}-error`;

        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
          adjustHeight();
        }, [field.value]);

        return (
          <div className={`w-full ${className}`}>
            {/* Label */}
            {label && (
              <label
                htmlFor={textareaId}
                className={`block text-sm font-medium mb-1.5 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}

            {/* Textarea */}
            <textarea
              {...field}
              ref={(el) => {
                field.ref(el);
                (
                  textareaRef as React.MutableRefObject<HTMLTextAreaElement | null>
                ).current = el;
              }}
              id={textareaId}
              placeholder={placeholder}
              disabled={disabled}
              autoFocus={autoFocus}
              aria-invalid={!!error}
              aria-describedby={error ? errorId : undefined}
              rows={minRows}
              className={`
                w-full px-3 py-2.5 rounded-xl border text-sm resize-none
                transition-all duration-200
                focus:outline-none focus:ring-2
                disabled:opacity-50 disabled:cursor-not-allowed
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
                field.onChange(e.target.value);
                adjustHeight();
              }}
            />

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
