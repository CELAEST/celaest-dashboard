import React, { useState } from "react";
import { ShieldCheck, Clock, Ban, AlertTriangle, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "@/features/shared/hooks/useTheme";

interface LicenseActionsProps {
  status: string;
  onStatusChange: (status: string) => void;
}

export const LicenseActions: React.FC<LicenseActionsProps> = ({
  status,
  onStatusChange,
}) => {
  const { isDark } = useTheme();
  const [isConfirmingRevoke, setIsConfirmingRevoke] = useState(false);

  const handleRevoke = () => {
    if (!isConfirmingRevoke) {
      setIsConfirmingRevoke(true);
      return;
    }
    onStatusChange("revoked");
    setIsConfirmingRevoke(false);
  };

  const actions = [
    { id: "active", icon: ShieldCheck, label: "Activate", color: "emerald" },
    { id: "expired", icon: Clock, label: "Expire", color: "orange" },
  ];

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
                  <Ban size={18} />
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
                  <AlertTriangle
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
