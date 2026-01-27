import React from "react";
import { CheckCircle2 } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

interface TabFeaturesProps {
  features: string[];
}

export const TabFeatures: React.FC<TabFeaturesProps> = React.memo(
  ({ features }) => {
    const { theme } = useTheme();

    return (
      <div className="space-y-3">
        {[
          "Fácil de personalizar e integrar",
          "Documentación completa incluida",
          "Actualizaciones regulares y correcciones",
          "Soporte por email del autor",
          "Garantía de devolución de 30 días",
          "Acceso de por vida a actualizaciones",
          ...features,
        ].map((feature, i) => (
          <div key={i} className="flex items-start gap-3">
            <CheckCircle2
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
