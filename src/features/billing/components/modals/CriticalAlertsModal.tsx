import React, { useState, useEffect, useCallback } from "react";
import {
  X,
  AlertCircle,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Clock,
  Building2,
  Calendar,
  DollarSign,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { billingApi } from "../../api/billing.api";
import { Payment } from "../../types";
import { toast } from "sonner";
import { format } from "date-fns";

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
  const [alerts, setAlerts] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchAlerts = useCallback(async () => {
    if (!session?.accessToken) return;
    setIsLoading(true);
    try {
      const data = await billingApi.getAdminAlerts(session.accessToken, type);
      setAlerts(data);
    } catch (err) {
      console.error("Failed to fetch alerts:", err);
      toast.error("Failed to load alerts");
    } finally {
      setIsLoading(false);
    }
  }, [session?.accessToken, type]);

  useEffect(() => {
    if (isOpen) {
      fetchAlerts();
    }
  }, [isOpen, fetchAlerts]);

  const handleResolve = async (id: string, approveStatus: boolean) => {
    if (!session?.accessToken) return;
    setProcessingId(id);
    try {
      await billingApi.resolveAdminRefund(
        session.accessToken,
        id,
        approveStatus,
      );
      toast.success(approveStatus ? "Refund approved" : "Refund declined");
      fetchAlerts();
      onResolve?.();
    } catch (err) {
      console.error("Failed to resolve refund:", err);
      toast.error("Failed to resolve refund");
    } finally {
      setProcessingId(null);
    }
  };

  if (!isOpen) return null;

  const title = type === "failed" ? "Failed Payments" : "Pending Refunds";
  const icon =
    type === "failed" ? (
      <XCircle className="w-5 h-5 text-red-500" />
    ) : (
      <Clock className="w-5 h-5 text-orange-500" />
    );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-[#09090b] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/2">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg ${type === "failed" ? "bg-red-500/10" : "bg-orange-500/10"}`}
              >
                {icon}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white leading-none mb-1">
                  {title}
                </h2>
                <p className="text-xs text-gray-400 font-mono tracking-tight uppercase">
                  {alerts.length}{" "}
                  {type === "failed"
                    ? "critical failures"
                    : "requests requiring attention"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-full transition-colors group"
            >
              <X className="w-5 h-5 text-gray-500 group-hover:text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <div className="w-10 h-10 border-2 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
                <p className="text-sm text-gray-400 font-mono">
                  Synchronizing alert data...
                </p>
              </div>
            ) : alerts.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex p-4 rounded-full bg-emerald-500/10 mb-4">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-1">
                  Queue Clear
                </h3>
                <p className="text-gray-400 text-sm">
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
                    className="p-4 rounded-xl bg-white/2 border border-white/5 hover:border-white/10 transition-all group"
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
                              <Building2 className="w-3 h-3" />
                              Organization
                            </div>
                            <div className="text-sm text-white font-medium truncate">
                              {alert.organization_id}
                            </div>
                          </div>
                          <div className="space-y-1 text-right">
                            <div className="flex items-center justify-end gap-2 text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                              <DollarSign className="w-3 h-3" />
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
                          <div className="p-2 rounded bg-black/40 text-[11px] text-gray-400 leading-relaxed italic border-l-2 border-orange-500/50">
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
                              <CheckCircle2 className="w-3.5 h-3.5" />
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
                            className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white transition-colors group/btn"
                            title="View Transaction Details"
                          >
                            <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-0.5 transition-transform" />
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
          <div className="p-6 bg-white/2 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono">
              <AlertCircle className="w-3 h-3" />
              ADMINISTRATIVE ACTION REQUIRED
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-lg transition-all border border-white/10"
            >
              DISMISS
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
