import React from "react";
import { motion } from "motion/react";

interface IconProps {
  size?: number | string;
  className?: string;
  isActive?: boolean;
  isHovered?: boolean;
}

export const OrdersIcon = ({
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
      {/* Blueprint grid dots */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: active ? 0.2 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {[6, 12, 18].map((x) =>
          [6, 12, 18].map((y) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="0.5" fill="currentColor" stroke="none" />
          )),
        )}
      </motion.g>

      {/* Box outline — technical drawing style */}
      <motion.path
        d="M12 3L20 7.5V16.5L12 21L4 16.5V7.5L12 3Z"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 1 }}
        animate={{
          pathLength: active ? [0, 1] : 1,
          strokeWidth: active ? 1.4 : 1.2,
        }}
        transition={{ duration: 0.6 }}
      />

      {/* Inner cross lines */}
      <motion.path
        d="M12 13V21 M4 7.5L12 13L20 7.5"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={{ opacity: active ? 1 : 0.6 }}
      />

      {/* Connection nodes */}
      <motion.circle
        cx="12" cy="3" r="1.5"
        fill="currentColor" stroke="none"
        animate={{ scale: active ? 1 : 0, opacity: active ? 1 : 0 }}
        transition={{ duration: 0.2, delay: 0.3 }}
      />
      <motion.circle
        cx="12" cy="13" r="1.5"
        fill="currentColor" stroke="none"
        animate={{ scale: active ? 1 : 0, opacity: active ? 1 : 0 }}
        transition={{ duration: 0.2, delay: 0.4 }}
      />
    </svg>
  );
};
