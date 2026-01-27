
import { useState, useMemo } from "react";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import {
  Clock,
  Users,
  DollarSign,
  TrendingUp,
} from "lucide-react";

export const useROIMetrics = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const isDark = theme === "dark";
  const isAdmin = user?.role === "super_admin" || !user;

  const [timeRange, setTimeRange] = useState("week");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");

  const filterOptions = [
    { value: "all", label: "Todas las Plantillas" },
    { value: "top10", label: "Top 10" },
    { value: "custom", label: "Custom Range" },
  ];

  const metrics = useMemo(() => [
    {
      icon: Clock,
      label: "Tiempo Total Ahorrado",
      value: "108h",
      subtext: "Este mes vs. proceso manual",
      change: "+23%",
      positive: true,
    },
    {
      icon: Users,
      label: "Tareas Completadas",
      value: "1,240",
      subtext: "4 procesos críticos este mes",
      change: "+18%",
      positive: true,
    },
    {
      icon: DollarSign,
      label: "Valor Generado",
      value: "$12,450",
      subtext: "Basado en costos/h promedio",
      change: "+31%",
      positive: true,
    },
    {
      icon: TrendingUp,
      label: "Usuarios Activos",
      value: "847",
      subtext: "28 nuevos en los últimos 7 días",
      change: "+71%",
      positive: true,
    },
  ], []);

  const topTemplates = useMemo(() => [
    { name: "Excel Automation Pro", executions: 458, color: "cyan" },
    { name: "PDF Generator Elite", executions: 328, color: "blue" },
    { name: "Data Analyzer Plus", executions: 288, color: "purple" },
    { name: "Report Builder", executions: 180, color: "indigo" },
    { name: "Email Automator", executions: 128, color: "violet" },
  ], []);

  const zombieUsers = useMemo(() => [
    {
      email: "user.1@company.com",
      templates: "12 plantillas compradas",
      daysAgo: 45,
      severity: "high",
    },
    {
      email: "user.2@company.com",
      templates: "8 plantillas compradas",
      daysAgo: 32,
      severity: "medium",
    },
    {
      email: "user.3@company.com",
      templates: "5 plantillas compradas",
      daysAgo: 28,
      severity: "medium",
    },
    {
      email: "user.4@company.com",
      templates: "15 plantillas compradas",
      daysAgo: 19,
      severity: "low",
    },
  ], []);

  const weeklyData = useMemo(() => [
    { day: "Mon", hours: 15 },
    { day: "Tue", hours: 18 },
    { day: "Wed", hours: 21 },
    { day: "Thu", hours: 25 },
    { day: "Fri", hours: 23 },
    { day: "Sat", hours: 19 },
    { day: "Sun", hours: 8 },
  ], []);

  const monthlyData = useMemo(() => [
    { month: "Jan", tasks: 350 },
    { month: "Feb", tasks: 620 },
    { month: "Mar", tasks: 780 },
    { month: "Apr", tasks: 920 },
    { month: "May", tasks: 1050 },
    { month: "Jun", tasks: 1400 },
  ], []);

  return {
    isDark,
    isAdmin,
    timeRange,
    setTimeRange,
    isFilterOpen,
    setIsFilterOpen,
    selectedFilter,
    setSelectedFilter,
    filterOptions,
    metrics,
    topTemplates,
    zombieUsers,
    weeklyData,
    monthlyData,
  };
};
