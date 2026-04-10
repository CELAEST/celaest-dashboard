import React from "react";
import { motion } from "motion/react";

interface IconProps {
  size?: number | string;
  className?: string;
  isActive?: boolean;
  isHovered?: boolean;
}

export const AnalyticsIcon = ({
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
      {/* Background Grid */}
      <motion.path
        d="M3 3V21H21"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={{ strokeWidth: isActive || isHovered ? 2 : 1.5 }}
      />
      <motion.path
        d="M3 15H21 M3 9H21"
        strokeWidth="1"
        strokeDasharray="2 2"
        initial={{ opacity: 0.1 }}
        animate={{ opacity: isActive || isHovered ? 0.3 : 0.1 }}
      />

      {/* Bars */}
      <motion.rect
        x="6"
        y="11"
        width="3"
        height="10"
        rx="1"
        fill="currentColor"
        stroke="none"
        initial={{ opacity: 0.4 }}
        animate={{
          opacity: isActive || isHovered ? 0.6 : 0.4,
          y: isActive || isHovered ? 5 : 11,
          height: isActive || isHovered ? 16 : 10,
        }}
        transition={{ duration: 0.4 }}
      />
      <motion.rect
        x="11"
        y="14"
        width="3"
        height="7"
        rx="1"
        fill="currentColor"
        stroke="none"
        initial={{ opacity: 0.6 }}
        animate={{
          opacity: isActive || isHovered ? 0.8 : 0.6,
          y: isActive || isHovered ? 10 : 14,
          height: isActive || isHovered ? 11 : 7,
        }}
        transition={{ duration: 0.4, delay: 0.05 }}
      />
      <motion.rect
        x="16"
        y="7"
        width="3"
        height="14"
        rx="1"
        fill="currentColor"
        stroke="none"
        animate={{
          y: isActive || isHovered ? 3 : 7,
          height: isActive || isHovered ? 18 : 14,
        }}
        transition={{ duration: 0.4, delay: 0.1 }}
      />

      {/* Glowing Trend Line */}
      <motion.path
        d="M4 17L7.5 12L12.5 15L17.5 8L20 9"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 1 }}
        animate={{
          pathLength: isActive || isHovered ? [0, 1] : 1,
          opacity: isActive ? 1 : isHovered ? 0.8 : 0,
          y: isActive || isHovered ? -3 : 0,
        }}
        transition={{ duration: 0.5, delay: 0.2 }}
      />

      {/* Floating Data Point */}
      <motion.circle
        cx="17.5"
        cy="5"
        r="1.5"
        fill="currentColor"
        stroke="none"
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: isActive || isHovered ? 1 : 0,
          scale: isActive || isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.3, delay: 0.6 }}
      />
    </svg>
  );
};
