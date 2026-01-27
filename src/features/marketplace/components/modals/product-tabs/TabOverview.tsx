import React from "react";
import { Code } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

interface TabOverviewProps {
  description: string;
  stack?: string[];
  tags?: string[];
}

export const TabOverview: React.FC<TabOverviewProps> = React.memo(
  ({ description, stack, tags }) => {
    const { theme } = useTheme();

    return (
      <div className="space-y-6">
        <div>
          <h3
            className={`text-lg font-semibold mb-3 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Descripción
          </h3>
          <p
            className={`leading-relaxed ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {description}
          </p>
        </div>

        <div>
          <h3
            className={`text-lg font-semibold mb-3 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Technology Stack
          </h3>
          <div className="flex flex-wrap gap-2">
            {(stack || ["Excel", "VBA", "Power Query"]).map((tech) => (
              <span
                key={tech}
                className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border
                ${
                  theme === "dark"
                    ? "bg-purple-500/10 border-purple-500/20 text-purple-400"
                    : "bg-purple-50 border-purple-200 text-purple-700"
                }
              `}
              >
                <Code className="size-3" />
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3
            className={`text-lg font-semibold mb-3 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {(
              tags || ["Dashboard", "Sales", "Analytics", "VBA", "Automation"]
            ).map((tag) => (
              <span
                key={tag}
                className={`
                px-3 py-1.5 rounded-lg text-xs font-medium border
                ${
                  theme === "dark"
                    ? "bg-white/5 border-white/10 text-gray-300"
                    : "bg-gray-100 border-gray-200 text-gray-700"
                }
              `}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  },
);

TabOverview.displayName = "TabOverview";
