'use client'

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, User } from 'lucide-react';

const activities = [
    { user: "User_8821", action: "deployed", asset: "Dropshipping Auto-Pilot", time: "2m ago" },
    { user: "Alex_M", action: "acquired", asset: "Omni-Channel Logistics", time: "5m ago" },
    { user: "Corp_X", action: "scaled", asset: "Data Lake V4", time: "12m ago" },
    { user: "Sarah_Dev", action: "deployed", asset: "Latency Killer Node", time: "15m ago" },
    { user: "User_9901", action: "purchased", asset: "VIP Consultation", time: "22m ago" },
];

export const GlobalFeed: React.FC = () => {
    const [feed, setFeed] = useState(activities);

    // Simulate live feed
    useEffect(() => {
        const interval = setInterval(() => {
            const actions = ["deployed", "acquired", "scaled", "optimized"];
            const assets = ["Neural Core", "Crypto Bot", "Security Node", "Storage Unit"];
            const newActivity = {
                user: `User_${Math.floor(Math.random() * 9000) + 1000}`,
                action: actions[Math.floor(Math.random() * actions.length)],
                asset: assets[Math.floor(Math.random() * assets.length)],
                time: "Just now"
            };
            setFeed(prev => [newActivity, ...prev.slice(0, 4)]);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-xl p-6 h-fit sticky top-24">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Activity size={14} className="text-cyan-400 animate-pulse" />
                    Live Global Feed
                </h3>
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_#22c55e]" />
            </div>

            <div className="space-y-6 relative">
                 <div className="absolute left-[9px] top-2 bottom-2 w-px bg-white/10" />
                 
                 <AnimatePresence initial={false}>
                    {feed.map((item, i) => (
                        <motion.div 
                            key={`${item.user}-${i}`}
                            initial={{ opacity: 0, x: -20, height: 0 }}
                            animate={{ opacity: 1, x: 0, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="relative pl-8"
                        >
                            <div className="absolute left-0 top-1 w-5 h-5 rounded-full bg-black border border-white/20 flex items-center justify-center z-10">
                                <User size={10} className="text-gray-500" />
                            </div>
                            
                            <div className="text-xs">
                                <span className="text-cyan-400 font-bold hover:underline cursor-pointer">{item.user}</span>
                                <span className="text-gray-500 mx-1">{item.action}</span>
                                <span className="text-white font-medium block mt-0.5">{item.asset}</span>
                                <span className="text-[10px] text-gray-600 font-mono mt-1 block">{item.time}</span>
                            </div>
                        </motion.div>
                    ))}
                 </AnimatePresence>
            </div>
        </div>
    );
};
