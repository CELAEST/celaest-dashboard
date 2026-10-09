import React, { memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FileText, CaretUp, CaretDown, ShieldCheck, Copy } from "@phosphor-icons/react";
import { CustomerAsset } from "../../../types";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

interface UpdateItemChangelogProps {
  asset: CustomerAsset;
  isExpanded: boolean;
  onToggle: () => void;
}

export const UpdateItemChangelog: React.FC<UpdateItemChangelogProps> = memo(
  ({ asset, isExpanded, onToggle }) => {
    const { isDark } = useTheme();
    const t = useTranslations("releases");

    const copyChecksum = () => {
      if (asset.checksum) {
        navigator.clipboard.writeText(asset.checksum);
        toast.success("Checksum SHA-256 copiado al portapapeles", {
          description: asset.checksum,
        });
      }
    };

    if (!asset.hasUpdate) return null;

    return (
      <div
        className={`border-t ${isDark ? "border-white/6" : "border-gray-100"}`}
      >
        <button
          onClick={onToggle}
          className={`w-full px-4 sm:px-5 py-2.5 flex items-center justify-between transition-colors cursor-pointer ${
            isDark
              ? "hover:bg-white/[0.02] text-white/60 hover:text-white"
              : "hover:bg-gray-50 text-gray-600 hover:text-gray-900"
          }`}
        >
          <div className="flex items-center gap-2">
            <FileText size={13} />
            <span className="text-[11px] font-mono tracking-wider uppercase font-medium">
              {t("changelog_whats_new", { version: asset.latestVersion })}
            </span>
          </div>
          <div
            className={`p-1 rounded-md transition-colors ${
              isDark ? "hover:bg-white/5 text-white/40" : "hover:bg-gray-100 text-gray-500"
            }`}
          >
            {isExpanded ? <CaretUp size={13} /> : <CaretDown size={13} />}
          </div>
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden"
            >
              <div
                className={`px-4 sm:px-5 pb-4 border-t ${
                  isDark ? "border-white/6" : "border-gray-100"
                }`}
              >
                {/* Changes list */}
                <ul className="space-y-2 pt-3 mb-3.5">
                  {asset.changelog.map((change, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <div
                        className={`mt-[6px] w-1.5 h-1.5 rounded-full shrink-0 ${
                          isDark ? "bg-white/40" : "bg-gray-400"
                        }`}
                      />
                      <span
                        className={`text-xs leading-relaxed ${
                          isDark ? "text-zinc-300" : "text-gray-700"
                        }`}
                      >
                        {change}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Integrity verification */}
                <div
                  className={`flex items-center justify-between gap-3 p-3 rounded-lg border ${
                    isDark
                      ? "bg-white/[0.02] border-white/6"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <ShieldCheck
                      size={16}
                      className={`shrink-0 mt-0.5 ${
                        isDark ? "text-white/50" : "text-gray-600"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-[10px] font-mono uppercase tracking-wider mb-0.5 ${
                          isDark ? "text-white/50" : "text-gray-600"
                        }`}
                      >
                        {t("security_integrity_verify")}
                      </p>
                      <p
                        className={`text-[10px] font-mono break-all ${
                          isDark ? "text-white/40" : "text-gray-500"
                        }`}
                      >
                        {asset.checksum}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={copyChecksum}
                    title="Copiar Checksum"
                    className={`p-1.5 rounded-md border shrink-0 transition-colors cursor-pointer ${
                      isDark
                        ? "bg-white/[0.04] hover:bg-white/[0.08] border-white/8 text-white/60 hover:text-white"
                        : "bg-white hover:bg-gray-100 border-gray-200 text-gray-600 hover:text-gray-900 shadow-xs"
                    }`}
                  >
                    <Copy size={13} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  },
);

UpdateItemChangelog.displayName = "UpdateItemChangelog";
