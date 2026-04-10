import { useState, useMemo } from "react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useRole } from "@/features/auth/hooks/useAuthorization";
import { useApiAuth } from "@/lib/use-api-auth";
import {
  Clock,
  Users,
  CurrencyDollar,
  TrendUp,
} from "@phosphor-icons/react";
import {
  useROIQuery,
  useROIByProductQuery,
  useSalesByPeriodQuery,
  useTasksQuery,
  useActiveUsersQuery,
  useUsersQuery
} from "./useROIQuery";

type TimeRange = "week" | "month" | "year";

type SalesEntry = {
  date: string;
  orders: number;
};

const DAY_LABELS = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];
const MONTH_LABELS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

function toStartOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

function addMonths(date: Date, months: number) {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

function getLatestSalesDate(sales: SalesEntry[]) {
  if (sales.length === 0) {
    return toStartOfDay(new Date());
  }

  const timestamps = sales
    .map((entry) => new Date(entry.date).getTime())
    .filter((value) => Number.isFinite(value));

  return timestamps.length > 0
    ? toStartOfDay(new Date(Math.max(...timestamps)))
    : toStartOfDay(new Date());
}

function dateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function toHours(orders: number) {
  return Math.round(orders * 0.166);
}

function buildDailyOrdersMap(sales: SalesEntry[]) {
  const map = new Map<string, number>();

  for (const entry of sales) {
    const key = dateKey(new Date(entry.date));
    map.set(key, (map.get(key) || 0) + entry.orders);
  }

  return map;
}

function buildMonthlyOrdersMap(sales: SalesEntry[]) {
  const map = new Map<string, number>();

  for (const entry of sales) {
    const currentDate = new Date(entry.date);
    const key = monthKey(currentDate);
    map.set(key, (map.get(key) || 0) + entry.orders);
  }

  return map;
}

function buildWeeklySeries(sales: SalesEntry[]) {
  const ordersByDay = buildDailyOrdersMap(sales);
  const endDate = getLatestSalesDate(sales);

  return Array.from({ length: 7 }, (_, index) => {
    const currentDate = addDays(endDate, index - 6);
    const orders = ordersByDay.get(dateKey(currentDate)) || 0;
    return {
      label: DAY_LABELS[currentDate.getDay()],
      hours: toHours(orders),
    };
  });
}

function buildMonthlyTimeSavedSeries(sales: SalesEntry[]) {
  const ordersByDay = buildDailyOrdersMap(sales);
  const endDate = getLatestSalesDate(sales);

  return Array.from({ length: 4 }, (_, index) => {
    const bucketStart = addDays(endDate, -27 + index * 7);
    let orders = 0;

    for (let offset = 0; offset < 7; offset += 1) {
      const currentDate = addDays(bucketStart, offset);
      orders += ordersByDay.get(dateKey(currentDate)) || 0;
    }

    return {
      label: `S${index + 1}`,
      hours: toHours(orders),
    };
  });
}

function buildYearlyTimeSavedSeries(sales: SalesEntry[]) {
  const ordersByMonth = buildMonthlyOrdersMap(sales);
  const endDate = new Date(getLatestSalesDate(sales).getFullYear(), getLatestSalesDate(sales).getMonth(), 1);

  return Array.from({ length: 12 }, (_, index) => {
    const currentMonth = addMonths(endDate, index - 11);
    const orders = ordersByMonth.get(monthKey(currentMonth)) || 0;

    return {
      label: MONTH_LABELS[currentMonth.getMonth()],
      hours: toHours(orders),
    };
  });
}

function buildSixMonthTaskSeries(sales: SalesEntry[]) {
  const ordersByMonth = buildMonthlyOrdersMap(sales);
  const endDate = new Date(getLatestSalesDate(sales).getFullYear(), getLatestSalesDate(sales).getMonth(), 1);

  return Array.from({ length: 6 }, (_, index) => {
    const currentMonth = addMonths(endDate, index - 5);
    const orders = ordersByMonth.get(monthKey(currentMonth)) || 0;

    return {
      label: MONTH_LABELS[currentMonth.getMonth()],
      tasks: orders,
    };
  });
}

export const useROIMetrics = () => {
  const { theme } = useTheme();
  // useApiAuth uses a selector on OrgStore (only re-renders when currentOrg.id changes)
  // instead of subscribing to the full store (which re-renders on isLoading, orgs[], etc.)
  const { token: rawToken, orgId: rawOrgId } = useApiAuth();
  const { isSuperAdmin } = useRole();
  const token = rawToken || "";
  const orgId = rawOrgId || "";

  const isDark = theme === "dark";

  const [timeRange, setTimeRange] = useState<TimeRange>("week");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const selectedFilter = timeRange;
  const setSelectedFilter = (filter: string) => setTimeRange(filter as TimeRange);

  // Determine periods for comparison (Logic from legacy)
  const prevPeriod = timeRange === "week" ? "month" : timeRange === "month" ? "year" : "year";

  // TanStack Queries
  const roiQuery = useROIQuery(token, orgId, timeRange);
  const tasksQuery = useTasksQuery(token, orgId, timeRange);
  const activeUsersQuery = useActiveUsersQuery(token, orgId);
  const roiByProductQuery = useROIByProductQuery(token, orgId);
  const usersQuery = useUsersQuery(token, orgId, timeRange);
  const timeSavedSalesQuery = useSalesByPeriodQuery(token, orgId, timeRange);
  const sixMonthSalesQuery = useSalesByPeriodQuery(token, orgId, "year");
  
  // Previous Period Queries for growth calculation
  const prevTasksQuery = useTasksQuery(token, orgId, prevPeriod);

  const isLoading = 
    roiQuery.isLoading || 
    tasksQuery.isLoading || 
    activeUsersQuery.isLoading || 
    roiByProductQuery.isLoading ||
    usersQuery.isLoading ||
    timeSavedSalesQuery.isLoading ||
    sixMonthSalesQuery.isLoading;

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
      icon: CurrencyDollar,
      label: "Valor Generado",
      value: isLoading ? "..." : `$${taskMetrics.value_generated.toLocaleString()}`,
      subtext: "Basado en costo/hr promedio",
      change: isLoading ? "—" : calcGrowth(taskMetrics.value_generated, prevTaskMetrics.value_generated),
      positive: taskMetrics.value_generated >= prevTaskMetrics.value_generated,
    },
    {
      icon: TrendUp,
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

  const timeSavedData = useMemo(() => {
    const sales = (timeSavedSalesQuery.data || []) as SalesEntry[];

    if (timeRange === "week") {
      return buildWeeklySeries(sales);
    }

    if (timeRange === "month") {
      return buildMonthlyTimeSavedSeries(sales);
    }

    return buildYearlyTimeSavedSeries(sales);
  }, [timeSavedSalesQuery.data, timeRange]);

  const monthlyData = useMemo(() => {
    const sales = (sixMonthSalesQuery.data || []) as SalesEntry[];
    return buildSixMonthTaskSeries(sales);
  }, [sixMonthSalesQuery.data]);

  const refresh = () => {
    roiQuery.refetch();
    tasksQuery.refetch();
    activeUsersQuery.refetch();
    roiByProductQuery.refetch();
    usersQuery.refetch();
    timeSavedSalesQuery.refetch();
    sixMonthSalesQuery.refetch();
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
    timeSavedData,
    monthlyData,
    isLoading,
    refresh,
    exportReport: () => {} // Placeholder for context
  };
};
