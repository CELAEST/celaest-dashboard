import React from "react";
import { motion } from "motion/react";

interface IconProps {
  size?: number | string;
  className?: string;
  isActive?: boolean;
  isHovered?: boolean;
}

export const AIConsoleIcon = ({
  size = 20,
  className = "",
  isActive = false,
  isHovered = false,
}: IconProps) => {
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
      {/* Main Star */}
      <motion.path
        d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity={isActive || isHovered ? 0.15 : 0.05}
        animate={{
          scale: isActive || isHovered ? 1.1 : 1,
          rotate: isActive || isHovered ? 90 : 0,
        }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        style={{ transformOrigin: "12px 12px" }}
      />
      {/* Top Right Mini Star */}
      <motion.path
        d="M20 3L21 6L24 7L21 8L20 11L19 8L16 7L19 6L20 3Z"
        strokeWidth="1"
        strokeLinejoin="round"
        fill="currentColor"
        animate={{ scale: isActive || isHovered ? [1, 1.3, 1] : 1 }}
        transition={{ duration: 1.5, repeat: Infinity }}
        style={{ transformOrigin: "20px 7px" }}
      />
      {/* Bottom Left Mini Star */}
      <motion.path
        d="M5 18L5.5 20L7.5 20.5L5.5 21L5 23L4.5 21L2.5 20.5L4.5 20L5 18Z"
        strokeWidth="1"
        strokeLinejoin="round"
        fill="currentColor"
        animate={{ scale: isActive || isHovered ? [1, 1.4, 1] : 1 }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        style={{ transformOrigin: "5px 20px" }}
      />
    </svg>
  );
};
