import React, { memo } from "react";
import { ShieldAlert } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

export const SecurityAlerts: React.FC = memo(() => {
  const { isDark } = useTheme();

  return (
    <div
      className={`rounded-2xl p-6 border transition-all ${
        isDark ? "bg-red-500/5 border-red-500/20" : "bg-red-50 border-red-100"
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-red-500 flex items-center justify-center shrink-0 shadow-lg shadow-red-500/20">
          <ShieldAlert className="w-6 h-6 text-white" />
        </div>
        <div>
          <p
            className={`font-black text-sm tracking-tight ${
              isDark ? "text-red-400" : "text-red-700"
            }`}
          >
            CRITICAL SECURITY ALERTS
          </p>
          <p
            className={`text-xs mt-1 leading-relaxed ${
              isDark ? "text-red-400/60" : "text-red-600/70"
            }`}
          >
            These notifications cannot be disabled for your protection. We will
            always notify you of password changes and account-level security
            events.
          </p>
        </div>
      </div>
    </div>
  );
});

SecurityAlerts.displayName = "SecurityAlerts";
