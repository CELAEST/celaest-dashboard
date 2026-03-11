"use client";

import React, { useState } from "react";
import { useAIPrompts } from "../../hooks/useAI";
import { Button } from "@/components/ui/button";
import {
  Terminal,
  Plus,
  Trash,
  PencilSimple,
  Tag as TagIcon,
  Sparkle,
  MagnifyingGlass,
} from "@phosphor-icons/react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { AIPromptModal } from "../modals/AIPromptModal";
import { AIPrompt } from "../../types";

interface AIPromptsTabProps {
  token: string;
  orgId: string;
}

export const AIPromptsTab: React.FC<AIPromptsTabProps> = ({ token, orgId }) => {
  const { data, isLoading, createMutation, updateMutation, deleteMutation } =
    useAIPrompts(token, orgId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<AIPrompt | null>(null);

  const handleOpenCreate = () => {
    setEditingPrompt(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prompt: AIPrompt) => {
    setEditingPrompt(prompt);
    setIsModalOpen(true);
  };

  const handleSubmit = (formData: Partial<AIPrompt>) => {
    if (editingPrompt) {
      updateMutation.mutate(
        { id: editingPrompt.id, ...formData },
        {
          onSuccess: () => {
            setIsModalOpen(false);
            toast.success("Blueprint synchronized");
          },
        },
      );
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => {
          setIsModalOpen(false);
          toast.success("Neural blueprint deployed");
        },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-48 w-full bg-white/5 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header with MagnifyingGlass/Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white/[0.02] p-8 rounded-3xl border border-white/5 backdrop-blur-xl">
        <div className="max-w-md">
          <h3 className="text-2xl font-black text-white flex items-center gap-3">
            <Terminal size={24} className="text-cyan-400" />
            Prompt CMS
          </h3>
          <p className="text-sm text-gray-400 mt-2 leading-relaxed">
            Centralized library for neural orchestration templates.
            High-precision system instructions.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <MagnifyingGlass
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              size={16}
            />
            <input
              type="text"
              placeholder="MagnifyingGlass blueprints..."
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all"
            />
          </div>
          <Button
            onClick={handleOpenCreate}
            className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold gap-2 px-6 h-11 shadow-[0_0_25px_rgba(34,211,238,0.2)]"
          >
            <Plus size={18} /> New Blueprint
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(Array.isArray(data) ? data : (data?.prompts ?? [])).map((prompt) => (
          <div
            key={prompt.id}
            className="group relative flex flex-col p-6 bg-white/[0.03] border border-white/5 rounded-3xl hover:bg-white/[0.06] hover:border-cyan-500/30 transition-all duration-300"
          >
            {/* Card Header */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-cyan-500/10 rounded-xl border border-cyan-500/20 group-hover:scale-110 transition-transform">
                  <Sparkle size={18} className="text-cyan-400" />
                </div>
                <div>
                  <h4 className="font-bold text-white tracking-tight truncate max-w-[140px]">
                    {prompt.name}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <TagIcon size={10} className="text-gray-500" />
                    <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest">
                      {prompt.category || "General"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all transform translate-y-1 group-hover:translate-y-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5"
                  onClick={() => handleOpenEdit(prompt)}
                >
                  <PencilSimple size={15} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 bg-white/5 hover:bg-red-500/10 text-gray-400 hover:text-red-400 border border-white/5"
                  onClick={() => {
                    if (window.confirm("Purge this blueprint from the CMS?")) {
                      deleteMutation.mutate(prompt.id);
                    }
                  }}
                  disabled={deleteMutation.isPending}
                >
                  <Trash size={15} />
                </Button>
              </div>
            </div>

            {/* Preview Content */}
            <div className="flex-1 relative">
              <p className="text-sm text-gray-400 line-clamp-4 leading-relaxed font-light italic">
                &quot;{prompt.content}&quot;
              </p>
              <div className="absolute inset-x-0 bottom-0 h-12 bg-linear-to-t from-[#0d0d0d]/80 to-transparent pointer-events-none" />
            </div>

            {/* Card Footer */}
            <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">
                    Version
                  </span>
                  <span className="text-xs font-mono text-cyan-400/80">
                    v{prompt.version}.0
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-[11px] font-bold text-cyan-400/70 hover:text-cyan-400 hover:bg-cyan-500/5 group/btn"
              >
                Launch Console{" "}
                <Terminal
                  size={12}
                  className="ml-1.5 group-hover/btn:translate-x-0.5 transition-transform"
                />
              </Button>
            </div>

            {/* Hover Glow */}
            <div className="absolute inset-0 rounded-3xl bg-cyan-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </div>
        ))}

        {(Array.isArray(data) ? data : (data?.prompts ?? [])).length === 0 && (
          <div className="col-span-full py-24 text-center bg-white/[0.01] border border-dashed border-white/10 rounded-[40px]">
            <Terminal size={48} className="mx-auto text-gray-700 mb-6" />
            <h4 className="text-lg font-bold text-white mb-2">
              Neural Vault Empty
            </h4>
            <p className="text-gray-500 max-w-xs mx-auto text-sm">
              Your organization&apos;s neural intelligence needs instructions.
              Start by creating your first instruction blueprint.
            </p>
            <Button
              onClick={handleOpenCreate}
              className="mt-8 bg-white/5 hover:bg-white/10 text-white border border-white/10"
            >
              Initialize CMS
            </Button>
          </div>
        )}
      </div>

      <AIPromptModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingPrompt}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
};
