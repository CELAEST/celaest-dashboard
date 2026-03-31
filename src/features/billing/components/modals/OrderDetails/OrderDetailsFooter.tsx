import React from "react";
import { ArrowCounterClockwise, PencilSimple, FloppyDisk, Package } from "@phosphor-icons/react";

interface OrderDetailsFooterProps {
  mode: "view" | "edit";
  setMode: (mode: "view" | "edit") => void;
  onClose: () => void;
  onSave: () => void;
  onRefund?: () => void;
  canRefund?: boolean;
  lastEditDate: string;
  isSuperAdmin?: boolean;
}

export const OrderDetailsFooter: React.FC<OrderDetailsFooterProps> = ({
  mode,
  setMode,
  onClose,
  onSave,
  onRefund,
  canRefund = false,
  lastEditDate,
  isSuperAdmin = false,
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
        {/* Left: metadata badge */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <Package size={14} />
          </div>
          <div>
            <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/30 mb-0.5">Last edit</p>
            <p className="text-sm font-mono text-white/60 tracking-wider">{lastEditDate}</p>
          </div>
        </div>

        {/* Right: action buttons */}
        <div className="flex gap-3">
          {mode === "view" ? (
            <>
              <button
                onClick={onClose}
                className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-white/60 text-sm font-semibold hover:bg-white/10 transition-colors"
              >
                Close
              </button>
              {isSuperAdmin && (
                <button
                  onClick={() => setMode("edit")}
                  className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-white/60 text-sm font-semibold hover:bg-white/10 transition-colors flex items-center gap-2"
                >
                  <PencilSimple size={16} />
                  Edit
                </button>
              )}
              {canRefund && onRefund && (
                <button
                  onClick={onRefund}
                  className="px-5 py-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-semibold hover:bg-amber-500/20 transition-colors flex items-center gap-2"
                >
                  <ArrowCounterClockwise size={16} />
                  Refund
                </button>
              )}
            </>
          ) : (
            <>
              <button
                onClick={() => setMode("view")}
                className="flex-1 py-3 px-5 rounded-2xl bg-white/5 border border-white/10 text-white/60 text-sm font-semibold hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onSave}
                className="py-3 px-5 rounded-2xl bg-linear-to-r from-teal-500 to-teal-600 text-white text-sm font-black uppercase tracking-wide shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:shadow-[0_0_30px_rgba(20,184,166,0.5)] transition-all flex items-center gap-2"
              >
                <FloppyDisk size={16} />
                Save
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
