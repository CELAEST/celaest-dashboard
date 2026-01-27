"use client";

import React from "react";
/**
 * @deprecated Use useTheme from "@/features/shared/hooks/useTheme" instead.
 * This file is now a shim to avoid breaking the build during migration.
 */
export { useTheme } from "@/features/shared/hooks/useTheme";

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <>{children}</>;
};
