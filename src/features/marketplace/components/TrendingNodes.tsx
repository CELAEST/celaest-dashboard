import React from "react";
import { motion } from "motion/react";
import { ArrowUpRight, Globe, Server, Database, Lock } from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";

export const TrendingNodes: React.FC = () => {
  return (
    <div className="mb-16">
      <h2 className="text-2xl font-bold text-white mb-6">
        Trending Scalability Nodes
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[500px]">
        {/* Large Featured Node */}
        <motion.div
          className="md:col-span-2 md:row-span-2 relative rounded-2xl overflow-hidden group border border-white/10"
          whileHover={{ scale: 0.995 }}
        >
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1664526936810-ec0856d31b92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMHRlY2glMjBub2RlJTIwbmV0d29yayUyMGJsdWV8ZW58MXx8fHwxNzY4NTc4MzczfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500"
            alt="Global Node"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 w-full">
            <div className="flex items-center gap-2 mb-2">
              <Globe size={16} className="text-cyan-400" />
              <span className="text-xs font-mono text-cyan-400 uppercase">
                Global Infrastructure
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Omni-Channel Logistics API
            </h3>
            <p className="text-gray-300 text-sm mb-4 line-clamp-2">
              Connect to 500+ carriers worldwide with a single integration
              point. Real-time tracking and customs automation.
            </p>
            <button className="px-4 py-2 bg-white/10 hover:bg-white text-white hover:text-black text-xs font-bold uppercase tracking-wider rounded backdrop-blur-md transition-all">
              View Details
            </button>
          </div>
        </motion.div>

        {/* Smaller Nodes */}
        <div className="md:col-span-1 md:row-span-1 bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 relative group hover:border-cyan-500/30 transition-colors">
          <div className="absolute top-4 right-4 text-gray-600 group-hover:text-cyan-400 transition-colors">
            <ArrowUpRight size={20} />
          </div>
          <Server size={32} className="text-cyan-400 mb-4" />
          <h3 className="text-lg font-bold text-white mb-1">Latency Killer</h3>
          <p className="text-xs text-gray-400">
            Edge compute nodes for ultra-low latency apps.
          </p>
        </div>

        <div className="md:col-span-1 md:row-span-1 bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 relative group hover:border-cyan-500/30 transition-colors">
          <div className="absolute top-4 right-4 text-gray-600 group-hover:text-cyan-400 transition-colors">
            <ArrowUpRight size={20} />
          </div>
          <Database size={32} className="text-purple-400 mb-4" />
          <h3 className="text-lg font-bold text-white mb-1">Data Lake V4</h3>
          <p className="text-xs text-gray-400">
            Infinite storage with AI indexing built-in.
          </p>
        </div>

        {/* Wide Node */}
        <div className="md:col-span-2 md:row-span-1 bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 relative group hover:border-cyan-500/30 transition-colors flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Lock size={16} className="text-yellow-400" />
              <span className="text-xs font-mono text-yellow-400 uppercase">
                Security First
              </span>
            </div>
            <h3 className="text-xl font-bold text-white">
              Enterprise Firewall
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              DDoS protection up to 50Tbps.
            </p>
          </div>
          <div className="h-16 w-32 bg-white/5 rounded-lg flex items-center justify-center">
            <span className="font-mono text-2xl font-bold text-white">
              $499
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
