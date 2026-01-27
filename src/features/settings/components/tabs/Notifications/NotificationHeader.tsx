import React, { memo } from "react";
import { Bell } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { toast } from "sonner";

export const NotificationHeader: React.FC = memo(() => {
  const { isDark } = useTheme();

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm transition-colors ${
            isDark ? "bg-cyan-500/10" : "bg-cyan-50"
          }`}
        >
          <Bell
            className={`w-6 h-6 ${isDark ? "text-cyan-400" : "text-cyan-600"}`}
          />
        </div>
        <div>
          <h3
            className={`text-lg font-bold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Notification Preferences
          </h3>
          <p
            className={`text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}
          >
            Choose how and when you want to be notified.
          </p>
        </div>
      </div>
      <button
        onClick={() =>
          toast.message("All notifications muted", {
            description: "You will no longer receive push or email alerts.",
          })
        }
        className={`px-4 py-2 rounded-xl text-xs font-black tracking-widest transition-all ${
          isDark
            ? "bg-white/5 text-gray-400 hover:text-white"
            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
        }`}
      >
        MUTE ALL
      </button>
    </div>
  );
});

NotificationHeader.displayName = "NotificationHeader";
