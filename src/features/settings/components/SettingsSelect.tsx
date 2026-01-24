"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { ChevronDown, Check } from "lucide-react";
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
        <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">
          {label}
        </label>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full rounded-lg px-4 py-3 text-white bg-[#0d0d0d] border border-white/10 hover:border-cyan-400/50 focus:border-cyan-400 focus:outline-none transition-all flex items-center justify-between"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className={selectedOption ? "text-white" : "text-gray-500"}>
          {selectedOption?.label || placeholder || "Select..."}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute z-50 w-full mt-2 bg-[#0a0a0a] rounded-lg border border-white/10 overflow-hidden shadow-2xl shadow-black/50 max-h-60 overflow-y-auto"
          role="listbox"
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={`w-full px-4 py-3 text-left transition-all flex items-center justify-between ${
                option.value === value
                  ? "bg-cyan-500/20 text-cyan-400"
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
              }`}
              role="option"
              aria-selected={option.value === value}
            >
              <span className="text-sm">{option.label}</span>
              {option.value === value && (
                <Check className="w-4 h-4 text-cyan-400" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
