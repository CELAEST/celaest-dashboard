"use client";

import React, { useMemo } from "react";
import {
  DotsThreeVertical,
  Image as ImageIcon,
  Globe,
  Lock,
  ShieldCheck,
} from "@phosphor-icons/react";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import NextImage from "next/image";
import { Asset } from "../services/assets.service";
import { AssetTypeIcon } from "./shared/AssetTypeIcon";
import { AssetStatusBadge } from "./shared/AssetStatusBadge";
import { AssetActionMenu, AssetMenuState } from "./AssetActionMenu";

interface AssetTableProps {
  assets: Asset[];
  isDark: boolean;
  isLoading?: boolean;
  activeMenu: AssetMenuState | null;
  onOpenMenu: (e: React.MouseEvent, asset: Asset) => void;
  onCloseMenu: () => void;
  onEdit: (asset: Asset) => void;
  onDuplicate: (asset: Asset) => void;
  onDelete: (id: string) => void;
  onPreview?: (asset: Asset) => void;
  onManageReleases?: (asset: Asset) => void;
  onDownload?: (asset: Asset) => void;
  totalItems?: number;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onLoadMore?: () => void;
  hideFooter?: boolean;
}

export const AssetTable: React.FC<AssetTableProps> = ({
  assets,
  isDark,
  isLoading = false,
  activeMenu,
  onOpenMenu,
  onCloseMenu,
  onEdit,
  onDuplicate,
  onDelete,
  onPreview,
  onManageReleases,
  onDownload,
  totalItems,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  hideFooter = false,
}) => {
  const columns: ColumnDef<Asset>[] = useMemo(
    () => [
      {
        id: "asset",
        header: "Asset",
        cell: ({ row }) => {
          const asset = row.original;
          return (
            <div className="flex items-center gap-4 py-1">
              <div
                className={`shrink-0 w-10 h-10 rounded-lg overflow-hidden border transition-transform hover:scale-110 ${
                  isDark
                    ? "bg-white/5 border-white/10"
                    : "bg-gray-100 border-gray-200"
                }`}
              >
                {asset.thumbnail ? (
                  <NextImage
                    src={asset.thumbnail}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                    alt={asset.name}
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500/50">
                    <ImageIcon size={16} weight="duotone" />
                  </div>
                )}
              </div>
              <div>
                <div
                  className={`text-sm font-semibold mb-0.5 ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  {asset.name}
                </div>
                <div
                  className={`text-[10px] ${isDark ? "text-gray-500" : "text-gray-600"}`}
                >
                  {asset.category} • {asset.fileSize}
                </div>
              </div>
            </div>
          );
        },
      },
      {
        id: "type",
        header: "TextT",
        accessorKey: "type",
        cell: ({ row }) => {
          const asset = row.original;
          return (
            <div className="flex items-center gap-2">
              <AssetTypeIcon type={asset.type} size={18} />
              <span
                className={`text-sm capitalize ${isDark ? "text-gray-300" : "text-gray-700"}`}
              >
                {asset.type.replace("-", " ")}
              </span>
            </div>
          );
        },
      },
      {
        id: "price",
        header: "Price",
        accessorKey: "price",
        cell: ({ row }) => {
          return (
            <span
              className={`text-sm font-bold tabular-nums ${isDark ? "text-white" : "text-gray-900"}`}
            >
              ${row.original.price.toFixed(2)}
            </span>
          );
        },
      },
      {
        id: "status",
        header: "Status",
        accessorKey: "status",
        cell: ({ row }) => {
          return (
            <AssetStatusBadge status={row.original.status} isDark={isDark} />
          );
        },
      },
      {
        id: "plan",
        header: "Min Plan",
        accessorKey: "minPlanTier",
        cell: ({ row }) => {
          const tier = row.original.minPlanTier;
          const tierLabels: Record<number, string> = {
            0: "All",
            1: "Basic",
            2: "Pro",
            3: "Enterprise",
            4: "Private",
          };
          const tierColors: Record<number, string> = {
            0: isDark
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              : "bg-emerald-50 text-emerald-600 border-emerald-100",
            1: isDark
              ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
              : "bg-blue-50 text-blue-600 border-blue-100",
            2: isDark
              ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
              : "bg-purple-50 text-purple-600 border-purple-100",
            3: isDark
              ? "bg-orange-500/10 text-orange-400 border-orange-500/20"
              : "bg-orange-50 text-orange-600 border-orange-100",
            4: isDark
              ? "bg-red-500/10 text-red-400 border-red-500/20"
              : "bg-red-50 text-red-600 border-red-100",
          };

          return (
            <div
              className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${tierColors[tier] || tierColors[4]}`}
            >
              <ShieldCheck size={10} weight="duotone" />
              <span>{tierLabels[tier] || "Private"}</span>
            </div>
          );
        },
      },
      {
        id: "visibility",
        header: "Visibility",
        accessorKey: "isPublic",
        cell: ({ row }) => {
          const isPublic = row.original.isPublic;
          return (
            <div className="flex items-center gap-2 w-fit">
              {isPublic ? (
                <div
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${
                    isDark
                      ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                      : "bg-blue-50 text-blue-600 border border-blue-100"
                  }`}
                >
                  <Globe size={12} weight="duotone" />
                  <span>Public</span>
                </div>
              ) : (
                <div
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${
                    isDark
                      ? "bg-white/5 text-gray-400 border border-white/10"
                      : "bg-gray-100 text-gray-500 border border-gray-200"
                  }`}
                >
                  <Lock size={12} weight="fill" />
                  <span>Private</span>
                </div>
              )}
            </div>
          );
        },
      },
      {
        id: "version",
        header: "Version",
        accessorKey: "version",
        cell: ({ row }) => {
          return (
            <span
              className={`text-sm font-mono ${isDark ? "text-gray-400" : "text-gray-600"}`}
            >
              v{row.original.version}
            </span>
          );
        },
      },
      {
        id: "downloads",
        header: "Downloads",
        accessorKey: "downloads",
        cell: ({ row }) => {
          return (
            <span
              className={`text-sm font-semibold tabular-nums ${isDark ? "text-white" : "text-gray-900"}`}
            >
              {row.original.downloads.toLocaleString()}
            </span>
          );
        },
      },
      {
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => {
          const asset = row.original;
          return (
            <div className="text-right">
              <button
                onClick={(e) => onOpenMenu(e, asset)}
                className={`p-2 rounded-lg transition-colors ${isDark ? "hover:bg-white/10 text-gray-400 hover:text-white" : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"}`}
              >
                <DotsThreeVertical size={18} weight="bold" />
              </button>
            </div>
          );
        },
      },
    ],
    [isDark, onOpenMenu],
  );

  // Resolve active asset from menuState id
  const activeAsset = activeMenu
    ? (assets.find((a) => a.id === activeMenu.id) ?? null)
    : null;

  return (
    <div className="h-full w-full">
      <AssetActionMenu
        menuState={activeMenu}
        asset={activeAsset}
        isDark={isDark}
        onClose={onCloseMenu}
        onDownload={onDownload}
        onEdit={onEdit}
        onManageReleases={onManageReleases}
        onDuplicate={onDuplicate}
        onPreview={onPreview}
        onDelete={onDelete}
      />
      <DataTable
        columns={columns}
        data={assets}
        isLoading={isLoading}
        emptyMessage="No assets found"
        emptySubmessage="You haven't uploaded any assets yet."
        totalItems={totalItems}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={onLoadMore}
        hideFooter={hideFooter}
      />
    </div>
  );
};
