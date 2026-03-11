import React, { useState } from "react";
import {
  ShieldCheck,
  Clock,
  Prohibit,
  Warning,
  X,
  Check,
  ArrowClockwise,
  Lightning,
  Play,
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { UpgradePlanModal } from "@/features/billing/components/modals/UpgradePlanModal";

interface LicenseActionsProps {
  status: string;
  onStatusChange: (status: string) => void;
  onRevoke?: () => void;
  onRenew?: () => void;
  onConvertTrial?: () => void;
  onReactivate?: () => void;
}

export const LicenseActions: React.FC<LicenseActionsProps> = ({
  status,
  onStatusChange,
  onRevoke,
  onRenew,
  onConvertTrial,
  onReactivate,
}) => {
  const { isDark } = useTheme();
  const session = useAuthStore((s) => s.session);
  const isAdmin =
    session?.user?.role === "super_admin" || session?.user?.role === "admin";
  const [isConfirmingRevoke, setIsConfirmingRevoke] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const handleRevoke = () => {
    if (!isConfirmingRevoke) {
      setIsConfirmingRevoke(true);
      return;
    }
    // Use dedicated revoke endpoint (POST /revoke) which handles
    // customer_assets cleanup and emits the correct event.
    // Falls back to generic status change if onRevoke is not provided.
    if (onRevoke) {
      onRevoke();
    } else {
      onStatusChange("revoked");
    }
    setIsConfirmingRevoke(false);
  };

  const actions = [
    { id: "active", icon: ShieldCheck, label: "Activate", color: "emerald" },
    { id: "expired", icon: Clock, label: "Expire", color: "orange" },
  ];

  if (!isAdmin) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h4
            className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDark ? "text-gray-500" : "text-gray-400"}`}
          >
            License Management
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {status === "trial" && (
            <button
              onClick={() => setIsUpgradeModalOpen(true)}
              className={`group relative overflow-hidden flex items-center gap-4 p-5 rounded-2xl border transition-all duration-500 ${
                isDark
                  ? "bg-linear-to-br from-purple-900/40 to-black/40 border-purple-500/30 text-purple-100 hover:border-purple-400/60 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:-translate-y-1"
                  : "bg-linear-to-br from-purple-50 to-white border-purple-200 text-purple-900 hover:border-purple-400 hover:shadow-xl hover:-translate-y-1"
              }`}
            >
              <div className="absolute inset-0 bg-linear-to-r from-purple-500/0 via-purple-500/10 to-purple-500/0 -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
              <div
                className={`p-3 rounded-xl transition-transform duration-500 group-hover:scale-110 ${
                  isDark
                    ? "bg-purple-500/20 text-purple-400"
                    : "bg-purple-100 text-purple-600"
                }`}
              >
                <Lightning
                  size={24}
                  className={
                    isDark ? "drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" : ""
                  }
                />
              </div>
              <div className="flex flex-col items-start flex-1 text-left relative z-10">
                <span className="text-sm font-black uppercase tracking-wider">
                  Upgrade to Premium
                </span>
                <span className="text-xs opacity-70 font-medium mt-1">
                  Unlock all features permanently
                </span>
              </div>
            </button>
          )}

          {["expired", "suspended", "cancelled"].includes(status) && (
            <button
              onClick={() => setIsUpgradeModalOpen(true)}
              className={`group flex items-center gap-4 p-5 rounded-2xl border transition-all duration-300 ${
                isDark
                  ? "bg-blue-500/10 border-blue-500/30 text-blue-100 hover:bg-blue-500/20 hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] hover:-translate-y-1"
                  : "bg-blue-50 border-blue-200 text-blue-900 hover:bg-blue-100 hover:border-blue-300 hover:shadow-xl hover:-translate-y-1"
              }`}
            >
              <div
                className={`p-3 rounded-xl group-hover:rotate-180 transition-transform duration-700 ${
                  isDark
                    ? "bg-blue-500/20 text-blue-400"
                    : "bg-blue-100 text-blue-600"
                }`}
              >
                <ArrowClockwise size={24} />
              </div>
              <div className="flex flex-col items-start flex-1 text-left">
                <span className="text-sm font-black uppercase tracking-wider">
                  Renew Subscription
                </span>
                <span className="text-xs opacity-70 font-medium mt-1">
                  Ensure uninterrupted access
                </span>
              </div>
            </button>
          )}

          {/* Fallback View */}
          {!["trial", "expired", "suspended", "cancelled"].includes(status) && (
            <div
              className={`col-span-1 md:col-span-2 p-5 rounded-2xl border flex flex-col items-center justify-center gap-3 py-8 ${
                isDark
                  ? "bg-white/5 border-white/10 text-gray-400"
                  : "bg-gray-50 border-gray-200 text-gray-500"
              }`}
            >
              <ShieldCheck
                size={32}
                className={
                  status === "active"
                    ? isDark
                      ? "text-emerald-400"
                      : "text-emerald-600"
                    : "opacity-30"
                }
              />
              <span className="text-sm font-medium tracking-wide">
                {status === "active"
                  ? "Your license is active and fully operational"
                  : `Your license is currently ${status}`}
              </span>
            </div>
          )}
        </div>

        {isUpgradeModalOpen && (
          <UpgradePlanModal
            isOpen={isUpgradeModalOpen}
            onClose={() => setIsUpgradeModalOpen(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h4
          className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDark ? "text-gray-500" : "text-gray-400"}`}
        >
          Administrative Controls
        </h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => onStatusChange(action.id)}
            disabled={status === action.id}
            className={`group flex items-center gap-3 p-4 rounded-2xl border transition-all duration-300 ${
              status === action.id
                ? isDark
                  ? "bg-white/5 border-white/10 text-white opacity-50 cursor-not-allowed"
                  : "bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed"
                : isDark
                  ? "bg-black/40 border-white/5 text-gray-400 hover:border-white/20 hover:text-white"
                  : "bg-white border-gray-100 text-gray-600 hover:border-gray-300 hover:shadow-sm"
            }`}
          >
            <div
              className={`p-2 rounded-xl transition-colors ${
                status === action.id
                  ? "bg-gray-500/10"
                  : action.color === "emerald"
                    ? "bg-emerald-500/10 text-emerald-500"
                    : "bg-orange-500/10 text-orange-500"
              }`}
            >
              <action.icon size={18} />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xs font-bold uppercase tracking-wider">
                {action.label}
              </span>
              <span className="text-[10px] opacity-50 font-medium">
                Set status to {action.id}
              </span>
            </div>
          </button>
        ))}

        {status === "trial" && onConvertTrial && (
          <button
            onClick={onConvertTrial}
            className={`group flex items-center gap-3 p-4 rounded-2xl border transition-all duration-300 ${
              isDark
                ? "bg-purple-500/5 border-purple-500/20 text-purple-400 hover:bg-purple-500/10 hover:border-purple-500/40 hover:shadow-[0_0_15px_rgba(168,85,247,0.15)]"
                : "bg-purple-50 border-purple-100 text-purple-600 hover:bg-purple-100 hover:border-purple-200"
            }`}
          >
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
              <Lightning size={18} />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xs font-bold uppercase tracking-wider">
                Upgrade Trial
              </span>
              <span className="text-[10px] opacity-50 font-medium">
                Convert to paid license
              </span>
            </div>
          </button>
        )}

        {status !== "revoked" && onRenew && (
          <button
            onClick={onRenew}
            className={`group flex items-center gap-3 p-4 rounded-2xl border transition-all duration-300 ${
              isDark
                ? "bg-blue-500/5 border-blue-500/20 text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/40"
                : "bg-blue-50 border-blue-100 text-blue-600 hover:bg-blue-100 hover:border-blue-200"
            }`}
          >
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
              <ArrowClockwise size={18} />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xs font-bold uppercase tracking-wider">
                Force Renew
              </span>
              <span className="text-[10px] opacity-50 font-medium">
                Extend billing cycle
              </span>
            </div>
          </button>
        )}

        {status === "suspended" && onReactivate && (
          <button
            onClick={onReactivate}
            className={`group flex items-center gap-3 p-4 rounded-2xl border transition-all duration-300 ${
              isDark
                ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/40"
                : "bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-emerald-100 hover:border-emerald-200"
            }`}
          >
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <Play size={18} />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xs font-bold uppercase tracking-wider">
                Reactivate
              </span>
              <span className="text-[10px] opacity-50 font-medium">
                Lift suspension immediately
              </span>
            </div>
          </button>
        )}

        {/* Destructive Revoke Action */}
        <div className="relative col-span-1">
          <AnimatePresence mode="wait">
            {!isConfirmingRevoke ? (
              <motion.button
                key="revoke-btn"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={handleRevoke}
                disabled={status === "revoked"}
                className={`w-full group flex items-center gap-3 p-4 rounded-2xl border transition-all duration-300 ${
                  status === "revoked"
                    ? isDark
                      ? "bg-rose-500/5 border-rose-500/10 text-rose-500/50 cursor-not-allowed"
                      : "bg-rose-50 border-rose-100 text-rose-300 cursor-not-allowed"
                    : isDark
                      ? "bg-rose-500/5 border-rose-500/20 text-rose-500 hover:bg-rose-500/10 hover:border-rose-500/40 hover:shadow-[0_0_20px_rgba(244,63,94,0.1)]"
                      : "bg-rose-50 border-rose-100 text-rose-600 hover:bg-rose-100 hover:border-rose-200"
                }`}
              >
                <div className="p-2 rounded-xl bg-rose-500/10">
                  <Prohibit size={18} />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-xs font-black uppercase tracking-wider">
                    Revoke Key
                  </span>
                  <span className="text-[10px] opacity-60 font-medium">
                    Deauthorize access
                  </span>
                </div>
              </motion.button>
            ) : (
              <motion.div
                key="confirm-revoke"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={`w-full flex items-center justify-between p-3 rounded-2xl border ${
                  isDark
                    ? "bg-rose-500/10 border-rose-500/30"
                    : "bg-rose-50 border-rose-200"
                }`}
              >
                <div className="flex items-center gap-3 pl-1">
                  <Warning
                    size={18}
                    className="text-rose-500 animate-pulse"
                  />
                  <span
                    className={`text-[10px] font-black uppercase tracking-widest ${isDark ? "text-rose-200" : "text-rose-700"}`}
                  >
                    Are you sure?
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsConfirmingRevoke(false)}
                    className={`p-2 rounded-xl transition-colors ${
                      isDark
                        ? "hover:bg-white/10 text-white/60"
                        : "hover:bg-white text-gray-400"
                    }`}
                  >
                    <X size={16} />
                  </button>
                  <button
                    onClick={handleRevoke}
                    className="p-2 rounded-xl bg-rose-500 text-white shadow-lg shadow-rose-500/30 hover:bg-rose-600 transition-all active:scale-90"
                  >
                    <Check size={16} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
