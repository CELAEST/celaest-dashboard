"use client";

import React, { useState } from "react";
import { User, Crown, LayoutGrid, List } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { AssetAdminPortal } from "./AssetAdminPortal";
import { AssetCustomerCatalog } from "./AssetCustomerCatalog";
import { useAssets } from "../hooks/useAssets";

export const AssetManager: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [viewMode, setViewMode] = useState<"admin" | "customer">("admin");
  const [adminTab, setAdminTab] = useState<"inventory" | "analytics">(
    "inventory",
  );

  const { activeAssets } = useAssets();

  return (
    <div className="h-full flex flex-col min-h-0 overflow-hidden p-2">
      {/* Unified Header Row */}
      <div className="shrink-0 mb-4 flex items-center justify-between">
        {/* Left: Tabs (Only visible in Admin Mode) */}
        <div className="flex items-center gap-4">
          {viewMode === "admin" ? (
            <div
              className={`flex items-center p-1 rounded-xl border ${isDark ? "bg-white/5 border-white/5" : "bg-gray-100 border-gray-200"}`}
            >
              <button
                onClick={() => setAdminTab("inventory")}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
                  adminTab === "inventory"
                    ? isDark
                      ? "bg-cyan-500/20 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.2)]"
                      : "bg-white text-blue-600 shadow-sm"
                    : isDark
                      ? "text-gray-500 hover:text-gray-300"
                      : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <List size={14} />
                Inventory
              </button>
              <button
                onClick={() => setAdminTab("analytics")}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
                  adminTab === "analytics"
                    ? isDark
                      ? "bg-purple-500/20 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.2)]"
                      : "bg-white text-purple-600 shadow-sm"
                    : isDark
                      ? "text-gray-500 hover:text-gray-300"
                      : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <LayoutGrid size={14} />
                Analytics
              </button>
            </div>
          ) : (
            // Placeholder title if in Customer Mode
            <h1
              className={`text-xl font-black italic tracking-tighter uppercase ${isDark ? "text-white" : "text-gray-900"}`}
            >
              Product Catalog
            </h1>
          )}
        </div>

        {/* Right: View Mode Toggle */}
        <div
          className={`inline-flex p-1 rounded-xl border ${
            isDark ? "bg-black/40 border-white/10" : "bg-white border-gray-200"
          }`}
        >
          <button
            onClick={() => setViewMode("customer")}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              viewMode === "customer"
                ? isDark
                  ? "bg-cyan-500/20 text-cyan-400 shadow-lg"
                  : "bg-blue-600 text-white shadow-lg"
                : isDark
                  ? "text-gray-500 hover:text-gray-300"
                  : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <User size={14} />
            Customer
          </button>
          <button
            onClick={() => setViewMode("admin")}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              viewMode === "admin"
                ? isDark
                  ? "bg-purple-500/20 text-purple-400 shadow-lg"
                  : "bg-purple-600 text-white shadow-lg"
                : isDark
                  ? "text-gray-500 hover:text-gray-300"
                  : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Crown size={14} />
            Admin
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-h-0 relative">
        {viewMode === "admin" ? (
          <AssetAdminPortal activeTab={adminTab} />
        ) : (
          <AssetCustomerCatalog assets={activeAssets} />
        )}
      </div>
    </div>
  );
};
