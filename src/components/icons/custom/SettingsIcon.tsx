import React from "react";
import { motion } from "motion/react";

interface IconProps {
  size?: number | string;
  className?: string;
  isActive?: boolean;
  isHovered?: boolean;
}

export const SettingsIcon = ({
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
      {/* Background Outer Ring Segment */}
      <motion.circle
        cx="12"
        cy="12"
        r="10"
        strokeWidth="1"
        strokeDasharray="4 6"
        opacity="0.1"
        animate={{ rotate: isActive || isHovered ? -180 : 0 }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "center" }}
      />

      {/* Main Complex Gear Outline */}
      <motion.path
        d="M19.4 15A1.65 1.65 0 0 0 19.4 15C20.2 15 20.9 14.3 20.9 13.5V10.5C20.9 9.7 20.2 9 19.4 9C19 9 18.6 8.7 18.5 8.3L18 6.8C17.9 6.4 18 5.9 18.3 5.6C18.9 5.1 19 4.2 18.5 3.6L16.4 1.5C15.8 0.9 14.9 1 14.4 1.6C14.1 1.9 13.6 2 13.2 1.9L11.7 1.4C11.3 1.3 11 0.9 11 0.5V0.5C11 -0.3 10.3 -1 9.5 -1H6.5C5.7 -1 5 -0.3 5 0.5V0.5C5 0.9 4.7 1.3 4.3 1.4L2.8 1.9C2.4 2 1.9 1.9 1.6 1.6C1.1 1 0.2 0.9 -0.4 1.5L-2.5 3.6C-3.1 4.2 -3 5.1 -2.4 5.6C-2.1 5.9 -2 6.4 -2.1 6.8L-2.6 8.3C-2.7 8.7 -3.1 9 -3.5 9C-4.3 9 -5 9.7 -5 10.5V13.5C-5 14.3 -4.3 15 -3.5 15C-3.1 15 -2.7 15.3 -2.6 15.7L-2.1 17.2C-2 17.6 -2.1 18.1 -2.4 18.4C-3 18.9 -3.1 19.8 -2.5 20.4L-0.4 22.5C0.2 23.1 1.1 23 1.6 22.4C1.9 22.1 2.4 22 2.8 22.1L4.3 22.6C4.7 22.7 5 23.1 5 23.5V23.5C5 24.3 5.7 25 6.5 25H9.5C10.3 25 11 24.3 11 23.5V23.5C11 23.1 11.3 22.7 11.7 22.6L13.2 22.1C13.6 22 14.1 22.1 14.4 22.4C14.9 23 15.8 23.1 16.4 22.5L18.5 20.4C19.1 19.8 19 18.9 18.4 18.4C18.1 18.1 18 17.6 18.1 17.2L18.6 15.7C18.7 15.3 19.1 15 19.4 15Z"
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={{ rotate: 0 }}
        animate={{
          rotate: isActive || isHovered ? 90 : 0,
          strokeWidth: isActive || isHovered ? 1.7 : 1.5,
        }}
        transition={{ type: "spring", stiffness: 50, damping: 15 }}
        style={{ transformOrigin: "center" }}
      />

      {/* Dynamic Inner Component (Gear/Circle) */}
      <motion.path
        d="M12 8C9.8 8 8 9.8 8 12C8 14.2 9.8 16 12 16C14.2 16 16 14.2 16 12C16 9.8 14.2 8 12 8ZM12 14C10.9 14 10 13.1 10 12C10 10.9 10.9 10 12 10C13.1 10 14 10.9 14 12C14 13.1 13.1 14 12 14Z"
        fill="currentColor"
        stroke="none"
        initial={{ rotate: 0, scale: 1 }}
        animate={{
          rotate: isActive || isHovered ? -180 : 0,
          scale: isActive || isHovered ? 1.2 : 1,
        }}
        transition={{
          duration: 4,
          repeat: isActive || isHovered ? Infinity : 0,
          ease: "linear",
        }}
        style={{ transformOrigin: "center" }}
      />

      {/* Subatomic Core Pulse */}
      <motion.circle
        cx="12"
        cy="12"
        r="1"
        fill="currentColor"
        stroke="none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isActive || isHovered ? [0, 1, 0] : 0 }}
        transition={{ duration: 1, repeat: Infinity }}
      />
    </svg>
  );
};
