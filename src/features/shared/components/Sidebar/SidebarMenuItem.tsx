import React, { useMemo } from "react";
import { motion } from "motion/react";
import { Shield } from "lucide-react";
import { MenuItem } from "./config";

interface SidebarMenuItemProps {
  item: MenuItem;
  isActive: boolean;
  isHovered: boolean;
  isLocked?: boolean;
  isDark: boolean;
  onClick: () => void;
}

export const SidebarMenuItem = React.memo(
  ({
    item,
    isActive,
    isHovered,
    isLocked,
    isDark,
    onClick,
  }: SidebarMenuItemProps) => {
    const Icon = item.icon;

    const buttonClassName = useMemo(
      () =>
        `group relative flex items-center h-12 rounded-xl transition-all duration-300 ${
          isActive
            ? isDark
              ? "bg-cyan-500/10 text-cyan-400"
              : "bg-blue-50 text-blue-600"
            : isDark
              ? "text-gray-400 hover:text-white hover:bg-white/5"
              : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
        } ${isLocked ? "opacity-60 grayscale" : ""}`,
      [isActive, isDark, isLocked],
    );

    return (
      <button
        onClick={onClick}
        className={buttonClassName}
        aria-label={item.label}
      >
        <div
          className={`absolute left-0 w-1 h-full rounded-r-full transition-opacity duration-300 ${
            isDark ? "bg-cyan-400" : "bg-blue-600"
          }`}
          style={{ opacity: isActive ? 1 : 0 }}
        />

        <div className="min-w-[48px] flex items-center justify-center relative">
          {isLocked && isHovered ? (
            // When sidebar is open and locked, show only the shield icon
            <Shield size={22} className="fill-current" />
          ) : (
            <>
              <Icon
                size={22}
                className={`transition-all duration-300 ${
                  isActive && isDark
                    ? "drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]"
                    : ""
                }`}
              />
              {isLocked && (
                <div
                  className={`absolute -top-1 -right-1 p-0.5 rounded-full ${
                    isDark ? "bg-black text-white" : "bg-white text-gray-900"
                  }`}
                >
                  <Shield size={10} className="fill-current" />
                </div>
              )}
            </>
          )}
        </div>

        <motion.span
          className="whitespace-nowrap font-medium tracking-wide text-sm flex items-center gap-2"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
          transition={{ duration: 0.2 }}
        >
          {item.label}
          {isLocked && <span className="opacity-50 text-xs">🔒</span>}
        </motion.span>

        {isActive && isHovered && !isLocked && (
          <motion.div
            layoutId="activeGlow"
            className={`absolute inset-0 rounded-xl -z-10 ${
              isDark ? "bg-cyan-400/5" : "bg-blue-600/5"
            }`}
          />
        )}
      </button>
    );
  },
);

SidebarMenuItem.displayName = "SidebarMenuItem";
