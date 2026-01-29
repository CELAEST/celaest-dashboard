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
import type { SettingsTabId } from "./types";
import { motion, AnimatePresence } from "motion/react";

/**
 * Settings View - Edge-to-Edge Professional Layout
 * Sidebar Navigation + Full-Width Content
 */
export function SettingsView() {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<SettingsTabId>("account");

  // Tab configuration
  const tabs = useMemo(
    () =>
      [
        {
          id: "account",
          icon: User,
          label: "Account & Profile",
          color: "cyan",
        },
        {
          id: "security",
          icon: Shield,
          label: "Security & Access",
          color: "purple",
        },
        {
          id: "billing",
          icon: CreditCard,
          label: "Plans & Billing",
          color: "emerald",
        },
        {
          id: "workspace",
          icon: Users,
          label: "Workspace & Team",
          color: "blue",
        },
        {
          id: "notifications",
          icon: Bell,
          label: "Notifications",
          color: "amber",
        },
        { id: "developer", icon: Code, label: "Developer API", color: "pink" },
        {
          id: "preferences",
          icon: Globe,
          label: "Preferences",
          color: "indigo",
        },
      ] as const,
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

  const colorClasses: Record<
    string,
    { text: string; bg: string; border: string }
  > = {
    cyan: {
      text: "text-cyan-400",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/30",
    },
    purple: {
      text: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/30",
    },
    emerald: {
      text: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/30",
    },
    blue: {
      text: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/30",
    },
    amber: {
      text: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/30",
    },
    pink: {
      text: "text-pink-400",
      bg: "bg-pink-500/10",
      border: "border-pink-500/30",
    },
    indigo: {
      text: "text-indigo-400",
      bg: "bg-indigo-500/10",
      border: "border-indigo-500/30",
    },
  };

  return (
    <div
      className={`h-full flex overflow-hidden ${isDark ? "text-white dark" : "text-gray-900"}`}
    >
      {/* ===== SIDEBAR NAVIGATION ===== */}
      <div
        className={`w-64 shrink-0 flex flex-col border-r ${
          isDark ? "border-white/5" : "border-gray-200/50"
        }`}
      >
        {/* Sidebar Header */}
        <div className="px-6 py-4 border-b ${isDark ? 'border-white/5' : 'border-gray-200/50'}">
          <h1
            className={`text-xl font-black italic tracking-tighter uppercase ${isDark ? "text-white" : "text-gray-900"}`}
          >
            Configuration
          </h1>
          <p
            className={`text-[9px] font-black uppercase tracking-[0.2em] mt-0.5 ${isDark ? "text-gray-500" : "text-gray-400"}`}
          >
            System Control
          </p>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            const themeColor = colorClasses[tab.color];

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  relative w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-all duration-200
                  text-sm font-medium group
                  ${
                    isActive
                      ? isDark
                        ? `${themeColor.bg} ${themeColor.border} border text-white`
                        : "bg-white border border-gray-200 text-gray-900 shadow-sm"
                      : isDark
                        ? "text-gray-400 hover:bg-white/5 hover:text-white"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }
                `}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeSidebarTab"
                    className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full ${themeColor.text.replace("text-", "bg-")}`}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}

                <Icon
                  size={18}
                  className={`shrink-0 transition-colors ${isActive ? themeColor.text : "opacity-60 group-hover:opacity-100"}`}
                />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div
          className={`px-6 py-4 border-t ${isDark ? "border-white/5" : "border-gray-200/50"}`}
        >
          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-lg ${isDark ? "bg-emerald-500/10" : "bg-emerald-50"}`}
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span
              className={`text-[10px] font-black uppercase tracking-widest ${isDark ? "text-emerald-400" : "text-emerald-600"}`}
            >
              System Online
            </span>
          </div>
        </div>
      </div>

      {/* ===== MAIN CONTENT AREA (Edge-to-Edge) ===== */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Content Header Bar */}
        <div
          className={`shrink-0 px-8 py-4 border-b backdrop-blur-md ${
            isDark
              ? "border-white/5 bg-white/2"
              : "border-gray-200/50 bg-white/50"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2
                className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-900"}`}
              >
                {tabs.find((t) => t.id === activeTab)?.label}
              </h2>
              <p
                className={`text-xs mt-0.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}
              >
                {activeTab === "account" &&
                  "Manage your personal information and connected accounts"}
                {activeTab === "security" &&
                  "Configure authentication, sessions, and security settings"}
                {activeTab === "billing" &&
                  "View your subscription plan and billing information"}
                {activeTab === "workspace" &&
                  "Manage team members and workspace settings"}
                {activeTab === "notifications" &&
                  "Control how and when you receive notifications"}
                {activeTab === "developer" &&
                  "Access API keys, webhooks, and developer documentation"}
                {activeTab === "preferences" &&
                  "Customize your experience and interface preferences"}
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <div className="px-8 py-6">{renderTabContent()}</div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
