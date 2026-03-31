import React from "react";
import { motion } from "motion/react";

interface IconProps {
  size?: number | string;
  className?: string;
  isActive?: boolean;
  isHovered?: boolean;
}

export const ReleasesIcon = ({
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
      {/* Rocket body */}
      <motion.path
        d="M12 2C12 2 8 8 8 14C8 17 9.8 19 12 19C14.2 19 16 17 16 14C16 8 12 2 12 2Z"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 1 }}
        animate={{ pathLength: active ? [0, 1] : 1 }}
        transition={{ duration: 0.6 }}
      />

      {/* Fins */}
      <motion.path
        d="M8 16L5 19 M16 16L19 19"
        strokeWidth="1.2"
        strokeLinecap="round"
        animate={{ opacity: active ? 1 : 0.5 }}
      />

      {/* Exhaust */}
      <motion.path
        d="M10 19L12 22L14 19"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={{
          opacity: active ? [0.5, 1, 0.5] : 0.3,
          y: active ? [0, 1, 0] : 0,
        }}
        transition={{ duration: 1, repeat: active ? Infinity : 0 }}
      />

      {/* Window */}
      <motion.circle
        cx="12" cy="10" r="2"
        strokeWidth="1.2" fill="none"
        animate={{ scale: active ? 1 : 0.8, opacity: active ? 1 : 0.5 }}
        transition={{ duration: 0.3 }}
      />

      {/* Center node */}
      <motion.circle cx="12" cy="10" r="0.8" fill="currentColor" stroke="none"
        animate={{ scale: active ? 1 : 0, opacity: active ? 1 : 0 }}
        transition={{ duration: 0.2, delay: 0.3 }}
      />
    </svg>
  );
};
