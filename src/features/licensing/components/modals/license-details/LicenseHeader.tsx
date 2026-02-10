import React from "react";
import { X } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import type { LicenseResponse } from "@/features/licensing/types";

interface LicenseHeaderProps {
  license: LicenseResponse;
  onClose: () => void;
}

export const LicenseHeader: React.FC<LicenseHeaderProps> = ({
  license,
  onClose,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="p-6 border-b shrink-0 flex items-center justify-between">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h2
            className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
          >
            {license.plan?.name || license.license_key.substring(0, 16)}
          </h2>
          <span
            className={`px-2 py-0.5 rounded text-xs font-medium border uppercase ${
              license.status === "active"
                ? "bg-green-500/10 text-green-500 border-green-500/20"
                : license.status === "expired"
                  ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                  : "bg-red-500/10 text-red-500 border-red-500/20"
            }`}
          >
            {license.status}
          </span>
        </div>
        <div
          className={`text-sm font-mono ${isDark ? "text-gray-500" : "text-gray-500"}`}
        >
          ID: {license.id}
        </div>
      </div>
      <button
        onClick={onClose}
        className={`p-2 rounded-full transition-colors ${
          isDark
            ? "hover:bg-white/10 text-gray-400 hover:text-white"
            : "hover:bg-gray-100 text-gray-500 hover:text-gray-900"
        }`}
      >
        <X size={20} />
      </button>
    </div>
  );
};
