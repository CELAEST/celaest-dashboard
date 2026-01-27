"use client";

import React from "react";
import { Plus } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

interface LicensingHeaderProps {
  onCreateClick: () => void;
}

export const LicensingHeader: React.FC<LicensingHeaderProps> = ({
  onCreateClick,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`sticky top-0 z-30 backdrop-blur-xl border-b ${
        isDark ? "bg-black/50 border-white/10" : "bg-white/80 border-gray-200"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1
              className={`text-2xl font-bold tracking-tight ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Licensing Hub
            </h1>
            <p
              className={`text-sm mt-1 ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Manage product keys, validations, and security policies.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onCreateClick}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                isDark
                  ? "bg-cyan-500 text-black hover:bg-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)]"
                  : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20"
              }`}
            >
              <Plus size={18} />
              Generate License
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
