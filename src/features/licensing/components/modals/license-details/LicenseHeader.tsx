import React from "react";
import { X, Key, User, Envelope } from "@phosphor-icons/react";
import { useRole } from "@/features/auth/hooks/useAuthorization";
import type { LicenseResponse } from "@/features/licensing/types";

interface LicenseHeaderProps {
  license: LicenseResponse;
  onClose: () => void;
}

const STATUS_STYLES: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  expired: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  trial: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  revoked: "bg-red-500/10 text-red-400 border-red-500/20",
};

export const LicenseHeader: React.FC<LicenseHeaderProps> = ({
  license,
  onClose,
}) => {
  const { isSuperAdmin } = useRole();
  const statusStyle = STATUS_STYLES[license.status] ?? "bg-gray-500/10 text-gray-400 border-gray-500/20";

  return (
    <div className="relative px-8 py-6 border-b border-white/8 flex items-start justify-between overflow-hidden shrink-0">
      {/* Gradient wash */}
      <div className="absolute inset-0 bg-linear-to-r from-amber-500/10 via-amber-600/8 to-transparent" />
      {/* Grid dots */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
          pointerEvents: "none",
        }}
      />
      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 h-px w-2/5 bg-linear-to-r from-amber-500/50 to-transparent" />

      <div className="relative z-10 flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-[#111] text-amber-400 border border-white/10 shadow-lg shadow-amber-500/10 mt-0.5">
          <Key size={22} />
        </div>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-xl font-black italic tracking-tighter text-white uppercase">
              {license.plan?.name ||
                (license.metadata?.product_name as string) ||
                license.license_key.substring(0, 16)}
            </h2>
            <span className={`px-2 py-0.5 rounded text-[10px] font-black border uppercase tracking-wider ${statusStyle}`}>
              {license.status}
            </span>
          </div>
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">
            {license.id}
          </p>

          {isSuperAdmin && (license.user_name || license.user_email) && (
            <div className="flex flex-wrap gap-4 mt-3">
              {license.user_name && (
                <div className="flex items-center gap-1.5 text-white/50 text-xs">
                  <User size={12} className="text-purple-400" />
                  {license.user_name}
                </div>
              )}
              {license.user_email && (
                <div className="flex items-center gap-1.5 text-white/50 text-xs">
                  <Envelope size={12} className="text-purple-400" />
                  {license.user_email}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="relative z-10">
        <button
          onClick={onClose}
          className="p-2 rounded-full transition-colors text-gray-400 hover:text-white hover:bg-white/10"
        >
          <X size={22} />
        </button>
      </div>
    </div>
  );
};