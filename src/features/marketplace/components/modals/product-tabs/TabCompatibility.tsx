import React from "react";
import { Shield } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

export const TabCompatibility: React.FC = React.memo(() => {
  const { theme } = useTheme();

  return (
    <div className="space-y-6">
      <div>
        <h4
          className={`text-sm font-semibold mb-3 ${
            theme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Requisitos
        </h4>
        <div className="space-y-2">
          {[
            "Microsoft Excel 2016 o superior",
            "Windows 10/11 o macOS",
            "4GB RAM mínimo",
          ].map((req, i) => (
            <div
              key={i}
              className={`flex items-center gap-2 text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              <Shield className="size-4 text-emerald-500" />
              {req}
            </div>
          ))}
        </div>
      </div>
      <div>
        <h4
          className={`text-sm font-semibold mb-3 ${
            theme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Idiomas Disponibles
        </h4>
        <div className="flex gap-2">
          {["Español", "English", "Português"].map((lang) => (
            <span
              key={lang}
              className={`
                px-3 py-1.5 rounded-lg text-xs font-medium border
                ${
                  theme === "dark"
                    ? "bg-white/5 border-white/10 text-gray-300"
                    : "bg-gray-100 border-gray-200 text-gray-700"
                }
              `}
            >
              {lang}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
});

TabCompatibility.displayName = "TabCompatibility";
