'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Key, 
  Shield, 
  RefreshCw, 
  Terminal as TerminalIcon, 
  Copy, 
  ExternalLink,
  Globe,
  Lock,
  Cpu
} from 'lucide-react';
import { toast } from "sonner";

interface License {
  id: string;
  key: string;
  status: 'active' | 'suspended';
  domain: string;
  type: string;
  lastActive: string;
}

interface LogEntry {
  id: string;
  timestamp: string;
  type: 'success' | 'warning' | 'info';
  message: string;
}

export const LicensingHub: React.FC = () => {
  const [licenses] = useState<License[]>([
    { id: '1', key: 'CEL-••••-88A2', status: 'active', domain: 'fintech-dashboard.io', type: 'Enterprise', lastActive: 'Now' },
    { id: '2', key: 'CEL-••••-B49X', status: 'active', domain: 'secure-payments.net', type: 'Pro', lastActive: '2m ago' },
    { id: '3', key: 'CEL-••••-X99Q', status: 'suspended', domain: 'unauthorized-host.com', type: 'Starter', lastActive: '14h ago' },
  ]);

  const [logs, setLogs] = useState<LogEntry[]>([
    { id: '1', timestamp: new Date().toLocaleTimeString(), type: 'success', message: 'API Call from 192.168.1.1' },
    { id: '2', timestamp: new Date(Date.now() - 5000).toLocaleTimeString(), type: 'warning', message: 'Unauthorized Domain Attempt' },
    { id: '3', timestamp: new Date(Date.now() - 10000).toLocaleTimeString(), type: 'info', message: 'License Validation Check: OK' },
  ]);

  const [cooldown, setCooldown] = useState<number>(51740); // 14h 22m 20s in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setCooldown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    // Simulate incoming logs
    const logTimer = setInterval(() => {
        if (Math.random() > 0.7) {
            const newLog: LogEntry = {
                id: Date.now().toString(),
                timestamp: new Date().toLocaleTimeString(),
                type: Math.random() > 0.8 ? 'warning' : 'success',
                message: Math.random() > 0.8 ? 'Connection refused: Invalid Handshake' : `Data sync completed: Node ${Math.floor(Math.random() * 100)}`
            };
            setLogs(prev => [newLog, ...prev].slice(0, 8));
        }
    }, 3000);

    return () => {
        clearInterval(timer);
        clearInterval(logTimer);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="min-h-screen bg-[#0D0D12] text-gray-300 font-sans p-6 -m-8">
      {/* Module Header */}
      <div className="flex justify-between items-center mb-10 px-2">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Shield className="text-[#00F2FF]" size={32} />
            Licensing & IP Hub
          </h1>
          <p className="text-gray-500 mt-2 font-mono text-sm">
            SECURE MODULE // V.4.2.0 // <span className="text-[#00F2FF]">ONLINE</span>
          </p>
        </div>
        <div className="flex gap-4">
             <div className="px-4 py-2 bg-[#16161E]/50 border border-white/5 rounded-lg flex items-center gap-2">
                 <Globe size={16} className="text-gray-400" />
                 <span className="text-xs font-mono text-[#00F2FF]">GLOBAL NODE: EU-WEST-1</span>
             </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-8">
            
            {/* License Key Grid */}
            <section>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-medium text-white flex items-center gap-2">
                        <Key size={20} className="text-[#00F2FF]" />
                        Active Licenses
                    </h2>
                    <button className="text-xs font-mono text-[#00F2FF] border border-[#00F2FF]/30 px-3 py-1 rounded hover:bg-[#00F2FF]/10 transition-colors">
                        + GENERATE NEW KEY
                    </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {licenses.map((license) => (
                        <motion.div 
                            key={license.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="group relative bg-[#16161E]/40 backdrop-blur-xl border border-white/5 rounded-xl p-6 hover:border-[#00F2FF]/30 transition-all duration-300 overflow-hidden"
                        >
                            {/* Glow Effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[#00F2FF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`
                                        px-2 py-1 rounded text-[10px] font-mono uppercase tracking-wider border
                                        ${license.status === 'active' 
                                            ? 'bg-green-500/10 text-green-400 border-green-500/20 shadow-[0_0_10px_rgba(74,222,128,0.1)]' 
                                            : 'bg-orange-500/10 text-orange-400 border-orange-500/20'}
                                    `}>
                                        {license.status}
                                    </div>
                                    <div className="text-xs text-gray-500 font-mono">{license.type}</div>
                                </div>

                                <div className="mb-6">
                                    <label className="text-[10px] uppercase text-gray-500 font-mono mb-1 block">License Key</label>
                                    <div className="flex items-center gap-2 group/key cursor-pointer" onClick={() => copyToClipboard(license.key)}>
                                        <code className="text-lg font-mono text-white tracking-widest">{license.key}</code>
                                        <Copy size={14} className="text-gray-500 group-hover/key:text-[#00F2FF] transition-colors" />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                        <Globe size={14} />
                                        <span className="truncate max-w-[150px]">{license.domain}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-1.5 h-1.5 rounded-full ${license.status === 'active' ? 'bg-[#00F2FF] animate-pulse' : 'bg-gray-600'}`} />
                                        <span className="text-[10px] font-mono text-gray-500">{license.lastActive}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    
                    {/* Add New Placeholder */}
                    <div className="border border-white/5 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-gray-600 hover:text-gray-400 hover:border-white/10 transition-colors cursor-pointer min-h-[200px]">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                            <Key size={20} />
                        </div>
                        <span className="text-sm font-medium">Purchase Additional License</span>
                    </div>
                </div>
            </section>

            {/* Activity Monitor (Terminal) */}
            <section className="bg-[#050505] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                <div className="bg-[#16161E] px-4 py-2 flex items-center justify-between border-b border-white/5">
                    <div className="flex items-center gap-2">
                        <TerminalIcon size={14} className="text-[#00F2FF]" />
                        <span className="text-xs font-mono text-gray-400">TERMINAL // SYSTEM.LOG</span>
                    </div>
                    <div className="flex gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-red-500/20"></div>
                        <div className="w-2 h-2 rounded-full bg-yellow-500/20"></div>
                        <div className="w-2 h-2 rounded-full bg-green-500/20"></div>
                    </div>
                </div>
                <div className="p-4 h-[250px] overflow-y-auto font-mono text-xs space-y-2 relative">
                    <div className="absolute inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay"></div>
                    <AnimatePresence initial={false}>
                        {logs.map((log) => (
                            <motion.div 
                                key={log.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`flex gap-3 ${
                                    log.type === 'success' ? 'text-green-400/80' : 
                                    log.type === 'warning' ? 'text-orange-400/80' : 
                                    'text-[#00F2FF]/80'
                                }`}
                            >
                                <span className="opacity-50">[{log.timestamp}]</span>
                                <span className="font-bold">{log.type.toUpperCase()}:</span>
                                <span>{log.message}</span>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    <div className="animate-pulse text-[#00F2FF]">_</div>
                </div>
            </section>
        </div>

        {/* Sidebar / Tools Area */}
        <div className="lg:col-span-4 space-y-6">
            
            {/* Security Center */}
            <div className="bg-[#16161E]/60 backdrop-blur-md border border-white/5 rounded-xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#00F2FF]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                
                <h3 className="text-lg font-medium text-white mb-6 flex items-center gap-2">
                    <Lock size={18} className="text-[#00F2FF]" />
                    Security Center
                </h3>

                <div className="space-y-6">
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-xs font-mono text-gray-400">IP BINDING COOLDOWN</label>
                            <span className="text-[#00F2FF] text-xs font-mono animate-pulse">ACTIVE</span>
                        </div>
                        <div className="bg-black/40 rounded-lg p-3 border border-white/5 text-center">
                            <div className="text-2xl font-mono text-white tracking-widest tabular-nums">
                                {formatTime(cooldown)}
                            </div>
                        </div>
                    </div>

                    <button className="w-full group relative overflow-hidden rounded-lg bg-red-500/10 border border-red-500/20 hover:border-red-500/50 hover:bg-red-500/20 transition-all duration-300 p-4">
                        <div className="relative z-10 flex items-center justify-center gap-2 text-red-400 font-medium">
                            <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-700" />
                            Reset IP Address
                        </div>
                    </button>

                    <div className="pt-6 border-t border-white/5">
                        <button className="w-full flex items-center justify-between text-sm text-gray-400 hover:text-white transition-colors group">
                            <span className="flex items-center gap-2">
                                <Cpu size={16} />
                                Manual Override
                            </span>
                            <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Visual Abstract Element */}
            <div className="relative h-[240px] rounded-xl overflow-hidden border border-white/5 group">
                <div className="absolute inset-0 bg-[#00F2FF]/5 mix-blend-overlay z-10" />
                <img 
                    src="https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=2070&auto=format&fit=crop" 
                    alt="Abstract Cybersecurity" 
                    className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent z-20">
                    <p className="text-xs font-mono text-[#00F2FF] mb-1">ENCRYPTION LEVEL: MILITARY</p>
                    <h4 className="text-white font-medium">256-bit AES Protection</h4>
                </div>
            </div>
            
            {/* Quick Actions */}
            <div className="bg-[#16161E]/40 border border-white/5 rounded-xl p-4">
                 <h4 className="text-xs font-mono text-gray-500 mb-3 uppercase">Quick Actions</h4>
                 <div className="space-y-2">
                     <button className="w-full text-left px-3 py-2 rounded bg-white/5 hover:bg-white/10 text-sm text-gray-300 transition-colors flex items-center justify-between">
                         Submit Security Ticket
                         <ChevronRightIcon size={14} />
                     </button>
                     <button className="w-full text-left px-3 py-2 rounded bg-white/5 hover:bg-white/10 text-sm text-gray-300 transition-colors flex items-center justify-between">
                         View Audit Logs
                         <ChevronRightIcon size={14} />
                     </button>
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
};

const ChevronRightIcon = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m9 18 6-6-6-6"/>
    </svg>
);
