import React from "react";
import { motion } from "motion/react";
import { Database, Cpu, Server } from "lucide-react";
import { useAnalytics } from "@/features/analytics/hooks/useAnalytics";

export const ResourceAllocation = React.memo(
  ({ className }: { className?: string }) => {
    const { isDark, usage } = useAnalytics();

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
        className={`rounded-3xl overflow-hidden p-5 group flex flex-col justify-between ${
          isDark
            ? "bg-[#09090b] border border-white/10 hover:border-blue-500/30"
            : "bg-white border border-gray-100 shadow-lg hover:border-blue-500/20"
        } ${className}`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${isDark ? "bg-blue-500/10 text-blue-400" : "bg-blue-50 text-blue-600"}`}
            >
              <Server className="w-4 h-4" />
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
            cluster-01
          </div>
        </div>

        <div className="space-y-4 my-2 flex-1 flex flex-col justify-center">
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
                  className={`text-xs font-bold tabular-nums`}
                  style={{ color: resource.color }}
                >
                  {resource.value}%
                </span>
              </div>
              <div
                className={`h-2 rounded-full overflow-hidden ${
                  isDark ? "bg-white/5" : "bg-gray-100"
                }`}
              >
                <motion.div
                  className="h-full rounded-full shadow-[0_0_8px_currentColor]"
                  style={{
                    backgroundColor: resource.color,
                    color: resource.color,
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${resource.value}%` }}
                  transition={{
                    duration: 1,
                    delay: index * 0.1,
                    ease: "easeOut",
                  }}
                />
              </div>
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
            className={`text-xs font-mono font-bold ${isDark ? "text-blue-400" : "text-blue-600"}`}
          >
            12/16
          </span>
        </div>
      </motion.div>
    );
  },
);

ResourceAllocation.displayName = "ResourceAllocation";
