"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { ChevronDown, Check, LucideIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "@/features/shared/hooks/useTheme";

interface Option {
  value: string;
  label: string;
}

interface HeaderFilterPillProps {
  icon: LucideIcon;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  label?: string; // Potential tooltip or prefix
}

export function HeaderFilterPill({
  icon: Icon,
  options,
  value,
  onChange,
  label,
}: HeaderFilterPillProps) {
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
      case "Tab":
        setIsOpen(false);
        break;
    }
  };

  return (
    <div ref={dropdownRef} className="relative inline-block h-9">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className={`
          h-full px-3 rounded-full border flex items-center gap-2 transition-all duration-300 outline-none
          ${
            isDark
              ? "bg-white/3 border-white/10 hover:bg-white/8 hover:border-white/20"
              : "bg-gray-100/50 border-gray-200 hover:bg-gray-100 hover:border-gray-300"
          }
          ${isOpen ? (isDark ? "ring-1 ring-cyan-500/50 border-cyan-500/50" : "ring-1 ring-blue-500/50 border-blue-500/50") : ""}
        `}
      >
        <Icon
          size={14}
          className={`shrink-0 transition-colors ${
            isOpen
              ? isDark
                ? "text-cyan-400"
                : "text-blue-500"
              : "text-gray-400"
          }`}
        />

        {label && (
          <span className="text-[10px] uppercase tracking-wider text-gray-500 font-black mr-1">
            {label}:
          </span>
        )}

        <span
          className={`text-[12px] font-bold whitespace-nowrap ${isDark ? "text-gray-300" : "text-gray-700"}`}
        >
          {selectedOption ? selectedOption.label : "Select..."}
        </span>

        <ChevronDown
          size={12}
          className={`transition-transform duration-300 text-gray-400 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 4 }}
            transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
            className={`
              absolute z-50 top-full mt-2 min-w-[160px] right-0 rounded-xl border overflow-hidden shadow-2xl backdrop-blur-xl
              ${isDark ? "bg-[#0c0c0c]/95 border-white/10 shadow-black/50" : "bg-white/95 border-gray-200 shadow-gray-200/50"}
            `}
          >
            <div className="p-1.5 flex flex-col gap-0.5">
              {options.map((option, index) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  onMouseEnter={() => setFocusedIndex(index)}
                  className={`
                    w-full px-3 py-2 rounded-lg text-left text-[12px] font-bold transition-all flex items-center justify-between outline-none
                    ${
                      option.value === value
                        ? isDark
                          ? "bg-cyan-500/10 text-cyan-400"
                          : "bg-blue-50 text-blue-600"
                        : focusedIndex === index
                          ? isDark
                            ? "bg-white/5 text-white"
                            : "bg-gray-100 text-gray-900"
                          : isDark
                            ? "text-gray-400"
                            : "text-gray-500"
                    }
                  `}
                >
                  <span className="truncate">{option.label}</span>
                  {option.value === value && (
                    <Check
                      size={14}
                      className={isDark ? "text-cyan-400" : "text-blue-500"}
                    />
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
