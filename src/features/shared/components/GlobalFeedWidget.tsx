'use client'

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, Activity } from 'lucide-react';

const activities = [
  { user: "User_8821", action: "deployed", asset: "Neural Core v4", time: "2s ago", region: "US-East" },
  { user: "Corp_Nexus", action: "acquired", asset: "Global Router", time: "12s ago", region: "EU-West" },
  { user: "Dev_X", action: "scaled", asset: "Data Node", time: "45s ago", region: "Asia" },
  { user: "System", action: "alert", asset: "Stock Low: VIP Access", time: "1m ago", region: "Global" },
  { user: "Alpha_Team", action: "deployed", asset: "Encryption Shield", time: "2m ago", region: "US-West" }
];

export const GlobalFeedWidget: React.FC = () => {
  const [feed, setFeed] = useState(activities);

  // Simulate live feed
  useEffect(() => {
    const interval = setInterval(() => {
      const newActivity = { 
        user: `User_${Math.floor(Math.random() * 9000) + 1000}`, 
        action: Math.random() > 0.5 ? "deployed" : "acquired", 
        asset: ["Neural Core", "Encryption Node", "AI Model X", "Traffic Router"][Math.floor(Math.random() * 4)], 
        time: "Just now",
        region: ["US-East", "EU-West", "Asia", "LATAM"][Math.floor(Math.random() * 4)]
      };
      setFeed(prev => [newActivity, ...prev.slice(0, 4)]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-black/60 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
         <div className="flex items-center gap-2">
             <Activity size={14} className="text-cyan-400 animate-pulse" />
             <span className="text-xs font-bold text-white uppercase tracking-widest">Global Ops</span>
         </div>
         <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_5px_#22c55e]" />
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
         <AnimatePresence initial={false}>
            {feed.map((item, i) => (
                <motion.div
                    key={`${item.user}-${i}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="p-3 rounded bg-white/5 border border-white/5 hover:border-cyan-500/30 transition-colors"
                >
                    <div className="flex justify-between items-start mb-1">
                        <span className="text-[10px] font-mono text-cyan-400">{item.user}</span>
                        <span className="text-[10px] text-gray-500">{item.time}</span>
                    </div>
                    <div className="text-xs text-white mb-1">
                        <span className={item.action === 'deployed' ? 'text-green-400' : 'text-blue-400'}>{item.action}</span>
                        <span className="mx-1 text-gray-500">::</span>
                        {item.asset}
                    </div>
                    <div className="flex items-center gap-1 text-[9px] text-gray-500 uppercase">
                        <Globe size={8} /> {item.region}
                    </div>
                </motion.div>
            ))}
         </AnimatePresence>
      </div>
    </div>
  );
};
