"use client";

import React, { useState } from "react";
import {
  Crown,
  User,
  LayoutDashboard,
  History as HistoryIcon,
  Rocket,
  Plus,
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
  >("history");
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
            className={`text-2xl font-black italic tracking-tighter uppercase ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {viewMode === "admin" ? "Release Management" : "Update Center"}
          </h1>
          <p
            className={`text-[10px] font-black uppercase tracking-[0.2em] ${
              isDark ? "text-gray-500" : "text-gray-400"
            }`}
          >
            {viewMode === "admin"
              ? "Governance & Pipeline Control"
              : "Check for updates and view changelogs."}
          </p>
        </div>

        {/* View Mode & Actions */}
        <div className="flex items-center gap-3">
          {viewMode === "admin" && (
            <button
              onClick={() => setIsDeployOpen(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                isDark
                  ? "bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_20px_rgba(34,211,238,0.3)]"
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
                ? "bg-black/40 border-white/10 shadow-inner"
                : "bg-gray-100 border-gray-200"
            }`}
          >
            <button
              onClick={() => setViewMode("admin")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                viewMode === "admin"
                  ? isDark
                    ? "bg-purple-500/20 text-purple-400 shadow-sm"
                    : "bg-white text-purple-600 shadow-sm"
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
                    : "bg-white text-blue-600 shadow-sm"
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
            {/* Premium Navigation Hub */}
            <div className="shrink-0 mb-4 flex">
              <div
                className={`relative flex p-1 rounded-2xl border backdrop-blur-3xl shadow-2xl ${
                  isDark
                    ? "bg-[#0a0a0a]/60 border-white/5"
                    : "bg-gray-100/80 border-gray-200"
                }`}
              >
                {(
                  [
                    {
                      id: "history",
                      label: "History",
                      icon: HistoryIcon,
                      color: "purple",
                    },
                    {
                      id: "overview",
                      label: "Overview",
                      icon: LayoutDashboard,
                      color: "cyan",
                    },
                    {
                      id: "pipeline",
                      label: "Pipeline",
                      icon: Rocket,
                      color: "amber",
                    },
                  ] as const
                ).map((tab, idx) => {
                  const isActive = activeTab === tab.id;
                  const Icon = tab.icon;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 transition-all duration-500 z-10 ${
                        isActive
                          ? isDark
                            ? "text-white"
                            : "text-gray-900"
                          : isDark
                            ? "text-gray-500 hover:text-gray-300"
                            : "text-gray-400 hover:text-gray-700"
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeRxTab"
                          className={`absolute inset-0 rounded-xl shadow-lg ${
                            isDark
                              ? "bg-white/5 border border-white/10"
                              : "bg-white shadow-sm border border-gray-200"
                          }`}
                          transition={{
                            type: "spring",
                            bounce: 0.2,
                            duration: 0.6,
                          }}
                        >
                          <div
                            className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[2px] rounded-full ${
                              tab.color === "cyan"
                                ? "bg-cyan-500 shadow-[0_0_10px_#22d3ee]"
                                : tab.color === "purple"
                                  ? "bg-purple-500 shadow-[0_0_10px_#a855f7]"
                                  : "bg-amber-500 shadow-[0_0_10px_#f59e0b]"
                            }`}
                          />
                        </motion.div>
                      )}

                      <span className="opacity-30 font-mono">0{idx + 1}</span>
                      <Icon
                        size={14}
                        className={
                          isActive
                            ? tab.color === "cyan"
                              ? "text-cyan-400"
                              : tab.color === "purple"
                                ? "text-purple-400"
                                : "text-amber-400"
                            : ""
                        }
                      />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Admin Views - Scrollable Content vs Fixed Layout */}
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
                    <div className="flex-1 min-h-0 overflow-hidden rounded-[2.5rem] border backdrop-blur-3xl shadow-2xl bg-black/20 border-white/5">
                      <VersionControl />
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
                      <ReleaseMetrics />
                    </div>

                    {/* Dashboard Grid - Fills Remaining Height */}
                    <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-4 pb-2">
                      <div className="lg:col-span-8 h-full flex flex-col space-y-4 min-h-0">
                        <div
                          className={`flex-1 rounded-[2.5rem] border p-1 flex flex-col overflow-hidden relative group backdrop-blur-3xl shadow-2xl ${isDark ? "bg-[#0a0a0a]/60 border-white/5" : "bg-white border-gray-200"}`}
                        >
                          <div className="shrink-0 p-8 pb-2 flex justify-between items-center">
                            <h3
                              className={`text-2xl font-black italic tracking-tighter uppercase ${isDark ? "text-white" : "text-gray-900"}`}
                            >
                              Deployment Pipeline
                            </h3>
                            <div className="flex items-center gap-2">
                              <span className="flex h-2 w-2 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_8px_#22d3ee]" />
                              <span className="text-[10px] font-black uppercase tracking-widest text-cyan-500">
                                Live Integrations
                              </span>
                            </div>
                          </div>
                          <div className="flex-1 overflow-x-auto overflow-y-hidden px-8 pb-4">
                            <div className="h-full min-w-[600px] flex flex-col justify-center">
                              <DeploymentPipeline />
                            </div>
                          </div>
                        </div>
                      </div>

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
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="h-full overflow-hidden flex flex-col gap-4"
                  >
                    <div className="shrink-0 h-[220px] rounded-[2.5rem] border p-8 flex flex-col justify-center relative backdrop-blur-3xl shadow-2xl bg-[#0a0a0a]/60 border-white/5">
                      <DeploymentPipeline />
                    </div>

                    <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-4 pb-2">
                      <div className="lg:col-span-8 h-full min-h-0">
                        <PipelineConsole />
                      </div>

                      <div
                        className={`lg:col-span-4 h-full min-h-0 rounded-[2.5rem] border flex flex-col overflow-hidden backdrop-blur-3xl shadow-2xl ${isDark ? "bg-[#0a0a0a]/60 border-white/5" : "bg-white border-gray-200"}`}
                      >
                        <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                          {/* Build Metadata content remains the same with updated styling */}
                          <div>
                            <h3
                              className={`text-[10px] font-black uppercase tracking-[0.4em] mb-4 ${isDark ? "text-white/40" : "text-gray-400"}`}
                            >
                              Build Metadata
                            </h3>
                            <div className="space-y-3 text-sm">
                              <div className="flex justify-between">
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                                  Triggered by
                                </span>
                                <span
                                  className={`font-black italic tracking-tighter ${isDark ? "text-white" : "text-gray-700"}`}
                                >
                                  Webhook (GitHub)
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                                  Branch
                                </span>
                                <span
                                  className={`font-mono text-xs ${isDark ? "text-purple-400" : "text-purple-600"}`}
                                >
                                  main
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                                  Commit
                                </span>
                                <span
                                  className={`font-mono text-xs ${isDark ? "text-gray-300" : "text-gray-700"}`}
                                >
                                  fe45a12
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                                  Environment
                                </span>
                                <span className="px-3 py-1 rounded bg-blue-500/20 text-blue-400 text-[10px] font-black tracking-widest uppercase">
                                  STAGING
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="h-px bg-white/5" />

                          <div>
                            <h3
                              className={`text-[10px] font-black uppercase tracking-[0.4em] mb-4 ${isDark ? "text-white/40" : "text-gray-400"}`}
                            >
                              Artifacts
                            </h3>
                            <div className="space-y-3">
                              <div
                                className={`p-4 rounded-2xl flex items-center justify-between group cursor-pointer transition-all ${isDark ? "bg-white/5 border border-white/5 hover:bg-white/10" : "bg-gray-50 border border-gray-100 hover:bg-gray-100"}`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-500">
                                    <Rocket size={16} />
                                  </div>
                                  <div>
                                    <p
                                      className={`text-xs font-black italic tracking-tighter uppercase ${isDark ? "text-white" : "text-gray-900"}`}
                                    >
                                      Docker Image
                                    </p>
                                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">
                                      45.2 MB
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
                          className={`shrink-0 p-6 border-t ${isDark ? "border-white/5" : "border-gray-200"}`}
                        >
                          <div className="relative">
                            <AnimatePresence mode="wait">
                              {abortState === "idle" && (
                                <motion.button
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -10 }}
                                  onClick={() => setAbortState("confirm")}
                                  className="group relative w-full py-4 rounded-xl overflow-hidden font-black text-[10px] uppercase tracking-widest transition-all duration-300 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] border border-red-500/30 hover:border-red-500/60 active:scale-[0.98]"
                                >
                                  <div
                                    className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${isDark ? "bg-red-500/20" : "bg-red-50"}`}
                                  />
                                  <span className="relative z-10 flex items-center justify-center gap-2 text-red-500 group-hover:text-red-400 font-black">
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
                                  className="w-full py-4 rounded-xl font-black text-[10px] uppercase tracking-widest bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.6)] animate-pulse flex items-center justify-center gap-2 transition-transform active:scale-95"
                                >
                                  <AlertCircle size={16} />
                                  CONFIRM ABORT?
                                </motion.button>
                              )}

                              {abortState === "aborting" && (
                                <motion.button
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  className="w-full py-4 rounded-xl font-black text-[10px] uppercase tracking-widest bg-red-500/10 text-red-500 border border-red-500/20 flex items-center justify-center gap-2 cursor-wait"
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
              </AnimatePresence>
            </div>
          </>
        ) : (
          <div className="flex-1 min-h-0 overflow-y-auto pr-2 pb-20 scrollbar-hide">
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
