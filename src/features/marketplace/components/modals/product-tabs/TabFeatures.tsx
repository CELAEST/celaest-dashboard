import React from "react";
import { CheckCircle } from "@phosphor-icons/react";
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
      <div className="space-y-3">
        {displayFeatures.map((feature, i) => (
          <div key={i} className="flex items-start gap-3">
            <CheckCircle
              className={`size-5 mt-0.5 shrink-0 ${
                theme === "dark" ? "text-emerald-400" : "text-emerald-500"
              }`}
            />
            <span
              className={theme === "dark" ? "text-gray-300" : "text-gray-700"}
            >
              {feature}
            </span>
          </div>
        ))}
      </div>
    );
  },
);

TabFeatures.displayName = "TabFeatures";
