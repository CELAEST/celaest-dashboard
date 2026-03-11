"use client";

import React, { useState, useCallback, useRef } from "react";
import { User, Crown, SquaresFour, List, FolderOpen, Timer, Plus } from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useRole } from "@/features/auth/hooks/useAuthorization";
import { PageBanner } from "@/components/layout/PageLayout";
import { AssetAdminPortal } from "./AssetAdminPortal";
import { AssetCustomerCatalog } from "./AssetCustomerCatalog";
import { useAssets } from "../hooks/useAssets";

export const AssetManager: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { isAdmin } = useRole();
  const [viewMode, setViewMode] = useState<"admin" | "customer">("admin");
  const [adminTab, setAdminTab] = useState<
    "inventory" | "categories" | "analytics"
  >("inventory");
  const [analyticsPeriod, setAnalyticsPeriod] = useState("month");

  const { activeAssets } = useAssets();

  // Clients always see customer view
  const effectiveView = isAdmin ? viewMode : "customer";

  const createFnRef = useRef<(() => void) | null>(null);
  const handleCreateRef = useCallback((fn: () => void) => {
    createFnRef.current = fn;
  }, []);

  const categoryCreateFnRef = useRef<(() => void) | null>(null);
  const handleCategoryCreateRef = useCallback((fn: () => void) => {
    categoryCreateFnRef.current = fn;
  }, []);

  return (
    <div className="h-full flex flex-col min-h-0 overflow-hidden">
      <PageBanner
        title={effectiveView === "admin" ? "Asset Manager" : "Product Catalog"}
        subtitle={effectiveView === "admin" ? "Inventory · Versioning · Metadata" : "Browse Available Products"}
        actions={
          <div className="flex items-center gap-3">
            {/* Admin Tabs (Only visible in Admin Mode) */}
            {effectiveView === "admin" && (
              <div
                className={`flex items-center p-0.5 rounded-lg ${isDark ? "bg-white/5 border border-white/5" : "bg-gray-100 border border-gray-200"}`}
              >
                <button
                  onClick={() => setAdminTab("inventory")}
                  className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 transition-all ${
                    adminTab === "inventory"
                      ? isDark
                        ? "bg-cyan-500/15 text-cyan-400"
                        : "bg-white text-blue-600 shadow-sm"
                      : isDark
                        ? "text-gray-500 hover:text-gray-300"
                        : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <List size={12} />
                  Inventory
                </button>
                <button
                  onClick={() => setAdminTab("analytics")}
                  className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 transition-all ${
                    adminTab === "analytics"
                      ? isDark
                        ? "bg-purple-500/15 text-purple-400"
                        : "bg-white text-purple-600 shadow-sm"
                      : isDark
                        ? "text-gray-500 hover:text-gray-300"
                        : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <SquaresFour size={12} />
                  Analytics
                </button>
                <button
                  onClick={() => setAdminTab("categories")}
                  className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 transition-all ${
                    adminTab === "categories"
                      ? isDark
                        ? "bg-amber-500/15 text-amber-400"
                        : "bg-white text-amber-600 shadow-sm"
                      : isDark
                        ? "text-gray-500 hover:text-gray-300"
                        : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <FolderOpen size={12} />
                  Categories
                </button>
              </div>
            )}

            {/* Define Category Button (Only in Categories Tab) */}
            {effectiveView === "admin" && adminTab === "categories" && (
              <button
                onClick={() => categoryCreateFnRef.current?.()}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${
                  isDark
                    ? "bg-amber-500/15 text-amber-400 border border-amber-500/20 hover:bg-amber-500/25"
                    : "bg-amber-600 text-white hover:bg-amber-700 shadow-sm"
                }`}
              >
                <Plus size={12} weight="bold" />
                Define Category
              </button>
            )}

            {/* Analytics Period Selector (Only in Analytics Tab) */}
            {effectiveView === "admin" && adminTab === "analytics" && (
              <div
                className={`flex items-center p-0.5 rounded-lg ${isDark ? "bg-white/5 border border-white/5" : "bg-gray-100 border border-gray-200"}`}
              >
                {[
                  { label: "7D", value: "week" },
                  { label: "30D", value: "month" },
                  { label: "90D", value: "90d" },
                ].map((item) => (
                  <button
                    key={item.value}
                    onClick={() => setAnalyticsPeriod(item.value)}
                    className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 transition-all ${
                      analyticsPeriod === item.value
                        ? isDark
                          ? "bg-cyan-500/15 text-cyan-400"
                          : "bg-white text-blue-600 shadow-sm"
                        : isDark
                          ? "text-gray-500 hover:text-gray-300"
                          : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Timer size={12} />
                    {item.label}
                  </button>
                ))}
              </div>
            )}

            {/* Create Asset Button (Only in Inventory Tab) */}
            {effectiveView === "admin" && adminTab === "inventory" && (
              <button
                onClick={() => createFnRef.current?.()}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${
                  isDark
                    ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/25"
                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                }`}
              >
                <Plus size={12} weight="bold" />
                Create Asset
              </button>
            )}

            {/* View Mode Toggle (Admin only) */}
            {isAdmin && <div
              className={`inline-flex p-0.5 rounded-lg border ${
                isDark ? "bg-black/40 border-white/10" : "bg-white border-gray-200"
              }`}
            >
              <button
                onClick={() => setViewMode("customer")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${
                  viewMode === "customer"
                    ? isDark
                      ? "bg-cyan-500/15 text-cyan-400"
                      : "bg-blue-600 text-white shadow-sm"
                    : isDark
                      ? "text-gray-500 hover:text-gray-300"
                      : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <User size={12} />
                Customer
              </button>
              <button
                onClick={() => setViewMode("admin")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${
                  viewMode === "admin"
                    ? isDark
                      ? "bg-purple-500/15 text-purple-400"
                      : "bg-purple-600 text-white shadow-sm"
                    : isDark
                      ? "text-gray-500 hover:text-gray-300"
                      : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Crown size={12} />
                Admin
              </button>
            </div>}
          </div>
        }
      />

      {/* Main Content */}
      <div className="flex-1 min-h-0 relative p-2">
        {effectiveView === "admin" ? (
          <AssetAdminPortal activeTab={adminTab} analyticsPeriod={analyticsPeriod} onCreateRef={handleCreateRef} onCategoryCreateRef={handleCategoryCreateRef} />
        ) : (
          <AssetCustomerCatalog assets={activeAssets} />
        )}
      </div>
    </div>
  );
};
