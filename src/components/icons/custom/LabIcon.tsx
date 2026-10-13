import React from "react";
import { motion } from "motion/react";

interface IconProps {
  size?: number | string;
  className?: string;
  isActive?: boolean;
  isHovered?: boolean;
}

export const LabIcon = ({
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
      {/* Flask rim & neck */}
      <path
        d="M9 3H15M10 3V8.5L5 18C4.2 19.5 5.3 21 7 21H17C18.7 21 19.8 19.5 19 18L14 8.5V3"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Liquid level */}
      <motion.path
        d="M7 16C9 14.5 11 17 13 15.5C15 14 17 16.5 17 16"
        strokeWidth="1.2"
        strokeLinecap="round"
        animate={{
          d: active
            ? [
                "M7 16C9 14.5 11 17 13 15.5C15 14 17 16.5 17 16",
                "M7 15.5C9 17 11 14.5 13 16C15 17.5 17 15.5 17 15.5",
                "M7 16C9 14.5 11 17 13 15.5C15 14 17 16.5 17 16",
              ]
            : "M7 16C9 14.5 11 17 13 15.5C15 14 17 16.5 17 16",
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Bubbles */}
      <motion.circle
        cx="10"
        cy="18"
        r="1"
        fill="currentColor"
        animate={{ y: active ? [-1, -4, -1] : 0, opacity: active ? [0.4, 1, 0.4] : 0.6 }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <motion.circle
        cx="14"
        cy="17.5"
        r="0.8"
        fill="currentColor"
        animate={{ y: active ? [-1, -3, -1] : 0, opacity: active ? [0.3, 0.9, 0.3] : 0.5 }}
        transition={{ duration: 1.8, repeat: Infinity, delay: 0.3 }}
      />
    </svg>
  );
};
