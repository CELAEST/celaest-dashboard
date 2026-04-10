import { logger } from "@/lib/logger";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  CircleNotch,
  Copy,
  Check,
  ShieldCheck,
  Calendar,
  HardDrives,
  Warning,
} from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { assetsService } from "@/features/assets/services/assets.service";
import { useApiAuth } from "@/lib/use-api-auth";
import { toast } from "sonner";

interface LicenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  licenseId: string | null;
  productName?: string;
}

interface LicenseDetails {
  id: string;
  license_key: string;
  status: string;
  starts_at?: string;
  expires_at?: string;
  billing_cycle?: string;
  plan?: {
    id: string;
    code: string;
    name: string;
  };
  activation_count?: number;
  max_activations?: number;
}

export const LicenseModal: React.FC<LicenseModalProps> = ({
  isOpen,
  onClose,
  licenseId,
  productName,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { token } = useApiAuth();

  const [loading, setLoading] = useState(false);
  const [license, setLicense] = useState<LicenseDetails | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setLicense(null);
      return;
    }

    if (!licenseId || !token) return;

    if (licenseId === "OWNER_PREVIEW") {
      setLicense({
        id: "owner-preview-id",
        license_key: "DEV-MODE-BYPASS-KEY-0000",
        status: "owner",
        starts_at: new Date().toISOString(),
        plan: { id: "dev", code: "dev", name: "Developer / Inventory Owner" },
        activation_count: 0,
        max_activations: 999,
      });
      return;
    }

    const fetchLicense = async () => {
      setLoading(true);
      try {
        const response = await assetsService.getLicense(token, licenseId);
        if (response && response.license_key) {
          setLicense({
            id: response.id,
            license_key: response.license_key,
            status: response.status || "active",
            starts_at: response.activated_at,
            expires_at: response.expires_at,
            plan: {
              id: "standard",
              code: "std",
              name:
                response.status === "owner"
                  ? "Developer/Owner License"
                  : "Standard License",
            },
            activation_count: 0,
            max_activations: response.status === "owner" ? 999 : 1,
          });
        }
      } catch (error: unknown) {
        logger.error("[LicenseModal] Error fetching license:", error);
        toast.error("No se pudo cargar la licencia.");
      } finally {
        setLoading(false);
      }
    };

    fetchLicense();
  }, [isOpen, licenseId, token]);

  const handleCopy = () => {
    if (license?.license_key) {
      navigator.clipboard.writeText(license.license_key);
      setCopied(true);
      toast.success("Licencia copiada al portapapeles");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDeactivate = async () => {
    if (!license?.license_key || !token) return;

    if (
      !confirm(
        "¿Está seguro de que desea desactivar todas las sesiones de esta licencia?",
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_CELAEST_API_URL || "http://localhost:3001";
      const res = await fetch(`${baseUrl}/api/v1/public/licenses/deactivate`, {
        method: "POST",
        headers: { "Content-TextT": "application/json" },
        body: JSON.stringify({ license_key: license.license_key }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error?.message || "Deactivation failed");
      }

      toast.success("Activaciones reseteadas. Licencia lista para nueva activación.");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error desconocido";
      toast.error(`Error al desactivar: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  const statusColor =
    license?.status === "active" || license?.status === "owner"
      ? "bg-emerald-500"
      : "bg-yellow-500";

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.75)",
              backdropFilter: "blur(8px)",
            }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: "spring", duration: 0.45, bounce: 0.2 }}
            style={{
              position: "relative",
              zIndex: 10,
              flexShrink: 0,
              width: "100%",
              maxWidth: "30rem",
              margin: "0 1rem",
              borderRadius: "1.5rem",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              boxShadow: isDark
                ? "0 30px 60px -12px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.08)"
                : "0 30px 60px -12px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.08)",
              background: isDark ? "#0a0a0a" : "#ffffff",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top accent line */}
            <div
              className={`absolute inset-x-0 top-0 h-px z-20 ${
                isDark
                  ? "bg-linear-to-r from-transparent via-emerald-500/70 to-transparent"
                  : "bg-linear-to-r from-transparent via-emerald-400/60 to-transparent"
              }`}
            />

            {/* Corner glow */}
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: "18rem",
                height: "18rem",
                background: isDark
                  ? "radial-gradient(circle at top right, rgba(16,185,129,0.06), transparent 70%)"
                  : "radial-gradient(circle at top right, rgba(16,185,129,0.05), transparent 70%)",
                pointerEvents: "none",
                zIndex: 0,
              }}
            />

            {/* Header */}
            <div
              className="relative px-7 py-5 flex items-center justify-between overflow-hidden shrink-0"
              style={{
                borderBottom: isDark
                  ? "1px solid rgba(255,255,255,0.07)"
                  : "1px solid rgba(0,0,0,0.08)",
              }}
            >
              {/* Gradient wash */}
              <div
                className={`absolute inset-0 ${
                  isDark
                    ? "bg-linear-to-r from-emerald-500/10 via-teal-600/8 to-transparent"
                    : "bg-linear-to-r from-emerald-50 via-teal-50/60 to-transparent"
                }`}
              />
              {/* Grid dots */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: isDark
                    ? "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)"
                    : "radial-gradient(circle, rgba(0,0,0,0.03) 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                  pointerEvents: "none",
                }}
              />
              {/* Bottom accent */}
              <div
                className={`absolute bottom-0 left-0 h-px w-2/5 ${
                  isDark
                    ? "bg-linear-to-r from-emerald-500/50 to-transparent"
                    : "bg-linear-to-r from-emerald-400/30 to-transparent"
                }`}
              />

              <div className="relative z-10 flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-lg shrink-0 ${
                    isDark
                      ? "bg-[#111] text-emerald-400 border border-white/10 shadow-emerald-500/10"
                      : "bg-white text-emerald-600 border border-emerald-100 shadow-emerald-200/40"
                  }`}
                >
                  <ShieldCheck size={22} weight="duotone" />
                </div>
                <div>
                  <h2
                    className={`text-lg font-bold leading-tight ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Detalles de Licencia
                  </h2>
                  <p
                    className={`text-xs mt-0.5 ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {license?.status === "owner"
                      ? "Licencia de desarrollador"
                      : productName
                        ? `Licencia para ${productName}`
                        : "Tu licencia activa"}
                  </p>
                </div>
              </div>

              <div className="relative z-10">
                <button
                  onClick={onClose}
                  aria-label="Cerrar modal de licencia"
                  className={`p-2 rounded-full transition-colors ${
                    isDark
                      ? "hover:bg-white/10 text-gray-400 hover:text-white"
                      : "hover:bg-black/5 text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <CircleNotch
                    className={`w-8 h-8 animate-spin ${isDark ? "text-emerald-400" : "text-emerald-600"}`}
                  />
                  <p
                    className={`text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}
                  >
                    Cargando detalles...
                  </p>
                </div>
              ) : license ? (
                <>
                  {/* License Key */}
                  <div
                    className={`p-4 rounded-xl border ${
                      isDark
                        ? "bg-white/3 border-white/8"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <label
                      className={`text-[10px] font-bold uppercase tracking-widest mb-2 block ${
                        isDark ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      License Key
                    </label>
                    <div className="flex items-center justify-between gap-2">
                      <code
                        className={`font-mono text-base font-bold truncate ${
                          isDark ? "text-emerald-400" : "text-emerald-600"
                        }`}
                      >
                        {license.license_key}
                      </code>
                      <button
                        onClick={handleCopy}
                        aria-label={copied ? "Licencia copiada" : "Copiar licencia al portapapeles"}
                        className={`p-1.5 rounded-lg transition-colors shrink-0 ${
                          isDark
                            ? "hover:bg-emerald-500/10 text-gray-400 hover:text-emerald-400"
                            : "hover:bg-emerald-50 text-gray-400 hover:text-emerald-600"
                        }`}
                      >
                        {copied ? (
                          <Check className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Details grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div
                      className={`p-3 rounded-xl ${
                        isDark ? "bg-white/3 border border-white/8" : "bg-gray-50 border border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className={`w-2 h-2 rounded-full ${statusColor}`} />
                        <span
                          className={`text-[10px] font-bold uppercase tracking-widest ${
                            isDark ? "text-gray-500" : "text-gray-400"
                          }`}
                        >
                          Estado
                        </span>
                      </div>
                      <p
                        className={`text-sm font-semibold capitalize ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {license.status}
                      </p>
                    </div>

                    <div
                      className={`p-3 rounded-xl ${
                        isDark ? "bg-white/3 border border-white/8" : "bg-gray-50 border border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <HardDrives
                          className={`w-3 h-3 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                        />
                        <span
                          className={`text-[10px] font-bold uppercase tracking-widest ${
                            isDark ? "text-gray-500" : "text-gray-400"
                          }`}
                        >
                          Plan
                        </span>
                      </div>
                      <p
                        className={`text-sm font-semibold truncate ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {license.plan?.name || "Standard"}
                      </p>
                    </div>

                    <div
                      className={`p-3 rounded-xl col-span-2 ${
                        isDark ? "bg-white/3 border border-white/8" : "bg-gray-50 border border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Calendar
                          className={`w-3 h-3 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                        />
                        <span
                          className={`text-[10px] font-bold uppercase tracking-widest ${
                            isDark ? "text-gray-500" : "text-gray-400"
                          }`}
                        >
                          Validez
                        </span>
                      </div>
                      <p
                        className={`text-sm font-semibold ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {license.expires_at
                          ? new Date(license.expires_at).toLocaleDateString()
                          : "Lifetime (Sin expiración)"}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div
                  className={`py-10 text-center rounded-xl border-2 border-dashed ${
                    isDark ? "border-white/8 text-gray-500" : "border-gray-200 text-gray-400"
                  }`}
                >
                  <Warning className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No se encontraron detalles de la licencia.</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div
              className={`px-6 pb-6 flex items-center gap-3 ${
                license?.status === "owner" ? "justify-between" : "justify-end"
              }`}
            >
              {license?.status === "owner" && (
                <button
                  onClick={handleDeactivate}
                  disabled={loading}
                  className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-colors border disabled:opacity-50 ${
                    isDark
                      ? "text-red-400 border-red-500/20 hover:bg-red-500/10"
                      : "text-red-600 border-red-200 hover:bg-red-50"
                  }`}
                >
                  Resetear Activaciones
                </button>
              )}
              <button
                onClick={onClose}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  isDark
                    ? "bg-white/8 text-gray-300 hover:bg-white/12 border border-white/10"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                }`}
              >
                Cerrar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
};
