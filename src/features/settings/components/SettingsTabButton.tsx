"use client";

import React from "react";
import { Icon } from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";

interface SettingsTabButtonProps {
  icon: Icon;
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
          ? isDark
            ? "bg-zinc-800/40 text-zinc-100 border border-white/8 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] font-semibold"
            : "bg-white text-gray-900 border border-black/6 shadow-xs font-semibold"
          : isDark
            ? "border border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40 hover:border-white/8"
            : "border border-transparent text-zinc-500 hover:text-zinc-900 hover:bg-white hover:border-black/6"
      }`}
    >
      <Icon
        className={`w-4 h-4 transition-transform duration-300 ${isActive ? "scale-110" : ""}`}
      />
      <span>{label}</span>
    </button>
  );
}
