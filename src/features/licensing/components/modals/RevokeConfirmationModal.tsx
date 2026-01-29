import React from "react";
import { AlertTriangle, ShieldX, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useEscapeKey } from "@/features/shared/hooks/useEscapeKey";

interface RevokeConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  licenseId: string;
  ipCount: number;
}

/**
 * A premium confirmation modal for destructive license revocation.
 * Follows SOLID principles by isolating the confirmation logic and UI.
 */
export const RevokeConfirmationModal: React.FC<
  RevokeConfirmationModalProps
> = ({ isOpen, onClose, onConfirm, licenseId, ipCount }) => {
  const { isDark } = useTheme();

  // Keyboard accessibility: Esc to close
  useEscapeKey(onClose, isOpen);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-2xl"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`relative w-full max-w-lg rounded-[32px] border overflow-hidden p-8 ${
              isDark
                ? "bg-[#0a0a0a]/90 border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                : "bg-white border-gray-100 shadow-2xl"
            }`}
          >
            {/* Decorative Header */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-rose-500 via-rose-400 to-rose-500" />

            <div className="flex flex-col items-center text-center gap-6">
              <div
                className={`w-20 h-20 rounded-3xl flex items-center justify-center rotate-3 transition-transform duration-500 hover:rotate-0 ${
                  isDark
                    ? "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                    : "bg-rose-50 text-rose-600 border border-rose-100"
                }`}
              >
                <ShieldX size={40} />
              </div>

              <div>
                <h2
                  className={`text-2xl font-black uppercase tracking-tighter italic ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  Authorization Revocation
                </h2>
                <p
                  className={`mt-2 text-sm font-medium px-4 ${isDark ? "text-gray-400" : "text-gray-500"}`}
                >
                  You are about to permanently deauthorize license{" "}
                  <span className="font-mono font-bold text-rose-500">
                    {licenseId}
                  </span>
                  . This action is irreversible and will immediately disconnect
                  all active clients.
                </p>
              </div>

              <div
                className={`w-full p-4 rounded-2xl flex items-start gap-4 text-left ${
                  isDark
                    ? "bg-white/3 border border-white/5"
                    : "bg-gray-50 border border-gray-100"
                }`}
              >
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p
                    className={`text-[10px] font-black uppercase tracking-widest ${isDark ? "text-amber-500/80" : "text-amber-600"}`}
                  >
                    System Warning
                  </p>
                  <p className="text-xs text-gray-500 font-medium mt-0.5 leading-relaxed">
                    Revoking this license will impact {ipCount} users currently
                    active on the network.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 w-full gap-4 mt-4">
                <button
                  onClick={onClose}
                  className={`px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${
                    isDark
                      ? "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                  }`}
                >
                  Cancel Protocol
                </button>
                <button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className={`px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-lg active:scale-95 ${
                    isDark
                      ? "bg-rose-500 text-white hover:bg-rose-600 shadow-rose-500/25"
                      : "bg-rose-600 text-white hover:bg-rose-700 shadow-rose-600/30"
                  }`}
                >
                  Confirm Deauthorization
                </button>
              </div>
            </div>

            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 transition-colors text-gray-500 hover:text-white"
            >
              <X size={20} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
