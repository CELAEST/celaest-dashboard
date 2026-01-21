'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Sliders, Wallet, Play, Star, ArrowUpRight, Lock, Filter } from 'lucide-react';
import { AssetCard } from '@/features/assets/components/AssetCard';
import { GlobalFeedWidget } from '@/features/shared/components/GlobalFeedWidget';
import { DeployPanel } from './DeployPanel';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { Zap, Globe, Shield, Cpu, Server, Activity } from 'lucide-react';

const highYieldAssets = [
  {
    id: 1,
    title: "Arbitrage Bot Alpha",
    version: "5.0",
    price: "$4,500",
    type: "Automation",
    roi: "145%",
    image: "https://images.unsplash.com/photo-1614064642578-7faacdc6336e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWJlcnB1bmslMjBzZWN1cmUlMjBkaWdpdGFsJTIwdmF1bHQlMjBhY2Nlc3N8ZW58MXx8fHwxNzY4NTc4NDY2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    specs: [
      { label: "Success Rate", value: "94.2%", icon: <Zap size={12} /> },
      { label: "Frequency", value: "HFT", icon: <Activity size={12} /> }
    ],
    trendData: [ {value: 40}, {value: 60}, {value: 55}, {value: 80}, {value: 70}, {value: 95}, {value: 100} ]
  },
  {
    id: 2,
    title: "Logistics API Node",
    version: "2.3",
    price: "$1,200/mo",
    type: "Infrastructure",
    roi: "85%",
    image: "https://images.unsplash.com/photo-1664526936810-ec0856d31b92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHwzZCUyMGFic3RyYWN0JTIwbmV0d29yayUyMGNvbm5lY3Rpdml0eSUyMGJsdWUlMjBub2Rlc3xlbnwxfHx8fDE3Njg1Nzg0NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    specs: [
      { label: "Coverage", value: "Global", icon: <Globe size={12} /> },
      { label: "Latency", value: "12ms", icon: <Zap size={12} /> }
    ],
    trendData: [ {value: 20}, {value: 25}, {value: 30}, {value: 28}, {value: 35}, {value: 40}, {value: 45} ]
  }
];

const trendingAssets = [
    {
        id: 3,
        title: "Deep Learning Core",
        version: "1.0",
        price: "$8,900",
        type: "Intelligence",
        colSpan: "col-span-1 md:col-span-2",
        specs: [
            { label: "Model", value: "GPT-X", icon: <Cpu size={12} /> },
            { label: "VRAM", value: "80GB", icon: <Server size={12} /> }
        ],
        trendData: [ {value: 10}, {value: 20}, {value: 15}, {value: 30}, {value: 40}, {value: 35}, {value: 50} ]
    },
    {
        id: 4,
        title: "Secure Vault",
        version: "3.1",
        price: "$2,100",
        type: "Security",
        colSpan: "col-span-1",
        specs: [
            { label: "Encryption", value: "Quantum", icon: <Shield size={12} /> },
            { label: "Access", value: "Bio-Key", icon: <Lock size={12} /> }
        ],
        trendData: [ {value: 50}, {value: 52}, {value: 51}, {value: 55}, {value: 58}, {value: 60}, {value: 62} ]
    }
]

