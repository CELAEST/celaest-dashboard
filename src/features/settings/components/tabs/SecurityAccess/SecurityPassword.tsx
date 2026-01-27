import React, { memo } from "react";
import { Key } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { toast } from "sonner";

export const SecurityPassword: React.FC = memo(() => {
  const { isDark } = useTheme();

  return (
    <div className="settings-glass-card rounded-2xl p-6">
      <h3
        className={`text-lg font-bold mb-6 flex items-center gap-2 ${
          isDark ? "text-white" : "text-gray-900"
        }`}
      >
        <Key className="w-5 h-5 text-cyan-500" />
        Update Password
      </h3>

      <div className="space-y-4 max-w-xl">
        <div>
          <label
            className={`text-xs uppercase tracking-wider mb-2 block font-bold ${
              isDark ? "text-gray-500" : "text-gray-400"
            }`}
          >
            Current Password
          </label>
          <input
            type="password"
            className="settings-input w-full rounded-lg px-4 py-3 font-mono"
            placeholder="••••••••••••"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              className={`text-xs uppercase tracking-wider mb-2 block font-bold ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}
            >
              New Password
            </label>
            <input
              type="password"
              className="settings-input w-full rounded-lg px-4 py-3 font-mono"
              placeholder="••••••••••••"
            />
          </div>
          <div>
            <label
              className={`text-xs uppercase tracking-wider mb-2 block font-bold ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}
            >
              Confirm New Password
            </label>
            <input
              type="password"
              className="settings-input w-full rounded-lg px-4 py-3 font-mono"
              placeholder="••••••••••••"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={() => toast.success("Password updated successfully")}
            className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold transition-all shadow-sm active:scale-95"
          >
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
});

SecurityPassword.displayName = "SecurityPassword";
