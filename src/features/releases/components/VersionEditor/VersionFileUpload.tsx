import React, { memo } from "react";
import { Upload } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

interface VersionFileUploadProps {
  onFileSelect: (files: FileList | null) => void;
}

export const VersionFileUpload: React.FC<VersionFileUploadProps> = memo(
  ({ onFileSelect }) => {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
      <div>
        <label
          className={`block text-sm font-semibold mb-3 ${
            isDark ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Upload New Version File
        </label>
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            isDark
              ? "border-white/10 hover:border-cyan-500/30 bg-white/5"
              : "border-gray-300 hover:border-blue-400 bg-gray-50"
          }`}
        >
          <Upload
            size={48}
            className={`mx-auto mb-4 ${
              isDark ? "text-gray-500" : "text-gray-400"
            }`}
          />
          <p
            className={`text-sm font-medium mb-1 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Drop your updated file here or click to browse
          </p>
          <p
            className={`text-xs ${isDark ? "text-gray-500" : "text-gray-600"}`}
          >
            Supports: .xlsm, .py, .js, Google Sheets link (Max 50MB)
          </p>
          <input
            type="file"
            className="hidden"
            onChange={(e) => onFileSelect(e.target.files)}
          />
        </div>
      </div>
    );
  },
);

VersionFileUpload.displayName = "VersionFileUpload";
