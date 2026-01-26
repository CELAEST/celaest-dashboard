"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { ChevronDown, Check } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import type { SettingsSelectProps } from "../types";

/**
 * Custom styled select dropdown for settings with dark theme.
 */
export function SettingsSelect({
  options,
  value,
  onChange,
  placeholder,
  label,
}: SettingsSelectProps) {
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative">
      {label && (
        <label
          className={`text-xs uppercase tracking-wider mb-2 block font-bold ${
            isDark ? "text-gray-500" : "text-gray-400"
          }`}
        >
          {label}
        </label>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full rounded-lg px-4 py-3 border transition-all flex items-center justify-between outline-none ${
          isDark
            ? "bg-[#0d0d0d] border-white/10 text-white hover:border-cyan-400/50 focus:border-cyan-400"
            : "bg-white border-gray-200 text-gray-900 hover:border-gray-300 focus:border-cyan-500"
        }`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span
          className={
            selectedOption
              ? isDark
                ? "text-white"
                : "text-gray-900"
              : "text-gray-500"
          }
        >
          {selectedOption?.label || placeholder || "Select..."}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          className={`absolute z-50 w-full mt-2 rounded-xl border overflow-hidden shadow-2xl max-h-60 overflow-y-auto animate-in fade-in zoom-in duration-200 ${
            isDark
              ? "bg-[#0a0a0a] border-white/10 shadow-black/50"
              : "bg-white border-gray-200 shadow-gray-400/10"
          }`}
          role="listbox"
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={`w-full px-4 py-3 text-left transition-all flex items-center justify-between ${
                option.value === value
                  ? isDark
                    ? "bg-cyan-500/10 text-cyan-400"
                    : "bg-cyan-50 text-cyan-600 font-medium"
                  : isDark
                    ? "text-gray-300 hover:bg-white/5 hover:text-white"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
              role="option"
              aria-selected={option.value === value}
            >
              <span className="text-sm">{option.label}</span>
              {option.value === value && (
                <Check
                  className={`w-4 h-4 ${isDark ? "text-cyan-400" : "text-cyan-500"}`}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
