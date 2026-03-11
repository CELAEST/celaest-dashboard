import React from "react";
import { StatCard } from "@/features/shared/components/StatCard";
import { Warning, UsersThree, Clock } from "@phosphor-icons/react";

interface ErrorStatsProps {
  stats: {
    criticalCount: number;
    warningCount: number;
    resolvedCount: number;
    totalAffectedUsers: number;
    mttr: string;
  };
}

function buildSparkline(value: number, pattern: number[]) {
  if (!Number.isFinite(value) || value <= 0) {
    return pattern.map(() => ({ value: 0 }));
  }

  return pattern.map((multiplier) => ({
    value: Math.max(1, Math.round(value * multiplier)),
  }));
}

export const ErrorStats = React.memo(({ stats }: ErrorStatsProps) => {
  const criticalHealthy = stats.criticalCount === 0;
  const warningHealthy = stats.warningCount === 0;
  const impactHealthy = stats.totalAffectedUsers === 0;
  const mttrMinutes = stats.mttr === "N/A" ? 0 : Number.parseInt(stats.mttr, 10);
  const mttrHealthy = mttrMinutes === 0 || mttrMinutes <= 30;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="CRÍTICO"
        value={stats.criticalCount.toString()}
        trend={criticalHealthy ? "Estable" : "Requiere atención"}
        trendUp={criticalHealthy}
        icon={<Warning />}
        gradient={criticalHealthy ? "from-emerald-500 to-teal-600" : "from-red-600 to-rose-600"}
        delay={0.1}
        chartData={buildSparkline(stats.criticalCount, [0.35, 0.48, 0.4, 0.66, 0.84, 0.72, 1])}
      />
      <StatCard
        title="ADVERTENCIA"
        value={stats.warningCount.toString()}
        trend={warningHealthy ? "Sin cola" : "Pendiente"}
        trendUp={warningHealthy}
        icon={<Warning />}
        gradient={warningHealthy ? "from-emerald-500 to-teal-600" : "from-amber-500 to-orange-600"}
        delay={0.2}
        chartData={buildSparkline(stats.warningCount, [0.42, 0.5, 0.46, 0.7, 0.66, 0.82, 1])}
      />
      <StatCard
        title="USUARIOS AFECTADOS"
        value={stats.totalAffectedUsers.toString()}
        trend={impactHealthy ? "Impacto nulo" : "Usuarios impactados"}
        trendUp={impactHealthy}
        icon={<UsersThree />}
        gradient={impactHealthy ? "from-emerald-500 to-teal-600" : "from-cyan-500 to-blue-600"}
        delay={0.3}
        chartData={buildSparkline(stats.totalAffectedUsers, [0.38, 0.46, 0.58, 0.72, 0.8, 0.9, 1])}
      />
      <StatCard
        title="MTTR"
        value={stats.mttr}
        trend={mttrMinutes === 0 ? "Sin datos" : "Tiempo medio"}
        trendUp={mttrHealthy}
        icon={<Clock />}
        gradient={mttrHealthy ? "from-blue-600 to-cyan-600" : "from-amber-500 to-orange-600"}
        delay={0.4}
        chartData={buildSparkline(mttrMinutes, [1.3, 1.22, 1.16, 1.1, 1.05, 1.02, 1])}
      />
    </div>
  );
});

ErrorStats.displayName = "ErrorStats";
