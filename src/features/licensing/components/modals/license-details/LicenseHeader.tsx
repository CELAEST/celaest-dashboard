import React from "react";
import { X, User, Mail, Calendar } from "lucide-react";
import { useTheme } from "@/features/shared/hooks/useTheme";
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
  const { theme } = useTheme();
  const { isSuperAdmin } = useRole();
  const isDark = theme === "dark";

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString();
  };

  return (
    <div className="p-6 border-b shrink-0 space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2
              className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
            >
              {license.plan?.name || license.license_key.substring(0, 16)}
            </h2>
            <span
              className={`px-2 py-0.5 rounded text-xs font-medium border uppercase ${
                license.status === "active"
                  ? "bg-green-500/10 text-green-500 border-green-500/20"
                  : license.status === "expired"
                    ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                    : "bg-red-500/10 text-red-500 border-red-500/20"
              }`}
            >
              {license.status}
            </span>
          </div>

          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-gray-500 font-mono">
              ID: {license.id}
            </div>

            {(license.starts_at || license.expires_at) && (
              <div className="flex items-center gap-1.5 text-gray-500">
                <Calendar size={14} className="text-blue-500" />
                <span>
                  {formatDate(license.starts_at)} -{" "}
                  {formatDate(license.expires_at)}
                </span>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={onClose}
          className={`p-2 rounded-full transition-colors ${
            isDark
              ? "hover:bg-white/10 text-gray-400 hover:text-white"
              : "hover:bg-gray-100 text-gray-500 hover:text-gray-900"
          }`}
        >
          <X size={20} />
        </button>
      </div>

      {isSuperAdmin && (license.user_name || license.user_email) && (
        <div
          className={`flex flex-wrap gap-6 p-3 rounded-lg border ${
            isDark ? "bg-white/5 border-white/5" : "bg-gray-50 border-gray-100"
          }`}
        >
          <div className="flex items-center gap-2">
            <User size={14} className="text-purple-500" />
            <span
              className={`text-xs font-medium ${isDark ? "text-white/80" : "text-gray-700"}`}
            >
              Propietario: {license.user_name || "Desconocido"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Mail size={14} className="text-purple-500" />
            <span
              className={`text-xs ${isDark ? "text-white/60" : "text-gray-500"}`}
            >
              {license.user_email || "Sin correo"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
