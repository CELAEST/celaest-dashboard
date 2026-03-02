"use client";

import React, { useState } from "react";
import { useAIProviders } from "../../hooks/useAI";
import { Button } from "@/components/ui/button";
import {
  Globe,
  Plus,
  ShieldCheck,
  ShieldAlert,
  Trash2,
  Lock,
  Zap,
  ExternalLink,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { AIProviderModal } from "../modals/AIProviderModal";
import { AIProvider } from "../../types";

interface AIProvidersTabProps {
  token: string;
  orgId: string;
}

export const AIProvidersTab: React.FC<AIProvidersTabProps> = ({
  token,
  orgId,
}) => {
  const { data, isLoading, createMutation, deleteMutation } = useAIProviders(
    token,
    orgId,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const providers = Array.isArray(data) ? data : (data?.providers ?? []);

  const handleAddProvider = (data: Partial<AIProvider>) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        setIsModalOpen(false);
        toast.success("AI Infrastructure expanded successfully");
      },
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full bg-white/5 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Tab Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/2 p-7 rounded-[28px] border border-white/5 backdrop-blur-xl">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-3">
            <Globe size={22} className="text-blue-400" />
            Neural Infrastructure Providers
          </h3>
          <p className="text-sm text-gray-400 mt-1 max-w-md">
            Manage upstream AI engines and custom endpoints for the
            orchestration layer.
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold gap-2 px-6 shadow-[0_0_25px_rgba(59,130,246,0.3)] h-11"
        >
          <Plus size={18} /> Register Provider
        </Button>
      </div>

      {/* Providers list */}
      <div className="grid gap-4">
        {providers.map((p) => (
          <div
            key={p.id}
            className="group relative flex flex-col sm:flex-row items-center justify-between p-6 bg-white/3 border border-white/5 rounded-2xl hover:bg-white/6 hover:border-blue-500/30 transition-all duration-300"
          >
            <div className="flex items-center gap-5 w-full sm:w-auto">
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all group-hover:scale-110 ${
                  p.is_active
                    ? "bg-blue-500/10 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]"
                    : "bg-red-500/10 border border-red-500/20"
                }`}
              >
                {p.is_active ? (
                  <ShieldCheck size={24} className="text-blue-400" />
                ) : (
                  <ShieldAlert size={24} className="text-red-400" />
                )}
              </div>

              <div>
                <h4 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  {p.name}
                  {p.is_active && (
                    <span className="flex h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                  )}
                </h4>
                <div className="flex items-center gap-3 mt-1.5">
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/5 border border-white/10 uppercase tracking-widest font-mono text-[9px] font-bold text-blue-400/80">
                    <Zap size={10} />
                    {p.type}
                  </div>
                  {p.base_url && (
                    <div className="flex items-center gap-1 text-[11px] text-gray-500 font-mono truncate max-w-[200px]">
                      <ExternalLink size={10} />
                      {p.base_url}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-8 w-full sm:w-auto mt-6 sm:mt-0 pt-6 sm:pt-0 border-t sm:border-t-0 border-white/5">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
                  Authorization
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <Lock size={12} className="text-emerald-500" />
                  <span className="text-xs font-mono text-emerald-400 font-bold">
                    VAULT SECURED
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 bg-white/5 hover:bg-red-500/10 text-gray-400 hover:text-red-400 border border-white/5"
                  onClick={() => {
                    if (
                      window.confirm(
                        `Decommission ${p.name}? All associated models will be disabled.`,
                      )
                    ) {
                      deleteMutation.mutate(p.id);
                    }
                  }}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          </div>
        ))}

        {providers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 bg-white/[0.01] border border-dashed border-white/10 rounded-[32px]">
            <Globe size={56} className="text-gray-800 mb-4 opacity-50" />
            <p className="text-gray-400 font-medium text-lg">
              No AI Infrastructure configured
            </p>
            <p className="text-gray-600 text-sm mt-1 mb-6">
              Connect your first provider to enable neural processing.
            </p>
            <Button
              variant="outline"
              className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10 px-8 rounded-full"
              onClick={() => setIsModalOpen(true)}
            >
              Add Provider
            </Button>
          </div>
        )}
      </div>

      <AIProviderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddProvider}
        isLoading={createMutation.isPending}
      />
    </div>
  );
};
