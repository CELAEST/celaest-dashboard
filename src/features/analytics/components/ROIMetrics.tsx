"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  DollarSign,
  Activity,
  Download,
  AlertTriangle,
  Zap,
  Target,
  BarChart3,
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

interface MetricCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  delay?: number;
}

// Componente CustomTooltip fuera del render
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
  }>;
  isDark: boolean;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  isDark,
}) => {
  if (active && payload && payload.length) {
    return (
      <div
        className={`px-3 py-2 rounded-lg border ${
          isDark
            ? "bg-black/90 border-cyan-500/30 text-white"
            : "bg-white border-gray-200 text-gray-900"
        }`}
      >
        <p className="text-sm font-medium">
          {payload[0].value}{" "}
          {payload[0].dataKey === "hours" ? "horas" : "tareas"}
        </p>
      </div>
    );
  }
  return null;
};

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendUp = true,
  delay = 0,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className={`backdrop-blur-xl border rounded-2xl p-6 relative overflow-hidden group hover:scale-[1.02] transition-all duration-300 ${
        isDark
          ? "bg-[#0a0a0a]/60 border-white/5 hover:border-cyan-500/30"
          : "bg-white border-gray-200 shadow-sm hover:border-blue-300"
      }`}
    >
      <div
        className={`absolute top-0 right-0 w-32 h-32 opacity-10 ${
          isDark ? "text-cyan-400" : "text-blue-500"
        }`}
      >
        {icon}
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              isDark ? "bg-cyan-500/10" : "bg-blue-50"
            }`}
          >
            <div className={isDark ? "text-cyan-400" : "text-blue-600"}>
              {icon}
            </div>
          </div>
          {trend && (
            <div
              className={`flex items-center gap-1 text-sm font-medium ${
                trendUp ? "text-green-400" : "text-orange-400"
              }`}
            >
              <TrendingUp size={16} className={!trendUp ? "rotate-180" : ""} />
              {trend}
            </div>
          )}
        </div>

        <h3
          className={`text-sm font-medium mb-2 ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {title}
        </h3>
        <p
          className={`text-3xl font-bold mb-1 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          {value}
        </p>
        <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>
          {subtitle}
        </p>
      </div>
    </motion.div>
  );
};

export const ROIMetrics: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const isDark = theme === "dark";
  const [timeRange, setTimeRange] = useState("week");
  const [selectedTemplate, setSelectedTemplate] = useState("all");

  // Demo: Super Admin sees all users, regular users see only their data
  const isAdmin = user?.role === "super_admin" || !user;

  // Mock data for charts
  const timeSavedData = [
    { day: "Mon", hours: 12 },
    { day: "Tue", hours: 18 },
    { day: "Wed", hours: 22 },
    { day: "Thu", hours: 15 },
    { day: "Fri", hours: 28 },
    { day: "Sat", hours: 8 },
    { day: "Sun", hours: 5 },
  ];

  const tasksCompletedData = [
    { month: "Jan", tasks: 420 },
    { month: "Feb", tasks: 580 },
    { month: "Mar", tasks: 720 },
    { month: "Apr", tasks: 890 },
    { month: "May", tasks: 1050 },
    { month: "Jun", tasks: 1240 },
  ];

  const templateUsageData = [
    { name: "Excel Automation Pro", value: 450, color: "#22d3ee" },
    { name: "PDF Generator Elite", value: 320, color: "#06b6d4" },
    { name: "Data Analyzer Plus", value: 280, color: "#0891b2" },
    { name: "Report Builder", value: 180, color: "#0e7490" },
    { name: "Email Automator", value: 120, color: "#155e75" },
  ];

  const zombieUsers = [
    { email: "user_1@company.com", lastActive: "45 días atrás", templates: 3 },
    { email: "user_2@company.com", lastActive: "32 días atrás", templates: 2 },
    { email: "user_3@company.com", lastActive: "28 días atrás", templates: 1 },
    { email: "user_4@company.com", lastActive: "19 días atrás", templates: 4 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-end mb-6"
      >
        <div>
          <h1
            className={`text-3xl font-bold mb-2 tracking-tight ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {isAdmin ? "ROI Analytics - Global View" : "Your ROI Dashboard"}
          </h1>
          <p
            className={`${isDark ? "text-gray-400" : "text-gray-500"} text-sm`}
          >
            {isAdmin
              ? "Métricas agregadas de todos los usuarios • Detectando tendencias de uso"
              : "Tu impacto medible • Visualización de valor real generado"}
          </p>
        </div>

        <div className="flex gap-3">
          <select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
              isDark
                ? "bg-black/40 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <option value="all">Todas las Plantillas</option>
            <option value="excel">Excel Automation Pro</option>
            <option value="pdf">PDF Generator Elite</option>
            <option value="data">Data Analyzer Plus</option>
          </select>

          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 border ${
              isDark
                ? "bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border-cyan-500/30 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                : "bg-white hover:bg-gray-50 text-blue-600 border-gray-200 shadow-sm"
            }`}
          >
            <Download size={16} />
            Exportar Reporte
          </button>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Tiempo Total Ahorrado"
          value="108h"
          subtitle="Este mes vs. proceso manual"
          icon={<Clock size={24} />}
          trend="+23%"
          trendUp={true}
          delay={0.1}
        />
        <MetricCard
          title="Tareas Completadas"
          value="1,240"
          subtitle="Ejecuciones exitosas este mes"
          icon={<CheckCircle2 size={24} />}
          trend="+18%"
          trendUp={true}
          delay={0.2}
        />
        <MetricCard
          title="Valor Generado"
          value="$12,450"
          subtitle="Basado en costo/hora promedio"
          icon={<DollarSign size={24} />}
          trend="+31%"
          trendUp={true}
          delay={0.3}
        />
        <MetricCard
          title={isAdmin ? "Usuarios Activos" : "Frecuencia de Uso"}
          value={isAdmin ? "847" : "24/día"}
          subtitle={
            isAdmin
              ? "De 1,200 licencias vendidas"
              : "Promedio de ejecuciones diarias"
          }
          icon={<Activity size={24} />}
          trend={isAdmin ? "71%" : "+5%"}
          trendUp={isAdmin}
          delay={0.4}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Time Saved Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className={`backdrop-blur-xl border rounded-2xl p-6 ${
            isDark
              ? "bg-[#0a0a0a]/60 border-white/5"
              : "bg-white border-gray-200 shadow-sm"
          }`}
        >
          <div className="flex justify-between items-center mb-6">
            <h3
              className={`font-semibold flex items-center gap-2 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              <Clock
                size={18}
                className={isDark ? "text-cyan-400" : "text-blue-600"}
              />
              Tiempo Ahorrado - Última Semana
            </h3>
            <div className="flex gap-2">
              {["week", "month", "year"].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    timeRange === range
                      ? isDark
                        ? "bg-cyan-500/20 text-cyan-400"
                        : "bg-blue-100 text-blue-600"
                      : isDark
                      ? "text-gray-500 hover:text-gray-300"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {range === "week"
                    ? "Semana"
                    : range === "month"
                    ? "Mes"
                    : "Año"}
                </button>
              ))}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={timeSavedData}>
              <defs>
                <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={isDark ? "#22d3ee" : "#3b82f6"}
                    stopOpacity={0.3}
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
                stroke={isDark ? "#ffffff10" : "#e5e7eb"}
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
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorHours)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Tasks Completed Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className={`backdrop-blur-xl border rounded-2xl p-6 ${
            isDark
              ? "bg-[#0a0a0a]/60 border-white/5"
              : "bg-white border-gray-200 shadow-sm"
          }`}
        >
          <h3
            className={`font-semibold mb-6 flex items-center gap-2 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            <CheckCircle2
              size={18}
              className={isDark ? "text-cyan-400" : "text-blue-600"}
            />
            Tareas Completadas - Últimos 6 Meses
          </h3>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={tasksCompletedData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDark ? "#ffffff10" : "#e5e7eb"}
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
        </motion.div>
      </div>

      {/* Template Usage & Zombie Users (Admin Only) */}
      {isAdmin && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Template Usage Distribution */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            className={`backdrop-blur-xl border rounded-2xl p-6 ${
              isDark
                ? "bg-[#0a0a0a]/60 border-white/5"
                : "bg-white border-gray-200 shadow-sm"
            }`}
          >
            <h3
              className={`font-semibold mb-6 flex items-center gap-2 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              <BarChart3
                size={18}
                className={isDark ? "text-cyan-400" : "text-blue-600"}
              />
              Plantillas Más Usadas
            </h3>

            <div className="space-y-4">
              {templateUsageData.map((template, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <span
                      className={`text-sm font-medium ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {template.name}
                    </span>
                    <span
                      className={`text-sm font-mono ${
                        isDark ? "text-cyan-400" : "text-blue-600"
                      }`}
                    >
                      {template.value} ejecuciones
                    </span>
                  </div>
                  <div
                    className={`h-2 rounded-full overflow-hidden ${
                      isDark ? "bg-white/5" : "bg-gray-100"
                    }`}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(template.value / 450) * 100}%` }}
                      transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                      className="h-full rounded-full"
                      style={{
                        backgroundColor: template.color,
                        boxShadow: isDark
                          ? `0 0 10px ${template.color}`
                          : "none",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Zombie Users Alert */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className={`backdrop-blur-xl border rounded-2xl p-6 ${
              isDark
                ? "bg-[#0a0a0a]/60 border-white/5"
                : "bg-white border-gray-200 shadow-sm"
            }`}
          >
            <h3
              className={`font-semibold mb-2 flex items-center gap-2 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              <AlertTriangle size={18} className="text-orange-400" />
              Usuarios Zombie Detectados
            </h3>
            <p
              className={`text-xs mb-4 ${
                isDark ? "text-gray-500" : "text-gray-500"
              }`}
            >
              Compraron pero no ejecutan las plantillas (riesgo de churn)
            </p>

            <div className="space-y-3">
              {zombieUsers.map((user, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    isDark
                      ? "bg-orange-500/5 border-orange-500/20"
                      : "bg-orange-50 border-orange-200"
                  }`}
                >
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {user.email}
                    </p>
                    <p
                      className={`text-xs ${
                        isDark ? "text-gray-500" : "text-gray-500"
                      }`}
                    >
                      {user.templates} plantillas compradas
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-mono text-orange-400">
                      {user.lastActive}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <button
              className={`w-full mt-4 px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 border ${
                isDark
                  ? "bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border-orange-500/30"
                  : "bg-orange-50 hover:bg-orange-100 text-orange-600 border-orange-200"
              }`}
            >
              <Zap size={16} />
              Enviar Recordatorio Automático
            </button>
          </motion.div>
        </div>
      )}

      {/* Success Message for Client View */}
      {!isAdmin && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
          className={`backdrop-blur-xl border rounded-2xl p-8 text-center relative overflow-hidden ${
            isDark
              ? "bg-[#0a0a0a]/60 border-cyan-500/30"
              : "bg-white border-blue-200 shadow-sm"
          }`}
        >
          <div
            className={`absolute inset-0 bg-linear-to-br opacity-5 ${
              isDark ? "from-cyan-500 to-blue-500" : "from-blue-400 to-cyan-400"
            }`}
          />

          <div className="relative z-10">
            <div
              className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                isDark ? "bg-cyan-500/20" : "bg-blue-100"
              }`}
            >
              <Target
                size={32}
                className={isDark ? "text-cyan-400" : "text-blue-600"}
              />
            </div>
            <h3
              className={`text-2xl font-bold mb-2 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              ¡Impacto Extraordinario!
            </h3>
            <p
              className={`text-lg mb-4 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Este mes, tus plantillas te ahorraron{" "}
              <span
                className={`font-bold ${
                  isDark ? "text-cyan-400" : "text-blue-600"
                }`}
              >
                108 horas
              </span>{" "}
              de trabajo manual
            </p>
            <p
              className={`text-sm ${
                isDark ? "text-gray-500" : "text-gray-500"
              }`}
            >
              Eso equivale a <strong>$12,450</strong> en valor generado basado
              en costo/hora promedio
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};
