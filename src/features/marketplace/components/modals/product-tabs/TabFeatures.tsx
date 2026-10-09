import React from "react";
import { Check } from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useTranslations } from "next-intl";

interface TabFeaturesProps {
  features: string[];
}

export const TabFeatures: React.FC<TabFeaturesProps> = React.memo(
  ({ features }) => {
    const t = useTranslations("marketplace");
    const { theme } = useTheme();

    const displayFeatures =
      features && features.length > 0
        ? features
        : [
            t("feature_1"),
            t("feature_2"),
            t("feature_3"),
            t("feature_4"),
            t("feature_5"),
            t("feature_6"),
          ];

    return (
      <div className="flex flex-col gap-4">
        <h3
          className={`text-xs font-mono uppercase tracking-[0.18em] ${
            theme === "dark" ? "text-white/40" : "text-gray-500"
          }`}
        >
          {t("features")}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {displayFeatures.map((feature, i) => (
            <div
              key={i}
              className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                theme === "dark"
                  ? "bg-[#0D0D11] border-white/[0.06]"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <span
                className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
                  theme === "dark"
                    ? "bg-white/10 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                <Check size={12} weight="bold" />
              </span>
              <span
                className={`text-xs leading-relaxed font-sans ${
                  theme === "dark" ? "text-white/80" : "text-gray-700"
                }`}
              >
                {feature}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  },
);

TabFeatures.displayName = "TabFeatures";
