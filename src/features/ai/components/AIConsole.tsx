"use client";

import React from "react";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { useOrgStore } from "@/features/shared/stores/useOrgStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Terminal,
  Key,
  Pulse,
  Brain,
  GearSix,
  Globe,
} from "@phosphor-icons/react";
import { AIChatTab } from "./tabs/AIChatTab";
import { AIPromptsTab } from "./tabs/AIPromptsTab";
import { AIKeyPoolTab } from "./tabs/AIKeyPoolTab";
import { AIProvidersTab } from "./tabs/AIProvidersTab";
import { AIStatsTab } from "./tabs/AIStatsTab";
import { AITasksTab } from "./tabs/AITasksTab";

/**
 * AIConsole - The central hub for Enterprise AI control.
 * Consolidates Chat, Prompt Management, API Key Pooling, and Inference Analytics.
 */
export const AIConsole: React.FC = () => {
  const { session, isLoading: isAuthLoading } = useAuth();
  const { currentOrg, isLoading: isOrgLoading } = useOrgStore();

  const token = session?.accessToken || "";
  const orgId = currentOrg?.id || "";

  // Loading State
  if (isAuthLoading || isOrgLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[500px] bg-black/40 backdrop-blur-md rounded-2xl border border-white/5 gap-4">
        <Pulse className="text-cyan-400 animate-spin" size={40} />
        <div className="text-center">
          <h3 className="text-cyan-400 font-mono text-sm tracking-[0.2em]">
            INITIALIZING AI CORE
          </h3>
          <p className="text-gray-500 text-xs mt-2 uppercase tracking-widest">
            Synchronizing with Neural Grid...
          </p>
        </div>
      </div>
    );
  }

  // Unauthorized / Missing Org State
  if (!token || !orgId) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[500px] bg-black/40 backdrop-blur-md rounded-2xl border border-white/5 gap-6">
        <div className="p-6 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
          <GearSix size={48} />
        </div>
        <div className="text-center px-8">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Access Denied
          </h2>
          <p className="text-gray-400 text-sm mt-3 max-w-sm leading-relaxed">
            AI Services require an active session and organization context.
            Please ensure you are signed in and have selected an organization
            from the dashboard sidebar.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-8 px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm transition-all"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-[600px] bg-black/60 backdrop-blur-2xl rounded-[40px] border border-white/5 overflow-hidden shadow-2xl">
      {/* Header Section */}
      <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/2">
        <div>
          <h1 className="text-3xl font-black tracking-tighter bg-linear-to-r from-cyan-400 via-blue-500 to-indigo-600 bg-clip-text text-transparent">
            AI Hub
          </h1>
          <p className="text-gray-400 text-xs mt-1.5 flex items-center gap-2 font-mono uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            Neural Infrastructure Interface
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-5 py-2 rounded-full bg-cyan-500/5 border border-cyan-500/10 flex items-center gap-3 backdrop-blur-md">
            <Pulse className="text-cyan-400 animate-pulse" size={14} />
            <span className="text-[10px] font-black font-mono text-cyan-400/80 tracking-[0.2em] uppercase">
              Core Status: Operational
            </span>
          </div>
        </div>
      </div>

      <Tabs
        defaultValue="chat"
        className="flex-1 flex flex-col overflow-hidden"
      >
        {/* Navigation Tabs */}
        <div className="px-8 bg-white/1 border-b border-white/5">
          <TabsList className="bg-transparent border-none gap-10 h-16 p-0">
            {[
              { id: "chat", label: "Neural Console", icon: Brain },
              { id: "prompts", label: "Prompt CMS", icon: Terminal },
              { id: "providers", label: "Providers", icon: Globe },
              { id: "keys", label: "Key Pool", icon: Key },
              { id: "tasks", label: "Batches & Logs", icon: Pulse },
              { id: "stats", label: "Analytics", icon: GearSix },
            ].map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="data-[state=active]:bg-transparent data-[state=active]:text-cyan-400 data-[state=active]:border-b-2 data-[state=active]:border-cyan-400 rounded-none px-0 h-16 gap-3 transition-all opacity-40 data-[state=active]:opacity-100 font-bold text-xs uppercase tracking-widest"
              >
                <tab.icon size={16} /> {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto relative bg-linear-to-b from-transparent to-black/20">
          <TabsContent
            value="chat"
            className="m-0 h-full p-8 outline-none focus-visible:ring-0"
          >
            <AIChatTab token={token} orgId={orgId} />
          </TabsContent>
          <TabsContent
            value="prompts"
            className="m-0 h-full p-8 outline-none focus-visible:ring-0"
          >
            <AIPromptsTab token={token} orgId={orgId} />
          </TabsContent>
          <TabsContent
            value="providers"
            className="m-0 h-full p-8 outline-none focus-visible:ring-0"
          >
            <AIProvidersTab token={token} orgId={orgId} />
          </TabsContent>
          <TabsContent
            value="keys"
            className="m-0 h-full p-8 outline-none focus-visible:ring-0"
          >
            <AIKeyPoolTab token={token} orgId={orgId} />
          </TabsContent>
          <TabsContent
            value="stats"
            className="m-0 h-full p-8 outline-none focus-visible:ring-0"
          >
            <AIStatsTab token={token} orgId={orgId} />
          </TabsContent>
          <TabsContent
            value="tasks"
            className="m-0 h-full p-8 outline-none focus-visible:ring-0"
          >
            <AITasksTab token={token} orgId={orgId} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
