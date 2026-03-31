import React from "react";
import { CreditCard, X } from "@phosphor-icons/react";

interface ManageSubscriptionHeaderProps {
  onClose?: () => void;
}

export const ManageSubscriptionHeader: React.FC<ManageSubscriptionHeaderProps> = ({ onClose }) => {
  return (
    <div className="relative px-8 py-6 border-b border-white/8 flex items-center justify-between overflow-hidden shrink-0">
      {/* Gradient wash */}
      <div className="absolute inset-0 bg-linear-to-r from-teal-500/10 via-teal-600/8 to-transparent" />
      {/* Grid dots */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
          pointerEvents: "none",
        }}
      />
      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 h-px w-2/5 bg-linear-to-r from-teal-500/50 to-transparent" />

      <div className="relative z-10 flex items-center gap-4">
        {/* Icon badge */}
        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-[#111] text-teal-400 border border-white/10 shadow-lg shadow-teal-500/10">
          <CreditCard size={22} />
        </div>
        <div>
          <h2 className="text-xl font-black italic tracking-tighter text-white uppercase">Manage Subscription</h2>
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">Update your subscription settings</p>
        </div>
      </div>

      {onClose && (
        <div className="relative z-10">
          <button onClick={onClose} className="p-2 rounded-full transition-colors text-gray-400 hover:text-white hover:bg-white/10">
            <X size={22} />
          </button>
        </div>
      )}
    </div>
  );
};
