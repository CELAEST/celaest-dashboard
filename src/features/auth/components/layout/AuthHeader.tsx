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
      className="flex items-center gap-1 mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="w-16 h-16 text-blue-600">
        <Logo color={isDark ? "#22d3ee" : "#2563eb"} />
      </div>
      <div className="flex flex-col leading-none">
        <span
          className={`text-2xl font-bold ${isDark ? "bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent" : "bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"}`}
        >
          CELAEST
        </span>
        <span
          className={`text-xs tracking-widest mt-1 ${isDark ? "text-cyan-400/60" : "text-blue-500/60"}`}
        >
          DASHBOARD
        </span>
      </div>
    </motion.div>
  );
};
