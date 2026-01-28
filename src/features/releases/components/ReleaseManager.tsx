"use client";

import React, { useState } from "react";
import {
  Crown,
  User,
  LayoutDashboard,
  History,
  Rocket,
  Plus,
  Terminal,
  Download,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { VersionControl } from "./VersionControl";
import { ReleaseMetrics } from "./ReleaseMetrics";
import { UpdateCenter } from "./UpdateCenter";
import { DeployPanel } from "./DeployPanel";
import { DeploymentPipeline } from "./DeploymentPipeline";
import { RecentReleaseFeed } from "./Overview/RecentReleaseFeed";
import { EnvironmentHealth } from "./Overview/EnvironmentHealth";
import { PipelineConsole } from "./Pipeline/PipelineConsole";
import { motion, AnimatePresence } from "motion/react";

export const ReleaseManager: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [viewMode, setViewMode] = useState<"admin" | "customer">("admin");
  const [activeTab, setActiveTab] = useState<
    "overview" | "pipeline" | "history"
  >("overview");
  const [isDeployOpen, setIsDeployOpen] = useState(false);
  const [abortState, setAbortState] = useState<"idle" | "confirm" | "aborting">(
    "idle",
  );

  // Mock Asset for Deploy Panel
  const deployAsset = {
    title: "New Release Build",
    version: "2.1.0",
    price: "$0.00",
  };

  return (
    <div className="h-full flex flex-col min-h-0 relative">
      {/* Header Area - Fixed Height */}
      <div className="shrink-0 mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1
            className={`text-3xl font-bold mb-0.5 tracking-tight ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {viewMode === "admin" ? "Release Management" : "Update Center"}
          </h1>
          <p
            className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            {viewMode === "admin"
              ? "Orchestrate deployments and manage version control."
              : "Check for updates and view changelogs."}
          </p>
        </div>

        {/* View Mode & Actions */}
        <div className="flex items-center gap-3">
          {viewMode === "admin" && (
            <button
              onClick={() => setIsDeployOpen(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold shadow-lg transition-all ${
                isDark
                  ? "bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/30"
              }`}
            >
              <Plus size={14} />
              New Deployment
            </button>
          )}

          {/* View Toggle */}
          <div
            className={`flex p-1 rounded-xl border ${
              isDark
                ? "bg-black/40 border-white/10"
                : "bg-white border-gray-200"
            }`}
          >
            <button
              onClick={() => setViewMode("admin")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                viewMode === "admin"
                  ? isDark
                    ? "bg-purple-500/20 text-purple-400 shadow-sm"
                    : "bg-purple-100 text-purple-700 shadow-sm"
                  : isDark
                    ? "text-gray-400 hover:text-gray-300"
                    : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <Crown size={12} />
              Admin
            </button>
            <button
              onClick={() => setViewMode("customer")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                viewMode === "customer"
                  ? isDark
                    ? "bg-blue-500/20 text-blue-400 shadow-sm"
                    : "bg-blue-100 text-blue-700 shadow-sm"
                  : isDark
                    ? "text-gray-400 hover:text-gray-300"
                    : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <User size={12} />
              Center
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Fills Rest */}
      <div className="flex-1 min-h-0 flex flex-col relative">
        {viewMode === "admin" ? (
          <>
            {/* Admin Tabs - Fixed Height */}
            <div className="shrink-0 mb-3 flex border-b border-gray-200 dark:border-white/10">
              {[
                { id: "overview", label: "Overview", icon: LayoutDashboard },
                { id: "pipeline", label: "Pipeline", icon: Rocket },
                { id: "history", label: "History", icon: History },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() =>
                      setActiveTab(
                        tab.id as "overview" | "pipeline" | "history",
                      )
                    }
                    className={`relative flex items-center gap-2 px-6 py-2.5 text-xs font-medium transition-colors ${
                      isActive
                        ? isDark
                          ? "text-purple-400"
                          : "text-purple-600"
                        : isDark
                          ? "text-gray-400 hover:text-gray-200"
                          : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    <Icon size={14} />
                    {tab.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeRxTab"
                        className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                          isDark ? "bg-purple-500" : "bg-purple-600"
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Admin Views - Scrollable Content vs Fixed Layout */}
            <div className="flex-1 min-h-0 relative">
              <AnimatePresence mode="wait">
                {activeTab === "overview" && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="h-full flex flex-col gap-4 overflow-hidden"
                  >
                    {/* Metrics Row - Fixed Height (approx 20%) */}
                    <div className="shrink-0">
                      <ReleaseMetrics />
                    </div>

                    {/* Dashboard Grid - Fills Remaining Height (approx 80%) */}
                    <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-4 pb-2">
                      {/* Main Pipeline - Large Area */}
                      <div className="lg:col-span-8 h-full flex flex-col space-y-4 min-h-0">
                        {/* Pipeline Visualization fills height */}
                        <div
                          className={`flex-1 rounded-2xl border p-1 flex flex-col overflow-hidden relative group ${isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"}`}
                        >
                          <div className="shrink-0 p-4 md:p-6 pb-2 flex justify-between items-center">
                            <h3
                              className={`font-bold ${isDark ? "text-white" : "text-gray-900"}`}
                            >
                              Active Deployment Pipeline
                            </h3>
                            <div className="flex items-center gap-2">
                              <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]" />
                              <span className="text-xs font-semibold text-green-500">
                                Live
                              </span>
                            </div>
                          </div>
                          <div className="flex-1 overflow-x-auto overflow-y-hidden px-4 md:px-6 pb-4">
                            <div className="h-full min-w-[600px] flex flex-col justify-center">
                              <DeploymentPipeline />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Sidebar - Stacked Cards */}
                      <div className="lg:col-span-4 h-full flex flex-col gap-4 min-h-0">
                        <div className="flex-1 min-h-0">
                          <EnvironmentHealth />
                        </div>
                        <div className="flex-[1.5] min-h-0">
                          <RecentReleaseFeed />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "pipeline" && (
                  <motion.div
                    key="pipeline"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="h-full overflow-hidden flex flex-col gap-4"
                  >
                    {/* Top: Visual Pipeline */}
                    <div className="shrink-0 h-[220px] rounded-2xl border p-4 flex flex-col justify-center relative bg-white/5 border-white/10">
                      <DeploymentPipeline />
                    </div>

                    {/* Bottom: Detailed Console & Config */}
                    <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-4 pb-2">
                      {/* Console (Terminal) */}
                      <div className="lg:col-span-8 h-full min-h-0">
                        <PipelineConsole />
                      </div>

                      {/* Side Info */}
                      <div
                        className={`lg:col-span-4 h-full min-h-0 rounded-2xl border flex flex-col overflow-hidden ${isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"}`}
                      >
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                          <div>
                            <h3
                              className={`font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}
                            >
                              Build Metadata
                            </h3>
                            <div className="space-y-3 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-500">
                                  Triggered by
                                </span>
                                <span
                                  className={`font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}
                                >
                                  Webhook (GitHub)
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Branch</span>
                                <span
                                  className={`font-mono ${isDark ? "text-purple-400" : "text-purple-600"}`}
                                >
                                  main
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Commit</span>
                                <span
                                  className={`font-mono ${isDark ? "text-gray-300" : "text-gray-700"}`}
                                >
                                  fe45a12
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">
                                  Environment
                                </span>
                                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-xs font-bold">
                                  STAGING
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="h-px bg-white/10" />

                          <div>
                            <h3
                              className={`font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}
                            >
                              Artifacts
                            </h3>
                            <div className="space-y-3">
                              <div
                                className={`p-3 rounded-lg flex items-center justify-between group cursor-pointer ${isDark ? "bg-white/5 hover:bg-white/10" : "bg-gray-50 hover:bg-gray-100"}`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="p-2 rounded bg-amber-500/20 text-amber-500">
                                    <Rocket size={16} />
                                  </div>
                                  <div>
                                    <p
                                      className={`text-sm font-bold ${isDark ? "text-white" : "text-gray-900"}`}
                                    >
                                      Docker Image
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      45.2 MB
                                    </p>
                                  </div>
                                </div>
                                <Download
                                  size={16}
                                  className="text-gray-500 group-hover:text-white"
                                />
                              </div>
                              <div
                                className={`p-3 rounded-lg flex items-center justify-between group cursor-pointer ${isDark ? "bg-white/5 hover:bg-white/10" : "bg-gray-50 hover:bg-gray-100"}`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="p-2 rounded bg-cyan-500/20 text-cyan-500">
                                    <Terminal size={16} />
                                  </div>
                                  <div>
                                    <p
                                      className={`text-sm font-bold ${isDark ? "text-white" : "text-gray-900"}`}
                                    >
                                      Build Logs
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      metrics.log
                                    </p>
                                  </div>
                                </div>
                                <Download
                                  size={16}
                                  className="text-gray-500 group-hover:text-white"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div
                          className={`shrink-0 p-4 border-t ${isDark ? "border-white/10" : "border-gray-200"}`}
                        >
                          <div className="relative">
                            <AnimatePresence mode="wait">
                              {abortState === "idle" && (
                                <motion.button
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -10 }}
                                  onClick={() => setAbortState("confirm")}
                                  className="group relative w-full py-3 rounded-xl overflow-hidden font-bold text-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] border border-red-500/30 hover:border-red-500/60 active:scale-[0.98]"
                                >
                                  <div
                                    className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${isDark ? "bg-red-500/20" : "bg-red-50"}`}
                                  />
                                  <div
                                    className={`absolute inset-0 bg-linear-to-r from-transparent via-red-500/10 to-transparent -translate-x-full group-hover:animate-shimmer`}
                                  />
                                  <span className="relative z-10 flex items-center justify-center gap-2 text-red-500 group-hover:text-red-400">
                                    <AlertCircle
                                      size={16}
                                      className="group-hover:rotate-12 transition-transform"
                                    />
                                    ABORT PIPELINE
                                  </span>
                                </motion.button>
                              )}

                              {abortState === "confirm" && (
                                <motion.button
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.9 }}
                                  onClick={() => {
                                    setAbortState("aborting");
                                    setTimeout(
                                      () => setAbortState("idle"),
                                      2000,
                                    );
                                  }}
                                  className="w-full py-3 rounded-xl font-bold text-sm bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.6)] animate-pulse flex items-center justify-center gap-2 transition-transform active:scale-95"
                                >
                                  <AlertCircle size={16} />
                                  CONFIRM ABORT?
                                </motion.button>
                              )}

                              {abortState === "aborting" && (
                                <motion.button
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  className="w-full py-3 rounded-xl font-bold text-sm bg-red-500/10 text-red-500 border border-red-500/20 flex items-center justify-center gap-2 cursor-wait"
                                  disabled
                                >
                                  <Loader2 size={16} className="animate-spin" />
                                  ABORTING...
                                </motion.button>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "history" && (
                  <motion.div
                    key="history"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="h-full flex flex-col"
                  >
                    <div className="flex-1 min-h-0 overflow-hidden rounded-2xl border border-gray-200 dark:border-white/10">
                      <VersionControl />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        ) : (
          <div className="flex-1 min-h-0 overflow-y-auto pr-2 pb-20">
            <UpdateCenter />
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
