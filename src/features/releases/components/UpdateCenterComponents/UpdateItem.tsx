import React, { memo } from "react";
import { motion } from "motion/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { CustomerAsset } from "../../types";
import { UpdateItemHeader } from "./partials/UpdateItemHeader";
import { UpdateItemChangelog } from "./partials/UpdateItemChangelog";
import { UpdateItemActions } from "./partials/UpdateItemActions";

interface UpdateItemProps {
  asset: CustomerAsset;
  expandedAsset: string | null;
  toggleExpanded: (id: string) => void;
  onDownload: (assetId: string) => void;
  onSkip: (assetId: string, version: string) => void;
  index: number;
}

export const UpdateItem: React.FC<UpdateItemProps> = memo(
  ({ asset, expandedAsset, toggleExpanded, onDownload, onSkip, index }) => {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.08, type: "spring", bounce: 0.15 }}
        className={`rounded-2xl border overflow-hidden transition-shadow duration-300 ${
          asset.hasUpdate
            ? isDark
              ? "bg-[#0a0a0a]/80 border-cyan-500/15 hover:border-cyan-500/25 shadow-sm hover:shadow-cyan-500/5"
              : "bg-white border-cyan-200/60 hover:border-cyan-300 shadow-sm hover:shadow-md"
            : isDark
              ? "bg-[#0a0a0a]/50 border-white/8 hover:border-white/12"
              : "bg-white border-gray-200 shadow-sm hover:shadow-md"
        }`}
      >
        <UpdateItemHeader asset={asset} />

        <UpdateItemChangelog
          asset={asset}
          isExpanded={expandedAsset === asset.id}
          onToggle={() => toggleExpanded(asset.id)}
        />

        <UpdateItemActions
          asset={asset}
          onDownload={() => onDownload(asset.id)}
          onSkip={() => onSkip(asset.id, asset.latestVersion)}
        />
      </motion.div>
    );
  },
);

UpdateItem.displayName = "UpdateItem";
