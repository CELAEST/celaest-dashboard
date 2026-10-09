"use client";

import React, { useState, useMemo } from "react";
import { Warning, Package, ShieldCheck, MagnifyingGlass, DownloadSimple, CheckCircle } from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useUpdateCenter } from "../hooks/useUpdateCenter";
import { UpdateSummary } from "./UpdateCenterComponents/UpdateSummary";
import { UpdateList } from "./UpdateCenterComponents/UpdateList";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

export const UpdateCenter: React.FC<{ enabled?: boolean }> = ({
  enabled = true,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const {
    assets,
    expandedAsset,
    toggleExpanded,
    downloadUpdate,
    skipUpdate,
    updateCount,
    isLoading,
    error,
  } = useUpdateCenter({ enabled });
  const t = useTranslations("releases");

  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "updates" | "uptodate">("all");

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      if (filter === "updates" && !asset.hasUpdate) return false;
      if (filter === "uptodate" && asset.hasUpdate) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          asset.name.toLowerCase().includes(q) ||
          asset.latestVersion.toLowerCase().includes(q) ||
          (asset.compatibility && asset.compatibility.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [assets, filter, searchQuery]);

  const handleDownloadAll = () => {
    const pendingUpdates = assets.filter((a) => a.hasUpdate);
    if (pendingUpdates.length === 0) return;
    pendingUpdates.forEach((a) => downloadUpdate(a.id));
    toast.success(
      `Descarga masiva iniciada para ${pendingUpdates.length} actualizaciones`,
    );
  };

  return (
    <div className="space-y-5">
      <UpdateSummary
        updateCount={updateCount}
        onDownloadAll={handleDownloadAll}
      />

      {error && (
        <div
          className={`rounded-xl border p-4 font-mono text-xs ${
            isDark
              ? "bg-red-500/5 border-red-500/10 text-red-400"
              : "bg-red-50 border-red-200 text-red-600"
          }`}
        >
          <div className="flex gap-2.5 items-center">
            <Warning size={15} className="shrink-0" />
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Controls Bar: Search & Status Filters */}
      {!isLoading && assets.length > 0 && (
        <div className="flex items-center justify-between gap-3 flex-wrap">
          {/* Segmented Filter Pills */}
          <div
            className={`inline-flex items-center p-0.5 rounded-lg border ${
              isDark
                ? "bg-white/[0.02] border-white/8"
                : "bg-gray-100 border-gray-200"
            }`}
          >
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`px-2.5 py-1 rounded-md text-[11px] font-mono uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                filter === "all"
                  ? isDark
                    ? "bg-white/10 text-white shadow-xs font-semibold"
                    : "bg-white text-gray-900 shadow-xs font-semibold"
                  : isDark
                    ? "text-white/40 hover:text-white/80 font-medium"
                    : "text-gray-500 hover:text-gray-900 font-medium"
              }`}
            >
              Todos ({assets.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("updates")}
              className={`px-2.5 py-1 rounded-md text-[11px] font-mono uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                filter === "updates"
                  ? isDark
                    ? "bg-white/10 text-white shadow-xs font-semibold"
                    : "bg-white text-gray-900 shadow-xs font-semibold"
                  : isDark
                    ? "text-white/40 hover:text-white/80 font-medium"
                    : "text-gray-500 hover:text-gray-900 font-medium"
              }`}
            >
              <DownloadSimple size={11} weight="bold" />
              <span>Con Actualización ({updateCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setFilter("uptodate")}
              className={`px-2.5 py-1 rounded-md text-[11px] font-mono uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                filter === "uptodate"
                  ? isDark
                    ? "bg-white/10 text-white shadow-xs font-semibold"
                    : "bg-white text-gray-900 shadow-xs font-semibold"
                  : isDark
                    ? "text-white/40 hover:text-white/80 font-medium"
                    : "text-gray-500 hover:text-gray-900 font-medium"
              }`}
            >
              <CheckCircle size={11} weight="bold" />
              <span>Al Día ({assets.length - updateCount})</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-40 sm:w-56">
            <MagnifyingGlass
              size={12}
              className={`absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${
                isDark ? "text-white/30" : "text-gray-400"
              }`}
            />
            <input
              type="text"
              placeholder="Buscar por activo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-7 pr-2.5 py-1 rounded-lg text-[11px] font-mono border outline-none transition-colors ${
                isDark
                  ? "bg-white/[0.04] border-white/8 text-white placeholder-white/30 focus:border-white/20"
                  : "bg-gray-100 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-400"
              }`}
            />
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-white/20 border-t-white" />
          <p
            className={`text-[11px] font-mono uppercase tracking-wider ${
              isDark ? "text-white/40" : "text-gray-400"
            }`}
          >
            {t("checking_updates")}
          </p>
        </div>
      ) : assets.length === 0 ? (
        <div
          className={`rounded-xl border p-12 text-center flex flex-col items-center justify-center ${
            isDark
              ? "bg-white/[0.01] border-white/6"
              : "bg-gray-50 border-gray-200"
          }`}
        >
          <Package
            size={36}
            className={`mb-3 ${isDark ? "text-white/20" : "text-gray-400"}`}
          />
          <p
            className={`text-sm font-semibold ${
              isDark ? "text-zinc-200" : "text-gray-900"
            }`}
          >
            {t("no_assets_found")}
          </p>
        </div>
      ) : (
        <UpdateList
          assets={filteredAssets}
          expandedAsset={expandedAsset}
          toggleExpanded={toggleExpanded}
          onDownload={downloadUpdate}
          onSkip={skipUpdate}
        />
      )}

      {/* Policy Info Banner */}
      <div
        className={`rounded-xl border p-4 backdrop-blur-xl ${
          isDark
            ? "bg-white/[0.02] border-white/6"
            : "bg-gray-50 border-gray-200"
        }`}
      >
        <div className="flex gap-3 items-start">
          <ShieldCheck
            size={18}
            className={`shrink-0 mt-0.5 ${
              isDark ? "text-white/50" : "text-gray-600"
            }`}
          />
          <div>
            <p
              className={`text-xs font-semibold mb-0.5 ${
                isDark ? "text-zinc-200" : "text-gray-900"
              }`}
            >
              {t("version_access_policy")}
            </p>
            <p
              className={`text-xs ${
                isDark ? "text-white/50" : "text-gray-500"
              }`}
            >
              {t("version_access_desc")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
