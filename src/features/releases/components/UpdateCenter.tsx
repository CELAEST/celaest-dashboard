"use client";

import React from "react";
import { AlertCircle } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { useUpdateCenter } from "../hooks/useUpdateCenter";
import { UpdateSummary } from "./UpdateCenter/UpdateSummary";
import { UpdateList } from "./UpdateCenter/UpdateList";

export const UpdateCenter: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { assets, expandedAsset, toggleExpanded, updateCount } =
    useUpdateCenter();

  return (
    <div className="space-y-6">
      <UpdateSummary updateCount={updateCount} />

      <UpdateList
        assets={assets}
        expandedAsset={expandedAsset}
        toggleExpanded={toggleExpanded}
      />

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
