import React from "react";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { useOrgStore } from "@/features/shared/stores/useOrgStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pulse, HardDrives, Clock, GearSix } from "@phosphor-icons/react";
import { LiveTelemetryTab } from "./tabs/LiveTelemetryTab";
import { PageBanner } from "@/components/layout/PageLayout";

export const OperationsDashboardView: React.FC = () => {
  const { session, isLoading: isAuthLoading } = useAuth();
  const { currentOrg, isLoading: isOrgLoading } = useOrgStore();

  const token = session?.accessToken || "";
  const orgId = currentOrg?.id || "";

  if (isAuthLoading || isOrgLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] h-full bg-[#0a0a0a]">
        <Pulse className="text-cyan-400 animate-spin mb-4" size={40} />
        <p className="text-gray-400 font-mono text-sm uppercase tracking-widest">
          Loading DevOps Center...
        </p>
      </div>
    );
  }

  if (!token || !orgId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] h-full bg-[#0a0a0a]">
        <HardDrives className="text-red-500 mb-4" size={48} />
        <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
        <p className="text-gray-400 mb-6">
          Operations requires an active organization context.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-md text-white transition-colors"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <PageBanner
        title="Operations & DevOps"
        subtitle="System Telemetry and Background Jobs Monitor"
        actions={
          <div className="flex gap-4">
            <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                All Systems Nominal
              </span>
            </div>
          </div>
        }
      />

      {/* Tabs Layout */}
      <Tabs
        defaultValue="telemetry"
        className="flex-1 flex flex-col overflow-hidden"
      >
        <div className="px-3 border-b border-white/10">
          <TabsList className="bg-transparent border-none gap-8 h-16 p-0">
            {[
              { id: "telemetry", label: "Live Telemetry", icon: Pulse },
              { id: "jobs", label: "Job Monitor", icon: Clock },
              { id: "settings", label: "Infrastructure", icon: GearSix },
            ].map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="data-[state=active]:bg-transparent data-[state=active]:text-cyan-400 data-[state=active]:border-b-2 data-[state=active]:border-cyan-400 rounded-none px-0 h-16 gap-3 transition-colors opacity-50 hover:opacity-100 data-[state=active]:opacity-100 font-bold text-sm uppercase tracking-wider"
              >
                <tab.icon size={18} /> {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pb-3 relative">
          <TabsContent
            value="telemetry"
            className="m-0 h-full p-0 outline-none focus-visible:ring-0"
          >
            <LiveTelemetryTab token={token} orgId={orgId} />
          </TabsContent>
          <TabsContent value="jobs" className="m-0 h-full p-0">
            <div className="flex items-center justify-center h-[400px] border border-dashed border-white/20 rounded-2xl">
              <p className="text-gray-500 font-mono">
                JobMonitor component goes here...
              </p>
            </div>
          </TabsContent>
          <TabsContent
            value="settings"
            className="m-0 h-full p-0 outline-none focus-visible:ring-0"
          >
            <div className="h-full overflow-y-auto space-y-6">
              <div className="bg-white/2 border border-white/5 p-6 rounded-2xl">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <GearSix size={18} className="text-gray-400" />{" "}
                  Infrastructure Overview
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-5 bg-black/40 rounded-xl border border-white/5">
                    <h4 className="font-mono text-sm text-gray-400 mb-4">
                      Node Health
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          API Servers
                        </span>
                        <span className="text-sm font-mono text-emerald-400">
                          3/3 Healthy
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          Database Primaries
                        </span>
                        <span className="text-sm font-mono text-emerald-400">
                          1/1 Active
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          Redis Cache
                        </span>
                        <span className="text-sm font-mono text-emerald-400">
                          Connected
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-5 bg-black/40 rounded-xl border border-white/5">
                    <h4 className="font-mono text-sm text-gray-400 mb-4">
                      System Versions
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          celaest-back
                        </span>
                        <span className="text-sm font-mono text-white">
                          v1.2.4-stable
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          celaest-dashboard
                        </span>
                        <span className="text-sm font-mono text-white">
                          v1.1.0-main
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          PostgreSQL
                        </span>
                        <span className="text-sm font-mono text-white">
                          15.4
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
