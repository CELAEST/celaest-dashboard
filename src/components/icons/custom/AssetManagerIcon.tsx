import React from "react";
import { motion } from "motion/react";

interface IconProps {
  size?: number | string;
  className?: string;
  isActive?: boolean;
  isHovered?: boolean;
}

export const AssetManagerIcon = ({
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
      {/* Folder back */}
      <motion.path
        d="M4 5H10L12 7H20V19H4V5Z"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 1 }}
        animate={{ pathLength: active ? [0, 1] : 1 }}
        transition={{ duration: 0.6 }}
      />

      {/* Inner grid lines (file organization) */}
      <motion.g
        animate={{ opacity: active ? 0.6 : 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <line x1="8" y1="11" x2="16" y2="11" strokeWidth="0.8" strokeDasharray="2 2" />
        <line x1="8" y1="14" x2="16" y2="14" strokeWidth="0.8" strokeDasharray="2 2" />
      </motion.g>

      {/* File items */}
      <motion.g
        animate={{ opacity: active ? 1 : 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <rect x="7" y="9.5" width="3" height="3" rx="0.5" strokeWidth="0.8" fill="none" />
        <rect x="7" y="13" width="3" height="3" rx="0.5" strokeWidth="0.8" fill="none" />
      </motion.g>

      {/* Connection node at folder tab */}
      <motion.circle cx="12" cy="7" r="1.2" fill="currentColor" stroke="none"
        animate={{ scale: active ? 1 : 0, opacity: active ? 1 : 0 }}
        transition={{ duration: 0.2, delay: 0.4 }}
      />
    </svg>
  );
};
