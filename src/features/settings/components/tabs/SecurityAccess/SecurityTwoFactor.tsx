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
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-colors ${
                  isDark ? "bg-cyan-500/10" : "bg-cyan-50"
                }`}
              >
                <DeviceMobile
                  className={`w-6 h-6 ${
                    isDark ? "text-cyan-400" : "text-cyan-600"
                  }`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3
                  className={`text-lg font-bold mb-1 truncate ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {t("two_factor_auth")}
                </h3>
                <p
                  className={`text-sm mb-4 w-full ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {t("two_factor_desc")}
                </p>
                <div
                  onClick={handleToggle}
                  className={`settings-toggle-switch ${
                    isEnabled ? "active" : ""
                  }`}
                >
                  <div className="settings-toggle-thumb" />
                </div>
              </div>
            </div>
            <div
              className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest flex items-center gap-1.5 transition-all ${
                isEnabled
                  ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                  : isDark
                    ? "bg-gray-800 text-gray-500"
                    : "bg-gray-100 text-gray-400"
              }`}
            >
              {isEnabled && <ShieldCheck size={12} />}
              {isEnabled ? t("secured") : t("not_enabled")}
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
                className={`text-sm mb-6 ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {t("scan_qr_desc")}
              </p>

              <div
                className={`inline-flex items-center justify-center p-6 rounded-2xl border mb-4 transition-colors ${
                  isDark
                    ? "bg-white border-white/10 shadow-lg shadow-cyan-500/10"
                    : "bg-white border-gray-100 shadow-xl shadow-gray-200/50"
                }`}
              >
                <div className="w-44 h-44 flex items-center justify-center">
                  <QrCode className="w-36 h-36 text-gray-900" />
                </div>
              </div>

              <div
                className={`rounded-xl p-4 mb-4 border transition-colors ${
                  isDark
                    ? "bg-black border-white/5"
                    : "bg-gray-50 border-gray-100"
                }`}
              >
                <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1 font-bold">
                  {t("manual_entry_code")}
                </p>
                <code className="text-cyan-500 font-mono text-base font-black tracking-wider">
                  CELST-SECURE-KEY-2024
                </code>
              </div>
            </div>

            <div>
              <label
                className={`text-xs uppercase tracking-wider mb-2 block font-bold ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`}
              >
                {t("verification_code")}
              </label>
              <input
                type="text"
                className="settings-input w-full rounded-xl px-4 py-4 text-center font-mono text-2xl tracking-[0.5em] font-black"
                placeholder="000000"
                maxLength={6}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setShowModal(false)}
                className={`flex-1 px-4 py-3 rounded-xl border text-sm font-bold transition-all ${
                  isDark
                    ? "border-white/10 text-gray-300 hover:bg-white/5"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {tCommon("cancel")}
              </button>
              <button
                onClick={handleVerify}
                className="flex-1 px-4 py-3 rounded-xl bg-linear-to-r from-cyan-600 to-blue-600 text-white font-black shadow-lg shadow-cyan-500/20 active:scale-95 transition-all"
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
