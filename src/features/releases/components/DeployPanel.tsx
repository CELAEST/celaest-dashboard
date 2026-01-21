'use client'

import React from 'react';
import { motion } from 'motion/react';
import { X, CheckCircle, Server, Shield, Zap, Terminal } from 'lucide-react';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';

interface DeployPanelProps {
  isOpen: boolean;
  onClose: () => void;
  asset: any;
}

export const DeployPanel: React.FC<DeployPanelProps> = ({ isOpen, onClose, asset }) => {
  if (!asset) return null;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
        />
      )}

      {/* Side Panel */}
      <motion.div
        className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-[#0a0a0a] border-l border-cyan-500/30 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] z-50 flex flex-col"
        initial={{ x: '100%' }}
        animate={{ x: isOpen ? 0 : '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        {/* Header */}
        <div className="h-20 border-b border-white/10 flex items-center justify-between px-6 bg-gradient-to-r from-cyan-900/10 to-transparent">
            <div>
                <h3 className="text-white font-bold text-lg">Instant Deploy</h3>
                <p className="text-cyan-400 text-xs font-mono uppercase tracking-widest">Secure Environment</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors">
                <X size={20} />
            </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Asset Preview */}
            <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 group">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
                <ImageWithFallback src="https://images.unsplash.com/photo-1664526936810-ec0856d31b92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHwzZCUyMGFic3RyYWN0JTIwbmV0d29yayUyMGNvbm5lY3Rpdml0eSUyMGJsdWUlMjBub2Rlc3xlbnwxfHx8fDE3Njg1Nzg0NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" alt="asset" />
                <div className="absolute bottom-4 left-4 z-20">
                    <h4 className="text-xl font-bold text-white">{asset.title}</h4>
                    <span className="text-xs font-mono text-cyan-400 border border-cyan-400/30 px-2 py-0.5 rounded bg-cyan-400/10">v{asset.version}</span>
                </div>
            </div>

            {/* Config Specs */}
            <div className="space-y-4">
                <h5 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Configuration</h5>
                
                <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-white/5 border border-white/5 rounded hover:border-cyan-400/30 transition-colors cursor-pointer group/item">
                        <div className="flex items-center gap-2 mb-1 text-gray-400 group-hover/item:text-cyan-400">
                            <Server size={14} />
                            <span className="text-xs font-bold">Region</span>
                        </div>
                        <div className="text-sm text-white">US-East (N. Virginia)</div>
                    </div>
                    <div className="p-3 bg-white/5 border border-white/5 rounded hover:border-cyan-400/30 transition-colors cursor-pointer group/item">
                        <div className="flex items-center gap-2 mb-1 text-gray-400 group-hover/item:text-cyan-400">
                            <Zap size={14} />
                            <span className="text-xs font-bold">Power</span>
                        </div>
                        <div className="text-sm text-white">High (128 vCPU)</div>
                    </div>
                </div>
            </div>

            {/* Cost Breakdown */}
            <div className="space-y-4">
                 <h5 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Billing</h5>
                 <div className="bg-black/40 border border-white/10 rounded-lg p-4 space-y-2">
                     <div className="flex justify-between text-sm">
                         <span className="text-gray-400">Base License</span>
                         <span className="text-white font-mono">{asset.price}</span>
                     </div>
                     <div className="flex justify-between text-sm">
                         <span className="text-gray-400">Deployment Fee</span>
                         <span className="text-white font-mono">$0.00</span>
                     </div>
                     <div className="h-[1px] w-full bg-white/10 my-2" />
                     <div className="flex justify-between items-center">
                         <span className="text-white font-bold">Total</span>
                         <span className="text-xl text-cyan-400 font-bold font-mono">{asset.price}</span>
                     </div>
                 </div>
            </div>
            
            {/* Terminal Output Simulation */}
            <div className="bg-black rounded-lg p-3 font-mono text-[10px] text-green-400/80 border border-white/10 h-24 overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 h-6 bg-white/5 flex items-center px-2 text-gray-500 border-b border-white/5">
                    <Terminal size={10} className="mr-2" /> deploy_sequence.sh
                </div>
                <div className="pt-8 space-y-1 opacity-60">
                    <p>{`> verifying_wallet_balance... OK`}</p>
                    <p>{`> checking_dependencies... OK`}</p>
                    <p>{`> ready_to_deploy`}</p>
                    <span className="animate-pulse">_</span>
                </div>
            </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-white/10 bg-black/40 backdrop-blur-md">
            <button 
                className="w-full py-4 bg-cyan-400 hover:bg-white text-black font-bold uppercase tracking-widest text-sm rounded transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]"
                onClick={onClose}
            >
                <Zap size={18} fill="currentColor" />
                Initialize Deployment
            </button>
            <p className="text-center text-[10px] text-gray-500 mt-3">
                By deploying, you agree to the CELAEST Operational Protocols.
            </p>
        </div>
      </motion.div>
    </>
  );
};
