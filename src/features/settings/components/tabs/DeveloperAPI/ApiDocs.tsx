import React, { memo } from "react";
import { ArrowSquareOut } from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useTranslations } from "next-intl";

export const ApiDocs: React.FC = memo(() => {
  const { isDark } = useTheme();
  const t = useTranslations("settings");

  return (
    <div className="settings-glass-card rounded-2xl p-6">
      <h3
        className={`text-base font-bold mb-4 flex items-center gap-2 ${
          isDark ? "text-white" : "text-gray-900"
        }`}
      >
        <ArrowSquareOut className="w-4 h-4 text-blue-500" />
        {t("docs_support")}
      </h3>
      <p
        className={`text-xs font-mono mb-6 ${isDark ? "text-white/40" : "text-gray-500"}`}
      >
        {t("docs_support_desc")}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a
          href="#"
          className={`p-4 rounded-xl border transition-all flex items-center justify-between group ${
            isDark
              ? "bg-white/[0.02] border-white/[0.05] hover:border-white/[0.12]"
              : "bg-gray-50 border-gray-100 hover:bg-gray-100"
          }`}
        >
          <div>
            <p
              className={`text-sm font-semibold font-mono ${
                isDark ? "text-zinc-100" : "text-gray-900"
              }`}
            >
              {t("api_reference")}
            </p>
            <p className={`text-[11px] font-mono mt-1 ${isDark ? "text-white/40" : "text-gray-400"}`}>
              {t("api_reference_desc")}
            </p>
          </div>
          <ArrowSquareOut
            size={16}
            className={`transition-all group-hover:translate-x-0.5 ${
              isDark ? "text-white/40 group-hover:text-white" : "text-gray-400 group-hover:text-gray-900"
            }`}
          />
        </a>
        <a
          href="#"
          className={`p-4 rounded-xl border transition-all flex items-center justify-between group ${
            isDark
              ? "bg-white/[0.02] border-white/[0.05] hover:border-white/[0.12]"
              : "bg-gray-50 border-gray-100 hover:bg-gray-100"
          }`}
        >
          <div>
            <p
              className={`text-sm font-semibold font-mono ${
                isDark ? "text-zinc-100" : "text-gray-900"
              }`}
            >
              {t("sdk_guides")}
            </p>
            <p className={`text-[11px] font-mono mt-1 ${isDark ? "text-white/40" : "text-gray-400"}`}>
              {t("sdk_guides_desc")}
            </p>
          </div>
          <ArrowSquareOut
            size={16}
            className={`transition-all group-hover:translate-x-0.5 ${
              isDark ? "text-white/40 group-hover:text-white" : "text-gray-400 group-hover:text-gray-900"
            }`}
          />
        </a>
      </div>
    </div>
  );
});

ApiDocs.displayName = "ApiDocs";
