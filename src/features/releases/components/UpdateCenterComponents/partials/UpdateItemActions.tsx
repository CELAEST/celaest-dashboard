import React, { memo } from "react";
import { DownloadSimple, CheckCircle, ArrowClockwise } from "@phosphor-icons/react";
import { CustomerAsset } from "../../../types";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useTranslations } from "next-intl";

interface UpdateItemActionsProps {
  asset: CustomerAsset;
  onDownload?: () => void;
  onSkip?: () => void;
}

export const UpdateItemActions: React.FC<UpdateItemActionsProps> = memo(
  ({ asset, onDownload, onSkip }) => {
    const { isDark } = useTheme();
    const t = useTranslations("releases");

    return (
      <div
        className={`px-4 sm:px-5 py-3 sm:py-4 border-t flex items-center gap-2 sm:gap-3 ${
          isDark ? "border-white/5 bg-white/2" : "border-gray-100 bg-gray-50/50"
        }`}
      >
        {asset.hasUpdate ? (
          <>
            <button
              onClick={onDownload}
              className={`flex-1 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
                isDark
                  ? "bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/20 active:scale-[0.98]"
                  : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm active:scale-[0.98]"
              }`}
            >
              <DownloadSimple size={16} weight="bold" />
              {t("action_download_update")}
            </button>
            <button
              onClick={onSkip}
              className={`px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all shrink-0 ${
                isDark
                  ? "bg-white/5 text-gray-400 hover:bg-white/10 border border-white/8 hover:text-gray-200"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {t("action_skip")}
            </button>
          </>
        ) : (
          <>
            <div
              className={`flex-1 py-2.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 ${
                isDark
                  ? "bg-emerald-500/8 text-emerald-400/80 border border-emerald-500/15"
                  : "bg-emerald-50 text-emerald-600 border border-emerald-200"
              }`}
            >
              <CheckCircle size={16} weight="fill" />
              {t("action_up_to_date")}
            </div>
            <button
              onClick={onDownload}
              className={`px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 shrink-0 ${
                isDark
                  ? "bg-white/5 text-gray-400 hover:bg-white/10 border border-white/8 hover:text-gray-200"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              <ArrowClockwise size={14} />
              {t("action_redownload")}
            </button>
          </>
        )}
      </div>
    );
  },
);

UpdateItemActions.displayName = "UpdateItemActions";
