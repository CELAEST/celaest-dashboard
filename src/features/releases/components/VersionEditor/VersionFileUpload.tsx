import React, { memo } from "react";
import { Link, GitBranch } from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useTranslations } from "next-intl";

interface VersionFileUploadProps {
  downloadUrl: string;
  onUrlChange: (url: string) => void;
}

export const VersionFileUpload: React.FC<VersionFileUploadProps> = memo(
  ({ downloadUrl, onUrlChange }) => {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const t = useTranslations("releases");

    // Auto-extract version from GitHub URL e.g. .../releases/download/v1.1/...
    const extractedVersion = (() => {
      const match = downloadUrl.match(/releases\/download\/(v[\d.]+(?:-[\w.]+)?)\//i);
      return match ? match[1] : null;
    })();

    return (
      <div className={`rounded-xl border p-5 space-y-3 ${
        isDark ? "bg-white/3 border-white/10" : "bg-gray-50 border-gray-200"
      }`}>
        <div className="flex items-center gap-2 mb-1">
          <GitBranch size={15} className={isDark ? "text-cyan-400" : "text-blue-600"} />
          <label className={`text-sm font-semibold ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            {t("upload_github_url")}
          </label>
        </div>

        <div className={`flex items-center gap-2 rounded-xl border transition-colors ${
          isDark
            ? "bg-white/5 border-white/10 focus-within:border-cyan-500/40"
            : "bg-white border-gray-300 focus-within:border-blue-500"
        }`}>
          <Link size={15} className={`ml-4 shrink-0 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
          <input
            type="url"
            value={downloadUrl}
            onChange={(e) => onUrlChange(e.target.value)}
            placeholder={t("upload_github_placeholder")}
            className={`flex-1 px-3 py-3 bg-transparent border-none outline-none text-sm font-mono ${
              isDark ? "text-white placeholder-gray-500" : "text-gray-900 placeholder-gray-400"
            }`}
          />
        </div>

        {extractedVersion && (
          <p className={`text-xs flex items-center gap-1.5 ${isDark ? "text-emerald-400" : "text-emerald-700"}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            {t("upload_version_detected")} <span className="font-mono font-bold">{extractedVersion}</span>
          </p>
        )}

        <p className={`text-xs ${isDark ? "text-gray-600" : "text-gray-500"}`}>
          {t("upload_help_text")}
        </p>
      </div>
    );
  },
);

VersionFileUpload.displayName = "VersionFileUpload";
