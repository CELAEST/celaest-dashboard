"use client";
import React from "react";
import { Key, Copy } from "@phosphor-icons/react";
import { BillingModal, useBillingModalSwipe } from "@/features/billing/components/modals/shared/BillingModal";
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

function LicenseDetailsBody({
  license,
  logs,
  onStatusChange,
  onUnbindIp,
  onRevoke,
  onRenew,
  onConvertTrial,
  onReactivate,
}: {
  license: LicenseResponse;
  logs: ValidationLog[];
  onStatusChange: (status: string) => void;
  onUnbindIp: (ip: string) => void;
  onRevoke?: () => void;
  onRenew?: () => void;
  onConvertTrial?: () => void;
  onReactivate?: () => void;
}) {
  const swipe = useBillingModalSwipe();

  return (
    <div
      ref={swipe?.bodyRef}
      onTouchStart={swipe?.handleBodyTouchStart}
      onTouchMove={swipe?.handleBodyTouchMove}
      onTouchEnd={swipe?.handleBodyTouchEnd}
      className="p-4 sm:p-6 overflow-y-auto flex-1 min-h-0 space-y-5 sm:space-y-7 pb-[max(1.5rem,env(safe-area-inset-bottom))]"
    >
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
  );
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
    <BillingModal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-2xl max-h-[92dvh] sm:max-h-[88vh]"
      showCloseButton={false}
    >
      <LicenseHeader license={license} onClose={onClose} />

      <LicenseDetailsBody
        license={license}
        logs={logs}
        onStatusChange={onStatusChange}
        onUnbindIp={onUnbindIp}
        onRevoke={onRevoke}
        onRenew={onRenew}
        onConvertTrial={onConvertTrial}
        onReactivate={onReactivate}
      />

      {/* Footer Obsidian Luxury */}
      <div className="relative shrink-0 border-t border-white/6 bg-white/[0.015] px-4 sm:px-6 py-3 sm:py-3.5 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 sm:gap-4 pb-[max(0.875rem,env(safe-area-inset-bottom))]">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-white/[0.04] text-white/70 border border-white/8">
            <Key size={14} />
          </div>
          <div className="flex flex-col min-w-0">
            <p className="text-[9px] font-mono uppercase tracking-[0.16em] text-white/40 mb-0.5">{t("license_key")}</p>
            <div className="flex items-center gap-2 min-w-0">
              <p className="text-xs font-mono text-zinc-300 tracking-wider truncate">
                {maskLicenseKey(license.license_key)}
              </p>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(license.license_key);
                  toast.success(t("copied_to_clipboard") || "Copiado al portapapeles");
                }}
                className="text-white/40 hover:text-white transition-colors p-1 cursor-pointer shrink-0"
                title="Copiar clave"
              >
                <Copy size={13} />
              </button>
            </div>
          </div>
        </div>
        <div className="text-[10px] font-mono uppercase tracking-wider text-white/60 bg-white/[0.04] border border-white/8 px-2.5 py-1 rounded-md font-medium shrink-0">
          {t("licensed")}
        </div>
      </div>
    </BillingModal>
  );
};