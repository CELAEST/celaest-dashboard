"use client";

import React from "react";
import {
  Server,
  GitCommit,
  CheckCircle,
  Clock,
  Loader2,
  PlayCircle,
} from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { motion } from "motion/react";

import { BackendPipelineStage } from "@/features/assets/api/assets.api";

export interface DeploymentPipelineProps {
  stages?: BackendPipelineStage[];
  isLoading: boolean;
}

export const DeploymentPipeline: React.FC<DeploymentPipelineProps> = ({
  stages,
  isLoading,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const getIcon = (name: string) => {
    switch (name) {
      case "Build":
        return Server;
      case "Test":
        return CheckCircle;
      case "Staging":
        return Loader2;
      case "Production":
        return PlayCircle;
      default:
        return Server;
    }
  };

  const displayStages = stages || [
    { name: "Build", status: "pending", duration: "-", commit: "-" },
    { name: "Test", status: "pending", duration: "-", commit: "-" },
    { name: "Staging", status: "pending", duration: "-", commit: "-" },
    { name: "Production", status: "pending", duration: "-", commit: "-" },
  ];

  return (
    <div className="h-full w-full flex items-center justify-center p-4">
      {/* Container for Stages */}
      <div className="relative w-full max-w-4xl flex justify-between items-start">
        {/* Connecting Line (Absolute) */}
        <div className="absolute top-10 left-0 w-full h-1 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden -z-10">
          {/* Animated Progress Bar matching active stage */}
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "66%" }} // 2/3 complete (Staging active)
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="h-full bg-linear-to-r from-emerald-500 via-emerald-400 to-blue-500 relative"
          >
            <motion.div
              animate={{ x: ["-100%", "100%"] }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="absolute inset-0 bg-white/30 skew-x-12 w-20"
            />
          </motion.div>
        </div>

        {displayStages.map((stage, idx) => {
          const isComplete = stage.status === "complete";
          const isActive = stage.status === "active";
          const Icon = getIcon(stage.name);

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.15 }}
              className="relative flex flex-col items-center group"
              style={{ width: "120px" }} // Fixed width for alignment
            >
              {/* Icon Bubble */}
              <div
                className={`relative w-20 h-20 rounded-full flex items-center justify-center border-4 transition-all duration-500 z-10 bg-white dark:bg-[#0a0a0a] ${
                  isLoading
                    ? isDark
                      ? "border-white/5 text-gray-700"
                      : "border-gray-100 text-gray-300"
                    : isComplete
                      ? isDark
                        ? "border-emerald-500 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                        : "border-emerald-500 text-emerald-600 shadow-emerald-200"
                      : isActive
                        ? isDark
                          ? "border-blue-500 text-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.5)] scale-110"
                          : "border-blue-500 text-blue-600 shadow-blue-300 scale-110"
                        : isDark
                          ? "border-white/10 text-gray-600"
                          : "border-gray-200 text-gray-300"
                }`}
              >
                {isActive && !isLoading && (
                  <div className="absolute inset-0 rounded-full border-blue-500 border-2 animate-ping opacity-20" />
                )}
                {isLoading ? (
                  <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-white/5 animate-pulse" />
                ) : (
                  <Icon
                    size={isComplete || isActive ? 28 : 24}
                    className={isActive ? "animate-spin-slow" : ""}
                  />
                )}

                {/* Small Status Badge on Icon */}
                {isComplete && !isLoading && (
                  <div className="absolute -right-1 -top-1 bg-emerald-500 rounded-full p-1 border-2 border-white dark:border-black">
                    <CheckCircle size={10} className="text-white" />
                  </div>
                )}
              </div>

              {/* Text Info */}
              <div
                className={`mt-4 text-center transition-all duration-300 ${isActive ? "transform translateY(-4px)" : ""}`}
              >
                {isLoading ? (
                  <div className="space-y-2 flex flex-col items-center">
                    <div className="h-4 w-16 bg-gray-200 dark:bg-white/5 rounded animate-pulse" />
                    <div className="h-3 w-12 bg-gray-200 dark:bg-white/5 rounded animate-pulse" />
                  </div>
                ) : (
                  <>
                    <h4
                      className={`font-bold text-lg mb-1 ${
                        isActive
                          ? isDark
                            ? "text-blue-400"
                            : "text-blue-600"
                          : isComplete
                            ? isDark
                              ? "text-emerald-400"
                              : "text-emerald-600"
                            : isDark
                              ? "text-gray-500"
                              : "text-gray-400"
                      }`}
                    >
                      {stage.name}
                    </h4>

                    <div
                      className={`flex flex-col items-center gap-1 text-xs font-medium ${
                        isActive
                          ? isDark
                            ? "text-gray-200"
                            : "text-gray-700"
                          : isDark
                            ? "text-gray-500"
                            : "text-gray-400"
                      }`}
                    >
                      <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-gray-100 dark:bg-white/5">
                        <Clock size={10} />
                        {stage.duration}
                      </span>
                      {stage.commit !== "-" && (
                        <span className="flex items-center gap-1.5 font-mono opacity-80">
                          <GitCommit size={10} />
                          {stage.commit}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
