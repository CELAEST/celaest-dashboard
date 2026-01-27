import React, { memo } from "react";
import { Calendar, HardDrive, Download, Activity } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { Version } from "@/features/releases/types";


interface VersionDetailsMetricsProps {
  version: Version;
}

export const VersionDetailsMetrics: React.FC<VersionDetailsMetricsProps> = memo(
  ({ version }) => {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const metrics = [
      {
        label: "Released",
        value: new Date(version.releaseDate).toLocaleDateString(),
        icon: Calendar,
        color: "text-blue-500",
      },
      {
        label: "Size",
        value: version.fileSize,
        icon: HardDrive,
        color: "text-purple-500",
      },
      {
        label: "Downloads",
        value: version.downloads.toLocaleString(),
        icon: Download,
        color: "text-emerald-500",
      },
      {
        label: "Adoption",
        value: `${version.adoptionRate}%`,
        icon: Activity,
        color: "text-cyan-500",
      },
    ];

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((stat, i) => (
          <div
            key={i}
            className={`p-4 rounded-xl border ${
              isDark
                ? "bg-white/5 border-white/5"
                : "bg-gray-50 border-gray-100"
            }`}
          >
            <stat.icon size={18} className={`mb-2 ${stat.color}`} />
            <div
              className={`text-xs mb-0.5 ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {stat.label}
            </div>
            <div
              className={`text-sm font-bold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {stat.value}
            </div>
          </div>
        ))}
      </div>
    );
  },
);

VersionDetailsMetrics.displayName = "VersionDetailsMetrics";
