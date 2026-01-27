import React, { memo } from "react";
import { motion } from "motion/react";
import {
  Calendar,
  Download,
  Shield,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { Version, ReleaseStatus } from "../../types";
import { VersionActions } from "./VersionActions";

interface VersionTableRowProps {
  version: Version;
  index: number;
  isActive: boolean;
  onToggle: (id: string) => void;
  onEdit: (version: Version) => void;
  onViewDetails: (version: Version) => void;
  onDeprecate: (id: string) => void;
}

export const VersionTableRow: React.FC<VersionTableRowProps> = memo(
  ({
    version,
    index,
    isActive,
    onToggle,
    onEdit,
    onViewDetails,
    onDeprecate,
  }) => {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const getStatusColor = (status: ReleaseStatus) => {
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

    const getStatusIcon = (status: ReleaseStatus) => {
      switch (status) {
        case "stable":
          return <CheckCircle2 size={14} />;
        case "beta":
          return <AlertTriangle size={14} />;
        case "deprecated":
          return <XCircle size={14} />;
      }
    };

    return (
      <motion.tr
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
              {new Date(version.releaseDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <Shield
              size={14}
              className={isDark ? "text-emerald-500" : "text-emerald-600"}
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
          <VersionActions
            version={version}
            isActive={isActive}
            onToggle={() => onToggle(version.id)}
            onEdit={onEdit}
            onViewDetails={onViewDetails}
            onDeprecate={onDeprecate}
          />
        </td>
      </motion.tr>
    );
  },
);

VersionTableRow.displayName = "VersionTableRow";
