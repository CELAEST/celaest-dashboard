import React from "react";
import { CheckCircle2, Copy } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

interface LicenseSuccessProps {
  createdKey: string;
  onCopy: () => void;
  onClose: () => void;
}

export const LicenseSuccess: React.FC<LicenseSuccessProps> = ({
  createdKey,
  onCopy,
  onClose,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="text-center py-6">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 mb-4">
        <CheckCircle2 size={32} className="text-green-500" />
      </div>
      <h3
        className={`text-xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
      >
        License Generated!
      </h3>
      <p
        className={`text-sm mb-6 ${isDark ? "text-gray-400" : "text-gray-500"}`}
      >
        This key will only be shown once. Please save it securely.
      </p>

      <div
        className={`p-4 rounded-xl border mb-6 relative group ${
          isDark ? "bg-black/40 border-white/10" : "bg-gray-50 border-gray-200"
        }`}
      >
        <code
          className={`font-mono text-lg break-all ${isDark ? "text-cyan-400" : "text-blue-600"}`}
        >
          {createdKey}
        </code>
        <button
          onClick={onCopy}
          className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity ${
            isDark
              ? "bg-white/10 hover:bg-white/20 text-white"
              : "bg-white hover:bg-gray-100 text-gray-700 shadow-sm"
          }`}
        >
          <Copy size={16} />
        </button>
      </div>

      <button
        onClick={onClose}
        className={`w-full py-3 rounded-xl font-medium transition-colors ${
          isDark
            ? "bg-white/10 hover:bg-white/15 text-white"
            : "bg-gray-100 hover:bg-gray-200 text-gray-900"
        }`}
      >
        Done
      </button>
    </div>
  );
};
