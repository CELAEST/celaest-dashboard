import React from "react";
import { motion } from "motion/react";
import { Icon } from "@phosphor-icons/react";
import { StatCard } from "@/features/shared/components/StatCard";

interface Metric {
  icon: Icon;
  label: string;
  value: string;
  subtext: string;
  change: string;
  positive: boolean;
}

interface ROISummaryCardsProps {
  metrics: Metric[];
}

const TimeSavedVisual = () => (
  <svg viewBox="0 0 100 100" className="w-[110px] h-[110px]">
    <motion.g animate={{ y: [-2, 2, -2] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
      <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(34, 211, 238, 0.2)" strokeWidth="1" strokeDasharray="4 4" />
      <motion.circle 
        cx="50" cy="50" r="30" fill="none" stroke="#22d3ee" strokeWidth="2" strokeDasharray="30 20"
        animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "center" }}
      />
      <motion.circle 
        cx="50" cy="50" r="20" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="15 15"
        animate={{ rotate: -360 }} transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "center" }}
      />
      <circle cx="50" cy="50" r="4" fill="#67e8f9" />
      <motion.g
        animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "center" }}
      >
        <rect x="0" y="0" width="100" height="100" fill="transparent" />
        <path d="M 50 50 L 50 20" stroke="#a5f3fc" strokeWidth="2" strokeLinecap="round" />
      </motion.g>
      <circle cx="50" cy="20" r="2.5" fill="#fff" />
      <text x="50" y="8" fill="rgba(34, 211, 238, 0.6)" fontSize="6" fontFamily="monospace" textAnchor="middle">SYS.TIME</text>
    </motion.g>
  </svg>
);

const TasksVisual = () => (
  <svg viewBox="0 0 100 100" className="w-[110px] h-[110px]">
    <motion.g animate={{ y: [-1.5, 1.5, -1.5] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}>
      <path d="M 10 70 L 40 70 L 60 30 L 90 30" fill="none" stroke="rgba(167, 139, 250, 0.3)" strokeWidth="2" strokeLinejoin="round" />
      <path d="M 10 50 L 30 50 L 50 80 L 90 80" fill="none" stroke="rgba(167, 139, 250, 0.2)" strokeWidth="2" strokeLinejoin="round" />
      
      <motion.circle r="3" fill="#c4b5fd"
        animate={{ cx: [10, 40, 60, 90], cy: [70, 70, 30, 30] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
      <motion.circle r="3" fill="#a78bfa"
        animate={{ cx: [10, 30, 50, 90], cy: [50, 50, 80, 80] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "linear", delay: 0.5 }}
      />
      
      <circle cx="40" cy="70" r="4" fill="#8b5cf6" />
      <circle cx="60" cy="30" r="4" fill="#8b5cf6" />
      <circle cx="30" cy="50" r="3" fill="#7c3aed" />
      <circle cx="50" cy="80" r="3" fill="#7c3aed" />
      <text x="80" y="15" fill="rgba(167, 139, 250, 0.6)" fontSize="6" fontFamily="monospace">OP.01</text>
    </motion.g>
  </svg>
);

const ValueVisual = () => (
  <svg viewBox="0 0 100 100" className="w-[110px] h-[110px]">
    <defs>
      <linearGradient id="valueGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#34d399" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#059669" stopOpacity="0.1" />
      </linearGradient>
    </defs>
    <motion.g animate={{ y: [-2, 2, -2] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
      <motion.polygon 
        points="50,10 90,50 50,90 10,50" 
        fill="url(#valueGrad)" 
        stroke="#6ee7b7" 
        strokeWidth="1"
        animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "center" }}
      />
      <motion.polygon 
        points="50,25 75,50 50,75 25,50" 
        fill="none" 
        stroke="#a7f3d0" 
        strokeWidth="1.5"
        strokeDasharray="4 4"
        animate={{ rotate: 180 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "center" }}
      />
      <circle cx="50" cy="50" r="6" fill="#10b981" />
      <circle cx="50" cy="10" r="3.5" fill="#6ee7b7" />
      <circle cx="50" cy="90" r="3.5" fill="#6ee7b7" />
      <circle cx="10" cy="50" r="3.5" fill="#6ee7b7" />
      <circle cx="90" cy="50" r="3.5" fill="#6ee7b7" />
      <text x="10" y="20" fill="rgba(52, 211, 153, 0.6)" fontSize="6" fontFamily="monospace">VAL:MAX</text>
    </motion.g>
  </svg>
);

const UsersVisual = () => (
  <svg viewBox="0 0 100 100" className="w-[110px] h-[110px]">
    <motion.g animate={{ y: [-1.5, 1.5, -1.5] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
      <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(251, 191, 36, 0.2)" strokeWidth="1" />
      <circle cx="50" cy="50" r="25" fill="none" stroke="rgba(251, 191, 36, 0.3)" strokeWidth="1" strokeDasharray="3 3" />
      <circle cx="50" cy="50" r="10" fill="none" stroke="rgba(251, 191, 36, 0.4)" strokeWidth="1" />
      <line x1="10" y1="50" x2="90" y2="50" stroke="rgba(251, 191, 36, 0.2)" strokeWidth="1" />
      <line x1="50" y1="10" x2="50" y2="90" stroke="rgba(251, 191, 36, 0.2)" strokeWidth="1" />
      
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "center" }}
      >
        <rect x="0" y="0" width="100" height="100" fill="transparent" />
        <path d="M 50 50 L 50 10 A 40 40 0 0 1 90 50 Z" fill="rgba(251, 191, 36, 0.15)" />
      </motion.g>
      
      <motion.circle cx="70" cy="30" r="3" fill="#fde68a" stroke="#fbbf24" strokeWidth="1"
        animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }} transition={{ duration: 4, repeat: Infinity, delay: 0.5 }} />
      <motion.circle cx="30" cy="65" r="3.5" fill="#fde68a" stroke="#fbbf24" strokeWidth="1"
        animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }} transition={{ duration: 4, repeat: Infinity, delay: 2.5 }} />
      <motion.circle cx="65" cy="75" r="2.5" fill="#fde68a" stroke="#fbbf24" strokeWidth="1"
        animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }} transition={{ duration: 4, repeat: Infinity, delay: 1.5 }} />
        
      <text x="10" y="90" fill="rgba(251, 191, 36, 0.6)" fontSize="6" fontFamily="monospace">SYNCED</text>
    </motion.g>
  </svg>
);

const VISUALS = [
  <TimeSavedVisual key="time" />,
  <TasksVisual key="tasks" />,
  <ValueVisual key="value" />,
  <UsersVisual key="users" />
];

const GRADIENTS = [
  "from-cyan-400 to-blue-500",
  "from-violet-400 to-purple-500",
  "from-emerald-400 to-teal-500",
  "from-amber-400 to-orange-500"
];

export const ROISummaryCards = React.memo(
  ({ metrics }: ROISummaryCardsProps) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => (
          <StatCard
            key={idx}
            title={metric.label}
            value={metric.value}
            trend={metric.change}
            trendUp={metric.positive}
            icon={<metric.icon />}
            delay={idx * 0.1}
            gradient={GRADIENTS[idx % GRADIENTS.length]}
            visual={VISUALS[idx % VISUALS.length]}
          />
        ))}
      </div>
    );
  },
);

ROISummaryCards.displayName = "ROISummaryCards";
