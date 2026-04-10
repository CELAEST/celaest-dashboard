import React from "react";
import { motion } from "motion/react";
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

const CriticalVisual = () => (
  <svg viewBox="0 0 100 100" className="w-[110px] h-[110px]">
    <defs>
      <linearGradient id="critGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#991b1b" stopOpacity="0.1" />
      </linearGradient>
    </defs>
    <motion.g animate={{ y: [-1.5, 1.5, -1.5] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
      <motion.g
        animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "center" }}
      >
        <rect x="0" y="0" width="100" height="100" fill="transparent" />
        <polygon points="50,15 80,32 80,68 50,85 20,68 20,32" fill="url(#critGrad)" stroke="#fca5a5" strokeWidth="1" />
      </motion.g>
      <motion.polygon 
        points="50,25 70,36 70,64 50,75 30,64 30,36" 
        fill="none" 
        stroke="#f87171" 
        strokeWidth="1.5"
        strokeDasharray="4 4"
        animate={{ rotate: 180 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "center" }}
      />
      <circle cx="50" cy="50" r="8" fill="#ef4444" />
      <motion.circle cx="50" cy="50" r="16" fill="none" stroke="#fca5a5" strokeWidth="1" strokeDasharray="2 4"
        animate={{ rotate: -360 }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "center" }}
      />
      <text x="10" y="20" fill="rgba(239, 68, 68, 0.6)" fontSize="6" fontFamily="monospace">LVL:CRIT</text>
    </motion.g>
  </svg>
);

const WarningVisual = () => (
  <svg viewBox="0 0 100 100" className="w-[110px] h-[110px]">
    <motion.g animate={{ y: [-2, 2, -2] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}>
      <motion.polygon 
        points="50,20 85,80 15,80" 
        fill="rgba(245, 158, 11, 0.15)" 
        stroke="#fbbf24" 
        strokeWidth="1.5"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "center" }}
      />
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "center" }}
      >
        <rect x="0" y="0" width="100" height="100" fill="transparent" />
        <circle cx="50" cy="60" r="25" fill="none" stroke="#fcd34d" strokeWidth="1" strokeDasharray="5 5" />
      </motion.g>
      <circle cx="50" cy="65" r="4" fill="#fbbf24" />
      <rect x="48" y="45" width="4" height="14" fill="#fbbf24" rx="2" />
      <text x="75" y="25" fill="rgba(245, 158, 11, 0.6)" fontSize="6" fontFamily="monospace">WARN:01</text>
    </motion.g>
  </svg>
);

const UsersAffectedVisual = () => (
  <svg viewBox="0 0 100 100" className="w-[110px] h-[110px]">
    <motion.g animate={{ y: [-1.5, 1.5, -1.5] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
      <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(139, 92, 246, 0.2)" strokeWidth="1" />
      <circle cx="50" cy="50" r="25" fill="none" stroke="rgba(139, 92, 246, 0.3)" strokeWidth="1" strokeDasharray="3 3" />
      <circle cx="50" cy="50" r="10" fill="none" stroke="rgba(139, 92, 246, 0.4)" strokeWidth="1" />
      
      {/* Central node ping */}
      <motion.circle cx="50" cy="50" r="12" fill="none" stroke="#a78bfa" strokeWidth="2"
        animate={{ r: [12, 40], opacity: [0.8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
      />
      
      {/* Disrupted node 1 */}
      <motion.g animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 0 }}>
        <circle cx="25" cy="40" r="4" fill="#c4b5fd" />
        <line x1="50" y1="50" x2="25" y2="40" stroke="#8b5cf6" strokeWidth="1" strokeDasharray="2 2" />
      </motion.g>

      {/* Disrupted node 2 */}
      <motion.g animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, ease: "linear", delay: 0.5 }}>
        <circle cx="65" cy="75" r="4" fill="#c4b5fd" />
        <line x1="50" y1="50" x2="65" y2="75" stroke="#8b5cf6" strokeWidth="1" strokeDasharray="2 2" />
      </motion.g>

      {/* Disrupted node 3 */}
      <motion.g animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.8, repeat: Infinity, ease: "linear", delay: 0.8 }}>
        <circle cx="75" cy="25" r="4" fill="#c4b5fd" />
        <line x1="50" y1="50" x2="75" y2="25" stroke="#8b5cf6" strokeWidth="1" strokeDasharray="2 2" />
      </motion.g>

      <text x="10" y="90" fill="rgba(139, 92, 246, 0.6)" fontSize="6" fontFamily="monospace">NODE.ERR</text>
    </motion.g>
  </svg>
);

const MTTRVisual = () => (
  <svg viewBox="0 0 100 100" className="w-[110px] h-[110px]">
    <motion.g animate={{ y: [-2, 2, -2] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
      <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(14, 165, 233, 0.2)" strokeWidth="1" strokeDasharray="4 4" />
      <motion.circle 
        cx="50" cy="50" r="30" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="30 20"
        animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "center" }}
      />
      <motion.circle 
        cx="50" cy="50" r="20" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="15 15"
        animate={{ rotate: -360 }} transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "center" }}
      />
      <circle cx="50" cy="50" r="4" fill="#7dd3fc" />
      <motion.g
        animate={{ rotate: 360 }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "center" }}
      >
        <rect x="0" y="0" width="100" height="100" fill="transparent" />
        <path d="M 50 50 L 50 20" stroke="#bae6fd" strokeWidth="2" strokeLinecap="round" />
        <circle cx="50" cy="20" r="2" fill="#fff" />
      </motion.g>
      <text x="50" y="8" fill="rgba(14, 165, 233, 0.6)" fontSize="6" fontFamily="monospace" textAnchor="middle">MTTR.SYS</text>
    </motion.g>
  </svg>
);

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
        visual={<CriticalVisual />}
      />
      <StatCard
        title="ADVERTENCIA"
        value={stats.warningCount.toString()}
        trend={warningHealthy ? "Sin cola" : "Pendiente"}
        trendUp={warningHealthy}
        icon={<Warning />}
        gradient={warningHealthy ? "from-emerald-500 to-teal-600" : "from-amber-500 to-orange-600"}
        delay={0.2}
        visual={<WarningVisual />}
      />
      <StatCard
        title="USUARIOS AFECTADOS"
        value={stats.totalAffectedUsers.toString()}
        trend={impactHealthy ? "Impacto nulo" : "Usuarios impactados"}
        trendUp={impactHealthy}
        icon={<UsersThree />}
        gradient={impactHealthy ? "from-emerald-500 to-teal-600" : "from-violet-500 to-purple-600"}
        delay={0.3}
        visual={<UsersAffectedVisual />}
      />
      <StatCard
        title="MTTR"
        value={stats.mttr}
        trend={mttrMinutes === 0 ? "Sin datos" : "Tiempo medio"}
        trendUp={mttrHealthy}
        icon={<Clock />}
        gradient={mttrHealthy ? "from-blue-500 to-cyan-600" : "from-amber-500 to-orange-600"}
        delay={0.4}
        visual={<MTTRVisual />}
      />
    </div>
  );
});

ErrorStats.displayName = "ErrorStats";
