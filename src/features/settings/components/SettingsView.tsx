"use client";

import React, { useState, useCallback } from "react";
import { 
  Shield, 
  Users, 
  Bell, 
  Code, 
  Globe, 
  User, 
  CreditCard 
} from "lucide-react";
import { SettingsTabButton } from "./SettingsTabButton";
import { AccountProfile } from "./tabs/AccountProfile";
import { SecurityAccess } from "./tabs/SecurityAccess";
import { WorkspaceTeam } from "./tabs/WorkspaceTeam";
import { Notifications } from "./tabs/Notifications";
import { DeveloperAPI } from "./tabs/DeveloperAPI";
import { Preferences } from "./tabs/Preferences";
import { PlansBilling } from "./tabs/PlansBilling";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import type { SettingsTabId, SettingsTab } from "../types";

/**
 * Main Settings View Container
 */
export function SettingsView() {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<SettingsTabId>("account");

  // Tab configuration
  const tabs: SettingsTab[] = [
    { id: "account", icon: User, label: "Account & Profile" },
    { id: "security", icon: Shield, label: "Security & Access" },
    { id: "billing", icon: CreditCard, label: "Plans & Billing" },
    { id: "workspace", icon: Users, label: "Workspace & Team" },
    { id: "notifications", icon: Bell, label: "Notifications" },
    { id: "developer", icon: Code, label: "Developer & API" },
    { id: "preferences", icon: Globe, label: "Preferences" },
  ];

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
    <div className={`flex flex-col h-full min-h-0 transition-colors duration-500 ${
      isDark ? "bg-[#050505] text-white dark" : "bg-[#F5F7FA] text-gray-900"
    }`}>
      {/* ===== STATIC HEADER SECTION ===== */}
      <div
        className={`shrink-0 sticky top-[-12px] z-20 pt-3 pb-0 -mx-3 px-3 transition-all duration-300 ${
          isDark
            ? "bg-[#050505]/90 backdrop-blur-md border-b border-white/10"
            : "bg-[#F5F7FA]/90 backdrop-blur-md border-b border-gray-200"
        }`}
      >
        {/* Title Bar */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className={`text-3xl font-bold tracking-tight ${
                isDark
                  ? "bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"
                  : "text-gray-900"
              }`}
            >
              Settings & Configuration
            </h1>
            <p
              className={`text-sm mt-1 ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Manage your account, security, team, and preferences
            </p>
          </div>

          {/* System Status */}
          <div
            className={`flex items-center gap-3 border px-4 py-2 rounded-xl transition-all duration-300 ${
              isDark
                ? "bg-black/40 border-white/10 shadow-lg shadow-black/20"
                : "bg-white border-gray-200 shadow-sm"
            }`}
          >
            <div className="relative">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div>
              <p className={`text-[10px] uppercase tracking-wider font-bold ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}>
                System
              </p>
              <p className="text-sm font-black text-emerald-500 tracking-tight">ONLINE</p>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex items-center gap-1 pb-4 overflow-x-auto no-scrollbar scroll-smooth">
          {tabs.map((tab) => (
            <SettingsTabButton
              key={tab.id}
              icon={tab.icon}
              label={tab.label}
              isActive={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            />
          ))}
        </div>
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
