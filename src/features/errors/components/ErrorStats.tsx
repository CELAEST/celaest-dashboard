import React from "react";
import { StatCard } from "@/features/shared/components/StatCard";
import { AlertTriangle, AlertCircle, CheckCircle2, Clock } from "lucide-react";

interface ErrorStatsProps {
  stats: {
    criticalCount: number;
    warningCount: number;
    resolvedCount: number;
    totalAffectedUsers: number;
    mttr: string;
  };
}

export const ErrorStats = React.memo(({ stats }: ErrorStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="CRÍTICO"
        value={stats.criticalCount.toString()}
        trend="Requiere Atención"
        trendUp={false}
        icon={<AlertTriangle />}
        gradient="from-red-600 to-rose-600"
        delay={0.1}
        chartData={[
          { value: 2 },
          { value: 5 },
          { value: 3 },
          { value: 8 },
          { value: 12 },
          { value: 5 },
          { value: stats.criticalCount },
        ]}
      />
      <StatCard
        title="ADVERTENCIA"
        value={stats.warningCount.toString()}
        trend="Pendiente"
        trendUp={false}
        icon={<AlertCircle />}
        gradient="from-amber-500 to-orange-600"
        delay={0.2}
        chartData={[
          { value: 10 },
          { value: 15 },
          { value: 12 },
          { value: 20 },
          { value: 18 },
          { value: 25 },
          { value: stats.warningCount },
        ]}
      />
      <StatCard
        title="USUARIOS AFECTADOS"
        value={stats.totalAffectedUsers.toString()}
        trend="Total Global"
        trendUp={true}
        icon={<CheckCircle2 />}
        gradient="from-emerald-500 to-teal-600"
        delay={0.3}
        chartData={[
          { value: 100 },
          { value: 120 },
          { value: 150 },
          { value: 180 },
          { value: 210 },
          { value: 250 },
          { value: stats.totalAffectedUsers },
        ]}
      />
      <StatCard
        title="MTTR"
        value={stats.mttr}
        trend="Eficiencia +12%"
        trendUp={true}
        icon={<Clock />}
        gradient="from-blue-600 to-cyan-600"
        delay={0.4}
        chartData={[
          { value: 60 },
          { value: 55 },
          { value: 50 },
          { value: 48 },
          { value: 45 },
          { value: stats.mttr === "0m" ? 0 : parseInt(stats.mttr) },
        ]}
      />
    </div>
  );
});

ErrorStats.displayName = "ErrorStats";
