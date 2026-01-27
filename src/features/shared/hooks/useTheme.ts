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

  // Determinar si estamos en modo oscuro
  // Nota: Esto se basa en el estado de Zustand, sincronizado por ThemeSync
  const isDark = useMemo(() => {
    if (!isMounted) return false;
    if (theme === "system") {
      if (typeof window !== "undefined") {
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
      }
      return false;
    }
    return theme === "dark";
  }, [theme, isMounted]);

  // Determinar el tema resuelto (claro u oscuro real)
  const resolvedTheme = useMemo(() => {
    if (!isMounted) return undefined;
    if (theme === "system") {
      if (typeof window !== "undefined") {
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      }
      return "light";
    }
    return theme;
  }, [theme, isMounted]);

  const toggleTheme = useCallback(() => {
    if (theme === "system") {
      // Si el sistema es oscuro, pasar explicitamente a claro. Viceversa.
      const systemIsDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(systemIsDark ? "light" : "dark");
    } else {
      setTheme(theme === "dark" ? "light" : "dark");
    }
  }, [theme, setTheme]);

  return {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
    isDark,
    isMounted,
  };
};
