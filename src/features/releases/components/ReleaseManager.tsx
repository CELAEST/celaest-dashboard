"use client";

import React, { useState, useRef } from "react";
import {
  Crown,
  User,
  SquaresFour,
  ClockCounterClockwise as HistoryIcon,
  Tag,
  Plus,
} from "@phosphor-icons/react";
import { useAuth as _useAuth } from "@/features/auth/contexts/AuthContext";

import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { PageBanner } from "@/components/layout/PageLayout";
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
import { assetsService } from "@/features/assets/services/assets.service";
import { QUERY_KEYS } from "@/features/shared/constants/queryKeys";

export const ReleaseManager: React.FC = () => {
  const { theme } = useTheme();
  const { token, orgId } = useApiAuth();
  const isDark = theme === "dark";

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
    enabled: viewMode === "admin" && activeTab === "overview",
  });


  // Mock Asset for Deploy Panel
  const deployAsset = {
    title: "New Release Build",
    version: "2.1.0",
    price: "$0.00",
  };

  return (
    <div className="h-full flex flex-col min-h-0 relative">
      <PageBanner
        title={viewMode === "admin" ? "Release Management" : "Update Center"}
        subtitle={viewMode === "admin" ? "Governance & Pipeline Control" : "Check for updates and view changelogs."}
        actions={
          <div className="flex items-center gap-3">
            {/* Admin Tabs */}
            {viewMode === "admin" && (
              <div
                className={`flex items-center p-0.5 rounded-lg ${
                  isDark ? "bg-white/5 border border-white/5" : "bg-gray-100 border border-gray-200"
                }`}
              >
                <button
                  onClick={() => setActiveTab("history")}
                  className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 transition-all ${
                    activeTab === "history"
                      ? isDark ? "bg-purple-500/15 text-purple-400" : "bg-white text-purple-600 shadow-sm"
                      : isDark ? "text-gray-500 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <HistoryIcon size={12} />
                  History
                </button>
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 transition-all ${
                    activeTab === "overview"
                      ? isDark ? "bg-cyan-500/15 text-cyan-400" : "bg-white text-cyan-600 shadow-sm"
                      : isDark ? "text-gray-500 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <SquaresFour size={12} />
                  Overview
                </button>

              </div>
            )}

            {/* New Release button - only in history tab */}
            {viewMode === "admin" && activeTab === "history" && (
              <button
                onClick={() => createReleaseRef.current?.()}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${
                  isDark
                    ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/25"
                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                }`}
              >
                <Plus size={12} weight="bold" />
                New Release
              </button>
            )}

            {/* Version tags */}
            {viewMode === "admin" && headerTags.length > 0 && (
              <div className="flex items-center gap-2">
                {headerTags.map((t) => (
                  <span
                    key={t.version}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${
                      t.status === "stable"
                        ? isDark ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : t.status === "beta"
                          ? isDark ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" : "bg-yellow-50 text-yellow-700 border-yellow-200"
                          : isDark ? "bg-gray-500/10 text-gray-400 border-gray-500/20" : "bg-gray-100 text-gray-500 border-gray-200"
                    }`}
                  >
                    <Tag size={10} />
                    {t.version}
                  </span>
                ))}
              </div>
            )}

            {/* View Mode Toggle */}
            <div
              className={`inline-flex p-0.5 rounded-lg border ${
                isDark ? "bg-black/40 border-white/10" : "bg-white border-gray-200"
              }`}
            >
              <button
                onClick={() => setViewMode("customer")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${
                  viewMode === "customer"
                    ? isDark ? "bg-cyan-500/15 text-cyan-400" : "bg-blue-600 text-white shadow-sm"
                    : isDark ? "text-gray-500 hover:text-gray-300" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <User size={12} />
                Customer
              </button>
              <button
                onClick={() => setViewMode("admin")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${
                  viewMode === "admin"
                    ? isDark ? "bg-purple-500/15 text-purple-400" : "bg-purple-600 text-white shadow-sm"
                    : isDark ? "text-gray-500 hover:text-gray-300" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Crown size={12} />
                Admin
              </button>
            </div>
          </div>
        }
      />

      {/* Main Content - Fills Rest */}
      <div className="flex-1 min-h-0 flex flex-col relative p-3">
        {viewMode === "admin" ? (
          <div className="flex-1 min-h-0 relative">
            <AnimatePresence mode="wait">
              {activeTab === "history" && (
                <motion.div
                  key="history"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="h-full flex flex-col"
                >
                  <div className="flex-1 min-h-0 overflow-hidden">
                    <VersionControl createRef={createReleaseRef} />
                  </div>
                </motion.div>
              )}

                {activeTab === "overview" && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="h-full flex flex-col gap-4 overflow-hidden"
                  >
                    {/* Metrics Row - Fixed Height */}
                    <div className="shrink-0">
                      <ReleaseMetrics
                        metrics={overviewData?.metrics}
                        isLoading={overviewLoading}
                      />
                    </div>

                    {/* Dashboard Grid */}
                    <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-4 pb-2">
                      <div className="h-full min-h-0">
                        <EnvironmentHealth
                          systemHealth={overviewData?.metrics?.system_health}
                          isLoading={overviewLoading || !overviewData}
                        />
                      </div>
                      <div className="h-full min-h-0">
                        <RecentReleaseFeed
                          activities={overviewData?.activity}
                          isLoading={overviewLoading}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
        ) : (
          <div className="flex-1 min-h-0 overflow-y-auto pr-2 pb-20 scrollbar-hide">
            <UpdateCenter enabled={viewMode === "customer"} />
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
