import React, { memo } from "react";
import { motion } from "motion/react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className={`rounded-2xl border overflow-hidden ${
          isDark
            ? "bg-linear-to-br from-[#0a0a0a]/80 to-gray-900/50 border-white/10"
            : "bg-white border-gray-200 shadow-sm"
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
