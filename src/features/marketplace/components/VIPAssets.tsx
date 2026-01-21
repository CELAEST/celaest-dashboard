import React from "react";
import { Crown, Lock } from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";

export const VIPAssets: React.FC = () => {
  return (
    <div className="mb-16 relative rounded-2xl overflow-hidden border border-yellow-500/20">
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1680144990874-6dfb003b5b69?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB2aXAlMjBleGNsdXNpdmUlMjBhY2Nlc3MlMjBnb2xkJTIwYmxhY2t8ZW58MXx8fHwxNzY4NTc4MzczfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          className="w-full h-full object-cover opacity-20 grayscale"
          alt="VIP Background"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black via-black/90 to-transparent" />
      </div>

      <div className="relative p-12 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 mb-4 text-yellow-500">
            <Crown size={20} />
            <span className="text-xs font-bold uppercase tracking-[0.2em]">
              Celestial VIP Access
            </span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Limited Edition Assets
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            Unlock access to Tier-1 dedicated servers, private consultation with
            CELAEST architects, and beta access to the Quantum Prediction
            Engine.
          </p>
          <div className="flex items-center gap-4">
            <button className="px-6 py-3 bg-linear-to-r from-yellow-600 to-yellow-500 text-black font-bold uppercase tracking-widest text-xs rounded hover:shadow-[0_0_20px_rgba(234,179,8,0.3)] transition-all">
              Request Access
            </button>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Lock size={12} /> Invitation Only
            </span>
          </div>
        </div>

        <div className="flex gap-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="w-40 h-48 bg-white/5 border border-white/10 rounded-xl flex flex-col items-center justify-center p-4 backdrop-blur-md relative group cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                <Lock className="text-white" />
              </div>
              <div className="w-12 h-12 bg-white/10 rounded-full mb-4" />
              <div className="h-2 w-20 bg-white/20 rounded mb-2" />
              <div className="h-2 w-12 bg-white/10 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
