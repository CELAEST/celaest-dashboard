"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  TrendingUp,
  Clock,
  Users,
  DollarSign,
  Download,
  AlertTriangle,
  ChevronDown,
  Check,
} from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
  }>;
  label?: string;
  isDark: boolean;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
  isDark,
}) => {
  if (active && payload && payload.length) {
    return (
      <div
        className={`p-3 rounded-xl border shadow-xl backdrop-blur-md ${
          isDark
            ? "bg-black/80 border-cyan-500/20 shadow-cyan-900/10"
            : "bg-white/95 border-blue-100 shadow-blue-500/5"
        }`}
      >
        <p
          className={`text-xs font-semibold mb-1.5 ${
            isDark ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {label}
        </p>
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              isDark ? "bg-cyan-400" : "bg-blue-500"
            }`}
          />
          <span
            className={`text-lg font-bold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {payload[0].value}
          </span>
          <span
            className={`text-xs font-medium ${
              isDark ? "text-cyan-200/70" : "text-blue-600/70"
            }`}
          >
            {payload[0].dataKey === "hours" ? "horas" : "tareas"}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export const ROIMetrics: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const isDark = theme === "dark";
  const [timeRange, setTimeRange] = useState("week");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");

  const filterOptions = [
    { value: "all", label: "Todas las Plantillas" },
    { value: "top10", label: "Top 10" },
    { value: "custom", label: "Custom Range" },
  ];

  const isAdmin = user?.role === "super_admin" || !user;

  const metrics = [
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
  ];

  const topTemplates = [
    { name: "Excel Automation Pro", executions: 458, color: "cyan" },
    { name: "PDF Generator Elite", executions: 328, color: "blue" },
    { name: "Data Analyzer Plus", executions: 288, color: "purple" },
    { name: "Report Builder", executions: 180, color: "indigo" },
    { name: "Email Automator", executions: 128, color: "violet" },
  ];

  const zombieUsers = [
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
  ];

  const weeklyData = [
    { day: "Mon", hours: 15 },
    { day: "Tue", hours: 18 },
    { day: "Wed", hours: 21 },
    { day: "Thu", hours: 25 },
    { day: "Fri", hours: 23 },
    { day: "Sat", hours: 19 },
    { day: "Sun", hours: 8 },
  ];

  const monthlyData = [
    { month: "Jan", tasks: 350 },
    { month: "Feb", tasks: 620 },
    { month: "Mar", tasks: 780 },
    { month: "Apr", tasks: 920 },
    { month: "May", tasks: 1050 },
    { month: "Jun", tasks: 1400 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className={`text-4xl font-bold tracking-tight mb-2 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            ROI Analytics - Global View
          </h1>
          <p
            className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            Métricas agregadas de todos los usuarios • Detectando tendencias de
            uso
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all duration-300 outline-none ${
                isDark
                  ? "bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20"
                  : "bg-blue-500/10 border border-blue-500/20 text-blue-600 hover:bg-blue-500/20"
              }`}
            >
              <span>
                {
                  filterOptions.find((opt) => opt.value === selectedFilter)
                    ?.label
                }
              </span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-300 ${
                  isFilterOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {isFilterOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsFilterOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={`absolute right-0 top-full mt-2 w-56 rounded-xl border shadow-xl overflow-hidden z-50 ${
                      isDark
                        ? "bg-black/90 border-cyan-500/20 backdrop-blur-xl"
                        : "bg-white border-blue-100"
                    }`}
                  >
                    <div className="p-1.5 flex flex-col gap-0.5">
                      {filterOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSelectedFilter(option.value);
                            setIsFilterOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                            selectedFilter === option.value
                              ? isDark
                                ? "bg-cyan-500/10 text-cyan-400"
                                : "bg-blue-50 text-blue-600"
                              : isDark
                                ? "text-gray-400 hover:bg-white/5 hover:text-white"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          }`}
                        >
                          {option.label}
                          {selectedFilter === option.value && (
                            <Check className="w-4 h-4" />
                          )}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
          <button
            className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-2 ${
              isDark
                ? "bg-linear-to-r from-cyan-400 to-blue-500 text-white shadow-lg shadow-cyan-500/50"
                : "bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
            }`}
          >
            <Download className="w-4 h-4" />
            Exportar Reporte
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {metrics.map((metric, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`group relative overflow-hidden rounded-2xl p-6 transition-all duration-500 hover:scale-105 cursor-pointer ${
              isDark
                ? "bg-black/40 backdrop-blur-xl border border-white/10 hover:border-white/20"
                : "bg-white border border-gray-200 shadow-sm hover:shadow-xl"
            }`}
          >
            {/* Glow Effect */}
            <div
              className={`absolute -inset-1 bg-linear-to-br from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`}
            />

            <div className="relative">
              {/* Icon */}
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ${
                    isDark
                      ? "bg-linear-to-br from-cyan-400/20 to-blue-500/20 text-cyan-400 shadow-lg shadow-cyan-500/30"
                      : "bg-linear-to-br from-blue-500/20 to-indigo-500/20 text-blue-600"
                  }`}
                >
                  <metric.icon className="w-6 h-6" strokeWidth={2.5} />
                </div>
                <div
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${
                    isDark
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-emerald-500/10 text-emerald-600"
                  }`}
                >
                  <TrendingUp className="w-3 h-3" />
                  {metric.change}
                </div>
              </div>

              {/* Content */}
              <div
                className={`text-xs font-semibold tracking-wider mb-2 ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {metric.label}
              </div>
              <div
                className={`text-4xl font-bold tracking-tight mb-2 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {metric.value}
              </div>
              <div
                className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}
              >
                {metric.subtext}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Time Saved - Area Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl ${
            isDark
              ? "bg-black/40 backdrop-blur-xl border border-white/10"
              : "bg-white border border-gray-200 shadow-sm"
          }`}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div
                  className={`w-2 h-2 rounded-full animate-pulse ${
                    isDark ? "bg-cyan-400" : "bg-blue-500"
                  }`}
                />
                <h3
                  className={`font-semibold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Tiempo Ahorrado - Última Semana
                </h3>
              </div>
              <div
                className={`flex bg-transparent p-1 gap-1 rounded-lg ${
                  isDark ? "bg-white/5 border border-white/5" : "bg-gray-100/50"
                }`}
              >
                {["Semana", "Mes", "Año"].map((period) => {
                  const isSelected =
                    (timeRange === "week" && period === "Semana") ||
                    (timeRange === "month" && period === "Mes") ||
                    (timeRange === "year" && period === "Año");

                  return (
                    <button
                      key={period}
                      onClick={() =>
                        setTimeRange(
                          period === "Semana"
                            ? "week"
                            : period === "Mes"
                              ? "month"
                              : "year",
                        )
                      }
                      className="relative px-3 py-1.5 text-xs font-bold outline-none transition-colors"
                    >
                      {isSelected && (
                        <motion.div
                          layoutId="active-period"
                          className={`absolute inset-0 rounded-md shadow-sm ${
                            isDark ? "bg-cyan-500/20" : "bg-white"
                          }`}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                          }}
                        />
                      )}
                      <span
                        className={`relative z-10 transition-colors duration-200 ${
                          isSelected
                            ? isDark
                              ? "text-cyan-400"
                              : "text-blue-600"
                            : isDark
                              ? "text-gray-400 hover:text-gray-300"
                              : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        {period}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={isDark ? "#22d3ee" : "#3b82f6"}
                      stopOpacity={0.4}
                    />
                    <stop
                      offset="95%"
                      stopColor={isDark ? "#22d3ee" : "#3b82f6"}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={isDark ? "rgba(255,255,255,0.05)" : "#e5e7eb"}
                />
                <XAxis
                  dataKey="day"
                  stroke={isDark ? "#64748b" : "#9ca3af"}
                  style={{ fontSize: "12px" }}
                />
                <YAxis
                  stroke={isDark ? "#64748b" : "#9ca3af"}
                  style={{ fontSize: "12px" }}
                />
                <Tooltip content={<CustomTooltip isDark={isDark} />} />
                <Area
                  type="monotone"
                  dataKey="hours"
                  stroke={isDark ? "#22d3ee" : "#3b82f6"}
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorHours)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Monthly Completed Tasks - Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl ${
            isDark
              ? "bg-black/40 backdrop-blur-xl border border-white/10"
              : "bg-white border border-gray-200 shadow-sm"
          }`}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div
                  className={`w-2 h-2 rounded-full animate-pulse ${
                    isDark ? "bg-cyan-400" : "bg-blue-500"
                  }`}
                />
                <h3
                  className={`font-semibold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Tareas Completadas - Últimos 6 Meses
                </h3>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={isDark ? "rgba(255,255,255,0.05)" : "#e5e7eb"}
                />
                <XAxis
                  dataKey="month"
                  stroke={isDark ? "#64748b" : "#9ca3af"}
                  style={{ fontSize: "12px" }}
                />
                <YAxis
                  stroke={isDark ? "#64748b" : "#9ca3af"}
                  style={{ fontSize: "12px" }}
                />
                <Tooltip content={<CustomTooltip isDark={isDark} />} />
                <Bar
                  dataKey="tasks"
                  fill={isDark ? "#22d3ee" : "#3b82f6"}
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Bottom Section */}
      {isAdmin && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Templates */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className={`rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl ${
              isDark
                ? "bg-black/40 backdrop-blur-xl border border-white/10"
                : "bg-white border border-gray-200 shadow-sm"
            }`}
          >
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isDark ? "bg-cyan-400" : "bg-blue-500"
                  }`}
                />
                <h3
                  className={`font-semibold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Plantillas Más Usadas
                </h3>
              </div>

              <div className="space-y-4">
                {topTemplates.map((template, idx) => (
                  <div key={idx} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-sm font-medium ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {template.name}
                      </span>
                      <span
                        className={`text-sm font-bold ${
                          isDark ? "text-cyan-400" : "text-blue-600"
                        }`}
                      >
                        {template.executions} ejecuciones
                      </span>
                    </div>
                    <div
                      className={`h-2.5 rounded-full overflow-hidden ${
                        isDark ? "bg-white/5" : "bg-gray-100"
                      }`}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${(template.executions / 458) * 100}%`,
                        }}
                        transition={{ delay: 0.7 + idx * 0.1, duration: 0.8 }}
                        className={`h-full rounded-full ${
                          isDark
                            ? "bg-linear-to-r from-cyan-400 to-blue-500"
                            : "bg-linear-to-r from-blue-500 to-indigo-500"
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Zombie Users */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className={`rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl ${
              isDark
                ? "bg-black/40 backdrop-blur-xl border border-white/10"
                : "bg-white border border-gray-200 shadow-sm"
            }`}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                  <h3
                    className={`font-semibold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Usuarios Zombie Detectados
                  </h3>
                </div>
              </div>

              <p
                className={`text-sm mb-6 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Compraron pero no ejecutan las plantillas (riesgo de churn)
              </p>

              <div className="space-y-3 mb-6">
                {zombieUsers.map((user, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + idx * 0.1 }}
                    className={`p-4 rounded-xl transition-all duration-300 hover:scale-[1.02] ${
                      isDark
                        ? "bg-white/5 border border-white/5 hover:border-orange-500/20"
                        : "bg-gray-50 border border-gray-200 hover:border-orange-500/20"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div
                          className={`text-sm font-semibold mb-1 ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {user.email}
                        </div>
                        <div
                          className={`text-xs ${
                            isDark ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {user.templates}
                        </div>
                      </div>
                      <div
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                          user.severity === "high"
                            ? "bg-red-500/10 text-red-400 border border-red-500/20"
                            : user.severity === "medium"
                              ? "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                              : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                        }`}
                      >
                        {user.daysAgo} días atrás
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <button
                className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  isDark
                    ? "bg-linear-to-r from-orange-500/20 to-red-500/20 text-orange-400 border border-orange-500/20 hover:border-orange-500/40"
                    : "bg-linear-to-r from-orange-500/10 to-red-500/10 text-orange-600 border border-orange-500/20 hover:border-orange-500/40"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Enviar Recordatorio Automático
                </div>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
