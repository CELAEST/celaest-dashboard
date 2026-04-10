"use client";

import React, { useState } from "react";
import { useAIPool } from "../../hooks/useAI";
import { AIPoolKey } from "../../types";
import { Button } from "@/components/ui/button";
import {
  Key,
  Plus,
  ShieldCheck,
  ShieldWarning,
  Trash,
  Copy,
  Lightning,
  Lock,
  Gear,
} from "@phosphor-icons/react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { AIKeyModal } from "../modals/AIKeyModal";

interface AIKeyPoolTabProps {
  token: string;
  orgId: string;
}

export const AIKeyPoolTab: React.FC<AIKeyPoolTabProps> = ({ token, orgId }) => {
  const { keysQuery, createKeyMutation, updateKeyMutation, deleteKeyMutation } =
    useAIPool(token, orgId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKey, setEditingKey] = useState<AIPoolKey | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("ID copied to memory bank", {
      style: { background: "#06b6d4", color: "white", border: "none" },
    });
  };

  const handleAddKey = (data: Partial<AIPoolKey> & { api_key?: string }) => {
    if (editingKey) {
      updateKeyMutation.mutate(
        { id: editingKey.id, ...data },
        {
          onSuccess: () => {
            setIsModalOpen(false);
            setEditingKey(null);
            toast.success("Neural key reconfigured successfully");
          },
        },
      );
    } else {
      createKeyMutation.mutate(data as { name: string; provider: string; api_key: string }, {
        onSuccess: () => {
          setIsModalOpen(false);
          toast.success("Neural key authorized successfully");
        },
      });
    }
  };

  const openEditModal = (key: AIPoolKey) => {
    setEditingKey(key);
    setIsModalOpen(true);
  };

  const closeHealthModal = () => {
    setIsModalOpen(false);
    setEditingKey(null);
  };

  if (keysQuery.isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <Skeleton key={i} className="h-24 w-full bg-white/5 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Tab Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/2 p-6 rounded-2xl border border-white/5 backdrop-blur-md">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Lightning size={20} className="text-cyan-400" weight="fill" />
            Key Balancing Pool
          </h3>
          <p className="text-sm text-gray-400 mt-1 max-w-md">
            Manage resilient API infrastructure with automatic failover and load
            balancing.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingKey(null);
            setIsModalOpen(true);
          }}
          className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold gap-2 px-6 shadow-[0_0_20px_rgba(34,211,238,0.2)]"
        >
          <Plus size={18} weight="bold" /> Add Neural Key
        </Button>
      </div>

      {/* Keys Grid/List */}
      <div className="grid gap-4">
        {(Array.isArray(keysQuery.data)
          ? keysQuery.data
          : (keysQuery.data?.keys ?? [])
        ).map((k) => (
          <div
            key={k.id}
            className="group relative flex flex-col sm:flex-row items-center justify-between p-6 bg-white/3 border border-white/5 rounded-2xl hover:bg-white/6 hover:border-cyan-500/30 transition-all duration-300"
          >
            {/* Key Info */}
            <div className="flex items-center gap-5 w-full sm:w-auto">
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-xl transition-transform group-hover:scale-110 ${
                  k.is_active
                    ? "bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                    : "bg-red-500/10 border border-red-500/20"
                }`}
              >
                {k.is_active ? (
                  <ShieldCheck size={24} className="text-emerald-400" weight="duotone" />
                ) : (
                  <ShieldWarning size={24} className="text-red-400" weight="duotone" />
                )}
              </div>

              <div>
                <h4 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  {k.name}
                  {k.is_active && (
                    <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  )}
                </h4>
                <div className="flex items-center gap-3 mt-1.5">
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/5 border border-white/5">
                    <Lock size={10} className="text-gray-500" weight="fill" />
                    <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">
                      {k.provider}
                    </span>
                  </div>
                  <code className="text-[11px] text-cyan-400/60 font-mono tracking-wider">
                    {k.key_prefix}••••••••••••
                  </code>
                </div>
              </div>
            </div>

            {/* Metrics & Actions */}
            <div className="flex items-center justify-between sm:justify-end gap-8 w-full sm:w-auto mt-6 sm:mt-0 pt-6 sm:pt-0 border-t sm:border-t-0 border-white/5">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
                  Throughput
                </span>
                <span className="text-lg font-mono text-white tracking-tighter">
                  {k.usage_count.toLocaleString()}{" "}
                  <span className="text-[10px] text-gray-600">REQ</span>
                </span>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-cyan-400 border border-white/5"
                  onClick={() => copyToClipboard(k.name)}
                  title="Copy Engine ID"
                >
                  <Copy size={16} weight="duotone" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-cyan-400 border border-white/5"
                  onClick={() => openEditModal(k)}
                  title="Edit Key"
                >
                  <Gear size={16} weight="duotone" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-10 w-10 border border-white/5 transition-all duration-200 ${
                    confirmDeleteId === k.id
                      ? "bg-red-500 text-white hover:bg-red-600 scale-110 shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                      : "bg-white/5 hover:bg-red-500/10 text-gray-400 hover:text-red-400"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirmDeleteId === k.id) {
                      deleteKeyMutation.mutate(k.id, {
                        onSuccess: () => setConfirmDeleteId(null),
                      });
                    } else {
                      setConfirmDeleteId(k.id);
                      // Auto-cancel confirmation after 3 seconds
                      setTimeout(() => setConfirmDeleteId(null), 3000);
                    }
                  }}
                  disabled={deleteKeyMutation.isPending}
                  title={
                    confirmDeleteId === k.id ? "Confirm Deletion" : "Delete Key"
                  }
                >
                  {confirmDeleteId === k.id ? (
                    <ShieldWarning size={18} className="animate-pulse" weight="fill" />
                  ) : (
                    <Trash size={16} weight="duotone" />
                  )}
                </Button>
              </div>
            </div>

            {/* Background Accent */}
            <div
              className={`absolute top-0 right-0 w-32 h-32 blur-[80px] -z-10 rounded-full transition-opacity opacity-0 group-hover:opacity-40 ${
                k.is_active ? "bg-emerald-500/20" : "bg-red-500/20"
              }`}
            />
          </div>
        ))}

        {(Array.isArray(keysQuery.data)
          ? keysQuery.data
          : (keysQuery.data?.keys ?? [])
        ).length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 bg-white/[0.01] border border-dashed border-white/10 rounded-3xl">
            <Key size={48} className="text-gray-700 mb-4" weight="duotone" />
            <p className="text-gray-400 font-medium">
              No neural keys initialized
            </p>
            <Button
              variant="link"
              className="mt-2 text-cyan-400 hover:text-cyan-300"
              onClick={() => setIsModalOpen(true)}
            >
              Add your first provider
            </Button>
          </div>
        )}
      </div>

      <AIKeyModal
        isOpen={isModalOpen}
        onClose={closeHealthModal}
        onSubmit={handleAddKey}
        isLoading={createKeyMutation.isPending || updateKeyMutation.isPending}
        initialData={editingKey}
      />
    </div>
  );
};
