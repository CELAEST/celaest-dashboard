"use client";

import React from "react";
import { motion } from "motion/react";
import { Sun, Moon } from "lucide-react";

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
      className={`fixed top-6 right-6 z-50 p-3 rounded-full backdrop-blur-xl border transition-all duration-300 shadow-lg ${isDark ? "bg-white/10 border-white/20 hover:bg-white/20 text-white" : "bg-white/95 border-gray-300 hover:bg-white text-gray-900 shadow-xl"}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </motion.button>
  );
};
