import React from "react";
import { motion } from "motion/react";
import { TrendingUp, CheckCircle, ArrowRight, Zap } from "lucide-react";

const packs = [
  {
    id: 1,
    title: "Dropshipping Auto-Pilot V2",
    roi: "450%",
    successRate: "98.2%",
    description:
      "Full-stack automation for order processing and supplier negotiation.",
    tag: "High Yield",
  },
  {
    id: 2,
    title: "Crypto Arbitrage Sentinel",
    roi: "120-300%",
    successRate: "94.5%",
    description: "Micro-second latency trading bot across 12 major exchanges.",
    tag: "Volatile",
  },
  {
    id: 3,
    title: "Influencer Outreach AI",
    roi: "210%",
    successRate: "99.1%",
    description:
      "Automated negotiation and contract generation for tier-2 influencers.",
    tag: "Marketing",
  },
];

export const AutomationPacks: React.FC = () => {
  return (
    <div className="mb-16">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">
            High-Yield Automation Packs
          </h2>
          <p className="text-gray-400 text-sm">
            Scripts verified for maximum ROI projection.
          </p>
        </div>
        <button className="text-cyan-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:text-white transition-colors">
          View All Scripts <ArrowRight size={14} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packs.map((pack) => (
          <motion.div
            key={pack.id}
            whileHover={{ y: -5 }}
            className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-xl p-6 relative group overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4">
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border ${
                  pack.tag === "High Yield"
                    ? "text-green-400 border-green-400/30 bg-green-400/10"
                    : pack.tag === "Volatile"
                    ? "text-yellow-400 border-yellow-400/30 bg-yellow-400/10"
                    : "text-blue-400 border-blue-400/30 bg-blue-400/10"
                }`}
              >
                {pack.tag}
              </span>
            </div>

            <div className="mb-6">
              <div className="w-10 h-10 rounded-lg bg-linear-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center mb-4 group-hover:border-cyan-500/50 transition-colors">
                <Zap size={20} className="text-cyan-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                {pack.title}
              </h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                {pack.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5 bg-white/5 -mx-6 -mb-6 px-6 py-4 mt-auto">
              <div>
                <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">
                  Proj. ROI
                </div>
                <div className="text-lg font-bold text-green-400 flex items-center gap-1">
                  <TrendingUp size={14} /> {pack.roi}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">
                  Success Rate
                </div>
                <div className="text-lg font-bold text-white flex items-center gap-1">
                  <CheckCircle size={14} className="text-cyan-400" />{" "}
                  {pack.successRate}
                </div>
              </div>
            </div>

            {/* Glow on hover */}
            <div className="absolute inset-0 border border-cyan-500/0 group-hover:border-cyan-500/30 rounded-xl transition-all duration-300 pointer-events-none" />
          </motion.div>
        ))}
      </div>
    </div>
  );
};
