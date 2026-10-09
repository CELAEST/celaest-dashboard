import React from "react";
import { X, Key, User, Envelope, Check, Clock } from "@phosphor-icons/react";
import { useRole } from "@/features/auth/hooks/useAuthorization";
import type { LicenseResponse } from "@/features/licensing/types";

interface LicenseHeaderProps {
  license: LicenseResponse;
  onClose: () => void;
}

export const LicenseHeader: React.FC<LicenseHeaderProps> = ({
  license,
  onClose,
}) => {
  const { isSuperAdmin } = useRole();

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
    <div className="relative px-6 py-4.5 border-b border-white/8 flex items-start justify-between shrink-0 bg-white/[0.015]">
      <div className="relative z-10 flex items-start gap-3.5">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-white/[0.04] text-white/70 border border-white/8 mt-0.5">
          <Key size={16} />
        </div>
        <div>
          <div className="flex items-center gap-2.5 mb-1 flex-wrap">
            <h2 className="text-sm sm:text-base font-semibold tracking-tight text-zinc-100">
              {license.plan?.name ||
                (license.metadata?.product_name as string) ||
                license.license_key.substring(0, 16)}
            </h2>
            {renderStatus(license.status)}
          </div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-white/40">
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

      <div className="relative z-10">
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};