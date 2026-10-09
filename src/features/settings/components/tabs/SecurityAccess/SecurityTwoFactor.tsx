import React, { memo, useState } from "react";
import { DeviceMobile, ShieldCheck, QrCode } from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { SettingsModal } from "../../SettingsModal";
import { useTranslations } from "next-intl";

interface SecurityTwoFactorProps {
  isEnabled: boolean;
  onEnable: () => void;
  onDisable: () => void;
}

export const SecurityTwoFactor: React.FC<SecurityTwoFactorProps> = memo(
  ({ isEnabled, onEnable, onDisable }) => {
    const { isDark } = useTheme();
    const [showModal, setShowModal] = useState(false);
    const t = useTranslations("settings");
    const tCommon = useTranslations("common");

    const handleToggle = () => {
      if (isEnabled) {
        onDisable();
      } else {
        setShowModal(true);
      }
    };

    const handleVerify = () => {
      onEnable();
      setShowModal(false);
    };

    return (
      <>
        <div className="settings-glass-card rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${
                  isDark ? "bg-white/[0.04] border-white/8 text-white/70" : "bg-gray-100 border-gray-200 text-gray-700"
                }`}
              >
                <DeviceMobile className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3
                    className={`text-base font-bold font-jakarta ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {t("two_factor_auth")}
                  </h3>
                  <div
                    onClick={handleToggle}
                    className={`settings-toggle-switch cursor-pointer ${
                      isEnabled ? "active" : ""
                    }`}
                  >
                    <div className="settings-toggle-thumb" />
                  </div>
                </div>
                <p
                  className={`text-xs font-mono mt-0.5 ${
                    isDark ? "text-white/50" : "text-gray-500"
                  }`}
                >
                  {t("two_factor_desc")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
              <span className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full border ${
                isDark ? "bg-white/[0.04] text-white/60 border-white/8" : "bg-gray-100 text-gray-800 border-gray-200"
              }`}>
                Hardware TOTP
              </span>
              <button
                type="button"
                onClick={handleToggle}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                  isEnabled
                    ? "bg-white text-black border-white shadow-xs"
                    : isDark
                      ? "bg-white/[0.04] text-white/70 border-white/8 hover:text-white hover:bg-white/[0.08]"
                      : "bg-gray-100 text-gray-700 border-gray-200"
                }`}
              >
                {isEnabled ? t("secured") : t("not_enabled")}
              </button>
            </div>
          </div>
        </div>

        <SettingsModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={t("enable_2fa")}
        >
          <div className="space-y-6">
            <div className="text-center">
              <p
                className={`text-xs font-mono mb-6 ${
                  isDark ? "text-white/50" : "text-gray-500"
                }`}
              >
                {t("scan_qr_desc")}
              </p>

              <div
                className={`inline-flex items-center justify-center p-6 rounded-2xl border mb-4 transition-colors ${
                  isDark
                    ? "bg-white border-white/10 shadow-lg"
                    : "bg-white border-gray-100 shadow-xl"
                }`}
              >
                <div className="w-44 h-44 flex items-center justify-center">
                  <QrCode className="w-36 h-36 text-gray-900" />
                </div>
              </div>

              <div
                className={`rounded-xl p-4 mb-4 border transition-colors ${
                  isDark
                    ? "bg-white/[0.02] border-white/[0.06]"
                    : "bg-gray-50 border-gray-100"
                }`}
              >
                <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1 font-mono">
                  {t("manual_entry_code")}
                </p>
                <code className={`font-mono text-base font-bold tracking-wider ${isDark ? "text-zinc-100" : "text-gray-900"}`}>
                  CELST-SECURE-KEY-2024
                </code>
              </div>
            </div>

            <div>
              <label
                className={`text-[10px] font-mono uppercase tracking-wider mb-2 block ${
                  isDark ? "text-white/40" : "text-gray-400"
                }`}
              >
                {t("verification_code")}
              </label>
              <input
                type="text"
                className="settings-input w-full rounded-xl px-4 py-3 text-center font-mono text-xl tracking-[0.5em] font-bold"
                placeholder="000000"
                maxLength={6}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setShowModal(false)}
                className={`flex-1 px-4 py-2.5 rounded-xl border text-xs font-jakarta font-semibold transition-all cursor-pointer ${
                  isDark
                    ? "border-white/8 bg-white/[0.04] text-white/80 hover:bg-white/[0.08] hover:text-white"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {tCommon("cancel")}
              </button>
              <button
                onClick={handleVerify}
                className="flex-1 px-4 py-2.5 rounded-xl bg-white text-zinc-900 font-jakarta font-semibold text-xs shadow-md hover:bg-neutral-200 transition-all cursor-pointer"
              >
                {t("verify_enable")}
              </button>
            </div>
          </div>
        </SettingsModal>
      </>
    );
  },
);

SecurityTwoFactor.displayName = "SecurityTwoFactor";
