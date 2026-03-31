import React from "react";
import { motion } from "motion/react";

interface IconProps {
  size?: number | string;
  className?: string;
  isActive?: boolean;
  isHovered?: boolean;
}

export const LicensingIcon = ({
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
      {/* Shield Base Fill */}
      <motion.path
        d="M12 22S5 16.42 5 9V4L12 2L19 4V9C19 16.42 12 22 12 22Z"
        fill="currentColor"
        stroke="none"
        initial={{ opacity: 0.05 }}
        animate={{ opacity: isActive || isHovered ? 0.15 : 0.05 }}
      />
      {/* Shield Outline */}
      <motion.path
        d="M12 22S5 16.42 5 9V4L12 2L19 4V9C19 16.42 12 22 12 22Z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={{ strokeWidth: isActive || isHovered ? 2 : 1.5 }}
      />

      {/* Keyhole Mechanism */}
      <motion.circle cx="12" cy="9" r="3" strokeWidth="1.5" fill="none" />
      <motion.path d="M12 12V16" strokeWidth="1.5" strokeLinecap="round" />
      <motion.path
        d="M10.5 16H13.5"
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={{ y: 0 }}
        animate={{ y: isActive || isHovered ? 1 : 0 }}
      />

      {/* Rotating Security Ring */}
      <motion.circle
        cx="12"
        cy="9"
        r="5"
        strokeWidth="1"
        strokeDasharray="2 4"
        initial={{ opacity: 0 }}
        animate={{
          opacity: isActive || isHovered ? 0.8 : 0,
          rotate: isActive || isHovered ? 360 : 0,
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "12px 9px" }}
      />

      {/* Unlocked Inner Glow */}
      <motion.circle
        cx="12"
        cy="9"
        r="1.5"
        fill="currentColor"
        stroke="none"
        initial={{ scale: 0 }}
        animate={{ scale: isActive || isHovered ? [0, 1.2, 0.8] : 0 }}
        transition={{ duration: 0.5 }}
      />
    </svg>
  );
};
