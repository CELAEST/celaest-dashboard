import React, { memo } from "react";
import { Download, CheckCircle2 } from "lucide-react";
import { CustomerAsset } from "../../../types";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

interface UpdateItemActionsProps {
  asset: CustomerAsset;
  onDownload?: () => void;
  onSkip?: () => void;
}

export const UpdateItemActions: React.FC<UpdateItemActionsProps> = memo(
  ({ asset, onDownload, onSkip }) => {
    const { isDark } = useTheme();

    return (
      <div
        className={`p-6 border-t flex gap-3 ${
          isDark ? "border-white/5 bg-white/2" : "border-gray-200 bg-gray-50"
        }`}
      >
        {asset.hasUpdate ? (
          <>
            <button
              onClick={onDownload}
              className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                isDark
                  ? "bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/20"
                  : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
              }`}
            >
              <Download size={18} />
              Download Update
            </button>
            <button
              onClick={onSkip}
              className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
                isDark
                  ? "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              Skip
            </button>
          </>
        ) : (
          <>
            <button
              className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-default ${
                isDark
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "bg-emerald-50 text-emerald-700 border border-emerald-200"
              }`}
            >
              <CheckCircle2 size={18} />
              Up to Date
            </button>
            <button
              onClick={onDownload}
              className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
                isDark
                  ? "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              Re-download
            </button>
          </>
        )}
      </div>
    );
  },
);

UpdateItemActions.displayName = "UpdateItemActions";
