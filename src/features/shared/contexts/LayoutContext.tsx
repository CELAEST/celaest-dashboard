"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface LayoutContextType {
  navbarSearchVisible: boolean;
  setNavbarSearchVisible: (visible: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [navbarSearchVisible, setNavbarSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <LayoutContext.Provider
      value={{
        navbarSearchVisible,
        setNavbarSearchVisible,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  return context;
};
