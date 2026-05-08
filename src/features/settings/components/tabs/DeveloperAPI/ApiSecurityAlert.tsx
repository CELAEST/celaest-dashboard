import React, { memo } from "react";
import { Warning } from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useTranslations } from "next-intl";

export const ApiSecurityAlert: React.FC = memo(() => {
  const { isDark } = useTheme();
  const t = useTranslations("settings");

  return (
    <div
      className={`rounded-2xl p-5 border transition-all shadow-sm ${
        isDark
          ? "bg-amber-500/5 border-amber-500/20"
          : "bg-amber-50 border-amber-100"
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-xl bg-amber-500 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20">
          <Warning className="w-6 h-6 text-white" />
        </div>
        <div>
          <p
            className={`font-black text-xs tracking-widest ${
              isDark ? "text-amber-400" : "text-amber-700"
            }`}
          >
            {t("api_key_security")}
          </p>
          <p
            className={`text-xs mt-1 leading-relaxed font-medium ${
              isDark ? "text-amber-400/60" : "text-amber-600/70"
            }`}
          >
            {t("api_key_security_desc")}
          </p>
        </div>
      </div>
    </div>
  );
});

ApiSecurityAlert.displayName = "ApiSecurityAlert";
