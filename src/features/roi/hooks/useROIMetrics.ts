import { useState, useMemo } from "react";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { useOrgStore } from "@/features/shared/stores/useOrgStore";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useRole } from "@/features/auth/hooks/useAuthorization";
import {
  Clock,
  Users,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import {
  useROIQuery,
  useROIByProductQuery,
  useSalesByPeriodQuery,
  useTasksQuery,
  useActiveUsersQuery,
  useUsersQuery
} from "./useROIQuery";

export const useROIMetrics = () => {
  const { theme } = useTheme();
  const { session } = useAuth();
  const { currentOrg } = useOrgStore();
  const { isSuperAdmin } = useRole();
  const token = session?.accessToken || "";
  const orgId = currentOrg?.id || "";

  const isDark = theme === "dark";

  const [timeRange, setTimeRange] = useState("week");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("week");

  // Determine periods for comparison (Logic from legacy)
  const prevPeriod = timeRange === "week" ? "month" : timeRange === "month" ? "year" : "year";

  // TanStack Queries
  const roiQuery = useROIQuery(token, orgId, timeRange);
  const tasksQuery = useTasksQuery(token, orgId, timeRange);
  const activeUsersQuery = useActiveUsersQuery(token, orgId);
  const roiByProductQuery = useROIByProductQuery(token, orgId);
  const usersQuery = useUsersQuery(token, orgId, timeRange);
  const salesByPeriodQuery = useSalesByPeriodQuery(token, orgId, timeRange);
  
  // Previous Period Queries for growth calculation
  const prevTasksQuery = useTasksQuery(token, orgId, prevPeriod);

  const isLoading = 
    roiQuery.isLoading || 
    tasksQuery.isLoading || 
    activeUsersQuery.isLoading || 
    roiByProductQuery.isLoading ||
    usersQuery.isLoading ||
    salesByPeriodQuery.isLoading;

  // Derived Metrics
  const taskMetrics = useMemo(() => {
    const tasks = tasksQuery.data?.completed_tasks || 0;
    const savedHours = Math.round(tasks * 0.166);
    const valueGenerated = Math.round(savedHours * 25);
    return { completed_tasks: tasks, saved_hours: savedHours, value_generated: valueGenerated };
  }, [tasksQuery.data]);

  const prevTaskMetrics = useMemo(() => {
    const tasks = prevTasksQuery.data?.completed_tasks || 0;
    const savedHours = Math.round(tasks * 0.166);
    const valueGenerated = Math.round(savedHours * 25);
    return { completed_tasks: tasks, saved_hours: savedHours, value_generated: valueGenerated };
  }, [prevTasksQuery.data]);

  // Helper to calculate growth percentage
  const calcGrowth = (current: number, previous: number): string => {
    if (previous === 0 && current === 0) return "0%";
    if (previous === 0) return "+100%";
    const pct = ((current - previous) / previous) * 100;
    return `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%`;
  };

  const metrics = useMemo(() => [
    {
      icon: Clock,
      label: "Tiempo Total Ahorrado",
      value: isLoading ? "..." : `${taskMetrics.saved_hours}h`,
      subtext: "Calculado via AI Tasks",
      change: isLoading ? "—" : calcGrowth(taskMetrics.saved_hours, prevTaskMetrics.saved_hours),
      positive: taskMetrics.saved_hours >= prevTaskMetrics.saved_hours,
    },
    {
      icon: Users,
      label: "Tareas Completadas",
      value: isLoading ? "..." : taskMetrics.completed_tasks.toLocaleString(),
      subtext: "Procesos automatizados",
      change: isLoading ? "—" : calcGrowth(taskMetrics.completed_tasks, prevTaskMetrics.completed_tasks),
      positive: taskMetrics.completed_tasks >= prevTaskMetrics.completed_tasks,
    },
    {
      icon: DollarSign,
      label: "Valor Generado",
      value: isLoading ? "..." : `$${taskMetrics.value_generated.toLocaleString()}`,
      subtext: "Basado en costo/hr promedio",
      change: isLoading ? "—" : calcGrowth(taskMetrics.value_generated, prevTaskMetrics.value_generated),
      positive: taskMetrics.value_generated >= prevTaskMetrics.value_generated,
    },
    {
      icon: TrendingUp,
      label: "Usuarios Activos",
      value: isLoading ? "..." : (activeUsersQuery.data?.monthly_active_users || 0).toLocaleString(),
      subtext: "En el periodo seleccionado",
      change: "—", // Simplified for now
      positive: true,
    },
  ], [isLoading, taskMetrics, prevTaskMetrics, activeUsersQuery.data]);

  const topTemplates = useMemo(() => {
    const productSales = roiByProductQuery.data || [];
    if (productSales.length === 0) {
      return [{ name: "Sin datos disponibles", executions: 0, color: "gray" }];
    }
    const colors = ["cyan", "blue", "purple", "indigo", "violet", "pink", "rose"];
    return productSales.slice(0, 5).map((p, idx) => ({
      name: p.product_name,
      executions: Math.round(p.profit / 10) || 0,
      color: colors[idx % colors.length]
    }));
  }, [roiByProductQuery.data]);

  const zombieUsers = useMemo(() => {
    const churned = usersQuery.data?.churned_users || 0;
    if (churned === 0) return [];
    const entries = [];
    const count = Math.min(churned, 5);
    for (let i = 0; i < count; i++) {
      entries.push({
        email: `usuario-${i + 1}@org`,
        templates: `Inactivo`,
        daysAgo: 30 + i * 5,
        severity: i === 0 ? "high" : "medium",
      });
    }
    return entries;
  }, [usersQuery.data]);

  const weeklyData = useMemo(() => {
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const sales = salesByPeriodQuery.data || [];
    if (sales.length === 0) {
      return dayNames.slice(1).concat(dayNames[0]).map(day => ({ day, hours: 0 }));
    }
    return sales.slice(0, 7).map(entry => {
      const date = new Date(entry.date);
      return {
        day: dayNames[date.getDay()] || entry.date.slice(5),
        hours: Math.round(entry.orders * 0.166 * 10)
      };
    }).reverse();
  }, [salesByPeriodQuery.data]);

  const monthlyData = useMemo(() => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const sales = salesByPeriodQuery.data || [];
    if (sales.length === 0) {
      const now = new Date();
      return Array.from({ length: 6 }, (_, i) => {
        const monthIdx = (now.getMonth() - 5 + i + 12) % 12;
        return { month: monthNames[monthIdx], tasks: 0 };
      });
    }
    const monthMap = new Map<string, number>();
    for (const entry of sales) {
      const monthKey = entry.date.slice(0, 7);
      monthMap.set(monthKey, (monthMap.get(monthKey) || 0) + entry.orders);
    }
    const sorted = Array.from(monthMap.entries()).sort((a, b) => a[0].localeCompare(b[0]));
    return sorted.slice(-6).map(([key, orders]) => {
      const monthIdx = parseInt(key.slice(5, 7)) - 1;
      return { month: monthNames[monthIdx] || key, tasks: orders };
    });
  }, [salesByPeriodQuery.data]);

  const refresh = () => {
    roiQuery.refetch();
    tasksQuery.refetch();
    activeUsersQuery.refetch();
    roiByProductQuery.refetch();
    usersQuery.refetch();
    salesByPeriodQuery.refetch();
  };

  const filterOptions = [
    { value: "week", label: "Esta Semana" },
    { value: "month", label: "Este Mes" },
    { value: "year", label: "Este Año" },
  ];

  return {
    isDark,
    isSuperAdmin,
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
    isLoading,
    refresh,
    exportReport: () => {} // Placeholder for context
  };
};
