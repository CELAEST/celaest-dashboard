"use client";

import React from "react";
import {
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
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

export const RecentReleaseFeed: React.FC = () => {
  const { isDark } = useTheme();

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
        {activities.map((item, index) => (
          <div key={item.id} className="relative pl-8">
            {/* Connector Line */}
            {index !== activities.length - 1 && (
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
                {item.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
