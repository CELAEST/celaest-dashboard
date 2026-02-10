"use client";

import React from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

const activities = [
  {
    id: 1,
    type: "release",
    user: "Sarah Jenkins",
    action: "deployed",
    target: "v2.4.0",
    time: "2h ago",
    status: "success",
    avatar: "SJ",
  },
  {
    id: 2,
    type: "commit",
    user: "Mike Ross",
    action: "pushed",
    target: "fix: auth latency",
    time: "4h ago",
    status: "neutral",
    avatar: "MR",
  },
  {
    id: 3,
    type: "monitor",
    user: "System",
    action: "alert",
    target: "High CPU Load",
    time: "6h ago",
    status: "warning",
    avatar: "SYS",
  },
  {
    id: 4,
    type: "release",
    user: "David Kim",
    action: "promoted",
    target: "v2.4.0-rc",
    time: "1d ago",
    status: "success",
    avatar: "DK",
  },
  {
    id: 5,
    type: "commit",
    user: "Sarah Jenkins",
    action: "merged",
    target: "feat: new dashboard",
    time: "1d ago",
    status: "neutral",
    avatar: "SJ",
  },
];

import { BackendReleaseActivity } from "@/features/assets/api/assets.api";

export interface RecentReleaseFeedProps {
  activities?: BackendReleaseActivity[];
  isLoading: boolean;
}

export const RecentReleaseFeed: React.FC<RecentReleaseFeedProps> = ({
  activities: propActivities,
  isLoading,
}) => {
  const { isDark } = useTheme();

  // Helper to format time (simplified)
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const displayActivities =
    propActivities && propActivities.length > 0 ? propActivities : [];

  return (
    <div
      className={`h-full rounded-2xl border flex flex-col overflow-hidden ${
        isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"
      }`}
    >
      <div
        className={`shrink-0 p-5 pb-3 border-b flex justify-between items-center ${isDark ? "border-white/5" : "border-gray-100"}`}
      >
        <h3
          className={`font-bold text-base ${isDark ? "text-white" : "text-gray-900"}`}
        >
          Activity Log
        </h3>
        <button
          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded transition-colors ${isDark ? "bg-white/5 hover:bg-white/10 text-gray-400" : "bg-gray-100 hover:bg-gray-200 text-gray-500"}`}
        >
          View All
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-white/10" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-3/4 bg-gray-200 dark:bg-white/10 rounded" />
                  <div className="h-2 w-1/2 bg-gray-200 dark:bg-white/10 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : displayActivities.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-xs">
            No recent activity
          </div>
        ) : (
          displayActivities.map((item: any, index: number) => (
            <div key={item.id} className="relative pl-8">
              {/* Connector Line */}
              {index !== displayActivities.length - 1 && (
                <div
                  className={`absolute left-[11px] top-8 -bottom-6 w-px ${isDark ? "bg-white/10" : "bg-gray-200"}`}
                />
              )}

              {/* Timeline Dot */}
              <div
                className={`absolute left-0 top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center z-10 ${
                  item.status === "success"
                    ? isDark
                      ? "bg-[#0a0a0a] border-emerald-500 text-emerald-500"
                      : "bg-white border-emerald-500 text-emerald-600"
                    : item.status === "warning"
                      ? isDark
                        ? "bg-[#0a0a0a] border-amber-500 text-amber-500"
                        : "bg-white border-amber-500 text-amber-600"
                      : isDark
                        ? "bg-[#0a0a0a] border-gray-600 text-gray-400"
                        : "bg-white border-gray-300 text-gray-400"
                }`}
              >
                {item.status === "success" ? (
                  <CheckCircle2 size={10} />
                ) : item.status === "warning" ? (
                  <AlertCircle size={10} />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-current" />
                )}
              </div>

              <div className="flex justify-between items-start gap-2">
                <div>
                  <p
                    className={`text-xs font-medium leading-none mb-1.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}
                  >
                    <span className={isDark ? "text-white" : "text-gray-900"}>
                      {item.user}
                    </span>{" "}
                    {item.action}
                  </p>
                  <p
                    className={`text-sm font-bold leading-none ${isDark ? "text-cyan-400" : "text-cyan-600"}`}
                  >
                    {item.target}
                  </p>
                </div>
                <span
                  className={`text-[10px] whitespace-nowrap opacity-60 font-mono ${isDark ? "text-gray-500" : "text-gray-400"}`}
                >
                  {formatTime(item.created_at || new Date().toISOString())}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
