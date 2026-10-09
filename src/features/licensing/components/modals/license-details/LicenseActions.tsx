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
import { useTranslations } from "next-intl";

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
  const t = useTranslations("licensing");

  const handleRevoke = () => {
    if (!isConfirmingRevoke) {
      setIsConfirmingRevoke(true);
      return;
    }
    if (onRevoke) {
      onRevoke();
    } else {
      onStatusChange("revoked");
    }
    setIsConfirmingRevoke(false);
  };

  const actions = [
    { id: "active", icon: ShieldCheck, label: t("activate") },
    { id: "expired", icon: Clock, label: t("expire") },
  ];

  if (!isAdmin) {
    return (
      <div className="space-y-3">
        <h4
          className={`text-[10px] font-mono uppercase tracking-[0.16em] mb-2.5 ${
            isDark ? "text-white/40" : "text-gray-500"
          }`}
        >
          {t("license_management")}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {status === "trial" && (
            <button
              type="button"
              onClick={() => setIsUpgradeModalOpen(true)}
              className={`flex items-center gap-3.5 p-4 rounded-xl border transition-colors cursor-pointer text-left ${
                isDark
                  ? "bg-white/[0.03] border-white/8 text-zinc-200 hover:bg-white/[0.06] hover:border-white/15"
                  : "bg-white border-gray-200 text-gray-900 hover:border-gray-300 hover:shadow-xs"
              }`}
            >
              <div
                className={`p-2.5 rounded-lg shrink-0 border ${
                  isDark
                    ? "bg-white/[0.05] text-white/80 border-white/8"
                    : "bg-gray-100 text-gray-700 border-gray-200"
                }`}
              >
                <Lightning size={20} />
              </div>
              <div className="flex flex-col items-start min-w-0">
                <span className="text-xs font-semibold tracking-tight">
                  {t("upgrade_to_premium")}
                </span>
                <span className="text-[10px] font-mono text-white/40 mt-0.5 truncate">
                  {t("unlock_all_features")}
                </span>
              </div>
            </button>
          )}

          {["expired", "suspended", "cancelled"].includes(status) && (
            <button
              type="button"
              onClick={() => setIsUpgradeModalOpen(true)}
              className={`flex items-center gap-3.5 p-4 rounded-xl border transition-colors cursor-pointer text-left ${
                isDark
                  ? "bg-white/[0.03] border-white/8 text-zinc-200 hover:bg-white/[0.06] hover:border-white/15"
                  : "bg-white border-gray-200 text-gray-900 hover:border-gray-300 hover:shadow-xs"
              }`}
            >
              <div
                className={`p-2.5 rounded-lg shrink-0 border ${
                  isDark
                    ? "bg-white/[0.05] text-white/80 border-white/8"
                    : "bg-gray-100 text-gray-700 border-gray-200"
                }`}
              >
                <ArrowClockwise size={20} />
              </div>
              <div className="flex flex-col items-start min-w-0">
                <span className="text-xs font-semibold tracking-tight">
                  {t("renew_subscription")}
                </span>
                <span className="text-[10px] font-mono text-white/40 mt-0.5 truncate">
                  {t("ensure_uninterrupted_access")}
                </span>
              </div>
            </button>
          )}

          {/* Refined Obsidian Luxury Status Card */}
          {!["trial", "expired", "suspended", "cancelled"].includes(status) && (
            <div
              className={`col-span-1 md:col-span-2 p-5 rounded-xl border flex flex-col items-center justify-center gap-2 py-6 ${
                isDark
                  ? "bg-white/[0.02] border-white/8 text-zinc-200"
                  : "bg-gray-50 border-gray-200 text-gray-700"
              }`}
            >
              <ShieldCheck
                size={24}
                className={
                  status === "active"
                    ? isDark
                      ? "text-white/80"
                      : "text-gray-900"
                    : "text-white/30"
                }
              />
              <span className="text-xs font-medium tracking-tight">
                {status === "active"
                  ? t("license_active")
                  : t("license_status", { status })}
              </span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-white/40">
                CELAEST Security Verified
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
    <div className="space-y-3">
      <h4
        className={`text-[10px] font-mono uppercase tracking-[0.16em] mb-2.5 ${
          isDark ? "text-white/40" : "text-gray-500"
        }`}
      >
        {t("administrative_controls")}
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {actions.map((action) => (
          <button
            key={action.id}
            type="button"
            onClick={() => onStatusChange(action.id)}
            disabled={status === action.id}
            className={`flex items-center gap-3 p-3.5 rounded-xl border transition-colors ${
              status === action.id
                ? isDark
                  ? "bg-white/[0.01] border-white/5 text-white/30 cursor-not-allowed"
                  : "bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed"
                : isDark
                  ? "bg-white/[0.02] border-white/8 text-zinc-300 hover:bg-white/[0.05] hover:border-white/15 cursor-pointer"
                  : "bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:shadow-xs cursor-pointer"
            }`}
          >
            <div
              className={`p-2 rounded-lg shrink-0 border ${
                status === action.id
                  ? "bg-white/[0.02] border-white/5 text-white/30"
                  : "bg-white/[0.04] border-white/8 text-white/70"
              }`}
            >
              <action.icon size={16} />
            </div>
            <div className="flex flex-col items-start min-w-0">
              <span className="text-xs font-semibold tracking-tight">
                {action.label}
              </span>
              <span className="text-[10px] font-mono text-white/40 truncate">
                {t("set_status_to", { status: action.id })}
              </span>
            </div>
          </button>
        ))}

        {status === "trial" && onConvertTrial && (
          <button
            type="button"
            onClick={onConvertTrial}
            className={`flex items-center gap-3 p-3.5 rounded-xl border transition-colors cursor-pointer ${
              isDark
                ? "bg-white/[0.02] border-white/8 text-zinc-300 hover:bg-white/[0.05] hover:border-white/15"
                : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
            }`}
          >
            <div className="p-2 rounded-lg bg-white/[0.04] border border-white/8 text-white/70 shrink-0">
              <Lightning size={16} />
            </div>
            <div className="flex flex-col items-start min-w-0">
              <span className="text-xs font-semibold tracking-tight">
                {t("upgrade_trial")}
              </span>
              <span className="text-[10px] font-mono text-white/40 truncate">
                {t("convert_to_paid")}
              </span>
            </div>
          </button>
        )}

        {status !== "revoked" && onRenew && (
          <button
            type="button"
            onClick={onRenew}
            className={`flex items-center gap-3 p-3.5 rounded-xl border transition-colors cursor-pointer ${
              isDark
                ? "bg-white/[0.02] border-white/8 text-zinc-300 hover:bg-white/[0.05] hover:border-white/15"
                : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
            }`}
          >
            <div className="p-2 rounded-lg bg-white/[0.04] border border-white/8 text-white/70 shrink-0">
              <ArrowClockwise size={16} />
            </div>
            <div className="flex flex-col items-start min-w-0">
              <span className="text-xs font-semibold tracking-tight">
                {t("force_renew")}
              </span>
              <span className="text-[10px] font-mono text-white/40 truncate">
                {t("extend_billing_cycle")}
              </span>
            </div>
          </button>
        )}

        {status === "suspended" && onReactivate && (
          <button
            type="button"
            onClick={onReactivate}
            className={`flex items-center gap-3 p-3.5 rounded-xl border transition-colors cursor-pointer ${
              isDark
                ? "bg-white/[0.02] border-white/8 text-zinc-300 hover:bg-white/[0.05] hover:border-white/15"
                : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
            }`}
          >
            <div className="p-2 rounded-lg bg-white/[0.04] border border-white/8 text-white/70 shrink-0">
              <Play size={16} />
            </div>
            <div className="flex flex-col items-start min-w-0">
              <span className="text-xs font-semibold tracking-tight">
                {t("reactivate")}
              </span>
              <span className="text-[10px] font-mono text-white/40 truncate">
                {t("lift_suspension")}
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
                className={`w-full flex items-center gap-3 p-3.5 rounded-xl border transition-colors ${
                  status === "revoked"
                    ? isDark
                      ? "bg-red-500/5 border-red-500/10 text-red-500/40 cursor-not-allowed"
                      : "bg-red-50 border-red-100 text-red-300 cursor-not-allowed"
                    : isDark
                      ? "bg-red-500/5 border-red-500/20 text-red-300 hover:bg-red-500/10 hover:border-red-500/30 cursor-pointer"
                      : "bg-red-50 border-red-200 text-red-600 hover:bg-red-100 cursor-pointer"
                }`}
              >
                <div className="p-2 rounded-lg bg-red-500/10 text-red-400 shrink-0">
                  <Prohibit size={16} />
                </div>
                <div className="flex flex-col items-start min-w-0">
                  <span className="text-xs font-semibold tracking-tight">
                    {t("revoke_key")}
                  </span>
                  <span className="text-[10px] font-mono text-red-400/70 truncate">
                    {t("deauthorize_access")}
                  </span>
                </div>
              </motion.button>
            ) : (
              <motion.div
                key="confirm-revoke"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={`w-full flex items-center justify-between p-3 rounded-xl border ${
                  isDark
                    ? "bg-red-500/10 border-red-500/30"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex items-center gap-2 pl-1">
                  <Warning size={15} className="text-red-400" />
                  <span
                    className={`text-[10px] font-mono uppercase tracking-wider font-semibold ${
                      isDark ? "text-red-300" : "text-red-700"
                    }`}
                  >
                    {t("are_you_sure")}
                  </span>
                </div>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setIsConfirmingRevoke(false)}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      isDark
                        ? "hover:bg-white/10 text-white/60"
                        : "hover:bg-white text-gray-400"
                    }`}
                  >
                    <X size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={handleRevoke}
                    className="p-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors cursor-pointer"
                  >
                    <Check size={14} />
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
