import React from "react";
import {
  X,
  Warning,
  CaretRight,
  CheckCircle,
  XCircle,
  Clock,
  Buildings,
  Calendar,
  CurrencyDollar,
} from "@phosphor-icons/react";
import { motion } from "motion/react";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import {
  useAlertsQuery,
  useResolveRefundMutation,
} from "../../hooks/useBillingQuery";
import { format } from "date-fns";
import { BillingModal } from "./shared/BillingModal";

interface CriticalAlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "failed" | "refund_requested";
  onResolve?: () => void;
}

export const CriticalAlertsModal: React.FC<CriticalAlertsModalProps> = ({
  isOpen,
  onClose,
  type,
  onResolve,
}) => {
  const { session } = useAuth();
  const token = session?.accessToken ?? null;

  const { data: alerts = [], isLoading } = useAlertsQuery(token, type);
  const resolveMutation = useResolveRefundMutation(token);

  const handleResolve = async (id: string, approveStatus: boolean) => {
    resolveMutation.mutate(
      { id, approve: approveStatus },
      {
        onSuccess: () => {
          onResolve?.();
        },
      },
    );
  };

  const title = type === "failed" ? "Failed Payments" : "Pending Refunds";
  const icon =
    type === "failed" ? (
      <XCircle className="w-5 h-5" />
    ) : (
      <Clock className="w-5 h-5" />
    );

  const processingId = resolveMutation.isPending
    ? resolveMutation.variables?.id
    : null;

  return (
    <BillingModal isOpen={isOpen} onClose={onClose} className="max-w-2xl max-h-[85vh]" showCloseButton={false}>
      {/* Top accent line */}
      <div className="absolute inset-x-0 top-0 h-px z-20 bg-linear-to-r from-transparent via-teal-500/70 to-transparent" />
      {/* Corner glow */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "22rem",
          height: "22rem",
          background: "radial-gradient(circle at top right, rgba(20,184,166,0.06), transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Header */}
      <div className="relative px-8 py-6 border-b border-white/8 flex items-center justify-between overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-linear-to-r from-teal-500/10 via-teal-600/8 to-transparent" />
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
            pointerEvents: "none",
          }}
        />
        <div className="absolute bottom-0 left-0 h-px w-2/5 bg-linear-to-r from-teal-500/50 to-transparent" />

        <div className="relative z-10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-[#111] text-teal-400 border border-white/10 shadow-lg shadow-teal-500/10">
            {icon}
          </div>
          <div>
            <h2 className="text-xl font-black italic tracking-tighter text-white uppercase">{title}</h2>
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">
              {alerts.length} {type === "failed" ? "critical failures" : "requests requiring attention"}
            </p>
          </div>
        </div>

        <div className="relative z-10">
          <button onClick={onClose} className="p-2 rounded-full transition-colors text-gray-400 hover:text-white hover:bg-white/10">
            <X size={22} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-6 flex-1 min-h-0 overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <div className="w-10 h-10 border-2 border-teal-500/20 border-t-teal-500 rounded-full animate-spin" />
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">
              Synchronizing alert data...
            </p>
          </div>
        ) : alerts.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex p-4 rounded-full bg-emerald-500/10 mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-1">Queue Clear</h3>
            <p className="text-white/40 text-sm">
              No {title.toLowerCase()} require intervention at this time.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <motion.div
                key={alert.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 rounded-xl bg-white/2 border border-white/5 hover:border-teal-500/20 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="px-2 py-0.5 rounded bg-white/5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        ID: {alert.id.slice(0, 8)}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Calendar className="w-3.5 h-3.5" />
                        {format(new Date(alert.created_at), "MMM d, HH:mm")}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                          <Buildings className="w-3 h-3" />
                          Organization
                        </div>
                        <div className="text-sm text-white font-medium truncate">
                          {alert.organization_id}
                        </div>
                      </div>
                      <div className="space-y-1 text-right">
                        <div className="flex items-center justify-end gap-2 text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                          <CurrencyDollar className="w-3 h-3" />
                          Amount
                        </div>
                        <div className="text-lg font-black text-white tabular-nums">
                          {alert.amount.toLocaleString("en-US", {
                            style: "currency",
                            currency: alert.currency || "USD",
                          })}
                        </div>
                      </div>
                    </div>

                    {alert.description && (
                      <div className="p-2 rounded bg-black/40 text-[11px] text-gray-400 leading-relaxed italic border-l-2 border-teal-500/50">
                        &quot;{alert.description}&quot;
                      </div>
                    )}
                  </div>

                  {type === "refund_requested" && (
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleResolve(alert.id, true)}
                        disabled={!!processingId}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg text-xs font-bold hover:bg-emerald-600 disabled:opacity-50 transition-colors shadow-lg shadow-emerald-500/20"
                      >
                        {processingId === alert.id ? (
                          <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : (
                          <CheckCircle className="w-3.5 h-3.5" />
                        )}
                        APPROVE
                      </button>
                      <button
                        onClick={() => handleResolve(alert.id, false)}
                        disabled={!!processingId}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-white/5 text-red-400 rounded-lg text-xs font-bold hover:bg-red-500/10 disabled:opacity-50 transition-colors border border-red-500/20"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        DECLINE
                      </button>
                    </div>
                  )}

                  {type === "failed" && (
                    <div className="flex items-center justify-center">
                      <button
                        className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white transition-colors"
                        title="View Transaction Details"
                      >
                        <CaretRight className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="relative shrink-0 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-teal-500/50 to-transparent" />
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
            <span className="text-[10px] font-mono uppercase tracking-[0.15em]">Administrative action required</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-white/60 text-sm font-semibold hover:bg-white/10 transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </BillingModal>
  );
};
