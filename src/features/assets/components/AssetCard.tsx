"use client";

import React, { useMemo } from "react";
import { motion } from "motion/react";
import { Cpu, Eye, ShoppingCart } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

interface AssetCardProps {
  title: string;
  version: string;
  price: string;
  type: string;
  roi?: string;
  image?: string;
  specs: { label: string; value: string; icon: React.ReactNode }[];
  trendData: { value: number }[];
  onViewDetails?: () => void;
  onAcquire?: () => void;
}

// Componente memoizado para cada spec item
const SpecItem = React.memo(function SpecItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-white/5 rounded p-2 flex items-center gap-2 border border-white/5">
      <div className="text-gray-400">{icon}</div>
      <div>
        <div className="text-[10px] text-gray-500 uppercase">{label}</div>
        <div className="text-xs font-mono text-white">{value}</div>
      </div>
    </div>
  );
});

// Mini gráfico memoizado
const MiniSparkline = React.memo(function MiniSparkline({
  data,
}: {
  data: { value: number }[];
}) {
  return (
    <div className="h-10 w-full opacity-50 group-hover:opacity-100 transition-opacity">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="value"
            stroke="#22d3ee"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
});

export const AssetCard = React.memo(function AssetCard({
  title,
  version,
  price,
  type,
  roi,
  specs,
  trendData,
  onViewDetails,
  onAcquire,
}: AssetCardProps) {
  // Memoizar los specs para evitar re-renders
  const memoizedSpecs = useMemo(() => specs, [specs]);
  const memoizedTrendData = useMemo(() => trendData, [trendData]);

  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: "0 0 30px rgba(0, 255, 255, 0.15)" }}
      className="group relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden hover:border-cyan-500/50 transition-all duration-300 flex flex-col h-full"
    >
      {/* Top Banner / Type Indicator */}
      <div className="h-1 w-full bg-linear-to-r from-cyan-500/50 to-blue-600/50" />

      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_5px_#22c55e]" />
              <span className="text-[10px] uppercase tracking-widest text-cyan-400 font-mono">
                {type}
              </span>
              {roi && (
                <span className="ml-2 px-1.5 py-0.5 bg-green-500/10 border border-green-500/30 text-green-400 text-[9px] font-bold rounded">
                  ROI {roi}
                </span>
              )}
            </div>
            <h3 className="text-xl font-bold text-white group-hover:text-cyan-100 transition-colors">
              {title}
            </h3>
            <span className="text-xs text-gray-500 font-mono">
              v{version} • Stable
            </span>
          </div>
          <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-400 group-hover:text-black transition-all">
            <Cpu size={16} />
          </div>
        </div>

        {/* Specs Grid - memoizado */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {memoizedSpecs.map((spec, i) => (
            <SpecItem
              key={i}
              icon={spec.icon}
              label={spec.label}
              value={spec.value}
            />
          ))}
        </div>

        {/* Market Value Sparkline - memoizado */}
        <div className="mt-auto mb-4">
          <div className="flex justify-between items-end mb-1">
            <span className="text-[10px] text-gray-500 uppercase tracking-wider">
              Market Demand
            </span>
            <span className="text-[10px] text-green-400 font-mono">+12.4%</span>
          </div>
          <MiniSparkline data={memoizedTrendData} />
        </div>

        {/* Footer / Action - Updated with two buttons */}
        <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="text-lg font-bold text-white font-mono">
              {price}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails?.();
              }}
              className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-gray-300 hover:text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Eye size={14} />
              Ver Detalles
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAcquire?.();
              }}
              className="px-4 py-2.5 bg-linear-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-black text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-cyan-400/40"
            >
              <ShoppingCart size={14} />
              Adquirir
            </button>
          </div>
        </div>
      </div>

      {/* Decorative corners */}
      <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-white/10 rounded-tr-xl pointer-events-none group-hover:border-cyan-500/30 transition-colors" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-white/10 rounded-bl-xl pointer-events-none group-hover:border-cyan-500/30 transition-colors" />
    </motion.div>
  );
});
