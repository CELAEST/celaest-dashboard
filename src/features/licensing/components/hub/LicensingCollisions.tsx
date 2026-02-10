import React, { useState } from "react";
import { Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import type { IPBinding } from "@/features/licensing/types";
import { CollisionCard } from "./CollisionCard";
import { RevokeConfirmationModal } from "../modals/RevokeConfirmationModal";

interface LicensingCollisionsProps {
  collisions: IPBinding[];
  onRevoke: (licenseId: string) => void;
}

/**
 * LicensingCollisions component refactored for SOLID and DRY principles.
 * Manages the list of collisions and the revocation confirmation state.
 * Adapts to full width with responsive padding.
 */
export const LicensingCollisions: React.FC<LicensingCollisionsProps> = ({
  collisions,
  onRevoke,
}) => {
  const { isDark } = useTheme();
  const [selectedCollision, setSelectedCollision] = useState<IPBinding | null>(
    null,
  );

  const handleConfirmRevoke = () => {
    if (selectedCollision) {
      onRevoke(selectedCollision.ip_address);
      setSelectedCollision(null);
    }
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col space-y-6">
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-6 pb-4">
        <AnimatePresence mode="popLayout">
          {collisions.length === 0 ? (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`text-center py-24 rounded-3xl border border-dashed transition-colors duration-500 ${
                isDark
                  ? "border-white/10 bg-white/2"
                  : "border-gray-200 bg-gray-50/50"
              }`}
            >
              <div className="flex flex-col items-center gap-6">
                <div
                  className={`p-5 rounded-full ${isDark ? "bg-white/5" : "bg-white shadow-sm"}`}
                >
                  <Check className="w-10 h-10 text-emerald-500" />
                </div>
                <div className="space-y-2">
                  <h3
                    className={`text-xl font-black uppercase tracking-tighter italic ${isDark ? "text-white" : "text-gray-900"}`}
                  >
                    System Integrous
                  </h3>
                  <p className="text-sm text-gray-500 font-medium max-w-[280px] mx-auto leading-relaxed">
                    No active IP collisions detected in the current
                    authorization cluster.
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            collisions.map((collision, index) => (
              <CollisionCard
                key={collision.ip_address}
                collision={collision}
                index={index}
                onRevokeClick={setSelectedCollision}
              />
            ))
          )}
        </AnimatePresence>
      </div>

      <RevokeConfirmationModal
        isOpen={!!selectedCollision}
        onClose={() => setSelectedCollision(null)}
        onConfirm={handleConfirmRevoke}
        licenseId={selectedCollision?.license_id || ""}
        ipCount={1}
      />
    </div>
  );
};
