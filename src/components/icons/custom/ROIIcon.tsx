import React from "react";
import { motion } from "motion/react";

interface IconProps {
  size?: number | string;
  className?: string;
  isActive?: boolean;
  isHovered?: boolean;
}

export const ROIIcon = ({
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
      {/* Target rings */}
      <motion.circle cx="12" cy="12" r="9" strokeWidth="1.2" fill="none"
        initial={{ pathLength: 1 }}
        animate={{ pathLength: active ? [0, 1] : 1 }}
        transition={{ duration: 0.5 }}
      />
      <motion.circle cx="12" cy="12" r="5.5" strokeWidth="1" fill="none"
        strokeDasharray={active ? "none" : "2 2"}
        animate={{ opacity: active ? 1 : 0.4 }}
        transition={{ duration: 0.3 }}
      />

      {/* Crosshair */}
      <motion.g animate={{ opacity: active ? 0.5 : 0.15 }}>
        <line x1="12" y1="3" x2="12" y2="7" strokeWidth="0.8" />
        <line x1="12" y1="17" x2="12" y2="21" strokeWidth="0.8" />
        <line x1="3" y1="12" x2="7" y2="12" strokeWidth="0.8" />
        <line x1="17" y1="12" x2="21" y2="12" strokeWidth="0.8" />
      </motion.g>

      {/* Bullseye */}
      <motion.circle cx="12" cy="12" r="2" strokeWidth="1.2" fill="none"
        animate={{ scale: active ? 1 : 0.7, opacity: active ? 1 : 0.5 }}
        transition={{ duration: 0.3 }}
      />

      {/* Center node */}
      <motion.circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"
        animate={{ scale: active ? [1, 1.3, 1] : 1, opacity: active ? 1 : 0.5 }}
        transition={{ duration: 0.8, repeat: active ? Infinity : 0 }}
      />
    </svg>
  );
};
