"use client";

import React, { useState, useCallback } from "react";
import { Shield, Users, Bell, Code, Globe, User } from "lucide-react";
import { SettingsTabButton } from "./SettingsTabButton";
import { AccountProfile } from "./tabs/AccountProfile";
import { SecurityAccess } from "./tabs/SecurityAccess";
import { WorkspaceTeam } from "./tabs/WorkspaceTeam";
import { Notifications } from "./tabs/Notifications";
import { DeveloperAPI } from "./tabs/DeveloperAPI";
import { Preferences } from "./tabs/Preferences";
import type { SettingsTabId, SettingsTab } from "../types";

/**
 * Main Settings View Container
 *
 * Layout Structure:
 * - Fixed header with title + tabs (sticky at top)
 * - Scrollable content area below
 *
 * Uses Strategy pattern for tab rendering.
 */
export function SettingsView() {
  const [activeTab, setActiveTab] = useState<SettingsTabId>("account");

  // Tab configuration
  const tabs: SettingsTab[] = [
    { id: "account", icon: User, label: "Account & Profile" },
    { id: "security", icon: Shield, label: "Security & Access" },
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
    <div className="flex flex-col h-full min-h-0">
      {/* ===== STATIC HEADER SECTION ===== */}
      <div className="shrink-0">
        {/* Title Bar */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Settings & Configuration
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Manage your account, security, team, and preferences
            </p>
          </div>

          {/* System Status */}
          <div className="flex items-center gap-3 bg-[#0d0d0d] border border-white/10 px-4 py-2 rounded-lg">
            <div className="relative">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                System
              </p>
              <p className="text-sm font-bold text-emerald-400">ONLINE</p>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex items-center gap-1 pb-4 border-b border-white/10 overflow-x-auto">
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
      <div className="flex-1 overflow-y-auto min-h-0 pt-6">
        <div className="animate-in fade-in duration-300">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}
