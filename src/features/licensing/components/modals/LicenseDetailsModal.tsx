"use client";
import React from "react";
import { Key, Copy } from "@phosphor-icons/react";
import { BillingModal } from "@/features/billing/components/modals/shared/BillingModal";
import { ValidationLog } from "@/features/licensing/constants/mock-data";
import type { LicenseResponse } from "@/features/licensing/types";
import { LicenseHeader } from "./license-details/LicenseHeader";
import { LicenseActions } from "./license-details/LicenseActions";
import { LicenseStats } from "./license-details/LicenseStats";
import { LicenseBindings } from "./license-details/LicenseBindings";
import { LicenseActivityLog } from "./license-details/LicenseActivityLog";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

interface LicenseDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  license: LicenseResponse | null;
  logs: ValidationLog[];
  onStatusChange: (status: string) => void;
  onUnbindIp: (ip: string) => void;
  onRevoke?: () => void;
  onRenew?: () => void;
  onConvertTrial?: () => void;
  onReactivate?: () => void;
}

export const LicenseDetailsModal = ({
  isOpen,
  onClose,
  license,
  logs,
  onStatusChange,
  onUnbindIp,
  onRevoke,
  onRenew,
  onConvertTrial,
  onReactivate,
}: LicenseDetailsModalProps) => {
  const t = useTranslations("licensing");

  const maskLicenseKey = (key?: string) => {
    if (!key) return "••••-••••-••••";
    const parts = key.split("-");
    if (parts.length < 2) return "••••" + key.slice(-4);
    const lastPart = parts[parts.length - 1];
    return `${parts[0]}-••••-••••-${lastPart}`;
  };

  if (!license) return null;

  return (
    <BillingModal isOpen={isOpen} onClose={onClose} className="max-w-2xl" showCloseButton={false}>
      {/* Top accent line */}
      <div className="absolute inset-x-0 top-0 h-px z-20 bg-linear-to-r from-transparent via-amber-500/70 to-transparent" />
      {/* Corner glow */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "22rem",
          height: "22rem",
          background: "radial-gradient(circle at top right, rgba(6,182,212,0.06), transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <LicenseHeader license={license} onClose={onClose} />

      <div className="p-6 overflow-y-auto flex-1 min-h-0 space-y-8">
        <LicenseStats
          tier={license.plan?.code}
          maxIpSlots={license.ip_bindings?.length || 0}
          startsAt={license.starts_at}
          expiresAt={license.expires_at}
        />

        <LicenseBindings
          bindings={license.ip_bindings || []}
          onUnbind={onUnbindIp}
        />

        <LicenseActivityLog logs={logs} />

        <LicenseActions
          status={license.status}
          onStatusChange={onStatusChange}
          onRevoke={onRevoke}
          onRenew={onRenew}
          onConvertTrial={onConvertTrial}
          onReactivate={onReactivate}
        />
      </div>

      {/* Footer */}
      <div className="relative shrink-0 overflow-hidden">
        {/* Amber top accent */}
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-amber-500/50 to-transparent" />
        {/* Amber bottom glow */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "16rem",
            height: "7rem",
            background: "radial-gradient(circle at bottom left, rgba(245,158,11,0.07), transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div className="relative px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Key size={14} />
            </div>
            <div className="flex flex-col">
              <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/30 mb-0.5">{t("license_key")}</p>
              <div className="flex items-center gap-2">
                <p className="text-sm font-mono text-white/60 tracking-wider">
                  {maskLicenseKey(license.license_key)}
                </p>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(license.license_key);
                    toast.success(t("copied_to_clipboard") || "Copiado al portapapeles");
                  }}
                  className="text-amber-500 hover:text-amber-400 transition-colors p-1"
                  title="Copiar clave"
                >
                  <Copy size={14} />
                </button>
              </div>
            </div>
          </div>
          <div className="text-[9px] font-mono uppercase tracking-[0.15em] text-amber-400/70 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg">
            {t("licensed")}
          </div>
        </div>
      </div>
    </BillingModal>
  );
};