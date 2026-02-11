"use client";

import React from "react";
import { GitBranch, TrendingUp, Users, AlertTriangle } from "lucide-react";
import { StatCard } from "@/features/shared/components/StatCard";

// Mock Data for Sparklines (Formatted as { value: number })
const releasesData = [
  { value: 40 },
  { value: 42 },
  { value: 45 },
  { value: 48 },
  { value: 55 },
  { value: 60 },
  { value: 68 },
];
const adoptionData = [
  { value: 75 },
  { value: 76 },
  { value: 78 },
  { value: 80 },
  { value: 81 },
  { value: 82 },
  { value: 83 },
];
const versionData = [
  { value: 20 },
  { value: 19 },
  { value: 18 },
  { value: 16 },
  { value: 15 },
  { value: 15 },
  { value: 14 },
];
const deprecatedData = [
  { value: 5 },
  { value: 5 },
  { value: 5 },
  { value: 6 },
  { value: 6 },
  { value: 7 },
  { value: 8 },
];

import { BackendReleaseMetrics } from "@/features/assets/api/assets.api";

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
        chartData={releasesData}
        gradient="from-cyan-400 to-blue-500"
      />
      <StatCard
        title="Adoption Rate"
        value={`${Math.round(metrics?.adoption_rate || 0)}%`}
        trend="+4.2% engagement"
        trendUp={true}
        icon={<TrendingUp size={24} />}
        delay={0.1}
        chartData={adoptionData}
        gradient="from-purple-400 to-fuchsia-500"
      />
      <StatCard
        title="Active Versions"
        value={metrics?.active_versions.toString() || "0"}
        trend="-2 outdated"
        trendUp={false}
        icon={<Users size={24} />}
        delay={0.2}
        chartData={versionData}
        gradient="from-blue-400 to-indigo-500"
      />
      <StatCard
        title="Deprecated"
        value={metrics?.deprecated_count.toString() || "0"}
        trend="+1 archived"
        trendUp={true} // Neutral defaults to positive styling for now
        icon={<AlertTriangle size={24} />}
        delay={0.3}
        chartData={deprecatedData}
        gradient="from-orange-400 to-red-500"
      />
    </div>
  );
};
