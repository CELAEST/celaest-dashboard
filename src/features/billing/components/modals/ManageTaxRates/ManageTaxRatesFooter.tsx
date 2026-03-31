import React from "react";
import { CheckCircle } from "@phosphor-icons/react";

interface ManageTaxRatesFooterProps {
  taxRatesCount: number;
  onClose: () => void;
}

export const ManageTaxRatesFooter: React.FC<ManageTaxRatesFooterProps> = ({
  taxRatesCount,
  onClose,
}) => {
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
        <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-teal-400/70 bg-teal-500/10 border border-teal-500/20 px-2.5 py-1 rounded-lg">
          {taxRatesCount} tax rate{taxRatesCount !== 1 ? "s" : ""} configured
        </span>
        <button
          onClick={onClose}
          className="px-6 py-3 rounded-2xl bg-linear-to-r from-teal-500 to-teal-600 text-white text-sm font-black uppercase tracking-wide shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:shadow-[0_0_30px_rgba(20,184,166,0.5)] transition-all flex items-center gap-2"
        >
          <CheckCircle size={16} />
          Save Changes
        </button>
      </div>
    </div>
  );
};
