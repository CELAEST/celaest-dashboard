import React, { memo, useMemo, useState } from "react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { Version, ReleaseStatus } from "../../types";
import { ReleaseActionMenu, ReleaseMenuState } from "../ReleaseActionMenu";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import {
  CheckCircle,
  Warning,
  XCircle,
  DotsThreeVertical,
} from "@phosphor-icons/react";

interface VersionTableProps {
  versions: Version[];
  isLoading?: boolean;
  totalItems?: number;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onLoadMore?: () => void;
  onEdit: (version: Version) => void;
  onViewDetails: (version: Version) => void;
  onDeprecate: (id: string) => void;
  hideFooter?: boolean;
}

export const VersionTable: React.FC<VersionTableProps> = memo(
  ({
    versions,
    isLoading,
    totalItems,
    hasNextPage,
    isFetchingNextPage,
    onLoadMore,
    onEdit,
    onViewDetails,
    onDeprecate,
    hideFooter,
  }) => {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const [menuState, setMenuState] = useState<ReleaseMenuState | null>(null);

    const activeVersion = menuState
      ? (versions.find((v) => v.id === menuState.id) ?? null)
      : null;

    const columns: ColumnDef<Version>[] = useMemo(() => {
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
            return <CheckCircle size={14} />;
          case "beta":
            return <Warning size={14} />;
          case "deprecated":
            return <XCircle size={14} />;
        }
      };

      return [
        {
          id: "release",
          header: "Release",
          cell: ({ row }) => {
            const version = row.original;
            const barColor =
              version.status === "stable"
                ? "bg-emerald-400"
                : version.status === "beta"
                  ? "bg-yellow-400"
                  : "bg-gray-600";
            return (
              <div className="flex items-stretch gap-3 py-5 pl-4 pr-4 min-w-52">
                {/* Left status bar */}
                <div className={`w-0.75 rounded-full shrink-0 self-stretch ${barColor} opacity-70`} />
                <div className="flex flex-col justify-center gap-4">
                  {/* Row 1 — version + badge */}
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`text-base font-black tabular-nums tracking-tight leading-none ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {version.versionNumber}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wide leading-none ${getStatusColor(
                        version.status,
                      )}`}
                    >
                      {getStatusIcon(version.status)}
                      {version.status}
                    </span>
                  </div>
                  {/* Row 2 — asset name + size */}
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[12px] font-medium ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {version.assetName}
                    </span>
                    <span className={`text-[10px] ${isDark ? "text-gray-600" : "text-gray-300"}`}>
                      ·
                    </span>
                    <span
                      className={`text-[11px] font-mono ${
                        isDark ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      {version.fileSize}
                    </span>
                  </div>
                </div>
              </div>
            );
          },
        },
        {
          id: "releaseDate",
          header: "Date",
          accessorKey: "releaseDate",
          cell: ({ row }) => {
            const version = row.original;
            return (
              <div className="py-5 px-4 flex flex-col justify-center gap-2">
                <span
                  className={`text-sm tabular-nums font-medium ${
                    isDark ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  {new Date(version.releaseDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span
                  className={`text-[10px] uppercase tracking-wider ${
                    isDark ? "text-gray-700" : "text-gray-400"
                  }`}
                >
                  release date
                </span>
              </div>
            );
          },
        },
        {
          id: "checksum",
          header: "Checksum",
          accessorKey: "checksum",
          cell: ({ row }) => {
            const version = row.original;
            return (
              <div className="py-5 px-4 flex flex-col justify-center gap-2">
                <span
                  className={`text-[11px] font-mono px-2 py-0.5 rounded border w-fit ${
                    isDark
                      ? "text-emerald-400/80 bg-emerald-500/5 border-emerald-500/15"
                      : "text-emerald-700 bg-emerald-50 border-emerald-200"
                  }`}
                >
                  {version.checksum.substring(0, 12)}…
                </span>
                <span
                  className={`text-[10px] uppercase tracking-wider ${
                    isDark ? "text-gray-700" : "text-gray-400"
                  }`}
                >
                  SHA-256
                </span>
              </div>
            );
          },
        },
        {
          id: "downloads",
          header: "Downloads",
          accessorKey: "downloads",
          cell: ({ row }) => {
            const version = row.original;
            return (
              <div className="py-5 px-4 flex flex-col justify-center gap-2">
                <span
                  className={`text-base font-black tabular-nums leading-none ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {version.downloads.toLocaleString()}
                </span>
                <span
                  className={`text-[10px] uppercase tracking-wider ${
                    isDark ? "text-gray-700" : "text-gray-400"
                  }`}
                >
                  downloads
                </span>
              </div>
            );
          },
        },
        {
          id: "adoption",
          header: "Adoption",
          accessorKey: "adoptionRate",
          cell: ({ row }) => {
            const version = row.original;
            const rate = version.adoptionRate;
            const textColor =
              rate > 70
                ? isDark
                  ? "text-emerald-400"
                  : "text-emerald-600"
                : rate > 40
                  ? isDark
                    ? "text-yellow-400"
                    : "text-yellow-600"
                  : isDark
                    ? "text-gray-400"
                    : "text-gray-500";
            const barGradient =
              rate > 70
                ? "bg-linear-to-r from-emerald-500 to-emerald-400"
                : rate > 40
                  ? "bg-linear-to-r from-yellow-500 to-yellow-400"
                  : isDark
                    ? "bg-linear-to-r from-gray-600 to-gray-500"
                    : "bg-linear-to-r from-gray-400 to-gray-300";
            return (
              <div className="py-5 px-4 min-w-20 flex flex-col justify-center gap-2">
                <div
                  className={`text-base font-black tabular-nums leading-none ${textColor}`}
                >
                  {rate.toFixed(1)}%
                </div>
                <div
                  className={`h-1 w-20 rounded-full overflow-hidden ${
                    isDark ? "bg-white/5" : "bg-gray-200"
                  }`}
                >
                  <div
                    className={`h-full rounded-full transition-all ${barGradient}`}
                    style={{ width: `${rate}%` }}
                  />
                </div>
              </div>
            );
          },
        },
        {
          id: "actions",
          header: () => <div className="text-right">Actions</div>,
          cell: ({ row }) => {
            const version = row.original;
            return (
              <div className="py-5 px-4 text-right">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const rect = (
                      e.currentTarget as HTMLElement
                    ).getBoundingClientRect();
                    const menuHeight = 130;
                    const spaceBelow = window.innerHeight - rect.bottom;
                    const showAbove = spaceBelow < menuHeight;
                    setMenuState({
                      id: version.id,
                      x: rect.right - 12,
                      y: showAbove
                        ? window.innerHeight - rect.top + 8
                        : rect.bottom + 8,
                      align: showAbove ? "bottom" : "top",
                    });
                  }}
                  className={`p-2 rounded-lg transition-colors ${
                    isDark
                      ? "hover:bg-white/10 text-gray-400 hover:text-white"
                      : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <DotsThreeVertical size={18} weight="bold" />
                </button>
              </div>
            );
          },
        },
      ];
    }, [isDark, onEdit, onViewDetails, onDeprecate]);

    return (
      <div className="w-full">
        <DataTable
          columns={columns}
          data={versions}
          isLoading={isLoading || false}
          totalItems={totalItems}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          onLoadMore={onLoadMore}
          onRowClick={onViewDetails}
          emptyMessage="No versions found"
          emptySubmessage="Create your first release version."
          hideFooter={hideFooter}
          bodyCellClassName="p-0"
        />
        <ReleaseActionMenu
          menuState={menuState}
          version={activeVersion}
          onClose={() => setMenuState(null)}
          onEdit={onEdit}
          onViewDetails={onViewDetails}
          onDeprecate={onDeprecate}
        />
      </div>
    );
  },
);

VersionTable.displayName = "VersionTable";
