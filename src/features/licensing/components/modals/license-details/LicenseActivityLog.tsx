import React from "react";
import { Clock, Warning } from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { ValidationLog } from "@/features/licensing/constants/mock-data";
import { useTranslations } from "next-intl";

interface LicenseActivityLogProps {
  logs: ValidationLog[];
}

export const LicenseActivityLog: React.FC<LicenseActivityLogProps> = ({
  logs,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const t = useTranslations("licensing");

  return (
    <div>
      <h3
        className={`text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}
      >
        <Clock size={16} /> {t("recent_pulse")}
      </h3>
      <div
        className={`relative pl-4 space-y-6 border-l ${isDark ? "border-white/10" : "border-gray-200"}`}
      >
        {logs.slice(0, 5).map((log, i) => (
          <div key={i} className="relative pl-6">
            <div
              className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 ${
                log.success
                  ? isDark
                    ? "bg-green-500 border-black"
                    : "bg-green-500 border-white"
                  : isDark
                    ? "bg-red-500 border-black"
                    : "bg-red-500 border-white"
              }`}
            />
            <div
              className={`text-sm font-medium ${isDark ? "text-white" : "text-gray-900"}`}
            >
              {log.success ? t("license_validated") : t("validation_failed")}
            </div>
            <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-2">
              <span className="font-mono">{log.ip}</span> •{" "}
              {new Date(log.timestamp).toLocaleString()}
            </div>
            {!log.success && (
              <div className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                <Warning size={12} /> {log.reason}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
