import React, { memo } from "react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { Version } from "../../types";
import { VersionTableRow } from "./VersionTableRow";

interface VersionTableProps {
  versions: Version[];
  isLoading?: boolean;
  activeMenu: string | null;
  onToggleMenu: (id: string) => void;
  onEdit: (version: Version) => void;
  onViewDetails: (version: Version) => void;
  onDeprecate: (id: string) => void;
}

export const VersionTable: React.FC<VersionTableProps> = memo(
  ({
    versions,
    isLoading,
    activeMenu,
    onToggleMenu,
    onEdit,
    onViewDetails,
    onDeprecate,
  }) => {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
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
              {[
                "Asset & Version",
                "Status",
                "Release Date",
                "Checksum",
                "Downloads",
                "Adoption",
                "Actions",
              ].map((header, i) => (
                <th
                  key={header}
                  className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${
                    isDark ? "text-gray-500" : "text-gray-600"
                  } ${i === 6 ? "text-right" : ""}`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody
            className={`divide-y ${
              isDark ? "divide-white/5" : "divide-gray-200"
            }`}
          >
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={7} className="px-6 py-4">
                    <div className="h-12 bg-gray-200 dark:bg-white/5 rounded-xl" />
                  </td>
                </tr>
              ))
            ) : versions.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <p className="text-gray-500 text-sm">No versions found</p>
                </td>
              </tr>
            ) : (
              versions.map((version, index) => (
                <VersionTableRow
                  key={version.id}
                  version={version}
                  index={index}
                  isActive={activeMenu === version.id}
                  onToggle={onToggleMenu}
                  onEdit={onEdit}
                  onViewDetails={onViewDetails}
                  onDeprecate={onDeprecate}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  },
);

VersionTable.displayName = "VersionTable";
