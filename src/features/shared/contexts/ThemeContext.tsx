"use client";

import React, { createContext, useContext } from "react";
import {
  ThemeProvider as NextThemesProvider,
  useTheme as useNextTheme,
} from "next-themes";

interface ThemeContextType {
  theme: string | undefined;
  setTheme: (theme: string) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <ThemeContextWrapper>{children}</ThemeContextWrapper>
    </NextThemesProvider>
  );
};

// Wrapper to provide the exact context shape the app expects, plus extra utilities
const ThemeContextWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { theme, setTheme } = useNextTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    // If used outside of our wrapper but inside NextThemesProvider, fallback to direct usage could be possible,
    // but for now let's enforce our structure.
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
