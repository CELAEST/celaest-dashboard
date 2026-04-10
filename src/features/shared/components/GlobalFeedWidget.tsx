"use client";

import React, { useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Globe, Pulse } from "@phosphor-icons/react";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { useOrgStore } from "@/features/shared/stores/useOrgStore";
import { useLiveFeed } from "@/features/analytics/hooks/useAnalyticsQuery";
import { formatDistanceToNow } from "date-fns";

export const GlobalFeedWidget: React.FC = () => {
  const { session } = useAuthStore();
  const { currentOrg } = useOrgStore();

  const token = session?.accessToken || null;
  const orgId = currentOrg?.id || null;

  const { data: feed = [], isLoading } = useLiveFeed(token, orgId);

  const displayFeed = useMemo(() => {
    return feed.slice(0, 5).map((event) => ({
      user: event.user_email ? event.user_email.split("@")[0] : "System",
      action:
        event.type === "success"
          ? "deployed"
          : event.type === "error"
            ? "alert"
            : "processed",
      asset: event.message,
      time: formatDistanceToNow(new Date(event.timestamp), { addSuffix: true }),
      region: event.source === "payment" ? "Global" : "Node-X",
    }));
  }, [feed]);

  return (
    <div className="w-full bg-black/60 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Pulse size={14} className="text-cyan-400 animate-pulse" />
          <span className="text-xs font-bold text-white uppercase tracking-widest">
            Global Ops
          </span>
        </div>
        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_5px_#22c55e]" />
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
        <AnimatePresence initial={false} mode="popLayout">
          {isLoading ? (
            <div className="p-4 text-center text-xs text-gray-500">
              Syncing...
            </div>
          ) : displayFeed.length > 0 ? (
            displayFeed.map((item, i) => (
              <motion.div
                key={`${item.user}-${item.time}-${i}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="p-3 rounded bg-white/5 border border-white/5 hover:border-cyan-500/30 transition-colors"
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[10px] font-mono text-cyan-400">
                    {item.user}
                  </span>
                  <span className="text-[10px] text-gray-500">{item.time}</span>
                </div>
                <div className="text-xs text-white mb-1">
                  <span
                    className={
                      item.action === "deployed"
                        ? "text-green-400"
                        : "text-blue-400"
                    }
                  >
                    {item.action}
                  </span>
                  <span className="mx-1 text-gray-500">::</span>
                  {item.asset}
                </div>
                <div className="flex items-center gap-1 text-[9px] text-gray-500 uppercase">
                  <Globe size={8} /> {item.region}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="p-4 text-center text-xs text-gray-600 italic">
              No activity detected
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
