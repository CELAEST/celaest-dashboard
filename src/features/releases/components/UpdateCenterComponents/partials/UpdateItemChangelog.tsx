import React, { memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FileText, CaretUp, CaretDown, ShieldCheck } from "@phosphor-icons/react";
import { CustomerAsset } from "../../../types";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useTranslations } from "next-intl";

interface UpdateItemChangelogProps {
  asset: CustomerAsset;
  isExpanded: boolean;
  onToggle: () => void;
}

export const UpdateItemChangelog: React.FC<UpdateItemChangelogProps> = memo(
  ({ asset, isExpanded, onToggle }) => {
    const { isDark } = useTheme();
    const t = useTranslations("releases");

    if (!asset.hasUpdate) return null;

    return (
      <div
        className={`border-t ${isDark ? "border-white/5" : "border-gray-100"}`}
      >
        <button
          onClick={onToggle}
          className={`w-full px-4 sm:px-5 py-3 flex items-center justify-between transition-colors ${
            isDark
              ? "hover:bg-white/[0.02] text-gray-400 hover:text-gray-200"
              : "hover:bg-gray-50 text-gray-500 hover:text-gray-800"
          }`}
        >
          <div className="flex items-center gap-2">
            <FileText size={14} weight="duotone" />
            <span className="text-xs font-semibold">
              {t("changelog_whats_new", { version: asset.latestVersion })}
            </span>
          </div>
          <div className={`p-1 rounded-md transition-colors ${
            isDark ? "hover:bg-white/5" : "hover:bg-gray-100"
          }`}>
            {isExpanded ? <CaretUp size={14} /> : <CaretDown size={14} />}
          </div>
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className={`px-4 sm:px-5 pb-4 border-t ${
                isDark ? "border-white/5" : "border-gray-100"
              }`}>
                {/* Changes list */}
                <ul className="space-y-2 pt-4 mb-4">
                  {asset.changelog.map((change, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <div
                        className={`mt-[7px] w-1.5 h-1.5 rounded-full shrink-0 ${
                          isDark ? "bg-cyan-400" : "bg-cyan-500"
                        }`}
                      />
                      <span
                        className={`text-xs sm:text-sm leading-relaxed ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {change}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Integrity verification */}
                <div
                  className={`flex items-start gap-2.5 p-3 rounded-lg border ${
                    isDark
                      ? "bg-emerald-500/5 border-emerald-500/15"
                      : "bg-emerald-50 border-emerald-100"
                  }`}
                >
                  <ShieldCheck
                    size={16}
                    weight="duotone"
                    className={`shrink-0 mt-0.5 ${
                      isDark ? "text-emerald-400" : "text-emerald-600"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${
                        isDark ? "text-emerald-400" : "text-emerald-700"
                      }`}
                    >
                      {t("security_integrity_verify")}
                    </p>
                    <p
                      className={`text-[11px] font-mono break-all ${
                        isDark ? "text-emerald-400/70" : "text-emerald-600/80"
                      }`}
                    >
                      {asset.checksum}
                    </p>
                  </div>
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
