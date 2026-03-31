import React from "react";
import { CheckCircle, Warning } from "@phosphor-icons/react";

interface ConfigurePaymentGatewaysFooterProps {
  onClose: () => void;
}

export const ConfigurePaymentGatewaysFooter: React.FC<ConfigurePaymentGatewaysFooterProps> = ({ onClose }) => {
  return (
    <div className="relative shrink-0 overflow-hidden">
      {/* Top accent */}
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-teal-500/50 to-transparent" />
      {/* Bottom glow */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "18rem",
          height: "8rem",
          background: "radial-gradient(circle at bottom left, rgba(20,184,166,0.07), transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div className="relative px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white/30">
          <Warning size={14} />
          <span className="text-[10px] font-mono uppercase tracking-[0.15em]">Changes are saved automatically</span>
        </div>
        <button
          onClick={onClose}
          className="px-6 py-3 rounded-2xl bg-linear-to-r from-teal-500 to-teal-600 text-white text-sm font-black uppercase tracking-wide shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:shadow-[0_0_30px_rgba(20,184,166,0.5)] transition-all flex items-center gap-2"
        >
          <CheckCircle size={16} />
          Done
        </button>
      </div>
    </div>
  );
};