export const MarketplaceView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedAsset, setSelectedAsset] = useState<any>(null);

  return (
    <div className="min-h-full pb-10 relative">
      <DeployPanel isOpen={!!selectedAsset} onClose={() => setSelectedAsset(null)} asset={selectedAsset} />

      {/* Hero Header */}
      <div className="relative h-[300px] w-full rounded-2xl overflow-hidden mb-8 group border border-white/10">
         <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent z-10" />
         <ImageWithFallback 
            src="https://images.unsplash.com/photo-1578070581071-d9b52bf80993?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXR1cmlzdGljJTIwY3liZXJodWQlMjBnbG93aW5nJTIwaW50ZXJmYWNlJTIwZGF0YSUyMHRlcm1pbmFsfGVufDF8fHx8MTc2ODU3ODQ2Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-[20s]"
            alt="Hero"
         />
         <div className="absolute bottom-0 left-0 p-8 z-20 max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold uppercase tracking-widest rounded backdrop-blur-md">
                    System Update v9.0
                </span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2 leading-tight">
                High-Performance <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-cyan-500">Asset Exchange</span>
            </h1>
            <p className="text-gray-400 text-sm max-w-md">
                Access enterprise-grade automation scripts, scalability nodes, and AI cores. Deploy instantly to your private cloud.
            </p>
         </div>

         {/* Top Right Wallet - Positioned absolute over Hero */}
         <div className="absolute top-6 right-6 z-30 hidden md:flex items-center gap-4 bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl p-2 pr-6 shadow-2xl">
             <div className="bg-cyan-500 w-10 h-10 rounded-lg flex items-center justify-center text-black shadow-[0_0_15px_rgba(34,211,238,0.5)]">
                 <Wallet size={20} />
             </div>
             <div>
                 <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Encrypted Balance</div>
                 <div className="text-xl font-mono text-white tracking-tight">$45,200.00</div>
             </div>
             <button className="ml-4 w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors">
                 <ArrowUpRight size={14} />
             </button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
         {/* Main Content Area */}
         <div className="lg:col-span-3 space-y-12">
            
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:text-white transition-colors text-xs uppercase tracking-wider font-bold">
                    <Filter size={14} /> Filter Assets
                </button>
                {['Latency <1ms', 'Global Region', 'High Automation', 'Scalable'].map(tag => (
                    <button key={tag} className="px-3 py-2 bg-black/40 border border-dashed border-white/10 hover:border-cyan-500/50 rounded-lg text-gray-500 hover:text-cyan-400 transition-colors text-xs font-mono">
                        {tag}
                    </button>
                ))}
            </div>

            {/* High-Yield Section */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Zap size={20} className="text-cyan-400" />
                        High-Yield Automation
                    </h2>
                    <span className="text-xs text-gray-500 font-mono">SORT BY: ROI (DESC)</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {highYieldAssets.map(asset => (
                        <div key={asset.id} onClick={() => setSelectedAsset(asset)} className="cursor-pointer">
                           <AssetCard {...asset} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Trending Bento Grid */}
            <div>
                 <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Activity size={20} className="text-purple-400" />
                        Trending Nodes
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {trendingAssets.map(asset => (
                        <div key={asset.id} className={`${asset.colSpan || 'col-span-1'} cursor-pointer`} onClick={() => setSelectedAsset(asset)}>
                            <AssetCard {...asset} />
                        </div>
                    ))}
                </div>
            </div>

            {/* VIP Locked Section */}
            <div className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-black to-gray-900 p-8 overflow-hidden group">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="flex flex-col items-center">
                        <Lock size={32} className="text-white mb-2" />
                        <span className="text-xs font-bold uppercase tracking-widest text-white">Level 5 Clearance Required</span>
                    </div>
                </div>
                
                <div className="relative z-10 flex justify-between items-end opacity-50 group-hover:opacity-20 transition-opacity">
                    <div>
                         <h2 className="text-2xl font-bold text-white mb-2 font-mono flex items-center gap-2">
                            Celestial VIP <Star size={18} className="text-yellow-500" fill="currentColor" />
                        </h2>
                        <p className="text-gray-400 max-w-md">
                            Exclusive access to experimental quantum cores and pre-market automation scripts.
                        </p>
                    </div>
                    <button className="px-6 py-2 bg-white/5 border border-white/10 rounded-lg text-white font-mono text-xs uppercase cursor-not-allowed">
                        Access Restricted
                    </button>
                </div>
            </div>

         </div>

         {/* Sidebar Widget Area */}
         <div className="lg:col-span-1 space-y-6">
             <div className="sticky top-24 h-[calc(100vh-140px)]">
                 <GlobalFeedWidget />
             </div>
         </div>
      </div>
    </div>
  );
};
