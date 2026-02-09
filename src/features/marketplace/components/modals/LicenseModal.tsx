import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Copy,
  Check,
  ShieldCheck,
  Calendar,
  Server,
} from "lucide-react";
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
    const fetchLicense = async () => {
      if (!licenseId || !token) return;

      // Special case: Owner Preview (Mock for Inventory Items)
      if (licenseId === "OWNER_PREVIEW") {
        setLicense({
          id: "owner-preview",
          license_key: "DEV-OWNER-KEY-2026-X7Y8",
          status: "active",
          starts_at: new Date().toISOString(),
          plan: { id: "dev", code: "dev", name: "Developer License" },
          activation_count: 0,
          max_activations: 999,
        });
        return;
      }

      setLoading(true);
      try {
        console.log("[LicenseModal] Fetching license for ID:", licenseId);
        const response = await assetsService.getLicense(token, licenseId);
        console.log("[LicenseModal] Received response:", response);
        // Map BackendLicense (response) to LicenseDetails (state)
        if (response && response.license_key) {
          setLicense({
            id: response.id,
            license_key: response.license_key,
            status: response.status || "active",
            starts_at: response.activated_at,
            expires_at: response.expires_at,
            plan: { id: "standard", code: "std", name: "Standard License" }, // Default plan info
            activation_count: 0,
            max_activations: 1,
          });
        } else {
          console.warn(
            "[LicenseModal] Response missing license_key:",
            response,
          );
        }
      } catch (error) {
        console.error("[LicenseModal] Error fetching license:", error);
        toast.error("No se pudo cargar la licencia");
        // Don't auto-close, let the user see the error state or try again if we added a retry
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && licenseId && token) {
      fetchLicense();
    } else {
      setLicense(null);
    }
  }, [isOpen, licenseId, token, onClose]);

  const handleCopy = () => {
    if (license?.license_key) {
      navigator.clipboard.writeText(license.license_key);
      setCopied(true);
      toast.success("Licencia copiada al portapapeles");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`sm:max-w-md ${isDark ? "bg-gray-900 text-white border-gray-800" : "bg-white text-gray-900"}`}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            Detalles de Licencia
          </DialogTitle>
          <DialogDescription>
            {licenseId === "OWNER_PREVIEW"
              ? "Vista previa de clave para desarrollador/dueño"
              : productName
                ? `Licencia para ${productName}`
                : "Información de tu licencia activa"}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mb-2" />
            <p className="text-sm text-gray-500">Cargando detalles...</p>
          </div>
        ) : license ? (
          <div className="space-y-4 py-2">
            {/* License Key Box */}
            <div
              className={`p-4 rounded-lg border ${isDark ? "bg-gray-950 border-gray-800" : "bg-gray-50 border-gray-200"}`}
            >
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">
                License Key
              </label>
              <div className="flex items-center justify-between gap-2">
                <code
                  className={`font-mono text-lg font-bold truncate ${isDark ? "text-emerald-400" : "text-emerald-600"}`}
                >
                  {license.license_key}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopy}
                  className="h-8 w-8 shrink-0 hover:bg-emerald-500/10 hover:text-emerald-500"
                >
                  {copied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div
                className={`p-3 rounded-md ${isDark ? "bg-gray-800/50" : "bg-gray-50"}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      license.status === "active"
                        ? "bg-emerald-500"
                        : "bg-yellow-500"
                    }`}
                  />
                  <span className="text-xs text-gray-500 font-medium">
                    ESTADO
                  </span>
                </div>
                <p className="font-semibold capitalize">{license.status}</p>
              </div>

              <div
                className={`p-3 rounded-md ${isDark ? "bg-gray-800/50" : "bg-gray-50"}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Server className="w-3 h-3 text-gray-500" />
                  <span className="text-xs text-gray-500 font-medium">
                    PLAN
                  </span>
                </div>
                <p className="font-semibold truncate">
                  {license.plan?.name || "Standard"}
                </p>
              </div>

              <div
                className={`p-3 rounded-md ${isDark ? "bg-gray-800/50" : "bg-gray-50"} col-span-2`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-3 h-3 text-gray-500" />
                  <span className="text-xs text-gray-500 font-medium">
                    VALIDEZ
                  </span>
                </div>
                <p className="font-semibold">
                  {license.expires_at
                    ? new Date(license.expires_at).toLocaleDateString()
                    : "Lifetime (Sin expiración)"}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-6 text-center text-gray-500">
            No se encontraron detalles de la licencia.
          </div>
        )}

        <div className="flex justify-end">
          <Button onClick={onClose}>Cerrar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
