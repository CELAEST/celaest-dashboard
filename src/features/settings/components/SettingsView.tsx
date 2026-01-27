"use client";

import React, { useState, useCallback, useMemo } from "react";
import {
  Shield,
  Users,
  Bell,
  Code,
  Globe,
  User,
  CreditCard,
} from "lucide-react";
import { AccountProfile } from "./tabs/AccountProfile";
import { SecurityAccess } from "./tabs/SecurityAccess";
import { WorkspaceTeam } from "./tabs/WorkspaceTeam";
import { Notifications } from "./tabs/Notifications";
import { DeveloperAPI } from "./tabs/DeveloperAPI";
import { Preferences } from "./tabs/Preferences";
import { PlansBilling } from "./tabs/PlansBilling";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { SettingsHeader } from "./SettingsHeader";
import { SettingsTabsNavigation } from "./SettingsTabsNavigation";
import type { SettingsTabId, SettingsTab } from "./types";

/**
 * Main Settings View Container
 */
export function SettingsView() {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<SettingsTabId>("account");

  // Tab configuration
  const tabs: SettingsTab[] = useMemo(
    () => [
      { id: "account", icon: User, label: "Account & Profile" },
      { id: "security", icon: Shield, label: "Security & Access" },
      { id: "billing", icon: CreditCard, label: "Plans & Billing" },
      { id: "workspace", icon: Users, label: "Workspace & Team" },
      { id: "notifications", icon: Bell, label: "Notifications" },
      { id: "developer", icon: Code, label: "Developer & API" },
      { id: "preferences", icon: Globe, label: "Preferences" },
    ],
    [],
  );

  // Tab content renderer
  const renderTabContent = useCallback(() => {
    switch (activeTab) {
      case "account":
        return <AccountProfile />;
      case "security":
        return <SecurityAccess />;
      case "billing":
        return <PlansBilling />;
      case "workspace":
        return <WorkspaceTeam />;
      case "notifications":
        return <Notifications />;
      case "developer":
        return <DeveloperAPI />;
      case "preferences":
        return <Preferences />;
      default:
        return null;
    }
  }, [activeTab]);

  return (
    <div
      className={`flex flex-col h-full min-h-0 transition-colors duration-500 ${
        isDark ? "bg-[#050505] text-white dark" : "bg-[#F5F7FA] text-gray-900"
      }`}
    >
      {/* ===== STATIC HEADER SECTION ===== */}
      <div
        className={`shrink-0 sticky top-[-12px] z-20 pt-3 pb-0 -mx-3 px-3 transition-all duration-300 ${
          isDark
            ? "bg-[#050505]/90 backdrop-blur-md border-b border-white/10"
            : "bg-[#F5F7FA]/90 backdrop-blur-md border-b border-gray-200"
        }`}
      >
        <SettingsHeader />
        <SettingsTabsNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {/* ===== SCROLLABLE CONTENT SECTION ===== */}
      <div className="flex-1 min-h-0 pt-8">
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 ease-out">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}
