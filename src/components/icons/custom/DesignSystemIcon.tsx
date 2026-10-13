import React from "react";
import { motion } from "motion/react";

interface IconProps {
  size?: number | string;
  className?: string;
  isActive?: boolean;
  isHovered?: boolean;
}

export const DesignSystemIcon = ({
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
      {/* Palette base shape */}
      <path
        d="M12 3C6.48 3 2 7.03 2 12C2 16.97 6.48 21 12 21C13.1 21 14 20.1 14 19C14 18.5 13.8 18.04 13.47 17.7C13.14 17.36 12.95 16.9 12.95 16.4C12.95 15.3 13.85 14.4 14.95 14.4H17C19.76 14.4 22 12.16 22 9.4C22 5.86 17.52 3 12 3Z"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Swatch color dots with micro-animation */}
      <motion.circle
        cx="7"
        cy="10"
        r="1.2"
        fill="currentColor"
        animate={{ scale: active ? [1, 1.25, 1] : 1 }}
        transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
      />
      <motion.circle
        cx="11"
        cy="7.5"
        r="1.2"
        fill="currentColor"
        animate={{ scale: active ? [1, 1.25, 1] : 1 }}
        transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
      />
      <motion.circle
        cx="16"
        cy="9"
        r="1.2"
        fill="currentColor"
        animate={{ scale: active ? [1, 1.25, 1] : 1 }}
        transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
      />
      <motion.circle
        cx="8.5"
        cy="14.5"
        r="1.2"
        fill="currentColor"
        animate={{ scale: active ? [1, 1.25, 1] : 1 }}
        transition={{ duration: 1.2, repeat: Infinity, delay: 0.6 }}
      />
    </svg>
  );
};
