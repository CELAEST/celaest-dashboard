"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Edit2,
  Trash2,
  Copy,
  MoreVertical,
  Eye,
  Image as ImageIcon,
} from "lucide-react";
import { Asset } from "../hooks/useAssets";
import { AssetTypeIcon } from "./shared/AssetTypeIcon";
import { AssetStatusBadge } from "./shared/AssetStatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AssetTableProps {
  assets: Asset[];
  isDark: boolean;
  activeMenu: string | null;
  setActiveMenu: (id: string | null) => void;
  onEdit: (asset: Asset) => void;
  onDuplicate: (asset: Asset) => void;
  onDelete: (id: string) => void;
  onPreview?: (asset: Asset) => void;
}

export const AssetTable: React.FC<AssetTableProps> = ({
  assets,
  isDark,
  activeMenu,
  setActiveMenu,
  onEdit,
  onDuplicate,
  onDelete,
  onPreview,
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow
          className={`sticky top-0 z-10 border-b backdrop-blur-md ${isDark ? "bg-[#0a0a0a]/90 border-white/5 hover:bg-[#0a0a0a]/90" : "bg-gray-50/90 border-gray-200 hover:bg-gray-50/90"}`}
        >
          <TableHead
            className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${isDark ? "text-gray-500" : "text-gray-600"}`}
          >
            Asset
          </TableHead>
          <TableHead
            className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${isDark ? "text-gray-500" : "text-gray-600"}`}
          >
            Type
          </TableHead>
          <TableHead
            className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${isDark ? "text-gray-500" : "text-gray-600"}`}
          >
            Price
          </TableHead>
          <TableHead
            className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${isDark ? "text-gray-500" : "text-gray-600"}`}
          >
            Net Margin
          </TableHead>
          <TableHead
            className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${isDark ? "text-gray-500" : "text-gray-600"}`}
          >
            Status
          </TableHead>
          <TableHead
            className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${isDark ? "text-gray-500" : "text-gray-600"}`}
          >
            Version
          </TableHead>
          <TableHead
            className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${isDark ? "text-gray-500" : "text-gray-600"}`}
          >
            Downloads
          </TableHead>
          <TableHead
            className={`px-6 py-4 text-right text-xs font-bold uppercase tracking-wider ${isDark ? "text-gray-500" : "text-gray-600"}`}
          >
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody
        className={`divide-y ${isDark ? "divide-white/5" : "divide-gray-200"}`}
      >
        {assets.map((asset, index) => {
          const netMargin = asset.price - asset.operationalCost;
          const marginPercentage = ((netMargin / asset.price) * 100).toFixed(1);

          return (
            <TableRow
              key={asset.id}
              className={`transition-colors border-0 ${isDark ? "hover:bg-white/2 data-[state=selected]:bg-white/2" : "hover:bg-gray-50 data-[state=selected]:bg-gray-50"}`}
            >
              {/* Asset Name Column */}
              <TableCell className="px-6 py-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-4"
                >
                  <div
                    className={`shrink-0 w-10 h-10 rounded-lg overflow-hidden border transition-transform hover:scale-110 ${
                      isDark
                        ? "bg-white/5 border-white/10"
                        : "bg-gray-100 border-gray-200"
                    }`}
                  >
                    {asset.thumbnail ? (
                      <img
                        src={asset.thumbnail}
                        className="w-full h-full object-cover"
                        alt={asset.name}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500/50">
                        <ImageIcon size={16} />
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
                </motion.div>
              </TableCell>

              {/* Type Column */}
              <TableCell className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <AssetTypeIcon type={asset.type} size={18} />
                  <span
                    className={`text-sm capitalize ${isDark ? "text-gray-300" : "text-gray-700"}`}
                  >
                    {asset.type.replace("-", " ")}
                  </span>
                </div>
              </TableCell>

              {/* Price Column */}
              <TableCell className="px-6 py-4">
                <span
                  className={`text-sm font-bold tabular-nums ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  ${asset.price.toFixed(2)}
                </span>
              </TableCell>

              {/* Net Margin Column */}
              <TableCell className="px-6 py-4">
                <div>
                  <div
                    className={`text-sm font-bold tabular-nums ${isDark ? "text-emerald-400" : "text-emerald-600"}`}
                  >
                    ${netMargin.toFixed(2)}
                  </div>
                  <div
                    className={`text-xs ${isDark ? "text-gray-500" : "text-gray-600"}`}
                  >
                    {marginPercentage}% margin
                  </div>
                </div>
              </TableCell>

              {/* Status Column */}
              <TableCell className="px-6 py-4">
                <AssetStatusBadge status={asset.status} isDark={isDark} />
              </TableCell>

              {/* Version Column */}
              <TableCell className="px-6 py-4">
                <span
                  className={`text-sm font-mono ${isDark ? "text-gray-400" : "text-gray-600"}`}
                >
                  v{asset.version}
                </span>
              </TableCell>

              {/* Downloads Column */}
              <TableCell className="px-6 py-4">
                <span
                  className={`text-sm font-semibold tabular-nums ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  {asset.downloads.toLocaleString()}
                </span>
              </TableCell>

              {/* Actions Column */}
              <TableCell className="px-6 py-4 text-right">
                <div className="relative inline-block">
                  <button
                    onClick={() =>
                      setActiveMenu(activeMenu === asset.id ? null : asset.id)
                    }
                    className={`p-2 rounded-lg transition-colors ${isDark ? "hover:bg-white/10 text-gray-400 hover:text-white" : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"}`}
                  >
                    <MoreVertical size={18} />
                  </button>

                  <AnimatePresence>
                    {activeMenu === asset.id && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`absolute right-0 top-12 w-52 rounded-xl border shadow-xl z-20 overflow-hidden ${isDark ? "bg-gray-900 border-white/10" : "bg-white border-gray-200"}`}
                      >
                        <button
                          onClick={() => {
                            onEdit(asset);
                            setActiveMenu(null);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${isDark ? "text-gray-300 hover:bg-white/5" : "text-gray-700 hover:bg-gray-50"}`}
                        >
                          <Edit2 size={16} /> Edit Asset
                        </button>
                        <button
                          onClick={() => {
                            onDuplicate(asset);
                            setActiveMenu(null);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${isDark ? "text-gray-300 hover:bg-white/5" : "text-gray-700 hover:bg-gray-50"}`}
                        >
                          <Copy size={16} /> Duplicate
                        </button>
                        <button
                          onClick={() => {
                            onPreview?.(asset);
                            setActiveMenu(null);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${isDark ? "text-gray-300 hover:bg-white/5" : "text-gray-700 hover:bg-gray-50"}`}
                        >
                          <Eye size={16} /> Preview
                        </button>
                        <button
                          onClick={() => {
                            onDelete(asset.id);
                            setActiveMenu(null);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors border-t ${isDark ? "text-red-400 hover:bg-red-500/10 border-white/5" : "text-red-600 hover:bg-red-50 border-gray-200"}`}
                        >
                          <Trash2 size={16} /> Archive
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
