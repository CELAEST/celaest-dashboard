import React from "react";
import { motion } from "motion/react";

interface IconProps {
  size?: number | string;
  className?: string;
  isActive?: boolean;
  isHovered?: boolean;
}

export const ErrorMonitorIcon = ({
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
      {/* Warning triangle */}
      <motion.path
        d="M12 3L22 20H2L12 3Z"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 1 }}
        animate={{ pathLength: active ? [0, 1] : 1 }}
        transition={{ duration: 0.5 }}
      />

      {/* Exclamation */}
      <motion.line x1="12" y1="9" x2="12" y2="14" strokeWidth="1.5" strokeLinecap="round"
        animate={{ opacity: active ? 1 : 0.6 }}
      />
      <motion.circle cx="12" cy="17" r="0.8" fill="currentColor" stroke="none"
        animate={{ opacity: active ? 1 : 0.6 }}
      />

      {/* Scan lines */}
      <motion.g
        animate={{ opacity: active ? 0.4 : 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <line x1="6" y1="16" x2="18" y2="16" strokeWidth="0.5" strokeDasharray="1.5 2" />
        <line x1="8" y1="13" x2="16" y2="13" strokeWidth="0.5" strokeDasharray="1.5 2" />
      </motion.g>

      {/* Vertex nodes */}
      <motion.circle cx="12" cy="3" r="1" fill="currentColor" stroke="none"
        animate={{ scale: active ? 1 : 0, opacity: active ? 1 : 0 }}
        transition={{ duration: 0.2, delay: 0.3 }}
      />
    </svg>
  );
};
