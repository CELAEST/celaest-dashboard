"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

interface SettingsTabButtonProps {
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

/**
 * Reusable tab button for settings navigation.
 * Matches the design reference with cyan gradient active state.
 */
export function SettingsTabButton({
  icon: Icon,
  label,
  isActive,
  onClick,
}: SettingsTabButtonProps) {
  const { isDark } = useTheme();

  return (
    <button
      onClick={onClick}
      className={`settings-tab-button flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
        isActive
          ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20 active:scale-95"
          : isDark
            ? "text-gray-400 hover:text-white hover:bg-white/5 active:bg-white/10"
            : "text-gray-500 hover:text-gray-900 hover:bg-gray-100 active:bg-gray-200"
      }`}
    >
      <Icon
        className={`w-4 h-4 transition-transform duration-300 ${isActive ? "scale-110" : ""}`}
      />
      <span>{label}</span>
    </button>
  );
}
