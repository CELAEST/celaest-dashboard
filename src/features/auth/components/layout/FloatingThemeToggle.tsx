"use client";

import React from "react";
import { motion } from "motion/react";
import { Sun, Moon } from "@phosphor-icons/react";

interface FloatingThemeToggleProps {
  isDark: boolean;
  toggleTheme: () => void;
}

export const FloatingThemeToggle: React.FC<FloatingThemeToggleProps> = ({
  isDark,
  toggleTheme,
}) => {
  return (
    <motion.button
      onClick={toggleTheme}
      className={`p-2 rounded-full transition-all duration-300 ${isDark ? "hover:bg-white/10 text-white" : "hover:bg-black/5 text-gray-900"}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </motion.button>
  );
};
