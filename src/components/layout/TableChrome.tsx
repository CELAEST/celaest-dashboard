"use client";

import React from "react";
import { useTheme } from "@/features/shared/hooks/useTheme";

interface TableChromeProps {
  toolbar?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}
export function TableChrome({ toolbar, children, footer }: TableChromeProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const card = isDark
    ? "bg-linear-to-br from-[#0a0a0a]/80 to-gray-900/50 border-white/10"
    : "bg-white border-gray-200 shadow-sm";
  const border = isDark ? "border-white/5" : "border-gray-200";

  return (
    <div
      className={`h-full flex flex-col rounded-2xl border overflow-hidden ${card}`}
    >
      {toolbar && (
        <div className={`shrink-0 px-4 py-3 border-b ${border}`}>
          {toolbar}
        </div>
      )}
      <div className="flex-1 min-h-0 overflow-auto">{children}</div>
      {footer && (
        <div className={`shrink-0 px-4 py-3 border-t ${border}`}>
          {footer}
        </div>
      )}
    </div>
  );
}
