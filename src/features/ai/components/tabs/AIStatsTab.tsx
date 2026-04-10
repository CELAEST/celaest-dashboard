"use client";

import React from "react";
import { useAIPool, useAIPoolStats } from "../../hooks/useAI";
import {
  Pulse,
  Lightning,
  Coins,
  Clock,
  ChartBar,
  TrendUp,
} from "@phosphor-icons/react";
import { Skeleton } from "@/components/ui/skeleton";

interface AIStatsTabProps {
  token: string;
  orgId: string;
}

export const AIStatsTab: React.FC<AIStatsTabProps> = ({ token, orgId }) => {
  const { statusQuery } = useAIPool(token, orgId);
  const { data: stats, isLoading: isStatsLoading } = useAIPoolStats(
    token,
    orgId,
  );
  const status = statusQuery.data;

  if (statusQuery.isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-32 bg-white/5 rounded-2xl" />
        ))}
      </div>
    );
  }

  const metrics = [
    {
      label: "Active Workers",
      value: status?.active_workers || 0,
      sub: `Pool: ${status?.max_workers || 0}`,
      icon: Pulse,
      color: "text-cyan-400",
      bg: "bg-cyan-400/10",
    },
    {
      label: "Throughput",
      value: status?.requests_per_min || 0,
      sub: "RPM (Avg)",
      icon: Lightning,
      color: "text-yellow-400",
      bg: "bg-yellow-400/10",
    },
    {
      label: "Avg Latency",
      value: `${status?.avg_latency_ms.toFixed(0) || 0}ms`,
      sub: "Round-trip time",
      icon: Clock,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
    },
    {
      label: "Daily Cost",
      value: `$${status?.total_cost_today.toFixed(4) || 0}`,
      sub: "Estimated (USD)",
      icon: Coins,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <div
            key={i}
            className="p-6 bg-white/5 border border-white/5 rounded-2xl"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-xl ${m.bg}`}>
                <m.icon className={m.color} size={20} />
              </div>
            </div>
            <h4 className="text-3xl font-bold text-white mb-1 font-mono">
              {m.value}
            </h4>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
              {m.label}
            </p>
            <p className="text-[10px] text-gray-600 mt-2 italic">{m.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 bg-white/5 border border-white/5 rounded-2xl">
          <h3 className="text-sm font-semibold text-white mb-6 flex items-center gap-2">
            <Pulse size={16} className="text-cyan-400" /> Queue Manager
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Processing Tasks</span>
              <span className="text-cyan-400 font-mono">
                {status?.processing_tasks}
              </span>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-500 opacity-50"
                style={{
                  width: `${Math.min(100, (status?.processing_tasks || 0) * 10)}%`,
                }}
              />
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Pending in Queue</span>
              <span className="text-yellow-400 font-mono">
                {status?.pending_tasks}
              </span>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-500 opacity-50"
                style={{
                  width: `${Math.min(100, (status?.pending_tasks || 0) * 10)}%`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="p-6 bg-white/5 border border-white/5 rounded-2xl">
          <h3 className="text-sm font-semibold text-white mb-6 flex items-center gap-2">
            <Lightning size={16} className="text-emerald-400" /> Success Rate
          </h3>
          <div className="flex items-end gap-1 mb-2">
            <span className="text-4xl font-bold text-white">
              {status
                ? (
                    (status.completed_tasks /
                      (status.completed_tasks + status.failed_tasks || 1)) *
                    100
                  ).toFixed(1)
                : 0}
              %
            </span>
            <span className="text-emerald-500 text-xs mb-2 font-medium">
              LIFETIME
            </span>
          </div>
          <div className="flex gap-1 h-12 items-end">
            {/* Fake small chart bars */}
            {[40, 70, 45, 90, 65, 80, 55, 95, 75, 100].map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-emerald-500/20 rounded-t-sm"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Top Providers Performance */}
      <div className="bg-white/5 border border-white/5 rounded-[32px] overflow-hidden">
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-3">
              <ChartBar className="text-cyan-400" size={20} />
              Provider Performance
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Throughput and efficiency breakdown by upstream infrastructure.
            </p>
          </div>
          <div className="px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
            Aggregated
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01]">
                <th className="px-8 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
                  Provider
                </th>
                <th className="px-8 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] text-right">
                  Requests
                </th>
                <th className="px-8 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] text-right">
                  Tokens
                </th>
                <th className="px-8 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] text-right">
                  Latency
                </th>
                <th className="px-8 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] text-right">
                  Cost
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {(stats?.top_providers || []).map((p, i) => (
                <tr
                  key={i}
                  className="hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 group-hover:border-cyan-500/40 transition-all">
                        <TrendUp size={14} className="text-cyan-400" />
                      </div>
                      <span className="text-sm font-bold text-white uppercase tracking-tighter">
                        {p.provider}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right font-mono text-sm text-gray-300">
                    {p.requests.toLocaleString()}
                  </td>
                  <td className="px-8 py-5 text-right font-mono text-sm text-gray-300">
                    {(p.tokens_used / 1000).toFixed(1)}k
                  </td>
                  <td className="px-8 py-5 text-right font-mono text-sm text-cyan-400/80">
                    {p.avg_latency_ms.toFixed(0)}ms
                  </td>
                  <td className="px-8 py-5 text-right">
                    <span className="font-mono text-sm text-emerald-400 font-bold">
                      ${p.cost.toFixed(4)}
                    </span>
                  </td>
                </tr>
              ))}
              {(!stats?.top_providers || stats.top_providers.length === 0) &&
                !isStatsLoading && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-8 py-20 text-center text-gray-500 italic text-sm"
                    >
                      Neural engine initializing... metrics pending for current
                      epoch.
                    </td>
                  </tr>
                )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
