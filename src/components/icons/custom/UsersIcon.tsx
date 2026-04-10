import React from "react";
import { motion } from "motion/react";

interface IconProps {
  size?: number | string;
  className?: string;
  isActive?: boolean;
  isHovered?: boolean;
}

export const UsersIcon = ({
  size = 20,
  className = "",
  isActive = false,
  isHovered = false,
}: IconProps) => {
  const active = isActive || isHovered;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Primary user */}
      <motion.circle cx="9" cy="8" r="3" strokeWidth="1.2" fill="none"
        initial={{ pathLength: 1 }}
        animate={{ pathLength: active ? [0, 1] : 1 }}
        transition={{ duration: 0.4 }}
      />
      <motion.path
        d="M3 20C3 16.7 5.7 14 9 14C12.3 14 15 16.7 15 20"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
        animate={{ pathLength: active ? [0, 1] : 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      />

      {/* Secondary user (offset) */}
      <motion.circle cx="17" cy="9" r="2.5" strokeWidth="1" fill="none"
        strokeDasharray={active ? "none" : "1.5 1.5"}
        animate={{ opacity: active ? 0.8 : 0.35 }}
        transition={{ duration: 0.3 }}
      />
      <motion.path
        d="M15 20C15 17.5 16 15.5 17 15C18 14.5 20 15 21 17"
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
        strokeDasharray={active ? "none" : "1.5 1.5"}
        animate={{ opacity: active ? 0.7 : 0.25 }}
      />

      {/* Connection line between users */}
      <motion.line x1="12" y1="8" x2="14.5" y2="9" strokeWidth="0.8" strokeDasharray="1.5 2"
        animate={{ opacity: active ? 0.5 : 0 }}
        transition={{ delay: 0.3 }}
      />

      {/* Node */}
      <motion.circle cx="9" cy="8" r="1" fill="currentColor" stroke="none"
        animate={{ scale: active ? 1 : 0, opacity: active ? 1 : 0 }}
        transition={{ duration: 0.2, delay: 0.3 }}
      />
    </svg>
  );
};
