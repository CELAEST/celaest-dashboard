"use client";

import React, { useState, useCallback, useMemo } from "react";
import {
  Gear,
  Shield,
  Users,
  Bell,
  Code,
  Globe,
  User,
  CreditCard,
  CaretLeft,
  Check,
} from "@phosphor-icons/react";
import { AccountProfile } from "./tabs/AccountProfile";
import { SecurityAccess } from "./tabs/SecurityAccess";
import { WorkspaceTeam } from "./tabs/WorkspaceTeam";
import { Notifications } from "./tabs/Notifications";
import { DeveloperAPI } from "./tabs/DeveloperAPI";
import { Preferences } from "./tabs/Preferences";
import { PlansBilling } from "./tabs/PlansBilling";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import type { SettingsTabId } from "./types";
import { motion, AnimatePresence } from "motion/react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

/**
 * Settings View - Executive Split-Pane Architecture
 * Cohesive with Marketplace, Orders, and Facturación design system
 */
export function SettingsView() {
  const { isDark } = useTheme();
  const { user } = useAuthStore();
  const searchParams = useSearchParams();
  const t = useTranslations("settings");
  const [activeTab, setActiveTab] = useState<SettingsTabId>(() => {
    const section = searchParams.get("section") as SettingsTabId;
    return section || "account";
  });
  const [viewMode, setViewMode] = useState<"list" | "detail">(() => {
    const section = searchParams.get("section");
    return section ? "detail" : "list";
  });

  const sessionUserEmail = user?.email || "esteban@celaest.com";

  // Sync if section changes via URL
  React.useEffect(() => {
    const section = searchParams.get("section") as SettingsTabId;
    if (section) {
      setActiveTab(section);
      setViewMode("detail");
    }
  }, [searchParams]);

  const handleTabSelect = useCallback((tabId: SettingsTabId) => {
    setActiveTab(tabId);
    setViewMode("detail");
  }, []);

  const handleBackToList = useCallback(() => {
    setViewMode("list");
  }, []);

  // Tab configuration - Grouped Domain Architecture
  const tabs = useMemo(
    () =>
      [
        { id: "account", icon: User, label: t("tab_account"), group: "Identidad" },
        { id: "security", icon: Shield, label: t("tab_security"), group: "Identidad" },
        { id: "billing", icon: CreditCard, label: t("tab_billing"), group: "Organización" },
        { id: "workspace", icon: Users, label: t("tab_workspace"), group: "Organización" },
        { id: "notifications", icon: Bell, label: t("tab_notifications"), group: "Sistema" },
        { id: "developer", icon: Code, label: t("tab_developer"), group: "Sistema" },
        { id: "preferences", icon: Globe, label: t("tab_preferences"), group: "Sistema" },
      ] as const,
    [t],
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
      className={`h-full flex flex-col min-h-0 overflow-hidden ${
        isDark ? "bg-transparent text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* ===== TOP HEADER (Cohesive with BillingPortal & MarketplaceHeader) ===== */}
      <header
        className={`shrink-0 px-4 sm:px-6 py-3.5 flex items-center justify-between border-b backdrop-blur-xl transition-colors duration-200 ${
          isDark
            ? "bg-[#09090b]/80 border-white/6"
            : "bg-white/80 border-gray-200/80"
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border transition-colors ${
              isDark
                ? "bg-white/[0.04] border-white/8 text-white/70"
                : "bg-gray-100 border-gray-200 text-gray-700"
            }`}
          >
            <Gear size={15} />
          </div>
          <div className="flex items-center gap-3">
            <h1
              className={`text-sm sm:text-base font-semibold font-jakarta tracking-tight ${
                isDark ? "text-zinc-100" : "text-gray-900"
              }`}
            >
              {t("configuration")}
            </h1>
            <span
              className={`text-[10px] sm:text-[11px] font-mono tracking-wider uppercase border-l pl-3 ${
                isDark
                  ? "border-white/10 text-white/40"
                  : "border-gray-200 text-gray-400"
              }`}
            >
              CELAEST Hub • Governance
            </span>
          </div>
        </div>

        <div
          className={`hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg border ${
            isDark
              ? "bg-white/[0.02] border-white/8 text-white/50"
              : "bg-gray-50 border-gray-200 text-gray-600"
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-[9px] font-mono uppercase tracking-[0.18em]">
            {t("system_online")}
          </span>
        </div>
      </header>

      {/* ===== SPLIT-PANE BODY ===== */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* ===== SIDEBAR NAVIGATION (MarketplaceFilterSidebar Standard) ===== */}
        <div
          className={`w-60 h-full shrink-0 flex-col border-r transition-colors ${
            viewMode === "list" ? "flex" : "hidden md:flex"
          } ${
            isDark
              ? "border-white/6 bg-transparent"
              : "border-gray-200 bg-white"
          }`}
        >
          {/* Subheader */}
          <div
            className={`px-4 py-3.5 border-b ${
              isDark ? "border-white/6" : "border-gray-200"
            }`}
          >
            <h2
              className={`text-xs font-mono font-bold uppercase tracking-[0.16em] ${
                isDark ? "text-white/90" : "text-gray-900"
              }`}
            >
              Módulos
            </h2>
            <p
              className={`text-[10px] font-mono tracking-wider ${
                isDark ? "text-white/40" : "text-gray-400"
              }`}
            >
              7 paneles de control
            </p>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-4">
            {["Identidad", "Organización", "Sistema"].map((groupName) => {
              const groupTabs = tabs.filter((t) => t.group === groupName);
              if (groupTabs.length === 0) return null;
              return (
                <div key={groupName} className="space-y-1">
                  <span
                    className={`px-3 text-[9px] font-mono uppercase tracking-[0.16em] font-semibold mb-1 block ${
                      isDark ? "text-white/30" : "text-gray-400"
                    }`}
                  >
                    {groupName}
                  </span>
                  {groupTabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    const Icon = tab.icon;

                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => handleTabSelect(tab.id)}
                        className={`
                          group relative overflow-hidden w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all duration-200 cursor-pointer text-left border
                          ${
                            isActive
                              ? isDark
                                ? "bg-zinc-800/40 border-white/8 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] text-zinc-100 font-semibold"
                                : "bg-white border-black/6 shadow-xs text-zinc-900 font-semibold"
                              : isDark
                                ? "border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40 hover:border-white/8 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                                : "border-transparent text-zinc-500 hover:text-zinc-900 hover:bg-white hover:border-black/6 hover:shadow-xs"
                          }
                        `}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <Icon
                            size={14}
                            className={`shrink-0 transition-colors ${
                              isActive
                                ? isDark
                                  ? "text-zinc-100"
                                  : "text-zinc-900"
                                : isDark
                                  ? "text-zinc-400 group-hover:text-zinc-200"
                                  : "text-zinc-500 group-hover:text-zinc-900"
                            }`}
                          />
                          <span className="truncate">{tab.label}</span>
                        </div>
                        {isActive && (
                          <Check
                            size={12}
                            strokeWidth={2.5}
                            className={
                              isDark
                                ? "text-zinc-200 shrink-0"
                                : "text-zinc-900 shrink-0"
                            }
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </nav>

          {/* Footer (OrderDetails style) */}
          <div
            className={`p-3 border-t flex items-center justify-between shrink-0 ${
              isDark
                ? "border-white/6 bg-transparent"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
                  isDark
                    ? "bg-white/[0.04] text-white/50 border-white/8"
                    : "bg-white text-gray-600 border-gray-200"
                }`}
              >
                <User size={13} />
              </div>
              <div className="min-w-0">
                <p
                  className={`text-[9px] font-mono uppercase tracking-[0.16em] ${
                    isDark ? "text-white/30" : "text-gray-400"
                  } truncate`}
                >
                  Sesión
                </p>
                <p
                  className={`text-[11px] font-mono ${
                    isDark ? "text-white/70" : "text-gray-700"
                  } truncate`}
                >
                  {sessionUserEmail}
                </p>
              </div>
            </div>
            <span className="shrink-0 px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/8 text-[9px] font-mono text-emerald-400 uppercase tracking-wider font-semibold">
              OK
            </span>
          </div>
        </div>

        {/* ===== MAIN CONTENT AREA (Marketplace / Billing Standard) ===== */}
        <div
          className={`flex-1 flex-col min-w-0 overflow-hidden ${
            viewMode === "detail" ? "flex" : "hidden md:flex"
          } ${isDark ? "bg-transparent" : "bg-white"}`}
        >
          {/* Section Canvas Header */}
          <div
            className={`shrink-0 px-6 py-4 border-b flex items-center justify-between gap-3 ${
              isDark
                ? "bg-[#09090b]/80 border-white/6 backdrop-blur-xl"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <button
                onClick={handleBackToList}
                className="md:hidden p-2 -ml-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400 cursor-pointer"
                aria-label="Back to settings list"
              >
                <CaretLeft size={20} weight="bold" />
              </button>
              <div>
                <div className="flex items-center gap-2.5">
                  <h2
                    className={`text-base sm:text-lg font-bold font-jakarta tracking-tight ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {tabs.find((t) => t.id === activeTab)?.label}
                  </h2>
                  <span
                    className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full border ${
                      isDark
                        ? "bg-white/[0.04] text-white/60 border-white/8"
                        : "bg-gray-100 text-gray-600 border-gray-200"
                    }`}
                  >
                    Activo
                  </span>
                </div>
                <p
                  className={`text-xs font-mono mt-0.5 ${
                    isDark ? "text-white/40" : "text-gray-500"
                  }`}
                >
                  {activeTab === "account" && t("desc_account")}
                  {activeTab === "security" && t("desc_security")}
                  {activeTab === "billing" && t("desc_billing")}
                  {activeTab === "workspace" && t("desc_workspace")}
                  {activeTab === "notifications" && t("desc_notifications")}
                  {activeTab === "developer" && t("desc_developer")}
                  {activeTab === "preferences" && t("desc_preferences")}
                </p>
              </div>
            </div>
          </div>

          {/* Scrollable Content Container (Transparent Obsidian Canvas) */}
          <div
            className={`flex-1 overflow-y-auto no-scrollbar ${
              isDark ? "bg-transparent" : "bg-gray-50/50"
            }`}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="w-full p-4 sm:p-6 lg:p-8 space-y-6"
              >
                {renderTabContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
