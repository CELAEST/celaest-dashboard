import React, { memo } from "react";
import { CustomerAsset } from "../../types";
import { UpdateItem } from "./UpdateItem";
import { useTheme } from "@/features/shared/hooks/useTheme";

interface UpdateListProps {
  assets: CustomerAsset[];
  expandedAsset: string | null;
  toggleExpanded: (id: string) => void;
  onDownload: (assetId: string) => void;
  onSkip: (assetId: string, version: string) => void;
}

export const UpdateList: React.FC<UpdateListProps> = memo(
  ({ assets, expandedAsset, toggleExpanded, onDownload, onSkip }) => {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
      <div
        className={`rounded-xl sm:rounded-2xl border backdrop-blur-2xl p-3.5 sm:p-6 transition-colors ${
          isDark
            ? "bg-[#080c14]/80 border-white/8"
            : "bg-white border-gray-200/90 shadow-xs"
        }`}
      >
        <div
          className={`flex items-start sm:items-center justify-between gap-2.5 pb-3 sm:pb-4 border-b mb-4 sm:mb-6 ${
            isDark ? "border-white/8" : "border-gray-200/70"
          }`}
        >
          <div className="min-w-0">
            <h3
              className={`text-xs sm:text-base font-bold tracking-tight truncate ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Línea Temporal de Entregas & Pipeline
            </h3>
            <p
              className={`text-[10px] sm:text-xs font-mono truncate ${
                isDark ? "text-white/40" : "text-gray-500"
              }`}
            >
              Trazabilidad criptográfica de compilaciones y ramas de software
            </p>
          </div>
          <span
            className={`text-[9px] sm:text-[10px] font-mono uppercase px-2 py-0.5 sm:py-1 rounded-md border shrink-0 ${
              isDark
                ? "border-white/10 bg-white/[0.03] text-white/60"
                : "border-gray-200 bg-gray-100 text-gray-700"
            }`}
          >
            Chrono Stream
          </span>
        </div>

        <div
          className={`relative pl-4.5 sm:pl-8 space-y-4 sm:space-y-6 before:absolute before:left-1.5 sm:before:left-3 before:top-2 before:bottom-2 before:w-px ${
            isDark ? "before:bg-white/10" : "before:bg-gray-200"
          }`}
        >
          {assets.map((asset, index) => (
            <UpdateItem
              key={asset.id}
              asset={asset}
              expandedAsset={expandedAsset}
              toggleExpanded={toggleExpanded}
              onDownload={onDownload}
              onSkip={onSkip}
              index={index}
            />
          ))}
        </div>
      </div>
    );
  },
);

UpdateList.displayName = "UpdateList";

