import React from "react";
import { X, Key, User, Envelope, Check, Clock } from "@phosphor-icons/react";
import { useRole } from "@/features/auth/hooks/useAuthorization";
import type { LicenseResponse } from "@/features/licensing/types";
import { useBillingModalSwipe } from "@/features/billing/components/modals/shared/BillingModal";

interface LicenseHeaderProps {
  license: LicenseResponse;
  onClose: () => void;
}

export const LicenseHeader: React.FC<LicenseHeaderProps> = ({
  license,
  onClose,
}) => {
  const { isSuperAdmin } = useRole();
  const swipe = useBillingModalSwipe();

  const renderStatus = (status: string) => {
    if (status === "active") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-wider bg-white/[0.08] text-white border border-white/10 font-semibold shadow-xs">
          <Check size={10} strokeWidth={3} className="text-white/80" />
          {status}
        </span>
      );
    }
    if (status === "revoked") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-wider bg-red-500/10 text-red-300 border border-red-500/20 font-medium">
          <X size={10} strokeWidth={3} className="text-red-400" />
          {status}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-wider bg-white/[0.04] text-white/60 border border-white/[0.06] font-medium">
        <Clock size={10} className="text-white/40" />
        {status}
      </span>
    );
  };

  return (
    <div
      onTouchStart={swipe?.handleTouchStart}
      onTouchMove={swipe?.handleTouchMove}
      onTouchEnd={swipe?.handleTouchEnd}
      onPointerDown={swipe?.handlePointerDown}
      onPointerMove={swipe?.handlePointerMove}
      onPointerUp={swipe?.handlePointerUp}
      className="relative px-4 sm:px-6 py-3.5 sm:py-4.5 border-b border-white/8 flex items-start justify-between shrink-0 bg-white/[0.015] select-none cursor-grab active:cursor-grabbing touch-none"
    >
      <div className="relative z-10 flex items-start gap-3 sm:gap-3.5 min-w-0 pointer-events-none">
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 bg-white/[0.04] text-white/70 border border-white/8 mt-0.5">
          <Key size={15} />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 sm:gap-2.5 mb-1 flex-wrap">
            <h2 className="text-sm sm:text-base font-semibold tracking-tight text-zinc-100 truncate max-w-[180px] sm:max-w-none">
              {license.plan?.name ||
                (license.metadata?.product_name as string) ||
                license.license_key.substring(0, 16)}
            </h2>
            {renderStatus(license.status)}
          </div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-white/40 truncate">
            {license.id}
          </p>

          {isSuperAdmin && (license.user_name || license.user_email) && (
            <div className="flex flex-wrap gap-4 mt-2.5">
              {license.user_name && (
                <div className="flex items-center gap-1.5 text-white/60 text-xs font-mono">
                  <User size={12} className="text-white/40" />
                  {license.user_name}
                </div>
              )}
              {license.user_email && (
                <div className="flex items-center gap-1.5 text-white/60 text-xs font-mono">
                  <Envelope size={12} className="text-white/40" />
                  {license.user_email}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="relative z-10 shrink-0">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          onTouchEnd={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};