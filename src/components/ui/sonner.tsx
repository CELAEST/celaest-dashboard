"use client";

import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Sonner
      theme={isDark ? "dark" : "light"}
      className="toaster group"
      toastOptions={{
        style: isDark
          ? {
              background: "#0B0B10",
              color: "#F4F4F5",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }
          : undefined,
      }}
      {...props}
    />
  );
};

export { Toaster };
