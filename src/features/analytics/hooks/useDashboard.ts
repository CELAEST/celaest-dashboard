"use client";

import { useState, useCallback, useMemo } from "react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { toast } from "sonner";

export const useDashboard = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isDiagnosticsRunning, setIsDiagnosticsRunning] = useState(false);

  const handleRunDiagnostics = useCallback(() => {
    setIsDiagnosticsRunning(true);
    toast.info("Starting System Diagnostics...", {
      description: "Analyzing neural nodes and database integrity.",
    });

    setTimeout(() => {
      setIsDiagnosticsRunning(false);
      toast.success("Diagnostics Complete", {
        description: "All systems are operating within optimal parameters.",
      });
    }, 2000);
  }, []);

  const systemHealth = useMemo(() => [
    { name: "Main Database", uptime: 99.8, status: "healthy" },
    { name: "API Gateway", uptime: 99.9, status: "healthy" },
    { name: "CDN Node US-East", uptime: 99.7, status: "healthy" },
    { name: "Payment Processor", uptime: 99.9, status: "healthy" },
  ], []);

  // Mock time for now, could be made live
  const localTime = "14:32:01";

  return {
    isDark,
    isDiagnosticsRunning,
    handleRunDiagnostics,
    systemHealth,
    localTime,
  };
};
