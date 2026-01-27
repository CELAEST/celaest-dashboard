import React, { memo } from "react";
import { AlertCircle } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

export const ApiSecurityAlert: React.FC = memo(() => {
  const { isDark } = useTheme();

  return (
    <div
      className={`rounded-2xl p-5 border transition-all shadow-sm ${
        isDark
          ? "bg-amber-500/5 border-amber-500/20"
          : "bg-amber-50 border-amber-100"
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-xl bg-amber-500 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20">
          <AlertCircle className="w-6 h-6 text-white" />
        </div>
        <div>
          <p
            className={`font-black text-xs tracking-widest ${
              isDark ? "text-amber-400" : "text-amber-700"
            }`}
          >
            API KEY SECURITY
          </p>
          <p
            className={`text-xs mt-1 leading-relaxed font-medium ${
              isDark ? "text-amber-400/60" : "text-amber-600/70"
            }`}
          >
            Your API keys carry significant privileges. Never share them in
            publicly accessible areas. If you believe a key has been
            compromised, regenerate it immediately.
          </p>
        </div>
      </div>
    </div>
  );
});

ApiSecurityAlert.displayName = "ApiSecurityAlert";
