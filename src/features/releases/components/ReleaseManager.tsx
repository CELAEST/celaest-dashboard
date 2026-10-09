"use client";

import React, { useState, useRef } from "react";
import {
  Crown,
  User,
  SquaresFour,
  ClockCounterClockwise as HistoryIcon,
  Tag,
  Plus,
  ArrowsClockwise,
} from "@phosphor-icons/react";
import { useAuth as _useAuth } from "@/features/auth/contexts/AuthContext";

import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { VersionControl } from "./VersionControl";
import { ReleaseMetrics } from "./ReleaseMetrics";
import { UpdateCenter } from "./UpdateCenter";
import { DeployPanel } from "./DeployPanel";
import { RecentReleaseFeed } from "./Overview/RecentReleaseFeed";
import { EnvironmentHealth } from "./Overview/EnvironmentHealth";
import { motion, AnimatePresence } from "motion/react";
import { useReleaseOverview } from "@/features/releases/hooks/useReleaseOverview";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useApiAuth } from "@/lib/use-api-auth";
import { useRole } from "@/features/auth/hooks/useAuthorization";
import { assetsService } from "@/features/assets/services/assets.service";
import { QUERY_KEYS } from "@/features/shared/constants/queryKeys";
import { useTranslations } from "next-intl";

export const ReleaseManager: React.FC = () => {
  const { theme } = useTheme();
  const { token, orgId } = useApiAuth();
  const { isAdmin } = useRole();
  const isDark = theme === "dark";
  const t = useTranslations("releases");

  const searchParams = useSearchParams();
  const initialView =
    searchParams.get("view") === "customer" ? "customer" : "admin";
  const [viewMode, setViewMode] = useState<"admin" | "customer">(initialView);
  const [
    activeTab,
    setActiveTab,
  ] = useState<"overview" | "history">("history");
  const [isDeployOpen, setIsDeployOpen] = useState(false);
  const createReleaseRef = useRef<(() => void) | undefined>(undefined);

  // Clients always see customer view (Update Center)
  const effectiveView = isAdmin ? viewMode : "customer";

  // Latest 2 releases for header tags
  const { data: latestReleasesData } = useQuery({
    queryKey: QUERY_KEYS.releases.versions(orgId || "none"),
    queryFn: async () => {
      if (!token || !orgId) return { data: [], total: 0, page: 1 };
      return assetsService.getGlobalReleases(token, orgId, 1, 3);
    },
    enabled: !!token && !!orgId,
  });
  const headerTags = (latestReleasesData?.data || []).slice(0, 2).map((r) => ({
    version: r.version,
    status: r.status as string,
  }));

  // Data Fetching
  const {
    data: overviewData,
    isLoading: overviewLoading,
  } = useReleaseOverview({
    enabled: effectiveView === "admin" && activeTab === "overview",
  });

  // Mock Asset for Deploy Panel
  const deployAsset = {
    title: "New Release Build",
    version: "2.1.0",
    price: "$0.00",
  };

  return (
    <div className="h-full flex flex-col min-h-0 overflow-hidden">
      {/* Sleek luxury header — matching Orders, Licensing Hub, Invoices, Assets */}
      <header
        className={`shrink-0 px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b backdrop-blur-xl transition-colors duration-200 ${
          isDark
            ? "bg-[#09090b]/80 border-white/6"
            : "bg-white/80 border-gray-200/80"
        }`}
      >
        {/* Left: Icon, Title, Subtitle */}
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border transition-colors ${
              isDark
                ? "bg-white/[0.04] border-white/8 text-white/70"
                : "bg-gray-100 border-gray-200 text-gray-700"
            }`}
          >
            <ArrowsClockwise size={16} />
          </div>
          <div>
            <h1
              className={`text-sm sm:text-base font-semibold tracking-tight ${
                isDark ? "text-zinc-100" : "text-gray-900"
              }`}
            >
              {effectiveView === "admin"
                ? t("release_management")
                : t("update_center")}
            </h1>
            <p
              className={`text-[10px] sm:text-[11px] font-mono tracking-wider uppercase ${
                isDark ? "text-white/40" : "text-gray-400"
              }`}
            >
              {effectiveView === "admin"
                ? t("governance_subtitle")
                : t("update_center_subtitle")}
            </p>
          </div>
        </div>

        {/* Right: Actions, Tabs, Switchers */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Admin Tabs */}
          {effectiveView === "admin" && (
            <div
              className={`inline-flex p-0.5 rounded-lg border ${
                isDark
                  ? "bg-white/[0.02] border-white/8"
                  : "bg-gray-100 border-gray-200"
              }`}
            >
              <button
                onClick={() => setActiveTab("history")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "history"
                    ? isDark
                      ? "bg-white/10 text-white shadow-xs font-semibold"
                      : "bg-white text-gray-900 shadow-xs font-semibold"
                    : isDark
                      ? "text-white/40 hover:text-white/80 font-medium"
                      : "text-gray-500 hover:text-gray-900 font-medium"
                }`}
              >
                <HistoryIcon size={13} />
                <span>{t("tab_history")}</span>
              </button>
              <button
                onClick={() => setActiveTab("overview")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "overview"
                    ? isDark
                      ? "bg-white/10 text-white shadow-xs font-semibold"
                      : "bg-white text-gray-900 shadow-xs font-semibold"
                    : isDark
                      ? "text-white/40 hover:text-white/80 font-medium"
                      : "text-gray-500 hover:text-gray-900 font-medium"
                }`}
              >
                <SquaresFour size={13} />
                <span>{t("tab_overview")}</span>
              </button>
            </div>
          )}

          {/* New Release button - only in history tab */}
          {effectiveView === "admin" && activeTab === "history" && (
            <button
              onClick={() => createReleaseRef.current?.()}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider bg-white text-black hover:bg-zinc-200 transition-colors shadow-sm cursor-pointer"
            >
              <Plus size={14} weight="bold" />
              <span>{t("btn_new_release")}</span>
            </button>
          )}

          {/* Version tags */}
          {effectiveView === "admin" && headerTags.length > 0 && (
            <div className="hidden sm:flex items-center gap-1.5">
              {headerTags.map((t) => (
                <span
                  key={t.version}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono border ${
                    isDark
                      ? "bg-white/[0.03] text-white/60 border-white/8"
                      : "bg-gray-100 text-gray-600 border-gray-200"
                  }`}
                >
                  <Tag size={10} />
                  {t.version}
                </span>
              ))}
            </div>
          )}

          {/* View Mode Toggle */}
          {isAdmin && (
            <div
              className={`inline-flex p-0.5 rounded-lg border ${
                isDark
                  ? "bg-white/[0.02] border-white/8"
                  : "bg-gray-100 border-gray-200"
              }`}
            >
              <button
                onClick={() => setViewMode("customer")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                  effectiveView === "customer"
                    ? isDark
                      ? "bg-white/10 text-white shadow-xs font-semibold"
                      : "bg-white text-gray-900 shadow-xs font-semibold"
                    : isDark
                      ? "text-white/40 hover:text-white/80 font-medium"
                      : "text-gray-500 hover:text-gray-900 font-medium"
                }`}
              >
                <User size={13} />
                <span>{t("view_customer")}</span>
              </button>
              <button
                onClick={() => setViewMode("admin")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                  effectiveView === "admin"
                    ? isDark
                      ? "bg-white/10 text-white shadow-xs font-semibold"
                      : "bg-white text-gray-900 shadow-xs font-semibold"
                    : isDark
                      ? "text-white/40 hover:text-white/80 font-medium"
                      : "text-gray-500 hover:text-gray-900 font-medium"
                }`}
              >
                <Crown size={13} />
                <span>{t("view_admin")}</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content — Matching composition: px-4 sm:px-6 pt-4 sm:pt-5 pb-4 sm:pb-6 */}
      <div className="flex-1 min-h-0 w-full flex flex-col px-4 sm:px-6 pt-4 sm:pt-5 pb-4 sm:pb-6 overflow-hidden">
        {effectiveView === "admin" ? (
          <div className="flex-1 min-h-0 relative">
            <AnimatePresence mode="wait">
              {activeTab === "history" && (
                <motion.div
                  key="history"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.15 }}
                  className="h-full flex flex-col min-h-0"
                >
                  <div className="flex-1 min-h-0 overflow-hidden">
                    <VersionControl createRef={createReleaseRef} />
                  </div>
                </motion.div>
              )}

              {activeTab === "overview" && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, scale: 0.99 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.99 }}
                  transition={{ duration: 0.15 }}
                  className="h-full flex flex-col gap-4 overflow-y-auto custom-scrollbar"
                >
                  {/* Metrics Row - Fixed Height */}
                  <div className="shrink-0">
                    <ReleaseMetrics
                      metrics={overviewData?.metrics}
                      isLoading={overviewLoading}
                    />
                  </div>

                  {/* Dashboard Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-2">
                    <EnvironmentHealth
                      systemHealth={overviewData?.metrics?.system_health}
                      isLoading={overviewLoading || !overviewData}
                    />
                    <RecentReleaseFeed
                      activities={overviewData?.activity}
                      isLoading={overviewLoading}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex-1 min-h-0 overflow-y-auto pr-1 pb-4 custom-scrollbar">
            <UpdateCenter enabled={effectiveView === "customer"} />
          </div>
        )}
      </div>

      {/* Deploy Modal */}
      <DeployPanel
        isOpen={isDeployOpen}
        onClose={() => setIsDeployOpen(false)}
        asset={deployAsset}
      />
    </div>
  );
};
