import React from "react";
import { motion } from "motion/react";
import { Play, ArrowRight } from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";

export const MarketplaceHero: React.FC = () => {
  return (
    <div className="relative w-full h-[400px] rounded-3xl overflow-hidden mb-12 group">
      {/* Background Image (Simulating 3D Loop) */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1693829957089-671ff2b0a5de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHwzZCUyMGZ1dHVyaXN0aWMlMjBzZXJ2ZXIlMjBhYnN0cmFjdCUyMGNpbmVtYXRpYyUyMGxvb3B8ZW58MXx8fHwxNzY4NTc4MzczfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          className="w-full h-full object-cover transition-transform duration-[20s] ease-linear group-hover:scale-110"
          alt="Celaest Infrastructure"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black via-black/50 to-transparent" />
      </div>

      <div className="absolute inset-0 p-12 flex flex-col justify-center max-w-2xl z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="px-2 py-1 bg-cyan-500/20 border border-cyan-500/50 rounded text-cyan-400 text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
              System Update 5.0
            </span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-6 leading-tight tracking-tight">
            Architect the <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-500">
              Unimaginable
            </span>
          </h1>
          <p className="text-gray-300 text-lg mb-8 max-w-lg leading-relaxed">
            Access the new Quantum Scalability Nodes. Deploy infrastructure that
            adapts to market volatility in milliseconds.
          </p>

          <div className="flex items-center gap-4">
            <button className="px-8 py-3 bg-cyan-400 text-black font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors rounded-sm flex items-center gap-2">
              Explore Nodes <ArrowRight size={16} />
            </button>
            <button className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors backdrop-blur-sm group/play">
              <Play
                size={20}
                className="fill-white group-hover/play:scale-110 transition-transform"
              />
            </button>
            <span className="text-xs text-gray-400 font-mono">
              Watch Demo [0:45]
            </span>
          </div>
        </motion.div>
      </div>

      {/* Decorative Border Glow */}
      <div className="absolute inset-0 border border-white/10 rounded-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-cyan-500/50 to-transparent" />
    </div>
  );
};
