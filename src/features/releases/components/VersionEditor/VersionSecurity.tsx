import React, { memo } from "react";
import { Shield, AlertCircle } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

interface VersionSecurityProps {
  checksum: string;
  onChange: (value: string) => void;
  onGenerate: () => void;
}

export const VersionSecurity: React.FC<VersionSecurityProps> = memo(
  ({ checksum, onChange, onGenerate }) => {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
      <div className="space-y-6">
        {/* Checksum Generator */}
        <div>
          <label
            className={`block text-sm font-semibold mb-2 ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            File Checksum (SHA-256)
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={checksum}
              onChange={(e) => onChange(e.target.value)}
              readOnly
              placeholder="Click generate to create checksum..."
              className={`flex-1 px-4 py-3 rounded-xl border font-mono text-sm transition-colors ${
                isDark
                  ? "bg-white/5 border-white/10 text-white placeholder-gray-500"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
              }`}
            />
            <button
              type="button"
              onClick={onGenerate}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all ${
                isDark
                  ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20"
                  : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
              }`}
            >
              <Shield size={16} />
              Generate
            </button>
          </div>
        </div>

        {/* Security Notice */}
        <div
          className={`p-4 rounded-xl border flex gap-3 ${
            isDark
              ? "bg-blue-500/5 border-blue-500/20"
              : "bg-blue-50 border-blue-200"
          }`}
        >
          <AlertCircle
            size={20}
            className={`shrink-0 mt-0.5 ${
              isDark ? "text-blue-400" : "text-blue-600"
            }`}
          />
          <div>
            <p
              className={`text-sm font-semibold mb-1 ${
                isDark ? "text-blue-400" : "text-blue-700"
              }`}
            >
              Checksum Verification
            </p>
            <p
              className={`text-xs ${
                isDark ? "text-blue-400/80" : "text-blue-600/80"
              }`}
            >
              Customers can verify file integrity using the SHA-256 checksum.
              This ensures downloads are not corrupted or tampered with.
            </p>
          </div>
        </div>
      </div>
    );
  },
);

VersionSecurity.displayName = "VersionSecurity";
