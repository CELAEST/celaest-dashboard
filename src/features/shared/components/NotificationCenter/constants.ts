import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info,
} from "lucide-react";
import { type Notification } from "@/features/shared/contexts/NotificationContext";

export const NOTIFICATION_ICONS = {
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
  info: Info,
} as const;

export const getColorScheme = (type: Notification["type"], isDark: boolean) => {
  const schemes = {
    success: {
      icon: "text-emerald-500",
      bg: isDark ? "bg-emerald-500/10" : "bg-emerald-50",
    },
    warning: {
      icon: "text-orange-500",
      bg: isDark ? "bg-orange-500/10" : "bg-orange-50",
    },
    error: {
      icon: "text-red-500",
      bg: isDark ? "bg-red-500/10" : "bg-red-50",
    },
    info: {
      icon: isDark ? "text-cyan-400" : "text-blue-500",
      bg: isDark ? "bg-cyan-500/10" : "bg-blue-50",
    },
  };
  return schemes[type];
};
