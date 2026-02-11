import React from "react";
import { motion } from "motion/react";
import { Terminal, Minus, Square, X, ChevronRight } from "lucide-react";
import { useAnalytics } from "@/features/analytics/hooks/useAnalytics";

export const EventLogs = React.memo(() => {
  const { isDark, eventLogs } = useAnalytics();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3 }}
      className={`h-full flex flex-col rounded-xl overflow-hidden shadow-2xl relative group ${
        isDark
          ? "bg-[#050505] border border-white/10"
          : "bg-[#1a1a1a] border-gray-800"
      }`}
    >
      {/* CRT Scanline Effect Overlay */}
      <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden opacity-10">
        <div
          className="w-full h-full bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))]"
          style={{ backgroundSize: "100% 2px, 3px 100%" }}
        />
      </div>

      {/* Terminal Title Bar */}
      <div className="h-10 bg-[#1a1a1a] flex items-center justify-between px-4 shrink-0 relative z-30 border-b border-white/5">
        <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
          <Terminal className="w-3.5 h-3.5 text-emerald-500" />
          <span>root@celaest-core:~</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="p-1 hover:bg-white/10 rounded cursor-pointer transition-colors">
            <Minus className="w-3 h-3 text-gray-500" />
          </div>
          <div className="p-1 hover:bg-white/10 rounded cursor-pointer transition-colors">
            <Square className="w-2.5 h-2.5 text-gray-500" />
          </div>
          <div className="p-1 hover:bg-red-500/20 rounded cursor-pointer transition-colors group/close">
            <X className="w-3 h-3 text-gray-500 group-hover/close:text-red-400" />
          </div>
        </div>
      </div>

      {/* Terminal Body */}
      <div className="flex-1 overflow-hidden relative p-4 font-mono text-xs">
        <div className="absolute inset-0 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {/* Initial Boot Sequence Mock */}
          <div className="text-gray-500 mb-4 opacity-70">
            <p>Initializing system core...</p>
            <p>Loading modules: [OK]</p>
            <p>Establishing secure connection... connected.</p>
            <p className="mb-2">----------------------------------------</p>
          </div>

          {/* Live Logs */}
          <div className="space-y-1.5">
            {eventLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-2 hover:bg-white/5 px-1 -mx-1 rounded selection:bg-emerald-500/30 selection:text-white"
              >
                <span className="text-gray-600 shrink-0 font-mono text-[10px] w-20">
                  [
                  {new Date(log.timestamp).toLocaleTimeString([], {
                    hour12: false,
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                  ]
                </span>
                <div className="break-all flex-1">
                  <span
                    className={`font-bold mr-2 ${
                      log.type === "error"
                        ? "text-red-500"
                        : log.type === "warning"
                          ? "text-amber-500"
                          : log.type === "success"
                            ? "text-emerald-500"
                            : "text-blue-400"
                    }`}
                  >
                    {log.type === "error"
                      ? "[ERR]"
                      : log.type === "warning"
                        ? "[WARN]"
                        : log.type === "success"
                          ? "[OK]"
                          : "[INFO]"}
                  </span>
                  <span className="text-gray-300">
                    <span className="opacity-50 mr-2 text-[10px] uppercase font-bold tracking-wider">
                      {log.source}:
                    </span>
                    {log.message}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Blinking Cursor */}
          <div className="mt-2 flex items-center gap-1 text-emerald-500">
            <ChevronRight className="w-3 h-3" strokeWidth={3} />
            <span className="animate-pulse">_</span>
          </div>
        </div>
      </div>

      {/* Footer Status */}
      <div className="h-6 bg-[#0a0a0a] border-t border-white/5 flex items-center justify-between px-3 text-[10px] font-mono text-gray-500 relative z-30">
        <div className="flex items-center gap-3">
          <span>UTF-8</span>
          <span>Ln {eventLogs.length + 12}, Col 1</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`w-1.5 h-1.5 rounded-full animate-pulse ${eventLogs.length > 0 ? "bg-emerald-500" : "bg-amber-500"}`}
          />
          <span
            className={
              eventLogs.length > 0 ? "text-emerald-500" : "text-amber-500"
            }
          >
            {eventLogs.length > 0 ? "Connected" : "Connecting..."}
          </span>
        </div>
      </div>
    </motion.div>
  );
});

EventLogs.displayName = "EventLogs";
