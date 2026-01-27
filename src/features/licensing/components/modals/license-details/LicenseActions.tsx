import React from "react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

interface LicenseActionsProps {
  status: string;
  onStatusChange: (status: string) => void;
}

export const LicenseActions: React.FC<LicenseActionsProps> = ({
  status,
  onStatusChange,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {["active", "expired", "revoked"].map((s) => (
        <button
          key={s}
          onClick={() => onStatusChange(s)}
          disabled={status === s}
          className={`py-2 px-3 rounded-lg text-xs font-medium capitalize border transition-all ${
            status === s
              ? isDark
                ? "bg-white/10 text-white border-white/20"
                : "bg-gray-100 text-gray-900 border-gray-300"
              : isDark
                ? "border-white/5 text-gray-500 hover:bg-white/5 hover:text-gray-300"
                : "border-gray-200 text-gray-500 hover:bg-gray-50"
          }`}
        >
          Set {s}
        </button>
      ))}
    </div>
  );
};
