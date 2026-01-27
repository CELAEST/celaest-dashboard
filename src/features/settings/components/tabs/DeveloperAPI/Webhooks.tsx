import React, { memo } from "react";
import { Zap, Globe } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { toast } from "sonner";

export const Webhooks: React.FC = memo(() => {
  const { isDark } = useTheme();

  return (
    <div className="settings-glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3
          className={`text-lg font-bold flex items-center gap-2 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          <Zap className="w-5 h-5 text-amber-500" />
          Webhooks
        </h3>
        <button
          onClick={() =>
            toast("Endpoint configuration modal would open here", {
              description: "This feature requires backend integration.",
              action: {
                label: "Undo",
                onClick: () => console.log("Undo"),
              },
            })
          }
          className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all ${
            isDark
              ? "bg-white/5 text-gray-400 hover:text-white"
              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
          }`}
        >
          ADD ENDPOINT
        </button>
      </div>

      <div
        className={`flex flex-col items-center justify-center py-12 px-6 rounded-2xl border border-dashed transition-colors ${
          isDark
            ? "bg-black/20 border-white/5 text-gray-500"
            : "bg-gray-50 border-gray-200 text-gray-400"
        }`}
      >
        <Globe size={40} className="mb-4 opacity-20" />
        <p className="text-sm font-medium">No webhook endpoints configured</p>
        <p className="text-xs mt-1 opacity-60">
          Add an endpoint to start receiving real-time events.
        </p>
      </div>
    </div>
  );
});

Webhooks.displayName = "Webhooks";
