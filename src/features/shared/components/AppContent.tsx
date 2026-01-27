"use client";

import React, { useState } from "react";
import { Toaster } from "sonner";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { InitialSetup } from "@/features/auth/components/InitialSetup";
import { Sidebar } from "@/features/shared/components/Sidebar";
import { Header } from "@/features/shared/components/Header";
import { AppBackground } from "./AppContent/AppBackground";
import { LoadingScreen } from "./AppContent/LoadingScreen";
import { AppViewSwitcher } from "./AppContent/AppViewSwitcher";

export const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { theme } = useTheme();
  const { user, isLoading } = useAuth();

  const isDark = theme === "dark";

  // Check for setup mode in URL
  const urlParams = new URLSearchParams(window.location.search);
  const setupMode = urlParams.get("setup") === "true";

  // DEMO: Auto-login as Super Admin for demonstration
  const demoUser = {
    id: "demo_superadmin_001",
    email: "admin@celaest.com",
    name: "CELAEST Admin",
    role: "super_admin" as const,
    scopes: {
      "templates:write": true,
      "templates:read": true,
      "billing:read": true,
      "billing:write": true,
      "users:manage": true,
      "analytics:read": true,
      "releases:write": true,
      "releases:read": true,
      "marketplace:purchase": true,
    },
  };

  const currentUser = user || demoUser; // Use demo user if not authenticated

  // Show loading state while checking authentication
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Show initial setup if requested
  if (setupMode && !currentUser) {
    return <InitialSetup />;
  }

  return (
    <div
      className={`min-h-screen font-sans selection:bg-cyan-500/30 selection:text-cyan-100 overflow-x-hidden transition-colors duration-500 ${
        isDark ? "bg-[#050505] text-white" : "bg-[#F5F7FA] text-gray-900"
      }`}
    >
      <AppBackground />

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="pl-[80px] relative z-10 transition-all duration-300">
        <Header />

        <main className="p-3 mx-auto min-h-[calc(100vh-80px)]">
          <AppViewSwitcher activeTab={activeTab} />
        </main>
      </div>
      <Toaster theme={isDark ? "dark" : "light"} position="bottom-right" />
    </div>
  );
};
