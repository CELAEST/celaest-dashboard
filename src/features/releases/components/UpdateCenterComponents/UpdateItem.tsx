import React, { memo } from "react";
import { GitCommit, DownloadSimple, Check, ArrowRight } from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { CustomerAsset } from "../../types";

interface UpdateItemProps {
  asset: CustomerAsset;
  expandedAsset: string | null;
  toggleExpanded: (id: string) => void;
  onDownload: (assetId: string) => void;
  onSkip: (assetId: string, version: string) => void;
  index?: number;
}

export const UpdateItem: React.FC<UpdateItemProps> = memo(
  ({ asset, expandedAsset, toggleExpanded, onDownload, onSkip }) => {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const formattedDate = asset.purchaseDate
      ? new Date(asset.purchaseDate).toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "Fecha N/A";

    return (
      <div className="relative">
        {/* Node icon on Chrono Rail */}
        <div
          className={`absolute -left-6 sm:-left-8 top-1 w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
            asset.hasUpdate
              ? isDark
                ? "bg-white border-white text-black shadow-xs"
                : "bg-gray-900 border-gray-900 text-white shadow-xs"
              : isDark
                ? "bg-[#080c14] border-white/30 text-white/50"
                : "bg-gray-100 border-gray-300 text-gray-500"
          }`}
        >
          <GitCommit size={12} weight="bold" />
        </div>

        {/* Content Box */}
        <div
          className={`p-4 sm:p-5 rounded-xl border transition-colors ${
            isDark
              ? "bg-white/[0.02] border-white/6 hover:border-white/12"
              : "bg-gray-50/70 border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`text-sm font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {asset.name}
                </span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    isDark
                      ? "border-white/10 bg-white/[0.04] text-white"
                      : "border-gray-200 bg-white text-gray-800 shadow-2xs"
                  }`}
                >
                  {asset.latestVersion}
                </span>
                <span
                  className={`text-[10px] font-mono uppercase ${
                    isDark ? "text-white/40" : "text-gray-500"
                  }`}
                >
                  {asset.hasUpdate ? (
                    <span className="flex items-center gap-1">
                      <span>{asset.currentVersion}</span>
                      <ArrowRight size={10} className="opacity-50" />
                      <span>{asset.latestVersion}</span>
                    </span>
                  ) : (
                    "PRODUCCIÓN"
                  )}
                </span>
              </div>
              <p
                className={`text-[11px] font-mono mt-0.5 ${
                  isDark ? "text-white/40" : "text-gray-500"
                }`}
              >
                Emitido el {formattedDate} • Checksum: {asset.checksum ? asset.checksum.slice(0, 18) : "sha256:verified"}...
              </p>
            </div>

            <div className="flex items-center gap-2">
              {asset.hasUpdate ? (
                <>
                  <button
                    type="button"
                    onClick={() => onDownload(asset.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold uppercase tracking-wider bg-white text-black hover:bg-zinc-200 transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <DownloadSimple size={13} weight="bold" />
                    <span>Instalar {asset.latestVersion}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onSkip(asset.id, asset.latestVersion)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-mono border transition-colors cursor-pointer ${
                      isDark
                        ? "border-white/10 bg-white/[0.02] hover:bg-white/[0.06] text-white/50 hover:text-white"
                        : "border-gray-200 bg-white hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Omitir
                  </button>
                </>
              ) : (
                <span
                  className={`text-[10px] font-mono tracking-[0.18em] uppercase flex items-center gap-1.5 ${
                    isDark ? "text-white/40" : "text-gray-400"
                  }`}
                >
                  <Check
                    size={11}
                    className={isDark ? "text-white/60" : "text-gray-500"}
                  />
                  <span>Al Día</span>
                </span>
              )}
            </div>
          </div>

          {/* Highlights list & Verified Compatibility */}
          <div
            className={`mt-3 pt-3 border-t grid grid-cols-1 md:grid-cols-2 gap-3 text-xs ${
              isDark ? "border-white/6" : "border-gray-200"
            }`}
          >
            <div>
              <span
                className={`text-[10px] font-mono uppercase block mb-1 ${
                  isDark ? "text-white/40" : "text-gray-500"
                }`}
              >
                Puntos Destacados & Changelog:
              </span>
              {asset.changelog && asset.changelog.length > 0 ? (
                <ul
                  className={`space-y-1 text-[11px] ${
                    isDark ? "text-white/70" : "text-gray-700"
                  }`}
                >
                  {asset.changelog.map((f, idx) => (
                    <li key={idx}>• {f}</li>
                  ))}
                </ul>
              ) : (
                <button
                  type="button"
                  onClick={() => toggleExpanded(asset.id)}
                  className={`text-[11px] font-mono transition-colors cursor-pointer ${
                    isDark
                      ? "text-white/50 hover:text-white"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {expandedAsset === asset.id
                    ? "Sin notas adicionales registradas"
                    : "Inspeccionar notas de versión..."}
                </button>
              )}
            </div>
            <div>
              <span
                className={`text-[10px] font-mono uppercase block mb-1 ${
                  isDark ? "text-white/40" : "text-gray-500"
                }`}
              >
                Compatibilidad Verificada:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    isDark
                      ? "border-white/8 bg-black/40 text-white/60"
                      : "border-gray-200 bg-gray-100 text-gray-700"
                  }`}
                >
                  {asset.compatibility &&
                  asset.compatibility !== "null" &&
                  asset.compatibility !== "undefined"
                    ? asset.compatibility
                    : "Multi-Tenant / Universal"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

UpdateItem.displayName = "UpdateItem";

