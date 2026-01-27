import React from "react";
import { Upload, AlertCircle } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

export const AssetFileUploader: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="space-y-4">
      <div>
        <label
          className={`block text-xs uppercase tracking-wider font-bold mb-3 ${
            isDark ? "text-gray-500" : "text-gray-400"
          }`}
        >
          Upload File
        </label>
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
            isDark
              ? "border-white/10 hover:border-cyan-500/30 bg-white/5 hover:bg-white/10"
              : "border-gray-300 hover:border-blue-400 bg-gray-50 hover:bg-gray-100"
          }`}
        >
          <div
            className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
              isDark ? "bg-white/5" : "bg-white shadow-sm"
            }`}
          >
            <Upload
              size={24}
              className={isDark ? "text-gray-400" : "text-gray-600"}
            />
          </div>
          <p
            className={`text-sm font-medium mb-1 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Drop your file here or click to browse
          </p>
          <p
            className={`text-xs ${isDark ? "text-gray-500" : "text-gray-600"}`}
          >
            Supports: .xlsm, .py, .js, Google Sheets link (Max 50MB)
          </p>
        </div>
      </div>

      <div
        className={`p-4 rounded-xl border flex gap-3 ${
          isDark
            ? "bg-orange-500/5 border-orange-500/20"
            : "bg-orange-50 border-orange-200"
        }`}
      >
        <AlertCircle
          size={20}
          className={`shrink-0 mt-0.5 ${
            isDark ? "text-orange-400" : "text-orange-600"
          }`}
        />
        <div>
          <p
            className={`text-sm font-semibold mb-1 ${
              isDark ? "text-orange-400" : "text-orange-700"
            }`}
          >
            Security Validation
          </p>
          <p
            className={`text-xs ${
              isDark ? "text-orange-400/80" : "text-orange-600/80"
            }`}
          >
            All uploaded files will be scanned for malicious code before
            publication.
          </p>
        </div>
      </div>
    </div>
  );
};
