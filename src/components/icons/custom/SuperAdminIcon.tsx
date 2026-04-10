import React from "react";
import { motion } from "motion/react";

interface IconProps {
  size?: number | string;
  className?: string;
  isActive?: boolean;
  isHovered?: boolean;
}

export const SuperAdminIcon = ({
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
      {/* Crown outline */}
      <motion.path
        d="M3 18H21V20H3V18Z"
        strokeWidth="1.2"
        strokeLinejoin="round"
        fill="none"
        animate={{ opacity: active ? 1 : 0.6 }}
      />
      <motion.path
        d="M3 18L5 8L9 13L12 5L15 13L19 8L21 18"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 1 }}
        animate={{ pathLength: active ? [0, 1] : 1 }}
        transition={{ duration: 0.6 }}
      />

      {/* Crown jewel nodes */}
      {[
        { cx: 12, cy: 5, delay: 0.3 },
        { cx: 9, cy: 13, delay: 0.35 },
        { cx: 15, cy: 13, delay: 0.4 },
        { cx: 5, cy: 8, delay: 0.45 },
        { cx: 19, cy: 8, delay: 0.5 },
      ].map((pt) => (
        <motion.circle
          key={`${pt.cx}-${pt.cy}`}
          cx={pt.cx} cy={pt.cy} r="1.2"
          fill="currentColor" stroke="none"
          animate={{ scale: active ? 1 : 0, opacity: active ? 1 : 0 }}
          transition={{ duration: 0.2, delay: pt.delay }}
        />
      ))}

      {/* Radiance lines */}
      <motion.g animate={{ opacity: active ? 0.4 : 0 }} transition={{ delay: 0.3 }}>
        <line x1="12" y1="2" x2="12" y2="4" strokeWidth="0.8" strokeLinecap="round" />
        <line x1="10" y1="3" x2="11" y2="4.5" strokeWidth="0.8" strokeLinecap="round" />
        <line x1="14" y1="3" x2="13" y2="4.5" strokeWidth="0.8" strokeLinecap="round" />
      </motion.g>
    </svg>
  );
};
