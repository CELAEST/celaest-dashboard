import React from 'react';
import { motion } from 'motion/react';
import { Zap, Globe, Shield, Cpu, ArrowRight } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface AssetCardProps {
  title: string;
  version: string;
  price: string;
  type: string;
  roi?: string;
  specs: { label: string; value: string; icon: React.ReactNode }[];
  trendData: { value: number }[];
}

export const AssetCard: React.FC<AssetCardProps> = ({ title, version, price, type, roi, specs, trendData }) => {
  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: '0 0 30px rgba(0, 255, 255, 0.15)' }}
      className="group relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden hover:border-cyan-500/50 transition-all duration-300 flex flex-col h-full"
    >
      {/* Top Banner / Type Indicator */}
      <div className="h-1 w-full bg-gradient-to-r from-cyan-500/50 to-blue-600/50" />
      
      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_5px_#22c55e]" />
              <span className="text-[10px] uppercase tracking-widest text-cyan-400 font-mono">{type}</span>
              {roi && (
                  <span className="ml-2 px-1.5 py-0.5 bg-green-500/10 border border-green-500/30 text-green-400 text-[9px] font-bold rounded">ROI {roi}</span>
              )}
            </div>
            <h3 className="text-xl font-bold text-white group-hover:text-cyan-100 transition-colors">{title}</h3>
            <span className="text-xs text-gray-500 font-mono">v{version} • Stable</span>
          </div>
          <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-400 group-hover:text-black transition-all">
            <Cpu size={16} />
          </div>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {specs.map((spec, i) => (
            <div key={i} className="bg-white/5 rounded p-2 flex items-center gap-2 border border-white/5">
              <div className="text-gray-400">{spec.icon}</div>
              <div>
                <div className="text-[10px] text-gray-500 uppercase">{spec.label}</div>
                <div className="text-xs font-mono text-white">{spec.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Market Value Sparkline */}
        <div className="mt-auto mb-4">
          <div className="flex justify-between items-end mb-1">
             <span className="text-[10px] text-gray-500 uppercase tracking-wider">Market Demand</span>
             <span className="text-[10px] text-green-400 font-mono">+12.4%</span>
          </div>
          <div className="h-10 w-full opacity-50 group-hover:opacity-100 transition-opacity">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#22d3ee" 
                    strokeWidth={2} 
                    dot={false} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Footer / Action */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between">
          <div className="text-lg font-bold text-white font-mono">{price}</div>
          <button className="px-4 py-2 bg-white/5 hover:bg-cyan-400 hover:text-black border border-white/10 hover:border-cyan-400 text-cyan-400 text-xs font-bold uppercase tracking-wider rounded transition-all flex items-center gap-2 group/btn">
            Acquire
            <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
      
      {/* Decorative corners */}
      <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-white/10 rounded-tr-xl pointer-events-none group-hover:border-cyan-500/30 transition-colors" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-white/10 rounded-bl-xl pointer-events-none group-hover:border-cyan-500/30 transition-colors" />
    </motion.div>
  );
};
