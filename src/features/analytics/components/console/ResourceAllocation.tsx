import React from "react";
import { motion } from "motion/react";
import { Database, Cpu, HardDrives } from "@phosphor-icons/react";
import type { useAnalytics } from "@/features/analytics/hooks/useAnalytics";

type AnalyticsData = ReturnType<typeof useAnalytics>;

interface ResourceAllocationProps {
  className?: string;
  isDark: boolean;
  usage: AnalyticsData["usage"];
}

const SvgMeter = ({ value, color, isDark }: { value: number, color: string, isDark: boolean }) => {
  const totalSegments = 24;
  const activeSegments = Math.round((value / 100) * totalSegments);
  
  return (
    <div className="w-full h-3">
      <svg width="100%" height="100%" preserveAspectRatio="none">
        <defs>
          <filter id={`glow-${color.replace('#','')}`}>
            <feGaussianBlur stdDeviation="2" />
          </filter>
        </defs>
        <g stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} strokeWidth="2">
          {Array.from({ length: totalSegments }).map((_, i) => (
             <line key={`bg-${i}`} x1={`${1 + i * 4.15}%`} y1="50%" x2={`${2.5 + i * 4.15}%`} y2="50%" />
          ))}
        </g>
        <g stroke={color} strokeWidth="2" strokeLinecap="round">
          {Array.from({ length: activeSegments }).map((_, i) => (
             <motion.line 
               key={`act-${i}`} 
               x1={`${1 + i * 4.15}%`} y1="50%" x2={`${2.5 + i * 4.15}%`} y2="50%" 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: i * 0.05 }}
               filter={`url(#glow-${color.replace('#','')})`}
             />
          ))}
        </g>
      </svg>
    </div>
  );
};

export const ResourceAllocation = React.memo(
  ({ className, isDark, usage }: ResourceAllocationProps) => {
    const resourceData = React.useMemo(
      () => [
        {
          name: "CPU Usage (API)",
          value: Math.min(
            Math.round(((usage?.api_requests || 0) / 10000) * 100),
            100,
          ), // Mock calc
          color: "#3b82f6",
        },
        {
          name: "Database Storage",
          value: Math.min(
            Math.round(((usage?.storage_used_gb || 0) / 10) * 100),
            100,
          ), // Mock calc assuming 10GB limit
          color: "#8b5cf6",
        },
      ],
      [usage],
    );

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`rounded-[16px] overflow-hidden p-5 group flex flex-col justify-between ${
          isDark
            ? "bg-[#09090b] border border-white/10 hover:border-blue-500/30"
            : "bg-white border border-gray-100 shadow-lg hover:border-blue-500/20"
        } ${className}`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-7 h-7 flex items-center justify-center rounded-[8px] ${
                isDark 
                  ? "bg-linear-to-b from-white/8 to-transparent border border-white/8 text-blue-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_2px_4px_rgba(0,0,0,0.2)]" 
                  : "bg-linear-to-b from-white to-gray-50 border border-gray-200 text-blue-600 shadow-[inset_0_1px_0_rgba(255,255,255,1),0_1px_2px_rgba(0,0,0,0.05)]"
              }`}
            >
              <HardDrives className="w-4 h-4" />
            </div>
            <h3
              className={`text-[10px] font-black uppercase tracking-widest ${isDark ? "text-gray-400" : "text-gray-500"}`}
            >
              Resources
            </h3>
          </div>
          <div
            className={`text-[10px] font-mono opacity-50 ${isDark ? "text-gray-400" : "text-gray-500"}`}
          >
            org-node
          </div>
        </div>

        <div className="space-y-4 my-3 flex-1 flex flex-col justify-center">
          {resourceData.map((resource, index) => (
            <div key={resource.name} className="group/item">
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-[10px] uppercase font-bold tracking-wider flex items-center gap-2 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {resource.name.includes("CPU") ? (
                    <Cpu className="w-3 h-3 opacity-60" />
                  ) : (
                    <Database className="w-3 h-3 opacity-60" />
                  )}
                  {resource.name}
                </span>
                <span
                  className={`text-[11px] font-mono font-bold tabular-nums`}
                  style={{ color: resource.color }}
                >
                  {resource.value}%
                </span>
              </div>
              <SvgMeter value={resource.value} color={resource.color} isDark={isDark} />
            </div>
          ))}
        </div>

        <div
          className={`pt-3 mt-1 border-t border-dashed flex items-center justify-between ${isDark ? "border-white/10" : "border-gray-200"}`}
        >
          <span
            className={`text-[9px] font-bold uppercase tracking-wider opacity-60 ${isDark ? "text-gray-400" : "text-gray-500"}`}
          >
            Active Pods
          </span>
          <span
            className={`text-[11px] font-mono font-bold ${isDark ? "text-blue-400" : "text-blue-600"}`}
          >
            {usage?.api_requests
              ? Math.min(Math.round(usage.api_requests / 625), 16)
              : 0}
            <span className="opacity-50 text-[9px]">/16</span>
          </span>
        </div>
      </motion.div>
    );
  },
);

ResourceAllocation.displayName = "ResourceAllocation";
