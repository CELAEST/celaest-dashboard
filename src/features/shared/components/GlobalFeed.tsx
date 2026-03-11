"use client";

import React, { useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Pulse, User } from "@phosphor-icons/react";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { useOrgStore } from "@/features/shared/stores/useOrgStore";
import { useLiveFeed } from "@/features/analytics/hooks/useAnalyticsQuery";
import { formatDistanceToNow } from "date-fns";

export const GlobalFeed: React.FC = () => {
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
          ? "verified"
          : event.type === "error"
            ? "failed"
            : "processed",
      asset: event.message,
      time: formatDistanceToNow(new Date(event.timestamp), { addSuffix: true }),
      source: event.source,
    }));
  }, [feed]);

  return (
    <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-xl p-6 h-fit sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Pulse size={14} className="text-cyan-400 animate-pulse" />
          Live Global Feed
        </h3>
        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_#22c55e]" />
      </div>

      <div className="space-y-6 relative">
        <div className="absolute left-[9px] top-2 bottom-2 w-px bg-white/10" />

        <AnimatePresence initial={false} mode="popLayout">
          {isLoading ? (
            <div className="text-xs text-gray-500 animate-pulse">
              Synchronizing feed...
            </div>
          ) : displayFeed.length > 0 ? (
            displayFeed.map((item, i) => (
              <motion.div
                key={`${item.user}-${item.time}-${i}`}
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="relative pl-8"
              >
                <div className="absolute left-0 top-1 w-5 h-5 rounded-full bg-black border border-white/20 flex items-center justify-center z-10">
                  <User size={10} className="text-gray-500" />
                </div>

                <div className="text-xs">
                  <span className="text-cyan-400 font-bold hover:underline cursor-pointer">
                    {item.user}
                  </span>
                  <span className="text-gray-500 mx-1">{item.action}</span>
                  <span className="text-white font-medium block mt-0.5 leading-relaxed">
                    {item.asset}
                  </span>
                  <span className="text-[10px] text-gray-600 font-mono mt-1 block uppercase tracking-tighter">
                    {item.time}
                  </span>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-xs text-gray-600 italic">
              No recent activity
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
