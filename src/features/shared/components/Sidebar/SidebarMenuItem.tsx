import React, { useMemo } from "react";
import { motion } from "motion/react";
import { Shield } from "@phosphor-icons/react";
import { MenuItem } from "./config";

interface SidebarMenuItemProps {
  item: MenuItem;
  isActive: boolean;
  isHovered: boolean;
  isLocked?: boolean;
  onClick: () => void;
}

export const SidebarMenuItem = React.memo(
  ({
    item,
    isActive,
    isHovered,
    isLocked,
    onClick,
  }: SidebarMenuItemProps) => {
    const Icon = item.icon;

    const buttonClassName = `group relative overflow-hidden outline-none flex w-full items-center h-[52px] px-2 rounded-xl transition-colors duration-200 ${
      isActive
        ? "text-zinc-900 font-semibold dark:text-zinc-100"
        : "text-zinc-500 hover:text-zinc-900 hover:bg-black/[0.02] dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-white/[0.02]"
    } ${isLocked ? "opacity-60 grayscale" : ""}`;

    return (
      <button
        onClick={onClick}
        className={buttonClassName}
        aria-label={item.label}
        aria-current={isActive ? "page" : undefined}
      >
        {isActive && !isLocked && (
          <motion.div
            layoutId="activeTabBackground"
            className="absolute inset-0 rounded-lg -z-10 overflow-hidden bg-white border border-black/6 shadow-sm dark:bg-zinc-800/40 dark:border-white/8 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
            initial={false}
            transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
          >
            {/* Premium Animated Sheen (Glass Reflection) */}
            <motion.div 
              className="absolute inset-0 bg-linear-to-r from-transparent via-white/4 to-transparent w-[200%] hidden dark:block"
              animate={{ x: ["-100%", "50%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        )}

        <div className="min-w-[48px] flex items-center justify-center relative z-10">
          {isLocked && isHovered ? (
            <Shield size={22} className="fill-current" />
          ) : (
            <>
              <Icon
                size={26}
                weight={isActive ? "fill" : "regular"}
                isActive={isActive}
                isHovered={isHovered}
                className={`transition-all duration-300 ${
                  isActive
                    ? "dark:drop-shadow-[0_0_6px_rgba(255,255,255,0.25)]"
                    : ""
                }`}
              />
              {isLocked && (
                <div
                  className="absolute -top-1 -right-1 p-0.5 rounded-full bg-white text-gray-900 dark:bg-[#0a0a0a] dark:text-white"
                >
                  <Shield size={8} className="fill-current" />
                </div>
              )}
            </>
          )}
        </div>

        <motion.span
          className="whitespace-nowrap shrink-0 font-medium tracking-wide text-[16px] flex items-center gap-2 z-10"
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -5 }}
          transition={{ duration: 0.2 }}
        >
          {item.label}
          {isLocked && <span className="opacity-50 text-[10px]">🔒</span>}
        </motion.span>
      </button>
    );
  },
);

SidebarMenuItem.displayName = "SidebarMenuItem";
