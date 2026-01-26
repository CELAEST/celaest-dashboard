"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus,
  MoreVertical,
  Edit2,
  Archive,
  FileText,
  Calendar,
  Download,
  Shield,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { VersionEditor } from "./VersionEditor";
import { VersionDetailsModal } from "./modals/VersionDetailsModal";

export interface Version {
  id: string;
  assetName: string;
  versionNumber: string;
  status: "stable" | "beta" | "deprecated";
  releaseDate: string;
  fileSize: string;
  checksum: string;
  downloads: number;
  adoptionRate: number;
  changelog: string[];
  compatibility: string;
}

export const VersionControl: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingVersion, setEditingVersion] = useState<Version | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [viewingVersion, setViewingVersion] = useState<Version | null>(null);

  const [versions, setVersions] = useState<Version[]>([
    {
      id: "1",
      assetName: "Advanced Financial Dashboard",
      versionNumber: "v2.1.0",
      status: "stable",
      releaseDate: "2026-01-10",
      fileSize: "4.2 MB",
      checksum: "sha256:a3f5c9d2e1b4...",
      downloads: 287,
      adoptionRate: 84.2,
      changelog: [
        "Added multi-currency support",
        "Improved chart rendering performance",
        "Fixed date formatting bug",
      ],
      compatibility: "Excel 2016+",
    },
    {
      id: "2",
      assetName: "Advanced Financial Dashboard",
      versionNumber: "v2.0.5",
      status: "deprecated",
      releaseDate: "2025-11-15",
      fileSize: "3.8 MB",
      checksum: "sha256:b7e2f3a8c5d1...",
      downloads: 156,
      adoptionRate: 12.8,
      changelog: [
        "Security patch for macro validation",
        "Minor UI improvements",
      ],
      compatibility: "Excel 2016+",
    },
    {
      id: "3",
      assetName: "Python Data Scraper Script",
      versionNumber: "v1.5.2",
      status: "stable",
      releaseDate: "2025-12-05",
      fileSize: "125 KB",
      checksum: "sha256:c9d4e6f2a8b3...",
      downloads: 445,
      adoptionRate: 92.1,
      changelog: [
        "Added proxy rotation feature",
        "Improved error handling",
        "Added CSV export option",
      ],
      compatibility: "Python 3.8+",
    },
    {
      id: "4",
      assetName: "Inventory Management Template",
      versionNumber: "v3.0.0",
      status: "beta",
      releaseDate: "2026-01-18",
      fileSize: "Cloud",
      checksum: "sha256:d5e7f8a9b1c2...",
      downloads: 34,
      adoptionRate: 15.3,
      changelog: [
        "Major redesign with new UI",
        "Real-time sync improvements",
        "Mobile app integration (beta)",
      ],
      compatibility: "Google Sheets",
    },
  ]);

  const getStatusColor = (status: Version["status"]) => {
    switch (status) {
      case "stable":
        return isDark
          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
          : "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "beta":
        return isDark
          ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
          : "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "deprecated":
        return isDark
          ? "bg-gray-500/10 text-gray-400 border-gray-500/20"
          : "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const getStatusIcon = (status: Version["status"]) => {
    switch (status) {
      case "stable":
        return <CheckCircle2 size={14} />;
      case "beta":
        return <AlertTriangle size={14} />;
      case "deprecated":
        return <XCircle size={14} />;
    }
  };

  const handleCreate = () => {
    setEditingVersion(null);
    setIsEditorOpen(true);
  };

  const handleEdit = (version: Version) => {
    setEditingVersion(version);
    setIsEditorOpen(true);
    setActiveMenu(null);
  };

  const handleDeprecate = (id: string) => {
    setVersions(
      versions.map((v) =>
        v.id === id ? { ...v, status: "deprecated" as const } : v,
      ),
    );
    setActiveMenu(null);
  };

  const handleSaveVersion = (versionData: Partial<Version>) => {
    if (editingVersion) {
      setVersions(
        versions.map((v) =>
          v.id === editingVersion.id ? { ...v, ...versionData } : v,
        ),
      );
    } else {
      const newVersion: Version = {
        id: Date.now().toString(),
        assetName: versionData.assetName || "New Asset",
        versionNumber: versionData.versionNumber || "v1.0.0",
        status: versionData.status || "beta",
        releaseDate: new Date().toISOString().split("T")[0],
        fileSize: versionData.fileSize || "0 KB",
        checksum: versionData.checksum || "sha256:generating...",
        downloads: 0,
        adoptionRate: 0,
        changelog: versionData.changelog || [],
        compatibility: versionData.compatibility || "",
      };
      setVersions([newVersion, ...versions]);
    }
    setIsEditorOpen(false);
  };

  return (
    <>
      <div
        className={`rounded-2xl border overflow-hidden ${
          isDark
            ? "bg-linear-to-br from-[#0a0a0a]/80 to-gray-900/50 border-white/10"
            : "bg-white border-gray-200 shadow-sm"
        }`}
      >
        {/* Header */}
        <div
          className={`p-6 border-b ${
            isDark ? "border-white/5" : "border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3
                className={`text-lg font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Version History
              </h3>
              <p
                className={`text-xs mt-1 ${
                  isDark ? "text-gray-500" : "text-gray-600"
                }`}
              >
                Complete release timeline with checksums and adoption tracking
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreate}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all ${
                isDark
                  ? "bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/20"
                  : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
              }`}
            >
              <Plus size={18} />
              New Release
            </motion.button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr
                className={`border-b ${
                  isDark
                    ? "bg-white/2 border-white/5"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <th
                  className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${
                    isDark ? "text-gray-500" : "text-gray-600"
                  }`}
                >
                  Asset & Version
                </th>
                <th
                  className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${
                    isDark ? "text-gray-500" : "text-gray-600"
                  }`}
                >
                  Status
                </th>
                <th
                  className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${
                    isDark ? "text-gray-500" : "text-gray-600"
                  }`}
                >
                  Release Date
                </th>
                <th
                  className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${
                    isDark ? "text-gray-500" : "text-gray-600"
                  }`}
                >
                  Checksum
                </th>
                <th
                  className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${
                    isDark ? "text-gray-500" : "text-gray-600"
                  }`}
                >
                  Downloads
                </th>
                <th
                  className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${
                    isDark ? "text-gray-500" : "text-gray-600"
                  }`}
                >
                  Adoption
                </th>
                <th
                  className={`px-6 py-4 text-right text-xs font-bold uppercase tracking-wider ${
                    isDark ? "text-gray-500" : "text-gray-600"
                  }`}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody
              className={`divide-y ${
                isDark ? "divide-white/5" : "divide-gray-200"
              }`}
            >
              {versions.map((version, index) => (
                <motion.tr
                  key={version.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`transition-colors ${
                    isDark ? "hover:bg-white/2" : "hover:bg-gray-50"
                  }`}
                >
                  <td className="px-6 py-4">
                    <div>
                      <div
                        className={`text-sm font-semibold mb-1 ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {version.assetName}
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-mono px-2 py-0.5 rounded ${
                            isDark
                              ? "bg-white/10 text-cyan-400"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {version.versionNumber}
                        </span>
                        <span
                          className={`text-xs ${
                            isDark ? "text-gray-500" : "text-gray-600"
                          }`}
                        >
                          {version.fileSize}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border uppercase ${getStatusColor(
                        version.status,
                      )}`}
                    >
                      {getStatusIcon(version.status)}
                      {version.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Calendar
                        size={14}
                        className={isDark ? "text-gray-600" : "text-gray-400"}
                      />
                      <span
                        className={`text-sm tabular-nums ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {new Date(version.releaseDate).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Shield
                        size={14}
                        className={
                          isDark ? "text-emerald-500" : "text-emerald-600"
                        }
                      />
                      <span
                        className={`text-xs font-mono ${
                          isDark ? "text-gray-500" : "text-gray-600"
                        }`}
                      >
                        {version.checksum.substring(0, 20)}...
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Download
                        size={14}
                        className={isDark ? "text-gray-600" : "text-gray-400"}
                      />
                      <span
                        className={`text-sm font-semibold tabular-nums ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {version.downloads}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div
                        className={`text-sm font-bold tabular-nums mb-1 ${
                          version.adoptionRate > 70
                            ? isDark
                              ? "text-emerald-400"
                              : "text-emerald-600"
                            : version.adoptionRate > 40
                              ? isDark
                                ? "text-yellow-400"
                                : "text-yellow-600"
                              : isDark
                                ? "text-gray-400"
                                : "text-gray-600"
                        }`}
                      >
                        {version.adoptionRate.toFixed(1)}%
                      </div>
                      <div
                        className={`h-1.5 w-20 rounded-full overflow-hidden ${
                          isDark ? "bg-white/5" : "bg-gray-200"
                        }`}
                      >
                        <div
                          className={`h-full ${
                            version.adoptionRate > 70
                              ? "bg-linear-to-r from-emerald-500 to-emerald-400"
                              : version.adoptionRate > 40
                                ? "bg-linear-to-r from-yellow-500 to-yellow-400"
                                : "bg-linear-to-r from-gray-500 to-gray-400"
                          }`}
                          style={{ width: `${version.adoptionRate}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="relative inline-block">
                      <button
                        onClick={() =>
                          setActiveMenu(
                            activeMenu === version.id ? null : version.id,
                          )
                        }
                        className={`p-2 rounded-lg transition-colors ${
                          isDark
                            ? "hover:bg-white/10 text-gray-400 hover:text-white"
                            : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        <MoreVertical size={18} />
                      </button>

                      <AnimatePresence>
                        {activeMenu === version.id && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className={`absolute right-0 top-12 w-52 rounded-xl border shadow-xl z-20 overflow-hidden ${
                              isDark
                                ? "bg-gray-900 border-white/10"
                                : "bg-white border-gray-200"
                            }`}
                          >
                            <button
                              onClick={() => handleEdit(version)}
                              className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                                isDark
                                  ? "text-gray-300 hover:bg-white/5"
                                  : "text-gray-700 hover:bg-gray-50"
                              }`}
                            >
                              <Edit2 size={16} />
                              Edit Changelog
                            </button>
                            <button
                              onClick={() => {
                                setViewingVersion(version);
                                setDetailsModalOpen(true);
                                setActiveMenu(null);
                              }}
                              className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                                isDark
                                  ? "text-gray-300 hover:bg-white/5"
                                  : "text-gray-700 hover:bg-gray-50"
                              }`}
                            >
                              <FileText size={16} />
                              View Details
                            </button>
                            {version.status !== "deprecated" && (
                              <button
                                onClick={() => handleDeprecate(version.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors border-t ${
                                  isDark
                                    ? "text-orange-400 hover:bg-orange-500/10 border-white/5"
                                    : "text-orange-600 hover:bg-orange-50 border-gray-200"
                                }`}
                              >
                                <Archive size={16} />
                                Mark Deprecated
                              </button>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div
          className={`p-4 border-t flex items-center justify-between ${
            isDark ? "bg-white/2 border-white/5" : "bg-gray-50 border-gray-200"
          }`}
        >
          <p
            className={`text-xs ${isDark ? "text-gray-500" : "text-gray-600"}`}
          >
            Showing {versions.length} versions
          </p>
        </div>
      </div>

      {/* Version Editor Modal */}
      <VersionEditor
        key={editingVersion ? editingVersion.id : "new-release"}
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveVersion}
        version={editingVersion}
      />

      <VersionDetailsModal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        version={viewingVersion}
      />
    </>
  );
};
