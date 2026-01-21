"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Download,
  FileText,
  AlertCircle,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  Shield,
  Sparkles,
} from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

interface CustomerAsset {
  id: string;
  name: string;
  currentVersion: string;
  latestVersion: string;
  hasUpdate: boolean;
  purchaseDate: string;
  lastDownload: string;
  changelog: string[];
  compatibility: string;
  checksum: string;
}

export const UpdateCenter: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [expandedAsset, setExpandedAsset] = useState<string | null>(null);

  const assets: CustomerAsset[] = [
    {
      id: "1",
      name: "Advanced Financial Dashboard",
      currentVersion: "v2.0.5",
      latestVersion: "v2.1.0",
      hasUpdate: true,
      purchaseDate: "2025-09-15",
      lastDownload: "2025-11-15",
      changelog: [
        "Added multi-currency support",
        "Improved chart rendering performance",
        "Fixed date formatting bug in reports",
      ],
      compatibility: "Excel 2016+",
      checksum: "sha256:a3f5c9d2e1b4...",
    },
    {
      id: "2",
      name: "Python Data Scraper Script",
      currentVersion: "v1.5.2",
      latestVersion: "v1.5.2",
      hasUpdate: false,
      purchaseDate: "2025-08-20",
      lastDownload: "2025-12-05",
      changelog: [
        "Added proxy rotation feature",
        "Improved error handling",
        "Added CSV export option",
      ],
      compatibility: "Python 3.8+",
      checksum: "sha256:c9d4e6f2a8b3...",
    },
    {
      id: "3",
      name: "Inventory Management Template",
      currentVersion: "v2.8.1",
      latestVersion: "v3.0.0",
      hasUpdate: true,
      purchaseDate: "2025-07-10",
      lastDownload: "2025-10-22",
      changelog: [
        "🚀 Major redesign with new UI",
        "Real-time sync improvements",
        "Mobile app integration (beta)",
        "Advanced reporting dashboard",
      ],
      compatibility: "Google Sheets",
      checksum: "sha256:d5e7f8a9b1c2...",
    },
  ];

  const toggleExpanded = (id: string) => {
    setExpandedAsset(expandedAsset === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* Update Summary Banner */}
      <div
        className={`rounded-2xl border p-6 ${
          isDark
            ? "bg-linear-to-r from-cyan-500/10 to-purple-500/10 border-cyan-500/20"
            : "bg-linear-to-r from-cyan-50 to-purple-50 border-cyan-200"
        }`}
      >
        <div className="flex items-start justify-between">
          <div>
            <h2
              className={`text-2xl font-bold mb-2 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {assets.filter((a) => a.hasUpdate).length} Update
              {assets.filter((a) => a.hasUpdate).length !== 1 ? "s" : ""}{" "}
              Available
            </h2>
            <p
              className={`text-sm ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Stay current with the latest features, security patches, and
              performance improvements
            </p>
          </div>
          <Sparkles
            size={32}
            className={isDark ? "text-cyan-400" : "text-cyan-600"}
          />
        </div>
      </div>

      {/* Assets List */}
      <div className="space-y-4">
        {assets.map((asset, index) => (
          <motion.div
            key={asset.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`rounded-2xl border overflow-hidden ${
              isDark
                ? "bg-linear-to-br from-[#0a0a0a]/80 to-gray-900/50 border-white/10"
                : "bg-white border-gray-200 shadow-sm"
            }`}
          >
            {/* Header */}
            <div
              className={`p-6 ${
                asset.hasUpdate
                  ? isDark
                    ? "bg-cyan-500/5"
                    : "bg-cyan-50/50"
                  : ""
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3
                      className={`text-lg font-bold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {asset.name}
                    </h3>
                    {asset.hasUpdate && (
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                          isDark
                            ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                            : "bg-cyan-100 text-cyan-700 border border-cyan-300"
                        }`}
                      >
                        <Download size={12} />
                        UPDATE AVAILABLE
                      </span>
                    )}
                  </div>

                  {/* Version Info */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-semibold uppercase ${
                          isDark ? "text-gray-500" : "text-gray-600"
                        }`}
                      >
                        Installed:
                      </span>
                      <span
                        className={`text-sm font-mono px-2 py-0.5 rounded ${
                          isDark
                            ? "bg-white/10 text-gray-300"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {asset.currentVersion}
                      </span>
                    </div>
                    {asset.hasUpdate && (
                      <>
                        <span
                          className={isDark ? "text-gray-600" : "text-gray-400"}
                        >
                          →
                        </span>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-semibold uppercase ${
                              isDark ? "text-gray-500" : "text-gray-600"
                            }`}
                          >
                            Latest:
                          </span>
                          <span
                            className={`text-sm font-mono px-2 py-0.5 rounded ${
                              isDark
                                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                                : "bg-cyan-100 text-cyan-700 border border-cyan-300"
                            }`}
                          >
                            {asset.latestVersion}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Status Icon */}
                <div
                  className={`p-3 rounded-xl ${
                    asset.hasUpdate
                      ? isDark
                        ? "bg-cyan-500/10"
                        : "bg-cyan-100"
                      : isDark
                      ? "bg-emerald-500/10"
                      : "bg-emerald-100"
                  }`}
                >
                  {asset.hasUpdate ? (
                    <AlertCircle
                      size={24}
                      className={isDark ? "text-cyan-400" : "text-cyan-600"}
                    />
                  ) : (
                    <CheckCircle2
                      size={24}
                      className={
                        isDark ? "text-emerald-400" : "text-emerald-600"
                      }
                    />
                  )}
                </div>
              </div>

              {/* Metadata */}
              <div className="flex items-center gap-6 text-xs">
                <div className="flex items-center gap-2">
                  <Clock
                    size={14}
                    className={isDark ? "text-gray-600" : "text-gray-400"}
                  />
                  <span className={isDark ? "text-gray-500" : "text-gray-600"}>
                    Purchased:{" "}
                    {new Date(asset.purchaseDate).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div
                  className={`px-2 py-1 rounded ${
                    isDark
                      ? "bg-white/5 text-gray-400"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {asset.compatibility}
                </div>
              </div>
            </div>

            {/* Expandable Changelog */}
            {asset.hasUpdate && (
              <div
                className={`border-t ${
                  isDark ? "border-white/5" : "border-gray-200"
                }`}
              >
                <button
                  onClick={() => toggleExpanded(asset.id)}
                  className={`w-full px-6 py-4 flex items-center justify-between transition-colors ${
                    isDark
                      ? "hover:bg-white/2 text-gray-400 hover:text-white"
                      : "hover:bg-gray-50 text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FileText size={16} />
                    <span className="text-sm font-semibold">
                      What&apos;s New in {asset.latestVersion}
                    </span>
                  </div>
                  {expandedAsset === asset.id ? (
                    <ChevronUp size={18} />
                  ) : (
                    <ChevronDown size={18} />
                  )}
                </button>

                {expandedAsset === asset.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className={`px-6 pb-6 border-t ${
                      isDark ? "border-white/5" : "border-gray-200"
                    }`}
                  >
                    <ul className="space-y-2 mb-6">
                      {asset.changelog.map((change, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div
                            className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${
                              isDark ? "bg-cyan-400" : "bg-cyan-600"
                            }`}
                          />
                          <span
                            className={`text-sm ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            {change}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* Checksum Verification */}
                    <div
                      className={`p-4 rounded-xl border mb-4 ${
                        isDark
                          ? "bg-emerald-500/5 border-emerald-500/20"
                          : "bg-emerald-50 border-emerald-200"
                      }`}
                    >
                      <div className="flex gap-3">
                        <Shield
                          size={16}
                          className={`shrink-0 mt-0.5 ${
                            isDark ? "text-emerald-400" : "text-emerald-600"
                          }`}
                        />
                        <div className="flex-1">
                          <p
                            className={`text-xs font-semibold mb-1 ${
                              isDark ? "text-emerald-400" : "text-emerald-700"
                            }`}
                          >
                            File Integrity Verification
                          </p>
                          <p
                            className={`text-xs font-mono ${
                              isDark
                                ? "text-emerald-400/80"
                                : "text-emerald-600/80"
                            }`}
                          >
                            {asset.checksum}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {/* Actions */}
            <div
              className={`p-6 border-t flex gap-3 ${
                isDark
                  ? "border-white/5 bg-white/2"
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              {asset.hasUpdate ? (
                <>
                  <button
                    className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                      isDark
                        ? "bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/20"
                        : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                    }`}
                  >
                    <Download size={18} />
                    Download Update
                  </button>
                  <button
                    className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
                      isDark
                        ? "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    Skip
                  </button>
                </>
              ) : (
                <>
                  <button
                    className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                      isDark
                        ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20"
                        : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                    }`}
                  >
                    <CheckCircle2 size={18} />
                    Up to Date
                  </button>
                  <button
                    className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
                      isDark
                        ? "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    Re-download
                  </button>
                </>
              )}
            </div>
          </motion.div>
        ))}
      </div>

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
