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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <div
        className={`p-3.5 rounded-xl border ${
          isDark
            ? "bg-white/[0.02] border-white/8"
            : "bg-gray-50 border-gray-100"
        }`}
      >
        <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-white/40 mb-1">
          {t("usage_level")}
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-zinc-200 capitalize">
          <Stack size={14} className="text-white/60" /> {tier || t("standard")}
        </div>
      </div>

      <div
        className={`p-3.5 rounded-xl border ${
          isDark
            ? "bg-white/[0.02] border-white/8"
            : "bg-gray-50 border-gray-100"
        }`}
      >
        <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-white/40 mb-1">
          {t("active_ips")}
        </div>
        <div className="flex items-center gap-2 text-xs font-mono font-medium text-zinc-200">
          <HardDrives size={14} className="text-white/60" /> {maxIpSlots}
        </div>
      </div>

      <div
        className={`p-3.5 rounded-xl border ${
          isDark
            ? "bg-white/[0.02] border-white/8"
            : "bg-gray-50 border-gray-100"
        }`}
      >
        <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-white/40 mb-1">
          {t("validity_period")}
        </div>
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-200 truncate">
            <Clock size={13} className="text-white/40" /> {formatDate(startsAt)}
          </div>
          <div className="text-[10px] font-mono text-white/40 truncate">
            {t("until", { date: formatDate(expiresAt) })}
          </div>
        </div>
      </div>
    </div>
  );
};
