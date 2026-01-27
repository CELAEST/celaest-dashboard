"use client";

import { useEffect } from "react";
import { useUIStore } from "@/stores/useUIStore";

/**
 * Componente de sistema para sincronizar el estado de Zustand con el DOM.
 * Maneja la persistencia visual y los cambios de preferencia del sistema.
 */
export const ThemeSync = () => {
  const theme = useUIStore((state) => state.theme);
  const setIsMounted = useUIStore((state) => state.setIsMounted);

  useEffect(() => {
    // Marcar como montado para evitar hydration mismatch en otros componentes
    setIsMounted(true);

    const applyTheme = (currentTheme: string) => {
      const root = window.document.documentElement;
      root.classList.remove("light", "dark");

      if (currentTheme === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
          .matches
          ? "dark"
          : "light";
        root.classList.add(systemTheme);
      } else {
        root.classList.add(currentTheme);
      }
    };

    // Aplicar tema inicial y en cada cambio
    applyTheme(theme);

    // Escuchar cambios del sistema si el tema es 'system'
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => applyTheme("system");

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme, setIsMounted]);

  return null; // Componente puramente lógico
};
