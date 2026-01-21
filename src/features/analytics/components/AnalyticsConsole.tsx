import React from "react";
import { motion } from "motion/react";
import {
  Activity,
  Cpu,
  Globe,
  AlertTriangle,
  CheckCircle,
  Info,
  DollarSign,
  Terminal as TerminalIcon,
} from "lucide-react";
import {
  AreaChart,
  Area,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

const uptimeData = [
  { time: "00:00", value: 99.9 },
  { time: "04:00", value: 99.8 },
  { time: "08:00", value: 99.9 },
  { time: "12:00", value: 100 },
  { time: "16:00", value: 99.9 },
  { time: "20:00", value: 99.95 },
  { time: "23:59", value: 99.9 },
];

const executionData = [
  { name: "Mon", value: 4000 },
  { name: "Tue", value: 3000 },
  { name: "Wed", value: 2000 },
  { name: "Thu", value: 2780 },
  { name: "Fri", value: 1890 },
  { name: "Sat", value: 2390 },
  { name: "Sun", value: 3490 },
];

const errorLogs = [
  {
    id: 1,
    type: "critical",
    message: "Database connection timeout at shard-04",
    time: "10:42:23",
    code: "ERR_DB_TIMEOUT",
  },
  {
    id: 2,
    type: "warning",
    message: "High latency detected on API Gateway",
    time: "10:41:05",
    code: "WARN_LATENCY",
  },
  {
    id: 3,
    type: "info",
    message: "Scheduled backup completed successfully",
    time: "10:30:00",
    code: "INFO_BACKUP",
  },
  {
    id: 4,
    type: "warning",
    message: "Memory usage exceeds 85% on Node-12",
    time: "10:15:44",
    code: "WARN_MEM",
  },
  {
    id: 5,
    type: "info",
    message: "New deployment rollout started: v4.2.1",
    time: "09:00:00",
    code: "INFO_DEPLOY",
  },
];

export const AnalyticsConsole: React.FC = () => {
  const { theme } = useTheme();

  const isDark = theme === "dark";

  // Theme-dependent styles
  const cardBg = isDark
    ? "bg-[#16161E]/60 border-white/5"
    : "bg-white border-gray-200 shadow-sm";
  const textColor = isDark ? "text-gray-300" : "text-gray-600";
  const headingColor = isDark ? "text-white" : "text-gray-900";
  const accentColor = isDark ? "#22d3ee" : "#3b82f6";

  return (
    <div className={`space-y-6 ${isDark ? "text-white" : "text-gray-900"}`}>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1
            className={`text-3xl font-bold tracking-tight mb-2 ${headingColor}`}
          >
            Operations & Telemetry
          </h1>
          <p className={`${textColor} font-mono text-sm`}>
            REAL-TIME MONITORING //{" "}
            <span className={isDark ? "text-cyan-400" : "text-blue-600"}>
              ACTIVE
            </span>
          </p>
        </div>
        <div
          className={`px-4 py-2 rounded-lg border font-mono text-sm flex items-center gap-2 ${
            isDark
              ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
              : "bg-blue-50 border-blue-200 text-blue-700"
          }`}
        >
          <Globe size={16} />
          Global Network Status: HEALTHY
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[minmax(180px,auto)]">
        {/* ROI Hero - 3D Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`md:col-span-8 md:row-span-2 rounded-3xl p-8 relative overflow-hidden border ${cardBg}`}
        >
          <div className="absolute top-0 right-0 w-1/2 h-full z-0 opacity-50">
            {/* Placeholder for 3D Widget */}
            <div className="w-full h-full bg-linear-to-br from-transparent to-cyan-500/10 flex items-center justify-center">
              <div className="relative w-48 h-48">
                <div
                  className={`absolute inset-0 rounded-full animate-ping opacity-20 ${
                    isDark ? "bg-cyan-400" : "bg-blue-500"
                  }`}
                ></div>
                <div
                  className={`absolute inset-4 rounded-full border-2 border-dashed animate-[spin_10s_linear_infinite] ${
                    isDark ? "border-cyan-400/30" : "border-blue-500/30"
                  }`}
                ></div>
                <div
                  className={`absolute inset-0 flex items-center justify-center font-mono text-xs ${
                    isDark ? "text-cyan-400" : "text-blue-600"
                  }`}
                >
                  3D VISUALIZATION
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex flex-col justify-between h-full max-w-lg">
            <div>
              <h2 className={`text-2xl font-bold mb-6 ${headingColor}`}>
                Return on Investment
              </h2>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className={`text-sm font-medium mb-1 ${textColor}`}>
                    Total Time Saved
                  </div>
                  <div
                    className={`text-4xl font-mono font-bold tracking-tighter ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    1,240
                    <span
                      className={`text-lg ${
                        isDark ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      hrs
                    </span>
                  </div>
                  <div className="text-xs text-green-500 mt-2 flex items-center gap-1">
                    <Activity size={12} /> +12% vs last month
                  </div>
                </div>
                <div>
                  <div className={`text-sm font-medium mb-1 ${textColor}`}>
                    Est. Revenue Generated
                  </div>
                  <div
                    className={`text-4xl font-mono font-bold tracking-tighter ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    $842.5
                    <span
                      className={`text-lg ${
                        isDark ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      k
                    </span>
                  </div>
                  <div className="text-xs text-green-500 mt-2 flex items-center gap-1">
                    <DollarSign size={12} /> +8.5% projected
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className={`text-sm font-medium mb-4 ${textColor}`}>
                Software Execution Frequency
              </h3>
              <div className="h-32 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={executionData}>
                    <defs>
                      <linearGradient
                        id="colorExec"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={accentColor}
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor={accentColor}
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={accentColor}
                      fillOpacity={1}
                      fill="url(#colorExec)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Uptime Chart */}
        <div
          className={`md:col-span-4 md:row-span-1 rounded-3xl p-6 border ${cardBg}`}
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className={`font-medium ${headingColor}`}>System Uptime</h3>
            <div
              className={`text-xs px-2 py-1 rounded-full ${
                isDark
                  ? "bg-green-500/10 text-green-400"
                  : "bg-green-100 text-green-700"
              }`}
            >
              99.98%
            </div>
          </div>
          <div className="h-24">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={uptimeData}>
                <Line
                  type="step"
                  dataKey="value"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? "#16161E" : "#fff",
                    border: isDark ? "1px solid #333" : "1px solid #eee",
                    borderRadius: "8px",
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Resource Monitoring */}
        <div
          className={`md:col-span-4 md:row-span-1 rounded-3xl p-6 border flex flex-col justify-center ${cardBg}`}
        >
          <h3
            className={`font-medium mb-4 ${headingColor} flex items-center gap-2`}
          >
            <Cpu size={16} /> Resource Allocation
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className={textColor}>CPU Usage (Cluster A)</span>
                <span className="font-mono">42%</span>
              </div>
              <div
                className={`h-2 rounded-full overflow-hidden ${
                  isDark ? "bg-white/5" : "bg-gray-100"
                }`}
              >
                <div
                  className={`h-full rounded-full w-[42%] ${
                    isDark ? "bg-cyan-500" : "bg-blue-500"
                  }`}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className={textColor}>Memory Load</span>
                <span className="font-mono">68%</span>
              </div>
              <div
                className={`h-2 rounded-full overflow-hidden ${
                  isDark ? "bg-white/5" : "bg-gray-100"
                }`}
              >
                <div
                  className={`h-full rounded-full w-[68%] ${
                    isDark ? "bg-purple-500" : "bg-indigo-500"
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Global Error Logs - Terminal Style */}
        <div
          className={`md:col-span-12 rounded-3xl overflow-hidden border ${
            isDark
              ? "border-white/10 bg-[#0A0A0E]"
              : "border-gray-300 bg-gray-900"
          }`}
        >
          <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
            <div className="flex items-center gap-2">
              <TerminalIcon size={14} className="text-gray-400" />
              <span className="text-xs font-mono text-gray-400">
                GLOBAL_EVENT_LOGS
              </span>
            </div>
            <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-500/20"></div>
              <div className="w-2 h-2 rounded-full bg-yellow-500/20"></div>
              <div className="w-2 h-2 rounded-full bg-green-500/20"></div>
            </div>
          </div>
          <div className="p-4 font-mono text-sm max-h-64 overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-gray-500 text-xs border-b border-white/5">
                  <th className="pb-2 pl-2">STATUS</th>
                  <th className="pb-2">TIMESTAMP</th>
                  <th className="pb-2">CODE</th>
                  <th className="pb-2">MESSAGE</th>
                </tr>
              </thead>
              <tbody>
                {errorLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-white/5 transition-colors group"
                  >
                    <td className="py-2 pl-2 w-24">
                      {log.type === "critical" && (
                        <span className="text-red-500 flex items-center gap-1">
                          <AlertTriangle size={12} /> CRT
                        </span>
                      )}
                      {log.type === "warning" && (
                        <span className="text-orange-400 flex items-center gap-1">
                          <Info size={12} /> WRN
                        </span>
                      )}
                      {log.type === "info" && (
                        <span className="text-blue-400 flex items-center gap-1">
                          <CheckCircle size={12} /> INF
                        </span>
                      )}
                    </td>
                    <td className="py-2 text-gray-500 w-32">{log.time}</td>
                    <td className="py-2 text-gray-400 w-40">{log.code}</td>
                    <td className="py-2 text-gray-300 group-hover:text-white transition-colors">
                      {log.message}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
