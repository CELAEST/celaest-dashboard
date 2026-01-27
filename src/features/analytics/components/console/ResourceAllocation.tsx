import React from "react";
import { motion } from "motion/react";
import { Database, Cpu } from "lucide-react";
import { useAnalytics } from "@/features/analytics/hooks/useAnalytics";

export const ResourceAllocation = React.memo(() => {
  const { isDark, resourceData } = useAnalytics();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className={`rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl ${
        isDark
          ? "bg-black/40 backdrop-blur-xl border border-white/10"
          : "bg-white border border-gray-200 shadow-sm"
      }`}
    >
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Database
            className={`w-4 h-4 ${isDark ? "text-cyan-400" : "text-blue-600"}`}
          />
          <h3
            className={`font-semibold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Resource Allocation
          </h3>
        </div>

        <div className="space-y-4">
          {resourceData.map((resource, index) => (
            <div key={resource.name}>
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-sm flex items-center gap-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {resource.name.includes("CPU") ? (
                    <Cpu className="w-4 h-4" />
                  ) : (
                    <Database className="w-4 h-4" />
                  )}
                  {resource.name}
                </span>
                <span
                  className={`text-xs font-bold`}
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
                  className="h-full rounded-full"
                  style={{ backgroundColor: resource.color }}
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
      </div>
    </motion.div>
  );
});

ResourceAllocation.displayName = "ResourceAllocation";
