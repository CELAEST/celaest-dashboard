"use client";

import { useMemo } from "react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

export const useAnalytics = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const stats = useMemo(() => ({
    uptime: "99.98%",
    activeUsers: 1248,
    responseTime: "42ms",
    errorRate: "0.02%",
  }), []);

  const resourceData = useMemo(() => [
    { name: "CPU Usage", value: 34, color: "#22d3ee" },
    { name: "Memory Usage", value: 62, color: "#818cf8" },
    { name: "Disk I/O", value: 12, color: "#34d399" },
  ], []);

  const eventLogs = useMemo(() => [
    { id: 1, type: "info", message: "User login successful: admin@celaest.com", time: "2m ago" },
    { id: 2, type: "warning", message: "High latency detected in AP-South region", time: "5m ago" },
    { id: 3, type: "success", message: "Database backup completed successfully", time: "12m ago" },
    { id: 4, type: "error", message: "Failed to process payment for order #8492", time: "15m ago" },
  ], []);

  return {
    isDark,
    stats,
    resourceData,
    eventLogs,
  };
};
