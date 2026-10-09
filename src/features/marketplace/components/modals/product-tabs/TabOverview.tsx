import React from "react";
import { Code } from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useTranslations } from "next-intl";

interface TabOverviewProps {
  description: string;
  stack?: string[];
  tags?: string[];
}

export const TabOverview: React.FC<TabOverviewProps> = React.memo(
  ({ description, stack, tags }) => {
    const t = useTranslations("marketplace");
    const { theme } = useTheme();

    return (
      <div className="flex flex-col gap-6">
        {/* Descripción */}
        <div className="flex flex-col gap-2">
          <h3
            className={`text-xs font-mono uppercase tracking-[0.18em] ${
              theme === "dark" ? "text-white/40" : "text-gray-500"
            }`}
          >
            {t("description")}
          </h3>
          <p
            className={`text-xs sm:text-sm leading-relaxed font-sans ${
              theme === "dark" ? "text-white/80" : "text-gray-700"
            }`}
          >
            {description}
          </p>
        </div>

        {/* Stack Tecnológico */}
        {stack && stack.length > 0 && (
          <div className="flex flex-col gap-2.5 pt-2 border-t border-white/[0.06]">
            <h3
              className={`text-xs font-mono uppercase tracking-[0.18em] flex items-center gap-1.5 ${
                theme === "dark" ? "text-white/40" : "text-gray-500"
              }`}
            >
              <Code size={14} />
              {t("technology_stack")}
            </h3>
            <div className="flex flex-wrap gap-2">
              {stack.map((tech, i) => (
                <span
                  key={`${tech}-${i}`}
                  className={`
                    px-3 py-1.5 rounded-lg text-xs font-mono border transition-colors
                    ${
                      theme === "dark"
                        ? "bg-[#141418] border-white/[0.06] text-[#A1A1AA] hover:border-white/15"
                        : "bg-gray-100 border-gray-200 text-gray-800"
                    }
                  `}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

      </div>
    );
  },
);

TabOverview.displayName = "TabOverview";
