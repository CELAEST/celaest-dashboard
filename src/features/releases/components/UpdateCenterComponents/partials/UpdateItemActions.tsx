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
        className={`px-4 sm:px-5 py-3 border-t flex items-center gap-2.5 ${
          isDark
            ? "border-white/6 bg-white/[0.01]"
            : "border-gray-100 bg-gray-50/50"
        }`}
      >
        {asset.hasUpdate ? (
          <>
            <button
              onClick={onDownload}
              className="flex-1 py-2 px-4 rounded-lg font-mono font-semibold text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2 bg-white text-black hover:bg-zinc-200 shadow-xs cursor-pointer"
            >
              <DownloadSimple size={14} weight="bold" />
              <span>{t("action_download_update")}</span>
            </button>
            <button
              onClick={onSkip}
              className={`px-3.5 py-2 rounded-lg font-mono text-xs tracking-wider uppercase transition-colors shrink-0 cursor-pointer border ${
                isDark
                  ? "bg-white/[0.03] hover:bg-white/[0.06] text-white/60 hover:text-white border-white/8"
                  : "bg-white text-gray-600 hover:bg-gray-100 border-gray-200"
              }`}
            >
              {t("action_skip")}
            </button>
          </>
        ) : (
          <>
            <div
              className={`flex-1 py-2 rounded-lg font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 border ${
                isDark
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : "bg-emerald-50 text-emerald-700 border-emerald-200"
              }`}
            >
              <CheckCircle size={14} weight="bold" />
              <span>{t("action_up_to_date")}</span>
            </div>
            <button
              onClick={onDownload}
              className={`px-3.5 py-2 rounded-lg font-mono text-xs tracking-wider uppercase transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer border ${
                isDark
                  ? "bg-white/[0.03] hover:bg-white/[0.06] text-white/60 hover:text-white border-white/8"
                  : "bg-white text-gray-600 hover:bg-gray-100 border-gray-200"
              }`}
            >
              <ArrowClockwise size={13} />
              <span>{t("action_redownload")}</span>
            </button>
          </>
        )}
      </div>
    );
  },
);

UpdateItemActions.displayName = "UpdateItemActions";
