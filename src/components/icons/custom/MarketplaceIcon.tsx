import React from "react";
import { motion } from "motion/react";

interface IconProps {
  size?: number | string;
  className?: string;
  isActive?: boolean;
  isHovered?: boolean;
}

export const MarketplaceIcon = ({
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
      {/* Storefront frame */}
      <motion.path
        d="M4 7L4 20H20V7"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 1 }}
        animate={{ pathLength: active ? [0, 1] : 1 }}
        transition={{ duration: 0.5 }}
      />

      {/* Awning wave */}
      <motion.path
        d="M2 7H22L20.5 4H3.5L2 7Z"
        strokeWidth="1.2"
        strokeLinejoin="round"
        fill="none"
        animate={{ strokeWidth: active ? 1.4 : 1.2 }}
      />

      {/* Scalloped awning detail */}
      <motion.path
        d="M2 7C2 9 4 9 5 7C6 9 8 9 9 7C10 9 12 9 12 7C12 9 14 9 15 7C16 9 18 9 19 7C20 9 22 9 22 7"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
        animate={{ opacity: active ? 1 : 0.5 }}
        transition={{ duration: 0.3 }}
      />

      {/* Door */}
      <motion.rect
        x="9" y="14" width="6" height="6" rx="0.5"
        strokeWidth="1.2"
        fill="none"
        animate={{ opacity: active ? 1 : 0.6 }}
      />

      {/* Connection nodes */}
      <motion.circle cx="3.5" cy="4" r="1" fill="currentColor" stroke="none"
        animate={{ scale: active ? 1 : 0, opacity: active ? 1 : 0 }}
        transition={{ duration: 0.2, delay: 0.3 }}
      />
      <motion.circle cx="20.5" cy="4" r="1" fill="currentColor" stroke="none"
        animate={{ scale: active ? 1 : 0, opacity: active ? 1 : 0 }}
        transition={{ duration: 0.2, delay: 0.35 }}
      />
    </svg>
  );
};
