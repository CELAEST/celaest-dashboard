import React from "react";
import { motion } from "motion/react";

interface IconProps {
  size?: number | string;
  className?: string;
  isActive?: boolean;
  isHovered?: boolean;
}

export const DevOpsIcon = ({
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
      {/* Infinity loop / DevOps cycle */}
      <motion.path
        d="M8 12C8 9.8 6.2 8 4 8C1.8 8 0 9.8 0 12C0 14.2 1.8 16 4 16C6.2 16 8 14.2 8 12Z"
        strokeWidth="1.2"
        fill="none"
        transform="translate(4, 0)"
        initial={{ pathLength: 1 }}
        animate={{ pathLength: active ? [0, 1] : 1 }}
        transition={{ duration: 0.5 }}
      />
      <motion.path
        d="M16 12C16 9.8 17.8 8 20 8C22.2 8 24 9.8 24 12C24 14.2 22.2 16 20 16C17.8 16 16 14.2 16 12Z"
        strokeWidth="1.2"
        fill="none"
        transform="translate(-4, 0)"
        initial={{ pathLength: 1 }}
        animate={{ pathLength: active ? [0, 1] : 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      />

      {/* Connection bridge */}
      <motion.line x1="8" y1="12" x2="16" y2="12" strokeWidth="1.2"
        strokeDasharray={active ? "none" : "2 2"}
        animate={{ opacity: active ? 1 : 0.4 }}
      />

      {/* Gear teeth indicators */}
      <motion.g animate={{ opacity: active ? 0.6 : 0 }} transition={{ delay: 0.3 }}>
        <line x1="6" y1="8.5" x2="6" y2="7" strokeWidth="1" strokeLinecap="round" />
        <line x1="6" y1="17" x2="6" y2="15.5" strokeWidth="1" strokeLinecap="round" />
        <line x1="18" y1="8.5" x2="18" y2="7" strokeWidth="1" strokeLinecap="round" />
        <line x1="18" y1="17" x2="18" y2="15.5" strokeWidth="1" strokeLinecap="round" />
      </motion.g>

      {/* Center nodes */}
      <motion.circle cx="6" cy="12" r="1.2" fill="currentColor" stroke="none"
        animate={{ scale: active ? 1 : 0.5, opacity: active ? 1 : 0.3 }}
        transition={{ duration: 0.2 }}
      />
      <motion.circle cx="18" cy="12" r="1.2" fill="currentColor" stroke="none"
        animate={{ scale: active ? 1 : 0.5, opacity: active ? 1 : 0.3 }}
        transition={{ duration: 0.2, delay: 0.05 }}
      />
    </svg>
  );
};
