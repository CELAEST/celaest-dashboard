import React, { memo } from "react";
import { Globe } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { toast } from "sonner";

export const BrowserNotifications: React.FC = memo(() => {
  const { isDark } = useTheme();

  const handleRequestPermission = () => {
    if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          toast.success("Browser alerts enabled!");
        } else {
          toast.error("Permission denied");
        }
      });
    } else {
      toast.error("Browser does not support notifications");
    }
  };

  return (
    <div className="settings-glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm transition-colors ${
              isDark ? "bg-blue-500/10" : "bg-blue-50"
            }`}
          >
            <Globe
              className={`w-6 h-6 ${
                isDark ? "text-blue-400" : "text-blue-600"
              }`}
            />
          </div>
          <div>
            <p
              className={`font-bold ${isDark ? "text-white" : "text-gray-900"}`}
            >
              Browser Notifications
            </p>
            <p
              className={`text-sm ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}
            >
              Show real-time alerts in your web browser.
            </p>
          </div>
        </div>
        <button
          onClick={handleRequestPermission}
          className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black tracking-widest active:scale-95 transition-all"
        >
          ENABLE BROWSER ALERTS
        </button>
      </div>
    </div>
  );
});

BrowserNotifications.displayName = "BrowserNotifications";
