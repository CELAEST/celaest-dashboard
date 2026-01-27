import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import {
  License,
  ValidationLog,
} from "@/features/licensing/constants/mock-data";
import { LicenseHeader } from "./license-details/LicenseHeader";
import { LicenseActions } from "./license-details/LicenseActions";
import { LicenseStats } from "./license-details/LicenseStats";
import { LicenseBindings } from "./license-details/LicenseBindings";
import { LicenseActivityLog } from "./license-details/LicenseActivityLog";

interface LicenseDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  license: License | null;
  logs: ValidationLog[];
  onStatusChange: (status: string) => void;
  onUnbindIp: (ip: string) => void;
}

export const LicenseDetailsModal = ({
  isOpen,
  onClose,
  license,
  logs,
  onStatusChange,
  onUnbindIp,
}: LicenseDetailsModalProps) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  if (!license) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden pointer-events-auto flex flex-col max-h-[85vh] ${
                isDark
                  ? "bg-[#0a0a0a] border border-white/10"
                  : "bg-white border border-gray-200"
              }`}
            >
              <LicenseHeader license={license} onClose={onClose} />

              <div className="p-6 overflow-y-auto custom-scrollbar space-y-8">
                <LicenseActions
                  status={license.status}
                  onStatusChange={onStatusChange}
                />

                <LicenseStats
                  tier={license.metadata?.tier}
                  maxIpSlots={license.maxIpSlots}
                />

                <LicenseBindings
                  bindings={license.ipBindings}
                  onUnbind={onUnbindIp}
                />

                <LicenseActivityLog logs={logs} />
              </div>

              {/* Footer */}
              <div
                className={`p-4 border-t text-xs text-center ${
                  isDark
                    ? "border-white/10 text-gray-500"
                    : "border-gray-200 text-gray-400"
                }`}
              >
                License Key: •••••-•••••-{license.id.split("_")[1] || "XXXX"}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
