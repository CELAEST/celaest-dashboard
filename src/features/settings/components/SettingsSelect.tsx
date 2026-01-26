import React, { useState, useRef, useEffect, useCallback } from "react";
import { ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import type { SettingsSelectProps } from "../types";

/**
 * Custom styled select dropdown for settings with dark theme.
 * Enhanced with Framer Motion and Keyboard Accessibility.
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
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
      setFocusedIndex(-1);
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
    setFocusedIndex(-1);
    buttonRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setIsOpen(true);
        const currentIndex = options.findIndex((opt) => opt.value === value);
        setFocusedIndex(currentIndex >= 0 ? currentIndex : 0);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setFocusedIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < options.length) {
          handleSelect(options[focusedIndex].value);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setFocusedIndex(-1);
        buttonRef.current?.focus();
        break;
      case "Tab":
        setIsOpen(false);
        break;
    }
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
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className={`w-full rounded-xl px-4 py-3 border transition-all duration-300 flex items-center justify-between outline-none group text-left ${
          isDark
            ? "bg-white/5 border-white/10 text-white hover:border-cyan-500/30 focus:border-cyan-500/30 focus:bg-white/10"
            : "bg-white border-gray-200 text-gray-900 hover:border-gray-300 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50"
        }`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span
          className={`font-medium transition-colors ${
            selectedOption
              ? isDark
                ? "text-white group-hover:text-cyan-100"
                : "text-gray-900 group-hover:text-gray-700"
              : "text-gray-500"
          }`}
        >
          {selectedOption?.label || placeholder || "Select..."}
        </span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-300 ${
            isOpen ? "rotate-180 text-cyan-500" : "text-gray-500"
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={`absolute z-50 w-full mt-2 rounded-xl border overflow-hidden shadow-2xl max-h-60 overflow-y-auto backdrop-blur-xl ${
              isDark
                ? "bg-[#0a0a0a]/95 border-white/10 shadow-black/80"
                : "bg-white/95 border-blue-100 shadow-blue-900/10"
            }`}
            role="listbox"
          >
            <div className="p-1">
              {options.map((option, index) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  onMouseEnter={() => setFocusedIndex(index)}
                  className={`w-full px-3 py-2.5 rounded-lg text-left transition-all flex items-center justify-between group outline-none ${
                    option.value === value
                      ? isDark
                        ? "bg-cyan-500/10 text-cyan-400 font-semibold"
                        : "bg-blue-50 text-blue-600 font-semibold"
                      : focusedIndex === index
                        ? isDark
                          ? "bg-white/5 text-white"
                          : "bg-gray-50 text-gray-900"
                        : isDark
                          ? "text-gray-400"
                          : "text-gray-600"
                  }`}
                  role="option"
                  aria-selected={option.value === value}
                >
                  <span className="text-sm truncate mr-2">{option.label}</span>
                  {option.value === value && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 20,
                      }}
                    >
                      <Check
                        className={`w-4 h-4 ${
                          isDark ? "text-cyan-400" : "text-blue-500"
                        }`}
                      />
                    </motion.div>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
