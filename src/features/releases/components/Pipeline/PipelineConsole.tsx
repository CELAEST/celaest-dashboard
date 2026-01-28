"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Terminal,
  Play,
  Pause,
  Download,
  RotateCw,
  Check,
  AlertCircle,
} from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { motion } from "motion/react";

const logs = [
  { time: "10:24:01", type: "info", msg: "Starting build agent..." },
  { time: "10:24:02", type: "info", msg: "Agent connected: build-runner-01" },
  { time: "10:24:05", type: "cmd", msg: "> git checkout main" },
  { time: "10:24:06", type: "info", msg: "Switched to branch 'main'" },
  { time: "10:24:08", type: "cmd", msg: "> npm install" },
  { time: "10:24:15", type: "info", msg: "added 142 packages in 6.4s" },
  { time: "10:24:18", type: "cmd", msg: "> npm run build" },
  {
    time: "10:24:19",
    type: "info",
    msg: "Creating an optimized production build...",
  },
  { time: "10:24:45", type: "success", msg: "Compiled successfully." },
  { time: "10:24:46", type: "info", msg: "Finalizing static assets..." },
  { time: "10:24:50", type: "cmd", msg: "> docker build -t app:v2.4.0 ." },
  {
    time: "10:25:20",
    type: "info",
    msg: "Sending build context to Docker daemon  45.1MB",
  },
  { time: "10:25:45", type: "success", msg: "Successfully built 8a2f9c" },
  { time: "10:26:00", type: "info", msg: "Pushing to registry..." },
  { time: "10:26:15", type: "info", msg: "Deploying to Staging..." },
  {
    time: "10:26:20",
    type: "warning",
    msg: "Latency spike detected on load balancer",
  },
  { time: "10:26:25", type: "success", msg: "Deployment to Staging complete." },
];

export const PipelineConsole: React.FC = () => {
  const { isDark } = useTheme();
  const [activeLog, setActiveLog] = useState<number>(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Simulate streaming logs
  useEffect(() => {
    if (activeLog < logs.length) {
      const timeout = setTimeout(() => {
        setActiveLog((prev) => prev + 1);
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [activeLog]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeLog]);

  return (
    <div
      className={`h-full rounded-2xl border flex flex-col overflow-hidden ${isDark ? "bg-[#0a0a0a] border-white/10" : "bg-[#1e1e1e] border-gray-800"}`}
    >
      {/* Terminal Header */}
      <div
        className={`shrink-0 h-10 flex items-center justify-between px-4 border-b ${isDark ? "bg-white/5 border-white/5" : "bg-white/5 border-white/10"}`}
      >
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-gray-400" />
          <span className="text-xs font-mono font-bold text-gray-300">
            Build #4092 Logs
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            LIVE
          </span>
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
          </div>
        </div>
      </div>

      {/* Logs Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 font-mono text-xs custom-scrollbar"
      >
        {logs.slice(0, activeLog).map((log, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-1.5 flex gap-3"
          >
            <span className="shrink-0 text-gray-500 select-none">
              {log.time}
            </span>
            <span
              className={`break-all ${
                log.type === "cmd"
                  ? "text-yellow-400 font-bold"
                  : log.type === "success"
                    ? "text-emerald-400"
                    : log.type === "warning"
                      ? "text-amber-400"
                      : log.type === "info"
                        ? "text-blue-300"
                        : "text-gray-300"
              }`}
            >
              {log.msg}
            </span>
          </motion.div>
        ))}
        {activeLog === logs.length && (
          <div className="mt-4 flex items-center gap-2 text-emerald-500">
            <Check size={14} />
            <span>Process finished with exit code 0</span>
          </div>
        )}
        <div className="h-4" /> {/* Spacer */}
      </div>

      {/* CLI Input Mock */}
      <div
        className={`shrink-0 p-2 border-t flex items-center gap-2 ${isDark ? "border-white/10" : "border-gray-800"}`}
      >
        <span className="text-emerald-500 font-mono font-bold">{">"}</span>
        <span className="w-2 h-4 bg-gray-500 animate-pulse" />
      </div>
    </div>
  );
};
