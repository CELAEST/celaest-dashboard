"use client";
import { logger } from "@/lib/logger";
import React, { useState } from "react";
import { X, Sparkle } from "@phosphor-icons/react";
import { BillingModal } from "@/features/billing/components/modals/shared/BillingModal";
import { useCreateLicense, LicenseFormData } from "@/features/licensing/hooks/useCreateLicense";
import { LicenseForm } from "./create-license/LicenseForm";
import { LicenseSuccess } from "./create-license/LicenseSuccess";
import { Form } from "@/components/ui/form";

interface CreateLicenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (licenseData: LicenseFormData) => Promise<string>;
}

export const CreateLicenseModal = ({
  isOpen,
  onClose,
  onCreate,
}: CreateLicenseModalProps) => {
  const { form, resetForm: hookReset } = useCreateLicense(() => {});
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [createdKey, setCreatedKey] = useState("");

  const onSubmit = async (data: LicenseFormData) => {
    setLoading(true);
    try {
      const key = await onCreate(data);
      setCreatedKey(key || "key_mock_" + Date.now());
      setStep(3);
    } catch (error: unknown) {
      logger.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setCreatedKey("");
    hookReset();
    onClose();
  };

  return (
    <BillingModal isOpen={isOpen} onClose={handleClose} className="max-w-128" showCloseButton={false}>
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

      {/* Header */}
      <div className="relative px-8 py-6 border-b border-white/8 flex items-center justify-between overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-linear-to-r from-amber-500/10 via-amber-600/8 to-transparent" />
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
            pointerEvents: "none",
          }}
        />
        <div className="absolute bottom-0 left-0 h-px w-2/5 bg-linear-to-r from-amber-500/50 to-transparent" />

        <div className="relative z-10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-[#111] text-amber-400 border border-white/10 shadow-lg shadow-amber-500/10">
            <Sparkle size={22} />
          </div>
          <div>
            <h2 className="text-xl font-black italic tracking-tighter text-white uppercase">
              Generate License
            </h2>
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">
              Create a new license key for your product
            </p>
          </div>
        </div>

        <div className="relative z-10">
          <button
            onClick={handleClose}
            className="p-2 rounded-full transition-colors text-gray-400 hover:text-white hover:bg-white/10"
          >
            <X size={22} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-6 flex-1 min-h-0 overflow-y-auto">
        {step === 1 && (
          <Form {...form}>
            <LicenseForm form={form} loading={loading} />
          </Form>
        )}
        {step === 3 && (
          <LicenseSuccess
            createdKey={createdKey}
            onCopy={() => navigator.clipboard.writeText(createdKey)}
            onClose={handleClose}
          />
        )}
      </div>

      {/* Footer */}
      {step === 1 && (
        <div className="relative shrink-0 overflow-hidden">
          {/* Amber top accent */}
          <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-amber-500/50 to-transparent" />
          {/* Amber bottom glow */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "18rem",
              height: "8rem",
              background: "radial-gradient(circle at bottom left, rgba(245,158,11,0.07), transparent 70%)",
              pointerEvents: "none",
            }}
          />
          <div className="relative px-8 py-5 flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 py-3 rounded-2xl bg-white/5 border border-white/10 text-white/60 text-sm font-semibold hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={form.handleSubmit(onSubmit)}
              disabled={loading}
              className="flex-1 py-3 rounded-2xl bg-linear-to-r from-amber-500 to-amber-600 text-black text-sm font-black uppercase tracking-wide shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkle size={16} className="shrink-0" />
                  Generate Key
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </BillingModal>
  );
};
