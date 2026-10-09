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
        className={`text-[10px] font-mono uppercase tracking-[0.16em] mb-3 flex items-center gap-2 ${
          isDark ? "text-white/40" : "text-gray-500"
        }`}
      >
        <Clock size={13} className={isDark ? "text-white/40" : "text-gray-400"} />
        <span>{t("recent_pulse")}</span>
      </h3>
      <div
        className={`relative pl-4 space-y-4 border-l ${
          isDark ? "border-white/8" : "border-gray-200"
        }`}
      >
        {logs.slice(0, 5).map((log, i) => (
          <div key={i} className="relative pl-4">
            <div
              className={`absolute -left-[21px] top-1.5 w-2 h-2 rounded-full border ${
                log.success
                  ? isDark
                    ? "bg-white/80 border-[#09090b]"
                    : "bg-gray-800 border-white"
                  : isDark
                    ? "bg-red-400 border-[#09090b]"
                    : "bg-red-500 border-white"
              }`}
            />
            <div
              className={`text-xs font-medium ${
                isDark ? "text-zinc-200" : "text-gray-900"
              }`}
            >
              {log.success ? t("license_validated") : t("validation_failed")}
            </div>
            <div
              className={`text-[10px] font-mono mt-0.5 flex items-center gap-2 ${
                isDark ? "text-white/40" : "text-gray-500"
              }`}
            >
              <span>{log.ip}</span> •{" "}
              <span>{new Date(log.timestamp).toLocaleString()}</span>
            </div>
            {!log.success && (
              <div className="mt-1 text-[10px] font-mono text-red-400 flex items-center gap-1">
                <Warning size={11} /> {log.reason}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
