"use client";

import React from "react";
import { GitBranch, TrendUp, Users, Warning } from "@phosphor-icons/react";
import { StatCard } from "@/features/shared/components/StatCard";
import { motion } from "motion/react";
import { BackendReleaseMetrics } from "@/features/assets/api/assets.api";

const TotalReleasesVisual = () => (
  <svg viewBox="0 0 100 100" className="w-[110px] h-[110px]">
    <motion.g animate={{ y: [-2, 2, -2] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
      {/* Central Trunk */}
      <path d="M 20 80 L 20 20" fill="none" stroke="#22d3ee" strokeWidth="2" strokeDasharray="2 2" />
      <motion.path 
        d="M 20 80 L 20 20" 
        fill="none" 
        stroke="#06b6d4" 
        strokeWidth="2"
        initial={{ strokeDashoffset: 100, strokeDasharray: "100 100" }}
        animate={{ strokeDashoffset: 0 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
      <circle cx="20" cy="80" r="4" fill="#0891b2" />
      <circle cx="20" cy="20" r="4" fill="#67e8f9" />

      {/* Branch 1 */}
      <path d="M 20 60 C 50 60, 50 40, 80 40" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="1 3" />
      <motion.path 
        d="M 20 60 C 50 60, 50 40, 80 40" 
        fill="none" 
        stroke="#60a5fa" 
        strokeWidth="1.5"
        initial={{ strokeDashoffset: 100, strokeDasharray: "100 100" }}
        animate={{ strokeDashoffset: 0 }}
        transition={{ duration: 2.5, repeat: Infinity, delay: 0.5, ease: "easeInOut" }}
      />
      <circle cx="80" cy="40" r="3" fill="#93c5fd" />

      {/* Branch 2 */}
      <path d="M 20 40 C 60 40, 60 70, 90 70" fill="none" stroke="#6366f1" strokeWidth="1" strokeDasharray="1 2" />
      <motion.path 
        d="M 20 40 C 60 40, 60 70, 90 70" 
        fill="none" 
        stroke="#818cf8" 
        strokeWidth="1"
        initial={{ strokeDashoffset: -100, strokeDasharray: "100 100" }}
        animate={{ strokeDashoffset: 0 }}
        transition={{ duration: 3, repeat: Infinity, delay: 1, ease: "easeInOut" }}
      />
      <circle cx="90" cy="70" r="3" fill="#c7d2fe" />
    </motion.g>
  </svg>
);

const AdoptionRateVisual = () => (
  <svg viewBox="0 0 100 100" className="w-[110px] h-[110px]">
    <defs>
      <linearGradient id="adoptionGradient" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#c084fc" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#e879f9" stopOpacity="1" />
      </linearGradient>
    </defs>
    <motion.g animate={{ y: [-1, 1, -1] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}>
      <path d="M 0 50 Q 25 20, 50 50 T 100 50" fill="none" stroke="rgba(192,132,252,0.2)" strokeWidth="4" strokeLinecap="round" />
      <motion.path 
        d="M 0 50 Q 25 20, 50 50 T 100 50" 
        fill="none" 
        stroke="url(#adoptionGradient)" 
        strokeWidth="4" 
        strokeLinecap="round"
        initial={{ strokeDashoffset: 150, strokeDasharray: "150 150" }}
        animate={{ strokeDashoffset: 0 }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      {[10, 30, 50, 70, 90].map((x, i) => (
        <motion.circle 
          key={i} 
          cx={x} 
          cy={50 + Math.sin((x/100) * Math.PI * 2) * 25} 
          r={2} 
          fill="#f0abfc" 
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </motion.g>
  </svg>
);

const ActiveVersionsVisual = () => (
  <svg viewBox="0 0 100 100" className="w-[110px] h-[110px]">
    <motion.g animate={{ y: [-2, 2, -2] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
      {[0, 1, 2].map((i) => (
        <motion.g 
          key={i} 
          transform={`translate(0, ${i * 15})`}
          animate={{ y: [i*15, i*15 - 5, i*15] }}
          transition={{ duration: 3, repeat: Infinity, delay: i * 0.4, ease: "easeInOut" }}
        >
          <polygon points="50,20 85,35 50,50 15,35" fill={`rgba(59, 130, 246, ${0.1 + i*0.2})`} stroke="#60a5fa" strokeWidth="1" />
          <polygon points="15,35 50,50 50,60 15,45" fill={`rgba(37, 99, 235, ${0.2 + i*0.2})`} stroke="#3b82f6" strokeWidth="1" />
          <polygon points="85,35 50,50 50,60 85,45" fill={`rgba(29, 78, 216, ${0.3 + i*0.2})`} stroke="#2563eb" strokeWidth="1" />
        </motion.g>
      ))}
    </motion.g>
  </svg>
);

const DeprecatedVisual = () => (
  <svg viewBox="0 0 100 100" className="w-[110px] h-[110px]">
    <motion.g animate={{ y: [-1, 1, -1] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
      {[0, 1, 2, 3].map((i) => (
        <motion.rect
          key={i}
          x={20 + i*15}
          y={80 - i*20}
          width="10"
          height={20 + i*5}
          fill="none"
          stroke={`rgba(249, 115, 22, ${1 - i*0.2})`}
          strokeWidth="1.5"
          animate={{ opacity: [1, 0.1, 1], y: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
        />
      ))}
      <motion.path 
        d="M 10 90 L 90 10" 
        stroke="#ef4444" 
        strokeWidth="1" 
        strokeDasharray="4 4"
        animate={{ strokeDashoffset: [0, -20] }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <circle cx="90" cy="10" r="3" fill="#fca5a5" />
    </motion.g>
  </svg>
);

interface ReleaseMetricsProps {
  metrics?: BackendReleaseMetrics;
  isLoading: boolean;
}

export const ReleaseMetrics: React.FC<ReleaseMetricsProps> = ({
  metrics,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-32 bg-gray-200 dark:bg-white/5 rounded-2xl"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Releases"
        value={metrics?.total_releases.toString() || "0"}
        trend="+12 this month"
        trendUp={true}
        icon={<GitBranch size={24} />}
        delay={0}
        visual={<TotalReleasesVisual />}
        gradient="from-cyan-400 to-blue-500"
      />
      <StatCard
        title="Adoption Rate"
        value={`${Math.round(metrics?.adoption_rate || 0)}%`}
        trend="+4.2% engagement"
        trendUp={true}
        icon={<TrendUp size={24} />}
        delay={0.1}
        visual={<AdoptionRateVisual />}
        gradient="from-purple-400 to-fuchsia-500"
      />
      <StatCard
        title="Active Versions"
        value={metrics?.active_versions.toString() || "0"}
        trend="-2 outdated"
        trendUp={false}
        icon={<Users size={24} />}
        delay={0.2}
        visual={<ActiveVersionsVisual />}
        gradient="from-blue-400 to-indigo-500"
      />
      <StatCard
        title="Deprecated"
        value={metrics?.deprecated_count.toString() || "0"}
        trend="+1 archived"
        trendUp={true}
        icon={<Warning size={24} />}
        delay={0.3}
        visual={<DeprecatedVisual />}
        gradient="from-orange-400 to-red-500"
      />
    </div>
  );
};

