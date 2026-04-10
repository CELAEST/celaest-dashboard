import React from "react";
import { format } from "date-fns";
import {
  Play,
  Clock,
  Pulse,
  CircleNotch,
  Warning,
  CheckCircle,
  XCircle,
  PauseCircle,
} from "@phosphor-icons/react";
import { useJobs } from "../../hooks/useJobs";
import { BackgroundJob } from "../../api/jobs.api";
import { CardGridSkeleton } from "@/components/ui/skeletons";

interface JobMonitorTabProps {
  token: string;
  orgId: string;
}

export const JobMonitorTab: React.FC<JobMonitorTabProps> = ({
  token,
  orgId,
}) => {
  const {
    data: jobs,
    isLoading,
    error,
    triggerMutation,
  } = useJobs(token, orgId);

  if (isLoading) {
    return (
      <div className="h-full p-4">
        <CardGridSkeleton count={3} />
      </div>
    );
  }

  if (error || !jobs) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-red-400">
        <Warning size={36} className="mb-4" />
        <p>Failed to load job monitor</p>
      </div>
    );
  }

  const getStatusIcon = (status: BackgroundJob["status"]) => {
    switch (status) {
      case "running":
        return <CircleNotch size={16} className="animate-spin text-blue-400" />;
      case "idle":
        return <Clock size={16} className="text-gray-400" />;
      case "failed":
        return <XCircle size={16} className="text-red-400" />;
      case "stopped":
        return <PauseCircle size={16} className="text-orange-400" />;
    }
  };

  const getStatusStyle = (status: BackgroundJob["status"]) => {
    switch (status) {
      case "running":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "idle":
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
      case "failed":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      case "stopped":
        return "bg-orange-500/10 text-orange-400 border-orange-500/20";
    }
  };

  return (
    <div className="h-full overflow-y-auto space-y-6">
      <div className="bg-white/2 border border-white/5 p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Pulse size={18} className="text-purple-500" /> Background
              Workloads
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              Monitor and trigger asynchronous system tasks
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-gray-400 font-mono">
                {jobs.filter((j) => j.status === "running").length} Active
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gray-500" />
              <span className="text-gray-400 font-mono">
                {jobs.filter((j) => j.status === "idle").length} Idle
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="p-5 bg-black/40 rounded-xl border border-white/5 hover:border-white/10 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-bold text-white">{job.name}</h4>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-mono border flex items-center gap-1.5 ${getStatusStyle(job.status)}`}
                    >
                      {getStatusIcon(job.status)}
                      {job.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm max-w-2xl">
                    {job.description}
                  </p>
                </div>
                <div>
                  <button
                    onClick={() => triggerMutation.mutate(job.id)}
                    disabled={
                      triggerMutation.isPending || job.status === "running"
                    }
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:hover:bg-white/5 rounded-lg text-sm text-gray-300 font-medium transition-colors border border-white/10"
                  >
                    {triggerMutation.isPending &&
                    triggerMutation.variables === job.id ? (
                      <CircleNotch
                        size={16}
                        className="animate-spin text-purple-400"
                      />
                    ) : (
                      <Play
                        size={16}
                        className={
                          job.status === "running"
                            ? "text-gray-500"
                            : "text-emerald-400"
                        }
                      />
                    )}
                    Run Now
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 mt-6 pt-4 border-t border-white/5">
                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wider block mb-1">
                    Last Run
                  </span>
                  <span className="text-sm font-mono text-gray-300 flex items-center gap-1.5">
                    {job.last_run
                      ? format(new Date(job.last_run), "MMM d, HH:mm:ss")
                      : "Never"}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wider block mb-1">
                    Next Run
                  </span>
                  <span className="text-sm font-mono text-gray-300 flex items-center gap-1.5">
                    {job.next_run
                      ? format(new Date(job.next_run), "MMM d, HH:mm:ss")
                      : "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wider block mb-1">
                    Success / Errs
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono text-emerald-400 flex items-center gap-1">
                      <CheckCircle size={14} />{" "}
                      {job.success_count.toLocaleString()}
                    </span>
                    <span
                      className={`text-sm font-mono ${job.error_count > 0 ? "text-red-400" : "text-gray-500"} flex items-center gap-1`}
                    >
                      <Warning size={14} />{" "}
                      {job.error_count.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wider block mb-1">
                    Avg Duration
                  </span>
                  <span className="text-sm font-mono text-purple-300">
                    {job.avg_duration_ms.toFixed(1)}ms
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
