"use client";

import { useCallback, useMemo } from "react";
import { useUIStore } from "@/stores/useUIStore";

/**
 * Hook utilitario para consumir el tema desde el store de Zustand.
 * Abstrae la lógica de isDark y toggleTheme.
 */
export const useTheme = () => {
  const theme = useUIStore((state) => state.theme);
  const setTheme = useUIStore((state) => state.setTheme);
  const isMounted = useUIStore((state) => state.isMounted);

  const isProduction = process.env.NODE_ENV === "production";

  // Determinar si estamos en modo oscuro
  // Nota: Esto se basa en el estado de Zustand, sincronizado por ThemeSync
  const isDark = useMemo(() => {
    if (isProduction) return true;
    if (!isMounted) return false;
    if (theme === "system") {
      if (typeof window !== "undefined") {
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
      }
      return false;
    }
    return theme === "dark";
  }, [theme, isMounted, isProduction]);

  // Determinar el tema resuelto (claro u oscuro real)
  const resolvedTheme = useMemo(() => {
    if (isProduction) return "dark";
    if (!isMounted) return undefined;
    if (theme === "system") {
      if (typeof window !== "undefined") {
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      }
      return "light";
    }
    return theme;
  }, [theme, isMounted, isProduction]);

  const toggleTheme = useCallback(() => {
    if (isProduction) return;
    if (theme === "system") {
      // Si el sistema es oscuro, pasar explicitamente a claro. Viceversa.
      const systemIsDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(systemIsDark ? "light" : "dark");
    } else {
      setTheme(theme === "dark" ? "light" : "dark");
    }
  }, [theme, setTheme, isProduction]);

  return {
    theme: isProduction ? "dark" : theme,
    resolvedTheme: isProduction ? "dark" : resolvedTheme,
    setTheme,
    toggleTheme,
    isDark: isProduction ? true : isDark,
    isMounted,
  };
};
