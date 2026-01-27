import React, { memo } from "react";
import { motion } from "motion/react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

export const LoadingScreen = memo(() => {
  const { isDark } = useTheme();

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${
        isDark ? "bg-[#050505]" : "bg-[#F5F7FA]"
      }`}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className={`w-12 h-12 border-4 rounded-full ${
          isDark
            ? "border-cyan-500 border-t-transparent"
            : "border-blue-600 border-t-transparent"
        }`}
      />
    </div>
  );
});

LoadingScreen.displayName = "LoadingScreen";
