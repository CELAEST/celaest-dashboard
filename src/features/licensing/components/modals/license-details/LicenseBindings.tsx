import React from "react";
import { Globe, MapPin, Pulse, X } from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import type { IPBinding } from "@/features/licensing/types";
import { useTranslations } from "next-intl";

interface LicenseBindingsProps {
  bindings?: IPBinding[];
  onUnbind: (ip: string) => void;
}

export const LicenseBindings: React.FC<LicenseBindingsProps> = ({
  bindings,
  onUnbind,
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
        <Globe size={13} className={isDark ? "text-white/40" : "text-gray-400"} />
        <span>{t("active_bindings")}</span>
      </h3>
      <div className="space-y-2.5">
        {bindings && bindings.length > 0 ? (
          bindings.map((binding) => (
            <div
              key={binding.ip_address}
              className={`p-3.5 rounded-xl border group relative transition-colors ${
                isDark
                  ? "bg-white/[0.02] border-white/6 hover:bg-white/[0.04]"
                  : "bg-gray-50 border-gray-200 hover:bg-white hover:shadow-xs"
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                      isDark
                        ? "bg-white/[0.04] border-white/8 text-white/60"
                        : "bg-gray-100 border-gray-200 text-gray-600"
                    }`}
                  >
                    <MapPin size={15} />
                  </div>
                  <div>
                    <div
                      className={`font-mono text-xs font-medium ${
                        isDark ? "text-zinc-200" : "text-gray-900"
                      }`}
                    >
                      {binding.ip_address}
                    </div>
                    <div
                      className={`text-[10px] font-mono flex items-center gap-1.5 mt-0.5 ${
                        isDark ? "text-white/40" : "text-gray-500"
                      }`}
                    >
                      <Pulse size={11} className={isDark ? "text-white/40" : "text-gray-400"} />
                      <span>{t("requests_count", { count: binding.request_count })}</span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onUnbind(binding.ip_address)}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    isDark
                      ? "text-white/40 hover:text-red-400 hover:bg-red-500/10"
                      : "text-gray-400 hover:text-red-600 hover:bg-red-50"
                  }`}
                  title={t("unbind_ip")}
                >
                  <X size={14} />
                </button>
              </div>
              <div
                className={`mt-2.5 text-[9px] font-mono flex justify-between ${
                  isDark ? "text-white/30" : "text-gray-400"
                }`}
              >
                <span>
                  {t("first_seen", { date: new Date(binding.first_seen_at).toLocaleDateString() })}
                </span>
                <span>
                  {t("last_active", { time: new Date(binding.last_seen_at).toLocaleTimeString() })}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div
            className={`text-center py-6 px-4 rounded-xl border text-xs font-mono ${
              isDark
                ? "border-white/6 bg-white/[0.015] text-white/30"
                : "border-gray-200 bg-gray-50 text-gray-400"
            }`}
          >
            {t("no_active_ip_bindings")}
          </div>
        )}
      </div>
    </div>
  );
};
