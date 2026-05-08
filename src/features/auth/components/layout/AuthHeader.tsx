"use client";

import React from "react";
import { motion } from "motion/react";
import Logo from "@/components/icons/Logo";

interface AuthHeaderProps {
  isDark: boolean;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ isDark }) => {
  return (
    <motion.div
      className="flex items-center gap-2 mb-8 w-full"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="w-12 h-12 shrink-0 flex items-center justify-center">
        <Logo className="w-full h-full" color={isDark ? "#22d3ee" : "#2563eb"} />
      </div>
      <div className="flex flex-col shrink-0 leading-none whitespace-nowrap">
        <span
          className={`text-2xl font-bold tracking-tight ${isDark ? "bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent" : "bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"}`}
        >
          CELAEST
        </span>
        <span
          className={`text-xs font-medium tracking-[0.21em] mt-0.5 ${isDark ? "text-cyan-400/60" : "text-blue-500/60"}`}
        >
          DASHBOARD
        </span>
      </div>
    </motion.div>
  );
};
