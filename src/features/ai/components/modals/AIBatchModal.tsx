"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z as zod } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Stack, Brain, CircleNotch, FileCode } from "@phosphor-icons/react";
import { useAIModels } from "../../hooks/useAI";
import { AIModel, AIBatchTask } from "../../types";

const batchSchema = zod.object({
  name: zod.string().min(3, "Batch name is too short"),
  model_id: zod.string().uuid("Please select a valid model"),
  tasks_json: zod.string().refine((val) => {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) && parsed.length > 0;
    } catch {
      return false;
    }
  }, "Must be a valid JSON array of tasks"),
});

type BatchFormData = zod.infer<typeof batchSchema>;

interface AIBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; model_id: string; tasks: AIBatchTask[] }) => void;
  isLoading?: boolean;
  token: string;
  orgId: string;
}

export const AIBatchModal: React.FC<AIBatchModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  token,
  orgId,
}) => {
  const { data: modelsData } = useAIModels(token, orgId);
  const models = Array.isArray(modelsData)
    ? modelsData
    : (modelsData?.models ?? []);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<BatchFormData>({
    resolver: zodResolver(batchSchema),
  });

  const handleFormSubmit = (data: BatchFormData) => {
    onSubmit({
      name: data.name,
      model_id: data.model_id,
      tasks: JSON.parse(data.tasks_json) as AIBatchTask[],
    });
    reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-black/80 backdrop-blur-2xl border-white/10 text-white shadow-[0_0_50px_rgba(168,85,247,0.1)]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-500/20 rounded-xl border border-purple-500/30">
              <Stack className="text-purple-400" size={20} weight="duotone" />
            </div>
            <DialogTitle className="text-2xl font-bold tracking-tight">
              Initialize Batch Job
            </DialogTitle>
          </div>
          <DialogDescription className="text-gray-400">
            Enqueue multiple neural processing tasks for parallel background
            execution.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-6 py-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-purple-400/80 uppercase tracking-widest ml-1">
                Batch Identifier
              </label>
              <Input
                {...register("name")}
                placeholder="e.g., Q1 Customer Sentiment"
                className="bg-white/5 border-white/10 focus:border-purple-500/50 text-white placeholder:text-gray-600 h-11"
              />
              {errors.name && (
                <p className="text-xs text-red-400 mt-1 ml-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-purple-400/80 uppercase tracking-widest ml-1">
                Neural Model
              </label>
              <Select onValueChange={(val: string) => setValue("model_id", val)}>
                <SelectTrigger className="bg-white/5 border-white/10 focus:ring-purple-500/50 text-white h-11">
                  <SelectValue placeholder="Select Intelligence Source" />
                </SelectTrigger>
                <SelectContent className="bg-[#0a0a0a] border-white/10 text-white">
                  {models.map((m: AIModel) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name} ({m.provider})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.model_id && (
                <p className="text-xs text-red-400 mt-1 ml-1">
                  {errors.model_id.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-purple-400/80 uppercase tracking-widest ml-1 flex items-center gap-2">
                <FileCode size={12} weight="duotone" /> Task Payload (JSON Array)
              </label>
              <span className="text-[10px] text-gray-500 font-mono tracking-tighter">
                [&#123; &quot;input&quot;: &quot;text&quot;,
                &quot;metadata&quot;: &#123;&#125; &#125; ...]
              </span>
            </div>
            <textarea
              {...register("tasks_json")}
              rows={8}
              placeholder='[
  { "input": "Analyze sentiment for: Customer loved the speed" },
  { "input": "Analyze sentiment for: Delivery was delayed" }
]'
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm font-mono text-gray-300 focus:border-purple-500/50 focus:ring-0 placeholder:text-gray-700 transition-all outline-none resize-none"
            />
            {errors.tasks_json && (
              <p className="text-xs text-red-400 mt-1 ml-1">
                {errors.tasks_json.message}
              </p>
            )}
          </div>

          <DialogFooter className="pt-4 mt-2 border-t border-white/5">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="text-gray-400 hover:text-white hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white min-w-[160px] font-bold shadow-[0_0_20px_rgba(168,85,247,0.2)]"
            >
              {isLoading ? (
                <CircleNotch className="animate-spin" size={18} />
              ) : (
                <>
                  <Brain size={18} className="mr-2" weight="duotone" />
                  Launch Batch
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
