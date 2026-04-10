import React from "react";
import { motion } from "motion/react";

interface IconProps {
  size?: number | string;
  className?: string;
  isActive?: boolean;
  isHovered?: boolean;
}

export const CouponsIcon = ({
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
      {/* Tag outline */}
      <motion.path
        d="M20.59 13.41L11.83 4.65C11.45 4.28 10.95 4.07 10.41 4.07H5C4.45 4.07 4 4.52 4 5.07V10.49C4 11.02 4.21 11.53 4.59 11.91L13.34 20.66C14.12 21.44 15.39 21.44 16.17 20.66L20.59 16.24C21.37 15.46 21.37 14.19 20.59 13.41Z"
        fill="currentColor"
        fillOpacity={isActive || isHovered ? 0.15 : 0.05}
        stroke="none"
      />
      <motion.path
        d="M20.59 13.41L11.83 4.65C11.45 4.28 10.95 4.07 10.41 4.07H5C4.45 4.07 4 4.52 4 5.07V10.49C4 11.02 4.21 11.53 4.59 11.91L13.34 20.66C14.12 21.44 15.39 21.44 16.17 20.66L20.59 16.24C21.37 15.46 21.37 14.19 20.59 13.41Z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={{ rotate: isActive || isHovered ? -5 : 0 }}
        style={{ transformOrigin: "7px 7px" }}
        transition={{ type: "spring", stiffness: 200 }}
      />

      {/* Hole */}
      <motion.circle
        cx="7.5"
        cy="7.5"
        r="1"
        fill="currentColor"
        stroke="none"
        animate={{ rotate: isActive || isHovered ? -5 : 0 }}
        style={{ transformOrigin: "7px 7px" }}
      />

      {/* Percent symbol inside the tag */}
      <motion.g
        animate={{ rotate: isActive || isHovered ? -5 : 0 }}
        style={{ transformOrigin: "7px 7px" }}
      >
        <motion.path d="M11 16L15 10" strokeWidth="1.5" strokeLinecap="round" />
        <motion.circle
          cx="12.5"
          cy="11.5"
          r="1"
          fill="currentColor"
          stroke="none"
          animate={{ scale: isActive || isHovered ? [1, 1.2, 1] : 1 }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        <motion.circle
          cx="14.5"
          cy="14.5"
          r="1"
          fill="currentColor"
          stroke="none"
          animate={{ scale: isActive || isHovered ? [1, 1.2, 1] : 1 }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
        />
      </motion.g>
    </svg>
  );
};
