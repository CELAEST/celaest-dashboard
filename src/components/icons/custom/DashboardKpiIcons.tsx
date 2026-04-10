import React from "react";
import { motion } from "motion/react";

interface DashboardIconProps {
  size?: number | string;
  className?: string;
  isHovered?: boolean;
}

/**
 * REVENUE KPI ICON
 * Meaning: Financial growth.
 * Clean, minimal line chart. On hover, the line highlights an upward trend.
 */
export const RevenueKpiIcon = ({
  size = 18,
  className = "",
  isHovered = false,
}: DashboardIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Base graph line */}
    <motion.path
      d="M3 17L9 11L13 13L21 5"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      initial={{ pathLength: 1 }}
      animate={{ pathLength: isHovered ? [0, 1] : 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    />
    
    {/* Terminal Data point */}
    <motion.circle 
      cx="21" cy="5" r="2" 
      fill="currentColor" stroke="none"
      animate={{ scale: isHovered ? [1, 1.4, 1] : 1 }}
      transition={{ duration: 0.4, delay: 0.5 }}
    />

    {/* Subtle grid line for context */}
    <motion.line 
      x1="3" y1="20" x2="21" y2="20" 
      strokeWidth="1.5" strokeLinecap="round"
      animate={{ opacity: isHovered ? 1 : 0.3 }}
    />
  </svg>
);

/**
 * ORDERS KPI ICON
 * Meaning: Fulfillment & Logistics.
 * Clean isometric box. On hover, a checkmark indicates successful processing.
 */
export const OrdersKpiIcon = ({
  size = 18,
  className = "",
  isHovered = false,
}: DashboardIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Cube geometry */}
    <motion.path
      d="M12 3L20 7.5V16.5L12 21L4 16.5V7.5L12 3Z"
      strokeWidth="1.8"
      strokeLinejoin="round"
      fill="none"
    />
    <motion.path
      d="M12 12V21 M4 7.5L12 12L20 7.5 M12 3L12 12"
      strokeWidth="1.8"
      strokeLinejoin="round"
      fill="none"
    />
    
    {/* Success Checkmark overlay on hover */}
    <motion.g
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ 
        opacity: isHovered ? 1 : 0, 
        scale: isHovered ? 1 : 0.5,
        y: isHovered ? -4 : 0
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <circle cx="12" cy="11" r="5" fill="currentColor" stroke="none" />
      <path d="M10 11.5L11.5 13L14.5 9" stroke="var(--background, #fff)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </motion.g>
  </svg>
);

/**
 * LICENSES KPI ICON
 * Meaning: Access & Authorization.
 * Clean keyhole shield. On hover, shield unlocks.
 */
export const LicensesKpiIcon = ({
  size = 18,
  className = "",
  isHovered = false,
}: DashboardIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Shield outline */}
    <motion.path
      d="M12 22S4 18 4 10V5L12 2L20 5V10C20 18 12 22 12 22Z"
      strokeWidth="1.8"
      strokeLinejoin="round"
      fill="none"
    />
    
    {/* Keyhole Core */}
    <motion.circle 
      cx="12" cy="10" r="2" 
      strokeWidth="1.8" fill="none" 
    />
    <motion.path 
      d="M12 12V15" 
      strokeWidth="1.8" strokeLinecap="round"
      animate={{ 
        rotate: isHovered ? 90 : 0, 
        y: isHovered ? -1 : 0 
      }}
      style={{ transformOrigin: "12px 10px" }}
      transition={{ type: "spring", stiffness: 250, damping: 15 }}
    />
  </svg>
);

/**
 * USERS KPI ICON
 * Meaning: Expanding Network.
 * Core user icon. On hover, connects to a new node, showing growth.
 */
export const UsersKpiIcon = ({
  size = 18,
  className = "",
  isHovered = false,
}: DashboardIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Primary User */}
    <motion.g
      animate={{ x: isHovered ? -3 : 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <circle cx="12" cy="7" r="4" strokeWidth="1.8" fill="none" />
      <path d="M5 21C5 17 8 14 12 14C16 14 19 17 19 21" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    </motion.g>

    {/* Secondary Connection showing growth on hover */}
    <motion.g
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -5 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      {/* Network link */}
      <line x1="12" y1="10" x2="18" y2="10" strokeWidth="1.5" strokeDasharray="2 2" />
      {/* Secondary node */}
      <circle cx="18" cy="10" r="2" fill="currentColor" stroke="none" />
    </motion.g>
  </svg>
);
