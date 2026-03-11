import React from "react";
import {
  Pulse,
  Warning,
  Clock,
  Lightning,
  Target,
  CircleNotch,
  Gauge,
} from "@phosphor-icons/react";
import { useTelemetry } from "../../hooks/useOperations";
import { EndpointStats, ErrorType } from "../../api/schemas";

interface LiveTelemetryTabProps {
  token: string;
  orgId: string;
}

export const LiveTelemetryTab: React.FC<LiveTelemetryTabProps> = ({
  token,
  orgId,
}) => {
  const { data: telemetry, isLoading, error } = useTelemetry(token, orgId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <CircleNotch className="animate-spin text-cyan-500" size={32} />
      </div>
    );
  }

  if (error || !telemetry) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-red-400">
        <Warning size={36} className="mb-4" />
        <p>Failed to load telemetry data</p>
      </div>
    );
  }

  const {
    request_count,
    error_count,
    avg_response_time_ms,
    top_endpoints = [],
    errors_by_type = [],
    latency_p50_ms,
    latency_p99_ms,
  } = telemetry;

  const errorRate =
    request_count > 0
      ? ((error_count / request_count) * 100).toFixed(2)
      : "0.00";

  return (
    <div className="h-full overflow-y-auto space-y-6">
      {/* Top Level KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {/* Request Volume */}
        <div className="bg-white/2 border border-white/5 p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center gap-3 text-gray-400 mb-4">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Pulse size={18} className="text-blue-400" />
            </div>
            <span className="text-sm font-medium uppercase tracking-widest">
              Total Requests
            </span>
          </div>
          <div className="text-3xl font-mono text-white tracking-tight">
            {request_count.toLocaleString()}
          </div>
        </div>

        {/* Error Rate */}
        <div className="bg-white/2 border border-white/5 p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center gap-3 text-gray-400 mb-4">
            <div
              className={`p-2 rounded-lg ${parseFloat(errorRate) > 5 ? "bg-red-500/10" : "bg-emerald-500/10"}`}
            >
              <Warning
                size={18}
                className={
                  parseFloat(errorRate) > 5
                    ? "text-red-400"
                    : "text-emerald-400"
                }
              />
            </div>
            <span className="text-sm font-medium uppercase tracking-widest">
              Error Rate
            </span>
          </div>
          <div className="text-3xl font-mono text-white tracking-tight flex items-baseline gap-1">
            {errorRate}%
            <span className="text-sm text-gray-500 font-sans">
              ({error_count} errs)
            </span>
          </div>
        </div>

        {/* Avg Response Time */}
        <div className="bg-white/2 border border-white/5 p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center gap-3 text-gray-400 mb-4">
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <Lightning size={18} className="text-amber-400" />
            </div>
            <span className="text-sm font-medium uppercase tracking-widest">
              Avg Latency
            </span>
          </div>
          <div className="text-3xl font-mono text-white tracking-tight flex items-baseline gap-1">
            {avg_response_time_ms.toFixed(1)}{" "}
            <span className="text-sm text-gray-500">ms</span>
          </div>
        </div>

        {/* P50 / P99 Latency */}
        <div className="bg-white/2 border border-white/5 p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center gap-3 text-gray-400 mb-4">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Gauge size={18} className="text-purple-400" />
            </div>
            <span className="text-sm font-medium uppercase tracking-widest">
              Tail Latency
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-3xl font-mono text-white tracking-tight flex items-baseline gap-1">
              {latency_p99_ms.toFixed(1)}{" "}
              <span className="text-sm text-gray-500">ms</span>{" "}
              <span className="text-xs text-purple-400/50 uppercase tracking-widest ml-1">
                P99
              </span>
            </div>
            <div className="text-sm font-mono text-gray-400 flex items-baseline gap-1">
              {latency_p50_ms.toFixed(1)} ms{" "}
              <span className="text-[10px] uppercase tracking-widest ml-1 opacity-50">
                P50
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Top Endpoints */}
        <div className="bg-white/2 border border-white/5 rounded-2xl p-6 flex flex-col">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Target size={18} className="text-cyan-500" /> Top Endpoints
          </h3>
          <div className="flex-1 space-y-3">
            {top_endpoints.length === 0 ? (
              <div className="text-gray-500 text-sm py-4">
                No endpoint traffic recorded.
              </div>
            ) : (
              top_endpoints.map((ep: EndpointStats, i: number) => (
                <div
                  key={i}
                  className="flex flex-col gap-2 p-3 bg-black/40 rounded-xl border border-white/5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider ${
                          ep.method === "GET"
                            ? "bg-blue-500/20 text-blue-400"
                            : ep.method === "POST"
                              ? "bg-emerald-500/20 text-emerald-400"
                              : ep.method === "PUT"
                                ? "bg-amber-500/20 text-amber-400"
                                : ep.method === "DELETE"
                                  ? "bg-red-500/20 text-red-400"
                                  : "bg-gray-500/20 text-gray-400"
                        }`}
                      >
                        {ep.method}
                      </span>
                      <span
                        className="font-mono text-sm text-gray-300 truncate max-w-[200px]"
                        title={ep.endpoint}
                      >
                        {ep.endpoint}
                      </span>
                    </div>
                    <span className="text-sm font-mono text-white">
                      {ep.request_count.toLocaleString()} reqs
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-gray-500 flex items-center gap-1">
                      <Clock size={12} /> {ep.avg_latency_ms.toFixed(1)}ms avg
                    </span>
                    <span
                      className={`${ep.error_rate > 5 ? "text-red-400" : "text-gray-500"}`}
                    >
                      {ep.error_rate.toFixed(1)}% errors
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Errors Breakdown */}
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 flex flex-col">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Warning size={18} className="text-red-500" /> Error Breakdown
          </h3>
          <div className="flex-1 space-y-3">
            {errors_by_type.length === 0 ? (
              <div className="text-gray-500 text-sm py-4">
                No errors recorded in this period.
              </div>
            ) : (
              errors_by_type.map((err: ErrorType, i: number) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-red-500/5 rounded-xl border border-red-500/10"
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-sm text-red-400">
                      {err.type}
                    </span>
                    <span className="text-xs text-gray-500">
                      {err.message || "Unknown error"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs bg-black/40 px-2 py-1 rounded text-red-300 border border-red-500/20">
                      HTTP {err.code}
                    </span>
                    <span className="font-mono text-sm text-white">
                      {err.count}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
