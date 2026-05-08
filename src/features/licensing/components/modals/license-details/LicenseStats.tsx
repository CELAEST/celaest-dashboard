import React from "react";
import { Stack, HardDrives, Clock } from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useTranslations } from "next-intl";

interface LicenseStatsProps {
  tier?: string;
  maxIpSlots: number;
  startsAt?: string;
  expiresAt?: string;
}

export const LicenseStats: React.FC<LicenseStatsProps> = ({
  tier,
  maxIpSlots,
  startsAt,
  expiresAt,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const t = useTranslations("licensing");

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div
        className={`p-4 rounded-xl border ${isDark ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-100"}`}
      >
        <div className="text-gray-500 text-xs mb-1">{t("usage_level")}</div>
        <div
          className={`font-bold capitalize flex items-center gap-2 ${isDark ? "text-purple-400" : "text-purple-600"}`}
        >
          <Stack size={16} /> {tier || t("standard")}
        </div>
      </div>

      <div
        className={`p-4 rounded-xl border ${isDark ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-100"}`}
      >
        <div className="text-gray-500 text-xs mb-1">{t("active_ips")}</div>
        <div
          className={`font-bold flex items-center gap-2 ${isDark ? "text-amber-400" : "text-amber-600"}`}
        >
          <HardDrives size={16} /> {maxIpSlots}
        </div>
      </div>

      <div
        className={`p-4 rounded-xl border ${isDark ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-100"}`}
      >
        <div className="text-gray-500 text-xs mb-1">{t("validity_period")}</div>
        <div
          className={`text-xs font-semibold flex flex-col gap-1 ${isDark ? "text-blue-400" : "text-blue-600"}`}
        >
          <div className="flex items-center gap-1.5 line-clamp-1">
            <Clock size={14} /> {formatDate(startsAt)}
          </div>
          <div className="line-clamp-1">{t("until", { date: formatDate(expiresAt) })}</div>
        </div>
      </div>
    </div>
  );
};
