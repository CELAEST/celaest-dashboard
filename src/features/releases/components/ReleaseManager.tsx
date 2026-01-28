"use client";

import React, { useState } from "react";
import { Crown, User, TrendingUp } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { VersionControl } from "./VersionControl";
import { ReleaseMetrics } from "./ReleaseMetrics";
import { UpdateCenter } from "./UpdateCenter";

export const ReleaseManager: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [viewMode, setViewMode] = useState<"admin" | "customer">("admin");

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1
              className={`text-4xl font-bold mb-3 tracking-tight ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {viewMode === "admin" ? "Release Management" : "Update Center"}
            </h1>
            <p
              className={`text-sm ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {viewMode === "admin"
                ? "Version control, changelogs, and update distribution tracking"
                : "Check for updates, view changelogs, and manage your installed versions"}
            </p>
          </div>

          {/* Metrics Badge (Admin Only) */}
          {viewMode === "admin" && (
            <div
              className={`flex items-center gap-3 px-5 py-3 rounded-xl border ${
                isDark
                  ? "bg-purple-500/10 border-purple-500/20"
                  : "bg-purple-50 border-purple-200"
              }`}
            >
              <TrendingUp
                size={20}
                className={isDark ? "text-purple-400" : "text-purple-600"}
              />
              <div>
                <p
                  className={`text-xs font-semibold ${
                    isDark ? "text-purple-400" : "text-purple-700"
                  }`}
                >
                  Adoption Rate
                </p>
                <p
                  className={`text-sm font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  82.4%
                </p>
              </div>
            </div>
          )}
        </div>

        {/* View Mode Toggle */}
        <div
          className={`inline-flex p-1 rounded-xl border ${
            isDark ? "bg-black/40 border-white/10" : "bg-white border-gray-200"
          }`}
        >
          <button
            onClick={() => setViewMode("customer")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              viewMode === "customer"
                ? isDark
                  ? "bg-cyan-500/20 text-cyan-400 shadow-lg"
                  : "bg-blue-600 text-white shadow-lg"
                : isDark
                  ? "text-gray-400 hover:text-gray-300"
                  : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <User size={16} />
            Customer View
          </button>
          <button
            onClick={() => setViewMode("admin")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              viewMode === "admin"
                ? isDark
                  ? "bg-purple-500/20 text-purple-400 shadow-lg"
                  : "bg-purple-600 text-white shadow-lg"
                : isDark
                  ? "text-gray-400 hover:text-gray-300"
                  : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Crown size={16} />
            Admin Control
          </button>
        </div>
      </div>

      {/* Conditional Rendering */}
      {viewMode === "admin" ? (
        <>
          {/* Admin Metrics */}
          <div className="mb-6">
            <ReleaseMetrics />
          </div>

          {/* Version Control Table */}
          <VersionControl />
        </>
      ) : (
        /* Customer Update Center */
        <UpdateCenter />
      )}
    </div>
  );
};
