"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

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
  return (
    <button
      onClick={onClick}
      className={`settings-tab-button flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
        isActive
          ? "bg-cyan-500 text-white"
          : "text-gray-400 hover:text-white hover:bg-white/5"
      }`}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );
}
