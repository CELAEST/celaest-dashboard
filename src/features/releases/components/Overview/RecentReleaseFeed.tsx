"use client";

import React from "react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { motion } from "motion/react";

import { BackendReleaseActivity } from "@/features/assets/api/assets.api";

export interface RecentReleaseFeedProps {
  activities?: BackendReleaseActivity[];
  isLoading: boolean;
}

const TelemetryNodeSVG = ({ status, isDark }: { status?: string, isDark: boolean }) => {
  const getColors = () => {
    if (status === "success") return { main: isDark ? "#10b981" : "#059669", glow: isDark ? "rgba(16,185,129,0.3)" : "rgba(5,150,105,0.3)" };
    if (status === "warning") return { main: isDark ? "#f59e0b" : "#d97706", glow: isDark ? "rgba(245,158,11,0.3)" : "rgba(217,119,6,0.3)" };
    return { main: isDark ? "#4b5563" : "#9ca3af", glow: "transparent" };
  };
  const colors = getColors();

  return (
    <div className="relative w-7 h-7 shrink-0 flex items-center justify-center bg-black/20 dark:bg-white/5 rounded-full z-10 shadow-sm border border-white/5 dark:border-white/10">
      <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] overflow-visible">
        <circle cx="12" cy="12" r="9" fill="none" stroke={colors.main} strokeWidth="1.5" strokeOpacity="0.4" />
        
        {/* Core */}
        {status !== "neutral" && (
          <motion.circle 
            cx="12" cy="12" r="3.5" 
            fill={colors.main}
            animate={status === "success" ? { scale: [1, 1.4, 1], opacity: [1, 0.4, 1] } : { opacity: [1, 0.5, 1] }} 
            transition={status === "success" ? { duration: 2, repeat: Infinity } : { duration: 1, repeat: Infinity, ease: "linear" }}
          />
        )}
        
        {/* Radar Ring */}
        <motion.circle 
          cx="12" cy="12" r="9" 
          fill="none" 
          stroke={colors.main} 
          strokeWidth="1.5" 
          strokeDasharray="4 8"
          animate={{ rotate: 360 }}
          transition={{ duration: status === "success" ? 4 : 2, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "50% 50%" }}
        />
        
        <circle cx="12" cy="12" r="9" fill="none" stroke={colors.glow} strokeWidth="4" filter="blur(2px)" />
      </svg>
    </div>
  );
};

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
      className={`h-full rounded-2xl border flex flex-col overflow-hidden relative group ${
        isDark ? "bg-[#0a0a0a]/60 border-white/5 backdrop-blur-3xl shadow-xl" : "bg-white border-gray-200 shadow-sm"
      }`}
    >
      <div
        className={`absolute -bottom-10 -left-10 w-48 h-48 rounded-full blur-[60px] opacity-10 pointer-events-none transition-opacity duration-1000 group-hover:opacity-20 ${
          isDark ? "bg-cyan-500" : "bg-cyan-400"
        }`}
      />

      <div
        className={`relative z-10 shrink-0 p-5 pb-3 border-b flex justify-between items-center ${isDark ? "border-white/5" : "border-gray-100"}`}
      >
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-4 bg-cyan-500 rounded-sm" />
          <h3
            className={`font-black tracking-widest uppercase text-sm flex items-center gap-2 ${isDark ? "text-white" : "text-gray-900"}`}
          >
            Pulse Log
          </h3>
        </div>
        <button
          className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded transition-colors border ${isDark ? "bg-white/5 hover:bg-white/10 text-gray-400 border-white/5" : "bg-gray-100 hover:bg-gray-200 text-gray-500 border-gray-200"}`}
        >
          View All
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar relative z-10">
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
          <div className="text-center py-8 text-gray-500 text-xs font-mono uppercase tracking-widest">
            No telemetry data
          </div>
        ) : (
          displayActivities.map(
            (item: BackendReleaseActivity, index: number) => (
              <div key={item.id} className="relative pl-10">
                {/* SVG Data Stream Connector line */}
                {index !== displayActivities.length - 1 && (
                  <svg className="absolute left-[13px] top-7 w-[2px] h-[calc(100%+12px)] overflow-visible z-0 pointer-events-none">
                    <line x1="1" y1="0" x2="1" y2="100%" stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} strokeWidth="2" />
                    <motion.line 
                      x1="1" y1="0" x2="1" y2="100%" 
                      stroke={isDark ? "rgba(34,211,238,0.5)" : "rgba(8,145,178,0.5)"} 
                      strokeWidth="2" 
                      strokeDasharray="10 30"
                      animate={{ strokeDashoffset: -40 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />
                  </svg>
                )}

                {/* Telemetry Node */}
                <div className="absolute left-0 top-1.5 flex items-center justify-center">
                  <TelemetryNodeSVG status={item.status} isDark={isDark} />
                </div>

                <div className="flex justify-between items-start gap-2 pt-1.5">
                  <div className="flex flex-col gap-0.5">
                    <p
                      className={`text-[10px] font-black uppercase tracking-widest leading-none ${isDark ? "text-gray-400" : "text-gray-500"}`}
                    >
                      <span className={isDark ? "text-white mr-1" : "text-gray-900 mr-1"}>
                        {item.user}
                      </span>
                      {item.action}
                    </p>
                    <p
                      className={`text-[13px] font-bold leading-tight ${isDark ? "text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]" : "text-cyan-600"}`}
                    >
                      {item.target}
                    </p>
                  </div>
                  <span
                    className={`text-[9px] whitespace-nowrap opacity-60 font-mono font-bold tracking-widest ${isDark ? "text-gray-500" : "text-gray-400"}`}
                  >
                    {formatTime(item.created_at || new Date().toISOString())}
                  </span>
                </div>
              </div>
            ),
          )
        )}
      </div>
    </div>
  );
};

