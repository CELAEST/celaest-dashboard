import React from "react";
import { motion } from "motion/react";

interface IconProps {
  size?: number | string;
  className?: string;
  isActive?: boolean;
  isHovered?: boolean;
}

export const BillingIcon = ({
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
      {/* Card body */}
      <motion.rect
        x="2" y="5" width="20" height="14" rx="2"
        strokeWidth="1.2"
        fill="none"
        initial={{ pathLength: 1 }}
        animate={{ pathLength: active ? [0, 1] : 1 }}
        transition={{ duration: 0.5 }}
      />

      {/* Magnetic stripe */}
      <motion.line x1="2" y1="10" x2="22" y2="10" strokeWidth="1.2"
        animate={{ opacity: active ? 1 : 0.6 }}
      />

      {/* Card details — technical line */}
      <motion.g animate={{ opacity: active ? 0.7 : 0 }} transition={{ delay: 0.2 }}>
        <rect x="5" y="13" width="8" height="1.5" rx="0.5" strokeWidth="0.7" fill="none" />
        <rect x="5" y="16" width="5" height="1.5" rx="0.5" strokeWidth="0.7" fill="none" />
      </motion.g>

      {/* Chip */}
      <motion.rect x="16" y="13" width="3.5" height="2.5" rx="0.5" strokeWidth="1" fill="none"
        animate={{ opacity: active ? 1 : 0.5 }}
      />

      {/* Node */}
      <motion.circle cx="17.75" cy="14.25" r="0.6" fill="currentColor" stroke="none"
        animate={{ scale: active ? 1 : 0, opacity: active ? 1 : 0 }}
        transition={{ duration: 0.2, delay: 0.4 }}
      />
    </svg>
  );
};
