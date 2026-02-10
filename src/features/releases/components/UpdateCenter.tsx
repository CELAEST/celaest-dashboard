"use client";

import React from "react";
import { AlertCircle } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { useUpdateCenter } from "../hooks/useUpdateCenter";
import { UpdateSummary } from "./UpdateCenterComponents/UpdateSummary";
import { UpdateList } from "./UpdateCenterComponents/UpdateList";

export const UpdateCenter: React.FC<{ enabled?: boolean }> = ({
  enabled = true,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const {
    assets,
    expandedAsset,
    toggleExpanded,
    updateCount,
    isLoading,
    error,
  } = useUpdateCenter({ enabled });

  return (
    <div className="space-y-6">
      <UpdateSummary updateCount={updateCount} />

      {error && (
        <div
          className={`rounded-2xl border p-4 ${
            isDark
              ? "bg-red-500/10 border-red-500/20 text-red-400"
              : "bg-red-50 border-red-200 text-red-600"
          }`}
        >
          <div className="flex gap-3 items-center">
            <AlertCircle size={16} className="shrink-0" />
            <p className="text-xs font-medium">{error}</p>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="relative">
            <div className="h-12 w-12 rounded-full border-2 border-cyan-500/20" />
            <div className="absolute top-0 h-12 w-12 rounded-full border-t-2 border-cyan-500 animate-spin" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-500/60 animate-pulse">
            Checking for updates...
          </p>
        </div>
      ) : assets.length === 0 ? (
        <div
          className={`rounded-2xl border border-dashed p-10 text-center ${
            isDark ? "border-white/10" : "border-gray-200"
          }`}
        >
          <p
            className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
          >
            No assets found in your account.
          </p>
        </div>
      ) : (
        <UpdateList
          assets={assets}
          expandedAsset={expandedAsset}
          toggleExpanded={toggleExpanded}
        />
      )}

      {/* Info Banner */}
      <div
        className={`rounded-2xl border p-5 ${
          isDark
            ? "bg-blue-500/5 border-blue-500/20"
            : "bg-blue-50 border-blue-200"
        }`}
      >
        <div className="flex gap-3">
          <AlertCircle
            size={20}
            className={`shrink-0 mt-0.5 ${
              isDark ? "text-blue-400" : "text-blue-600"
            }`}
          />
          <div>
            <p
              className={`text-sm font-semibold mb-1 ${
                isDark ? "text-blue-400" : "text-blue-700"
              }`}
            >
              Version Access Policy
            </p>
            <p
              className={`text-xs ${
                isDark ? "text-blue-400/80" : "text-blue-600/80"
              }`}
            >
              You can download any version released after your purchase date.
              Active subscription holders have access to all historical
              versions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
