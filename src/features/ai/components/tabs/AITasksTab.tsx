"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import {
  Terminal,
  Layers,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Database,
  Coins,
  Plus,
} from "lucide-react";
import { AITask, AIBatch, AIBatchTask } from "../../types";
import { useAITasks, useAIBatches } from "../../hooks/useAI";
import { Button } from "@/components/ui/button";
import { AIBatchModal } from "../modals/AIBatchModal";
import { toast } from "sonner";

interface AITasksTabProps {
  token: string;
  orgId: string;
}

export const AITasksTab: React.FC<AITasksTabProps> = ({ token, orgId }) => {
  const [activeView, setActiveView] = useState<"logs" | "batches">("logs");
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);

  const { data: tasksData, isLoading: isTasksLoading } = useAITasks(
    token,
    orgId,
  );
  const {
    data: batchesData,
    isLoading: isBatchesLoading,
    createMutation: createBatchMutation,
  } = useAIBatches(token, orgId);

  const handleCreateBatch = (data: { name: string; model_id: string; tasks: AIBatchTask[] }) => {
    createBatchMutation.mutate(data, {
      onSuccess: () => {
        setIsBatchModalOpen(false);
        toast.success("Batch job submitted to the neural network");
      },
    });
  };

  // Extract arrays from data safely
  const tasks = Array.isArray(tasksData) ? tasksData : (tasksData?.tasks ?? []);
  const batches = Array.isArray(batchesData)
    ? batchesData
    : (batchesData?.batches ?? []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 size={16} className="text-emerald-500" />;
      case "failed":
        return <XCircle size={16} className="text-red-500" />;
      case "processing":
        return <Loader2 size={16} className="text-blue-500 animate-spin" />;
      default:
        return <Clock size={16} className="text-gray-400" />;
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "failed":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      case "processing":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  return (
    <div className="flex flex-col h-full gap-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setActiveView("logs")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeView === "logs"
                ? "bg-white/10 text-white shadow-sm"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Terminal size={16} />
            Inference Logs
          </button>
          <button
            onClick={() => setActiveView("batches")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeView === "batches"
                ? "bg-white/10 text-white shadow-sm"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Layers size={16} />
            Batch Jobs
          </button>
        </div>

        {activeView === "batches" && (
          <Button
            onClick={() => setIsBatchModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-500 text-white font-bold gap-2 px-6 shadow-[0_0_20px_rgba(168,85,247,0.3)] h-11"
          >
            <Plus size={18} /> New Batch
          </Button>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden flex flex-col">
        {activeView === "logs" ? (
          <div className="flex-1 overflow-auto p-4 space-y-3">
            {isTasksLoading ? (
              <div className="flex items-center justify-center h-full py-12">
                <Loader2 className="text-cyan-400 animate-spin" size={24} />
              </div>
            ) : tasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-gray-500 italic">
                No inference tasks recorded in the current epoch.
              </div>
            ) : (
              tasks.map((task: AITask) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-2 rounded-lg border ${getStatusStyles(task.status)} transition-colors`}
                    >
                      {getStatusIcon(task.status)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white uppercase tracking-tighter">
                          {task.type}
                        </span>
                        <span className="text-[10px] text-gray-500 font-mono">
                          ID: {task.id.slice(0, 8)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-1 max-w-[400px]">
                        {task.input}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8 text-right pr-2">
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] text-gray-600 font-mono uppercase tracking-widest">
                        Metadata
                      </span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Database size={12} className="text-gray-500" />
                        <span className="text-xs font-mono text-gray-400">
                          {task.input_tokens + task.output_tokens} tokens
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] text-gray-600 font-mono uppercase tracking-widest">
                        Performance
                      </span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Clock size={12} className="text-gray-500" />
                        <span className="text-xs font-mono text-gray-400">
                          {task.latency_ms}ms
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="flex-1 overflow-auto p-4 space-y-4">
            {isBatchesLoading ? (
              <div className="flex items-center justify-center h-full py-12">
                <Loader2 className="text-purple-400 animate-spin" size={24} />
              </div>
            ) : batches.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-20 bg-white/[0.01] rounded-3xl border border-dashed border-white/10">
                <Layers size={48} className="text-gray-800 mb-4 opacity-50" />
                <p className="text-gray-500 font-medium">
                  No batch jobs running
                </p>
                <p className="text-gray-600 text-xs mt-1">
                  Queue bulk tasks to process large datasets in the background.
                </p>
              </div>
            ) : (
              batches.map((batch: AIBatch) => (
                <div
                  key={batch.id}
                  className="p-6 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/[0.08] transition-all"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-purple-500/10 rounded-xl border border-purple-500/20 text-purple-400">
                        <Layers size={20} />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white tracking-tight">
                          {batch.name}
                        </h4>
                        <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest mt-0.5">
                          ID: {batch.id}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyles(batch.status)}`}
                    >
                      {batch.status}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-600 font-mono uppercase tracking-[0.2em] mb-1.5">
                        Progress
                      </span>
                      <div className="flex items-end gap-2">
                        <span className="text-xl font-bold text-white leading-none">
                          {Math.round(
                            (batch.completed_tasks / batch.total_tasks) * 100,
                          )}
                          %
                        </span>
                        <span className="text-[10px] text-gray-500 mb-0.5">
                          {batch.completed_tasks}/{batch.total_tasks}
                        </span>
                      </div>
                      <div className="w-full h-1 bg-white/5 rounded-full mt-3 overflow-hidden">
                        <div
                          className="h-full bg-purple-500 transition-all duration-500"
                          style={{
                            width: `${(batch.completed_tasks / batch.total_tasks) * 100}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-600 font-mono uppercase tracking-[0.2em] mb-1.5">
                        Integrity
                      </span>
                      <div className="flex items-center gap-2">
                        <XCircle size={14} className="text-red-500" />
                        <span className="text-sm font-mono text-red-400 font-bold">
                          {batch.failed_tasks} FAILURES
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-600 font-mono uppercase tracking-[0.2em] mb-1.5">
                        Batch Cost
                      </span>
                      <div className="flex items-center gap-2">
                        <Coins size={14} className="text-emerald-500" />
                        <span className="text-sm font-mono text-white font-bold">
                          ${batch.total_cost.toFixed(4)}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-600 font-mono uppercase tracking-[0.2em] mb-1.5">
                        Timestamp
                      </span>
                      <span className="text-xs text-gray-400 font-mono">
                        {format(new Date(batch.created_at), "MMM d, HH:mm")}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <AIBatchModal
        isOpen={isBatchModalOpen}
        onClose={() => setIsBatchModalOpen(false)}
        onSubmit={handleCreateBatch}
        isLoading={createBatchMutation.isPending}
        token={token}
        orgId={orgId}
      />
    </div>
  );
};
